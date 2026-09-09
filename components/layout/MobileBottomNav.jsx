import Link from "next/link";
import Icon from "@/components/ui/Icon";

const items = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Shop", href: "/shop", icon: "grid_view" },
  { label: "Wishlist", href: "/wishlist", icon: "favorite" },
  { label: "Cart", href: "/cart", icon: "shopping_bag" },
  { label: "Account", href: "/account", icon: "person" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed lg:hidden bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-forest-base/10 shadow-[0_-2px_12px_rgba(15,38,24,0.06)]">
      <ul className="grid grid-cols-5 max-w-lg mx-auto">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="flex flex-col items-center py-2.5 gap-0.5 text-forest-deep hover:text-antique-gold"
            >
              <Icon name={i.icon} size={22} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{i.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
