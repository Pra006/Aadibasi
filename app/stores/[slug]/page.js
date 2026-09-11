import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section, SectionHeader } from "@/components/ui/Section";
import ProductCard from "@/components/storefront/ProductCard";
import Rating from "@/components/ui/Rating";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { getVendor, productsByVendor, products, vendors } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const v = getVendor(slug);
  return { title: v ? v.name : "Store" };
}

export default async function StorePage({ params }) {
  const { slug } = await params;
  const vendor = getVendor(slug);
  if (!vendor) return notFound();
  const list = productsByVendor(slug);
  const featured = (list.length ? list : products).slice(0, 8);

  return (
    <StorefrontShell>
      {/* Banner */}
      <section className="relative h-56 sm:h-72 lg:h-80 bg-forest-deep overflow-hidden">
        <img src={vendor.banner} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/50 to-transparent" />
      </section>

      <Section className="pb-8 -mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-28 h-28 rounded-2xl border-4 border-ivory-canvas shadow-lg overflow-hidden bg-ivory-canvas">
            <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline text-3xl sm:text-4xl text-ivory-canvas drop-shadow">{vendor.name}</h1>
              {vendor.verified && <Icon name="verified" size={22} className="text-antique-gold" />}
            </div>
            <div className="mt-2 flex items-center gap-4 text-earth-sand text-sm flex-wrap">
              <span className="inline-flex items-center gap-1"><Icon name="location_on" size={14} /> {vendor.location}</span>
              <span className="inline-flex items-center gap-1"><Icon name="calendar_month" size={14} /> Est. {vendor.founded}</span>
              <span className="inline-flex items-center gap-1"><Icon name="inventory_2" size={14} /> {vendor.productCount} products</span>
              <Rating value={vendor.rating} count={vendor.reviewCount} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <Button variant="secondary" className="border-ivory-canvas text-ivory-canvas hover:bg-ivory-canvas/10">
              <Icon name="favorite" size={16} /> Follow
            </Button>
            <Button variant="gold">
              <Icon name="chat" size={16} /> Message
            </Button>
          </div>
        </div>
      </Section>

      <Section className="pb-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <h2 className="font-headline text-2xl text-forest-deep">Our story</h2>
            <p className="mt-2 text-on-surface-variant leading-relaxed">{vendor.story}</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ["inventory_2", vendor.productCount, "Products"],
                ["star", vendor.rating.toFixed(1), "Rating"],
                ["reviews", vendor.reviewCount, "Reviews"],
                ["calendar_month", new Date().getFullYear() - vendor.founded + "y", "Selling"],
              ].map(([icon, v, l]) => (
                <div key={l} className="rounded-lg border border-outline-variant/60 p-3 text-center">
                  <Icon name={icon} size={18} className="text-antique-gold" />
                  <div className="font-headline text-xl text-forest-deep mt-1">{v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-on-surface-variant">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-xl border border-outline-variant/60 p-5 bg-surface-container-low">
            <h3 className="font-headline text-lg text-forest-deep">Store policies</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-on-surface-variant">
              <li className="flex gap-2"><Icon name="local_shipping" size={16} className="text-antique-gold shrink-0" /> Ships from Nepal within 2 business days</li>
              <li className="flex gap-2"><Icon name="undo" size={16} className="text-antique-gold shrink-0" /> 7-day return window on unopened items</li>
              <li className="flex gap-2"><Icon name="handshake" size={16} className="text-antique-gold shrink-0" /> Fair-pay verified cooperative</li>
              <li className="flex gap-2"><Icon name="verified" size={16} className="text-antique-gold shrink-0" /> AYUSH & organic certified</li>
            </ul>
          </aside>
        </div>
      </Section>

      <Section className="pb-16">
        <SectionHeader eyebrow="Store Catalog" title={`Products from ${vendor.name}`} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
    </StorefrontShell>
  );
}

export function generateStaticParams() {
  return vendors.map((v) => ({ slug: v.slug }));
}
