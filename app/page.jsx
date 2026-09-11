import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section, SectionHeader } from "@/components/ui/Section";
import ProductCard from "@/components/storefront/ProductCard";
import CategoryCard from "@/components/storefront/CategoryCard";
import VendorCard from "@/components/storefront/VendorCard";
import TrustStrip from "@/components/storefront/TrustStrip";
import FlashCountdown from "@/components/storefront/FlashCountdown";
import HeroCarousel from "@/components/storefront/HeroCarousel";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  categories,
  vendors,
  products,
  featuredProducts,
  trendingProducts,
  flashSaleEndsAt,
} from "@/lib/data";

export default function HomePage() {
  const featured = featuredProducts();
  const trending = trendingProducts();
  const newArrivals = products.slice(0, 6);
  const flashItems = products.slice(2, 6);

  return (
    <StorefrontShell>
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      <TrustStrip />

      {/* CATEGORIES */}
      <Section className="py-16">
        <SectionHeader
          eyebrow="Shop by Category"
          title="A living catalogue of Nepal's heritage crafts."
          description="From wildcrafted botanicals to handloom weaves — curated collections, ethically sourced."
          action={
            <Link
              href="/categories"
              className="text-sm font-semibold text-forest-deep hover:text-antique-gold inline-flex items-center gap-1"
            >
              View all <Icon name="arrow_forward" size={16} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </Section>

      {/* FLASH SALE */}
      <Section className="py-8">
        <div className="rounded-2xl bg-gradient-to-br from-forest-deep to-forest-base text-ivory-canvas p-8 lg:p-10 border border-antique-gold/30 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="local_fire_department" size={20} className="text-terracotta" />
                <Badge tone="gold">Flash Sale</Badge>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl leading-tight">
                Harvest Sale — up to 40% off.
              </h2>
              <p className="text-sm text-earth-sand/80 mt-2 max-w-xl">
                Seasonal drops from partner cooperatives. Ends soon.
              </p>
            </div>
            <FlashCountdown endsAt={flashSaleEndsAt} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {flashItems.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </div>
      </Section>

      {/* FEATURED */}
      <Section className="py-16">
        <SectionHeader
          eyebrow="Featured"
          title="Signature drops of the season."
          action={
            <Link href="/shop" className="text-sm font-semibold text-forest-deep hover:text-antique-gold inline-flex items-center gap-1">
              Shop all <Icon name="arrow_forward" size={16} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* VENDORS */}
      <Section className="py-16 bg-surface-container-low -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-none">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Meet the Makers"
            title="Verified B2B businesses, real stories."
            description="Every product on Hakkiveda carries the name of its maker. Read their story before you buy."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((v) => (
              <VendorCard key={v.slug} vendor={v} />
            ))}
          </div>
        </div>
      </Section>

      {/* NEW ARRIVALS */}
      <Section className="py-16">
        <SectionHeader eyebrow="New Arrivals" title="Fresh from the workshops." />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* PROMO BANNER */}
      <Section className="py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-2xl min-h-[220px] bg-terracotta text-ivory-canvas p-8 flex flex-col justify-between">
            <div>
              <Badge tone="gold" className="text-terracotta bg-ivory-canvas border-ivory-canvas">
                B2B Business Programme
              </Badge>
              <h3 className="font-headline text-3xl mt-4 max-w-sm">Are you a maker? Sell on Hakkiveda.</h3>
              <p className="text-sm mt-2 max-w-md opacity-90">
                Low commission. Fair payouts. Free B2B business onboarding for the first 100 stores.
              </p>
            </div>
            <div>
              <Button as={Link} href="/b2b/apply" variant="gold">
                Start Selling
              </Button>
            </div>
            <Icon name="storefront" size={180} className="absolute -right-6 -bottom-6 opacity-15" />
          </div>
          <div className="relative overflow-hidden rounded-2xl min-h-[220px] bg-forest-base text-ivory-canvas p-8 flex flex-col justify-between">
            <div>
              <Badge tone="gold">Gift Guide</Badge>
              <h3 className="font-headline text-3xl mt-4 max-w-sm">Heritage gifts, wrapped in silk.</h3>
              <p className="text-sm mt-2 max-w-md text-earth-sand/80">
                Curated hampers under NPR 5,000 — with hand-written notes on Nepali lokta paper.
              </p>
            </div>
            <div>
              <Button as={Link} href="/shop?tag=gift" variant="gold">
                Explore Gift Guide
              </Button>
            </div>
            <Icon name="redeem" size={180} className="absolute -right-6 -bottom-6 opacity-15" />
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="py-16">
        <SectionHeader eyebrow="From Our Community" title="What people are saying." />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              q: "The Bhringraj oil is transformative — you can smell the herbs, not perfume. My grandmother approves.",
              n: "Anisha K.",
              c: "Kathmandu",
            },
            {
              q: "I've bought three Dhaka shawls now. Every one arrived with a card signed by the weaver. That matters.",
              n: "Rohan M.",
              c: "Pokhara",
            },
            {
              q: "Hakkiveda is the first marketplace where I actually know who I'm buying from. That trust is rare.",
              n: "Sita R.",
              c: "Biratnagar",
            },
          ].map((t, i) => (
            <figure
              key={i}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6"
            >
              <Icon name="format_quote" size={32} className="text-antique-gold" />
              <blockquote className="mt-2 text-forest-deep leading-relaxed">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-sm text-on-surface-variant">
                <span className="font-semibold text-forest-deep">{t.n}</span> · {t.c}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </StorefrontShell>
  );
}
