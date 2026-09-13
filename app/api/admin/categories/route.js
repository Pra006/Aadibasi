import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    await requireAdmin("categories");

    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true, products: true } },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse(categories);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  try {
    const { admin } = await requireAdmin("categories");
    const body = await request.json();
    const { name, slug, description, image, parentId, isActive } = body;

    if (!name || !slug) return errorResponse("Name and slug are required", 400);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return errorResponse("A category with this slug already exists", 409);

    if (parentId) {
      const parent = await prisma.category.findUnique({ where: { id: parentId } });
      if (!parent) return errorResponse("Parent category not found", 404);
    }

    const category = await prisma.category.create({
      data: {
        name, slug, description, image,
        parentId: parentId || null,
        isActive: isActive ?? true,
      },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { children: true, products: true } },
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE",
      entityType: "Category",
      entityId: category.id,
      description: `Created category ${category.name}`,
    });

    return jsonResponse(category, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}
