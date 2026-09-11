import prisma from "@/lib/prisma";
import { requireB2BMember, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/products — List B2B-available products with pricing
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const skip = (page - 1) * limit;

    const where = { isB2B: true, isActive: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          b2bPriceTiers: { orderBy: { minQty: "asc" } },
          b2bPrices: {
            where: { organizationId: organization.id },
          },
        },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    // Attach effective pricing
    const enriched = products.map((p) => {
      const orgPrice = p.b2bPrices[0];
      return {
        ...p,
        effectivePrice: orgPrice ? orgPrice.unitPrice : (p.b2bPriceTiers[0]?.unitPrice ?? p.retailPrice),
        hasOrgPrice: !!orgPrice,
      };
    });

    return jsonResponse({
      products: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
