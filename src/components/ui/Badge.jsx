import { motion } from "framer-motion";

const variants = {
  default: "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
  bestseller: "bg-luxury-charcoal text-accent border border-accent/20",
  new: "bg-luxury-charcoal text-emerald-400 border border-emerald-400/20",
  limited: "bg-luxury-charcoal text-accent-light border border-accent/20",
  sale: "bg-red-600 text-white",
  exclusive: "bg-luxury-charcoal text-accent border border-accent/30",
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
      className={`
        inline-flex items-center justify-center
        font-bold uppercase tracking-wider
        rounded-full shadow-lg
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
