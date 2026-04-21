import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { z } from "zod";

type Category = { id: string; slug: string; label: string };
type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  display_order: number;
};

const itemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.number().min(0).max(999),
  category_id: z.string().uuid(),
});

const AdminMenu = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    available: true,
    image_url: "",
  });

  const load = async () => {
    setLoading(true);
    const [cRes, iRes] = await Promise.all([
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ]);
    setCats(cRes.data ?? []);
    setItems(iRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", category_id: cats[0]?.id ?? "", available: true, image_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (it: MenuItem) => {
    setEditing(it);
    setForm({
      name: it.name,
      description: it.description ?? "",
      price: String(it.price),
      category_id: it.category_id,
      available: it.available,
      image_url: it.image_url ?? "",
    });
    setDialogOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("menu-photos").upload(path, file, { upsert: false });
    if (error) {
      toast.error("Upload impossible : " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("menu-photos").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    const parsed = itemSchema.safeParse({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      category_id: form.category_id,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    const payload = {
      ...parsed.data,
      description: form.description,
      image_url: form.image_url || null,
      available: form.available,
    };
    if (editing) {
      const { error } = await supabase.from("menu_items").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Plat modifié");
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Plat ajouté");
    }
    setDialogOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", deleteId);
    if (error) return toast.error(error.message);
    toast.success("Plat supprimé");
    setDeleteId(null);
    load();
  };

  const toggleAvailable = async (it: MenuItem) => {
    const { error } = await supabase.from("menu_items").update({ available: !it.available }).eq("id", it.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, available: !p.available } : p)));
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">Carte du restaurant</p>
            <h1 className="font-display text-4xl text-foreground mt-2">Gestion des plats</h1>
          </div>
          <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1" /> Ajouter un plat
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="space-y-10">
            {cats.map((c) => (
              <div key={c.id}>
                <h2 className="font-display text-2xl text-primary mb-4">{c.label}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.filter((i) => i.category_id === c.id).map((it) => (
                    <Card key={it.id} className="p-4 bg-card/50 border-border flex gap-4">
                      <div className="w-20 h-20 rounded-md bg-muted/50 overflow-hidden flex items-center justify-center shrink-0">
                        {it.image_url ? (
                          <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground truncate">{it.name}</p>
                          <p className="text-primary font-display">{Number(it.price).toFixed(2)} €</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{it.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Switch checked={it.available} onCheckedChange={() => toggleAvailable(it)} />
                            <span className="text-xs text-muted-foreground">{it.available ? "Dispo" : "Indispo"}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteId(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {items.filter((i) => i.category_id === c.id).length === 0 && (
                    <p className="text-sm text-muted-foreground italic col-span-full">Aucun plat dans cette catégorie.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-primary">{editing ? "Modifier le plat" : "Nouveau plat"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input type="number" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-3">
                {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 object-cover rounded-md" />}
                <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
              <Label>Disponible à la commande</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground">{editing ? "Modifier" : "Ajouter"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce plat ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est définitive.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminMenu;