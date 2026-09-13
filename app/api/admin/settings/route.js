import { requireAdmin, jsonResponse, errorResponse, createAuditLog } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    await requireAdmin("settings");

    const settings = await prisma.adminSetting.findMany({ orderBy: { category: "asc" } });

    const grouped = {};
    for (const s of settings) {
      const cat = s.category || "general";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    }

    return jsonResponse(grouped);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}

export async function PUT(request) {
  try {
    const admin = await requireAdmin("settings");
    const body = await request.json();
    const { key, value } = body;

    if (!key) return errorResponse("Setting key is required", 400);

    const setting = await prisma.adminSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, category: body.category || "general" },
    });

    await createAuditLog(admin.id, "UPDATE", "AdminSetting", setting.id, `Updated setting: ${key}`);

    return jsonResponse(setting);
  } catch (err) {
    if (err instanceof Response) return err;
    return errorResponse(err.message, 500);
  }
}
