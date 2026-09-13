import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";
import { validateVariant, syncProductStock } from "@/lib/variants";

async function loadVariant(productId, variantId) {
  return prisma.productVariant.findFirst({
    where: { id: variantId, productId },
    include: {
      product: { select: { id: true, name: true } },
      _count: { select: { customerOrderItems: true, customerCartItems: true } },
    },
  });
}

/**
 * PATCH /api/admin/products/[id]/variants/[variantId] — update an option
 */
export async function PATCH(request, { params }) {
  try {
    const { admin } = await requireAdmin("products");
    const { id, variantId } = await params;
    const body = await request.json();

    const existing = await loadVariant(id, variantId);
    if (!existing) return errorResponse("Option not found", 404);

    const { errors, data } = validateVariant(body, { partial: true });
    if (errors.length) return errorResponse(errors.join(". "), 400);

    // Cross-field rule needs stored values when only one side changes.
    const nextPrice = data.price ?? existing.price;
    const nextCompareAt = data.compareAt !== undefined ? data.compareAt : existing.compareAt;
    if (nextCompareAt != null && nextCompareAt <= nextPrice) {
      return errorResponse("Compare-at price must be higher than the option price", 400);
    }

    if (data.name && data.name !== existing.name) {
      const taken = await prisma.productVariant.findFirst({
        where: { productId: id, name: data.name, NOT: { id: variantId } },
      });
      if (taken) return errorResponse(`This product already has an option called “${data.name}”`, 409);
    }

    if (data.sku && data.sku !== existing.sku) {
      const taken = await prisma.productVariant.findFirst({
        where: { sku: data.sku, NOT: { id: variantId } },
      });
      if (taken) return errorResponse("Another option already uses this SKU", 409);
    }

    if (Object.keys(data).length === 0) return errorResponse("No changes supplied", 400);

    const variant = await prisma.$transaction(async (tx) => {
      const updated = await tx.productVariant.update({ where: { id: variantId }, data });
      // Deactivating an option must also pull it out of any live carts.
      if (data.isActive === false) {
        await tx.customerCartItem.deleteMany({ where: { variantId } });
      }
      await syncProductStock(tx, id);
      return updated;
    });

    await createAuditLog({
      adminId: admin.id,
      action: data.isActive === false ? "SUSPEND" : data.isActive === true ? "ACTIVATE" : "UPDATE",
      entityType: "ProductVariant",
      entityId: variantId,
      description: `Updated option ${variant.name} on ${existing.product.name}`,
      metadata: { productId: id, fields: Object.keys(data) },
    });

    return jsonResponse(variant);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_VARIANT_UPDATE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * DELETE /api/admin/products/[id]/variants/[variantId]
 *
 * An option that appears in an order is deactivated, never removed, so the
 * historical line keeps its variant reference. Unsold options are deleted.
 */
export async function DELETE(request, { params }) {
  try {
    const { admin } = await requireAdmin("products");
    const { id, variantId } = await params;

    const existing = await loadVariant(id, variantId);
    if (!existing) return errorResponse("Option not found", 404);

    if (existing._count.customerOrderItems > 0) {
      if (!existing.isActive) {
        return jsonResponse({ deleted: false, message: "Option is already inactive" });
      }
      await prisma.$transaction(async (tx) => {
        await tx.productVariant.update({ where: { id: variantId }, data: { isActive: false } });
        await tx.customerCartItem.deleteMany({ where: { variantId } });
        await syncProductStock(tx, id);
      });

      await createAuditLog({
        adminId: admin.id,
        action: "SUSPEND",
        entityType: "ProductVariant",
        entityId: variantId,
        description: `Deactivated option ${existing.name} on ${existing.product.name} (used by existing orders)`,
        metadata: { productId: id, orderItems: existing._count.customerOrderItems },
      });

      return jsonResponse({
        deleted: false,
        message: "Option is used by existing orders, so it was deactivated instead of removed",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.productVariant.delete({ where: { id: variantId } });
      await syncProductStock(tx, id);
    });

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entityType: "ProductVariant",
      entityId: variantId,
      description: `Deleted option ${existing.name} from ${existing.product.name}`,
      metadata: { productId: id },
    });

    return jsonResponse({ deleted: true, message: "Option deleted" });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_VARIANT_DELETE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
