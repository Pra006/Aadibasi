"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";

export default function CompanyPage() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetch("/api/b2b/organization")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data.organization);
        setForm(data.organization || {});
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/b2b/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setOrg(data.organization);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <Icon name="apartment" size={48} className="text-outline-variant mx-auto mb-4" />
        <p className="text-on-surface-variant">Organization not found</p>
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Company Name" },
    { key: "businessType", label: "Business Type", readOnly: true },
    { key: "registrationNo", label: "Registration Number" },
    { key: "panVatNo", label: "PAN / VAT" },
    { key: "country", label: "Country" },
    { key: "province", label: "Province" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "contactPhone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "businessEmail", label: "Business Email" },
    { key: "website", label: "Website" },
    { key: "taxInfo", label: "Tax Information" },
    { key: "primaryContact", label: "Primary Contact" },
    { key: "territory", label: "Distribution Territory" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-headline text-3xl text-forest-deep">Company Profile</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            <B2BStatusBadge status={org.businessType} />
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-forest-deep border border-forest-base/30 rounded font-semibold text-sm hover:bg-forest-base/5 transition-colors"
          >
            <Icon name="edit" size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setForm(org); }}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded font-semibold text-sm hover:bg-forest-deep transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl divide-y divide-outline-variant/40">
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col sm:flex-row sm:items-center px-6 py-4 gap-2">
            <div className="sm:w-48 text-sm font-semibold text-on-surface-variant shrink-0">
              {f.label}
            </div>
            <div className="flex-1">
              {editing && !f.readOnly ? (
                <input
                  value={form[f.key] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-base/20"
                />
              ) : (
                <span className="text-sm text-forest-deep">
                  {org[f.key] || <span className="text-outline-variant italic">—</span>}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
