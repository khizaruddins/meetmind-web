'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../lib/api/admin';
import { Card } from '../../../components/shared/Card';
import { Badge } from '../../../components/shared/Badge';
import { Button } from '../../../components/shared/Button';
import { LoadingSkeleton } from '../../../components/shared/LoadingSkeleton';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

interface PlanData {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  billingInterval: string;
  priceAmount: number;
  currency?: string;
  trialDays?: number;
  dailyRecordingLimitSeconds?: number | null;
  active: boolean;
  sortOrder?: number;
  subscriberCount?: number;
  _count?: { subscriptions: number };
  features?: any[];
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    billingInterval: 'MONTHLY',
    priceAmount: 189900,
    currency: 'INR',
    trialDays: 0,
    dailyRecordingLimitSeconds: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPlans();
      setPlans(res.plans || (Array.isArray(res) ? res : []));
    } catch (err: any) {
      setActionError(err.message || 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      billingInterval: 'MONTHLY',
      priceAmount: 189900,
      currency: 'INR',
      trialDays: 0,
      dailyRecordingLimitSeconds: 0,
      active: true,
    });
    setActionError(null);
    setActionSuccess(null);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: PlanData) => {
    setEditingPlan(plan);
    setFormData({
      code: plan.code,
      name: plan.name,
      description: plan.description || '',
      billingInterval: plan.billingInterval || 'MONTHLY',
      priceAmount: plan.priceAmount || 0,
      currency: plan.currency || 'INR',
      trialDays: plan.trialDays || 0,
      dailyRecordingLimitSeconds: plan.dailyRecordingLimitSeconds || 0,
      active: plan.active,
    });
    setActionError(null);
    setActionSuccess(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      if (editingPlan) {
        await adminApi.updatePlan(editingPlan.id, {
          name: formData.name,
          description: formData.description,
          billingInterval: formData.billingInterval,
          priceAmount: Number(formData.priceAmount),
          currency: formData.currency,
          trialDays: Number(formData.trialDays),
          dailyRecordingLimitSeconds: Number(formData.dailyRecordingLimitSeconds),
          active: formData.active,
        });
        setActionSuccess(`Plan ${editingPlan.code} updated successfully.`);
      } else {
        await adminApi.createPlan({
          code: formData.code.toUpperCase().trim(),
          name: formData.name,
          description: formData.description,
          billingInterval: formData.billingInterval,
          priceAmount: Number(formData.priceAmount),
          currency: formData.currency,
          trialDays: Number(formData.trialDays),
          dailyRecordingLimitSeconds: Number(formData.dailyRecordingLimitSeconds),
          active: formData.active,
        });
        setActionSuccess(`Plan ${formData.code.toUpperCase()} created successfully.`);
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (err: any) {
      setActionError(err.message || 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan: PlanData) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      if (plan.active) {
        await adminApi.deactivatePlan(plan.id);
        setActionSuccess(`Plan ${plan.code} deactivated.`);
      } else {
        await adminApi.activatePlan(plan.id);
        setActionSuccess(`Plan ${plan.code} activated.`);
      }
      loadPlans();
    } catch (err: any) {
      setActionError(err.message || 'Failed to toggle plan status.');
    }
  };

  const handleDeletePlan = async (plan: PlanData) => {
    if (!confirm(`Are you sure you want to permanently delete plan "${plan.name}" (${plan.code})?`)) return;
    setActionError(null);
    setActionSuccess(null);
    try {
      await adminApi.deletePlan(plan.id);
      setActionSuccess(`Plan ${plan.code} deleted successfully.`);
      loadPlans();
    } catch (err: any) {
      setActionError(
        err.message ||
          `Cannot delete plan ${plan.code} because active subscribers use it. Please deactivate it instead.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Plan Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure commercial tiers, limits, pricing, and active subscription packaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={loadPlans}
            disabled={loading}
            className="text-xs text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button size="sm" onClick={openCreateModal} className="text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {actionError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-zinc-400 hover:text-white">×</button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-zinc-400 hover:text-white">×</button>
        </div>
      )}

      {/* Plans List */}
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : plans.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center space-y-3 border-white/10">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Subscription Plans Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Create your first plan to start enrolling subscribers into commercial tiers.
          </p>
          <Button size="sm" onClick={openCreateModal}>
            Create First Plan
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const subscribers = plan._count?.subscriptions ?? plan.subscriberCount ?? 0;
            return (
              <Card
                key={plan.id}
                variant="elevated"
                className={`p-5 border flex flex-col justify-between space-y-4 transition-all ${
                  plan.active
                    ? 'border-white/10 bg-[#10121a] hover:border-white/20'
                    : 'border-white/5 bg-zinc-950/60 opacity-75'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white font-heading">{plan.name}</span>
                        <Badge
                          variant={plan.code === 'GOLD' ? 'amber' : plan.code === 'SILVER' ? 'rose' : 'zinc'}
                          size="sm"
                        >
                          {plan.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {plan.description || 'Standard plan tier for meeting recording.'}
                      </p>
                    </div>
                    <Badge variant={plan.active ? 'emerald' : 'zinc'} size="sm">
                      {plan.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white font-mono">
                      ₹{((plan.priceAmount || 0) / 100).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-zinc-400">/{plan.billingInterval.toLowerCase()}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                    <div className="flex items-center justify-between">
                      <span>Daily Limit:</span>
                      <span className="text-zinc-200 font-mono">
                        {(plan.dailyRecordingLimitSeconds ?? 0) > 0
                          ? `${Math.floor((plan.dailyRecordingLimitSeconds || 0) / 60)} mins/day`
                          : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Trial Days:</span>
                      <span className="text-zinc-200 font-mono">{plan.trialDays ?? 0} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Subscribers:</span>
                      <span className="text-amber-300 font-semibold font-mono">{subscribers}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(plan)}
                      className="text-xs h-8 px-2.5 border-white/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(plan)}
                      className={`text-xs h-8 px-2.5 ${plan.active ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                    >
                      {plan.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeletePlan(plan)}
                    className="text-xs h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    title={subscribers > 0 ? 'Cannot delete plan with active subscribers' : 'Delete plan'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div>
              <h3 className="text-base font-bold text-white">
                {editingPlan ? `Edit Plan: ${editingPlan.code}` : 'Create New Plan'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Define pricing, recording quotas, and commercial terms.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {!editingPlan && (
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Plan Code (UPPERCASE)</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTERPRISE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white uppercase font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enterprise Plan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short marketing description"
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Price (Paise)</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    required
                    value={formData.priceAmount}
                    onChange={(e) => setFormData({ ...formData, priceAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white font-mono"
                  />
                  <span className="text-[10px] text-zinc-500">
                    ₹{((formData.priceAmount || 0) / 100).toLocaleString('en-IN')} {formData.currency}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Interval</label>
                  <select
                    value={formData.billingInterval}
                    onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="YEARLY">YEARLY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Daily Limit (Seconds)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.dailyRecordingLimitSeconds}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyRecordingLimitSeconds: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white font-mono"
                  />
                  <span className="text-[10px] text-zinc-500">0 = Unlimited</span>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Trial Duration (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.trialDays}
                    onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="planActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-800 text-rose-500"
                />
                <label htmlFor="planActive" className="text-xs text-zinc-300 cursor-pointer">
                  Plan is active and available for customer subscriptions
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={saving}>
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
