import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/admin/StatCard";
import MiniChart from "@/components/admin/MiniChart";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { formatNPR } from "@/lib/utils";
import { vendors, products } from "@/lib/data";

export const metadata = { title: "Admin Dashboard" };

const sidebar = [
  { label: "Overview", href: "/admin", icon: "dashboard", active: true },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Vendors", href: "/admin/vendors", icon: "storefront", badge: 3 },
  { label: "Products", href: "/admin/products", icon: "inventory_2" },
  { label: "Categories", href: "/admin/categories", icon: "category" },
  { label: "Brands", href: "/admin/brands", icon: "loyalty" },
  { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
  { label: "Payments", href: "/admin/payments", icon: "payments" },
  { label: "Commissions", href: "/admin/commissions", icon: "percent" },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: "account_balance", badge: 5 },
  { label: "Coupons", href: "/admin/coupons", icon: "sell" },
  { label: "Reviews", href: "/admin/reviews", icon: "reviews" },
  { label: "Reports", href: "/admin/reports", icon: "insert_chart" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: "history" },
];

const pendingVendors = vendors.slice(0, 3);

const recentTx = [
  { id: "TX-2988", user: "Prakash Adhikari", type: "Order Payment", method: "eSewa", amount: 3480, when: "5m ago" },
  { id: "TX-2987", user: "Anita Shrestha", type: "Refund", method: "Khalti", amount: -890, when: "12m ago" },
  { id: "TX-2986", user: "Bishal Rai", type: "Order Payment", method: "COD", amount: 4497, when: "26m ago" },
  { id: "TX-2985", user: "Sita Magar", type: "Vendor Payout", method: "Bank", amount: -12200, when: "1h ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardShell
      brand={{ title: "Aadibasi", subtitle: "Admin Console" }}
      sidebar={sidebar}
      user={{ name: "Admin Anisha", email: "admin@aadibasi.com", role: "Super Admin" }}
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Platform · 9 Sept 2026</div>
          <h1 className="font-headline text-3xl text-forest-deep mt-1">Marketplace Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-surface border border-outline-variant rounded px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>This year</option>
          </select>
          <Button variant="secondary"><Icon name="download" size={16}/> Export</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Revenue" value={formatNPR(4820000)} delta="+22.4%" icon="payments" accent="jade" />
        <StatCard label="Platform Commission" value={formatNPR(482000)} delta="+22.4%" icon="percent" accent="gold" />
        <StatCard label="Vendor Payouts" value={formatNPR(4338000)} delta="+18.1%" icon="account_balance" accent="forest" />
        <StatCard label="Refunds" value={formatNPR(28400)} delta="+3.2%" deltaTone="down" icon="undo" accent="terracotta" />
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Orders (30d)" value="2,184" delta="+128" icon="receipt_long" />
        <StatCard label="New Customers" value="612" delta="+47" icon="person_add" accent="jade" />
        <StatCard label="Active Vendors" value="128" delta="+6" icon="storefront" accent="gold" />
        <StatCard label="Pending Approvals" value="3" icon="pending_actions" accent="terracotta" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-headline text-xl text-forest-deep">Revenue vs commission</h2>
              <p className="text-xs text-on-surface-variant">Last 12 weeks</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-antique-gold"/> Revenue</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-forest-base"/> Commission</span>
            </div>
          </div>
          <div className="h-52">
            <MiniChart />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl text-forest-deep">Pending vendors</h2>
            <Link href="/admin/vendors?status=pending" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">All →</Link>
          </div>
          <ul className="divide-y divide-outline-variant/50">
            {pendingVendors.map((v) => (
              <li key={v.slug} className="py-3 flex items-center gap-3">
                <img src={v.logo} alt="" className="w-10 h-10 rounded-full object-cover border border-antique-gold/40" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-forest-deep line-clamp-1">{v.name}</div>
                  <div className="text-xs text-on-surface-variant">{v.location}</div>
                </div>
                <button className="text-xs font-semibold text-herbal-jade hover:underline mr-2">Approve</button>
                <button className="text-xs font-semibold text-terracotta hover:underline">Reject</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl text-forest-deep">Recent transactions</h2>
            <Link href="/admin/payments" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">All →</Link>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-2 font-semibold">ID</th>
                  <th className="px-6 py-2 font-semibold">User</th>
                  <th className="px-6 py-2 font-semibold">Type</th>
                  <th className="px-6 py-2 font-semibold">Method</th>
                  <th className="px-6 py-2 font-semibold text-right">Amount</th>
                  <th className="px-6 py-2 font-semibold text-right">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {recentTx.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-3 font-semibold text-forest-deep">{t.id}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{t.user}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{t.type}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{t.method}</td>
                    <td className={`px-6 py-3 text-right font-semibold ${t.amount < 0 ? "text-terracotta" : "text-forest-deep"}`}>
                      {t.amount < 0 ? "−" : ""}{formatNPR(Math.abs(t.amount))}
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-on-surface-variant">{t.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6">
          <h2 className="font-headline text-xl text-forest-deep">Top vendors</h2>
          <ul className="mt-4 space-y-4">
            {vendors.slice(0, 4).map((v, i) => (
              <li key={v.slug} className="flex items-center gap-3">
                <span className="font-headline text-forest-deep w-5">{i + 1}</span>
                <img src={v.logo} alt="" className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-forest-deep line-clamp-1">{v.name}</div>
                  <div className="text-xs text-on-surface-variant">{v.productCount} products</div>
                </div>
                <span className="text-sm font-semibold text-forest-deep">{formatNPR(180000 - i * 24000)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardShell>
  );
}
