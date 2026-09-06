'use client';

import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { InvoiceInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { InvoiceViewerModal } from '../../../components/shared/InvoiceViewerModal';
import { useAuth } from '../../../lib/auth-context';
import {
  Receipt,
  Download,
  FileText,
  Eye,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  X,
} from 'lucide-react';

export default function CustomerInvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceInfo | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [copiedInvoiceNumber, setCopiedInvoiceNumber] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    customerApi
      .getInvoices()
      .then((res) => setInvoices(res.invoices || []))
      .catch((err) => {
        console.error('Failed to fetch invoices:', err);
        setErrorMessage('Unable to load invoice records. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPdf = async (id: string, invoiceNumber: string) => {
    setDownloadingId(id);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await customerApi.downloadInvoicePdf(id, invoiceNumber);
      setSuccessMessage(`Invoice ${invoiceNumber} downloaded successfully.`);
    } catch (err: any) {
      console.error('PDF download error:', err);
      setErrorMessage(err?.message || 'Failed to download invoice PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendInvoice = async (inv: InvoiceInfo, recipientEmail?: string) => {
    setSendingId(inv.id);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const email = recipientEmail || user?.email;
      const res = await customerApi.sendInvoice(inv.id, email);
      const msg = res?.message || `Invoice ${inv.invoiceNumber} sent to ${email || 'your email'}.`;
      setSuccessMessage(msg);
      return { success: true, message: msg };
    } catch (err: any) {
      console.error('Send invoice error:', err);
      const msg = err?.message || 'Failed to send invoice email.';
      setErrorMessage(msg);
      throw new Error(msg);
    } finally {
      setSendingId(null);
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedInvoiceNumber(num);
    setTimeout(() => setCopiedInvoiceNumber(null), 2000);
  };

  const getAmountCents = (inv: InvoiceInfo): number => {
    return inv.amountPaid || inv.amount || inv.amountDue || 0;
  };

  const getPlanDisplayName = (inv: InvoiceInfo): string => {
    if (inv.planName) return inv.planName;
    if (inv.subscription?.plan?.name) return inv.subscription.plan.name;
    if (inv.invoiceNumber.includes('GOLD')) return 'Gold Plan';
    if (inv.invoiceNumber.includes('SILVER')) return 'Silver Plan';
    return 'Monthly Subscription';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Invoice History</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Official GST/VAT-compliant receipts, subscription records, and downloadable PDF tax invoices.
          </p>
        </div>

        {invoices.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MeetMind Technologies Verified Invoices</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Invoices Table Card */}
      <Card variant="elevated" className="p-6 border-white/10 space-y-4">
        {loading ? (
          <LoadingSkeleton rows={5} />
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-400">
                  <th className="py-3 px-3">Invoice Number</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Plan / Subscription</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {invoices.map((inv) => {
                  const amountCents = getAmountCents(inv);
                  const amountFormatted = (amountCents / 100).toLocaleString('en-IN', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  });
                  const planName = getPlanDisplayName(inv);
                  const isDownloading = downloadingId === inv.id;

                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Invoice Number */}
                      <td className="py-3.5 px-3 font-mono font-medium text-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{inv.invoiceNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyNumber(inv.invoiceNumber)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity"
                            title="Copy invoice number"
                          >
                            {copiedInvoiceNumber === inv.invoiceNumber ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-3 text-zinc-400">
                        {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-zinc-200">{planName}</span>
                          <span className="text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                            Monthly
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 font-semibold text-white">
                        ₹{amountFormatted} <span className="text-[10px] font-normal text-zinc-400">{inv.currency || 'INR'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <Badge
                          variant={inv.status === 'PAID' ? 'emerald' : inv.status === 'OPEN' ? 'amber' : 'rose'}
                          size="sm"
                        >
                          {inv.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Invoice Modal */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                            title="Preview invoice receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>

                          {/* Direct PDF Download */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(inv.id, inv.invoiceNumber)}
                            isLoading={isDownloading}
                            className="text-xs text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                            title="Download official PDF receipt"
                          >
                            <Download className="w-3 h-3 text-rose-400" />
                            <span>PDF</span>
                          </Button>

                          {/* Send to Email Option */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendInvoice(inv)}
                            isLoading={sendingId === inv.id}
                            className="text-xs text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10"
                            title="Send invoice to your email"
                          >
                            <Send className="w-3 h-3 text-indigo-400" />
                            <span>Email</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="When you subscribe to a paid tier or complete a payment, your official GST-compliant tax invoices will appear here."
          />
        )}
      </Card>

      {/* MeetMind Tax Invoice Preview Modal */}
      {selectedInvoice && (
        <InvoiceViewerModal
          invoice={selectedInvoice}
          isAdmin={false}
          onClose={() => setSelectedInvoice(null)}
          onDownload={(inv) => handleDownloadPdf(inv.id, inv.invoiceNumber)}
          onSend={(inv, email) => handleSendInvoice(inv, email)}
        />
      )}
    </div>
  );
}
