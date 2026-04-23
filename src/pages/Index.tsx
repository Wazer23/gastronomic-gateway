import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Wheat, UtensilsCrossed } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import heroSteak from "@/assets/hero-steak.jpg";
import beefAged from "@/assets/beef-aged.jpg";
import pastaFresh from "@/assets/pasta-fresh.jpg";
import restaurantInterior from "@/assets/restaurant-interior.jpg";
import burger from "@/assets/burger.jpg";
import dessert from "@/assets/dessert.jpg";

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <img
          src={heroSteak}
          alt="Pièce de bœuf maturée saisie"
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night" />

        <div className="relative z-10 h-full flex-col text-center container-luxury pt-24 md:pt-20 flex items-center justify-start">
          <p className="eyebrow mb-6 animate-fade-in mt-8 md:mt-0 my-[30px]" style={{ animationDelay: "200ms" }}>
            Restaurant · Ay-sur-Moselle
          </p>
          <h1
            className="font-display text-cream text-6xl md:text-8xl lg:text-9xl leading-[0.95] mb-8 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            Le Bœuf
            <span className="block italic text-primary font-light">& l'Épi</span>
          </h1>
          <Ornament />
          <p
            className="max-w-2xl text-lg md:text-xl text-cream/80 font-light leading-relaxed animate-fade-in mb-[40px]"
            style={{ animationDelay: "700ms" }}
          >
            Belles viandes maturées, pâtes fraîches artisanales et cuisine du moment.
            Une table où l'on prend le temps des belles choses.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "900ms" }}
          >
            <Link
              to="/reservation"
              className="group bg-primary text-primary-foreground px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold flex items-center justify-center gap-3"
            >
              Réserver une table
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/click-and-collect"
              className="group border border-cream/30 text-cream px-10 py-4 text-xs uppercase tracking-luxury hover:border-primary hover:text-primary transition-all duration-500 flex items-center justify-center gap-3"
            >
              Click & Collect
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-float">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
        </div>
      </section>

      {/* PHILOSOPHIE */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />
        <div className="container-luxury relative">
          <div className="max-w-3xl mx-auto text-center reveal">
            <p className="eyebrow mb-6">Notre philosophie</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream mb-8 leading-tight">
              Les bons produits<br />
              <span className="italic text-primary">font les bons plats.</span>
            </h2>
            <Ornament />
            <p className="text-lg text-muted-foreground leading-loose font-light mt-8">
              Chez nous, chaque produit, même le plus simple, fait l'objet d'une sélection exigeante.
              Nous travaillons des viandes maturées avec le plus grand soin, des pâtes fraîches façonnées
              à la main chaque matin, et des produits de saison choisis auprès d'artisans passionnés.
            </p>
          </div>
        </div>
      </section>

      {/* TROIS PILIERS */}
      <section className="py-24 bg-night-deep">
        <div className="container-luxury grid md:grid-cols-3 gap-12">
          {[
            { icon: ChefHat, title: "Cuisine maison", text: "Tout est préparé sur place, chaque jour, avec exigence et passion." },
            { icon: Wheat, title: "Pâtes fraîches", text: "Façonnées à la main le matin même avec une farine sélectionnée." },
            { icon: UtensilsCrossed, title: "Viandes maturées", text: "Sélection rigoureuse de pièces nobles, maturation jusqu'à 35 jours." },
          ].map((p, i) => (
            <div
              key={p.title}
              className="text-center reveal group"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 border border-primary/30 rounded-full mb-6 group-hover:border-primary group-hover:shadow-gold transition-all duration-700">
                <p.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-2xl text-cream mb-3">{p.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURES — Mosaïque */}
      <section className="py-32 bg-background">
        <div className="container-luxury">
          <div className="text-center mb-20 reveal">
            <p className="eyebrow mb-6">Nos signatures</p>
            <h2 className="font-display text-4xl md:text-6xl text-cream mb-4">
              L'art de la table<span className="italic text-primary">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {[
              { img: beefAged, title: "Viandes maturées", subtitle: "Black Angus 35 jours", span: "md:col-span-7 md:row-span-2 aspect-[4/5]" },
              { img: pastaFresh, title: "Pâtes fraîches", subtitle: "Façonnées chaque matin", span: "md:col-span-5 aspect-[5/4]" },
              { img: burger, title: "Burgers signature", subtitle: "Pain brioché maison", span: "md:col-span-3 aspect-square" },
              { img: dessert, title: "Pâtisseries", subtitle: "Créations du chef", span: "md:col-span-2 aspect-square" },
            ].map((c) => (
              <div key={c.title} className={`card-luxury reveal ${c.span} relative`}>
                <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <p className="eyebrow mb-2">{c.subtitle}</p>
                  <h3 className="font-display text-3xl md:text-4xl text-cream">{c.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 reveal">
            <Link to="/carte" className="link-luxury text-primary text-xs uppercase tracking-luxury inline-flex items-center gap-3">
              Découvrir la carte complète <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* RESTAURANT — Image full */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <img
          src={restaurantInterior}
          alt="Salle du restaurant"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-night/60" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-luxury">
            <div className="max-w-xl reveal">
              <p className="eyebrow mb-6">Le Restaurant</p>
              <h2 className="font-display text-5xl md:text-7xl text-cream mb-8 leading-tight">
                Une parenthèse<br />
                <span className="italic text-primary">hors du temps.</span>
              </h2>
              <p className="text-cream/80 text-lg font-light leading-relaxed mb-10">
                Une atmosphère intime et chaleureuse, pour un moment de plaisir gustatif,
                de détente et de convivialité.
              </p>
              <Link
                to="/restaurant"
                className="group inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary hover:text-primary-foreground transition-all duration-500"
              >
                Découvrir notre maison
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA RÉSERVATION */}
      <section className="py-32 bg-night-deep relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold" />
        <div className="container-luxury relative text-center reveal">
          <p className="eyebrow mb-6">Votre table vous attend</p>
          <h2 className="font-display text-5xl md:text-7xl text-cream mb-8">
            Réservez votre<br />
            <span className="italic text-primary">moment d'exception.</span>
          </h2>
          <Ornament />
          <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light mb-12 mt-6">
            En ligne en quelques secondes, ou par téléphone pour une attention personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="bg-primary text-primary-foreground px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold"
            >
              Réserver en ligne
            </Link>
            <a
              href="tel:+33387000000"
              className="border border-cream/30 text-cream px-10 py-4 text-xs uppercase tracking-luxury hover:border-primary hover:text-primary transition-all duration-500"
            >
              03 87 00 00 00
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
