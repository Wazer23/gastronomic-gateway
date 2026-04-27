import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import { Link } from "react-router-dom";
import restaurantInterior from "@/assets/restaurant-interior.jpg";
import beefAged from "@/assets/beef-aged.jpg";
import pastaFresh from "@/assets/pasta-fresh.jpg";

const Restaurant = () => (
  <Layout>
    {/* Hero */}
    <section className="relative h-[70vh] min-h-[500px]">
      <img src={restaurantInterior} alt="Le restaurant" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-luxury">
        <p className="eyebrow mb-6 animate-fade-in">Notre maison</p>
        <h1 className="font-display text-5xl md:text-7xl text-cream animate-fade-in-up">
          Le <span className="italic text-primary">Restaurant</span>
        </h1>
      </div>
    </section>

    {/* Histoire */}
    <section className="py-32 bg-background">
      <div className="container-luxury max-w-4xl">
        <div className="text-center reveal">
          <p className="eyebrow mb-6">Notre histoire</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
            Une cuisine sincère,<br />
            <span className="italic text-primary">faite avec passion.</span>
          </h2>
          <Ornament />
        </div>
        <div className="space-y-8 text-lg text-muted-foreground font-light leading-loose mt-12 reveal">
          <p>
            Au cœur d'Ay-sur-Moselle, Le Bœuf & l'Épi est né d'une conviction : celle qu'une belle table
            commence toujours par la quête du bon produit. Chez nous, chaque ingrédient est sélectionné
            avec exigence, chaque assiette est composée avec soin.
          </p>
          <p>
            Notre devise — <em className="text-primary">« Pas de bonne cuisine sans beaux produits »</em> — guide
            chacun de nos gestes. Belles viandes maturées, pâtes fraîches façonnées à la main, légumes de saison
            choisis chez des maraîchers passionnés : tout est pensé pour vous offrir un moment de plaisir
            véritable.
          </p>
          <p>
            Nous sommes là pour vous faire passer un beau moment de plaisir gustatif, de détente et de
            convivialité. Que ce soit pour un dîner intime, un déjeuner d'affaires ou une célébration entre
            amis, notre équipe vous accueille avec la même attention.
          </p>
        </div>
      </div>
    </section>

    {/* Pilliers visuels */}
    <section className="py-24 bg-night-deep">
      <div className="container-luxury grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <img src={beefAged} alt="Viandes maturées" className="w-full aspect-[4/5] object-cover" />
        </div>
        <div className="reveal">
          <p className="eyebrow mb-6">L'art de la viande</p>
          <h3 className="font-display text-4xl md:text-5xl text-cream mb-6">
            Maturation <span className="italic text-primary">jusqu'à 35 jours.</span>
          </h3>
          <p className="text-muted-foreground font-light leading-loose">
            Nous sélectionnons des pièces de bœuf d'exception — Black Angus, races françaises rustiques —
            que nous laissons maturer en chambre dédiée. Cette patience révèle une tendreté et une
            profondeur de goût uniques, signature de notre cuisine.
          </p>
        </div>
      </div>
    </section>

    <section className="py-24 bg-background">
      <div className="container-luxury grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal md:order-2">
          <img src={pastaFresh} alt="Pâtes fraîches" className="w-full aspect-[4/5] object-cover" />
        </div>
        <div className="reveal md:order-1">
          <p className="eyebrow mb-6">Le geste artisanal</p>
          <h3 className="font-display text-4xl md:text-5xl text-cream mb-6">
            Pâtes fraîches <span className="italic text-primary">façonnées chaque matin.</span>
          </h3>
          <p className="text-muted-foreground font-light leading-loose">
            Chaque matin, dans notre cuisine, nos pâtes naissent sous nos mains : ravioles, tagliatelles,
            pappardelles. Une farine sélectionnée, des œufs frais, du temps. Rien d'autre. C'est la
            simplicité du geste qui fait toute la différence dans l'assiette.
          </p>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-24 bg-night-deep">
      <div className="container-luxury text-center reveal">
        <Ornament label="Venez nous rendre visite" />
        <h3 className="font-display text-4xl md:text-5xl text-cream mb-10 mt-6">
          Une table vous attend.
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/reservation" className="bg-primary text-primary-foreground px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold">
            Réserver
          </Link>
          <Link to="/carte" className="border border-cream/30 text-cream px-10 py-4 text-xs uppercase tracking-luxury hover:border-primary hover:text-primary transition-all duration-500">
            Voir la carte
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Restaurant;
