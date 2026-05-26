import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { STR } from "../../data/translations";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const { lang, addToast } = useApp();
  const T = STR[lang];
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError(T.required_field);
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError(T.invalid_email);
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
    addToast(lang === "fr" ? "Merci pour votre inscription !" : "Thanks for subscribing!", "success");
    setTimeout(() => setSubscribed(false), 4000);
  };

  // Sections: keep About (real page). Remaining links scroll to home with a marker
  // so users don't land on broken pages. Categories link to filtered shop.
  const footerSections = [
    {
      title: lang === "fr" ? "Boutique" : "Shop",
      links: [
        { label: lang === "fr" ? "Toutes les pièces" : "All pieces", to: "/" },
        { label: lang === "fr" ? "Femme" : "Women", to: "/?g=femme" },
        { label: lang === "fr" ? "Homme" : "Men", to: "/?g=homme" },
        { label: lang === "fr" ? "Enfant" : "Children", to: "/?g=enfant" },
      ],
    },
    {
      title: lang === "fr" ? "Aide & Service" : "Help & Service",
      links: [
        { label: T.contact_us, to: "/contact" },
        { label: T.footer_links_faq, to: "/faq" },
        { label: T.footer_links_delivery, to: "/legal/shipping" },
        { label: T.footer_links_returns, to: "/legal/returns" },
      ],
    },
    {
      title: lang === "fr" ? "Entreprise" : "Company",
      links: [
        { label: T.nav_about, to: "/about" },
        { label: T.footer_links_terms, to: "/legal/terms" },
        { label: T.footer_links_privacy, to: "/legal/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/", label: "Facebook" },
    { icon: Mail, href: "mailto:contact@luxemode.com", label: "Email", isMail: true },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-luxury-noir border-t border-gray-200 dark:border-luxury-charcoal" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {lang === "fr" ? "Pied de page" : "Footer"}
      </h2>

      {/* Newsletter Section */}
      <div className="border-b border-gray-200 dark:border-luxury-charcoal">
        <div className="container-luxe py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 dark:bg-accent/15 text-accent-dark dark:text-accent text-sm font-medium mb-4"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
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
              noValidate
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              aria-describedby={emailError ? `${emailId}-error` : undefined}
            >
              <div className="relative flex-1 text-left">
                <label htmlFor={emailId} className="sr-only">
                  {T.footer_email_placeholder}
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                  placeholder={T.footer_email_placeholder}
                  autoComplete="email"
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? `${emailId}-error` : undefined}
                  required
                  className={`
                    w-full px-5 py-3.5 rounded-xl bg-white dark:bg-luxury-charcoal/60 border-2
                    ${emailError ? "border-red-500" : "border-gray-200 dark:border-luxury-charcoal"}
                    text-gray-900 dark:text-white placeholder-gray-400
                    focus:outline-none focus:border-accent transition-colors
                  `}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={subscribed}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-luxury-charcoal to-luxury-wine dark:from-accent dark:to-accent-light text-accent dark:text-luxury-noir font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-80"
              >
                {subscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    {lang === "fr" ? "Merci !" : "Thanks!"}
                  </>
                ) : (
                  <>
                    {T.footer_subscribe}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {emailError && (
              <p id={`${emailId}-error`} role="alert" className="mt-3 text-sm text-red-500">
                {emailError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxe py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4" aria-label="LuxeMode — Accueil">
              <div className="w-11 h-11 rounded-xl bg-luxury-charcoal dark:bg-accent flex items-center justify-center text-accent dark:text-luxury-noir font-serif font-bold shadow-lg border border-accent/20">
                LM
              </div>
              <div>
                <div className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                  {T.brand}
                </div>
                <div className="text-xs text-accent uppercase tracking-[0.2em]">
                  {T.tagline}
                </div>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm leading-relaxed">
              {lang === "fr"
                ? "Mode premium et accessible. Qualité exceptionnelle, design intemporel."
                : "Premium and accessible fashion. Exceptional quality, timeless design."}
            </p>

            <address className="space-y-3 text-sm text-gray-600 dark:text-gray-400 not-italic">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <span>Montréal, QC, Canada</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <a href="mailto:contact@luxemode.com" className="hover:text-accent transition-colors">
                  contact@luxemode.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" aria-hidden="true" />
                <a href="tel:+15145550123" className="hover:text-accent transition-colors">
                  +1 (514) 555-0123
                </a>
              </div>
            </address>

            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.isMail ? undefined : "_blank"}
                  rel={social.isMail ? undefined : "noopener noreferrer"}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-luxury-charcoal/60 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-accent/10 dark:hover:bg-accent/15 hover:text-accent dark:hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={`${social.label} — ${lang === "fr" ? "ouvre dans un nouvel onglet" : "opens in a new tab"}`}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-serif font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-gray-600 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods strip */}
      <div className="border-t border-gray-200 dark:border-luxury-charcoal">
        <div className="container-luxe py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              {lang === "fr" ? "Paiements sécurisés" : "Secure payments"}
            </p>
            <div className="flex items-center gap-2" aria-label={lang === "fr" ? "Moyens de paiement acceptés" : "Accepted payment methods"}>
              {["VISA", "MASTERCARD", "AMEX", "APPLE PAY", "PAYPAL"].map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1.5 text-[10px] font-bold tracking-[0.15em] rounded-md border border-gray-300 dark:border-luxury-charcoal text-gray-600 dark:text-gray-400 bg-white dark:bg-luxury-charcoal/40"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-luxury-charcoal">
        <div className="container-luxe py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>
              © {CURRENT_YEAR} {T.brand}. {T.footer_copyright}
            </p>
            <p className="flex items-center gap-1">
              {T.footer_made_by}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline mx-1" aria-hidden="true" />
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
