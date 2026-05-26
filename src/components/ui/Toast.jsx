import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

const bgColors = {
  success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
  error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-[calc(100vw-3rem)]"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          const isAlert = toast.type === "error" || toast.type === "warning";
          return (
            <motion.div
              key={toast.id}
              role={isAlert ? "alert" : "status"}
              initial={{ opacity: 0, y: 50, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
                backdrop-blur-sm min-w-[280px] max-w-[400px]
                ${bgColors[toast.type] || bgColors.info}
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${colors[toast.type] || colors.info}`} aria-hidden="true" />
              <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Fermer la notification"
              >
                <X className="w-4 h-4 text-gray-500" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
