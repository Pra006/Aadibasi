import Link from "next/link";
import StorefrontShell from "@/components/layout/StorefrontShell";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <StorefrontShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32 text-center">
        <div className="text-antique-gold text-xs uppercase tracking-widest font-bold">Hakkiveda</div>
        <h1 className="font-headline text-6xl sm:text-7xl text-forest-deep mt-3">404</h1>
        <p className="mt-3 text-on-surface-variant max-w-md mx-auto">
          The page you're looking for has wandered off the trail. Let's take you back to the marketplace.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button as={Link} href="/"><Icon name="home" size={16} className="text-antique-gold"/> Back to Home</Button>
          <Button as={Link} href="/shop" variant="secondary">Browse Products</Button>
        </div>
      </div>
    </StorefrontShell>
  );
}
