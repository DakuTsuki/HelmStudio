import React, { useState } from 'react';
import { Crown, Sparkles, Check, X, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: 'premium' | 'pro';
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'premium'
}) => {
  const { switchUserRole, updateProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro'>(defaultPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      switchUserRole(selectedPlan);
      updateProfile({
        badges: selectedPlan === 'pro'
          ? ['Pro Host', 'Debate Grandmaster', 'Verified Host']
          : ['Premium Patron', 'Gold Debater']
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSuccessMessage(`Welcome to Helm Studio ${selectedPlan.toUpperCase()}! Your account has been upgraded.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-violet-500/30 overflow-hidden shadow-2xl p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold mb-3 border border-violet-500/30">
            <Zap className="w-3.5 h-3.5" />
            <span>HELM STUDIO MEMBERSHIP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Elevate Your Otaku Arena</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Support independent anime discussions, unlock zero-ad viewing, and host your own community tournaments.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Premium Plan */}
          <div
            onClick={() => setSelectedPlan('premium')}
            className={`p-5 rounded-2xl cursor-pointer border transition-all ${
              selectedPlan === 'premium'
                ? 'bg-violet-950/40 border-violet-400 shadow-lg shadow-violet-500/10 scale-[1.02]'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Premium
              </span>
              <span className="text-xl font-extrabold text-white">$4.99<span className="text-xs text-slate-400 font-normal">/mo</span></span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <strong>100% Ad-Free</strong> on all devices
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Glowing Gold Profile Badge
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                3x Giveaway Entry multiplier
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Priority 1-10 review weighting
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-2xl cursor-pointer border transition-all relative ${
              selectedPlan === 'pro'
                ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/20 scale-[1.02]'
                : 'bg-slate-900/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
              Most Popular
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-purple-300" />
                Pro Host
              </span>
              <span className="text-xl font-extrabold text-white">$12.99<span className="text-xs text-slate-400 font-normal">/mo</span></span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <strong>Host Community Debates & Tournaments</strong>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Custom 16-character Bracket creator
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Everything in Premium (Ad-free)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                VIP Discord Role & Badge
              </li>
            </ul>
          </div>
        </div>

        {/* Stripe Simulation Box */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <CreditCard className="w-4 h-4 text-violet-400" />
              Stripe Secure Sandbox
            </span>
            <span>Test Mode: `pk_test_helm_live`</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5 font-mono text-xs text-slate-300 flex items-center justify-between">
            <span>•••• •••• •••• 4242 (Demo Otaku Card)</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
            </span>
          </div>
        </div>

        {/* Action Button */}
        {successMessage ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-sm font-semibold animate-in zoom-in-95">
            {successMessage}
          </div>
        ) : (
          <button
            onClick={handleSimulateCheckout}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-violet-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Activate {selectedPlan.toUpperCase()} Membership ($ {selectedPlan === 'pro' ? '12.99' : '4.99'}/mo)</span>
              </>
            )}
          </button>
        )}

        <p className="text-center text-[11px] text-slate-400 mt-3">
          Cancel anytime from your profile settings. No lock-in contracts.
        </p>
      </div>
    </div>
  );
};
