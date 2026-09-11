import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import StorefrontShell from "@/components/layout/StorefrontShell";

export const metadata = { title: "Saved Addresses" };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/account/addresses");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const addresses = customer
    ? await prisma.customerAddress.findMany({
        where: { customerId: customer.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <StorefrontShell>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Your account</div>
            <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep mt-1">Saved Addresses</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage your delivery and billing addresses.
            </p>
          </div>
          <Button type="button">
            <Icon name="add" size={18} /> Add address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-center px-6 py-20">
            <Icon name="location_on" size={48} className="text-outline-variant mx-auto mb-4" />
            <h2 className="font-headline text-2xl text-forest-deep">No saved addresses</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Your saved delivery addresses will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-forest-base/10 flex items-center justify-center">
                      <Icon
                        name={address.type === "OFFICE" ? "business" : "home"}
                        size={20}
                        className="text-forest-base"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-forest-deep">{address.label}</h2>
                      <span className="text-xs text-on-surface-variant">
                        {address.type.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {address.isDefault && (
                    <span className="text-xs font-semibold text-herbal-jade bg-herbal-jade/10 rounded-full px-2.5 py-1">
                      Default
                    </span>
                  )}
                </div>

                <div className="text-sm text-on-surface-variant leading-relaxed">
                  <div className="font-semibold text-forest-deep">{address.fullName}</div>
                  {address.streetAddress && <div>{address.streetAddress}</div>}
                  <div>{address.city}{address.district ? `, ${address.district}` : ""}</div>
                  <div>{address.province}{address.postalCode ? `, ${address.postalCode}` : ""}</div>
                  <div className="mt-1">{address.phone}</div>
                </div>

                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-outline-variant/40">
                  <button type="button" className="text-sm font-semibold text-forest-deep hover:text-antique-gold">
                    Edit
                  </button>
                  <button type="button" className="text-sm font-semibold text-terracotta hover:underline">
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 mt-8 text-sm font-semibold text-forest-deep hover:text-antique-gold"
        >
          <Icon name="arrow_back" size={16} /> Back to orders
        </Link>
      </div>
    </StorefrontShell>
  );
}
