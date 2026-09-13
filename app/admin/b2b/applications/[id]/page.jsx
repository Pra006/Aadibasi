"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import Icon from "@/components/ui/Icon";

export default function B2BApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetch(`/api/admin/b2b/applications/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setApp(data);
          setAdminNotes(data.adminNotes || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    if (status === "APPROVED" && !confirm("Approve this application? This will create a B2B organization and add the applicant as owner.")) return;
    if (status === "REJECTED" && !confirm("Reject this application?")) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/b2b/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      const data = await res.json();
      if (res.ok) {
        // Re-fetch to get fresh data including org
        const fresh = await fetch(`/api/admin/b2b/applications/${id}`).then((r) => r.json());
        setApp(fresh);
      } else {
        alert(data.error || "Failed to update");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <Icon name="error" size={48} className="text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Application not found</p>
        <button onClick={() => router.push("/admin/b2b/applications")} className="mt-4 text-blue-600 hover:underline text-sm">
          Back to Applications
        </button>
      </div>
    );
  }

  const isPending = ["PENDING", "UNDER_REVIEW", "CONTACT_REQUIRED"].includes(app.status);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={`Application ${app.applicationNumber}`} description={app.companyName}>
        <button onClick={() => router.push("/admin/b2b/applications")} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
          <Icon name="arrow_back" size={18} /> Back
        </button>
      </AdminPageHeader>

      {/* Status bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Status:</span>
            <AdminStatusBadge status={app.status} />
          </div>
          {isPending && (
            <div className="flex items-center gap-2 flex-wrap">
              {app.status !== "UNDER_REVIEW" && (
                <button onClick={() => updateStatus("UNDER_REVIEW")} disabled={updating} className="text-xs px-4 py-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 disabled:opacity-50">
                  Mark Under Review
                </button>
              )}
              {app.status !== "CONTACT_REQUIRED" && (
                <button onClick={() => updateStatus("CONTACT_REQUIRED")} disabled={updating} className="text-xs px-4 py-2 rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 disabled:opacity-50">
                  Contact Required
                </button>
              )}
              <button onClick={() => updateStatus("APPROVED")} disabled={updating} className="text-xs px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                Approve
              </button>
              <button onClick={() => updateStatus("REJECTED")} disabled={updating} className="text-xs px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Organization created */}
      {app.organization && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="check_circle" size={20} className="text-green-600" />
            <h3 className="font-semibold text-green-800">Organization Created</h3>
          </div>
          <p className="text-sm text-green-700">
            {app.organization.companyName} ({app.organization.organizationNumber})
          </p>
          <button
            onClick={() => router.push(`/admin/b2b/organizations/${app.organization.id}`)}
            className="mt-2 text-sm text-green-700 hover:underline"
          >
            View Organization →
          </button>
        </div>
      )}

      {/* Business details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Business Information</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Company</dt><dd className="text-slate-900 font-medium">{app.companyName}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Type</dt><dd><AdminStatusBadge status={app.businessType} /></dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Country</dt><dd>{app.country}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd>{app.businessEmail}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd>{app.phone}</dd></div>
            {app.whatsapp && <div className="flex justify-between"><dt className="text-slate-500">WhatsApp</dt><dd>{app.whatsapp}</dd></div>}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Contact Person</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Name</dt><dd className="font-medium">{app.contactPersonName}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">User Email</dt><dd>{app.user?.email}</dd></div>
            {app.user?.phone && <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd>{app.user.phone}</dd></div>}
            <div className="flex justify-between"><dt className="text-slate-500">Registered</dt><dd>{new Date(app.user?.createdAt).toLocaleDateString()}</dd></div>
          </dl>
        </div>
      </div>

      {/* Products & Requirements */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Products & Requirements</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-2">Products of Interest</p>
            <div className="flex flex-wrap gap-2">
              {app.productsOfInterest?.map((p) => (
                <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
          </div>
          {app.customProductNote && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Additional Notes</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{app.customProductNote}</p>
            </div>
          )}
          {app.estimatedOrderVolume && (
            <div className="flex gap-6 text-sm">
              <div><span className="text-slate-500">Order Volume:</span> <span className="font-medium">{app.estimatedOrderVolume}</span></div>
              {app.estimatedPurchaseValue && <div><span className="text-slate-500">Purchase Value:</span> <span className="font-medium">{app.estimatedPurchaseValue}</span></div>}
            </div>
          )}
        </div>
      </div>

      {/* Target Market */}
      {(app.targetMarket || app.targetCountry || app.targetProvince || app.targetCity) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Target Market</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            {app.targetMarket && <div><span className="text-slate-500">Market:</span> {app.targetMarket}</div>}
            {app.targetCountry && <div><span className="text-slate-500">Country:</span> {app.targetCountry}</div>}
            {app.targetProvince && <div><span className="text-slate-500">Province:</span> {app.targetProvince}</div>}
            {app.targetCity && <div><span className="text-slate-500">City:</span> {app.targetCity}</div>}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Admin Notes</h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Internal notes about this application…"
          disabled={!isPending}
        />
      </div>
    </div>
  );
}
