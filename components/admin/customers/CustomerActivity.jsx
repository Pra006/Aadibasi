"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";

const actorTone = {
  ADMIN: "bg-purple-50 text-purple-700",
  CUSTOMER: "bg-blue-50 text-blue-700",
  SYSTEM: "bg-slate-100 text-slate-600",
};

export default function CustomerActivity({ events = [], registeredAt, lastLoginAt }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Activity</h3>
      </div>

      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Icon name="person_add" size={16} className="text-slate-400" />
          <span className="text-slate-600">Registered</span>
          <span className="ml-auto text-slate-400 text-xs">
            {registeredAt ? new Date(registeredAt).toLocaleString() : "—"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="login" size={16} className="text-slate-400" />
          <span className="text-slate-600">Last login</span>
          <span className="ml-auto text-slate-400 text-xs">
            {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : "Never"}
          </span>
        </div>
      </div>

      {events.length > 0 && (
        <ul className="border-t border-slate-100 divide-y divide-slate-50">
          {events.map((e) => (
            <li key={e.id} className="px-6 py-3 flex items-start gap-3 text-sm">
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded mt-0.5 ${actorTone[e.actor] || actorTone.SYSTEM}`}>
                {e.actor}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-slate-700">{e.message}</p>
                <Link href={`/admin/customer-orders/${e.order.id}`} className="text-xs text-blue-600 hover:underline">
                  {e.order.orderNumber}
                </Link>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{new Date(e.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
