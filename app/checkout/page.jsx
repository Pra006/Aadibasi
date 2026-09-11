import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { formatNPR } from "@/lib/utils";
import { products } from "@/lib/data";

export const metadata = { title: "Checkout" };

const steps = ["Address", "Delivery", "Review", "Payment"];

function Field({ label, ...rest }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{label}</span>
      <input
        {...rest}
        className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2.5 text-sm outline-none focus:border-antique-gold"
      />
    </label>
  );
}

export default function CheckoutPage() {
  const items = [
    { p: products[0], qty: 1, price: 1499 },
    { p: products[1], qty: 1, price: 4200 },
    { p: products[2], qty: 2, price: 1250 },
  ];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + shipping + tax;

  return (
    <StorefrontShell>
      <Section className="py-8">
        {/* Steps */}
        <ol className="flex items-center gap-2 sm:gap-4 justify-center flex-wrap">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 sm:gap-4">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  i === 0
                    ? "bg-forest-base text-antique-gold border-forest-base"
                    : "bg-surface-container border-outline-variant text-on-surface-variant"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold uppercase tracking-widest ${
                  i === 0 ? "text-forest-deep" : "text-on-surface-variant"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && <span className="w-6 h-px bg-outline-variant" />}
            </li>
          ))}
        </ol>

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
              <h2 className="font-headline text-xl text-forest-deep">Shipping Address</h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" placeholder="Prakash Adhikari" />
                <Field label="Phone" placeholder="98XXXXXXXX" />
                <Field label="Email" placeholder="you@example.com" />
                <Field label="Province" placeholder="Bagmati" />
                <Field label="City" placeholder="Kathmandu" />
                <Field label="Postal Code" placeholder="44600" />
                <div className="sm:col-span-2">
                  <Field label="Street Address" placeholder="Ward 5, Baluwatar" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Delivery Instructions (optional)" placeholder="Landmark, gate colour…" />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
              <h2 className="font-headline text-xl text-forest-deep">Delivery Method</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["standard", "Standard Delivery (3–5 days)", "Free above NPR 2,999", true],
                  ["express", "Express Delivery (1–2 days)", "NPR 250", false],
                  ["cod", "Cash on Delivery", "Available inside valley", false],
                ].map(([id, name, sub, checked]) => (
                  <label
                    key={id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${
                      checked ? "border-antique-gold bg-antique-gold/5" : "border-outline-variant"
                    }`}
                  >
                    <input type="radio" name="ship" defaultChecked={checked} className="text-forest-base" />
                    <div className="flex-1">
                      <div className="font-semibold text-forest-deep">{name}</div>
                      <div className="text-xs text-on-surface-variant">{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
              <h2 className="font-headline text-xl text-forest-deep">Payment</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  ["esewa", "eSewa", "account_balance_wallet"],
                  ["khalti", "Khalti", "account_balance_wallet"],
                  ["cod", "Cash on Delivery", "payments"],
                  ["bank", "Bank Transfer", "account_balance"],
                ].map(([id, label, icon]) => (
                  <label
                    key={id}
                    className="flex items-center gap-3 p-4 rounded-lg border border-outline-variant cursor-pointer hover:border-antique-gold"
                  >
                    <input type="radio" name="pay" className="text-forest-base" />
                    <Icon name={icon} size={20} className="text-antique-gold" />
                    <span className="font-semibold text-forest-deep">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 self-start bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
            <h2 className="font-headline text-xl text-forest-deep">Order Review</h2>
            <ul className="mt-4 divide-y divide-outline-variant/60">
              {items.map((it) => (
                <li key={it.p.id} className="py-3 flex gap-3">
                  <img src={it.p.images[0]} alt="" className="w-14 h-14 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-forest-deep line-clamp-1">{it.p.name}</div>
                    <div className="text-xs text-on-surface-variant">Qty {it.qty}</div>
                  </div>
                  <div className="text-sm font-semibold text-forest-deep">{formatNPR(it.price * it.qty)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatNPR(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>Free</dd></div>
              <div className="flex justify-between"><dt>VAT (13%)</dt><dd>{formatNPR(tax)}</dd></div>
              <div className="border-t border-outline-variant pt-2 mt-2 flex justify-between items-baseline">
                <dt className="font-semibold text-forest-deep">Total</dt>
                <dd className="font-headline text-2xl text-forest-deep">{formatNPR(total)}</dd>
              </div>
            </dl>
            <Button size="lg" className="w-full mt-6">Place Order</Button>
            <p className="mt-3 text-[11px] text-on-surface-variant text-center">
              By placing your order, you agree to Hakkiveda's Terms and acknowledge the Privacy Policy.
            </p>
          </aside>
        </div>
      </Section>
    </StorefrontShell>
  );
}
