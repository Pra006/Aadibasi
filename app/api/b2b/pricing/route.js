import prisma from "@/lib/prisma";
import { requireB2BMember, getB2BPrice, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/pricing?productId=xxx&quantity=100
 * Get effective B2B price for a product
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("productId");
    const quantity = parseInt(searchParams.get("quantity") || "1", 10);

    if (!productId) return errorResponse("productId required", 400);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        b2bPriceTiers: { orderBy: { minQty: "asc" } },
      },
    });

    if (!product || !product.isB2B) {
      return errorResponse("Product not found or not available for B2B", 404);
    }

    const pricing = await getB2BPrice(productId, organization.id, quantity);

    return jsonResponse({
      product: {
        id: product.id,
        name: product.name,
        retailPrice: product.retailPrice,
        moq: product.moq,
      },
      pricing: {
        ...pricing,
        quantity,
        lineTotal: pricing.unitPrice * quantity,
      },
      tiers: product.b2bPriceTiers,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
