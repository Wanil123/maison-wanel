import { useEffect, useId, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Truck,
  ShieldCheck,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { STR, formatPrice } from "../data/translations";
import { getProductFallback } from "../utils/imageFallback";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import usePageMeta from "../hooks/usePageMeta";

// Luhn validation for card numbers
const luhnCheck = (str) => {
  const digits = (str || "").replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const CA_POSTAL_RE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateExpiry = (val) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(val || "");
  if (!m) return { ok: false };
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return { ok: false };
  const now = new Date();
  const expiry = new Date(year, month, 0, 23, 59, 59);
  if (expiry < now) return { ok: false, expired: true };
  return { ok: true };
};

const CA_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "Colombie-Britannique" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "Nouveau-Brunswick" },
  { value: "NL", label: "Terre-Neuve-et-Labrador" },
  { value: "NS", label: "Nouvelle-Écosse" },
  { value: "NT", label: "Territoires du Nord-Ouest" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Île-du-Prince-Édouard" },
  { value: "QC", label: "Québec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const {
    lang, cart, cartTotal, cartShipping, cartTax, cartGrandTotal,
    clearCart, addToast,
  } = useApp();
  const T = STR[lang];

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const termsId = useId();
  const provinceId = useId();

  const [shipping, setShipping] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    province: "QC",
    postal: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  usePageMeta({
    title: T.checkout,
    description:
      lang === "fr"
        ? "Finalisez votre commande LuxeMode en toute sécurité."
        : "Securely complete your LuxeMode order.",
  });

  // Empty cart guard — side effect lives in useEffect, NOT render.
  useEffect(() => {
    if (cart.length === 0) navigate("/cart", { replace: true });
  }, [cart.length, navigate]);

  if (cart.length === 0) return null;

  const validateShipping = () => {
    const e = {};
    if (!shipping.email.trim()) e.email = T.required_field;
    else if (!EMAIL_RE.test(shipping.email)) e.email = T.invalid_email;
    if (!shipping.firstName.trim()) e.firstName = T.required_field;
    if (!shipping.lastName.trim()) e.lastName = T.required_field;
    if (!shipping.address.trim()) e.address = T.required_field;
    if (!shipping.city.trim()) e.city = T.required_field;
    if (!shipping.postal.trim()) e.postal = T.required_field;
    else if (!CA_POSTAL_RE.test(shipping.postal)) e.postal = T.invalid_postal_ca;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!payment.cardNumber.trim()) e.cardNumber = T.required_field;
    else if (!luhnCheck(payment.cardNumber)) e.cardNumber = T.invalid_card_luhn;
    if (!payment.cardName.trim()) e.cardName = T.required_field;
    if (!payment.expiry.trim()) e.expiry = T.required_field;
    else {
      const exp = validateExpiry(payment.expiry);
      if (!exp.ok) e.expiry = exp.expired ? T.expired_card : T.invalid_expiry;
    }
    if (!payment.cvv.trim()) e.cvv = T.required_field;
    else if (payment.cvv.length < 3) e.cvv = T.invalid_cvv;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === 2 && validatePayment()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirmOrder = async () => {
    if (!acceptTerms) {
      setErrors({ terms: T.must_accept_terms });
      addToast(T.must_accept_terms, "error");
      return;
    }
    setErrors({});
    setIsProcessing(true);
    try {
      // Simulated API call.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const orderNumber = `LM-${Date.now().toString().slice(-8)}`;
      // Persist order context for /thanks page (resists refresh and direct access).
      sessionStorage.setItem(
        "lm_last_order",
        JSON.stringify({
          orderNumber,
          email: shipping.email,
          name: `${shipping.firstName} ${shipping.lastName}`,
          total: cartGrandTotal,
          itemsCount: cart.reduce((sum, it) => sum + it.qty, 0),
          createdAt: new Date().toISOString(),
          lang,
        })
      );
      clearCart();
      addToast(T.order_confirmed, "success");
      navigate("/thanks", { replace: true });
    } catch {
      addToast(lang === "fr" ? "Une erreur est survenue" : "An error occurred", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    const match = v.match(/.{1,4}/g);
    return match ? match.join(" ") : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 2) return v.substring(0, 2) + "/" + v.substring(2);
    return v;
  };

  const steps = [
    { num: 1, label: T.step1, icon: Truck },
    { num: 2, label: T.step2, icon: CreditCard },
    { num: 3, label: T.step3, icon: Check },
  ];

  return (
    <div className="min-h-screen py-4 sm:py-8">
      <div className="container-luxe">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-8" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white">{T.nav_shop}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <Link to="/cart" className="hover:text-gray-900 dark:hover:text-white">{T.cart}</Link>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span className="text-gray-900 dark:text-white font-medium" aria-current="page">{T.checkout}</span>
        </nav>

        <ol className="flex items-center justify-center gap-2 md:gap-8 mb-6 sm:mb-12" aria-label="Étapes du paiement">
          {steps.map((s, i) => (
            <li key={s.num} className="flex items-center">
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: step >= s.num ? 1 : 0.85 }}
                aria-current={step === s.num ? "step" : undefined}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  ${
                    step >= s.num
                      ? "bg-luxury-charcoal dark:bg-accent text-accent dark:text-luxury-noir"
                      : "bg-gray-200 dark:bg-luxury-charcoal/40 text-gray-500"
                  }
                `}
              >
                <s.icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium">{s.label}</span>
                <span className="sm:hidden font-medium">{s.num}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 md:w-16 h-0.5 ml-4 ${step > s.num ? "bg-luxury-charcoal dark:bg-accent" : "bg-gray-200 dark:bg-luxury-charcoal/40"}`}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-luxury-charcoal"
                  aria-labelledby="shipping-heading"
                >
                  <h2 id="shipping-heading" className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                    {T.shipping_address}
                  </h2>

                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} noValidate className="space-y-4">
                    <Input
                      label={T.email}
                      type="email"
                      autoComplete="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      error={errors.email}
                      placeholder="email@example.com"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={T.first}
                        autoComplete="given-name"
                        required
                        value={shipping.firstName}
                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                        error={errors.firstName}
                      />
                      <Input
                        label={T.last}
                        autoComplete="family-name"
                        required
                        value={shipping.lastName}
                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                        error={errors.lastName}
                      />
                    </div>

                    <Input
                      label={T.address}
                      autoComplete="street-address"
                      required
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      error={errors.address}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label={T.city}
                        autoComplete="address-level2"
                        required
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        error={errors.city}
                      />

                      <div>
                        <label
                          htmlFor={provinceId}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                        >
                          {T.province}
                          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                        </label>
                        <select
                          id={provinceId}
                          required
                          value={shipping.province}
                          autoComplete="address-level1"
                          onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-luxury-noir border-2 border-gray-200 dark:border-luxury-charcoal text-gray-900 dark:text-white focus:outline-none focus:border-accent focus:shadow-lg focus:shadow-accent/10"
                        >
                          {CA_PROVINCES.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label={T.postal}
                        autoComplete="postal-code"
                        required
                        value={shipping.postal}
                        onChange={(e) => setShipping({ ...shipping, postal: e.target.value.toUpperCase() })}
                        error={errors.postal}
                        placeholder="H2X 1Y4"
                      />
                    </div>

                    <Input
                      label={T.phone}
                      type="tel"
                      autoComplete="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+1 (514) 555-0123"
                    />

                    <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                      <Link to="/cart">
                        <Button variant="ghost" icon={ArrowLeft}>
                          {T.back_cart}
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="flex-1"
                      >
                        {T.continue}
                      </Button>
                    </div>
                  </form>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-luxury-charcoal"
                  aria-labelledby="payment-heading"
                >
                  <h2 id="payment-heading" className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                    {T.payment}
                  </h2>

                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} noValidate className="space-y-4">
                    <Input
                      label={T.card_number}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      required
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={23}
                      icon={CreditCard}
                    />

                    <Input
                      label={T.card_name}
                      autoComplete="cc-name"
                      required
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      error={errors.cardName}
                      placeholder="John Doe"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={T.exp}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        required
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                        error={errors.expiry}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Input
                        label={T.cvv}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        required
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                      <Lock className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                      {T.secure_badge}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-4 mt-8">
                      <Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>
                        {T.back}
                      </Button>
                      <Button
                        type="submit"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="flex-1"
                      >
                        {T.continue}
                      </Button>
                    </div>
                  </form>
                </motion.section>
              )}

              {step === 3 && (
                <motion.section
                  key="confirmation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                  aria-labelledby="confirmation-heading"
                >
                  <h2 id="confirmation-heading" className="sr-only">{T.step3}</h2>

                  <div className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-6 border border-gray-100 dark:border-luxury-charcoal">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{T.shipping_address}</h3>
                      <button type="button" onClick={() => setStep(1)} className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                        {lang === "fr" ? "Modifier" : "Edit"}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {shipping.firstName} {shipping.lastName}<br />
                      {shipping.address}<br />
                      {shipping.city}, {shipping.province} {shipping.postal}<br />
                      {shipping.email}{shipping.phone && <> • {shipping.phone}</>}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-luxury-charcoal/40 rounded-2xl p-6 border border-gray-100 dark:border-luxury-charcoal">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{T.payment}</h3>
                      <button type="button" onClick={() => setStep(2)} className="text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
                        {lang === "fr" ? "Modifier" : "Edit"}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 inline-flex items-center gap-2">
                      <CreditCard className="w-4 h-4" aria-hidden="true" />
                      {lang === "fr" ? "Carte" : "Card"} •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}
                    </p>
                  </div>

                  <label htmlFor={termsId} className="flex items-start gap-3 cursor-pointer bg-gray-50 dark:bg-luxury-charcoal/30 rounded-2xl p-4 border border-gray-100 dark:border-luxury-charcoal">
                    <input
                      id={termsId}
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      aria-describedby={errors.terms ? `${termsId}-error` : undefined}
                      aria-invalid={errors.terms ? true : undefined}
                      className="mt-1 w-5 h-5 rounded text-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {T.accept_terms}{" "}
                      <Link to="/about#terms" className="text-accent underline hover:no-underline">
                        {T.terms_link}
                      </Link>{" "}
                      {T.and}{" "}
                      <Link to="/about#privacy" className="text-accent underline hover:no-underline">
                        {T.privacy_link}
                      </Link>.
                    </span>
                  </label>
                  {errors.terms && (
                    <p id={`${termsId}-error`} role="alert" className="text-sm text-red-500">
                      {errors.terms}
                    </p>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row gap-4">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(2)} disabled={isProcessing}>
                      {T.back}
                    </Button>
                    <Button
                      icon={Check}
                      iconPosition="right"
                      onClick={handleConfirmOrder}
                      loading={isProcessing}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? T.processing : T.confirm_order}
                    </Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-1" aria-label={T.order_summary}>
            <div className="sticky top-24 bg-gray-50 dark:bg-luxury-charcoal/30 rounded-2xl p-6 border border-gray-100 dark:border-luxury-charcoal">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                {T.order_summary}
              </h2>

              <ul className="space-y-4 mb-6">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-luxury-noir flex-shrink-0">
                      <img
                        src={item.image}
                        alt=""
                        width={64}
                        height={80}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getProductFallback({ seed: item.id, label: item.name[lang], category: item.category[lang], w: 128, h: 160 });
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {item.name[lang]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.qty} × {formatPrice(item.price, lang)}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.qty, lang)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 text-sm border-t border-gray-200 dark:border-luxury-charcoal pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.subtotal}</dt>
                  <dd>{formatPrice(cartTotal, lang)}</dd>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.shipping}</dt>
                  <dd className={cartShipping === 0 ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
                    {cartShipping === 0 ? T.shipping_free : formatPrice(cartShipping, lang)}
                  </dd>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <dt>{T.taxes}</dt>
                  <dd>{formatPrice(cartTax, lang)}</dd>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-luxury-charcoal">
                  <dt>{T.total}</dt>
                  <dd>{formatPrice(cartGrandTotal, lang)}</dd>
                </div>
              </dl>

              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                {T.secure_badge}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
