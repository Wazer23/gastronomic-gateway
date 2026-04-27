import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, ShoppingBag, Trash2, Check, Clock, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import burger from "@/assets/burger.jpg";
import { useMenuData, DbMenuItem } from "@/hooks/useMenuData";
import { supabase } from "@/integrations/supabase/client";

const ItemCard = ({ item, onAdd }: { item: DbMenuItem; onAdd: () => void }) => (
  <div className="group bg-card border border-border hover:border-primary/50 transition-all duration-500 overflow-hidden flex flex-col">
    {item.image_url && (
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image_url} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
    )}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h4 className="font-display text-xl text-cream group-hover:text-primary transition-colors">{item.name}</h4>
        <span className="font-display text-xl text-primary whitespace-nowrap">{Number(item.price)} €</span>
      </div>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 flex-1">{item.description}</p>
      <button onClick={onAdd} className="border border-border hover:border-primary hover:bg-primary hover:text-primary-foreground text-cream py-2.5 px-4 text-xs uppercase tracking-luxury transition-all duration-300 flex items-center justify-center gap-2">
        <Plus className="w-3 h-3" /> Ajouter
      </button>
    </div>
  </div>
);

const ClickCollect = () => {
  const { lines, add, setQty, remove, clear, count, total } = useCart();
  const { toast } = useToast();
  const { categories, items, loading } = useMenuData(true);
  const [activeCat, setActiveCat] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<{ name: string; pickup: string } | null>(null);
  const [info, setInfo] = useState({ name: "", email: "", phone: "", pickup: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!info.name || !info.email || !info.phone || !info.pickup) {
      toast({ title: "Informations manquantes", description: "Merci de compléter vos coordonnées et l'horaire.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: info.name,
        customer_email: info.email,
        customer_phone: info.phone,
        pickup_at: new Date(info.pickup).toISOString(),
        total,
        status: "received",
      })
      .select()
      .single();
    if (error || !order) {
      toast({ title: "Erreur", description: error?.message ?? "Impossible d'enregistrer la commande", variant: "destructive" });
      setSubmitting(false);
      return;
    }
    const { error: itemsErr } = await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        menu_item_id: l.item.id,
        item_name: l.item.name,
        unit_price: l.item.price,
        quantity: l.quantity,
      })),
    );
    if (itemsErr) {
      toast({ title: "Erreur", description: itemsErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    setConfirmed({ name: info.name, pickup: info.pickup });
    clear();
    setCartOpen(false);
    setInfo({ name: "", email: "", phone: "", pickup: "" });
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={burger} alt="" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-luxury">
          <p className="eyebrow mb-6 animate-fade-in">À emporter</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream animate-fade-in-up">
            Click <span className="italic text-primary">& Collect</span>
          </h1>
          <p className="text-cream/70 max-w-xl mt-6 font-light animate-fade-in" style={{ animationDelay: "300ms" }}>
            Notre cuisine chez vous. Composez votre commande, retirez-la sur place.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-luxury">
          {confirmed && (
            <div className="border border-primary bg-primary/5 p-8 mb-12 flex items-start gap-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl text-cream mb-2">Merci {confirmed.name} !</h3>
                <p className="text-muted-foreground font-light">
                  Votre commande est confirmée. Retrait prévu à <strong className="text-primary">{confirmed.pickup}</strong>.
                  Nous vous attendons !
                </p>
              </div>
              <button onClick={() => setConfirmed(null)} className="text-muted-foreground hover:text-primary"><X className="w-5 h-5" /></button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* Catégories */}
              <div className="flex flex-wrap gap-2 justify-center mb-12 sticky top-20 bg-background/80 backdrop-blur-md py-4 z-30 -mx-6 px-6 border-b border-border/30">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCat(c.slug);
                      document.getElementById(`cat-${c.slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`px-5 py-2 text-xs uppercase tracking-luxury transition-all duration-300 ${
                      activeCat === c.slug ? "bg-primary text-primary-foreground" : "border border-border text-cream/80 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {categories.map((c) => {
                const catItems = items.filter((i) => i.category_id === c.id);
                if (catItems.length === 0) return null;
                return (
                  <div key={c.id} id={`cat-${c.slug}`} className="mb-20 scroll-mt-40">
                    <Ornament label={c.label} />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                      {catItems.map((it) => (
                        <ItemCard
                          key={it.id}
                          item={it}
                          onAdd={() => {
                            add({ id: it.id, name: it.name, price: Number(it.price), image_url: it.image_url });
                            toast({ title: "Ajouté au panier", description: it.name });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* Floating cart button */}
      {count > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-primary text-primary-foreground px-6 py-4 shadow-gold hover:bg-primary-glow transition-all duration-300 flex items-center gap-3 animate-fade-in"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs uppercase tracking-luxury">{count} article{count > 1 ? "s" : ""} · {total.toFixed(2)} €</span>
        </button>
      )}

      {/* Cart drawer */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-night-deep/80 transition-opacity duration-500 ${cartOpen ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute top-0 right-0 h-full w-full max-w-md bg-card border-l border-border transition-transform duration-500 flex flex-col ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="font-display text-2xl text-cream">Votre commande</h3>
            <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-primary"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {lines.length === 0 ? (
              <p className="text-muted-foreground text-center font-light italic mt-12">Votre panier est vide.</p>
            ) : (
              lines.map((l) => (
                <div key={l.item.id} className="flex gap-4 pb-4 border-b border-border/50">
                  <div className="flex-1">
                    <p className="font-display text-lg text-cream">{l.item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{l.item.price.toFixed(2)} € l'unité</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => setQty(l.item.id, l.quantity - 1)} className="w-8 h-8 border border-border hover:border-primary text-cream flex items-center justify-center transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-cream w-6 text-center">{l.quantity}</span>
                      <button onClick={() => setQty(l.item.id, l.quantity + 1)} className="w-8 h-8 border border-border hover:border-primary text-cream flex items-center justify-center transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => remove(l.item.id)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-lg text-primary whitespace-nowrap">{(l.quantity * l.item.price).toFixed(2)} €</p>
                </div>
              ))
            )}
          </div>

          {lines.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-3">
                <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} placeholder="Nom complet *" className="w-full bg-background border border-border focus:border-primary outline-none px-4 py-3 text-cream text-sm transition-colors" />
                <input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} type="tel" placeholder="Téléphone *" className="w-full bg-background border border-border focus:border-primary outline-none px-4 py-3 text-cream text-sm transition-colors" />
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input value={info.pickup} onChange={(e) => setInfo({ ...info, pickup: e.target.value })} type="datetime-local" min={new Date().toISOString().slice(0, 16)} className="w-full bg-background border border-border focus:border-primary outline-none pl-12 pr-4 py-3 text-cream text-sm transition-colors" />
                </div>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="eyebrow">Total</span>
                <span className="font-display text-3xl text-primary">{total.toFixed(2)} €</span>
              </div>
              <button onClick={handleConfirm} className="w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold">
                Valider ma commande
              </button>
              <p className="text-[10px] text-center text-muted-foreground font-light">
                Paiement sur place lors du retrait. Préparation : env. 30 min.
              </p>
            </div>
          )}
        </aside>
      </div>
    </Layout>
  );
};

export default ClickCollect;
