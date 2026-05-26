import { Link } from "react-router-dom";
import { ChevronRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";
import usePageMeta from "../../hooks/usePageMeta";

export default function Returns() {
  const { lang } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";

  usePageMeta({
    title: fr ? "Retours & échanges" : "Returns & exchanges",
    description: fr
      ? "Politique de retours LuxeMode : 30 jours, gratuits depuis le Canada."
      : "LuxeMode returns policy: 30 days, free from Canada.",
  });

  const steps = fr
    ? [
        { t: "1. Demande", d: "Envoyez un courriel à support@luxemode.com avec votre numéro de commande (LM-XXXXXXXX)." },
        { t: "2. Étiquette", d: "Nous vous envoyons une étiquette de retour prépayée sous 24 h ouvrables." },
        { t: "3. Expédition", d: "Emballez le(s) article(s) non porté(s) dans leur emballage d'origine, collez l'étiquette, déposez en point relais." },
        { t: "4. Remboursement", d: "Dès réception, le remboursement est traité sous 5-7 jours sur votre moyen de paiement initial." },
      ]
    : [
        { t: "1. Request", d: "Email support@luxemode.com with your order number (LM-XXXXXXXX)." },
        { t: "2. Label", d: "We send a prepaid return label within 24 business hours." },
        { t: "3. Ship", d: "Pack unworn item(s) in original packaging, attach the label, drop at any pickup point." },
        { t: "4. Refund", d: "Upon receipt, refund processed within 5-7 days to original payment method." },
      ];

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe max-w-4xl">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{T.nav_shop}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">{T.footer_links_returns}</span>
        </nav>

        <header className="mb-8 sm:mb-12">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <RotateCcw className="w-6 h-6 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3">
            {fr ? "Retours & échanges" : "Returns & exchanges"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {fr
              ? "30 jours pour changer d'avis. Retours gratuits depuis le Canada."
              : "30 days to change your mind. Free returns from Canada."}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { t: fr ? "30 jours" : "30 days", d: fr ? "Pour retourner un article" : "To return an item" },
            { t: fr ? "Gratuit" : "Free", d: fr ? "Depuis le Canada (étiquette fournie)" : "From Canada (label provided)" },
            { t: "5-7j", d: fr ? "Délai de remboursement" : "Refund timeline" },
            { t: fr ? "Article non porté" : "Unworn", d: fr ? "Étiquettes et emballage d'origine" : "Tags and original packaging" },
          ].map((c) => (
            <div key={c.t} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-luxury-charcoal/30 border border-gray-100 dark:border-luxury-charcoal">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{c.t}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{c.d}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
          {fr ? "Comment ça marche" : "How it works"}
        </h2>
        <ol className="space-y-4 mb-12">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-luxury-charcoal/40 border border-gray-100 dark:border-luxury-charcoal">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark text-luxury-noir font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.t}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="space-y-4 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white">
            {fr ? "Articles non éligibles" : "Non-eligible items"}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>{fr ? "Articles personnalisés ou sur mesure" : "Personalized or made-to-measure items"}</li>
            <li>{fr ? "Articles d'hygiène (boucles d'oreilles, parfums ouverts)" : "Hygiene items (earrings, opened fragrances)"}</li>
            <li>{fr ? "Articles soldés au-delà de −50 %" : "Items discounted beyond −50%"}</li>
            <li>{fr ? "Articles abîmés, portés ou sans étiquette" : "Damaged, worn, or untagged items"}</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white pt-4">
            {fr ? "Retours internationaux" : "International returns"}
          </h2>
          <p>
            {fr
              ? "Pour les commandes hors Canada, le retour est à votre charge (env. 25-45 $ selon le pays). Contactez-nous pour les modalités."
              : "For orders outside Canada, return shipping is at your expense (approx. $25-45 depending on country). Contact us for details."}
          </p>
        </section>
      </div>
    </div>
  );
}
