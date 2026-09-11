import prisma from "@/lib/prisma";
import { requireB2BMember, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/invoices — List organization's invoices
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = { organizationId: organization.id };
    if (status) where.paymentStatus = status;

    const invoices = await prisma.b2BInvoice.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true } } },
        },
        order: { select: { id: true, orderNumber: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ invoices });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
