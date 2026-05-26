import { Link } from "react-router-dom";
import { ChevronRight, Truck, Globe, Clock } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";
import usePageMeta from "../../hooks/usePageMeta";

export default function Shipping() {
  const { lang } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";

  usePageMeta({
    title: fr ? "Livraison" : "Shipping",
    description: fr
      ? "Modes de livraison, délais et tarifs LuxeMode."
      : "LuxeMode shipping methods, times and fees.",
  });

  const methods = fr
    ? [
        { name: "Standard", time: "2-4 jours ouvrables", price: "Gratuit dès 100 $ · 15 $ sinon", icon: Truck, zone: "Canada" },
        { name: "Express", time: "24-48 h", price: "25 $", icon: Clock, zone: "Amérique du Nord" },
        { name: "International", time: "5-10 jours ouvrables", price: "À partir de 35 $", icon: Globe, zone: "Europe, Asie, Océanie" },
      ]
    : [
        { name: "Standard", time: "2-4 business days", price: "Free over $100 · $15 otherwise", icon: Truck, zone: "Canada" },
        { name: "Express", time: "24-48 h", price: "$25", icon: Clock, zone: "North America" },
        { name: "International", time: "5-10 business days", price: "From $35", icon: Globe, zone: "Europe, Asia, Oceania" },
      ];

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe max-w-4xl">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{T.nav_shop}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">{T.footer_links_delivery}</span>
        </nav>

        <header className="mb-8 sm:mb-12">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <Truck className="w-6 h-6 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            {fr ? "Livraison" : "Shipping"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {fr
              ? "Suivi inclus, emballage soigné, livraison gratuite dès 100 $."
              : "Tracking included, premium packaging, free shipping over $100."}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {methods.map((m) => (
            <article key={m.name} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-luxury-charcoal/40 border border-gray-100 dark:border-luxury-charcoal">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
                <m.icon className="w-5 h-5 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-1">{m.name}</h2>
              <p className="text-xs uppercase tracking-wider text-accent mb-3">{m.zone}</p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{fr ? "Délai" : "Time"}</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{m.time}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">{fr ? "Tarif" : "Price"}</dt>
                  <dd className="font-medium text-gray-900 dark:text-white">{m.price}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              {fr ? "Suivi de commande" : "Order tracking"}
            </h2>
            <p>
              {fr
                ? "Un numéro de suivi est envoyé par courriel dès l'expédition. Vous pouvez le saisir directement sur le site de notre transporteur partenaire (Postes Canada, Purolator selon la zone)."
                : "A tracking number is emailed once your order ships. Enter it on our carrier's website (Canada Post, Purolator depending on zone)."}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              {fr ? "Délais de préparation" : "Preparation time"}
            </h2>
            <p>
              {fr
                ? "Les commandes passées avant 14 h (HE) sont préparées le jour même. Au-delà, expédition le jour ouvré suivant. Aucune expédition les fins de semaine et jours fériés."
                : "Orders placed before 2pm (ET) ship the same day. After: next business day. No weekend or holiday shipments."}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              {fr ? "Taxes et douane" : "Taxes & customs"}
            </h2>
            <p>
              {fr
                ? "Les commandes au Canada incluent la TPS/TVQ. Les commandes internationales peuvent être soumises à des droits de douane et taxes locales à destination, à votre charge."
                : "Canadian orders include GST/QST. International orders may be subject to local customs duties and taxes at destination, at your expense."}
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              {fr ? "Emballage" : "Packaging"}
            </h2>
            <p>
              {fr
                ? "Chaque commande est livrée dans un emballage signature LuxeMode (recyclable et FSC certifié). Une carte de remerciement est incluse."
                : "Every order ships in a signature LuxeMode package (recyclable, FSC certified). A thank-you card is included."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
