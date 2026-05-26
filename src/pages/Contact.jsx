import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Mail, MapPin, Phone, Send, CheckCircle, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR } from "../data/translations";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import usePageMeta from "../hooks/usePageMeta";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { lang, addToast } = useApp();
  const T = STR[lang];
  const fr = lang === "fr";

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  usePageMeta({
    title: fr ? "Contact" : "Contact",
    description: fr
      ? "Contactez l'équipe LuxeMode. Réponse sous 24 h ouvrables."
      : "Contact the LuxeMode team. Response within 24 business hours.",
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = T.required_field;
    if (!form.email.trim()) e.email = T.required_field;
    else if (!EMAIL_RE.test(form.email)) e.email = T.invalid_email;
    if (!form.subject.trim()) e.subject = T.required_field;
    if (!form.message.trim() || form.message.trim().length < 10) {
      e.message = fr ? "Au moins 10 caractères" : "At least 10 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Demo: simulate API call. In production: POST to /api/contact or FormSpree/Resend.
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      addToast(fr ? "Message envoyé !" : "Message sent!", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      addToast(fr ? "Erreur d'envoi" : "Send error", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-12">
      <div className="container-luxe">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium">{T.contact_us}</span>
        </nav>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-3">
              {fr ? "Parlons" : "Get in touch"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              {fr
                ? "Une question, une demande personnalisée, un retour ? Notre équipe vous répond sous 24 h ouvrables."
                : "A question, a personalized request, feedback? Our team replies within 24 business hours."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            {/* Info */}
            <aside className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: fr ? "Courriel" : "Email",
                  value: "contact@luxemode.com",
                  href: "mailto:contact@luxemode.com",
                },
                {
                  icon: Phone,
                  title: fr ? "Téléphone" : "Phone",
                  value: "+1 (514) 555-0123",
                  href: "tel:+15145550123",
                },
                {
                  icon: MapPin,
                  title: fr ? "Atelier" : "Workshop",
                  value: "Montréal, QC, Canada",
                },
                {
                  icon: Clock,
                  title: fr ? "Horaires" : "Hours",
                  value: fr ? "Lun-Ven · 9 h–18 h (HE)" : "Mon-Fri · 9am–6pm (ET)",
                },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-luxury-charcoal/30 border border-gray-100 dark:border-luxury-charcoal">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-4 h-4 text-luxury-noir" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
                      {c.title}
                    </p>
                    {c.href ? (
                      <a href={c.href} className="text-sm font-medium text-gray-900 dark:text-white hover:text-accent transition-colors break-all">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-8 sm:p-12 border border-gray-100 dark:border-luxury-charcoal text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {fr ? "Message bien reçu !" : "Message received!"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {fr
                      ? "Notre équipe vous répondra sous 24 h ouvrables."
                      : "Our team will reply within 24 business hours."}
                  </p>
                  <Button onClick={() => setSent(false)} variant="secondary">
                    {fr ? "Envoyer un autre message" : "Send another message"}
                  </Button>
                </motion.div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-5 sm:p-8 border border-gray-100 dark:border-luxury-charcoal space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={fr ? "Nom complet" : "Full name"}
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      error={errors.name}
                    />
                    <Input
                      label={T.email}
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      error={errors.email}
                    />
                  </div>

                  <Input
                    label={fr ? "Sujet" : "Subject"}
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    error={errors.subject}
                  />

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Message <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-luxury-noir border-2 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors resize-y ${
                        errors.message ? "border-red-500" : "border-gray-200 dark:border-luxury-charcoal"
                      }`}
                    />
                    {errors.message && (
                      <p id="contact-message-error" role="alert" className="mt-1.5 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fr
                      ? "En soumettant, vous acceptez notre "
                      : "By submitting, you accept our "}
                    <Link to="/legal/privacy" className="text-accent underline hover:no-underline">
                      {fr ? "politique de confidentialité" : "privacy policy"}
                    </Link>
                    .
                  </p>

                  <Button type="submit" loading={submitting} icon={Send} iconPosition="right" fullWidth size="lg">
                    {submitting ? (fr ? "Envoi…" : "Sending…") : (fr ? "Envoyer le message" : "Send message")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
