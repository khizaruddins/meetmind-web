'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import {
  FileText,
  Printer,
  ArrowDownToLine,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Mail,
  ArrowLeft,
  Copy,
  Check,
  X,
} from 'lucide-react';

export default function StandaloneInvoicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawId = (params?.id as string) || '';
  const invoiceId = rawId.replace(/\.pdf$/i, '');

  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showSendInput, setShowSendInput] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

  useEffect(() => {
    if (!invoiceId) return;
    setLoading(true);

    fetch(`${apiBase}/public/invoices/${encodeURIComponent(invoiceId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || 'Invoice not found');
        }
        return res.json();
      })
      .then((data) => {
        setInvoice(data);
        if (data.user?.email) {
          setRecipientEmail(data.user.email);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch invoice:', err);
        setErrorMsg(err.message || 'Unable to load invoice record.');
      })
      .finally(() => setLoading(false));
  }, [invoiceId, apiBase]);

  const handleCopyNumber = () => {
    if (!invoice?.invoiceNumber) return;
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
    if (!invoice) return;
    setDownloading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await fetch(`${apiBase}/public/invoices/${encodeURIComponent(invoiceId)}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to download invoice PDF from server');
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `Invoice-${invoice.invoiceNumber || invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      setSuccessMsg(`Invoice ${invoice.invoiceNumber} downloaded successfully.`);
    } catch (err: any) {
      console.error('Download failed:', err);
      setErrorMsg(err.message || 'Failed to download PDF invoice.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!invoice) return;
    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const email = (recipientEmail || invoice.user?.email || '').trim();
      if (!email) {
        throw new Error('Please enter a recipient email address');
      }

      const response = await fetch(`${apiBase}/public/invoices/${encodeURIComponent(invoiceId)}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send invoice email');
      }

      setSuccessMsg(data?.message || `Invoice sent to ${email} successfully.`);
      setShowSendInput(false);
    } catch (err: any) {
      console.error('Send failed:', err);
      setErrorMsg(err.message || 'Failed to send invoice email.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080b] text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-4">
          <LoadingSkeleton rows={6} />
        </div>
      </div>
    );
  }

  if (errorMsg && !invoice) {
    return (
      <div className="min-h-screen bg-[#07080b] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#12131a] border border-rose-500/20 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-heading">Invoice Not Found</h1>
          <p className="text-xs text-zinc-400">
            We could not locate invoice <span className="font-mono text-zinc-200">{invoiceId}</span>. It may have been voided or removed.
          </p>
          <div className="pt-2">
            <Link
              href="/app/invoices"
              className="inline-flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Invoices</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawAmount = invoice.amountPaid ?? invoice.amount ?? invoice.amountDue ?? 0;
  const totalAmount = rawAmount / 100;
  const planName = invoice.planName || invoice.subscription?.plan?.name || 'Subscription';
  const customerName =
    invoice.user?.displayName ||
    [invoice.user?.firstName, invoice.user?.lastName].filter(Boolean).join(' ') ||
    'Valued Customer';

  return (
    <div className="min-h-screen bg-[#07080b] text-white p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Navigation & Action Controls (Hidden when printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 print:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-heading font-mono text-white">
                  {invoice.invoiceNumber}
                </h1>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title="Copy invoice number"
                >
                  {copiedNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <Badge variant={invoice.status === 'PAID' ? 'emerald' : 'amber'} size="sm">
                  {invoice.status}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official MeetMind Tax Invoice & Receipt
              </p>
            </div>
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
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowSendInput(!showSendInput)}
              className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              title="Email invoice to client"
            >
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>Send to Client</span>
            </Button>

            {/* Download PDF Button (Direct file download, no new tab) */}
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={handleDownload}
              isLoading={downloading}
              className="text-xs shadow-lg shadow-rose-500/20"
              title="Download official PDF invoice"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Inline Email Recipient Prompt */}
        {showSendInput && (
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 print:hidden animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Send Invoice Receipt to Client</span>
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
                placeholder="client@example.com"
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
                <span>Send Email</span>
              </Button>
            </div>
          </div>
        )}

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between print:hidden">
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
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Official Invoice Sheet */}
        <div className="bg-[#12131a] rounded-2xl border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-white/10 pb-6 print:border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-base">
                  M
                </div>
                <div>
                  <span className="text-xl font-black font-heading text-white print:text-black tracking-tight">
                    MeetMind
                  </span>
                  <span className="text-xs block text-zinc-400 print:text-slate-600 font-medium">
                    Technologies Inc.
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 print:text-slate-600 max-w-sm leading-relaxed pt-1">
                AI Meeting Intelligence & Recording Platform
                <br />
                204 Sai Ganesh Apartment, Sadi Compound, Nallasopara East, Palghar 401209
              </p>

              <div className="text-xs text-zinc-500 print:text-slate-500 pt-1">
                <span className="text-zinc-400 print:text-slate-600 font-medium">Email:</span> support@meetmind.io
              </div>
            </div>

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

          {/* Customer & Plan Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 print:text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Billed To (Customer)</span>
              </div>
              <p className="text-sm font-bold text-white print:text-black">
                {customerName}
              </p>
              <p className="text-zinc-300 print:text-slate-700 font-mono">
                {invoice.user?.email || 'N/A'}
              </p>
              <p className="text-zinc-500 print:text-slate-500 text-[11px]">
                Customer ID: <span className="font-mono">{invoice.user?.id || invoice.id || 'N/A'}</span>
              </p>
              <p className="text-zinc-400 print:text-slate-600 text-[11px]">
                Location: {invoice.user?.profile?.country || 'India'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 print:bg-slate-50 print:border-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-400 print:text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Subscription Details</span>
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

          {/* Table */}
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

          {/* Financial Summary */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pt-2 border-t border-white/10 print:border-slate-200 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 max-w-sm space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-300 print:text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Received in Full</span>
              </div>
              <p className="text-[11px] text-zinc-400 print:text-slate-600 leading-relaxed">
                Transaction processed successfully. Access to all active features and recording capacity is verified.
              </p>
            </div>

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

          {/* Legal Footer */}
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
