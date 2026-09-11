import prisma from "@/lib/prisma";
import {
  requireAuth,
  generateRefNumber,
  validateRequired,
  validateEmail,
  validatePhone,
  jsonResponse,
  errorResponse,
} from "@/lib/b2b";

/**
 * POST /api/b2b/applications — Submit a B2B Commercial Partnership Application
 */
export async function POST(req) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // Check for duplicate application
    const existing = await prisma.b2BApplication.findUnique({
      where: { userId },
    });
    if (existing) {
      return errorResponse(
        "You have already submitted a B2B application. Reference: " +
          existing.referenceNumber,
        409
      );
    }

    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "contactPerson",
      "companyName",
      "countryOfOp",
      "businessType",
      "phone",
      "businessEmail",
    ];
    const errors = validateRequired(body, requiredFields);
    if (errors) {
      return jsonResponse({ error: "Validation failed", fields: errors }, 422);
    }

    if (!validateEmail(body.businessEmail)) {
      return errorResponse("Invalid business email address", 422);
    }
    if (!validatePhone(body.phone)) {
      return errorResponse("Invalid phone number", 422);
    }

    // Validate enum values
    const validBusinessTypes = [
      "DISTRIBUTOR", "WHOLESALER", "RETAILER", "IMPORTER",
      "ONLINE_SELLER", "PRIVATE_LABEL_BUYER", "CORPORATE_BUYER",
      "INSTITUTIONAL_BUYER", "SALON_SPA", "OTHER",
    ];
    if (!validBusinessTypes.includes(body.businessType)) {
      return errorResponse("Invalid business type", 422);
    }

    const validVolumes = [
      "LESS_THAN_100", "FROM_100_TO_500", "FROM_500_TO_1000",
      "FROM_1000_TO_5000", "MORE_THAN_5000", "CUSTOM_PROJECT",
    ];
    if (body.estimatedVolume && !validVolumes.includes(body.estimatedVolume)) {
      return errorResponse("Invalid order volume", 422);
    }

    const validChannels = ["WHATSAPP", "PHONE", "EMAIL", "WHATSAPP_EMAIL"];
    if (body.preferredChannel && !validChannels.includes(body.preferredChannel)) {
      return errorResponse("Invalid communication channel", 422);
    }

    const referenceNumber = generateRefNumber("B2B");

    const application = await prisma.b2BApplication.create({
      data: {
        referenceNumber,
        userId,
        contactPerson: body.contactPerson.trim(),
        companyName: body.companyName.trim(),
        countryOfOp: body.countryOfOp.trim(),
        businessType: body.businessType,
        phone: body.phone.trim(),
        businessEmail: body.businessEmail.toLowerCase().trim(),
        productsOfInterest: body.productsOfInterest || [],
        customProductNote: body.customProductNote || null,
        estimatedVolume: body.estimatedVolume || null,
        estimatedMonthlyValue: body.estimatedMonthlyValue || null,
        targetCountry: body.targetCountry || null,
        targetProvince: body.targetProvince || null,
        targetCity: body.targetCity || null,
        targetTerritory: body.targetTerritory || null,
        customMessage: body.customMessage || null,
        preferredChannel: body.preferredChannel || "EMAIL",
      },
    });

    return jsonResponse(
      {
        success: true,
        referenceNumber: application.referenceNumber,
        status: application.status,
        message:
          "Your B2B application has been submitted successfully. We will review your business profile and contact you regarding commercial pricing, MOQ, and partnership terms.",
      },
      201
    );
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("B2B Application Error:", err);
    return errorResponse("Internal server error", 500);
  }
}
