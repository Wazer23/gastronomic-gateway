import { Layout } from "@/components/layout/Layout";
import { Ornament } from "@/components/sections/Ornament";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import beefAged from "@/assets/beef-aged.jpg";
import { useMenuData, DbMenuItem } from "@/hooks/useMenuData";
import { Loader2 } from "lucide-react";

const ItemRow = ({ item }: { item: DbMenuItem }) => (
  <div className="group py-6 border-b border-border/40 last:border-0 transition-colors hover:bg-card/40 px-4 -mx-4">
    <div className="flex items-baseline justify-between gap-4 mb-2">
      <h4 className="font-display text-2xl text-cream group-hover:text-primary transition-colors">
        {item.name}
      </h4>
      <div className="flex-1 border-b border-dotted border-border/50 mx-4 mb-2" />
      <span className="font-display text-2xl text-primary whitespace-nowrap">{Number(item.price)} €</span>
    </div>
    <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-2xl">
      {item.description}
    </p>
  </div>
);

const Carte = () => {
  const { categories, items, loading } = useMenuData(true);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px]">
        <img src={beefAged} alt="" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-night/75" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center container-luxury">
          <p className="eyebrow mb-6 animate-fade-in">À table</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream animate-fade-in-up">
            Notre <span className="italic text-primary">Carte</span>
          </h1>
          <p className="text-cream/70 max-w-xl mt-6 font-light animate-fade-in" style={{ animationDelay: "300ms" }}>
            Une cuisine de saison, qui évolue au rythme des arrivages et des inspirations du chef.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-luxury max-w-4xl">
          {loading && <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
          {!loading && categories.map((cat) => {
            const catItems = items.filter((i) => i.category_id === cat.id);
            if (catItems.length === 0) return null;
            return (
              <div key={cat.id} className="mb-20 reveal">
                <div className="text-center mb-12">
                  <Ornament label={cat.label} />
                </div>
                <div>
                  {catItems.map((it) => (
                    <ItemRow key={it.id} item={it} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center mt-16 reveal">
            <p className="text-muted-foreground italic font-display text-xl mb-8">
              « Notre carte évolue chaque saison au gré des produits du marché. »
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/reservation" className="bg-primary text-primary-foreground px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary-glow transition-all duration-500 hover:shadow-gold">
                Réserver une table
              </Link>
              <Link to="/click-and-collect" className="border border-primary text-primary px-10 py-4 text-xs uppercase tracking-luxury hover:bg-primary hover:text-primary-foreground transition-all duration-500 inline-flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Commander à emporter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Carte;
