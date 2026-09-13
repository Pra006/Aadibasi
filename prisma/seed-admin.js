const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@hakkiveda.com";
  const password = "Admin@1234";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      firstName: "System",
      lastName: "Admin",
      email,
      hashedPassword,
      isActive: true,
    },
  });

  const adminUser = await prisma.adminUser.upsert({
    where: { userId: user.id },
    update: { role: "ADMIN", isActive: true },
    create: {
      userId: user.id,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin account ready!");
  console.log("   Email:    admin@hakkiveda.com");
  console.log("   Password: Admin@1234");
  console.log("   Role:     ADMIN");
  console.log("   User ID: ", user.id);
  console.log("   Admin ID:", adminUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
