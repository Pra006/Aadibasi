import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Rating from "@/components/ui/Rating";

export default function VendorCard({ vendor }) {
  return (
    <Link
      href={`/stores/${vendor.slug}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/60 hover:border-antique-gold/50 hover:shadow-lg transition"
    >
      <div className="relative h-32 bg-forest-base overflow-hidden">
        <img src={vendor.banner} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/20 to-forest-deep/70" />
      </div>
      <div className="p-4 pt-0 -mt-8 flex flex-col items-start">
        <div className="w-16 h-16 rounded-full bg-ivory-canvas border-2 border-antique-gold shadow-md overflow-hidden">
          <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <h3 className="font-headline text-lg text-forest-deep">{vendor.name}</h3>
          {vendor.verified && <Icon name="verified" size={16} className="text-antique-gold" />}
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
          <Icon name="location_on" size={12} />
          <span>{vendor.location}</span>
        </div>
        <div className="mt-2">
          <Rating value={vendor.rating} count={vendor.reviewCount} />
        </div>
        <div className="mt-3 flex items-center justify-between w-full text-xs">
          <span className="text-on-surface-variant">{vendor.productCount} products</span>
          <span className="text-antique-gold font-semibold inline-flex items-center gap-1">
            Visit store <Icon name="arrow_forward" size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
