import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import { generateRefNumber } from "@/lib/ref-number";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    await requireAdmin("b2b.applications");
    const { id } = await params;

    const app = await prisma.b2BApplication.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true } },
        organization: { select: { id: true, organizationNumber: true, companyName: true, status: true } },
      },
    });

    if (!app) return errorResponse("Application not found", 404);
    return jsonResponse(app);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_B2B_APP_DETAIL_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * PATCH — update status.
 * When status → APPROVED, create B2BOrganization + owner membership automatically.
 */
export async function PATCH(request, { params }) {
  try {
    const { admin } = await requireAdmin("b2b.applications");
    const { id } = await params;
    const body = await request.json();

    const app = await prisma.b2BApplication.findUnique({
      where: { id },
      include: { organization: true },
    });
    if (!app) return errorResponse("Application not found", 404);

    const validStatuses = ["PENDING", "UNDER_REVIEW", "CONTACT_REQUIRED", "APPROVED", "REJECTED"];
    if (!body.status || !validStatuses.includes(body.status)) {
      return errorResponse("Invalid status", 400);
    }

    // Prevent re-approving if org already exists
    if (body.status === "APPROVED" && app.organization) {
      return errorResponse("Application already approved and organization exists", 400);
    }

    if (body.status === "APPROVED") {
      // Create organization + add applicant as OWNER
      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.b2BApplication.update({
          where: { id },
          data: { status: "APPROVED" },
        });

        const org = await tx.b2BOrganization.create({
          data: {
            organizationNumber: generateRefNumber("ORG"),
            b2bApplicationId: id,
            companyName: app.companyName,
            businessType: app.businessType,
            country: app.country || "Nepal",
            businessEmail: app.businessEmail,
            phone: app.phone,
            whatsapp: app.whatsapp,
          },
        });

        await tx.b2BOrganizationMember.create({
          data: {
            organizationId: org.id,
            userId: app.userId,
            role: "OWNER",
            status: "ACTIVE",
          },
        });

        return { application: updated, organization: org };
      });

      await createAuditLog({
        adminId: admin.id,
        action: "APPROVE",
        entityType: "B2BApplication",
        entityId: id,
        description: `Approved application ${app.applicationNumber}, created org ${result.organization.organizationNumber}`,
        metadata: { organizationId: result.organization.id },
      });

      return jsonResponse(result, 200);
    }

    // Non-approval status change
    const updated = await prisma.b2BApplication.update({
      where: { id },
      data: { status: body.status, adminNotes: body.adminNotes || app.adminNotes },
    });

    const actionMap = { REJECTED: "REJECT", UNDER_REVIEW: "UPDATE", CONTACT_REQUIRED: "UPDATE", PENDING: "UPDATE" };

    await createAuditLog({
      adminId: admin.id,
      action: actionMap[body.status] || "UPDATE",
      entityType: "B2BApplication",
      entityId: id,
      description: `Changed application ${app.applicationNumber} status to ${body.status}`,
      metadata: { from: app.status, to: body.status },
    });

    return jsonResponse(updated);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_B2B_APP_UPDATE_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
