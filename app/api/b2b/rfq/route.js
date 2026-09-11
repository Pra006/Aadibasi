import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  generateNumber,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/rfq — List organization's RFQs
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = { organizationId: organization.id };
    if (status) where.status = status;

    const rfqs = await prisma.b2BRFQ.findMany({
      where,
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
        quotation: { select: { id: true, quoteNumber: true, status: true, total: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ rfqs });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/b2b/rfq — Create a new RFQ
 */
export async function POST(req) {
  try {
    const { session, organization, membership } = await requireB2BMember([
      "ORGANIZATION_OWNER", "PURCHASER", "APPROVER",
    ]);
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse("At least one product item is required", 422);
    }

    // Validate all product IDs exist
    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      return errorResponse("One or more products not found", 404);
    }

    const rfqNumber = generateNumber("RFQ");

    const rfq = await prisma.b2BRFQ.create({
      data: {
        rfqNumber,
        organizationId: organization.id,
        requestedById: membership.id,
        status: body.status === "DRAFT" ? "DRAFT" : "SUBMITTED",
        message: body.message || null,
        requestedDeliveryDate: body.requestedDeliveryDate
          ? new Date(body.requestedDeliveryDate)
          : null,
        shippingCountry: body.shippingCountry || null,
        shippingCity: body.shippingCity || null,
        shippingAddress: body.shippingAddress || null,
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity, 10),
            targetPrice: item.targetPrice ? parseFloat(item.targetPrice) : null,
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true } } } },
      },
    });

    return jsonResponse({ rfq }, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("RFQ Create Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
