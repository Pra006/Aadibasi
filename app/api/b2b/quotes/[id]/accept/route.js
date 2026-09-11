import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  verifyOrgOwnership,
  generateNumber,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * POST /api/b2b/quotes/:id/accept — Accept a quotation → create PO
 */
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const { organization } = await requireB2BMember([
      "ORGANIZATION_OWNER", "PURCHASER", "APPROVER",
    ]);

    const quotation = await prisma.b2BQuotation.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!quotation) return errorResponse("Quotation not found", 404);
    verifyOrgOwnership(quotation, organization.id);

    if (quotation.status !== "SENT") {
      return errorResponse(
        `Cannot accept quotation with status: ${quotation.status}`,
        400
      );
    }

    if (quotation.validUntil && new Date(quotation.validUntil) < new Date()) {
      // Mark as expired
      await prisma.b2BQuotation.update({
        where: { id },
        data: { status: "EXPIRED" },
      });
      return errorResponse("This quotation has expired", 400);
    }

    const poNumber = generateNumber("PO");

    // Transaction: accept quote + create PO
    const result = await prisma.$transaction(async (tx) => {
      const updatedQuote = await tx.b2BQuotation.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });

      const po = await tx.b2BPurchaseOrder.create({
        data: {
          poNumber,
          organizationId: organization.id,
          quotationId: id,
          status: "SUBMITTED",
          paymentTerms: quotation.paymentTerms,
          subtotal: quotation.subtotal,
          discount: quotation.discount,
          tax: quotation.tax,
          shippingCost: quotation.shippingCost,
          total: quotation.total,
          items: {
            create: quotation.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              tax: item.tax,
              total: item.total,
            })),
          },
        },
        include: { items: true },
      });

      return { quotation: updatedQuote, purchaseOrder: po };
    });

    return jsonResponse(result, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Quote Accept Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
