import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Trash2, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Member = { id: string; email: string; full_name: string | null; roles: string[] };

const AdminTeam = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [pRes, rRes] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const profiles = pRes.data ?? [];
    const roles = rRes.data ?? [];
    const merged: Member[] = profiles.map((p) => ({
      id: p.id,
      email: p.email ?? "",
      full_name: p.full_name,
      roles: roles.filter((r) => r.user_id === p.id).map((r) => r.role),
    }));
    setMembers(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (memberId: string, role: "admin" | "staff" | "none") => {
    // remove existing admin/staff roles (preserve owner)
    const { error: delErr } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", memberId)
      .in("role", ["admin", "staff"]);
    if (delErr) return toast.error(delErr.message);
    if (role !== "none") {
      const { error } = await supabase.from("user_roles").insert({ user_id: memberId, role });
      if (error) return toast.error(error.message);
    }
    toast.success("Rôle mis à jour");
    load();
  };

  return (
    <>
      <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow">Gestion des accès</p>
          <h1 className="font-display text-4xl text-foreground mt-2">Équipe</h1>
        </div>

        <Card className="p-5 bg-primary/5 border-primary/30 mb-6 flex gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground mb-1">Comment ajouter un membre ?</p>
            <p className="text-muted-foreground">Demandez à votre collaborateur de créer un compte sur <span className="text-primary">/admin/login</span>. Il apparaîtra ici, puis vous lui attribuerez un rôle.</p>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-3">
            {members.map((m) => {
              const isOwner = m.roles.includes("owner");
              const isMe = m.id === user?.id;
              const currentRole = isOwner ? "owner" : m.roles.includes("admin") ? "admin" : m.roles.includes("staff") ? "staff" : "none";
              return (
                <Card key={m.id} className="p-4 bg-card/50 border-border flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{m.full_name || m.email}</p>
                    <p className="text-xs text-muted-foreground">{m.email}{isMe && " · Vous"}</p>
                  </div>
                  {isOwner ? (
                    <Badge className="bg-primary text-primary-foreground">Propriétaire</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Select value={currentRole} onValueChange={(v) => setRole(m.id, v as any)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="none">Aucun accès</SelectItem>
                          <SelectItem value="staff">Staff (lecture)</SelectItem>
                          <SelectItem value="admin">Admin (modif)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTeam;