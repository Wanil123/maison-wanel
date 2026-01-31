import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      success,
      icon: Icon,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={`relative ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <motion.input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={{
              borderColor: error
                ? "#ef4444"
                : success
                ? "#10b981"
                : isFocused
                ? "#8b5cf6"
                : "",
            }}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-white dark:bg-gray-800
              border-2 border-gray-200 dark:border-gray-700
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              transition-all duration-200
              focus:outline-none focus:ring-0
              focus:border-accent focus:shadow-lg focus:shadow-accent/10
              disabled:opacity-50 disabled:cursor-not-allowed
              ${Icon ? "pl-11" : ""}
              ${isPassword || error || success ? "pr-11" : ""}
              ${error ? "border-red-500 focus:border-red-500" : ""}
              ${success ? "border-emerald-500 focus:border-emerald-500" : ""}
              ${className}
            `}
            {...props}
          />

          {/* Password toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Error/Success icons */}
          {!isPassword && error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {!isPassword && success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1.5 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
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
