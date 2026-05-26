import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";
import usePageMeta from "../../hooks/usePageMeta";

export default function Privacy() {
  const { lang } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";

  usePageMeta({
    title: fr ? "Politique de confidentialité" : "Privacy policy",
    description: fr
      ? "Politique de confidentialité LuxeMode : collecte, usage et protection de vos données."
      : "LuxeMode privacy policy: collection, use and protection of your data.",
  });

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe max-w-4xl">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{T.nav_shop}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">{T.privacy_link}</span>
        </nav>

        <header className="mb-8 sm:mb-12">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <ShieldCheck className="w-6 h-6 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {fr ? "Politique de confidentialité" : "Privacy policy"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fr ? "Dernière mise à jour : 1er mai 2026" : "Last updated: May 1, 2026"}
          </p>
        </header>

        <article className="space-y-6 text-gray-700 dark:text-gray-300">
          <Section title={fr ? "1. Données que nous collectons" : "1. Data we collect"}>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{fr ? "Identifiants : nom, prénom, courriel, téléphone (à la commande)." : "Identifiers: name, email, phone (at order)."}</li>
              <li>{fr ? "Adresses de livraison et facturation." : "Shipping and billing addresses."}</li>
              <li>{fr ? "Historique de commande (numéro, montant, articles)." : "Order history (number, amount, items)."}</li>
              <li>{fr ? "Données techniques : navigateur, OS, langue, IP anonymisée." : "Technical: browser, OS, language, anonymized IP."}</li>
              <li>{fr ? "Préférences : langue, thème, panier (stockés localement)." : "Preferences: language, theme, cart (stored locally)."}</li>
            </ul>
            <p className="mt-3 text-sm">
              {fr
                ? "Nous ne stockons jamais vos données bancaires : elles transitent uniquement par notre prestataire de paiement certifié PCI-DSS."
                : "We never store your payment card data: it transits only through our PCI-DSS certified payment provider."}
            </p>
          </Section>

          <Section title={fr ? "2. Finalités du traitement" : "2. Purpose of processing"}>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{fr ? "Exécution de la commande (livraison, facturation, SAV)." : "Order fulfillment (delivery, invoicing, support)."}</li>
              <li>{fr ? "Sécurité du site et prévention de la fraude." : "Site security and fraud prevention."}</li>
              <li>{fr ? "Communication marketing (avec votre consentement explicite)." : "Marketing communications (with your explicit consent)."}</li>
              <li>{fr ? "Statistiques anonymisées (avec votre consentement)." : "Anonymized analytics (with your consent)."}</li>
            </ul>
          </Section>

          <Section title={fr ? "3. Base légale" : "3. Legal basis"}>
            {fr
              ? "Vos données sont traitées sur la base de l'exécution du contrat (commande), du consentement (newsletter, analytics), de l'intérêt légitime (sécurité), ou d'une obligation légale (comptabilité, fiscalité)."
              : "Your data is processed based on contract performance (order), consent (newsletter, analytics), legitimate interest (security), or legal obligation (accounting, tax)."}
          </Section>

          <Section title={fr ? "4. Durée de conservation" : "4. Retention"}>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{fr ? "Données de commande : 10 ans (obligation comptable)." : "Order data: 10 years (accounting requirement)."}</li>
              <li>{fr ? "Données marketing : jusqu'au retrait de votre consentement." : "Marketing data: until you withdraw consent."}</li>
              <li>{fr ? "Données techniques anonymisées : 13 mois max." : "Anonymized technical data: 13 months max."}</li>
            </ul>
          </Section>

          <Section title={fr ? "5. Partage des données" : "5. Data sharing"}>
            {fr
              ? "Vos données ne sont jamais vendues. Elles peuvent être transmises à : notre prestataire de paiement (Stripe), notre transporteur (livraison), notre service d'envoi de courriels transactionnels, dans la stricte mesure nécessaire à l'exécution de la commande."
              : "Your data is never sold. It may be shared with: our payment provider (Stripe), our carrier (delivery), and our transactional email service — only as strictly necessary for order fulfillment."}
          </Section>

          <Section title={fr ? "6. Cookies" : "6. Cookies"}>
            {fr
              ? "Nous utilisons des cookies essentiels (panier, langue, thème) et, avec votre consentement, des cookies analytiques et marketing. Vous pouvez modifier vos préférences à tout moment via le bandeau cookies."
              : "We use essential cookies (cart, language, theme) and, with your consent, analytics and marketing cookies. You can change your preferences at any time via the cookie banner."}
          </Section>

          <Section title={fr ? "7. Vos droits" : "7. Your rights"}>
            <p className="mb-2">{fr ? "Conformément à la Loi 25 (Québec) et au RGPD, vous disposez d'un droit :" : "Pursuant to Quebec's Law 25 and the GDPR, you have the right to:"}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{fr ? "d'accès, de rectification et d'effacement," : "access, rectify and erase your data,"}</li>
              <li>{fr ? "de portabilité de vos données," : "data portability,"}</li>
              <li>{fr ? "de retrait du consentement," : "withdraw consent,"}</li>
              <li>{fr ? "de limitation et d'opposition au traitement." : "restriction and objection to processing."}</li>
            </ul>
            <p className="mt-3">
              {fr ? "Pour exercer ces droits : " : "To exercise these rights: "}
              <a href="mailto:privacy@luxemode.com" className="text-accent underline hover:no-underline">privacy@luxemode.com</a>.
            </p>
          </Section>

          <Section title={fr ? "8. Sécurité" : "8. Security"}>
            {fr
              ? "Nous utilisons des protocoles standards (TLS 1.3, en-têtes de sécurité, CSP, HSTS) et des prestataires reconnus pour protéger vos données."
              : "We use industry standards (TLS 1.3, security headers, CSP, HSTS) and reputable providers to protect your data."}
          </Section>

          <Section title={fr ? "9. Contact" : "9. Contact"}>
            {fr ? (
              <>Pour toute question sur cette politique : <a href="mailto:privacy@luxemode.com" className="text-accent underline hover:no-underline">privacy@luxemode.com</a>. En cas de désaccord, vous pouvez saisir la <em>Commission d'accès à l'information du Québec</em>.</>
            ) : (
              <>Questions about this policy: <a href="mailto:privacy@luxemode.com" className="text-accent underline hover:no-underline">privacy@luxemode.com</a>. In case of disagreement, you may contact the <em>Commission d'accès à l'information du Québec</em>.</>
            )}
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}
