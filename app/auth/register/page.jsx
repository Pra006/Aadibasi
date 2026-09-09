import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-6">
      <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-8 shadow-lg">
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-md border border-antique-gold/40 bg-forest-base flex items-center justify-center">
            <span className="font-headline text-antique-gold text-lg font-bold">आ</span>
          </div>
          <span className="font-headline text-2xl text-forest-deep">Aadibasi</span>
        </Link>
        <h1 className="font-headline text-3xl text-forest-deep">Create your account</h1>
        <p className="text-sm text-on-surface-variant mt-1">Join Nepal's heritage marketplace — buy from verified makers.</p>

        <form className="mt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">First name</span>
              <input className="border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="Prakash" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Last name</span>
              <input className="border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="Adhikari" />
            </label>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email</span>
            <input type="email" className="border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Phone (Nepal)</span>
            <input className="border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="+977 98XXXXXXXX" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Password</span>
            <input type="password" className="border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="At least 8 characters" />
          </label>
          <label className="flex items-start gap-2 text-xs text-on-surface-variant">
            <input type="checkbox" className="mt-0.5 rounded border-outline text-forest-base" />
            I agree to Aadibasi's <Link href="/policies/terms" className="text-antique-gold underline">Terms</Link> and{" "}
            <Link href="/policies/privacy" className="text-antique-gold underline">Privacy Policy</Link>.
          </label>
          <Button size="lg" className="w-full">Create Account</Button>
        </form>

        <div className="mt-6 p-4 bg-forest-base/5 border border-forest-base/10 rounded-lg flex items-start gap-3">
          <Icon name="storefront" size={20} className="text-antique-gold mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-forest-deep">Are you a maker?</div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Register as a vendor to open your own store on Aadibasi.
            </p>
            <Link href="/vendor/register" className="text-xs text-antique-gold font-semibold hover:underline mt-1 inline-block">
              Start selling →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-forest-deep font-semibold hover:text-antique-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
