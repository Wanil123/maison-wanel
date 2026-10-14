import { Link } from "react-router-dom";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AnnouncementBar() {
  const { lang } = useApp();
  const fr = lang === "fr";
  return (
    <div className="relative z-40 border-b border-accent/20 bg-luxury-wine text-accent-light" role="note">
      <div className="container-luxe flex min-h-10 items-center justify-center gap-2 py-2 text-center text-[11px] font-medium tracking-wide sm:text-sm">
        <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>{fr ? "Projet de portfolio · Boutique fictive · Aucun paiement réel" : "Portfolio project · Fictional storefront · No real payments"}</span>
        <Link to="/about" className="hidden items-center gap-1 font-semibold text-white underline-offset-2 hover:underline sm:inline-flex">
          {fr ? "Le projet" : "About"} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
