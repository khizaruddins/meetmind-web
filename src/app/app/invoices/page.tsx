'use client';

import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { InvoiceInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Receipt, Download, FileText } from 'lucide-react';

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getInvoices()
      .then((res) => setInvoices(res.invoices || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = (id: string, number: string) => {
    // Direct link to backend invoice download endpoint
    window.open(`http://localhost:3001/v1/invoices/${id}/download`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Invoice History</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Download past transaction receipts and VAT/GST compliant tax invoices.
        </p>
      </div>

      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-2.5 px-3">Invoice Number</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Plan</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-medium text-white flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{inv.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">{inv.planName || 'Monthly Subscription'}</td>
                    <td className="py-3 px-3 font-semibold">${(inv.amount / 100).toFixed(2)} USD</td>
                    <td className="py-3 px-3">
                      <Badge variant={inv.status === 'PAID' ? 'emerald' : 'amber'} size="sm">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(inv.id, inv.invoiceNumber)}
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="When you subscribe to a paid tier or make a purchase, invoices will be available for download here."
          />
        )}
      </Card>
    </div>
  );
}
