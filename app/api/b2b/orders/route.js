import prisma from "@/lib/prisma";
import { requireB2BMember, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/orders — List organization's B2B orders
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = { organizationId: organization.id };
    if (status) where.status = status;

    const orders = await prisma.b2BOrder.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
        placedBy: { select: { id: true, role: true, user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
        invoice: { select: { id: true, invoiceNumber: true, paymentStatus: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ orders });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
