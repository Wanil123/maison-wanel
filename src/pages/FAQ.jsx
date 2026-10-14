import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import usePageMeta from "../hooks/usePageMeta";

export default function FAQ() {
  const { lang } = useApp();
  const fr = lang === "fr";
  usePageMeta({ title: "FAQ — Maison Wanél", description: fr ? "Questions sur la démonstration Maison Wanél." : "Questions about the Maison Wanél demo." });
  const items = fr ? [
    ["Puis-je acheter un produit ?", "Non. Maison Wanél est une démonstration de portfolio. Les produits, prix et promotions sont fictifs."],
    ["Le parcours de commande est-il réel ?", "Non. Il montre uniquement le récapitulatif et une confirmation de simulation. Aucune carte bancaire ni adresse n’est demandée."],
    ["Mes favoris et mon panier sont-ils conservés ?", "Oui, localement dans ce navigateur. Aucun compte client ni serveur de commande n’est utilisé."],
    ["Qui a créé ce site ?", "Wanil Parfait. La page du projet décrit les choix de conception et les fonctionnalités."],
  ] : [
    ["Can I buy a product?", "No. Maison Wanél is a portfolio demo. Products, prices and promotions are fictional."],
    ["Is checkout real?", "No. It only demonstrates an order summary and demo completion. No payment card or address is requested."],
    ["Are my favourites and cart saved?", "Yes, locally in this browser. There is no customer account or order server."],
    ["Who made this site?", "Wanil Parfait. The project page explains the design choices and features."],
  ];
  return (
    <div className="container-luxe max-w-4xl py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{fr ? "Questions fréquentes" : "Frequently asked questions"}</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-gray-900 dark:text-white">Maison Wanél FAQ</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{fr ? "Ce qu’il faut savoir avant d’explorer cette démonstration." : "What to know before exploring this demo."}</p>
      <div className="mt-9 space-y-3">
        {items.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-luxury-charcoal/30"><summary className="cursor-pointer list-none font-semibold text-gray-900 dark:text-white">{question}</summary><p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">{answer}</p></details>)}
      </div>
      <Link to="/about" className="mt-8 inline-block font-semibold text-accent-dark underline dark:text-accent">{fr ? "En savoir plus sur le projet" : "Learn more about the project"}</Link>
    </div>
  );
}
