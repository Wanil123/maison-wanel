import { motion } from "framer-motion";

const variants = {
  default: "bg-luxury-charcoal text-accent dark:bg-white dark:text-gray-900 border border-accent/20",
  bestseller: "bg-luxury-charcoal text-accent border border-accent/30",
  new: "bg-luxury-charcoal text-emerald-400 border border-emerald-400/30",
  limited: "bg-luxury-noir text-accent-light border border-accent/30",
  sale: "bg-red-700 text-white border border-red-800",
  exclusive: "bg-luxury-charcoal text-accent border border-accent/40",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-blue-600 text-white",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  animated = false,
  className = "",
  ...rest
}) {
  const Component = animated ? motion.span : "span";
  const animationProps = animated
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <Component
      {...animationProps}
      {...rest}
      className={`
        inline-flex items-center justify-center
        font-bold uppercase tracking-wider
        rounded-full shadow-lg
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
