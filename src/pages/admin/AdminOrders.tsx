import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Phone, Mail, Clock, ChefHat, PackageCheck, Check } from "lucide-react";

type OrderItem = { id: string; item_name: string; quantity: number; unit_price: number };
type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_at: string;
  total: number;
  status: "received" | "preparing" | "ready" | "collected" | "cancelled";
  note: string | null;
  created_at: string;
  order_items: OrderItem[];
};

const statusLabels: Record<string, string> = {
  received: "Reçue",
  preparing: "En préparation",
  ready: "Prête",
  collected: "Retirée",
  cancelled: "Annulée",
};

const AdminOrders = () => {
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("pickup_at", { ascending: true });
    if (error) toast.error(error.message);
    setList((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setList((p) => p.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Statut mis à jour");
  };

  const filtered = list.filter((o) => {
    if (filter === "active") return ["received", "preparing", "ready"].includes(o.status);
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="eyebrow">Click & Collect</p>
          <h1 className="font-display text-4xl text-foreground mt-2">Commandes</h1>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-card/50">
            <TabsTrigger value="active">Actives</TabsTrigger>
            <TabsTrigger value="collected">Retirées</TabsTrigger>
            <TabsTrigger value="all">Toutes</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center bg-card/50 border-border"><p className="text-muted-foreground">Aucune commande.</p></Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <Card key={o.id} className="p-5 bg-card/50 border-border">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-display text-xl text-foreground">{o.customer_name}</p>
                      <Badge variant={o.status === "received" ? "secondary" : "outline"}>{statusLabels[o.status]}</Badge>
                      <p className="ml-auto text-primary font-display text-xl">{Number(o.total).toFixed(2)} €</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Retrait {new Date(o.pickup_at).toLocaleString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      <a href={`tel:${o.customer_phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />{o.customer_phone}</a>
                      <a href={`mailto:${o.customer_email}`} className="flex items-center gap-2 hover:text-primary truncate"><Mail className="h-4 w-4 text-primary" />{o.customer_email}</a>
                    </div>
                    <div className="border-t border-border pt-3 space-y-1">
                      {o.order_items?.map((it) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{it.quantity}× {it.item_name}</span>
                          <span className="text-muted-foreground">{(Number(it.unit_price) * it.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    {o.status === "received" && (
                      <Button size="sm" onClick={() => updateStatus(o.id, "preparing")} className="bg-primary text-primary-foreground"><ChefHat className="h-4 w-4 mr-1" />En préparation</Button>
                    )}
                    {o.status === "preparing" && (
                      <Button size="sm" onClick={() => updateStatus(o.id, "ready")} className="bg-primary text-primary-foreground"><PackageCheck className="h-4 w-4 mr-1" />Prête</Button>
                    )}
                    {o.status === "ready" && (
                      <Button size="sm" onClick={() => updateStatus(o.id, "collected")} className="bg-primary text-primary-foreground"><Check className="h-4 w-4 mr-1" />Retirée</Button>
                    )}
                    {["received", "preparing"].includes(o.status) && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(o.id, "cancelled")}>Annuler</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;