import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DbCategory = { id: string; slug: string; label: string; display_order: number };
export type DbMenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  available: boolean;
  display_order: number;
};

export const useMenuData = (onlyAvailable = false) => {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [items, setItems] = useState<DbMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [c, i] = await Promise.all([
        supabase.from("categories").select("*").order("display_order"),
        supabase.from("menu_items").select("*").order("display_order"),
      ]);
      setCategories((c.data as DbCategory[]) ?? []);
      const all = (i.data as DbMenuItem[]) ?? [];
      setItems(onlyAvailable ? all.filter((x) => x.available) : all);
      setLoading(false);
    };
    load();
  }, [onlyAvailable]);

  return { categories, items, loading };
};