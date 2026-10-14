import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { useApp } from "../context/AppContext";
import usePageMeta from "../hooks/usePageMeta";

export default function Contact() {
  const { lang } = useApp();
  const fr = lang === "fr";
  usePageMeta({ title: fr ? "Contacter le créateur" : "Contact the creator", description: fr ? "Retrouvez le créateur du projet LuxeMode." : "Find the creator of the LuxeMode project." });
  return (
    <div className="container-luxe flex min-h-[65vh] items-center py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{fr ? "À propos du projet" : "About the project"}</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl text-gray-900 dark:text-white">{fr ? "Restons en contact." : "Let's connect."}</h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {fr ? "LuxeMode est un projet de portfolio créé par Wanil Parfait. Ce site n’est pas une boutique active : il n’y a ni service client ni formulaire de commande. Pour voir d’autres projets ou joindre le créateur, consultez son profil GitHub." : "LuxeMode is a portfolio project by Wanil Parfait. This is not an active store: there is no customer service or ordering form. Visit the creator's GitHub profile for more work or to get in touch."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://github.com/Wanil123" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-luxury-wine px-6 py-3 font-semibold text-white hover:bg-luxury-plum"><Github className="h-5 w-5" aria-hidden="true" /> GitHub <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
          <Link to="/about" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-900 hover:border-accent dark:border-white/20 dark:text-white"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> {fr ? "Découvrir le projet" : "About the project"}</Link>
        </div>
      </div>
    </div>
  );
}
