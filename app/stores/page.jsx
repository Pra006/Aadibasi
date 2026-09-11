import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import { Section, SectionHeader } from "@/components/ui/Section";
import VendorCard from "@/components/storefront/VendorCard";
import Icon from "@/components/ui/Icon";
import { vendors } from "@/lib/data";

export const metadata = { title: "Stores" };

export default function StoresPage() {
  return (
    <StorefrontShell>
      <Section className="py-6">
        <nav className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-forest-deep font-semibold">Stores</span>
        </nav>
      </Section>
      <Section className="pb-16">
        <SectionHeader
          eyebrow="Meet the Makers"
          title="Verified B2B businesses of Hakkiveda."
          description="Every store on Hakkiveda is manually vetted for craft authenticity and fair pay."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((v) => <VendorCard key={v.slug} vendor={v} />)}
        </div>
      </Section>
    </StorefrontShell>
  );
}
