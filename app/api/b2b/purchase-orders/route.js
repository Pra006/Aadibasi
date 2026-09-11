import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  generateNumber,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/purchase-orders — List org's purchase orders
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = { organizationId: organization.id };
    if (status) where.status = status;

    const purchaseOrders = await prisma.b2BPurchaseOrder.findMany({
      where,
      include: {
        items: {
          include: { product: { select: { id: true, name: true, images: true } } },
        },
        quotation: { select: { id: true, quoteNumber: true } },
        order: { select: { id: true, orderNumber: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ purchaseOrders });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/b2b/purchase-orders — Create a PO directly (without quotation)
 */
export async function POST(req) {
  try {
    const { organization } = await requireB2BMember([
      "ORGANIZATION_OWNER", "PURCHASER", "APPROVER",
    ]);
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse("At least one item is required", 422);
    }

    const poNumber = generateNumber("PO");

    let subtotal = 0;
    const itemsData = body.items.map((item) => {
      const lineTotal = item.unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        productId: item.productId,
        quantity: parseInt(item.quantity, 10),
        unitPrice: parseFloat(item.unitPrice),
        discount: parseFloat(item.discount || 0),
        tax: parseFloat(item.tax || 0),
        total: lineTotal,
      };
    });

    const discount = parseFloat(body.discount || 0);
    const tax = parseFloat(body.tax || 0);
    const shippingCost = parseFloat(body.shippingCost || 0);
    const total = subtotal - discount + tax + shippingCost;

    const po = await prisma.b2BPurchaseOrder.create({
      data: {
        poNumber,
        organizationId: organization.id,
        status: body.status === "DRAFT" ? "DRAFT" : "SUBMITTED",
        billingAddress: body.billingAddress || null,
        shippingAddress: body.shippingAddress || null,
        paymentTerms: body.paymentTerms || null,
        deliveryNotes: body.deliveryNotes || null,
        notes: body.notes || null,
        subtotal,
        discount,
        tax,
        shippingCost,
        total,
        items: { create: itemsData },
      },
      include: { items: true },
    });

    return jsonResponse({ purchaseOrder: po }, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("PO Create Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
