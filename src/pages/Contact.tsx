import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import restaurantInterior from "@/assets/restaurant-interior.jpg";

const Contact = () => (
  <Layout>
    <section className="relative h-[50vh] min-h-[400px]">
      <img src={restaurantInterior} alt="" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-luxury">
        <p className="eyebrow mb-6 animate-fade-in">Nous trouver</p>
        <h1 className="font-display text-5xl md:text-7xl text-cream animate-fade-in-up">
          <span className="italic text-primary">Contact</span>
        </h1>
      </div>
    </section>

    <section className="py-24 bg-background">
      <div className="container-luxury max-w-5xl">
        <div className="text-center reveal mb-16">
          <Ornament label="Une question ? Une demande ?" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: MapPin, title: "Adresse", lines: ["Ay-sur-Moselle", "57300 — Moselle"] },
            { icon: Phone, title: "Téléphone", lines: ["03 87 00 00 00"], href: "tel:+33387000000" },
            { icon: Mail, title: "E-mail", lines: ["contact@leboeufetlepi.com"], href: "mailto:contact@leboeufetlepi.com" },
            { icon: Clock, title: "Horaires", lines: ["Mardi — Samedi", "12h — 14h · 19h — 22h", "Fermé dimanche & lundi"] },
          ].map((c, i) => {
            const Inner = (
              <>
                <c.icon className="w-8 h-8 text-primary mb-6" />
                <p className="eyebrow mb-3">{c.title}</p>
                <div className="text-cream font-light space-y-1">
                  {c.lines.map((l) => <p key={l}>{l}</p>)}
                </div>
              </>
            );
            return c.href ? (
              <a key={c.title} href={c.href} className="border border-border hover:border-primary bg-card p-8 transition-all duration-500 hover:shadow-gold reveal block" style={{ transitionDelay: `${i * 80}ms` }}>
                {Inner}
              </a>
            ) : (
              <div key={c.title} className="border border-border bg-card p-8 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                {Inner}
              </div>
            );
          })}
        </div>

        <div className="mt-16 reveal">
          <iframe
            title="Localisation Le Bœuf et l'Épi"
            src="https://www.openstreetmap.org/export/embed.html?bbox=6.18%2C49.21%2C6.22%2C49.23&layer=mapnik&marker=49.22%2C6.20"
            className="w-full h-[450px] border border-border grayscale"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;
