import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block bg-forest-deep">
        <img
          src="https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-ivory-canvas">
          <div className="text-xs uppercase tracking-widest text-antique-gold font-bold mb-3">Aadibasi</div>
          <h2 className="font-headline text-4xl leading-tight">
            Ancient wisdom.<br /><span className="italic text-antique-gold font-normal">Rooted in Nature.</span>
          </h2>
          <p className="text-sm text-earth-sand/80 mt-3 max-w-md">
            Sign in to track your orders, save favourites, and follow makers whose craft you love.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-md border border-antique-gold/40 bg-forest-base flex items-center justify-center">
              <span className="font-headline text-antique-gold text-lg font-bold">आ</span>
            </div>
            <span className="font-headline text-2xl text-forest-deep">Aadibasi</span>
          </Link>
          <h1 className="font-headline text-3xl text-forest-deep">Welcome back</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to your Aadibasi account.</p>

          <form className="mt-8 space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email</span>
              <input type="email" required className="bg-surface-container-low border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="you@example.com" />
            </label>
            <label className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Password</span>
                <Link href="/auth/forgot" className="text-xs text-antique-gold hover:underline">Forgot?</Link>
              </div>
              <input type="password" required className="bg-surface-container-low border border-outline-variant rounded px-3 py-3 text-sm outline-none focus:border-antique-gold" placeholder="••••••••" />
            </label>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input type="checkbox" className="rounded border-outline text-forest-base" /> Keep me signed in
            </label>
            <Button size="lg" className="w-full">Sign In</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex-1 h-px bg-outline-variant" />
            or continue with
            <span className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-outline-variant rounded py-2.5 text-sm hover:bg-surface-container">
              <Icon name="public" size={16} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-outline-variant rounded py-2.5 text-sm hover:bg-surface-container">
              <Icon name="smartphone" size={16} /> Phone OTP
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            New to Aadibasi?{" "}
            <Link href="/auth/register" className="text-forest-deep font-semibold hover:text-antique-gold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
