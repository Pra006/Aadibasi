import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { formatNPR } from "@/lib/utils";
import { products, getVendor } from "@/lib/data";

// Group demo cart items by vendor
const cartItems = [
  { product: products[0], variantSize: "200ml", price: 1499, qty: 1 },
  { product: products[1], variantSize: "Standard", price: 4200, qty: 1 },
  { product: products[2], variantSize: "500g", price: 1250, qty: 2 },
];

function VendorGroup({ vendor, items }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-forest-base/5 border-b border-outline-variant/60">
        <div className="flex items-center gap-3">
          <img src={vendor.logo} alt="" className="w-10 h-10 rounded-full object-cover border border-antique-gold/40" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-forest-deep">{vendor.name}</span>
              <Icon name="verified" size={14} className="text-antique-gold" />
            </div>
            <div className="text-xs text-on-surface-variant">
              {items.length} item{items.length > 1 ? "s" : ""} · {vendor.location}
            </div>
          </div>
        </div>
        <div className="text-xs text-forest-deep font-semibold">
          Subtotal: {formatNPR(subtotal)}
        </div>
      </div>

      <ul className="divide-y divide-outline-variant/60">
        {items.map((it) => (
          <li key={it.product.id} className="p-4 flex gap-4">
            <Link href={`/products/${it.product.slug}`} className="shrink-0">
              <img src={it.product.images[0]} className="w-24 h-24 rounded-lg object-cover" alt="" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${it.product.slug}`}>
                <h3 className="font-semibold text-forest-deep leading-snug line-clamp-2 hover:text-forest-base">
                  {it.product.name}
                </h3>
              </Link>
              <div className="text-xs text-on-surface-variant mt-1">Size: {it.variantSize}</div>
              <div className="mt-2 flex items-center justify-between gap-4 flex-wrap">
                <div className="inline-flex items-center border border-outline-variant rounded overflow-hidden">
                  <button className="w-8 h-8 hover:bg-forest-base/5"><Icon name="remove" size={14} /></button>
                  <span className="w-10 text-center text-sm font-semibold">{it.qty}</span>
                  <button className="w-8 h-8 hover:bg-forest-base/5"><Icon name="add" size={14} /></button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-on-surface-variant hover:text-forest-deep inline-flex items-center gap-1">
                    <Icon name="bookmark" size={14} /> Save for later
                  </button>
                  <button className="text-xs text-terracotta hover:text-terracotta/80 inline-flex items-center gap-1">
                    <Icon name="delete" size={14} /> Remove
                  </button>
                </div>
                <div className="font-headline text-lg text-forest-deep">
                  {formatNPR(it.price * it.qty)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CartPage() {
  const byVendor = new Map();
  cartItems.forEach((i) => {
    const v = i.product.vendor;
    if (!byVendor.has(v)) byVendor.set(v, []);
    byVendor.get(v).push(i);
  });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 2999 ? 0 : 150;
  const tax = Math.round(subtotal * 0.13);
  const discount = 500;
  const total = subtotal + shipping + tax - discount;

  return (
    <StorefrontShell>
      <Section className="py-6">
        <nav className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-forest-deep font-semibold">Shopping Cart</span>
        </nav>
      </Section>

      <Section className="pb-16">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep">Your Bag</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {cartItems.length} items from {byVendor.size} B2B business{byVendor.size > 1 ? "es" : ""}
            </p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-forest-deep hover:text-antique-gold inline-flex items-center gap-1">
            <Icon name="arrow_back" size={16} /> Continue shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-5">
            {[...byVendor.entries()].map(([slug, items]) => (
              <VendorGroup key={slug} vendor={getVendor(slug)} items={items} />
            ))}
          </div>

          <aside className="self-start lg:sticky lg:top-24 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
            <h2 className="font-headline text-xl text-forest-deep">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-5 flex items-center gap-2">
              <input
                placeholder="Coupon code"
                className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-sm outline-none focus:border-antique-gold"
              />
              <button className="px-4 py-2.5 rounded bg-forest-base text-ivory-canvas text-sm font-semibold">
                Apply
              </button>
            </div>
            <p className="mt-2 text-xs text-herbal-jade flex items-center gap-1">
              <Icon name="check_circle" size={14} /> HARVEST500 applied — NPR 500 off
            </p>

            <dl className="mt-6 space-y-2.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <dt>Subtotal</dt>
                <dd className="text-forest-deep">{formatNPR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <dt>Coupon discount</dt>
                <dd className="text-terracotta">−{formatNPR(discount)}</dd>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <dt>Shipping</dt>
                <dd className="text-forest-deep">{shipping === 0 ? "Free" : formatNPR(shipping)}</dd>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <dt>VAT (13%)</dt>
                <dd className="text-forest-deep">{formatNPR(tax)}</dd>
              </div>
              <div className="border-t border-outline-variant pt-3 mt-3 flex justify-between items-baseline">
                <dt className="font-semibold text-forest-deep">Grand Total</dt>
                <dd className="font-headline text-2xl text-forest-deep">{formatNPR(total)}</dd>
              </div>
            </dl>

            <Button as={Link} href="/checkout" size="lg" className="w-full mt-6">
              Proceed to Checkout
              <Icon name="arrow_forward" size={18} className="text-antique-gold" />
            </Button>

            <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-1.5"><Icon name="encrypted" size={14} className="text-antique-gold"/> Secure checkout</div>
              <div className="flex items-center gap-1.5"><Icon name="local_shipping" size={14} className="text-antique-gold"/> Nepal-wide delivery</div>
              <div className="flex items-center gap-1.5"><Icon name="undo" size={14} className="text-antique-gold"/> 7-day returns</div>
              <div className="flex items-center gap-1.5"><Icon name="verified" size={14} className="text-antique-gold"/> Verified B2B businesses</div>
            </div>
          </aside>
        </div>
      </Section>
    </StorefrontShell>
  );
}
