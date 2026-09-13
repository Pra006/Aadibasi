import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";
import { validateProduct } from "@/lib/products";

/**
 * GET /api/admin/products/[id] — full product detail plus sales summary
 */
export async function GET(request, { params }) {
  try {
    await requireAdmin("products");
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
        _count: { select: { customerOrderItems: true, customerCartItems: true, variants: true } },
      },
    });

    if (!product) return errorResponse("Product not found", 404);

    const sold = await prisma.customerOrderItem.aggregate({
      where: { productId: id, order: { status: { notIn: ["CANCELLED", "RETURNED", "REFUNDED"] } } },
      _sum: { quantity: true, total: true },
    });

    return jsonResponse({
      ...product,
      variantCount: product._count.variants,
      stats: {
        unitsSold: sold._sum.quantity || 0,
        revenue: sold._sum.total || 0,
        inCarts: product._count.customerCartItems,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_PRODUCT_DETAIL_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * PATCH /api/admin/products/[id] — update a product
 */
export async function PATCH(request, { params }) {
  try {
    const { admin } = await requireAdmin("products");
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return errorResponse("Product not found", 404);

    const { errors, data } = validateProduct(body, { partial: true });
    if (errors.length) return errorResponse(errors.join(". "), 400);

    // Cross-field rule needs the stored value when only one side is being changed.
    const nextPrice = data.retailPrice ?? existing.retailPrice;
    const nextCompareAt = data.compareAt !== undefined ? data.compareAt : existing.compareAt;
    if (nextCompareAt != null && nextCompareAt <= nextPrice) {
      return errorResponse("Compare-at price must be higher than the retail price", 400);
    }

    if (data.slug && data.slug !== existing.slug) {
      const taken = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (taken) return errorResponse("A product with this URL slug already exists", 409);
    }

    if (data.sku && data.sku !== existing.sku) {
      const taken = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (taken) return errorResponse("A product with this SKU already exists", 409);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) return errorResponse("Selected category does not exist", 400);
    }

    if (Object.keys(data).length === 0) {
      return errorResponse("No changes supplied", 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entityType: "Product",
      entityId: id,
      description: `Updated product ${product.name}`,
      metadata: { fields: Object.keys(data) },
    });

    return jsonResponse(product);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_PRODUCT_UPDATE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * DELETE /api/admin/products/[id]
 *
 * Products referenced by an order, cart or wishlist are deactivated rather than
 * removed, so historical orders keep a valid product reference. Anything else is
 * deleted outright.
 */
export async function DELETE(request, { params }) {
  try {
    const { admin } = await requireAdmin("products");
    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            customerOrderItems: true,
            customerCartItems: true,
            customerWishlistItems: true,
            b2bOrderItems: true,
          },
        },
      },
    });
    if (!existing) return errorResponse("Product not found", 404);

    const referenced =
      existing._count.customerOrderItems > 0 ||
      existing._count.customerCartItems > 0 ||
      existing._count.customerWishlistItems > 0 ||
      existing._count.b2bOrderItems > 0;

    if (referenced) {
      if (!existing.isActive) {
        return jsonResponse({ deleted: false, message: "Product is already inactive" });
      }
      await prisma.product.update({ where: { id }, data: { isActive: false } });
      await createAuditLog({
        adminId: admin.id,
        action: "SUSPEND",
        entityType: "Product",
        entityId: id,
        description: `Deactivated product ${existing.name} (referenced by existing records)`,
        metadata: { counts: existing._count },
      });
      return jsonResponse({
        deleted: false,
        message: "Product is used by existing orders, so it was deactivated and removed from the store",
      });
    }

    await prisma.product.delete({ where: { id } });
    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entityType: "Product",
      entityId: id,
      description: `Deleted product ${existing.name}`,
      metadata: { slug: existing.slug },
    });

    return jsonResponse({ deleted: true, message: "Product deleted" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_PRODUCT_DELETE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
