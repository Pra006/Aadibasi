import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import StorefrontShell from "@/components/layout/StorefrontShell";

export const metadata = { title: "Account Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/account/settings");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/auth/login");

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Hakkiveda customer";
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <StorefrontShell>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Your account</div>
          <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep mt-1">Account Settings</h1>
          <p className="text-sm text-on-surface-variant mt-1">Review your profile and account details.</p>
        </div>

        <div className="space-y-5">
          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-outline-variant/40">
              <div className="w-10 h-10 rounded-lg bg-forest-base/10 flex items-center justify-center"><Icon name="person" size={20} className="text-forest-base" /></div>
              <div><h2 className="font-headline text-xl text-forest-deep">Profile</h2><p className="text-xs text-on-surface-variant">Update your personal information</p></div>
            </div>
            <div className="px-5 sm:px-6 py-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-forest-base text-antique-gold flex items-center justify-center font-headline text-2xl">{fullName[0]}</div>
                <div><div className="text-sm font-semibold text-forest-deep">Profile Picture</div><button type="button" className="text-sm text-forest-base font-semibold hover:text-antique-gold">Change picture</button></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[["First Name", user.firstName || ""], ["Last Name", user.lastName || ""], ["Email", user.email], ["Phone Number", user.phone || ""]].map(([label, value]) => (
                  <label key={label} className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{label}</span>
                    <input defaultValue={value} type={label === "Email" ? "email" : "text"} className="bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-sm text-forest-deep outline-none focus:border-antique-gold" />
                  </label>
                ))}
              </div>
              <div className="flex justify-end"><Button type="button">Save profile</Button></div>
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-outline-variant/40">
              <div className="w-10 h-10 rounded-lg bg-antique-gold/10 flex items-center justify-center"><Icon name="lock" size={20} className="text-antique-gold" /></div>
              <div><h2 className="font-headline text-xl text-forest-deep">Security</h2><p className="text-xs text-on-surface-variant">Change your password</p></div>
            </div>
            <div className="px-5 sm:px-6 py-6 space-y-4">
              {["Current Password", "New Password", "Confirm Password"].map((label) => (
                <label key={label} className="flex flex-col gap-1.5 max-w-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{label}</span>
                  <input type="password" className="bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-sm outline-none focus:border-antique-gold" />
                </label>
              ))}
              <Button type="button">Change password</Button>
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-outline-variant/40"><div className="w-10 h-10 rounded-lg bg-herbal-jade/10 flex items-center justify-center"><Icon name="notifications" size={20} className="text-herbal-jade" /></div><div><h2 className="font-headline text-xl text-forest-deep">Notifications</h2><p className="text-xs text-on-surface-variant">Choose what you want to hear about</p></div></div>
            <div className="divide-y divide-outline-variant/40 px-5 sm:px-6">
              {["Order Updates", "Delivery Updates", "Promotional Offers", "Email Notifications"].map((label, index) => (
                <label key={label} className="flex items-center justify-between gap-4 py-4 text-sm text-forest-deep"><span>{label}</span><input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 rounded border-outline text-forest-base" /></label>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-outline-variant/40"><div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center"><Icon name="tune" size={20} className="text-terracotta" /></div><div><h2 className="font-headline text-xl text-forest-deep">Preferences</h2><p className="text-xs text-on-surface-variant">Customize your shopping experience</p></div></div>
            <div className="grid sm:grid-cols-3 gap-4 px-5 sm:px-6 py-6">
              {[["Language", "English", ["English", "Nepali"]], ["Currency", "NPR", ["NPR", "USD"]], ["Theme", "Light", ["Light", "System"]]].map(([label, selected, options]) => <label key={label} className="flex flex-col gap-1.5"><span className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{label}</span><select defaultValue={selected} className="bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 text-sm outline-none focus:border-antique-gold">{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-outline-variant/40"><div className="w-10 h-10 rounded-lg bg-forest-base/10 flex items-center justify-center"><Icon name="privacy_tip" size={20} className="text-forest-base" /></div><div><h2 className="font-headline text-xl text-forest-deep">Privacy</h2><p className="text-xs text-on-surface-variant">Control how your data is used</p></div></div>
            <div className="divide-y divide-outline-variant/40 px-5 sm:px-6">
              {["Marketing Preferences", "Data Preferences"].map((label) => <label key={label} className="flex items-center justify-between gap-4 py-4 text-sm text-forest-deep"><span>{label}</span><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-outline text-forest-base" /></label>)}
            </div>
          </section>

          <section className="border border-terracotta/30 bg-terracotta/4 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3"><Icon name="warning" size={22} className="text-terracotta mt-0.5" /><div><h2 className="font-headline text-xl text-terracotta">Account</h2><p className="text-sm text-on-surface-variant mt-1">Deleting your account permanently removes your customer data and cannot be undone.</p><button type="button" className="mt-4 text-sm font-semibold text-terracotta border border-terracotta/40 rounded px-4 py-2 hover:bg-terracotta/10">Delete Account</button></div></div>
          </section>

          <div className="flex flex-wrap gap-3 pt-2"><Button as={Link} href="/account/addresses" variant="secondary"><Icon name="location_on" size={17} /> Saved addresses</Button><Button as={Link} href="/account/orders" variant="secondary"><Icon name="receipt_long" size={17} /> My orders</Button></div>
        </div>
      </div>
    </StorefrontShell>
  );
}
