'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, Receipt, Plus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { customerApi } from '../../../lib/api/customer';
import { PaymentMethodInfo, InvoiceInfo, SubscriptionInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { InvoiceViewerModal } from '../../../components/shared/InvoiceViewerModal';
import { useAuth } from '../../../lib/auth-context';

export default function CustomerBillingPage() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodInfo[]>([]);
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customerApi.getPaymentMethods().catch(() => ({ paymentMethods: [] })),
      customerApi.getInvoices().catch(() => ({ invoices: [] })),
      customerApi.getSubscription().catch(() => ({ subscription: null })),
    ])
      .then(([pmRes, invRes, subRes]) => {
        setPaymentMethods(pmRes.paymentMethods || []);
        setInvoices(invRes.invoices || []);
        setSub(subRes.subscription || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={5} />;

  const defaultPm = paymentMethods.find((p) => p.isDefault) || paymentMethods[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Billing & Payments</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review payment methods, upcoming invoices, and transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method Summary Card */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-400" />
              <span>Payment Method</span>
            </h3>
            <Link href="/app/payment-methods">
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </Link>
          </div>

          {defaultPm ? (
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-[10px] text-zinc-200 uppercase">
                  {defaultPm.brand}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    •••• •••• •••• {defaultPm.last4}
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Expires {String(defaultPm.expMonth).padStart(2, '0')}/{defaultPm.expYear}
                  </p>
                </div>
              </div>
              <Badge variant="emerald" size="sm">Default</Badge>
            </div>
          ) : (
            <div className="text-center py-6 space-y-2">
              <p className="text-xs text-zinc-400">No payment method on file.</p>
              <Link href="/app/payment-methods">
                <Button size="sm" variant="primary">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </Button>
              </Link>
            </div>
          )}

          <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted PCI-compliant storage. We never store raw card numbers.</span>
          </div>
        </Card>

        {/* Upcoming Invoice / Renewal Card */}
        <Card variant="elevated" className="p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>Upcoming Invoice</span>
            </h3>
            <Badge variant="zinc">Next Cycle</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Plan Renewal</span>
              <span className="font-semibold text-white">
                {sub?.plan?.name || 'Trial (Free)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-400">Next Billing Date</span>
              <span className="font-semibold text-white">
                {sub?.currentPeriodEnd
                  ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                  : user?.trial?.expiresAt
                  ? new Date(user.trial.expiresAt).toLocaleDateString()
                  : user?.createdAt
                  ? new Date(new Date(user.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                  : '30-Day Evaluation'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-t border-white/10 pt-2 text-sm">
              <span className="font-semibold text-white">Total Amount</span>
              <span className="font-bold text-rose-400">
                {sub ? `₹${((sub?.plan?.priceAmount || 0) / 100).toFixed(0)} INR` : '₹0 INR'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices List */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
          <Link href="/app/invoices" className="text-xs text-rose-400 hover:underline">
            View All Invoices
          </Link>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {invoices.slice(0, 5).map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-rose-400 hover:underline">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold">₹{((inv.amount || 0) / 100).toFixed(0)}</td>
                    <td className="py-3 px-3">
                      <Badge variant={inv.status === 'PAID' ? 'emerald' : 'amber'} size="sm">
                        {inv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-zinc-400">
            No invoices issued yet. Invoices appear here once subscription payments process.
          </div>
        )}
      </Card>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceViewerModal
          invoice={selectedInvoice}
          isAdmin={false}
          onClose={() => setSelectedInvoice(null)}
          onDownload={(inv) => customerApi.downloadInvoicePdf(inv.id, inv.invoiceNumber)}
          onSend={(inv, email) => customerApi.sendInvoice(inv.id, email)}
        />
      )}
    </div>
  );
}
