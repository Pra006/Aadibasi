import { requireAdmin, jsonResponse, errorResponse } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    await requireAdmin("dashboard");

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      totalCustomers,
      newCustomers,
      totalB2BOrgs,
      pendingApplications,
      activeOrgs,
      customerOrders,
      b2bOrders,
      pendingCustomerOrders,
      pendingB2BOrders,
      customerRevenue,
      b2bRevenue,
      pendingRFQs,
      activeQuotations,
      pendingPOs,
      outstandingInvoices,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: since } } }),
      prisma.b2BOrganization.count(),
      prisma.b2BApplication.count({ where: { status: "PENDING" } }),
      prisma.b2BOrganization.count({ where: { status: "ACTIVE" } }),
      prisma.customerOrder.count(),
      prisma.b2BOrder.count(),
      prisma.customerOrder.count({ where: { status: "PENDING" } }),
      prisma.b2BOrder.count({ where: { status: "PENDING" } }),
      prisma.customerOrder.aggregate({ _sum: { total: true } }),
      prisma.b2BOrder.aggregate({ _sum: { total: true } }),
      prisma.b2BRFQ.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
      prisma.b2BQuotation.count({ where: { status: "SENT" } }),
      prisma.b2BPurchaseOrder.count({ where: { status: { in: ["SUBMITTED", "CONFIRMED"] } } }),
      prisma.b2BInvoice.count({ where: { paymentStatus: { in: ["PENDING", "OVERDUE"] } } }),
    ]);

    return jsonResponse({
      customers: {
        total: totalCustomers,
        new: newCustomers,
      },
      b2b: {
        totalOrgs: totalB2BOrgs,
        pendingApplications,
        activeOrgs,
      },
      orders: {
        customerOrders,
        b2bOrders,
        pendingCustomerOrders,
        pendingB2BOrders,
      },
      revenue: {
        customer: customerRevenue._sum.total || 0,
        b2b: b2bRevenue._sum.total || 0,
        total: (customerRevenue._sum.total || 0) + (b2bRevenue._sum.total || 0),
      },
      b2bWorkflow: {
        pendingRFQs,
        activeQuotations,
        pendingPOs,
        outstandingInvoices,
      },
    });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[ADMIN_DASHBOARD_ERROR]", err);
    return errorResponse("Internal server error", 500);
  }
}
