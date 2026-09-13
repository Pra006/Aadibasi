"use client";

import { useState } from "react";
import Link from "next/link";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import Icon from "@/components/ui/Icon";

const money = (n) => `Rs ${Number(n || 0).toLocaleString()}`;

/**
 * Line items for one order. Values come from the order-item snapshot taken at
 * purchase time, falling back to the live product only when a snapshot is absent.
 */
function OrderItems({ items }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <th className="py-2 pr-3 font-semibold">Product</th>
            <th className="py-2 px-3 font-semibold">SKU</th>
            <th className="py-2 px-3 font-semibold text-right">Qty</th>
            <th className="py-2 px-3 font-semibold text-right">Unit price</th>
            <th className="py-2 px-3 font-semibold text-right">Discount</th>
            <th className="py-2 pl-3 font-semibold text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item) => {
            const name = item.productName || item.product?.name || "Product removed";
            const image = item.productImage;
            return (
              <tr key={item.id}>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-3">
                    {image ? (
                      <img src={image} alt="" className="w-10 h-10 rounded object-cover bg-slate-100 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0">
                        <Icon name="inventory_2" size={16} className="text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      {item.product?.slug ? (
                        <Link href={`/admin/products/${item.productId}`} className="font-medium text-slate-900 hover:text-blue-600">
                          {name}
                        </Link>
                      ) : (
                        <span className="font-medium text-slate-900">{name}</span>
                      )}
                      {item.variantName && (
                        <span className="block text-xs text-slate-500">Option: {item.variantName}</span>
                      )}
                      {item.product && !item.product.isActive && (
                        <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-500">{item.variantSku || item.productSku || "—"}</td>
                <td className="py-2.5 px-3 text-right">{item.quantity}</td>
                <td className="py-2.5 px-3 text-right">{money(item.unitPrice)}</td>
                <td className="py-2.5 px-3 text-right text-slate-500">
                  {item.discount > 0 ? `−${money(item.discount)}` : "—"}
                </td>
                <td className="py-2.5 pl-3 text-right font-medium">{money(item.total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const payment = order.payments?.[0];
  const shippingLine = [order.shippingStreet, order.shippingCity, order.shippingState, order.shippingPostalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 text-left min-w-0">
          <Icon name={open ? "expand_less" : "expand_more"} size={18} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">{order.orderNumber}</p>
            <p className="text-xs text-slate-500">
              {new Date(order.createdAt).toLocaleString()} · {order._count?.items ?? order.items?.length ?? 0} item
              {(order._count?.items ?? order.items?.length) === 1 ? "" : "s"}
            </p>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <AdminStatusBadge status={order.status} />
          <AdminStatusBadge status={order.paymentStatus} />
          <span className="text-sm font-semibold text-slate-900 tabular-nums">{money(order.total)}</span>
          <Link
            href={`/admin/customer-orders/${order.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Open <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </div>

      {open && (
        <div className="mt-4 pl-7 space-y-4">
          {order.items?.length > 0 && <OrderItems items={order.items} />}

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-700 mb-1">Payment</p>
              <p className="text-slate-500">{payment?.method || "—"}</p>
              <p className="text-slate-500">Status: {order.paymentStatus}</p>
              {payment?.transactionId && <p className="text-slate-400">Txn {payment.transactionId}</p>}
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Shipping</p>
              <p className="text-slate-500">{order.shippingFullName || "—"}</p>
              {order.shippingPhone && <p className="text-slate-500">{order.shippingPhone}</p>}
              {shippingLine && <p className="text-slate-500">{shippingLine}</p>}
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Tracking</p>
              {order.trackingNumber ? (
                <>
                  <p className="text-slate-500">{order.courier || "Courier"} · {order.trackingNumber}</p>
                  {order.shippedAt && <p className="text-slate-400">Shipped {new Date(order.shippedAt).toLocaleDateString()}</p>}
                  {order.deliveredAt && <p className="text-slate-400">Delivered {new Date(order.deliveredAt).toLocaleDateString()}</p>}
                </>
              ) : (
                <p className="text-slate-400">Not dispatched yet</p>
              )}
            </div>
          </div>

          <dl className="text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1 border-t border-slate-100 pt-3">
            <div><dt className="inline font-medium">Subtotal: </dt><dd className="inline">{money(order.subtotal)}</dd></div>
            {order.discount > 0 && <div><dt className="inline font-medium">Discount: </dt><dd className="inline">−{money(order.discount)}</dd></div>}
            <div><dt className="inline font-medium">Shipping: </dt><dd className="inline">{order.shippingCost > 0 ? money(order.shippingCost) : "Free"}</dd></div>
            <div><dt className="inline font-medium">Tax: </dt><dd className="inline">{money(order.tax)}</dd></div>
            <div><dt className="inline font-medium text-slate-700">Total: </dt><dd className="inline font-semibold text-slate-900">{money(order.total)}</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default function CustomerOrderHistory({ orders = [], totalOrders = 0 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Order history</h3>
        <span className="text-xs text-slate-500">
          {orders.length < totalOrders ? `Showing ${orders.length} of ${totalOrders}` : `${totalOrders} order${totalOrders === 1 ? "" : "s"}`}
        </span>
      </div>
      {orders.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {orders.map((order) => <OrderRow key={order.id} order={order} />)}
        </div>
      ) : (
        <div className="px-6 py-12 text-center text-sm text-slate-400">No orders yet</div>
      )}
    </div>
  );
}
