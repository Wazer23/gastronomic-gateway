import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  ShoppingBag,
  Clock,
  Users,
  LogOut,
  Bell,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/reservations", label: "Réservations", icon: CalendarCheck, badgeKey: "reservations" as const },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingBag, badgeKey: "orders" as const },
  { to: "/admin/menu", label: "Carte", icon: UtensilsCrossed, manager: true },
  { to: "/admin/hours", label: "Horaires", icon: Clock, manager: true },
  { to: "/admin/team", label: "Équipe", icon: Users, manager: true },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isManager, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { newReservations, newOrders, clearReservations, clearOrders } = useRealtimeNotifications();

  useEffect(() => setOpen(false), [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const badge = (key?: "reservations" | "orders") => {
    if (key === "reservations") return newReservations;
    if (key === "orders") return newOrders;
    return 0;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 border-r border-border flex-col bg-card/40">
        <div className="p-6 border-b border-border">
          <Link to="/" className="block">
            <p className="eyebrow">Le Bœuf & l'Épi</p>
            <p className="font-display text-2xl text-primary mt-1">Admin</p>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            if (item.manager && !isManager) return null;
            const active = isActive(item.to, item.end);
            const b = badge(item.badgeKey);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (item.badgeKey === "reservations") clearReservations();
                  if (item.badgeKey === "orders") clearOrders();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors relative",
                  active
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {b > 0 && (
                  <Badge className="bg-secondary text-secondary-foreground h-5 px-1.5 text-[10px]">{b}</Badge>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-foreground/70">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur p-4">
        <Link to="/admin" className="font-display text-lg text-primary">Admin</Link>
        <div className="flex items-center gap-2">
          {(newReservations + newOrders) > 0 && (
            <div className="relative">
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" />
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-30 bg-background border-t border-border">
          <nav className="p-4 space-y-1">
            {nav.map((item) => {
              if (item.manager && !isManager) return null;
              const active = isActive(item.to, item.end);
              const b = badge(item.badgeKey);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm",
                    active ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted/50",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {b > 0 && <Badge className="bg-secondary">{b}</Badge>}
                </Link>
              );
            })}
            <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start mt-4">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1 lg:ml-0 pt-[60px] lg:pt-0">{children}</main>
    </div>
  );
};