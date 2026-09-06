'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { InvoiceViewerModal } from '../../../components/shared/InvoiceViewerModal';
import {
  Eye,
  ArrowDownToLine,
  Send,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

function AdminInvoicesContent() {
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInvoices();
      const list = res.invoices || [];
      setInvoices(list);

      // Check if URL specifies an invoice to view immediately
      const targetQuery = searchParams.get('invoice') || searchParams.get('id') || searchParams.get('selected');
      if (targetQuery) {
        const found = list.find(
          (inv) =>
            inv.id === targetQuery ||
            inv.invoiceNumber?.toLowerCase() === targetQuery.toLowerCase() ||
            targetQuery.includes(inv.invoiceNumber)
        );
        if (found) {
          setSelectedInvoice(found);
        }
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [searchParams]);

  const handleDownload = async (inv: any) => {
    setDownloadingId(inv.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await adminApi.downloadInvoicePdf(inv.id, inv.invoiceNumber);
      setSuccessMsg(`Invoice ${inv.invoiceNumber} downloaded successfully.`);
    } catch (err: any) {
      console.error('Download failed:', err);
      setErrorMsg(err.message || 'Failed to download invoice PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendToClient = async (inv: any, recipientEmail?: string) => {
    setSendingId(inv.id);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const targetEmail = recipientEmail || inv.user?.email;
      const res = await adminApi.sendInvoice(inv.id, targetEmail);
      const msg = res?.message || `Invoice ${inv.invoiceNumber} sent to ${targetEmail || 'client'}.`;
      setSuccessMsg(msg);
      return { success: true, message: msg };
    } catch (err: any) {
      console.error('Send invoice failed:', err);
      const msg = err.message || 'Failed to send invoice to client';
      setErrorMsg(msg);
      throw new Error(msg);
    } finally {
      setSendingId(null);
    }
  };

  const handleRetryPayment = async (id: string) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await adminApi.retryInvoicePayment(id);
      setSuccessMsg(`Payment retry dispatched for invoice ${id.slice(0, 8)}.`);
      loadInvoices();
    } catch (err: any) {
      setErrorMsg(err.message || 'Retry payment failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Invoice Administration</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global tax invoices, billing states, PDF download, and client dispatch ({invoices.length} invoices).
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
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
                {invoices.map((inv) => {
                  const rawAmount = inv.amountPaid ?? inv.amountDue ?? inv.amount ?? 0;
                  const isDownloading = downloadingId === inv.id;
                  const isSending = sendingId === inv.id;

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(inv)}
                          className="font-mono font-medium text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5"
                          title="Click to view tax invoice receipt"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{inv.invoiceNumber}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-300">
                        {inv.user?.email || inv.userId}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-400 font-mono">
                        ₹{((rawAmount || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={inv.status === 'PAID' ? 'emerald' : inv.status === 'OPEN' ? 'amber' : 'rose'}
                          size="sm"
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {/* 1. Show Invoice Button (Opens in-app modal, never in new tab) */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-[11px] px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-white/10"
                          title="Show invoice receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Button>

                        {/* 2. Download Option (Directly triggers file download, no new tab) */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(inv)}
                          isLoading={isDownloading}
                          className="text-[11px] px-2.5 py-1 text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                          title="Download invoice PDF"
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5 text-rose-400" />
                          <span>Download</span>
                        </Button>

                        {/* 3. Send to Client Option */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendToClient(inv)}
                          isLoading={isSending}
                          className="text-[11px] px-2.5 py-1 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10"
                          title={`Send invoice email to ${inv.user?.email || 'client'}`}
                        >
                          <Send className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Send to Client</span>
                        </Button>

                        {/* Retry Payment if not paid */}
                        {inv.status !== 'PAID' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryPayment(inv.id)}
                            isLoading={actionLoading}
                            className="text-[11px] px-2.5 py-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs">No customer invoices found.</div>
        )}
      </Card>

      {/* MeetMind Tax Invoice Modal */}
      {selectedInvoice && (
        <InvoiceViewerModal
          invoice={selectedInvoice}
          isAdmin={true}
          onClose={() => setSelectedInvoice(null)}
          onDownload={(inv) => handleDownload(inv)}
          onSend={(inv, email) => handleSendToClient(inv, email)}
        />
      )}
    </div>
  );
}

export default function AdminInvoicesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={5} />}>
      <AdminInvoicesContent />
    </Suspense>
  );
}
