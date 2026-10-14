import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Footer() {
  const { lang } = useApp();
  const fr = lang === "fr";
  return (
    <footer className="border-t border-gray-200 bg-[#f7f2ed] text-gray-900 dark:border-white/10 dark:bg-luxury-noir dark:text-white">
      <div className="container-luxe grid gap-10 py-12 sm:grid-cols-[1.5fr_1fr_1fr] sm:py-16">
        <div className="max-w-sm">
          <Link to="/" className="font-serif text-2xl font-bold">LuxeMode<span className="text-accent">.</span></Link>
          <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-300">
            {fr ? "Une boutique conceptuelle conçue par Wanil Parfait pour présenter son travail en développement web." : "A concept storefront built by Wanil Parfait to showcase his web development work."}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-accent-dark dark:text-accent">
            {fr ? "Démonstration · Aucun achat réel" : "Demo · No real purchases"}
          </p>
        </div>
        <nav aria-label={fr ? "Explorer" : "Explore"}>
          <h2 className="mb-4 font-serif text-lg">{fr ? "Explorer" : "Explore"}</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li><Link className="hover:text-accent" to="/">{fr ? "Collection" : "Collection"}</Link></li>
            <li><Link className="hover:text-accent" to="/?g=femme">{fr ? "Femme" : "Women"}</Link></li>
            <li><Link className="hover:text-accent" to="/?g=homme">{fr ? "Homme" : "Men"}</Link></li>
            <li><Link className="hover:text-accent" to="/?g=enfant">{fr ? "Enfant" : "Children"}</Link></li>
          </ul>
        </nav>
        <nav aria-label={fr ? "Projet" : "Project"}>
          <h2 className="mb-4 font-serif text-lg">{fr ? "Projet" : "Project"}</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li><Link className="hover:text-accent" to="/about">{fr ? "Étude de cas" : "Case study"}</Link></li>
            <li><Link className="hover:text-accent" to="/contact">{fr ? "Contacter le créateur" : "Contact the creator"}</Link></li>
            <li><a className="inline-flex items-center gap-1 hover:text-accent" href="https://github.com/Wanil123" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" aria-hidden="true" /> GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a></li>
          </ul>
        </nav>
      </div>
      <div className="container-luxe flex flex-wrap justify-between gap-3 border-t border-gray-200 py-5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
        <span>© {new Date().getFullYear()} LuxeMode · Wanil Parfait</span>
        <span>{fr ? "Images : Unsplash et Pexels · Données produit fictives" : "Images: Unsplash and Pexels · Fictional product data"}</span>
      </div>
    </footer>
  );
}
