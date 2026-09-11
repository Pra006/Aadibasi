import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  validateRequired,
  validateEmail,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/members — List organization members
 */
export async function GET() {
  try {
    const { organization } = await requireB2BMember();

    const members = await prisma.b2BOrganizationMember.findMany({
      where: { organizationId: organization.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, image: true } },
      },
      orderBy: { joinedAt: "asc" },
    });

    return jsonResponse({ members });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}

/**
 * POST /api/b2b/members — Invite/add a member (OWNER only)
 */
export async function POST(req) {
  try {
    const { organization } = await requireB2BMember(["ORGANIZATION_OWNER"]);
    const body = await req.json();

    const errors = validateRequired(body, ["email", "role"]);
    if (errors) {
      return jsonResponse({ error: "Validation failed", fields: errors }, 422);
    }

    if (!validateEmail(body.email)) {
      return errorResponse("Invalid email address", 422);
    }

    const validRoles = [
      "ORGANIZATION_OWNER", "PURCHASER", "APPROVER", "ACCOUNTANT", "EMPLOYEE",
    ];
    if (!validRoles.includes(body.role)) {
      return errorResponse("Invalid role", 422);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase().trim() },
    });
    if (!user) {
      return errorResponse("No user found with that email. They must register first.", 404);
    }

    // Check not already a member
    const existing = await prisma.b2BOrganizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id,
        },
      },
    });
    if (existing) {
      return errorResponse("User is already a member of this organization", 409);
    }

    const member = await prisma.b2BOrganizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: body.role,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, image: true } },
      },
    });

    return jsonResponse({ member }, 201);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
