import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, X, CalendarOff } from "lucide-react";

const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

type Hour = {
  id: string;
  day_of_week: number;
  is_closed: boolean;
  lunch_open: string | null;
  lunch_close: string | null;
  dinner_open: string | null;
  dinner_close: string | null;
};

type Closed = { id: string; date: string; reason: string | null };

const AdminHours = () => {
  const [hours, setHours] = useState<Hour[]>([]);
  const [closed, setClosed] = useState<Closed[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");

  const load = async () => {
    setLoading(true);
    const [hRes, cRes] = await Promise.all([
      supabase.from("opening_hours").select("*").order("day_of_week"),
      supabase.from("closed_dates").select("*").order("date"),
    ]);
    setHours((hRes.data as Hour[]) ?? []);
    setClosed((cRes.data as Closed[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateHour = (id: string, patch: Partial<Hour>) => {
    setHours((p) => p.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const saveHour = async (h: Hour) => {
    const { error } = await supabase.from("opening_hours").update({
      is_closed: h.is_closed,
      lunch_open: h.lunch_open || null,
      lunch_close: h.lunch_close || null,
      dinner_open: h.dinner_open || null,
      dinner_close: h.dinner_close || null,
    }).eq("id", h.id);
    if (error) return toast.error(error.message);
    toast.success(`${days[h.day_of_week]} mis à jour`);
  };

  const addClosed = async () => {
    if (!newDate) return;
    const { error } = await supabase.from("closed_dates").insert({ date: newDate, reason: newReason || null });
    if (error) return toast.error(error.message);
    setNewDate(""); setNewReason("");
    toast.success("Fermeture ajoutée");
    load();
  };

  const removeClosed = async (id: string) => {
    const { error } = await supabase.from("closed_dates").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setClosed((p) => p.filter((c) => c.id !== id));
  };

  // Re-order so Monday is first
  const orderedDays = [1, 2, 3, 4, 5, 6, 0];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="eyebrow">Disponibilité du restaurant</p>
          <h1 className="font-display text-4xl text-foreground mt-2">Horaires & fermetures</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 bg-card/50 border-border">
              <h2 className="font-display text-xl text-primary mb-5">Horaires hebdomadaires</h2>
              <div className="space-y-4">
                {orderedDays.map((d) => {
                  const h = hours.find((x) => x.day_of_week === d);
                  if (!h) return null;
                  return (
                    <div key={h.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-foreground w-28">{days[d]}</p>
                        <div className="flex items-center gap-2">
                          <Switch checked={!h.is_closed} onCheckedChange={(v) => updateHour(h.id, { is_closed: !v })} />
                          <span className="text-xs text-muted-foreground">{h.is_closed ? "Fermé" : "Ouvert"}</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => saveHour(h)}>Enregistrer</Button>
                      </div>
                      {!h.is_closed && (
                        <div className="grid grid-cols-2 gap-3 pl-0 lg:pl-28 text-xs">
                          <div>
                            <Label className="text-xs text-muted-foreground">Midi</Label>
                            <div className="flex gap-2 mt-1">
                              <Input type="time" value={h.lunch_open ?? ""} onChange={(e) => updateHour(h.id, { lunch_open: e.target.value })} />
                              <Input type="time" value={h.lunch_close ?? ""} onChange={(e) => updateHour(h.id, { lunch_close: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Soir</Label>
                            <div className="flex gap-2 mt-1">
                              <Input type="time" value={h.dinner_open ?? ""} onChange={(e) => updateHour(h.id, { dinner_open: e.target.value })} />
                              <Input type="time" value={h.dinner_close ?? ""} onChange={(e) => updateHour(h.id, { dinner_close: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-border h-fit">
              <h2 className="font-display text-xl text-primary mb-5 flex items-center gap-2"><CalendarOff className="h-5 w-5" />Fermetures exceptionnelles</h2>
              <div className="space-y-3 mb-5">
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Motif (optionnel)</Label>
                  <Input placeholder="Vacances, événement privé…" value={newReason} onChange={(e) => setNewReason(e.target.value)} />
                </div>
                <Button onClick={addClosed} disabled={!newDate} className="w-full bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                {closed.length === 0 && <p className="text-xs text-muted-foreground">Aucune fermeture programmée.</p>}
                {closed.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-foreground">{new Date(c.date).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</p>
                      {c.reason && <p className="text-xs text-muted-foreground italic">{c.reason}</p>}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeClosed(c.id)}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHours;