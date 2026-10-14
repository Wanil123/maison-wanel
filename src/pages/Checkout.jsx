import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatPrice } from "../data/translations";
import usePageMeta from "../hooks/usePageMeta";

export default function Checkout() {
  const navigate = useNavigate();
  const { lang, cart, cartTotal, cartDiscount, cartShipping, cartTax, cartGrandTotal, promoCode, clearCart } = useApp();
  const [acknowledged, setAcknowledged] = useState(false);
  const [completed, setCompleted] = useState(false);
  const fr = lang === "fr";

  usePageMeta({
    title: fr ? "Vérification du panier — Démo" : "Review your cart — Demo",
    description: fr ? "Parcours de démonstration sans achat ni paiement réel." : "Demo checkout with no real purchase or payment.",
  });

  useEffect(() => {
    if (!completed && cart.length === 0) navigate("/cart", { replace: true });
  }, [cart.length, completed, navigate]);

  if (cart.length === 0) return null;

  function finishDemo() {
    if (!acknowledged) return;
    const order = {
      orderNumber: `DEMO-${Date.now().toString().slice(-8)}`,
      total: cartGrandTotal,
      itemsCount: cart.reduce((sum, item) => sum + item.qty, 0),
      createdAt: new Date().toISOString(),
      demo: true,
    };
    try { sessionStorage.setItem("lm_last_order", JSON.stringify(order)); } catch { /* demo still completes */ }
    setCompleted(true);
    clearCart();
    navigate("/thanks", { replace: true, state: { result: order } });
  }

  return (
    <div className="min-h-[70vh] py-10 sm:py-16">
      <div className="container-luxe max-w-5xl">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-accent mb-7">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {fr ? "Retour au panier" : "Back to cart"}
        </Link>
        <div className="mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-3">
            {fr ? "Dernière étape · Démonstration" : "Final step · Demo"}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 dark:text-white">
            {fr ? "Vérifiez votre sélection" : "Review your selection"}
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            {fr ? "Ce parcours sert à montrer l’interface et le calcul du panier. Aucun article n’est vendu, aucun paiement n’est demandé et aucune commande ne sera expédiée." : "This flow demonstrates the interface and cart calculations. Nothing is sold, no payment is collected and no order will be shipped."}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <section className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8 dark:border-white/10 dark:bg-luxury-charcoal/30" aria-labelledby="selection-heading">
            <h2 id="selection-heading" className="font-serif text-2xl text-gray-900 dark:text-white mb-6">
              {fr ? "Votre sélection" : "Your selection"}
            </h2>
            <ul className="divide-y divide-gray-100 dark:divide-white/10">
              {cart.map((item, index) => (
                <li key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img src={item.image} alt="" width="80" height="96" className="h-20 w-16 shrink-0 rounded-xl object-cover bg-gray-100" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name[lang]}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {[item.size, item.color].filter(Boolean).join(" · ")} · {fr ? "Qté" : "Qty"} {item.qty}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">{formatPrice(item.price * item.qty, lang)}</p>
                </li>
              ))}
            </ul>
          </section>
          <aside className="self-start rounded-3xl border border-gray-200 bg-[#f6f0eb] p-5 sm:p-7 dark:border-white/10 dark:bg-luxury-charcoal/40" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="font-serif text-2xl text-gray-900 dark:text-white mb-5">
              {fr ? "Récapitulatif" : "Summary"}
            </h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt>{fr ? "Sous-total" : "Subtotal"}</dt><dd>{formatPrice(cartTotal, lang)}</dd></div>
              {cartDiscount > 0 && <div className="flex justify-between gap-3 text-emerald-700 dark:text-emerald-400"><dt>{fr ? "Remise" : "Discount"} {promoCode}</dt><dd>-{formatPrice(cartDiscount, lang)}</dd></div>}
              <div className="flex justify-between gap-3"><dt>{fr ? "Livraison simulée" : "Demo shipping"}</dt><dd>{formatPrice(cartShipping, lang)}</dd></div>
              <div className="flex justify-between gap-3"><dt>{fr ? "Taxes estimées" : "Estimated tax"}</dt><dd>{formatPrice(cartTax, lang)}</dd></div>
              <div className="flex justify-between gap-3 border-t border-gray-300/60 pt-4 text-lg font-bold text-gray-900 dark:text-white dark:border-white/10"><dt>{fr ? "Total fictif" : "Demo total"}</dt><dd>{formatPrice(cartGrandTotal, lang)}</dd></div>
            </dl>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-accent/30 bg-white/70 p-4 text-sm dark:bg-luxury-noir/40">
              <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#6B2D4A]" />
              <span>{fr ? "Je comprends qu’il s’agit d’une simulation sans paiement ni livraison." : "I understand this is a simulation with no payment or delivery."}</span>
            </label>
            <button type="button" onClick={finishDemo} disabled={!acknowledged} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-luxury-wine px-5 py-3 font-semibold text-white transition-colors hover:bg-luxury-plum disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {fr ? "Terminer la simulation" : "Finish the demo"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mt-4 flex gap-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
              {fr ? "Aucune coordonnée personnelle ou bancaire n’est requise." : "No personal or payment details are required."}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
