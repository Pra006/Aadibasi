import prisma from "@/lib/prisma";
import { requireB2BMember, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/quotes — List organization's quotations
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = { organizationId: organization.id };
    if (status) where.status = status;

    const quotations = await prisma.b2BQuotation.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
        rfq: { select: { id: true, rfqNumber: true } },
        purchaseOrder: { select: { id: true, poNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ quotations });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
