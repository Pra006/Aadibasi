import Link from "next/link";
import Icon from "@/components/ui/Icon";

const groups = [
  {
    title: "Aadibasi",
    links: [
      ["Our Story", "/about"],
      ["Journal", "/journal"],
      ["Sustainability", "/sustainability"],
      ["Careers", "/careers"],
    ],
  },
  {
    title: "Customer Care",
    links: [
      ["Shipping", "/help/shipping"],
      ["Returns & Refunds", "/help/returns"],
      ["Order Tracking", "/account/orders"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "For Sellers",
    links: [
      ["Sell on Aadibasi", "/vendor/register"],
      ["Seller Central", "/vendor"],
      ["Commission & Fees", "/help/fees"],
      ["Vendor Handbook", "/help/vendor"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Privacy", "/policies/privacy"],
      ["Terms of Use", "/policies/terms"],
      ["Refund Policy", "/policies/refund"],
      ["Cookies", "/policies/cookies"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-ivory-canvas mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-7 lg:py-6">
        {/* Newsletter */}
        <div className="grid lg:grid-cols-2 gap-6 border-b border-antique-gold/20 pb-6 mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold mb-3">Newsletter</div>
            <h3 className="font-headline text-3xl sm:text-4xl leading-tight">
              Slow letters from the hills.
            </h3>
            <p className="mt-3 text-sm text-earth-sand/80 max-w-md">
              One thoughtful email a month — new vendor stories, ancestral formulations, seasonal drops.
            </p>
          </div>
          <form className="flex items-end gap-3 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <label className="text-[11px] uppercase tracking-widest text-earth-sand/80">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full bg-transparent border-b border-antique-gold/50 py-3 outline-none placeholder:text-earth-sand/40 text-ivory-canvas"
              />
            </div>
            <button className="bg-antique-gold text-forest-deep px-6 py-3 rounded font-semibold text-sm">
              Subscribe
            </button>
          </form>
        </div>

        {/* Groups */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-md border border-antique-gold/40 bg-antique-gold/10 flex items-center justify-center">
                <span className="font-headline text-antique-gold text-lg font-bold">आ</span>
              </div>
              <span className="font-headline text-2xl">Aadibasi</span>
            </div>
            <p className="text-sm text-earth-sand/80 leading-relaxed max-w-xs">
              Nepal's marketplace for ancestral goods — Ayurvedic wellness, handloom, wildcrafted honey, and heritage
              crafts, direct from the makers.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {["public", "camera", "chat", "podcasts"].map((n) => (
                <a
                  key={n}
                  href="#"
                  className="w-9 h-9 rounded-full border border-antique-gold/30 flex items-center justify-center text-antique-gold hover:bg-antique-gold hover:text-forest-deep transition"
                >
                  <Icon name={n} size={18} />
                </a>
              ))}
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-antique-gold text-xs font-semibold uppercase tracking-widest mb-4">{g.title}</h4>
              <ul className="space-y-2.5 text-sm text-earth-sand/85">
                {g.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-antique-gold">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-antique-gold/20 flex flex-wrap items-center justify-between gap-4 text-xs text-earth-sand/70">
          <span>© {new Date().getFullYear()} Aadibasi Marketplace Pvt. Ltd. — All rights reserved.</span>
          <div className="flex items-center gap-3">
            <span>Payments:</span>
            <span className="px-2 py-1 rounded bg-antique-gold/10 border border-antique-gold/20">eSewa</span>
            <span className="px-2 py-1 rounded bg-antique-gold/10 border border-antique-gold/20">Khalti</span>
            <span className="px-2 py-1 rounded bg-antique-gold/10 border border-antique-gold/20">COD</span>
            <span className="px-2 py-1 rounded bg-antique-gold/10 border border-antique-gold/20">Bank</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
