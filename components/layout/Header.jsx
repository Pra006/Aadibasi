"use client";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/Icon";

const nav = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/categories" },
  { label: "Stores", href: "/stores" },
  { label: "Journal", href: "/journal" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full z-40 bg-surface/95 backdrop-blur-md border-b border-forest-base/5 shadow-[0_2px_12px_rgba(15,38,24,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button className="lg:hidden text-forest-deep -ml-2 p-2" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Icon name="menu" size={24} />
            </button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-md border border-antique-gold/40 bg-forest-base flex items-center justify-center shadow-sm">
                <span className="font-headline text-antique-gold text-lg font-bold">आ</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-headline text-[22px] font-semibold text-forest-deep tracking-tight group-hover:text-forest-base">
                  Aadibasi
                </span>
                <span className="text-[10px] text-antique-gold tracking-widest uppercase mt-1 font-bold">
                  Nepal Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm text-on-surface-variant hover:text-forest-deep transition-colors py-1"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-forest-deep hover:text-antique-gold"
            >
              <Icon name="search" size={22} />
            </button>
            <Link
              href="/vendor/register"
              className="hidden md:inline-flex text-xs font-semibold uppercase tracking-widest text-forest-deep hover:text-antique-gold px-3 py-2 border border-forest-base/20 rounded"
            >
              Sell on Aadibasi
            </Link>
            <Link href="/account" aria-label="Account" className="hidden sm:inline-flex p-2 text-forest-deep hover:text-antique-gold">
              <Icon name="manage_accounts" size={22} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden sm:inline-flex p-2 text-forest-deep hover:text-antique-gold">
              <Icon name="favorite" size={22} />
              <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="flex items-center gap-2.5 bg-forest-base text-ivory-canvas px-3.5 py-2 rounded-lg shadow-sm hover:bg-forest-deep"
            >
              <Icon name="shopping_bag" size={20} className="text-antique-gold" />
              <span className="hidden md:flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase text-earth-sand tracking-wider font-semibold">Bag (3)</span>
                <span className="text-xs font-semibold text-ivory-canvas">NPR 6,850</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="border-t border-forest-base/10 bg-surface">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
              <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3">
                <Icon name="search" size={20} className="text-forest-base" />
                <input
                  autoFocus
                  placeholder="Search Ayurvedic oils, honey, handloom, brass ..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-on-surface-variant"
                />
                <button onClick={() => setSearchOpen(false)} className="text-on-surface-variant hover:text-forest-deep">
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {["Bhringraj oil", "Raw honey", "Dhaka shawl", "Copper bottle", "Handloom", "Silver earrings"].map((s) => (
                  <button
                    key={s}
                    className="px-3 py-1 rounded-full border border-outline-variant text-forest-deep hover:bg-forest-base/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-forest-deep/40 backdrop-blur-sm" />
          <aside
            className="absolute top-0 left-0 h-full w-72 bg-surface shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-headline text-xl text-forest-deep">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <Icon name="close" size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-forest-deep hover:bg-forest-base/5 font-medium"
                >
                  {n.label}
                </Link>
              ))}
              <div className="border-t border-outline-variant my-3" />
              <Link href="/account" className="px-3 py-3 rounded-lg text-forest-deep hover:bg-forest-base/5">
                My Account
              </Link>
              <Link href="/vendor/register" className="px-3 py-3 rounded-lg text-forest-deep hover:bg-forest-base/5">
                Sell on Aadibasi
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
