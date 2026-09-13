import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const admin = await requireAdmin("admins");
    const { id } = await params;

    const record = await prisma.adminUser.findUnique({
      where: { id },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, image: true, emailVerified: true, lastLoginAt: true, isActive: true, createdAt: true, updatedAt: true } } },
    });

    if (!record) return errorResponse("Admin not found", 404);
    return jsonResponse(record);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdmin("admins");
    const { id } = await params;
    const body = await request.json();
    const { role, isActive } = body;

    const record = await prisma.adminUser.findUnique({ where: { id } });
    if (!record) return errorResponse("Admin not found", 404);

    if (record.id === admin.id && role && role !== record.role) {
      return errorResponse("Cannot change your own admin role", 403);
    }

    const data = {};
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.adminUser.update({
      where: { id },
      data,
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, image: true, emailVerified: true, lastLoginAt: true, isActive: true, createdAt: true, updatedAt: true } } },
    });

    await createAuditLog(admin.id, "UPDATE", "AdminUser", id, `Updated admin: ${JSON.stringify(data)}`);

    return jsonResponse(updated);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin("admins");
    const { id } = await params;

    const record = await prisma.adminUser.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });
    if (!record) return errorResponse("Admin not found", 404);

    if (record.id === admin.id) {
      return errorResponse("Cannot delete your own admin record", 403);
    }

    await prisma.adminUser.delete({ where: { id } });

    await createAuditLog(admin.id, "DELETE", "AdminUser", id, `Removed admin: ${record.user.email}`);

    return jsonResponse({ message: "Admin removed" });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}
