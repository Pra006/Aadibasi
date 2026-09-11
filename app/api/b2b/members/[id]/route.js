import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  verifyOrgOwnership,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * DELETE /api/b2b/members/:id — Remove a member (OWNER only)
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const { organization, session } = await requireB2BMember(["ORGANIZATION_OWNER"]);

    const member = await prisma.b2BOrganizationMember.findUnique({
      where: { id },
    });

    if (!member) {
      return errorResponse("Member not found", 404);
    }

    verifyOrgOwnership(member, organization.id);

    // Prevent owner from removing themselves
    if (member.userId === session.user.id) {
      return errorResponse("You cannot remove yourself as the organization owner", 400);
    }

    await prisma.b2BOrganizationMember.delete({ where: { id } });

    return jsonResponse({ success: true });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}

/**
 * PATCH /api/b2b/members/:id — Update member role (OWNER only)
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { organization } = await requireB2BMember(["ORGANIZATION_OWNER"]);
    const body = await req.json();

    const validRoles = [
      "ORGANIZATION_OWNER", "PURCHASER", "APPROVER", "ACCOUNTANT", "EMPLOYEE",
    ];
    if (!body.role || !validRoles.includes(body.role)) {
      return errorResponse("Invalid role", 422);
    }

    const member = await prisma.b2BOrganizationMember.findUnique({
      where: { id },
    });
    if (!member) return errorResponse("Member not found", 404);
    verifyOrgOwnership(member, organization.id);

    const updated = await prisma.b2BOrganizationMember.update({
      where: { id },
      data: { role: body.role },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return jsonResponse({ member: updated });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
