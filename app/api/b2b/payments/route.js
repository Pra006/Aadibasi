import prisma from "@/lib/prisma";
import { requireB2BMember, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/payments — List organization's payments
 */
export async function GET(req) {
  try {
    const { organization } = await requireB2BMember();

    const payments = await prisma.b2BPayment.findMany({
      where: { organizationId: organization.id },
      include: {
        invoice: { select: { id: true, invoiceNumber: true, total: true, paymentStatus: true } },
      },
      orderBy: { paidAt: "desc" },
    });

    return jsonResponse({ payments });
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse("Internal server error", 500);
  }
}
