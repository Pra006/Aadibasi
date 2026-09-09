import Link from "next/link";
import Icon from "@/components/ui/Icon";

/**
 * DashboardShell — used by /account, /vendor, /admin.
 * `variant` picks the accent (forest for admin/account, terracotta for vendor).
 * `sidebar` is an array of { label, href, icon, badge? }.
 */
export default function DashboardShell({
  brand = { title: "Aadibasi", subtitle: "Dashboard" },
  variant = "forest",
  sidebar = [],
  user = { name: "Prakash Adhikari", email: "prakash@aadibasi.com", role: "Customer" },
  children,
}) {
  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest-deep text-ivory-canvas shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-antique-gold/20">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md border border-antique-gold/40 bg-antique-gold/10 flex items-center justify-center">
              <span className="font-headline text-antique-gold text-lg font-bold">आ</span>
            </div>
            <div className="leading-none">
              <div className="font-headline text-xl">{brand.title}</div>
              <div className="text-[10px] uppercase tracking-widest text-antique-gold mt-1">{brand.subtitle}</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {sidebar.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm ${
                    s.active
                      ? "bg-antique-gold/15 text-antique-gold font-semibold"
                      : "text-earth-sand/90 hover:bg-antique-gold/10 hover:text-antique-gold"
                  }`}
                >
                  <Icon name={s.icon} size={18} />
                  <span className="flex-1">{s.label}</span>
                  {s.badge != null && (
                    <span className="text-[10px] bg-terracotta text-white rounded-full px-1.5 py-0.5">
                      {s.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-antique-gold/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-antique-gold text-forest-deep flex items-center justify-center font-semibold">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-antique-gold">{user.role}</div>
          </div>
          <button className="text-earth-sand/70 hover:text-antique-gold"><Icon name="logout" size={18} /></button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant/60 h-16 flex items-center px-5 lg:px-8 gap-4">
          <button className="lg:hidden p-1 text-forest-deep" aria-label="Menu"><Icon name="menu" size={24}/></button>
          <div className="flex-1 flex items-center gap-2 max-w-md bg-surface-container-low border border-outline-variant rounded px-3 py-2">
            <Icon name="search" size={18} className="text-on-surface-variant" />
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Search dashboard…" />
          </div>
          <button className="relative p-2 text-forest-deep hover:text-antique-gold">
            <Icon name="notifications" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terracotta" />
          </button>
          <Link href="/" className="text-xs font-semibold text-forest-deep hover:text-antique-gold inline-flex items-center gap-1">
            <Icon name="storefront" size={16} /> Storefront
          </Link>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
