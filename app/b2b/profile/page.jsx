"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Icon from "@/components/ui/Icon";

export default function B2BProfilePage() {
  const { data: session } = useSession();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/b2b/organization")
      .then((r) => r.json())
      .then((data) => setOrg(data.organization || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-headline text-3xl text-forest-deep">My Profile</h1>
      </div>

      {/* User Info */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-forest-deep mb-4 flex items-center gap-2">
          <Icon name="person" size={20} />
          Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Name</span>
            <span className="font-semibold text-forest-deep">{user?.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Email</span>
            <span className="font-semibold text-forest-deep">{user?.email || "—"}</span>
          </div>
        </div>
      </div>

      {/* Organization Info */}
      {org && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-forest-deep mb-4 flex items-center gap-2">
            <Icon name="business" size={20} />
            Organization
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Company</span>
              <span className="font-semibold text-forest-deep">{org.companyName}</span>
            </div>
            {org.registrationNumber && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Registration #</span>
                <span className="font-semibold text-forest-deep">{org.registrationNumber}</span>
              </div>
            )}
            {org.panVatNumber && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">PAN/VAT</span>
                <span className="font-semibold text-forest-deep">{org.panVatNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Members</span>
              <span className="font-semibold text-forest-deep">{org._count?.members || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5">
        <h2 className="font-semibold text-forest-deep mb-4 flex items-center gap-2">
          <Icon name="link" size={20} />
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: "/b2b/company", icon: "business", label: "Company Profile" },
            { href: "/b2b/members", icon: "group", label: "Team Members" },
            { href: "/b2b/orders", icon: "local_shipping", label: "Orders" },
            { href: "/b2b/invoices", icon: "receipt", label: "Invoices" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 p-3 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low text-sm font-semibold text-forest-deep transition-colors"
            >
              <Icon name={link.icon} size={18} className="text-herbal-jade" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
