import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative aspect-square rounded-xl overflow-hidden bg-surface-container border border-outline-variant/60 hover:border-antique-gold/50 hover:shadow-md transition"
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="font-headline text-lg text-ivory-canvas leading-tight">{category.name}</h3>
        <div className="flex items-center justify-between mt-1 text-earth-sand text-xs">
          <span>{category.productCount} products</span>
          <Icon name="arrow_forward" size={16} className="text-antique-gold group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}
