import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import logo from "@/assets/logo-boeuf-epi.png";

export const Footer = () => (
  <footer className="bg-night-deep border-t border-border/50 pt-20 pb-10">
    <div className="container-luxury grid md:grid-cols-4 gap-12 mb-16">
      <div className="md:col-span-1">
        <img src={logo} alt="Le Bœuf et l'Épi" className="h-20 w-auto mb-6" />
        <p className="text-sm text-muted-foreground italic font-display text-lg">
          « Pas de bonne cuisine sans beaux produits »
        </p>
      </div>

      <div>
        <h4 className="eyebrow mb-6">Adresse</h4>
        <div className="flex items-start gap-3 text-cream/80">
          <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
          <p className="text-sm leading-relaxed">
            Ay-sur-Moselle<br />
            57300 — Moselle
          </p>
        </div>
      </div>

      <div>
        <h4 className="eyebrow mb-6">Horaires</h4>
        <div className="flex items-start gap-3 text-cream/80">
          <Clock className="w-4 h-4 mt-1 text-primary shrink-0" />
          <div className="text-sm leading-relaxed space-y-1">
            <p>Mardi — Samedi</p>
            <p className="text-muted-foreground">12h — 14h · 19h — 22h</p>
            <p className="mt-2 text-muted-foreground italic">Fermé dimanche & lundi</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="eyebrow mb-6">Contact</h4>
        <div className="space-y-3 text-cream/80 text-sm">
          <a href="tel:+33387000000" className="flex items-center gap-3 hover:text-primary transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            03 87 00 00 00
          </a>
          <a href="mailto:contact@leboeufetlepi.com" className="flex items-center gap-3 hover:text-primary transition-colors">
            <Mail className="w-4 h-4 text-primary" />
            contact@leboeufetlepi.com
          </a>
        </div>
      </div>
    </div>

    <div className="container-luxury">
      <div className="ornament mb-8">
        <span className="text-primary text-lg">✦</span>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Le Bœuf & l'Épi — Tous droits réservés</p>
        <div className="flex gap-6">
          <Link to="/reservation" className="link-luxury hover:text-primary">Réserver une table</Link>
          <Link to="/click-and-collect" className="link-luxury hover:text-primary">Click & Collect</Link>
        </div>
      </div>
    </div>
  </footer>
);
