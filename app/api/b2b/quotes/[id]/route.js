import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  verifyOrgOwnership,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/quotes/:id — Get single quotation
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { organization } = await requireB2BMember();

    const quotation = await prisma.b2BQuotation.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
        rfq: { select: { id: true, rfqNumber: true } },
        purchaseOrder: { select: { id: true, poNumber: true } },
      },
    });

    if (!quotation) return errorResponse("Quotation not found", 404);
    verifyOrgOwnership(quotation, organization.id);

    return jsonResponse({ quotation });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
