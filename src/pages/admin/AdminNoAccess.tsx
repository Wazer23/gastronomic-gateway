import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminNoAccess = () => {
  const { signOut, user } = useAuth();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <ShieldOff className="h-12 w-12 text-secondary mx-auto mb-6" />
        <h1 className="font-display text-3xl text-foreground mb-3">Accès non autorisé</h1>
        <p className="text-muted-foreground mb-2">
          Le compte <span className="text-primary">{user?.email}</span> n'a pas encore de rôle attribué.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Demandez au propriétaire du restaurant de vous ajouter à l'équipe depuis le back-office.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={signOut}>Se déconnecter</Button>
          <Button asChild className="bg-primary text-primary-foreground"><Link to="/">Retour au site</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoAccess;