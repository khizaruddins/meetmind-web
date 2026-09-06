'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Receipt, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getPayments()
      .then((res) => setPayments(res.payments || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Payment Transaction Ledger</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review processed customer payments, charge statuses, and failed payment reasons ({payments.length} transactions).
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Gateway / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono text-[11px] text-white">{p.id.slice(0, 14)}...</td>
                    <td className="py-3 px-3">{p.user?.email || p.userId}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400 font-mono">
                      ₹{((p.amount || 0) / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={p.status === 'SUCCEEDED' ? 'emerald' : p.status === 'PENDING' ? 'amber' : 'rose'} size="sm">
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                      {p.stripePaymentIntentId || p.razorpayPaymentId || p.failureReason || 'Razorpay / Direct Settlement'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">No payment transactions recorded yet.</div>
        )}
      </Card>
    </div>
  );
}
