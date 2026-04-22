import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import logo from "@/assets/logo-boeuf-epi.png";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/restaurant", label: "Le Restaurant" },
  { to: "/carte", label: "Notre Carte" },
  { to: "/reservation", label: "Réserver" },
  { to: "/click-and-collect", label: "Click & Collect" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const mobileMenu = (
    <div
      className={`lg:hidden fixed inset-0 z-[100] isolate transition-all duration-300 ${
        open ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-night-deep" />

      <div className="relative flex h-full flex-col bg-night-deep">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-6">
          <img src={logo} alt="Le Bœuf et l'Épi" className="h-12 w-auto" />
          <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-cream p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="relative flex flex-1 flex-col items-center justify-center gap-8 px-8 text-center">
          {links.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `font-display text-3xl leading-none transition-colors ${isActive ? "text-primary" : "text-cream"}`
              }
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-night-deep/90 backdrop-blur-md py-3 shadow-soft" : "bg-transparent py-6"
      }`}
    >
      <div className="container-luxury flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Accueil">
          <img
            src={logo}
            alt="Le Bœuf et l'Épi"
            className={`transition-all duration-500 ${scrolled ? "h-10" : "h-14"} w-auto group-hover:opacity-80`}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.slice(0, -2).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `link-luxury text-xs uppercase tracking-luxury transition-colors ${
                  isActive ? "text-primary" : "text-cream/80 hover:text-primary"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/reservation"
            className="text-xs uppercase tracking-luxury text-cream/90 hover:text-primary transition-colors px-4 py-2"
          >
            Réserver
          </Link>
          <Link
            to="/click-and-collect"
            className="relative text-xs uppercase tracking-luxury bg-primary text-primary-foreground px-6 py-3 hover:bg-primary-glow transition-all duration-500 hover:shadow-gold flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Click & Collect
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-burgundy text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

        <button
          className="lg:hidden text-cream p-2"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {typeof document !== "undefined" ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
};
