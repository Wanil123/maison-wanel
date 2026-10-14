import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const collections = [
  { gender: "femme", fr: "Femme", en: "Women", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&q=80" },
  { gender: "homme", fr: "Homme", en: "Men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=720&q=80" },
  { gender: "enfant", fr: "Enfant", en: "Children", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=720&q=80" },
];

export default function Hero() {
  const { lang } = useApp();
  const fr = lang === "fr";
  const scrollToCollection = () => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="bg-[#241422] text-white overflow-hidden">
      <div className="container-luxe grid lg:grid-cols-[1fr_0.86fr] items-center gap-10 lg:gap-16 py-14 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-[0.22em] mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            {fr ? "Concept de boutique · Collection 2026" : "Storefront concept · 2026 collection"}
          </p>
          <h1 className="font-serif text-[clamp(3.1rem,6vw,5.7rem)] leading-[1.03] tracking-tight max-w-[12ch]">
            {fr ? "Des pièces qui ont du caractère." : "Pieces with a point of view."}
          </h1>
          <p className="mt-7 max-w-lg text-base sm:text-lg leading-relaxed text-[#dacbd2]">
            {fr ? "Explorez une sélection de mode imaginée pour cette démonstration. Découvrez le catalogue, composez vos favoris et essayez le parcours d’achat." : "Explore a fashion collection created for this demo. Browse the catalogue, save favourites and try the checkout flow."}
          </p>
          <div className="flex flex-wrap gap-3 mt-9">
            <button type="button" onClick={scrollToCollection} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-luxury-noir hover:bg-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {fr ? "Explorer la collection" : "Explore the collection"} <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <Link to="/about" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 font-medium text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {fr ? "Découvrir le projet" : "About the project"} <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-8 text-xs text-[#b9a9b3]">
            {fr ? "Projet de portfolio · Aucun achat ni paiement réel" : "Portfolio project · No real purchases or payments"}
          </p>
        </div>
        <div className="relative lg:pl-5">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-accent/20 via-luxury-wine/25 to-transparent blur-2xl" aria-hidden="true" />
          <div className="relative aspect-[4/4.2] max-h-[590px] overflow-hidden rounded-[1.8rem] border border-white/15 bg-luxury-wine shadow-2xl">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" alt={fr ? "Silhouette de mode de la collection conceptuelle" : "Fashion look from the concept collection"} width="1200" height="1260" fetchPriority="high" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-noir/70 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-accent-light">Maison Wanél / 01</p>
                <p className="mt-2 font-serif text-2xl sm:text-3xl">{fr ? "Une allure à soi" : "Style of your own"}</p>
              </div>
              <button type="button" onClick={scrollToCollection} aria-label={fr ? "Voir la collection" : "View collection"} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-luxury-noir hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#1b101b]">
        <div className="container-luxe grid grid-cols-3 gap-3 py-5 sm:gap-5">
          {collections.map((item) => (
            <Link key={item.gender} to={`/?g=${item.gender}`} className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-3 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <img src={item.image} alt="" width="64" height="64" loading="lazy" className="hidden h-12 w-12 rounded-lg object-cover sm:block" />
                <span className="truncate font-serif text-sm sm:text-lg">{fr ? item.fr : item.en}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
