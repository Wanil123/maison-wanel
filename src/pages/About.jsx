import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  Heart,
  Award,
  Users,
  Globe,
  Leaf,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import Button from "../components/ui/Button";

export default function About() {
  const { lang } = useApp();
  const T = STR[lang];
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const values = [
    {
      icon: Award,
      title: T.about_val1,
      desc: T.about_val1_desc,
      color: "from-accent to-accent-light",
    },
    {
      icon: Sparkles,
      title: T.about_val2,
      desc: T.about_val2_desc,
      color: "from-accent-dark to-accent",
    },
    {
      icon: Heart,
      title: T.about_val3,
      desc: T.about_val3_desc,
      color: "from-accent to-accent-light",
    },
  ];

  const stats = [
    { value: "2019", label: lang === "fr" ? "Fondée" : "Founded" },
    { value: "10K+", label: lang === "fr" ? "Clients" : "Customers" },
    { value: "500+", label: lang === "fr" ? "Produits" : "Products" },
    { value: "15+", label: lang === "fr" ? "Pays" : "Countries" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-wine-hero text-white grain-overlay">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/15 to-accent-light/10 blur-3xl"
          />
        </div>

        <div className="container-luxe relative py-20 md:py-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              {T.nav_shop}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{T.nav_about}</span>
          </nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-luxury text-accent text-sm font-medium mb-6"
            >
              <Globe className="w-4 h-4" />
              Montreal, Canada
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif font-bold mb-6"
            >
              {T.about_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              {T.about_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/">
                <Button
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  {T.about_cta}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-white/10">
          <div className="container-luxe py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={containerRef} className="py-20 overflow-hidden">
        <div className="container-luxe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-accent dark:text-accent">
                {T.our_story}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mt-2 mb-6">
                {lang === "fr"
                  ? "Une passion pour l'excellence"
                  : "A passion for excellence"}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>{T.about_p1}</p>
                <p>{T.about_p2}</p>
                <p>{T.about_p3}</p>
              </div>
            </motion.div>

            <motion.div style={{ y }} className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  alt="LuxeMode Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80"
                  alt="Fashion Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container-luxe">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-accent dark:text-accent">
              {T.our_mission}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mt-2">
              {T.about_values}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`
                    w-14 h-14 rounded-xl bg-gradient-to-r ${value.color}
                    flex items-center justify-center mb-6 shadow-lg
                  `}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-20">
        <div className="container-luxe">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-6">
                  <Leaf className="w-4 h-4" />
                  {lang === "fr" ? "Engagement responsable" : "Sustainable commitment"}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {lang === "fr"
                    ? "Mode responsable, style intemporel"
                    : "Responsible fashion, timeless style"}
                </h2>
                <p className="text-white/90 mb-6">
                  {lang === "fr"
                    ? "Nous nous engageons à réduire notre empreinte environnementale en utilisant des matériaux durables et des processus de fabrication éthiques."
                    : "We are committed to reducing our environmental footprint by using sustainable materials and ethical manufacturing processes."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    lang === "fr" ? "Coton biologique" : "Organic cotton",
                    lang === "fr" ? "Emballage recyclé" : "Recycled packaging",
                    lang === "fr" ? "Production locale" : "Local production",
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=800&q=80"
                  alt="Sustainable Fashion"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-wine-hero text-white grain-overlay relative">
        <div className="container-luxe text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {lang === "fr"
                ? "Prêt à découvrir notre collection ?"
                : "Ready to explore our collection?"}
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              {lang === "fr"
                ? "Parcourez notre sélection soigneusement curatée et trouvez les pièces qui correspondent à votre style."
                : "Browse our carefully curated selection and find the pieces that match your style."}
            </p>
            <Link to="/">
              <Button
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                {T.about_cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
