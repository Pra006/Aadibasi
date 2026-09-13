import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateRefNumber } from "@/lib/ref-number";

/**
 * POST /api/auth/register/vendor
 * Creates a User + B2BApplication (the "vendor" registration form submits here).
 * VendorApplication model no longer exists — all business registrations go through B2B.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      // Personal
      fullName,
      email,
      phone,
      password,
      // Business
      storeName,
      businessType,
      businessRegNo,
      panVatNo,
      businessEmail,
      businessPhone,
      // Address
      province,
      district,
      city,
      streetAddress,
      postalCode,
      // Store
      storeDescription,
      categories,
      plannedProducts,
    } = body;

    // ---- validation ----
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email and password are required." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (!storeName || !businessType || !province || !district || !city) {
      return NextResponse.json(
        { error: "Store name, business type, and address are required." },
        { status: 400 }
      );
    }
    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one product category." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // ---- check duplicates ----
    const existing = await prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (phone) {
      const phoneExists = await prisma.user.findUnique({
        where: { phone: phone.trim() },
      });
      if (phoneExists) {
        return NextResponse.json(
          { error: "An account with this phone number already exists." },
          { status: 409 }
        );
      }
    }

    // ---- create user + B2B application in a transaction ----
    const hashedPassword = await bcrypt.hash(password, 12);
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || null;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: emailLower,
          phone: phone?.trim() || null,
          hashedPassword,
        },
      });

      const application = await tx.b2BApplication.create({
        data: {
          applicationNumber: generateRefNumber("B2B"),
          userId: user.id,
          contactPersonName: fullName.trim(),
          companyName: storeName.trim(),
          country: "Nepal",
          businessType: mapBusinessType(businessType),
          phone: phone?.trim() || businessPhone?.trim() || "",
          businessEmail: (businessEmail || emailLower).trim(),
          productsOfInterest: categories || [],
          customProductNote: [storeDescription, plannedProducts].filter(Boolean).join("\n") || null,
          targetProvince: province?.trim() || null,
          targetCity: city?.trim() || null,
        },
      });

      return { user, application };
    });

    return NextResponse.json(
      {
        id: result.user.id,
        applicationId: result.application.id,
        applicationNumber: result.application.applicationNumber,
        status: result.application.status,
        message: "B2B business application submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[B2B_REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Map old BusinessType enum values to new B2BBusinessType values.
 */
function mapBusinessType(type) {
  const mapping = {
    INDIVIDUAL: "OTHER",
    SOLE_PROPRIETORSHIP: "RETAILER",
    PARTNERSHIP: "DISTRIBUTOR",
    PRIVATE_COMPANY: "CORPORATE_BUYER",
    OTHER: "OTHER",
  };
  return mapping[type] || "OTHER";
}
