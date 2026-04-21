import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck, ShoppingBag, Euro, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

type Stats = {
  resaToday: number;
  resaPending: number;
  ordersToday: number;
  ordersPending: number;
  revenueToday: number;
  recentReservations: any[];
  recentOrders: any[];
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split("T")[0];
      const [resaToday, resaPending, ordersToday, recentResa, recentOrd] = await Promise.all([
        supabase.from("reservations").select("id", { count: "exact", head: true }).eq("reservation_date", today),
        supabase.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id, total, status").gte("created_at", `${today}T00:00:00Z`),
        supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const ords = ordersToday.data ?? [];
      setStats({
        resaToday: resaToday.count ?? 0,
        resaPending: resaPending.count ?? 0,
        ordersToday: ords.length,
        ordersPending: ords.filter((o) => o.status === "received" || o.status === "preparing").length,
        revenueToday: ords.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0),
        recentReservations: recentResa.data ?? [],
        recentOrders: recentOrd.data ?? [],
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Réservations aujourd'hui", value: stats?.resaToday ?? "…", icon: CalendarCheck, hint: `${stats?.resaPending ?? 0} en attente`, to: "/admin/reservations" },
    { label: "Commandes aujourd'hui", value: stats?.ordersToday ?? "…", icon: ShoppingBag, hint: `${stats?.ordersPending ?? 0} à préparer`, to: "/admin/orders" },
    { label: "CA du jour", value: stats ? `${stats.revenueToday.toFixed(2)} €` : "…", icon: Euro, hint: "Click & Collect", to: "/admin/orders" },
    { label: "Couverts du jour", value: stats?.recentReservations.filter((r) => r.reservation_date === new Date().toISOString().split("T")[0]).reduce((s, r) => s + r.guests, 0) ?? "…", icon: Users2, hint: "Toutes réservations", to: "/admin/reservations" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="eyebrow">Tableau de bord</p>
          <h1 className="font-display text-4xl text-foreground mt-2">Vue d'ensemble</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((c) => (
            <Link key={c.label} to={c.to}>
              <Card className="p-5 bg-card/50 border-border hover:border-primary/50 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-display text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                <p className="text-[11px] text-primary/70 mt-2">{c.hint}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 border-border">
            <h3 className="font-display text-xl text-foreground mb-4">Dernières réservations</h3>
            <div className="space-y-3">
              {(stats?.recentReservations ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune pour l'instant.</p>
              )}
              {stats?.recentReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-foreground">{r.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.reservation_date).toLocaleDateString("fr-FR")} · {r.reservation_time?.slice(0, 5)} · {r.guests} couv.</p>
                  </div>
                  <Badge variant={r.status === "pending" ? "secondary" : "outline"}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 bg-card/50 border-border">
            <h3 className="font-display text-xl text-foreground mb-4">Dernières commandes</h3>
            <div className="space-y-3">
              {(stats?.recentOrders ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune pour l'instant.</p>
              )}
              {stats?.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-foreground">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">Retrait {new Date(o.pickup_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-medium">{Number(o.total).toFixed(2)} €</p>
                    <Badge variant="outline" className="text-[10px]">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;