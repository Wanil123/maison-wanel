import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/translations";
import usePageMeta from "../hooks/usePageMeta";

export default function Thanks() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const fr = lang === "fr";
  usePageMeta({ title: fr ? "Simulation terminée" : "Demo complete", description: fr ? "Fin du parcours e-commerce de démonstration." : "End of the demo checkout flow." });

  useEffect(() => {
    if (location.state?.result?.demo) {
      setResult(location.state.result);
      return;
    }
    try {
      const saved = JSON.parse(sessionStorage.getItem("lm_last_order") || "null");
      if (saved?.demo && saved?.orderNumber) {
        setResult(saved);
        return;
      }
    } catch { /* invalid demo result */ }
    navigate("/", { replace: true });
  }, [location.state, navigate]);

  if (!result) return null;
  return (
    <div className="container-luxe flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-2xl rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-xl sm:p-12 dark:border-white/10 dark:bg-luxury-charcoal/40">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          <CheckCircle className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{fr ? "Parcours terminé" : "Flow complete"}</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl text-gray-900 dark:text-white">{fr ? "Simulation réussie" : "Demo completed"}</h1>
        <p className="mx-auto mt-5 max-w-lg text-gray-600 dark:text-gray-300">
          {fr ? "Tu as terminé le parcours de démonstration LuxeMode. Aucun paiement n’a été effectué et aucune commande n’a été créée ou expédiée." : "You completed the LuxeMode demo flow. No payment was made, and no real order was created or shipped."}
        </p>
        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-[#f6f0eb] p-5 text-left text-sm dark:bg-luxury-noir/40">
          <p className="flex justify-between gap-4"><span>{fr ? "Référence de démo" : "Demo reference"}</span><strong>{result.orderNumber}</strong></p>
          <p className="mt-3 flex justify-between gap-4"><span>{fr ? "Articles" : "Items"}</span><strong>{result.itemsCount}</strong></p>
          <p className="mt-3 flex justify-between gap-4"><span>{fr ? "Total fictif" : "Demo total"}</span><strong>{formatPrice(result.total, lang)}</strong></p>
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-luxury-wine px-6 py-3 font-semibold text-white hover:bg-luxury-plum">{fr ? "Retour à la collection" : "Back to collection"} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          <Link to="/about" className="inline-flex min-h-12 items-center rounded-full border border-gray-300 px-6 py-3 font-medium hover:border-accent dark:border-white/20">{fr ? "Voir le projet" : "About the project"}</Link>
        </div>
      </div>
    </div>
  );
}
