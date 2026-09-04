'use client';

import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../lib/api/customer';
import { PaymentMethodInfo } from '../../../lib/types';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../../components/shared/EmptyState';
import { CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function CustomerPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethodInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cardBrand, setCardBrand] = useState('Visa');
  const [last4, setLast4] = useState('');
  const [expMonth, setExpMonth] = useState(12);
  const [expYear, setExpYear] = useState(2028);
  const [actionLoading, setActionLoading] = useState(false);

  const loadMethods = () => {
    setLoading(true);
    customerApi
      .getPaymentMethods()
      .then((res) => setMethods(res.paymentMethods || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMethods();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await customerApi.addPaymentMethod({
        brand: cardBrand,
        last4: last4.slice(-4) || '4242',
        expMonth,
        expYear,
        isDefault: methods.length === 0,
      });
      setModalOpen(false);
      loadMethods();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await customerApi.setDefaultPaymentMethod(id);
      loadMethods();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this payment method?')) return;
    try {
      await customerApi.deletePaymentMethod(id);
      loadMethods();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Payment Methods</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Safe credit card metadata used for recurring subscriptions.
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Payment Method</span>
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : methods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map((pm) => (
              <Card key={pm.id} variant="elevated" className="p-5 border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-[10px] text-zinc-200 uppercase">
                      {pm.brand}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">•••• •••• •••• {pm.last4}</p>
                      <p className="text-[11px] text-zinc-400">
                        Expires {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}
                      </p>
                    </div>
                  </div>
                  {pm.isDefault ? (
                    <Badge variant="emerald" size="sm">Default</Badge>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Set Default
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-zinc-500 text-[11px]">PCI Compliant Tokenized</span>
                  {!pm.isDefault && (
                    <button
                      onClick={() => handleDelete(pm.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No payment methods saved"
            description="Add a payment method to easily upgrade to Silver or Gold tiers."
            actionText="Add Payment Method"
            onAction={() => setModalOpen(true)}
          />
        )}
      </div>

      {/* Add Payment Method Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md glass-panel-elevated p-6 rounded-2xl border-white/10 space-y-5 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white font-heading">Add Safe Card Token</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tokenized setup via PCI payment provider. We never store raw CVV or PAN.
              </p>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300">Card Brand</label>
                <select
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300">Card Last 4 Digits</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={last4}
                  onChange={(e) => setLast4(e.target.value)}
                  placeholder="4242"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300">Exp Month</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={expMonth}
                    onChange={(e) => setExpMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-300">Exp Year</label>
                  <input
                    type="number"
                    min={2026}
                    max={2035}
                    value={expYear}
                    onChange={(e) => setExpYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <Button type="submit" size="md" isLoading={actionLoading} className="w-full">
                <span>Save Payment Method</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
