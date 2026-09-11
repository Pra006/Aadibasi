import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/admin/StatCard";
import MiniChart from "@/components/admin/MiniChart";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { formatNPR } from "@/lib/utils";
import { products } from "@/lib/data";

export const metadata = { title: "B2B Business Dashboard" };

const sidebar = [
  { label: "Overview", href: "/vendor", icon: "dashboard", active: true },
  { label: "Products", href: "/vendor/products", icon: "inventory_2", badge: 42 },
  { label: "Orders", href: "/vendor/orders", icon: "receipt_long", badge: 7 },
  { label: "Customers", href: "/vendor/customers", icon: "groups" },
  { label: "Analytics", href: "/vendor/analytics", icon: "insights" },
  { label: "Earnings", href: "/vendor/earnings", icon: "payments" },
  { label: "Withdrawals", href: "/vendor/withdrawals", icon: "account_balance" },
  { label: "Reviews", href: "/vendor/reviews", icon: "reviews" },
  { label: "Coupons", href: "/vendor/coupons", icon: "sell" },
  { label: "Store Settings", href: "/vendor/settings", icon: "storefront" },
];

const incomingOrders = [
  { id: "AAD-10248-A", customer: "Prakash A.", items: 2, total: 2998, status: "New", tone: "gold" },
  { id: "AAD-10247-A", customer: "Anita S.", items: 1, total: 1499, status: "Packed", tone: "jade" },
  { id: "AAD-10246-A", customer: "Bishal R.", items: 3, total: 4497, status: "Shipped", tone: "forest" },
  { id: "AAD-10245-A", customer: "Sita M.", items: 1, total: 1499, status: "Delivered", tone: "forest" },
];

export default function VendorDashboard() {
  const lowStock = products.filter((p) => p.stock < 30).slice(0, 4);
  return (
    <DashboardShell
      brand={{ title: "Himalayan Roots", subtitle: "Seller Central" }}
      sidebar={sidebar}
      user={{ name: "Ram Bahadur", email: "ram@himalayanroots.np", role: "B2B Business" }}
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Today · 9 Sept 2026</div>
          <h1 className="font-headline text-3xl text-forest-deep mt-1">Store Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-surface border border-outline-variant rounded px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Today</option>
          </select>
          <Button as={Link} href="/vendor/products/new"><Icon name="add" size={16} /> New Product</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue (30d)" value={formatNPR(324800)} delta="+18.4%" icon="payments" accent="jade" />
        <StatCard label="Orders" value="147" delta="+12" icon="receipt_long" accent="forest" />
        <StatCard label="Avg Order Value" value={formatNPR(2210)} delta="+4.1%" icon="trending_up" accent="gold" />
        <StatCard label="Pending Payout" value={formatNPR(48200)} icon="account_balance" accent="terracotta" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline text-xl text-forest-deep">Revenue trend</h2>
              <p className="text-xs text-on-surface-variant">Last 12 weeks</p>
            </div>
            <div className="text-right">
              <div className="font-headline text-2xl text-forest-deep">{formatNPR(324800)}</div>
              <div className="text-xs text-herbal-jade font-semibold">▲ 18.4%</div>
            </div>
          </div>
          <div className="h-40">
            <MiniChart />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <h2 className="font-headline text-xl text-forest-deep">Sales split</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ["Ayurvedic Oils", 62, "bg-forest-base"],
              ["Herbal Teas", 22, "bg-antique-gold"],
              ["Incense & Resins", 10, "bg-terracotta"],
              ["Other", 6, "bg-herbal-jade"],
            ].map(([label, pct, color]) => (
              <li key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-forest-deep font-semibold">{label}</span>
                  <span className="text-on-surface-variant">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl text-forest-deep">Incoming orders</h2>
            <Link href="/vendor/orders" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">View all →</Link>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-2 font-semibold">Order</th>
                  <th className="px-6 py-2 font-semibold">Customer</th>
                  <th className="px-6 py-2 font-semibold">Items</th>
                  <th className="px-6 py-2 font-semibold">Total</th>
                  <th className="px-6 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {incomingOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{o.id}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{o.customer}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{o.items}</td>
                    <td className="px-6 py-3 font-semibold">{formatNPR(o.total)}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex text-[11px] font-semibold uppercase tracking-widest px-2 py-1 rounded ${
                        o.tone === "gold" ? "bg-antique-gold/20 text-antique-gold" :
                        o.tone === "jade" ? "bg-herbal-jade/15 text-herbal-jade" :
                        "bg-forest-base/10 text-forest-base"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl text-forest-deep">Low stock</h2>
            <Icon name="warning" size={18} className="text-terracotta" />
          </div>
          <ul className="divide-y divide-outline-variant/50">
            {lowStock.map((p) => (
              <li key={p.id} className="py-3 flex items-center gap-3">
                <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-forest-deep line-clamp-1">{p.name}</div>
                  <div className="text-xs text-on-surface-variant">{p.stock} left</div>
                </div>
                <button className="text-xs font-semibold text-antique-gold hover:text-forest-deep">Restock</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
