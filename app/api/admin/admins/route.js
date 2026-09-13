import { requireAdmin, jsonResponse, errorResponse, parsePagination, paginatedResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const admin = await requireAdmin("admins");
    const { searchParams } = new URL(request.url);
    const { skip, take, page } = parsePagination(searchParams);
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { user: { firstName: { contains: search, mode: "insensitive" } } },
            { user: { lastName: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [admins, total] = await Promise.all([
      prisma.adminUser.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, image: true, emailVerified: true, lastLoginAt: true, isActive: true, createdAt: true, updatedAt: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.adminUser.count({ where }),
    ]);

    return paginatedResponse(admins, total, page, take);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdmin("admins");
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return errorResponse("Email and role are required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse("No user found with that email", 404);
    }

    const existing = await prisma.adminUser.findUnique({ where: { userId: user.id } });
    if (existing) {
      return errorResponse("User is already an admin", 409);
    }

    const newAdmin = await prisma.adminUser.create({
      data: { userId: user.id, role },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, image: true, emailVerified: true, lastLoginAt: true, isActive: true, createdAt: true, updatedAt: true } } },
    });

    await createAuditLog(admin.id, "CREATE", "AdminUser", newAdmin.id, `Added admin: ${email} as ${role}`);

    return jsonResponse(newAdmin, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}
