import Link from "next/link";
import { notFound } from "next/navigation";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section } from "@/components/ui/Section";
import ProductCard from "@/components/storefront/ProductCard";
import Icon from "@/components/ui/Icon";
import { getCategory, productsByCategory, categories, products } from "@/lib/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCategory(slug);
  return { title: c ? c.name : "Category" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return notFound();
  const list = productsByCategory(slug);
  const show = list.length ? list : products.slice(0, 4);
  return (
    <StorefrontShell>
      <section className="relative h-56 sm:h-64 overflow-hidden bg-forest-deep">
        <img src={cat.image} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pb-8">
            <nav className="text-xs text-earth-sand/80 flex items-center gap-1.5">
              <Link href="/" className="hover:text-antique-gold">Home</Link>
              <Icon name="chevron_right" size={14} />
              <Link href="/categories" className="hover:text-antique-gold">Collections</Link>
              <Icon name="chevron_right" size={14} />
              <span className="text-antique-gold font-semibold">{cat.name}</span>
            </nav>
            <h1 className="font-headline text-3xl sm:text-5xl text-ivory-canvas mt-2">{cat.name}</h1>
            <p className="text-earth-sand/80 mt-1">{cat.productCount} products</p>
          </div>
        </div>
      </section>
      <Section className="py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {show.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>
    </StorefrontShell>
  );
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
