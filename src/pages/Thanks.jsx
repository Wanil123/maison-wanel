import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import Button from "../components/ui/Button";
import confetti from "../utils/confetti";
import usePageMeta from "../hooks/usePageMeta";

export default function Thanks() {
  const { lang } = useApp();
  const T = STR[lang];
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  usePageMeta({
    title: T.thanks_title,
    description: T.thanks_desc,
  });

  useEffect(() => {
    let parsed = null;
    try {
      const raw = sessionStorage.getItem("lm_last_order");
      if (raw) parsed = JSON.parse(raw);
    } catch { /* ignore */ }

    if (!parsed || !parsed.orderNumber) {
      // No real order — redirect home to prevent direct access.
      navigate("/", { replace: true });
      return;
    }
    setOrder(parsed);
    const stopConfetti = confetti();
    return () => stopConfetti?.();
  }, [navigate]);

  if (!order) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" aria-hidden="true" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4"
          >
            {T.thanks_title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            {lang === "fr" ? "Bonjour " : "Hi "}
            <span className="font-medium text-gray-900 dark:text-white">{order.name}</span>
            {lang === "fr" ? ", votre commande est confirmée." : ", your order is confirmed."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-4 bg-gray-100 dark:bg-luxury-charcoal/40 rounded-2xl mb-8 border border-gray-100 dark:border-luxury-charcoal"
          >
            <Package className="w-6 h-6 text-accent" aria-hidden="true" />
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {T.order_number}
              </p>
              <p className="font-bold text-gray-900 dark:text-white tracking-wider">
                {order.orderNumber}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left"
          >
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-luxury-charcoal/40 rounded-xl border border-gray-100 dark:border-luxury-charcoal">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">
                  {lang === "fr" ? "Email envoyé à" : "Email sent to"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={order.email}>
                  {order.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-luxury-charcoal/40 rounded-xl border border-gray-100 dark:border-luxury-charcoal">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {T.delivery_estimate}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {order.itemsCount} {lang === "fr" ? "article(s)" : "item(s)"} • {formatPrice(order.total, lang)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/">
              <Button icon={ArrowRight} iconPosition="right">
                {T.continue_shopping_btn}
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-sm text-gray-500 dark:text-gray-400"
          >
            {lang === "fr"
              ? "Des questions ? Contactez-nous à "
              : "Questions? Reach us at "}
            <a href="mailto:support@luxemode.com" className="text-accent hover:underline">
              support@luxemode.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
