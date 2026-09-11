"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const navItems = [
  { label: "Dashboard", href: "/b2b", icon: "dashboard" },
  { label: "Company", href: "/b2b/company", icon: "apartment" },
  { label: "Members", href: "/b2b/members", icon: "group" },
  { label: "Products", href: "/b2b/products", icon: "inventory_2" },
  { label: "Cart", href: "/b2b/cart", icon: "shopping_cart" },
  { label: "RFQ", href: "/b2b/rfq", icon: "request_quote" },
  { label: "Quotes", href: "/b2b/quotes", icon: "description" },
  { label: "Purchase Orders", href: "/b2b/purchase-orders", icon: "receipt_long" },
  { label: "Orders", href: "/b2b/orders", icon: "local_shipping" },
  { label: "Invoices", href: "/b2b/invoices", icon: "receipt" },
  { label: "Payments", href: "/b2b/payments", icon: "payments" },
];

export default function B2BShell({ organization, user, children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-forest-deep text-ivory-canvas transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded bg-antique-gold/20 flex items-center justify-center text-antique-gold font-bold text-lg">
            ह
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold truncate">
              {organization?.companyName || "B2B Portal"}
            </div>
            <div className="text-[11px] text-ivory-canvas/60 uppercase tracking-widest">
              Business Portal
            </div>
          </div>
        </div>

        <nav className="py-3 px-2 space-y-0.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/b2b"
                ? pathname === "/b2b"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-antique-gold font-semibold"
                    : "text-ivory-canvas/70 hover:bg-white/5 hover:text-ivory-canvas"
                }`}
              >
                <Icon name={item.icon} size={20} filled={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="text-sm font-semibold truncate">{user?.name || "User"}</div>
          <div className="text-xs text-ivory-canvas/50 truncate">{user?.email}</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant/50 px-4 lg:px-8 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 -ml-1 text-on-surface-variant hover:text-on-surface"
          >
            <Icon name="menu" size={24} />
          </button>

          <div className="flex-1" />

          <Link
            href="/"
            className="text-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1"
          >
            <Icon name="storefront" size={16} />
            Store
          </Link>
          <Link
            href="/account"
            className="text-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1"
          >
            <Icon name="person" size={16} />
            Account
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
