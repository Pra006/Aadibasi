import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/admin/StatCard";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/storefront/ProductCard";
import { formatNPR } from "@/lib/utils";
import { products } from "@/lib/data";

export const metadata = { title: "My Account" };

const sidebar = [
  { label: "Overview", href: "/account", icon: "dashboard", active: true },
  { label: "Orders", href: "/account/orders", icon: "receipt_long", badge: 2 },
  { label: "Wishlist", href: "/account/wishlist", icon: "favorite" },
  { label: "Addresses", href: "/account/addresses", icon: "location_on" },
  { label: "Reviews", href: "/account/reviews", icon: "reviews" },
  { label: "Notifications", href: "/account/notifications", icon: "notifications" },
  { label: "Profile & Security", href: "/account/settings", icon: "settings" },
];

const recentOrders = [
  { id: "AAD-10248", date: "5 Sept 2026", total: 3480, status: "Shipped", tone: "jade" },
  { id: "AAD-10192", date: "22 Aug 2026", total: 1250, status: "Delivered", tone: "forest" },
  { id: "AAD-10041", date: "10 Aug 2026", total: 5900, status: "Delivered", tone: "forest" },
  { id: "AAD-09988", date: "1 Aug 2026", total: 890, status: "Cancelled", tone: "terracotta" },
];

export default function AccountPage() {
  return (
    <DashboardShell
      brand={{ title: "Aadibasi", subtitle: "My Account" }}
      sidebar={sidebar}
      user={{ name: "Prakash Adhikari", email: "prakash@aadibasi.com", role: "Customer" }}
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Welcome back</div>
          <h1 className="font-headline text-3xl text-forest-deep mt-1">Namaste, Prakash 🙏</h1>
          <p className="text-sm text-on-surface-variant mt-1">Here's what's happening with your account.</p>
        </div>
        <Button as={Link} href="/shop"><Icon name="shopping_bag" size={16} className="text-antique-gold"/> Continue Shopping</Button>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value="14" delta="+3" icon="receipt_long" accent="forest" />
        <StatCard label="Pending" value="2" delta="0" icon="pending" accent="gold" />
        <StatCard label="Delivered" value="11" delta="+2" icon="check_circle" accent="jade" />
        <StatCard label="Wishlist" value="7" icon="favorite" accent="terracotta" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl text-forest-deep">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">View all →</Link>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-2 font-semibold">Order</th>
                  <th className="px-6 py-2 font-semibold">Date</th>
                  <th className="px-6 py-2 font-semibold">Total</th>
                  <th className="px-6 py-2 font-semibold">Status</th>
                  <th className="px-6 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{o.id}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{o.date}</td>
                    <td className="px-6 py-3 font-semibold text-forest-deep">{formatNPR(o.total)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest px-2 py-1 rounded ${
                        o.tone === "jade" ? "bg-herbal-jade/15 text-herbal-jade" :
                        o.tone === "forest" ? "bg-forest-base/10 text-forest-base" :
                        "bg-terracotta/15 text-terracotta"
                      }`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/account/orders/${o.id}`} className="text-xs font-semibold text-forest-deep hover:text-antique-gold">Details →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <h2 className="font-headline text-xl text-forest-deep">Default Address</h2>
          <div className="mt-4 text-sm text-on-surface-variant leading-relaxed">
            <div className="font-semibold text-forest-deep">Prakash Adhikari</div>
            <div>Ward 5, Baluwatar, Kathmandu 44600</div>
            <div>Bagmati Province, Nepal</div>
            <div className="mt-1">+977 98XXXXXXXX</div>
          </div>
          <Button variant="secondary" className="mt-4 w-full">Manage Addresses</Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl text-forest-deep">Recommended for you</h2>
          <Link href="/shop" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">Shop all →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} compact />)}
        </div>
      </div>
    </DashboardShell>
  );
}
