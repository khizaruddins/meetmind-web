'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { Layers, RefreshCw } from 'lucide-react';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadInvoices = () => {
    setLoading(true);
    adminApi
      .getInvoices()
      .then((res) => setInvoices(res.invoices || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleRetryPayment = async (id: string) => {
    setActionLoading(true);
    setMsg(null);
    try {
      await adminApi.retryInvoicePayment(id);
      setMsg(`Payment retry dispatched for invoice ${id.slice(0, 8)}.`);
      loadInvoices();
    } catch (err: any) {
      setMsg(err.message || 'Retry payment failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Invoice Administration</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global tax invoices, billing states, and automated payment retries.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
          {msg}
        </div>
      )}

      <Card variant="elevated" className="p-6 border-white/10 space-y-4 bg-[#10121a]">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Issued Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-medium text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3">{inv.user?.email || inv.userId}</td>
                    <td className="py-3 px-3 font-semibold">${((inv.amount || 0) / 100).toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <Badge variant={inv.status === 'PAID' ? 'emerald' : 'amber'} size="sm">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.status !== 'PAID' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryPayment(inv.id)}
                          isLoading={actionLoading}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Payment</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">No customer invoices found.</div>
        )}
      </Card>
    </div>
  );
}
