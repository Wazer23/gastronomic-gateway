import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(6, "6 caractères minimum").max(100),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Compte créé. Connexion en cours…");
        const { error: e2 } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (e2) toast.error(e2.message);
        else navigate("/admin");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) toast.error(error.message);
      else navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <p className="eyebrow">Le Bœuf & l'Épi</p>
          <p className="font-display text-4xl text-primary mt-2">Back-office</p>
        </Link>
        <Card className="p-8 bg-card/50 border-border">
          <h1 className="font-display text-2xl text-foreground mb-6">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <form onSubmit={handle} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer le compte"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs text-muted-foreground hover:text-primary mt-6 w-full text-center"
          >
            {mode === "login" ? "Premier accès ? Créer le compte propriétaire" : "Déjà un compte ? Se connecter"}
          </button>
        </Card>
        <p className="text-xs text-muted-foreground text-center mt-6">
          Le tout premier compte créé devient automatiquement <span className="text-primary">propriétaire</span>.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;