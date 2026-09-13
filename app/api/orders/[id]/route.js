import prisma from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/b2b";
import { requireCustomer } from "@/lib/cart";

/**
 * GET /api/orders/[id] — one of the signed-in customer's own orders.
 *
 * Scoped by customerId, so another customer's order reads as "not found"
 * rather than leaking its existence.
 */
export async function GET(request, { params }) {
  try {
    const customer = await requireCustomer();
    const { id } = await params;

    const order = await prisma.customerOrder.findFirst({
      where: { id, customerId: customer.id },
      include: {
        items: { include: { product: { select: { id: true, slug: true, isActive: true } } } },
        payments: { orderBy: { createdAt: "desc" } },
        events: { orderBy: { createdAt: "asc" } },
        shippingAddress: true,
      },
    });

    if (!order) return errorResponse("Order not found", 404);
    return jsonResponse({ order });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ORDER_DETAIL_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
