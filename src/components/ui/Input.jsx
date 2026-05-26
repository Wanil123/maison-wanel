import { forwardRef, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      error,
      success,
      icon: Icon,
      required = false,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || `input-${autoId}`;
    const errorId = `${inputId}-error`;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-required={required || undefined}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border-2 text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition-colors duration-200
              focus:outline-none focus:ring-0
              focus:border-accent focus:shadow-lg focus:shadow-accent/10
              disabled:opacity-50 disabled:cursor-not-allowed
              ${Icon ? "pl-11" : ""}
              ${isPassword || error || success ? "pr-11" : ""}
              ${error
                ? "border-red-500 focus:border-red-500"
                : success
                ? "border-emerald-500 focus:border-emerald-500"
                : "border-gray-200 dark:border-gray-700"}
              ${className}
            `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {!isPassword && error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
          {!isPassword && success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
