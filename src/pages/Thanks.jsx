import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight, Home } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import Button from "../components/ui/Button";
import confetti from "../utils/confetti";

export default function Thanks() {
  const { lang } = useApp();
  const T = STR[lang];

  useEffect(() => {
    // Trigger confetti on mount
    confetti();
  }, []);

  const orderNumber = `LM-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {T.thanks_title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            {T.thanks_desc}
          </motion.p>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8"
          >
            <Package className="w-6 h-6 text-accent dark:text-accent" />
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {T.order_number}
              </p>
              <p className="font-bold text-gray-900 dark:text-white">
                {orderNumber}
              </p>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          >
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {lang === "fr" ? "Email envoyé" : "Email sent"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lang === "fr"
                    ? "Vérifiez votre boîte de réception"
                    : "Check your inbox"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {T.delivery_estimate}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lang === "fr" ? "Livraison standard" : "Standard delivery"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="secondary"
              icon={Package}
              onClick={() => {}}
            >
              {T.track_order}
            </Button>
            <Link to="/">
              <Button icon={ArrowRight} iconPosition="right">
                {T.continue_shopping_btn}
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-sm text-gray-500 dark:text-gray-400"
          >
            {lang === "fr"
              ? "Des questions ? Contactez notre service client à support@luxemode.com"
              : "Questions? Contact our customer service at support@luxemode.com"}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
