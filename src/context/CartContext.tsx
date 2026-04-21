import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
};
export type CartLine = { item: CartItem; quantity: number };

type CartCtx = {
  lines: CartLine[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = (item: CartItem) =>
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) return prev.map((l) => (l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
      return [...prev, { item, quantity: 1 }];
    });
  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.item.id !== id));
  const setQty = (id: string, qty: number) =>
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.item.id !== id) : prev.map((l) => (l.item.id === id ? { ...l, quantity: qty } : l))));
  const clear = () => setLines([]);

  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const total = lines.reduce((s, l) => s + l.quantity * l.item.price, 0);

  return <Ctx.Provider value={{ lines, add, remove, setQty, clear, count, total }}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
};
