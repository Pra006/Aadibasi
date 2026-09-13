import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    await requireAdmin("categories");
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
        _count: { select: { products: true } },
      },
    });

    if (!category) return errorResponse("Category not found", 404);
    return jsonResponse(category);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const { admin } = await requireAdmin("categories");
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return errorResponse("Category not found", 404);

    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.image !== undefined) data.image = body.image || null;
    if (body.parentId !== undefined) data.parentId = body.parentId || null;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    if (data.parentId === id) return errorResponse("Category cannot be its own parent", 400);

    const category = await prisma.category.update({
      where: { id },
      data,
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true, slug: true, isActive: true } },
        _count: { select: { products: true } },
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE",
      entityType: "Category",
      entityId: id,
      description: `Updated category ${category.name}`,
      metadata: { fields: Object.keys(data) },
    });

    return jsonResponse(category);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { admin } = await requireAdmin("categories");
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) return errorResponse("Category not found", 404);
    if (category._count.products > 0) return errorResponse("Cannot delete category with products", 400);
    if (category._count.children > 0) return errorResponse("Cannot delete category with subcategories", 400);

    await prisma.category.delete({ where: { id } });
    await createAuditLog({
      adminId: admin.id,
      action: "DELETE",
      entityType: "Category",
      entityId: id,
      description: `Deleted category ${category.name}`,
    });

    return jsonResponse({ message: "Category deleted" });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}
