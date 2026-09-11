import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/storefront/ProductCard";
import Icon from "@/components/ui/Icon";
import { products } from "@/lib/data";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  const items = products.slice(0, 4);
  return (
    <StorefrontShell>
      <Section className="py-6">
        <nav className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-forest-deep font-semibold">Wishlist</span>
        </nav>
      </Section>
      <Section className="pb-16">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep">Your Wishlist</h1>
            <p className="text-sm text-on-surface-variant mt-1">{items.length} items saved</p>
          </div>
          <button className="text-sm font-semibold text-forest-deep hover:text-antique-gold inline-flex items-center gap-1">
            <Icon name="add_shopping_cart" size={16} /> Add all to cart
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
    </StorefrontShell>
  );
}
