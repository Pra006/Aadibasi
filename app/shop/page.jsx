import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import ShopBrowser from "@/components/storefront/ShopBrowser";
import Icon from "@/components/ui/Icon";
import { products, categories, vendors } from "@/lib/data";

export const metadata = { title: "Shop All" };

export default function ShopPage() {
  return (
    <StorefrontShell>
      <Section className="py-6">
        <nav className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-forest-deep font-semibold">Shop All</span>
        </nav>
      </Section>

      <Section className="pb-4">
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep">All Products</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Browse the full Hakkiveda catalog — filter by category, B2B business, price, rating, and availability.
          </p>
        </div>
      </Section>

      <Section className="pb-16">
        <ShopBrowser products={products} categories={categories} vendors={vendors} />
      </Section>
    </StorefrontShell>
  );
}
