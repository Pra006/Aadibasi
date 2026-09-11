import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatNPR } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import StorefrontShell from "@/components/layout/StorefrontShell";

export const metadata = { title: "My Orders" };

const statusStyles = {
  PENDING: "bg-antique-gold/15 text-antique-gold",
  CONFIRMED: "bg-forest-base/10 text-forest-base",
  PROCESSING: "bg-herbal-jade/15 text-herbal-jade",
  SHIPPED: "bg-herbal-jade/15 text-herbal-jade",
  DELIVERED: "bg-forest-base/10 text-forest-base",
  CANCELLED: "bg-terracotta/15 text-terracotta",
  RETURNED: "bg-terracotta/15 text-terracotta",
  REFUNDED: "bg-terracotta/15 text-terracotta",
};

function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/account/orders");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const orders = customer
    ? await prisma.customerOrder.findMany({
        where: { customerId: customer.id },
        include: {
          items: {
            include: { product: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <StorefrontShell>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-antique-gold">Your account</div>
            <h1 className="font-headline text-3xl sm:text-4xl text-forest-deep mt-1">My Orders</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {orders.length === 1 ? "1 order" : `${orders.length} orders`} placed with Hakkiveda
            </p>
          </div>
          <Button as={Link} href="/shop" variant="secondary">
            <Icon name="shopping_bag" size={17} /> Continue Shopping
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-center px-6 py-20">
            <Icon name="receipt_long" size={48} className="text-outline-variant mx-auto mb-4" />
            <h2 className="font-headline text-2xl text-forest-deep">No orders yet</h2>
            <p className="text-sm text-on-surface-variant mt-2">Your purchases will appear here after checkout.</p>
            <Button as={Link} href="/shop" className="mt-6">
              Browse the shop
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-outline-variant/40">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant">Order number</div>
                    <div className="font-semibold text-forest-deep mt-1">{order.orderNumber}</div>
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status] || "bg-surface-container text-on-surface-variant"}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="px-5 sm:px-6 py-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                        <div className="min-w-0 text-on-surface-variant truncate">
                          {item.product.name} <span className="text-xs">× {item.quantity}</span>
                        </div>
                        <span className="font-medium text-forest-deep shrink-0">{formatNPR(item.total || item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-outline-variant/40">
                    <span className="text-sm font-semibold text-on-surface-variant">Total</span>
                    <span className="font-headline text-xl text-forest-deep">{formatNPR(order.total)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </StorefrontShell>
  );
}
