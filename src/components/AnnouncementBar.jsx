import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const STORAGE_KEY = "lm_ann_dismissed_v1";

export default function AnnouncementBar() {
  const { lang } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = (() => {
      try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
    })();
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-[60] overflow-hidden bg-gradient-to-r from-luxury-wine via-luxury-plum to-luxury-charcoal text-accent-light border-b border-accent/20"
          role="region"
          aria-label={lang === "fr" ? "Annonce" : "Announcement"}
        >
          <div className="container-luxe py-2 sm:py-2.5 flex items-center justify-center gap-2 sm:gap-3 text-center">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" aria-hidden="true" />
            <p className="text-[11px] sm:text-sm font-medium tracking-wide">
              {lang === "fr" ? (
                <>Livraison <span className="text-accent font-semibold">gratuite</span> dès 100 $ · Code <span className="text-accent font-semibold tracking-wider">WELCOME</span> pour −15 %</>
              ) : (
                <><span className="text-accent font-semibold">Free shipping</span> over $100 · Code <span className="text-accent font-semibold tracking-wider">WELCOME</span> for 15% off</>
              )}
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded text-accent-light/70 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={lang === "fr" ? "Fermer l'annonce" : "Dismiss announcement"}
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
