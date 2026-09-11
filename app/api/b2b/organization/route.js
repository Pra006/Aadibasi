import prisma from "@/lib/prisma";
import {
  requireB2BMember,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * GET /api/b2b/organization — Get current user's organization profile
 */
export async function GET() {
  try {
    const { organization } = await requireB2BMember();

    const org = await prisma.b2BOrganization.findUnique({
      where: { id: organization.id },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true, image: true } } },
        },
        addresses: true,
        _count: {
          select: {
            orders: true,
            rfqs: true,
            quotations: true,
            purchaseOrders: true,
            invoices: true,
          },
        },
      },
    });

    return jsonResponse({ organization: org });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Org Fetch Error:", err);
    return errorResponse("Internal server error", 500);
  }
}

/**
 * PATCH /api/b2b/organization — Update organization profile (OWNER only)
 */
export async function PATCH(req) {
  try {
    const { organization } = await requireB2BMember(["ORGANIZATION_OWNER"]);
    const body = await req.json();

    const allowedFields = [
      "name", "registrationNo", "panVatNo", "country", "province",
      "city", "address", "contactPhone", "whatsapp", "businessEmail",
      "website", "taxInfo", "primaryContact", "territory",
    ];

    const data = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        data[key] = body[key];
      }
    }

    const updated = await prisma.b2BOrganization.update({
      where: { id: organization.id },
      data,
    });

    return jsonResponse({ organization: updated });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("Org Update Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
