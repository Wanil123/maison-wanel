import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";
import usePageMeta from "../../hooks/usePageMeta";

export default function Terms() {
  const { lang } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";

  usePageMeta({
    title: fr ? "Conditions générales de vente" : "Terms and conditions",
    description: fr
      ? "Conditions générales de vente LuxeMode."
      : "LuxeMode terms and conditions of sale.",
  });

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe max-w-4xl">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{T.nav_shop}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">{T.terms_link}</span>
        </nav>

        <header className="mb-8 sm:mb-12">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <FileText className="w-6 h-6 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            {fr ? "Conditions générales de vente" : "Terms and conditions"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fr ? "Dernière mise à jour : 1er mai 2026" : "Last updated: May 1, 2026"}
          </p>
        </header>

        <article className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <Section title={fr ? "1. Objet" : "1. Purpose"}>
            {fr
              ? "Les présentes conditions régissent les ventes conclues entre LuxeMode (« nous », « notre ») et toute personne physique ou morale (« vous », « client ») effectuant un achat sur luxemode.app."
              : "These terms govern sales between LuxeMode (\"we\", \"our\") and any individual or legal entity (\"you\", \"customer\") making a purchase on luxemode.app."}
          </Section>

          <Section title={fr ? "2. Produits & disponibilité" : "2. Products & availability"}>
            {fr
              ? "Nos produits sont décrits avec la plus grande exactitude possible. Les photographies sont contractuelles dans la limite des tolérances d'affichage. La disponibilité est indiquée sur chaque fiche produit ; en cas de rupture après commande, nous vous contacterons sous 24 h pour proposer un remboursement ou un produit équivalent."
              : "Our products are described as accurately as possible. Photos are contractual within display tolerances. Availability is indicated on each product page; in case of stock-out after order, we will contact you within 24 h to offer a refund or equivalent product."}
          </Section>

          <Section title={fr ? "3. Prix" : "3. Pricing"}>
            {fr
              ? "Les prix sont indiqués en dollars canadiens (CAD), toutes taxes comprises. LuxeMode se réserve le droit de modifier ses prix à tout moment ; les commandes passées sont honorées au prix affiché au moment de l'achat."
              : "Prices are in Canadian dollars (CAD), taxes included. LuxeMode reserves the right to modify pricing at any time; orders placed are honored at the price shown at purchase."}
          </Section>

          <Section title={fr ? "4. Commande" : "4. Order"}>
            {fr
              ? "Le client passe commande en ajoutant des articles au panier, en validant l'adresse de livraison, le mode de paiement, puis en confirmant la commande. La commande est ferme dès l'acceptation des présentes conditions et le paiement."
              : "The customer places an order by adding items to the cart, validating the shipping address and payment method, and confirming. The order is binding upon acceptance of these terms and payment."}
          </Section>

          <Section title={fr ? "5. Paiement" : "5. Payment"}>
            {fr
              ? "Les paiements sont traités via un prestataire certifié PCI-DSS. Cartes acceptées : Visa, Mastercard, American Express, ainsi qu'Apple Pay et PayPal. Aucune donnée bancaire n'est stockée sur nos serveurs."
              : "Payments are processed via a PCI-DSS certified provider. Accepted cards: Visa, Mastercard, American Express, plus Apple Pay and PayPal. No payment card data is stored on our servers."}
          </Section>

          <Section title={fr ? "6. Livraison" : "6. Shipping"}>
            {fr ? (
              <>Les délais et tarifs de livraison sont détaillés sur la page <Link to="/legal/shipping" className="text-accent underline hover:no-underline">Livraison</Link>. Tout retard supérieur à 7 jours ouvrés peut être signalé à support@luxemode.com.</>
            ) : (
              <>Delivery times and fees are detailed on the <Link to="/legal/shipping" className="text-accent underline hover:no-underline">Shipping</Link> page. Any delay over 7 business days can be reported to support@luxemode.com.</>
            )}
          </Section>

          <Section title={fr ? "7. Droit de rétractation & retours" : "7. Right of withdrawal & returns"}>
            {fr ? (
              <>Vous disposez de 30 jours à compter de la réception pour retourner un article non porté, dans son emballage d'origine. Voir <Link to="/legal/returns" className="text-accent underline hover:no-underline">Retours</Link>.</>
            ) : (
              <>You have 30 days from receipt to return an unworn item in original packaging. See <Link to="/legal/returns" className="text-accent underline hover:no-underline">Returns</Link>.</>
            )}
          </Section>

          <Section title={fr ? "8. Garantie légale" : "8. Legal warranty"}>
            {fr
              ? "Conformément à la Loi sur la protection du consommateur (Québec) et aux lois canadiennes applicables, nos produits bénéficient d'une garantie de conformité de 2 ans à compter de la livraison."
              : "Pursuant to the Consumer Protection Act (Quebec) and applicable Canadian laws, our products carry a 2-year conformity warranty from delivery."}
          </Section>

          <Section title={fr ? "9. Propriété intellectuelle" : "9. Intellectual property"}>
            {fr
              ? "L'ensemble des contenus du site (textes, images, vidéos, marques, logos) sont la propriété de LuxeMode ou de ses partenaires. Toute reproduction sans autorisation est interdite."
              : "All site content (text, images, video, brands, logos) is the property of LuxeMode or its partners. Any reproduction without authorization is prohibited."}
          </Section>

          <Section title={fr ? "10. Litiges & droit applicable" : "10. Disputes & applicable law"}>
            {fr ? (
              <>Les présentes conditions sont régies par les lois de la province de Québec, Canada. En cas de litige non résolu à l'amiable, compétence est attribuée aux tribunaux de Montréal. Pour toute question : <a href="mailto:legal@luxemode.com" className="text-accent underline hover:no-underline">legal@luxemode.com</a>.</>
            ) : (
              <>These terms are governed by the laws of Quebec, Canada. In case of unresolved disputes, the courts of Montreal have jurisdiction. Questions: <a href="mailto:legal@luxemode.com" className="text-accent underline hover:no-underline">legal@luxemode.com</a>.</>
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
      <p className="leading-relaxed">{children}</p>
    </section>
  );
}
