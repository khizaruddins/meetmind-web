'use client';

import React, { useState } from 'react';
import { InvoiceInfo } from '../../lib/types';
import { Badge } from './Badge';
import { Button } from './Button';
import {
  FileText,
  Printer,
  ArrowDownToLine,
  Send,
  X,
  Check,
  Copy,
  CheckCircle2,
  Building2,
  Sparkles,
  Mail,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface InvoiceViewerModalProps {
  invoice: InvoiceInfo | null;
  onClose: () => void;
  onDownload?: (invoice: InvoiceInfo) => Promise<void> | void;
  onSend?: (invoice: InvoiceInfo, recipientEmail?: string) => Promise<{ success: boolean; message: string }> | void;
  isAdmin?: boolean;
}

export function InvoiceViewerModal({
  invoice,
  onClose,
  onDownload,
  onSend,
  isAdmin = false,
}: InvoiceViewerModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showSendInput, setShowSendInput] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!invoice) return null;

  const defaultEmail = invoice.user?.email || '';

  const getAmountCents = (inv: InvoiceInfo): number => {
    return inv.amountPaid || inv.amount || inv.amountDue || 0;
  };

  const getPlanDisplayName = (inv: InvoiceInfo): string => {
    if (inv.planName) return inv.planName;
    if (inv.subscription?.plan?.name) return inv.subscription.plan.name;
    if (inv.invoiceNumber?.includes('GOLD')) return 'Gold Plan';
    if (inv.invoiceNumber?.includes('SILVER')) return 'Silver Plan';
    return 'Monthly Subscription';
  };

  const handleCopyInvoiceNumber = () => {
    if (!invoice.invoiceNumber) return;
    navigator.clipboard.writeText(invoice.invoiceNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = async () => {
    if (!onDownload) return;
    setDownloading(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await onDownload(invoice);
    } catch (err: any) {
      console.error('Invoice download failed:', err);
      setActionError(err.message || 'Failed to download invoice PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!onSend) return;
    setSending(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const emailToSend = (recipientEmail.trim() || defaultEmail).trim();
      const res = await onSend(invoice, emailToSend);
      setActionSuccess(res?.message || `Invoice sent to ${emailToSend || 'client'} successfully.`);
      setShowSendInput(false);
    } catch (err: any) {
      console.error('Send invoice failed:', err);
      setActionError(err.message || 'Failed to send invoice email');
    } finally {
      setSending(false);
    }
  };

  const totalCents = getAmountCents(invoice);
  const totalAmount = totalCents / 100;
  const planName = getPlanDisplayName(invoice);

  const customerName =
    invoice.user?.displayName ||
    [invoice.user?.firstName, invoice.user?.lastName].filter(Boolean).join(' ') ||
    'Valued Customer';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed-none"
    >
      <div className="bg-[#12131a] border border-white/10 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 my-auto print:border-none print:shadow-none print:p-0 print:text-black">
        {/* Modal Controls Bar (Hidden during Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <FileText className="w-4 h-4 text-rose-400" />
            <span className="font-mono font-medium text-white">{invoice.invoiceNumber}</span>
            <button
              type="button"
              onClick={handleCopyInvoiceNumber}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded"
              title="Copy invoice number"
            >
              {copiedNumber ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <Badge variant={invoice.status === 'PAID' ? 'emerald' : invoice.status === 'OPEN' ? 'amber' : 'rose'} size="sm">
              {invoice.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Print Button */}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs"
              title="Print official receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </Button>

            {/* Send to Client Option */}
            {onSend && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!showSendInput) {
                    setRecipientEmail(defaultEmail);
                    setShowSendInput(true);
                  } else {
                    handleSendInvoice();
                  }
                }}
                isLoading={sending}
                className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                title="Send invoice via email to customer"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isAdmin ? 'Send to Client' : 'Email to Me'}</span>
              </Button>
            )}

            {/* Download PDF Option */}
            {onDownload && (
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleDownload}
                isLoading={downloading}
                className="text-xs shadow-lg shadow-rose-500/20"
                title="Directly download PDF invoice"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </Button>
            )}

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors ml-1"
              aria-label="Close invoice preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Email Recipient Prompt (When clicked 'Send to Client') */}
        {showSendInput && onSend && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 print:hidden animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Confirm Client Email' : 'Recipient Email Address'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSendInput(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="customer@example.com"
                className="flex-1 px-3 py-1.5 bg-[#0b0c10] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleSendInvoice}
                isLoading={sending}
                className="text-xs bg-indigo-600 hover:bg-indigo-500"
              >
                <Send className="w-3 h-3" />
                <span>Send Now</span>
              </Button>
            </div>
          </div>
        )}

        {/* Feedback Alerts */}
        {actionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Print-Ready Invoice Sheet Container */}
        <div
          id="printable-invoice"
          className="bg-[#0b0c10] text-zinc-200 rounded-xl p-6 sm:p-8 border border-white/5 space-y-6 print:bg-white print:text-black print:p-0 print:border-none"
        >
          {/* 1. Header: Corporate Branding + Tax Invoice Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/10 pb-6 print:border-slate-200">
            {/* Left: Company Details */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
                <div>
                  <span className="text-xl font-bold font-heading text-white print:text-black tracking-tight">
                    MeetMind
                  </span>
                  <span className="text-[11px] block text-zinc-400 print:text-slate-600 font-medium">
                    Technologies Inc.
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 print:text-slate-600 max-w-xs leading-relaxed pt-1">
                AI Meeting Intelligence & Recording Platform
                <br />
                204 Sai Ganesh Apartment, Sadi Compound, Nallasopara East, Palghar 401209
              </p>

              <div className="text-[11px] text-zinc-500 print:text-slate-500 space-y-0.5 pt-1">
                <div>
                  <span className="text-zinc-400 print:text-slate-600 font-medium">Email:</span> support@meetmind.io
                </div>
              </div>
            </div>

            {/* Right: Invoice Meta */}
            <div className="sm:text-right space-y-1">
              <h2 className="text-2xl font-black font-heading text-white print:text-black tracking-tight">
                TAX INVOICE / RECEIPT
              </h2>
              <p className="text-xs font-mono font-medium text-rose-400 print:text-rose-700">
                {invoice.invoiceNumber}
              </p>

              <div className="pt-2 text-xs text-zinc-400 print:text-slate-600 space-y-1">
                <div>
                  <span className="text-zinc-500 print:text-slate-500">Issue Date: </span>
                  <span className="text-zinc-200 print:text-black font-medium">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }) : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 print:text-slate-500">Billing Period: </span>
                  <span className="text-zinc-200 print:text-black font-medium">
                    {invoice.periodStart ? new Date(invoice.periodStart).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }) : 'N/A'}{' '}
                    –{' '}
                    {invoice.periodEnd ? new Date(invoice.periodEnd).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:border-emerald-600 print:text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PAYMENT {invoice.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Billed To & Payment Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Billed To Box */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 print:text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Billed To (Customer)</span>
              </div>
              <p className="text-sm font-bold text-white print:text-black">
                {customerName}
              </p>
              <p className="text-zinc-300 print:text-slate-700 font-mono">
                {invoice.user?.email || defaultEmail || 'N/A'}
              </p>
              <p className="text-zinc-500 print:text-slate-500 text-[11px]">
                Customer ID: <span className="font-mono">{invoice.user?.id || invoice.id || 'N/A'}</span>
              </p>
              <p className="text-zinc-400 print:text-slate-600 text-[11px]">
                Location: {invoice.user?.profile?.country || 'India'}
              </p>
            </div>

            {/* Subscription & Plan Details */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 print:text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Subscription Plan Details</span>
              </div>
              <p className="text-sm font-bold text-white print:text-black">
                {planName}
              </p>
              <div className="text-zinc-300 print:text-slate-700 space-y-0.5">
                <div>Billing Cycle: Monthly Recurring</div>
                <div>Payment Gateway: Razorpay Verified</div>
              </div>
              <p className="text-zinc-500 print:text-slate-500 text-[11px]">
                Currency: {(invoice.currency || 'INR').toUpperCase()}
              </p>
            </div>
          </div>

          {/* 3. Itemized Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 print:bg-slate-100 text-zinc-400 print:text-slate-700 border-y border-white/10 print:border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Cycle</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Price / Rate</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-slate-200 text-zinc-200 print:text-slate-900">
                <tr className="hover:bg-white/[0.01]">
                  <td className="py-3.5 px-3 font-mono text-zinc-400 print:text-slate-500">1</td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-white print:text-black">
                      MeetMind {planName} Subscription
                    </div>
                    <div className="text-[11px] text-zinc-400 print:text-slate-600 leading-snug mt-0.5">
                      Daily meeting recording, automated transcription, speech intelligence, action item extraction, and cloud storage entitlements.
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center text-zinc-300 print:text-slate-700">Monthly</td>
                  <td className="py-3.5 px-3 text-center font-mono">1</td>
                  <td className="py-3.5 px-3 text-right font-mono">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-white print:text-black">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Financial Summary */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 border-t border-white/10 print:border-slate-200 text-xs">
            {/* Payment Confirmation Box */}
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 max-w-sm space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300 print:text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Received in Full</span>
              </div>
              <p className="text-[11px] text-zinc-400 print:text-slate-600 leading-relaxed">
                Transaction processed successfully. Access to all active features and recording capacity is verified.
              </p>
            </div>

            {/* Summary Numbers */}
            <div className="w-full sm:w-72 space-y-2 text-right">
              <div className="flex justify-between text-zinc-400 print:text-slate-600">
                <span>Subscription Subtotal:</span>
                <span className="font-mono text-zinc-200 print:text-slate-900">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 print:border-slate-200 flex justify-between text-sm font-bold text-white print:text-black">
                <span>Total Paid:</span>
                <span className="font-mono text-emerald-400 print:text-emerald-700">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}{' '}
                  <span className="text-xs font-normal">{(invoice.currency || 'INR').toUpperCase()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* 5. Legal Footer / Disclaimer */}
          <div className="pt-4 border-t border-white/5 print:border-slate-200 text-center text-[10px] text-zinc-500 print:text-slate-500 space-y-1">
            <p>
              This is an electronically generated invoice / payment receipt and requires no physical signature.
            </p>
            <p>
              MeetMind Technologies Inc. • 204 Sai Ganesh Apartment, Sadi Compound, Nallasopara East, Palghar 401209 • support@meetmind.io
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
