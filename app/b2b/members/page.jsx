"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import B2BStatusBadge from "@/components/b2b/B2BStatusBadge";

const ROLES = [
  { value: "ORGANIZATION_OWNER", label: "Owner" },
  { value: "PURCHASER", label: "Purchaser" },
  { value: "APPROVER", label: "Approver" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "EMPLOYEE", label: "Employee" },
];

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("EMPLOYEE");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  async function fetchMembers() {
    const res = await fetch("/api/b2b/members");
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }

  useEffect(() => { fetchMembers(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/b2b/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add member");
        return;
      }
      setShowAdd(false);
      setNewEmail("");
      setNewRole("EMPLOYEE");
      fetchMembers();
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(memberId) {
    if (!confirm("Remove this member?")) return;
    await fetch(`/api/b2b/members/${memberId}`, { method: "DELETE" });
    fetchMembers();
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="font-headline text-3xl text-forest-deep">Team Members</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">{members.length} members</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-base text-ivory-canvas border border-antique-gold/40 rounded font-semibold text-sm hover:bg-forest-deep transition-colors"
        >
          <Icon name="person_add" size={16} />
          Add Member
        </button>
      </div>

      {/* Add member form */}
      {showAdd && (
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-forest-deep mb-3">Add New Member</h3>
          {error && (
            <div className="mb-3 text-sm text-error flex items-center gap-1.5">
              <Icon name="error" size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="member@company.com"
              required
              className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-base/20"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-base/20"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2.5 bg-forest-base text-ivory-canvas rounded-xl text-sm font-semibold hover:bg-forest-deep disabled:opacity-60 transition-colors"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </form>
          <p className="text-xs text-on-surface-variant mt-2">
            The user must already have a Hakkiveda account.
          </p>
        </div>
      )}

      {/* Members list */}
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl divide-y divide-outline-variant/40">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="hourglass_empty" size={24} className="animate-spin text-on-surface-variant" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="group" size={40} className="text-outline-variant mx-auto mb-3" />
            <p className="text-sm text-on-surface-variant">No members yet</p>
          </div>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-10 h-10 rounded-full bg-forest-base/10 flex items-center justify-center text-forest-base font-bold text-sm shrink-0">
                {([m.user.firstName, m.user.lastName].filter(Boolean).join(" ") || m.user.email || "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-forest-deep truncate">
                  {[m.user.firstName, m.user.lastName].filter(Boolean).join(" ") || "Unnamed"}
                </div>
                <div className="text-xs text-on-surface-variant truncate">{m.user.email}</div>
              </div>
              <B2BStatusBadge status={m.role} />
              {m.role !== "ORGANIZATION_OWNER" && (
                <button
                  onClick={() => handleRemove(m.id)}
                  className="text-on-surface-variant hover:text-error transition-colors"
                  title="Remove member"
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
