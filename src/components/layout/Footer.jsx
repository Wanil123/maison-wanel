import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";

export default function Footer() {
  const { lang, dark } = useApp();
  const T = STR[lang];
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: lang === "fr" ? "Boutique" : "Shop",
      links: [
        { label: lang === "fr" ? "Nouveautés" : "New Arrivals", to: "/" },
        { label: lang === "fr" ? "Bestsellers" : "Bestsellers", to: "/" },
        { label: lang === "fr" ? "Collections" : "Collections", to: "/" },
        { label: lang === "fr" ? "Soldes" : "Sale", to: "/" },
      ],
    },
    {
      title: lang === "fr" ? "Aide" : "Help",
      links: [
        { label: T.footer_links_delivery, to: "/" },
        { label: T.footer_links_returns, to: "/" },
        { label: T.footer_links_faq, to: "/" },
        { label: lang === "fr" ? "Tailles" : "Size Guide", to: "/" },
      ],
    },
    {
      title: lang === "fr" ? "Entreprise" : "Company",
      links: [
        { label: T.nav_about, to: "/about" },
        { label: lang === "fr" ? "Carrières" : "Careers", to: "/" },
        { label: T.footer_links_terms, to: "/" },
        { label: T.footer_links_privacy, to: "/" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container-luxe py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 dark:bg-accent/20 text-accent-dark dark:text-accent text-sm font-medium mb-4"
            >
              <Mail className="w-4 h-4" />
              {T.footer_newsletter}
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-3"
            >
              {lang === "fr" ? "Restez informé" : "Stay in the loop"}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 mb-6"
            >
              {T.footer_newsletter_desc}
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={T.footer_email_placeholder}
                  className="w-full px-5 py-3.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-luxury-charcoal to-luxury-wine dark:from-accent dark:to-accent-light text-white dark:text-luxury-noir font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                {subscribed ? (
                  lang === "fr" ? "Merci !" : "Thanks!"
                ) : (
                  <>
                    {T.footer_subscribe}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxe py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-luxury-charcoal dark:bg-accent flex items-center justify-center text-accent dark:text-luxury-noir font-serif font-bold shadow-lg border border-accent/20">
                LM
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {T.brand}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {T.tagline}
                </div>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              {lang === "fr"
                ? "Mode premium et accessible. Qualité exceptionnelle, design intemporel."
                : "Premium and accessible fashion. Exceptional quality, timeless design."}
            </p>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Montreal, QC, Canada</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span>contact@luxemode.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <span>+1 (514) 555-0123</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent/10 dark:hover:bg-accent/20 hover:text-accent dark:hover:text-accent transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container-luxe py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © 2026 {T.brand}. {T.footer_copyright}
            </p>
            <p className="flex items-center gap-1">
              {T.footer_made_by}{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline mx-1" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Wanil Parfait
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
