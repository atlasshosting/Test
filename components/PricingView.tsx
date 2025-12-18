
import React, { useState } from 'react';
import { SubscriptionTier } from '../types';

interface PricingViewProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ currentTier, onUpgrade }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans: { id: SubscriptionTier; price: number; description: string; features: string[]; popular?: boolean; roi: string }[] = [
    {
      id: 'Free',
      price: 0,
      description: 'Proof of logic. Daily strategic check-in.',
      roi: 'Zero risk entry.',
      features: ['3 Tactical Commits / Day', 'Validation Score', 'Basic Risk Alerts']
    },
    {
      id: 'Founder',
      price: 29,
      popular: true,
      description: 'The Execution OS. Designed for solo-founders.',
      roi: 'Saves 10+ hours of planning/wk.',
      features: ['Unlimited Tactical Commits', 'Persistent Audit Trail', 'Historical Performance Audit', 'Execution Streak Tracking']
    },
    {
      id: 'Operator',
      price: 89,
      description: 'Strategic leverage for revenue-generating startups.',
      roi: 'Identify $1k+ in hidden costs.',
      features: ['Financial Scenario Modeler', 'Burn Rate Monitoring', 'Early Churn Detection', 'Competitor Intel Extraction']
    },
    {
      id: 'Vanguard',
      price: 299,
      description: 'The ultimate founding partner for scaling teams.',
      roi: 'Full operational replacement.',
      features: ['Deep Reasoning Mode (Gemini 3 Pro)', 'Custom Strategic Windows', 'Team Logic Integration', 'Dedicated Resource Instance']
    }
  ];

  const calculatePrice = (price: number) => {
    if (price === 0) return '$0';
    const final = isAnnual ? Math.floor(price * 0.8) : price;
    return `$${final}`;
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-700 h-full overflow-y-auto custom-scrollbar">
      <header className="text-center mb-12 md:mb-16">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mono mb-4">Capital Allocation</h2>
        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">Optimize your execution spend.</h3>
        
        {/* Annual Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-[10px] font-bold mono uppercase tracking-widest ${!isAnnual ? 'text-white' : 'text-zinc-600'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 bg-zinc-900 border border-zinc-800 rounded-full relative transition-all"
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAnnual ? 'right-1' : 'left-1'}`} />
          </button>
          <span className={`text-[10px] font-bold mono uppercase tracking-widest ${isAnnual ? 'text-white' : 'text-zinc-600'}`}>
            Annual <span className="text-green-500 ml-1">(-20%)</span>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`p-6 md:p-8 border flex flex-col relative transition-all duration-300 ${
              plan.popular ? 'border-blue-600 bg-blue-950/5' : 'border-zinc-900 bg-zinc-950/50'
            } rounded-sm hover:border-zinc-600 group`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mono shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                Founder's Choice
              </div>
            )}
            
            <div className="mb-8">
              <h4 className="text-lg font-bold text-white mb-1 mono tracking-tighter uppercase">{plan.id}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white mono tracking-tighter">{calculatePrice(plan.price)}</span>
                <span className="text-zinc-600 text-[10px] font-bold uppercase mono">/mo</span>
              </div>
              <div className="mt-3 py-1 px-2 border border-zinc-800 inline-block bg-black">
                 <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mono">ROI: {plan.roi}</span>
              </div>
              <p className="mt-6 text-zinc-500 text-[11px] leading-relaxed min-h-[44px]">
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-[10px] text-zinc-400 font-medium tracking-tight">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${plan.popular ? 'bg-blue-600' : 'bg-zinc-800'}`} />
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => onUpgrade(plan.id)}
              disabled={currentTier === plan.id}
              className={`w-full py-4 rounded-sm font-bold uppercase text-[10px] tracking-widest transition-all active:scale-[0.98] ${
                currentTier === plan.id 
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                  : 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-xl'
              }`}
            >
              {currentTier === plan.id ? 'Active Node' : `Deploy ${plan.id}`}
            </button>
          </div>
        ))}
      </div>

      <footer className="text-center py-10 border-t border-zinc-900">
        <p className="text-zinc-600 text-[9px] uppercase font-bold mono tracking-[0.3em]">
          Operational stability guaranteed. Cancellations effective at end of cycle.
        </p>
      </footer>
    </div>
  );
};
