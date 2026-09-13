import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";
import { validateVariant, syncProductStock } from "@/lib/variants";

/**
 * GET /api/admin/products/[id]/variants — options for a product
 */
export async function GET(request, { params }) {
  try {
    await requireAdmin("products");
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!product) return errorResponse("Product not found", 404);

    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return jsonResponse({ variants });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_VARIANTS_LIST_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/admin/products/[id]/variants — add an option
 */
export async function POST(request, { params }) {
  try {
    const { admin } = await requireAdmin("products");
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return errorResponse("Product not found", 404);

    const { errors, data } = validateVariant(body);
    if (errors.length) return errorResponse(errors.join(". "), 400);

    const nameTaken = await prisma.productVariant.findFirst({
      where: { productId: id, name: data.name },
    });
    if (nameTaken) return errorResponse(`This product already has an option called “${data.name}”`, 409);

    if (data.sku) {
      const skuTaken = await prisma.productVariant.findFirst({ where: { sku: data.sku } });
      if (skuTaken) return errorResponse("Another option already uses this SKU", 409);
      const productSku = await prisma.product.findFirst({ where: { sku: data.sku } });
      if (productSku) return errorResponse("A product already uses this SKU", 409);
    }

    if (data.sortOrder === undefined) {
      data.sortOrder = await prisma.productVariant.count({ where: { productId: id } });
    }

    const variant = await prisma.$transaction(async (tx) => {
      const created = await tx.productVariant.create({
        data: { productId: id, images: [], ...data },
      });
      await syncProductStock(tx, id);
      return created;
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entityType: "ProductVariant",
      entityId: variant.id,
      description: `Added option ${variant.name} to ${product.name}`,
      metadata: { productId: id, price: variant.price, stock: variant.stock },
    });

    return jsonResponse(variant, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_VARIANT_CREATE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
