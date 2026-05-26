import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import { Accordion, AccordionItem } from "../components/ui/Accordion";
import usePageMeta from "../hooks/usePageMeta";

const FAQ_DATA = {
  fr: [
    {
      cat: "Commande",
      items: [
        {
          q: "Comment passer une commande ?",
          a: "Ajoutez vos articles au panier, finalisez via 'Procéder au paiement'. Vous serez guidé en 3 étapes : livraison, paiement, confirmation. Un courriel de confirmation est envoyé immédiatement.",
        },
        {
          q: "Puis-je modifier ou annuler une commande ?",
          a: "Vous disposez de 2 heures après confirmation pour modifier ou annuler via support@luxemode.com en indiquant votre numéro de commande (format LM-XXXXXXXX).",
        },
        {
          q: "Quels moyens de paiement acceptez-vous ?",
          a: "Visa, Mastercard, American Express, Apple Pay et PayPal. Toutes les transactions sont chiffrées de bout en bout (PCI-DSS).",
        },
      ],
    },
    {
      cat: "Livraison",
      items: [
        {
          q: "Quels sont les délais de livraison ?",
          a: "Standard (gratuite dès 100 $) : 2 à 4 jours ouvrables au Canada. Express (15 $) : 24-48 h en Amérique du Nord. International : 5-10 jours ouvrables.",
        },
        {
          q: "Livrez-vous à l'international ?",
          a: "Oui — États-Unis, Europe, et la plupart des pays. Les taxes et droits de douane peuvent s'ajouter à destination.",
        },
        {
          q: "Comment suivre ma commande ?",
          a: "Un numéro de suivi est envoyé par courriel dès l'expédition. Vous pouvez le saisir directement sur le site de notre transporteur.",
        },
      ],
    },
    {
      cat: "Retours & Échanges",
      items: [
        {
          q: "Quelle est votre politique de retour ?",
          a: "Vous disposez de 30 jours pour retourner un article non porté, dans son emballage d'origine. Le remboursement est effectué sous 5 à 7 jours après réception.",
        },
        {
          q: "Les retours sont-ils gratuits ?",
          a: "Oui, les retours depuis le Canada sont gratuits. Une étiquette prépayée est fournie sur demande à support@luxemode.com.",
        },
        {
          q: "Comment échanger une taille ?",
          a: "Initiez un retour et passez une nouvelle commande pour la taille souhaitée. Aucun frais supplémentaire.",
        },
      ],
    },
    {
      cat: "Produits",
      items: [
        {
          q: "Comment trouver ma taille ?",
          a: "Chaque fiche produit propose un Guide des tailles. Pour une aide personnalisée, écrivez-nous à support@luxemode.com avec vos mensurations.",
        },
        {
          q: "Vos produits sont-ils authentiques ?",
          a: "Oui — chaque pièce est sourcée chez des manufactures partenaires certifiées et accompagnée d'un certificat d'authenticité pour les pièces premium.",
        },
        {
          q: "Comment entretenir mes articles ?",
          a: "Chaque article inclut une étiquette d'entretien détaillée. Pour les pièces en cachemire, soie ou cuir, un nettoyage professionnel est recommandé.",
        },
      ],
    },
  ],
  en: [
    {
      cat: "Orders",
      items: [
        {
          q: "How do I place an order?",
          a: "Add items to your cart and proceed to checkout. You will be guided through 3 steps: shipping, payment, confirmation. A confirmation email is sent immediately.",
        },
        {
          q: "Can I modify or cancel an order?",
          a: "You have 2 hours after confirmation to modify or cancel by emailing support@luxemode.com with your order number (format LM-XXXXXXXX).",
        },
        {
          q: "What payment methods do you accept?",
          a: "Visa, Mastercard, American Express, Apple Pay and PayPal. All transactions are end-to-end encrypted (PCI-DSS).",
        },
      ],
    },
    {
      cat: "Shipping",
      items: [
        {
          q: "What are the delivery times?",
          a: "Standard (free over $100): 2-4 business days within Canada. Express ($15): 24-48 h within North America. International: 5-10 business days.",
        },
        {
          q: "Do you ship internationally?",
          a: "Yes — USA, Europe, and most countries. Local taxes and customs duties may apply.",
        },
        {
          q: "How do I track my order?",
          a: "A tracking number is emailed as soon as the order ships. You can use it directly on our carrier's website.",
        },
      ],
    },
    {
      cat: "Returns & Exchanges",
      items: [
        {
          q: "What is your return policy?",
          a: "You have 30 days to return an unworn item in its original packaging. Refund processed within 5-7 days of receipt.",
        },
        {
          q: "Are returns free?",
          a: "Yes — returns from Canada are free. A prepaid label is provided on request at support@luxemode.com.",
        },
        {
          q: "How do I exchange a size?",
          a: "Initiate a return and place a new order for the desired size. No extra fees.",
        },
      ],
    },
    {
      cat: "Products",
      items: [
        {
          q: "How do I find my size?",
          a: "Each product page has a Size Guide. For personalized help, email support@luxemode.com with your measurements.",
        },
        {
          q: "Are your products authentic?",
          a: "Yes — every piece is sourced from certified partner manufacturers and includes a certificate of authenticity for premium items.",
        },
        {
          q: "How should I care for my items?",
          a: "Each item includes a detailed care label. Professional cleaning is recommended for cashmere, silk, and leather pieces.",
        },
      ],
    },
  ],
};

export default function FAQ() {
  const { lang } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";
  const sections = FAQ_DATA[lang];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  usePageMeta({
    title: "FAQ",
    description: fr
      ? "Questions fréquentes sur les commandes, la livraison, les retours et nos produits LuxeMode."
      : "Frequently asked questions about orders, shipping, returns and LuxeMode products.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: sections.flatMap((s) =>
        s.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        }))
      ),
    },
  });

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">FAQ</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-dark items-center justify-center mb-4 shadow-lg shadow-accent/20">
              <HelpCircle className="w-6 h-6 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-3">
              {fr ? "Questions fréquentes" : "Frequently asked questions"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              {fr
                ? "Tout ce que vous devez savoir sur LuxeMode."
                : "Everything you need to know about LuxeMode."}
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {sections.map((section) => (
              <section key={section.cat} aria-labelledby={`section-${section.cat}`}>
                <h2
                  id={`section-${section.cat}`}
                  className="text-xs sm:text-sm uppercase tracking-[0.25em] text-accent font-semibold mb-3 sm:mb-4"
                >
                  {section.cat}
                </h2>
                <Accordion>
                  {section.items.map((it, i) => (
                    <AccordionItem key={i} question={it.q}>
                      {it.a}
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-luxury-charcoal to-luxury-wine text-center">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-accent mb-2">
              {fr ? "Vous ne trouvez pas votre réponse ?" : "Can't find your answer?"}
            </h2>
            <p className="text-accent-light/80 mb-5 text-sm sm:text-base">
              {fr
                ? "Notre équipe répond sous 24 h ouvrables."
                : "Our team replies within 24 business hours."}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent-light text-luxury-noir font-semibold shadow-lg hover:shadow-accent/30 transition-shadow"
            >
              {T.contact_us}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
