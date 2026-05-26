import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RotateCcw, Diamond } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import Button from "./ui/Button";

const MARQUEE_ITEMS = [
  "EXCLUSIVE COLLECTIONS",
  "FREE SHIPPING",
  "PREMIUM QUALITY",
  "HANDCRAFTED LUXURY",
  "TIMELESS DESIGN",
  "SUSTAINABLE FASHION",
];

const CATEGORY_SHOWCASE = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=75",
    label: { fr: "Femme", en: "Women" },
    gender: "femme",
  },
  {
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=75",
    label: { fr: "Homme", en: "Men" },
    gender: "homme",
  },
  {
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=600&q=75",
    label: { fr: "Enfant", en: "Children" },
    gender: "enfant",
  },
];

export default function Hero() {
  const { lang } = useApp();
  const T = STR[lang];

  const features = [
    { icon: Truck, title: T.free_shipping, desc: T.orders_over },
    { icon: Shield, title: T.secure_pay, desc: T.fully_encrypted },
    { icon: RotateCcw, title: T.free_returns, desc: T.returns_details },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background — warm wine/burgundy gradient (static orbs for perf) */}
      <div className="absolute inset-0 bg-wine-hero">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-luxury-wine/30 to-accent/15 blur-2xl opacity-25" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/10 to-luxury-rose/15 blur-2xl opacity-20" />
      </div>

      {/* Content — NO scroll fade */}
      <div className="relative z-10">
        <div className="container-luxe py-16 sm:py-24 md:py-36 lg:py-44">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Luxury badge */}
            <motion.div variants={itemVariants} className="mb-5 sm:mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full glass-luxury text-accent text-[10px] sm:text-sm font-medium tracking-wider uppercase">
                <Diamond className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                {T.new_arrivals} 2026
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="mb-5 sm:mb-8">
              <span className="block font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight">
                {T.hero_title}
              </span>
              <span className="block font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mt-2 sm:mt-3 leading-[0.95] tracking-tight">
                <span className="text-gold-gradient">{T.hero_subtitle}</span>
              </span>
            </motion.h1>

            {/* Gold divider */}
            <motion.div variants={itemVariants} className="mx-auto mb-5 sm:mb-8">
              <div className="luxury-divider w-16 sm:w-24 mx-auto" />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-lg md:text-xl text-luxury-rose mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0"
            >
              {T.hero_desc}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <a href="#products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="gold"
                  icon={ArrowRight}
                  iconPosition="right"
                  fullWidth
                  className="sm:min-w-[220px] sm:!w-auto"
                >
                  {T.shop_now}
                </Button>
              </a>
              <Link to="/about" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="lg"
                  fullWidth
                  className="sm:min-w-[220px] sm:!w-auto text-white border-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
                >
                  {T.learn_more}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Category Showcase Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6 mt-12 sm:mt-20 lg:mt-24 max-w-5xl mx-auto"
          >
            {CATEGORY_SHOWCASE.map((cat, i) => (
              <motion.div
                key={cat.gender}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Link
                  to={`/?g=${cat.gender}`}
                  className="block relative group rounded-xl sm:rounded-2xl overflow-hidden aspect-[3/4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={`${cat.label[lang]} — ${T.discover}`}
                >
                  <img
                    src={cat.image}
                    alt={`Collection ${cat.label[lang]} LuxeMode`}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchpriority={i === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-noir/85 via-luxury-plum/40 to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-6">
                    <h3 className="font-serif text-sm sm:text-2xl md:text-3xl font-bold text-white mb-0 sm:mb-2 leading-tight">
                      {cat.label[lang]}
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-2 text-accent text-sm font-medium uppercase tracking-wider group-hover:gap-3 transition-all">
                      {T.discover} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 rounded-xl sm:rounded-2xl transition-colors duration-300" aria-hidden="true" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-6 sm:gap-12 md:gap-20 mt-12 sm:mt-20"
          >
            {[
              { value: "10K+", label: lang === "fr" ? "Clients" : "Clients" },
              { value: "500+", label: lang === "fr" ? "Pièces" : "Pieces" },
              { value: "4.9", label: lang === "fr" ? "Note" : "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-0.5 sm:mb-1">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-accent font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Marquee Banner */}
        <div className="border-t border-b border-accent/10 py-4 overflow-hidden bg-luxury-noir/30" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-6 mx-8 text-sm font-medium tracking-[0.25em] text-accent-light/70 uppercase whitespace-nowrap"
              >
                <Diamond className="w-3 h-3 text-accent/50" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Features Bar */}
        <div className="border-b border-white/5 bg-luxury-noir/20">
          <div className="container-luxe py-6 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.15 }}
                  className="flex items-center gap-3 sm:gap-4 text-white group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl glass-luxury flex items-center justify-center flex-shrink-0 group-hover:border-accent/30 transition-colors">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-xs sm:text-sm">{feature.title}</div>
                    <div className="text-[10px] sm:text-xs text-luxury-rose/60 truncate">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 rounded-full border border-accent/30 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ height: ["20%", "50%", "20%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 bg-accent/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
