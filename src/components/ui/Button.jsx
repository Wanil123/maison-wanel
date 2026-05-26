import { forwardRef } from "react";
import { motion } from "framer-motion";

const variants = {
  primary: `
    bg-gradient-to-r from-luxury-charcoal to-luxury-wine text-accent
    border border-accent/20
    hover:from-luxury-wine hover:to-luxury-plum hover:shadow-xl hover:shadow-luxury-wine/30
    dark:from-accent dark:to-accent-light dark:text-luxury-noir dark:border-accent/40
    dark:hover:from-accent-light dark:hover:to-accent
  `,
  secondary: `
    bg-transparent border-2 border-luxury-charcoal text-luxury-charcoal
    dark:border-accent dark:text-accent
    hover:bg-luxury-charcoal hover:text-accent
    dark:hover:bg-accent dark:hover:text-luxury-noir
  `,
  gold: `
    bg-gradient-to-r from-accent to-accent-light text-luxury-noir
    border border-accent
    hover:from-accent-light hover:to-accent hover:shadow-xl hover:shadow-accent/30
  `,
  ghost: `
    bg-transparent text-gray-700 dark:text-gray-300
    hover:bg-gray-100 dark:hover:bg-white/5
  `,
  danger: `
    bg-gradient-to-r from-red-700 to-red-600 text-white
    hover:shadow-xl hover:shadow-red-500/30
  `,
  success: `
    bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
    hover:shadow-xl hover:shadow-emerald-500/30
  `,
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
  xl: "px-9 py-4 text-xl",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      type,
      disabled = false,
      loading = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      as = "button",
      ...props
    },
    ref
  ) => {
    const isButton = as === "button";
    const Component = isButton ? motion.button : motion.a;
    const isDisabled = disabled || loading;

    const a11yProps = isButton
      ? { type: type || "button", disabled: isDisabled, "aria-busy": loading || undefined }
      : { "aria-disabled": isDisabled || undefined };

    return (
      <Component
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02, y: -2 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...a11yProps}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-semibold rounded-xl
          transition-shadow duration-300 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isDisabled && !isButton ? "pointer-events-none opacity-50" : ""}
          overflow-hidden
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        <span className="relative flex items-center gap-2">
          {loading ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              {Icon && iconPosition === "left" && <Icon className="w-5 h-5" aria-hidden="true" />}
              {children}
              {Icon && iconPosition === "right" && <Icon className="w-5 h-5" aria-hidden="true" />}
            </>
          )}
        </span>
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
