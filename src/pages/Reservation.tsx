import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import { CalendarDays, Clock, Users, Phone, Check } from "lucide-react";
import restaurantInterior from "@/assets/restaurant-interior.jpg";
import { useToast } from "@/hooks/use-toast";

const slots = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const Reservation = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", date: "", time: "", guests: "2", note: "",
  });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      toast({ title: "Champs manquants", description: "Veuillez compléter tous les champs requis.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Demande envoyée", description: "Nous vous confirmerons votre réservation très prochainement." });
  };

  return (
    <Layout>
      <section className="relative h-[50vh] min-h-[400px]">
        <img src={restaurantInterior} alt="" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-night/75" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-luxury">
          <p className="eyebrow mb-6 animate-fade-in">Réservation</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream animate-fade-in-up">
            Votre <span className="italic text-primary">table</span>
          </h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-luxury grid lg:grid-cols-3 gap-16">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="border border-primary/40 bg-card p-12 text-center animate-fade-in">
                <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-primary/10 border border-primary mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-3xl text-cream mb-4">Merci, {form.name.split(" ")[0]} !</h3>
                <p className="text-muted-foreground font-light leading-relaxed max-w-md mx-auto mb-8">
                  Votre demande de réservation pour <strong className="text-primary">{form.guests}</strong> personnes
                  le <strong className="text-primary">{form.date}</strong> à <strong className="text-primary">{form.time}</strong> a bien été enregistrée.
                  Nous vous confirmerons par téléphone ou e-mail dans les plus brefs délais.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", date: "", time: "", guests: "2", note: "" }); }} className="link-luxury text-primary text-xs uppercase tracking-luxury">
                  Faire une nouvelle réservation
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow mb-4">Réserver en ligne</p>
                <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
                  Choisissez votre <span className="italic text-primary">moment.</span>
                </h2>

                <form onSubmit={handle} className="space-y-6 mt-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="eyebrow block mb-2">Nom complet *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2">Téléphone *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow block mb-2">E-mail *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="eyebrow block mb-2"><CalendarDays className="w-3 h-3 inline mr-1" /> Date *</label>
                      <input required type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2"><Users className="w-3 h-3 inline mr-1" /> Convives *</label>
                      <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="eyebrow block mb-2"><Clock className="w-3 h-3 inline mr-1" /> Heure *</label>
                      <select required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors">
                        <option value="">— Choisir —</option>
                        {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow block mb-2">Demandes particulières</label>
                    <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={4} placeholder="Allergies, occasion spéciale, table en terrasse…" className="w-full bg-card border border-border focus:border-primary outline-none px-4 py-3 text-cream transition-colors resize-none" />
                  </div>

                  <button type="submit" className="w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold mt-4">
                    Confirmer ma demande
                  </button>
                  <p className="text-xs text-muted-foreground text-center font-light">
                    Vous recevrez une confirmation dans les plus brefs délais.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Aside téléphone */}
          <aside className="lg:sticky lg:top-32 h-fit">
            <div className="border border-primary/30 bg-card p-8">
              <Phone className="w-8 h-8 text-primary mb-4" />
              <p className="eyebrow mb-3">Réserver par téléphone</p>
              <h3 className="font-display text-3xl text-cream mb-4">
                Une attention <span className="italic text-primary">personnalisée.</span>
              </h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6">
                Pour les groupes, événements privés ou demandes particulières, notre équipe est à votre écoute.
              </p>
              <a href="tel:+33387000000" className="block bg-primary text-primary-foreground text-center py-3 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-colors mb-3">
                03 87 00 00 00
              </a>
              <div className="text-xs text-muted-foreground space-y-1 mt-6 pt-6 border-t border-border">
                <p className="font-medium text-cream">Horaires</p>
                <p>Mardi — Samedi</p>
                <p>12h — 14h · 19h — 22h</p>
                <p className="italic mt-2">Fermé dimanche & lundi</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Reservation;
