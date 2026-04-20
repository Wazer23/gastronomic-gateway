import burger from "@/assets/burger.jpg";
import pastaSeafood from "@/assets/pasta-seafood.jpg";
import beefAged from "@/assets/beef-aged.jpg";
import dessert from "@/assets/dessert.jpg";
import starter from "@/assets/starter.jpg";
import pastaFresh from "@/assets/pasta-fresh.jpg";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "entree" | "viande" | "pates" | "burger" | "dessert";
  image?: string;
  available?: boolean;
};

export const menuItems: MenuItem[] = [
  // Entrées
  { id: "e1", name: "Foie gras de canard mi-cuit", description: "Chutney de figue, brioche toastée maison, fleur de sel", price: 18, category: "entree", image: starter },
  { id: "e2", name: "Carpaccio de bœuf", description: "Huile de truffe, copeaux de parmesan, roquette, pignons grillés", price: 16, category: "entree" },
  { id: "e3", name: "Œuf parfait", description: "Crème de champignons des bois, lard fumé, tuile au parmesan", price: 14, category: "entree" },

  // Viandes
  { id: "v1", name: "Côte de bœuf maturée 35 jours", description: "Pour 2 personnes — Race Black Angus, pommes grenaille, beurre maître d'hôtel", price: 78, category: "viande", image: beefAged },
  { id: "v2", name: "Filet de bœuf Rossini", description: "Escalope de foie gras poêlée, sauce Périgueux, gratin dauphinois", price: 38, category: "viande" },
  { id: "v3", name: "Entrecôte Black Angus", description: "300g, frites maison, sauce au choix (poivre, béarnaise, échalote)", price: 32, category: "viande" },
  { id: "v4", name: "Tartare de bœuf à la main", description: "Coupé au couteau, condiments traditionnels, frites fraîches", price: 24, category: "viande" },

  // Pâtes
  { id: "p1", name: "Tagliatelles aux fruits de mer", description: "Pâtes fraîches maison, moules, gambas, tomates confites, persil", price: 26, category: "pates", image: pastaSeafood },
  { id: "p2", name: "Ravioles de ricotta & épinards", description: "Beurre noisette, sauge, parmesan affiné 24 mois", price: 22, category: "pates", image: pastaFresh },
  { id: "p3", name: "Pappardelle au ragù de bœuf", description: "Mijoté 6 heures, vin rouge, romarin, parmesan", price: 24, category: "pates" },

  // Burgers
  { id: "b1", name: "Le Bœuf Signature", description: "Pain brioché, bœuf 180g, cheddar affiné, bacon fumé, oignons confits, frites maison", price: 19, category: "burger", image: burger },
  { id: "b2", name: "Le Truffé", description: "Bœuf 180g, brie de Meaux, crème de truffe, roquette, frites maison", price: 23, category: "burger" },

  // Desserts
  { id: "d1", name: "Fondant au chocolat noir", description: "Cœur coulant, glace vanille bourbon, framboises fraîches, feuille d'or", price: 11, category: "dessert", image: dessert },
  { id: "d2", name: "Tarte au citron meringuée", description: "Sablé breton, lemon curd, meringue italienne flambée minute", price: 10, category: "dessert" },
  { id: "d3", name: "Café gourmand", description: "Expresso et cinq mignardises de la maison", price: 12, category: "dessert" },
];

export const categoryLabels: Record<MenuItem["category"], string> = {
  entree: "Entrées",
  viande: "Viandes maturées",
  pates: "Pâtes fraîches",
  burger: "Burgers signature",
  dessert: "Desserts",
};
