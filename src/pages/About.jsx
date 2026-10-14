import { Link } from "react-router-dom";
import { ArrowRight, Code2, Heart, Languages, Search, ShoppingBag, Github } from "lucide-react";
import { useApp } from "../context/AppContext";
import usePageMeta from "../hooks/usePageMeta";

const features = [
  { icon: Search, fr: "Explorer", en: "Explore", bodyFr: "Recherche, catégories, tri et fiches produit détaillées.", bodyEn: "Search, categories, sorting and detailed product pages." },
  { icon: Heart, fr: "Personnaliser", en: "Personalize", bodyFr: "Favoris, articles vus récemment et préférences conservés localement.", bodyEn: "Favourites, recent items and preferences stored locally." },
  { icon: ShoppingBag, fr: "Composer un panier", en: "Build a cart", bodyFr: "Variantes, quantités, codes de démo et calcul du récapitulatif.", bodyEn: "Variants, quantities, demo codes and order calculations." },
  { icon: Languages, fr: "Changer de langue", en: "Switch language", bodyFr: "Interface en français et en anglais, adaptée aux écrans mobiles.", bodyEn: "French and English interface designed for mobile screens." },
];

export default function About() {
  const { lang } = useApp();
  const fr = lang === "fr";
  usePageMeta({ title: fr ? "Le projet — Maison Wanél" : "The project — Maison Wanél", description: fr ? "Étude de cas du projet e-commerce React Maison Wanél." : "A case study of the Maison Wanél React storefront." });

  return (
    <div>
      <section className="bg-[#241422] text-white">
        <div className="container-luxe grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{fr ? "Étude de cas · Portfolio" : "Case study · Portfolio"}</p>
            <h1 className="mt-5 max-w-[13ch] font-serif text-4xl leading-tight sm:text-6xl">{fr ? "Maison Wanél, une boutique pensée comme une expérience." : "Maison Wanél, a storefront built as an experience."}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#dacbd2]">
              {fr ? "Un projet personnel conçu pour démontrer mon travail en React : architecture de composants, gestion d’état, navigation, interface bilingue et soin du détail visuel." : "A personal project showcasing my React work: component architecture, state management, routing, bilingual UI and visual detail."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-luxury-noir hover:bg-accent-light">{fr ? "Explorer la démo" : "Explore the demo"} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <a href="https://github.com/Wanil123" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-white hover:bg-white/10"><Github className="h-4 w-4" aria-hidden="true" /> GitHub</a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85" alt={fr ? "Ambiance visuelle utilisée pour le concept Maison Wanél" : "Visual mood for the Maison Wanél concept"} width="1000" height="1100" className="aspect-[4/4.2] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-luxury-noir/85 to-transparent p-7">
              <p className="font-serif text-2xl">{fr ? "Éditorial, simple, interactif." : "Editorial, simple, interactive."}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container-luxe py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{fr ? "Ce que j’ai construit" : "What I built"}</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-gray-900 dark:text-white">{fr ? "Un parcours de boutique complet à explorer" : "A complete storefront flow to explore"}</h2>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, fr: titleFr, en: titleEn, bodyFr, bodyEn }) => (
            <article key={titleEn} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-luxury-charcoal/30">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent-dark dark:text-accent"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <h3 className="font-serif text-xl text-gray-900 dark:text-white">{fr ? titleFr : titleEn}</h3>
              <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">{fr ? bodyFr : bodyEn}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#f1e8e1] py-14 dark:bg-luxury-charcoal/40">
        <div className="container-luxe grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-accent-dark dark:text-accent"><Code2 className="h-5 w-5" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-[0.2em]">React · Vite · Tailwind CSS</span></div>
            <h2 className="mt-4 font-serif text-3xl text-gray-900 dark:text-white">{fr ? "Une démonstration, clairement annoncée." : "A demo, clearly labelled."}</h2>
          </div>
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {fr ? "Le catalogue, les prix, les images et les promotions sont des données d’exemple. Le panier et les favoris fonctionnent dans le navigateur, mais aucun compte client, paiement, livraison ou commande réelle n’existe. Les images proviennent d’Unsplash et de Pexels." : "Products, prices, imagery and promotions are sample data. The cart and favourites work in the browser, but there are no customer accounts, real payments, deliveries or orders. Imagery comes from Unsplash and Pexels."}
          </p>
        </div>
      </section>
    </div>
  );
}
