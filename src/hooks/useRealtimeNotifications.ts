import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Tiny "ding" sound, base64 encoded (very short, gentle)
const DING_DATA_URL =
  "data:audio/wav;base64,UklGRsQEAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaAEAAAA";

export const useRealtimeNotifications = () => {
  const { isTeam } = useAuth();
  const [newReservations, setNewReservations] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio(DING_DATA_URL);
      audioRef.current.volume = 0.4;
    }
  }, []);

  const ding = () => {
    audioRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    if (!isTeam) return;

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reservations" },
        (payload) => {
          setNewReservations((n) => n + 1);
          ding();
          const r = payload.new as { customer_name: string };
          toast.success("Nouvelle réservation", { description: r.customer_name });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setNewOrders((n) => n + 1);
          ding();
          const o = payload.new as { customer_name: string; total: number };
          toast.success("Nouvelle commande", {
            description: `${o.customer_name} — ${Number(o.total).toFixed(2)} €`,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isTeam]);

  return {
    newReservations,
    newOrders,
    clearReservations: () => setNewReservations(0),
    clearOrders: () => setNewOrders(0),
  };
};