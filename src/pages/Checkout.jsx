import { useState } from "react";
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
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const FALLBACK_IMAGE = "https://picsum.photos/seed/checkout/200/300";

export default function Checkout() {
  const navigate = useNavigate();
  const { lang, cart, cartTotal, clearCart, addToast } = useApp();
  const T = STR[lang];

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form
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

  // Payment form
  const [payment, setPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Calculations
  const shippingCost = cartTotal > 100 ? 0 : 15;
  const tax = cartTotal * 0.15;
  const total = cartTotal + shippingCost + tax;

  // Validation
  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.email) newErrors.email = T.required_field;
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) newErrors.email = T.invalid_email;
    if (!shipping.firstName) newErrors.firstName = T.required_field;
    if (!shipping.lastName) newErrors.lastName = T.required_field;
    if (!shipping.address) newErrors.address = T.required_field;
    if (!shipping.city) newErrors.city = T.required_field;
    if (!shipping.postal) newErrors.postal = T.required_field;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!payment.cardNumber) newErrors.cardNumber = T.required_field;
    else if (payment.cardNumber.replace(/\s/g, "").length < 16) newErrors.cardNumber = T.invalid_card;
    if (!payment.cardName) newErrors.cardName = T.required_field;
    if (!payment.expiry) newErrors.expiry = T.required_field;
    if (!payment.cvv) newErrors.cvv = T.required_field;
    else if (payment.cvv.length < 3) newErrors.cvv = T.invalid_cvv;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
    } else if (step === 2 && validatePayment()) {
      setStep(3);
    }
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    addToast(T.order_confirmed, "success");
    navigate("/thanks");
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  // Format expiry
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const steps = [
    { num: 1, label: T.step1, icon: Truck },
    { num: 2, label: T.step2, icon: CreditCard },
    { num: 3, label: T.step3, icon: Check },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container-luxe">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white">
            {T.nav_shop}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cart" className="hover:text-gray-900 dark:hover:text-white">
            {T.cart}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            {T.checkout}
          </span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: step >= s.num ? 1 : 0.8 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  ${
                    step >= s.num
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }
                `}
              >
                <s.icon className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">{s.label}</span>
                <span className="sm:hidden font-medium">{s.num}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div
                  className={`
                    w-8 md:w-16 h-0.5 ml-4
                    ${step > s.num ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700"
                >
                  <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                    {T.shipping_address}
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label={T.email}
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      error={errors.email}
                      placeholder="email@example.com"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label={T.first}
                        value={shipping.firstName}
                        onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                        error={errors.firstName}
                      />
                      <Input
                        label={T.last}
                        value={shipping.lastName}
                        onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                        error={errors.lastName}
                      />
                    </div>

                    <Input
                      label={T.address}
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      error={errors.address}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label={T.city}
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        error={errors.city}
                      />
                      <Input
                        label={T.province}
                        value={shipping.province}
                        onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
                      />
                      <Input
                        label={T.postal}
                        value={shipping.postal}
                        onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
                        error={errors.postal}
                      />
                    </div>

                    <Input
                      label={T.phone}
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="+1 (514) 555-0123"
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Link to="/cart">
                      <Button variant="ghost" icon={ArrowLeft}>
                        {T.back_cart}
                      </Button>
                    </Link>
                    <Button
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={handleNextStep}
                      className="flex-1"
                    >
                      {T.continue}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700"
                >
                  <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                    {T.payment}
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label={T.card_number}
                      value={payment.cardNumber}
                      onChange={(e) =>
                        setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })
                      }
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      icon={CreditCard}
                    />

                    <Input
                      label={T.card_name}
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      error={errors.cardName}
                      placeholder="John Doe"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={T.exp}
                        value={payment.expiry}
                        onChange={(e) =>
                          setPayment({ ...payment, expiry: formatExpiry(e.target.value) })
                        }
                        error={errors.expiry}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Input
                        label={T.cvv}
                        value={payment.cvv}
                        onChange={(e) =>
                          setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "") })
                        }
                        error={errors.cvv}
                        placeholder="123"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="w-4 h-4" />
                    {T.secure_badge}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>
                      {T.back}
                    </Button>
                    <Button
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={handleNextStep}
                      className="flex-1"
                    >
                      {T.continue}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Shipping Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {T.shipping_address}
                      </h3>
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm text-accent dark:text-accent hover:underline"
                      >
                        {lang === "fr" ? "Modifier" : "Edit"}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {shipping.firstName} {shipping.lastName}<br />
                      {shipping.address}<br />
                      {shipping.city}, {shipping.province} {shipping.postal}<br />
                      {shipping.email}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {T.payment}
                      </h3>
                      <button
                        onClick={() => setStep(2)}
                        className="text-sm text-accent dark:text-accent hover:underline"
                      >
                        {lang === "fr" ? "Modifier" : "Edit"}
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {lang === "fr" ? "Carte" : "Card"} •••• {payment.cardNumber.slice(-4)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep(2)}>
                      {T.back}
                    </Button>
                    <Button
                      icon={Check}
                      iconPosition="right"
                      onClick={handleConfirmOrder}
                      loading={isProcessing}
                      className="flex-1"
                    >
                      {isProcessing ? T.processing : T.confirm_order}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {T.order_summary}
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
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
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.subtotal}</span>
                  <span>{formatPrice(cartTotal, lang)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.shipping}</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-medium" : ""}>
                    {shippingCost === 0 ? T.shipping_free : formatPrice(shippingCost, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{T.taxes}</span>
                  <span>{formatPrice(tax, lang)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>{T.total}</span>
                  <span>{formatPrice(total, lang)}</span>
                </div>
              </div>

              {/* Security */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {T.secure_badge}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
