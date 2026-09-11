"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import B2BApplicationSuccess from "@/components/b2b/B2BApplicationSuccess";

// ─── Constants ──────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  { value: "DISTRIBUTOR", label: "Distributor" },
  { value: "WHOLESALER", label: "Wholesaler" },
  { value: "RETAILER", label: "Retailer" },
  { value: "IMPORTER", label: "Importer" },
  { value: "ONLINE_SELLER", label: "Online Seller" },
  { value: "PRIVATE_LABEL_BUYER", label: "Private Label Buyer" },
  { value: "CORPORATE_BUYER", label: "Corporate Buyer" },
  { value: "INSTITUTIONAL_BUYER", label: "Institutional Buyer" },
  { value: "SALON_SPA", label: "Salon / Spa" },
  { value: "OTHER", label: "Other" },
];

const ORDER_VOLUMES = [
  { value: "LESS_THAN_100", label: "Less than 100 units / month" },
  { value: "FROM_100_TO_500", label: "100–500 units / month" },
  { value: "FROM_500_TO_1000", label: "500–1,000 units / month" },
  { value: "FROM_1000_TO_5000", label: "1,000–5,000 units / month" },
  { value: "MORE_THAN_5000", label: "5,000+ units / month" },
  { value: "CUSTOM_PROJECT", label: "Custom / Project-Based Order" },
];

const MONTHLY_VALUES = [
  "Under NPR 50,000",
  "NPR 50,000 – 1,00,000",
  "NPR 1,00,000 – 5,00,000",
  "NPR 5,00,000 – 10,00,000",
  "NPR 10,00,000+",
  "Not sure yet",
];

const PRODUCT_CATEGORIES = [
  "Complete Product Catalog",
  "Ayurvedic Oils & Extracts",
  "Herbal Teas & Infusions",
  "Incense & Resins",
  "Natural Skincare",
  "Hair Care",
  "Wellness Supplements",
  "Bulk / Wholesale Products",
  "Private Label / Custom Products",
];

const COMMUNICATION_CHANNELS = [
  { value: "WHATSAPP", label: "WhatsApp", icon: "chat" },
  { value: "PHONE", label: "Phone Call", icon: "phone" },
  { value: "EMAIL", label: "Email", icon: "mail" },
  { value: "WHATSAPP_EMAIL", label: "WhatsApp + Email", icon: "forum" },
];

// ─── Reusable Form Components ───────────────────────────────────────────────

function FormSection({ icon, title, subtitle, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-forest-base/10 flex items-center justify-center">
          <Icon name={icon} size={20} className="text-forest-base" />
        </div>
        <div>
          <h2 className="text-lg font-headline text-forest-deep">{title}</h2>
          {subtitle && <p className="text-xs text-on-surface-variant">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function FormField({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-forest-deep mb-1.5">
        {label}
        {required && <span className="text-terracotta ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ id, type = "text", value, onChange, placeholder, ...rest }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-forest-base/20 focus:border-forest-base/40 transition-shadow"
      {...rest}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-forest-base/20 focus:border-forest-base/40 transition-shadow"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-forest-base/20 focus:border-forest-base/40 transition-shadow resize-y"
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function B2BApplicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [existingApp, setExistingApp] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [errors, setErrors] = useState({});

  // Form state
  const [form, setForm] = useState({
    contactPerson: "",
    companyName: "",
    countryOfOp: "Nepal",
    businessType: "",
    phone: "",
    businessEmail: "",
    productsOfInterest: [],
    customProductNote: "",
    estimatedVolume: "",
    estimatedMonthlyValue: "",
    targetCountry: "Nepal",
    targetProvince: "",
    targetCity: "",
    targetTerritory: "",
    customMessage: "",
    preferredChannel: "EMAIL",
  });

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || session.user.name || "",
        businessEmail: prev.businessEmail || session.user.email || "",
      }));
    }
  }, [session]);

  // Check for existing application
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/b2b/application");
        const data = await res.json();
        if (data.application) {
          setExistingApp(data.application);
        }
      } catch {}
      setCheckingExisting(false);
    }
    if (status === "authenticated") check();
    else if (status !== "loading") setCheckingExisting(false);
  }, [status]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleProduct(product) {
    setForm((prev) => {
      const list = prev.productsOfInterest.includes(product)
        ? prev.productsOfInterest.filter((p) => p !== product)
        : [...prev.productsOfInterest, product];
      return { ...prev, productsOfInterest: list };
    });
  }

  function validate() {
    const e = {};
    if (!form.contactPerson.trim()) e.contactPerson = "Required";
    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.countryOfOp.trim()) e.countryOfOp = "Required";
    if (!form.businessType) e.businessType = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^[\d+\-\s()]{7,20}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.businessEmail.trim()) e.businessEmail = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.businessEmail))
      e.businessEmail = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/b2b/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        else setErrors({ _form: data.error || "Something went wrong" });
        return;
      }

      setReferenceNumber(data.referenceNumber);
      setSubmitted(true);
    } catch {
      setErrors({ _form: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  // ─── Loading / Auth states ────────────────────────────────────────────────

  if (status === "loading" || checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Icon name="hourglass_empty" size={24} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login?callbackUrl=/b2b/apply");
    return null;
  }

  // Already submitted
  if (submitted) {
    return <B2BApplicationSuccess referenceNumber={referenceNumber} />;
  }

  // Has existing application
  if (existingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-antique-gold/10 flex items-center justify-center mb-4">
            <Icon name="info" size={32} className="text-antique-gold" />
          </div>
          <h1 className="font-headline text-2xl text-forest-deep mb-2">
            Application Already Submitted
          </h1>
          <p className="text-sm text-on-surface-variant mb-4">
            You have already submitted a B2B application.
          </p>
          <div className="inline-flex items-center gap-2 bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 mb-6">
            <Icon name="tag" size={16} className="text-antique-gold" />
            <span className="text-sm font-bold text-forest-deep">
              {existingApp.referenceNumber}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-antique-gold px-2 py-0.5 bg-antique-gold/10 rounded">
              {existingApp.status}
            </span>
          </div>
          {existingApp.organization && (
            <div className="mb-4">
              <a
                href="/b2b"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded font-semibold text-sm hover:bg-forest-deep transition-colors"
              >
                <Icon name="dashboard" size={16} />
                Go to B2B Portal
              </a>
            </div>
          )}
          <a
            href="/"
            className="text-sm text-forest-deep hover:text-antique-gold font-semibold"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    );
  }

  // ─── Main Form ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-forest-deep text-ivory-canvas py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-widest uppercase text-antique-gold mb-4">
            <Icon name="handshake" size={14} />
            B2B Partnership
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl mb-3">
            Commercial Partnership Application
          </h1>
          <p className="text-ivory-canvas/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Please submit your business profile. Commercial pricing, minimum order
            quantities, and B2B terms will be shared after verification.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {errors._form && (
          <div className="mb-6 px-4 py-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-2 text-sm text-error" role="alert">
            <Icon name="error" size={18} />
            {errors._form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Business Identification */}
          <FormSection icon="business" title="Business Identification" subtitle="Tell us about your company">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Full Name / Contact Person" required error={errors.contactPerson}>
                <TextInput
                  value={form.contactPerson}
                  onChange={(e) => setField("contactPerson", e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </FormField>

              <FormField label="Company / Enterprise Name" required error={errors.companyName}>
                <TextInput
                  value={form.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                  placeholder="Company name"
                  autoComplete="organization"
                />
              </FormField>

              <FormField label="Country of Operation" required error={errors.countryOfOp}>
                <TextInput
                  value={form.countryOfOp}
                  onChange={(e) => setField("countryOfOp", e.target.value)}
                  placeholder="Nepal"
                  autoComplete="country-name"
                />
              </FormField>

              <FormField label="Business Type" required error={errors.businessType}>
                <SelectInput
                  value={form.businessType}
                  onChange={(e) => setField("businessType", e.target.value)}
                  options={BUSINESS_TYPES}
                  placeholder="Select business type"
                />
              </FormField>

              <FormField label="Phone / WhatsApp Number" required error={errors.phone}>
                <TextInput
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  autoComplete="tel"
                />
              </FormField>

              <FormField label="Business Email Address" required error={errors.businessEmail}>
                <TextInput
                  type="email"
                  value={form.businessEmail}
                  onChange={(e) => setField("businessEmail", e.target.value)}
                  placeholder="business@company.com"
                  autoComplete="email"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Section 2: Products & Requirements */}
          <FormSection icon="inventory_2" title="Products & Requirements" subtitle="Select products or categories you are interested in">
            <div className="flex flex-wrap gap-2 mb-4">
              {PRODUCT_CATEGORIES.map((cat) => {
                const selected = form.productsOfInterest.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleProduct(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selected
                        ? "bg-forest-base text-ivory-canvas border-forest-base"
                        : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/60 hover:border-forest-base/40"
                    }`}
                  >
                    <Icon
                      name={selected ? "check_circle" : "add_circle"}
                      size={16}
                      filled={selected}
                    />
                    {cat}
                  </button>
                );
              })}
            </div>

            <FormField label="Additional Product Notes" hint="Describe specific products, private label requirements, or custom needs">
              <TextArea
                value={form.customProductNote}
                onChange={(e) => setField("customProductNote", e.target.value)}
                placeholder="e.g., Looking for private label organic hair oil in 100ml bottles..."
                rows={3}
              />
            </FormField>
          </FormSection>

          {/* Section 3: Estimated Order Volume */}
          <FormSection icon="analytics" title="Estimated Order Volume">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Estimated Order Volume">
                <SelectInput
                  value={form.estimatedVolume}
                  onChange={(e) => setField("estimatedVolume", e.target.value)}
                  options={ORDER_VOLUMES}
                  placeholder="Select volume range"
                />
              </FormField>

              <FormField label="Estimated Monthly Purchase Value">
                <SelectInput
                  value={form.estimatedMonthlyValue}
                  onChange={(e) => setField("estimatedMonthlyValue", e.target.value)}
                  options={MONTHLY_VALUES.map((v) => ({ value: v, label: v }))}
                  placeholder="Select value range"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Section 4: Target Market */}
          <FormSection icon="public" title="Target Market / Distribution Territory">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <FormField label="Country">
                <TextInput
                  value={form.targetCountry}
                  onChange={(e) => setField("targetCountry", e.target.value)}
                  placeholder="Nepal"
                />
              </FormField>

              <FormField label="Province / State">
                <TextInput
                  value={form.targetProvince}
                  onChange={(e) => setField("targetProvince", e.target.value)}
                  placeholder="e.g., Bagmati"
                />
              </FormField>

              <FormField label="City">
                <TextInput
                  value={form.targetCity}
                  onChange={(e) => setField("targetCity", e.target.value)}
                  placeholder="e.g., Kathmandu"
                />
              </FormField>

              <FormField label="Distribution Territory">
                <TextInput
                  value={form.targetTerritory}
                  onChange={(e) => setField("targetTerritory", e.target.value)}
                  placeholder="e.g., Entire Nepal, South Asia"
                />
              </FormField>
            </div>

            <FormField label="Specific Requirements / Custom Message" hint="Bulk, private label, packaging, distribution, or any other commercial requirements">
              <TextArea
                value={form.customMessage}
                onChange={(e) => setField("customMessage", e.target.value)}
                placeholder="Describe your business requirements, expected order details, special packaging needs, or anything else relevant..."
                rows={5}
              />
            </FormField>
          </FormSection>

          {/* Section 5: Preferred Communication */}
          <FormSection icon="forum" title="Preferred Communication Channel">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {COMMUNICATION_CHANNELS.map((ch) => {
                const selected = form.preferredChannel === ch.value;
                return (
                  <button
                    key={ch.value}
                    type="button"
                    onClick={() => setField("preferredChannel", ch.value)}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border text-sm font-medium transition-all ${
                      selected
                        ? "bg-forest-base/5 border-forest-base text-forest-deep ring-2 ring-forest-base/20"
                        : "bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:border-forest-base/30"
                    }`}
                  >
                    <Icon name={ch.icon} size={22} className={selected ? "text-forest-base" : ""} />
                    {ch.label}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* Submit */}
          <div className="border-t border-outline-variant/40 pt-6 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded-xl font-semibold text-sm hover:bg-forest-deep active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon name="hourglass_empty" size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icon name="send" size={18} />
                  Submit B2B Enquiry
                </>
              )}
            </button>

            <p className="text-xs text-on-surface-variant mt-3">
              By submitting, you agree to our terms of commercial partnership. Your
              information will be reviewed and kept confidential.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
