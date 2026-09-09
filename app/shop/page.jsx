import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/storefront/ProductCard";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { products, categories, vendors } from "@/lib/data";

export const metadata = { title: "Shop All" };

function FilterGroup({ title, children, defaultOpen = true }) {
  return (
    <details open={defaultOpen} className="border-b border-outline-variant/70 py-4 group">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="font-semibold text-sm text-forest-deep uppercase tracking-widest">{title}</span>
        <Icon name="expand_more" size={20} className="group-open:rotate-180 transition" />
      </summary>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </details>
  );
}

function Checkbox({ label, count }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-forest-deep cursor-pointer">
      <input type="checkbox" className="w-4 h-4 rounded border-outline text-forest-base focus:ring-antique-gold" />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs text-outline">({count})</span>}
    </label>
  );
}

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
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep">All Products</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Showing {products.length} of {products.length} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-on-surface-variant">Sort by</span>
              <select className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 text-sm">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Rated</option>
                <option>Most Popular</option>
                <option>Biggest Discount</option>
              </select>
            </div>
            <div className="hidden sm:flex items-center gap-1 border border-outline-variant rounded overflow-hidden">
              <button className="p-2 bg-forest-base text-antique-gold"><Icon name="grid_view" size={16} /></button>
              <button className="p-2 text-forest-deep"><Icon name="view_list" size={16} /></button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* FILTERS */}
          <aside className="lg:sticky lg:top-24 self-start bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-fit">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-headline text-lg text-forest-deep">Filters</h2>
              <button className="text-xs text-antique-gold font-semibold">Reset</button>
            </div>

            <FilterGroup title="Category">
              {categories.slice(0, 6).map((c) => (
                <Checkbox key={c.slug} label={c.name} count={c.productCount} />
              ))}
            </FilterGroup>

            <FilterGroup title="Vendor">
              {vendors.map((v) => (
                <Checkbox key={v.slug} label={v.name} count={v.productCount} />
              ))}
            </FilterGroup>

            <FilterGroup title="Price (NPR)">
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full text-sm border border-outline-variant rounded px-2 py-1.5" />
                <span className="text-on-surface-variant">—</span>
                <input type="number" placeholder="Max" className="w-full text-sm border border-outline-variant rounded px-2 py-1.5" />
              </div>
              <button className="mt-2 w-full bg-forest-base text-ivory-canvas rounded py-2 text-xs font-semibold uppercase tracking-widest">Apply</button>
            </FilterGroup>

            <FilterGroup title="Rating" defaultOpen={false}>
              {[5, 4, 3, 2].map((r) => (
                <Checkbox key={r} label={`${r} stars & up`} />
              ))}
            </FilterGroup>

            <FilterGroup title="Availability" defaultOpen={false}>
              <Checkbox label="In stock" />
              <Checkbox label="On sale" />
              <Checkbox label="New arrivals" />
            </FilterGroup>
          </aside>

          {/* GRID */}
          <div>
            {/* Active filters row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Ayurvedic Oils", "In stock", "Under NPR 2,000"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-outline-variant text-xs text-forest-deep">
                  {t}
                  <button aria-label={`Remove ${t}`}><Icon name="close" size={12} /></button>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <nav className="mt-10 flex items-center justify-center gap-1">
              <button className="px-3 py-2 rounded border border-outline-variant text-sm text-on-surface-variant"><Icon name="chevron_left" size={16} /></button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`min-w-9 h-9 rounded text-sm font-semibold ${
                    n === 1 ? "bg-forest-base text-ivory-canvas" : "border border-outline-variant text-forest-deep hover:bg-forest-base/5"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button className="px-3 py-2 rounded border border-outline-variant text-sm text-on-surface-variant"><Icon name="chevron_right" size={16} /></button>
            </nav>
          </div>
        </div>
      </Section>
    </StorefrontShell>
  );
}
