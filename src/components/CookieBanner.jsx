import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const STORAGE_KEY = "lm_consent_v1";

const DEFAULT_CONSENT = {
  essential: true,
  analytics: false,
  marketing: false,
};

const readConsent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveConsent = (consent) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, ts: Date.now() }));
  } catch { /* ignore */ }
};

export default function CookieBanner() {
  const { lang } = useApp();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_CONSENT);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // Show after a short delay to not compete with hero animations.
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const savePreferences = () => {
    saveConsent({ ...draft, essential: true });
    setVisible(false);
    setShowSettings(false);
  };

  const fr = lang === "fr";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          role="dialog"
          aria-modal="false"
          aria-label={fr ? "Préférences de cookies" : "Cookie preferences"}
          className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md z-[70] bg-luxury-noir text-white rounded-2xl shadow-2xl border border-accent/20 overflow-hidden"
        >
          {!showSettings ? (
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-4 h-4 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg">
                    {fr ? "Cookies & confidentialité" : "Cookies & privacy"}
                  </h2>
                  <p className="text-xs sm:text-sm text-accent-light/70 mt-1 leading-relaxed">
                    {fr
                      ? "Nous utilisons des cookies pour améliorer votre expérience. Les essentiels sont toujours actifs. "
                      : "We use cookies to improve your experience. Essentials are always active. "}
                    <Link to="/legal/privacy" className="text-accent underline hover:no-underline">
                      {fr ? "En savoir plus" : "Learn more"}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-luxury-noir font-semibold text-sm shadow-lg hover:shadow-accent/30 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-noir"
                >
                  {fr ? "Tout accepter" : "Accept all"}
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/85 font-medium text-sm hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {fr ? "Refuser" : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2.5 rounded-xl text-accent text-sm underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {fr ? "Personnaliser" : "Customize"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-serif font-bold text-base sm:text-lg">
                  {fr ? "Personnaliser les cookies" : "Customize cookies"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={fr ? "Retour" : "Back"}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="space-y-3 mb-5">
                <li className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{fr ? "Essentiels" : "Essential"}</p>
                    <p className="text-xs text-accent-light/60 mt-0.5">
                      {fr ? "Panier, session, langue. Toujours actifs." : "Cart, session, language. Always on."}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-accent flex-shrink-0">
                    {fr ? "Requis" : "Required"}
                  </span>
                </li>

                {[
                  { key: "analytics", fr: "Analytique", en: "Analytics", descFr: "Mesurer l'audience anonymement.", descEn: "Anonymously measure usage." },
                  { key: "marketing", fr: "Marketing", en: "Marketing", descFr: "Publicité personnalisée.", descEn: "Personalized advertising." },
                ].map((opt) => (
                  <li key={opt.key} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/5">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{fr ? opt.fr : opt.en}</p>
                      <p className="text-xs text-accent-light/60 mt-0.5">{fr ? opt.descFr : opt.descEn}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, [opt.key]: !d[opt.key] }))}
                      role="switch"
                      aria-checked={draft[opt.key]}
                      className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        draft[opt.key] ? "bg-accent" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                          draft[opt.key] ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={savePreferences}
                className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-luxury-noir font-semibold text-sm shadow-lg hover:shadow-accent/30 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-luxury-noir"
              >
                {fr ? "Enregistrer mes préférences" : "Save my preferences"}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
