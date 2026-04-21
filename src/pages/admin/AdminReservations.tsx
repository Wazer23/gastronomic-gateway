import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Phone, Mail, Calendar, Users, MessageSquare, Check, X } from "lucide-react";

type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  note: string | null;
  status: "pending" | "confirmed" | "declined" | "cancelled" | "completed";
  created_at: string;
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  declined: "Refusée",
  cancelled: "Annulée",
  completed: "Terminée",
};

const AdminReservations = () => {
  const [list, setList] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true });
    if (error) toast.error(error.message);
    setList((data as Reservation[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Statut mis à jour");
    setList((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const filtered = filter === "all" ? list : list.filter((r) => r.status === filter);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow">Demandes de table</p>
          <h1 className="font-display text-4xl text-foreground mt-2">Réservations</h1>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-card/50">
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
            <TabsTrigger value="declined">Refusées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center bg-card/50 border-border">
            <p className="text-muted-foreground">Aucune réservation dans cette catégorie.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <Card key={r.id} className="p-5 bg-card/50 border-border">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-display text-xl text-foreground">{r.customer_name}</p>
                      <Badge variant={r.status === "pending" ? "secondary" : r.status === "confirmed" ? "default" : "outline"}>{statusLabels[r.status]}</Badge>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(r.reservation_date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short" })} · {r.reservation_time.slice(0, 5)}</div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{r.guests} couverts</div>
                      <a href={`tel:${r.customer_phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />{r.customer_phone}</a>
                      <a href={`mailto:${r.customer_email}`} className="flex items-center gap-2 hover:text-primary truncate"><Mail className="h-4 w-4 text-primary" />{r.customer_email}</a>
                    </div>
                    {r.note && (
                      <div className="flex items-start gap-2 mt-3 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                        <p className="italic">{r.note}</p>
                      </div>
                    )}
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(r.id, "confirmed")} className="bg-primary text-primary-foreground">
                        <Check className="h-4 w-4 mr-1" />Confirmer
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "declined")}>
                        <X className="h-4 w-4 mr-1" />Refuser
                      </Button>
                    </div>
                  )}
                  {r.status === "confirmed" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "completed")}>Marquer comme servie</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;