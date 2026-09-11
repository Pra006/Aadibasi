import prisma from "@/lib/prisma";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/b2b";

/**
 * GET /api/b2b/application — Get current user's B2B application status
 */
export async function GET() {
  try {
    const session = await requireAuth();

    const application = await prisma.b2BApplication.findUnique({
      where: { userId: session.user.id },
      include: {
        organization: {
          select: { id: true, companyName: true, status: true },
        },
      },
    });

    if (!application) {
      return jsonResponse({ application: null });
    }

    return jsonResponse({ application });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("B2B Application Fetch Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
