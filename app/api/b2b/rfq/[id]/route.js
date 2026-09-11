import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  verifyOrgOwnership,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/rfq/:id — Get single RFQ
 */
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { organization } = await requireB2BMember();

    const rfq = await prisma.b2BRFQ.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true, retailPrice: true } } },
        },
        quotation: {
          include: { items: true },
        },
      },
    });

    if (!rfq) return errorResponse("RFQ not found", 404);
    verifyOrgOwnership(rfq, organization.id);

    return jsonResponse({ rfq });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
