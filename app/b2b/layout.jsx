import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import B2BShell from "@/components/b2b/B2BShell";

export const metadata = { title: "B2B Portal — Hakkiveda" };

export default async function B2BLayout({ children }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/b2b");

  // Check org membership
  const membership = await prisma.b2BOrganizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // If no membership, only /b2b/apply is allowed (handled by its own page)
  // For all other B2B pages, require membership
  // The apply page doesn't use this layout (it has its own full-page design)

  if (!membership) {
    // Allow access — the individual pages will handle the redirect
    return <>{children}</>;
  }

  return (
    <B2BShell
      organization={membership.organization}
      user={{ name: session.user.name, email: session.user.email }}
    >
      {children}
    </B2BShell>
  );
}
