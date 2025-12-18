
import React, { useState } from 'react';
import { StartupProfile, UserType } from '../types';

interface OnboardingProps {
  onComplete: (profile: StartupProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [profile, setProfile] = useState<Partial<StartupProfile>>({
    stage: 'Idea',
    userType: 'Founder'
  });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(profile as StartupProfile);
  };

  const update = (key: keyof StartupProfile, val: any) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  const userTypes: UserType[] = ['Student', 'Freelancer', 'Founder', 'Business Owner', 'Agency'];

  return (
    <div className="max-w-2xl mx-auto md:mt-10 p-6 md:p-10 border border-zinc-900 bg-zinc-950 rounded-sm">
      <div className="mb-8">
        <div className="flex gap-2 mb-12">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-zinc-100' : 'bg-zinc-900'}`} />
          ))}
        </div>
        
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-lg md:text-xl font-bold mb-8 mono text-white uppercase tracking-tight">Select operational profile:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => { update('userType', type); next(); }}
                  className={`text-left p-5 border rounded-sm transition-all flex justify-between items-center group ${
                    profile.userType === type ? 'border-blue-600 bg-blue-950/10' : 'border-zinc-900 bg-black/50 hover:border-zinc-700'
                  }`}
                >
                  <span className={`font-bold text-[10px] md:text-xs tracking-widest uppercase mono ${profile.userType === type ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                    {type}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${profile.userType === type ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]' : 'bg-zinc-900'}`}></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-lg md:text-xl font-bold mb-6 mono text-white uppercase tracking-tight">1. Problem Analysis</h2>
            <textarea
              className="w-full bg-black border border-zinc-900 p-5 rounded-sm focus:outline-none focus:border-zinc-700 min-h-[180px] text-zinc-100 text-sm leading-relaxed"
              placeholder="Define the core pain point in objective terms. Avoid jargon."
              value={profile.problem || ''}
              onChange={e => update('problem', e.target.value)}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-lg md:text-xl font-bold mb-6 mono text-white uppercase tracking-tight">2. Market Target</h2>
            <textarea
              className="w-full bg-black border border-zinc-900 p-5 rounded-sm focus:outline-none focus:border-zinc-700 min-h-[180px] text-zinc-100 text-sm leading-relaxed"
              placeholder="Specify job titles, industries, or demographics."
              value={profile.targetUser || ''}
              onChange={e => update('targetUser', e.target.value)}
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-lg md:text-xl font-bold mb-6 mono text-white uppercase tracking-tight">3. Value Capture</h2>
            <textarea
              className="w-full bg-black border border-zinc-900 p-5 rounded-sm focus:outline-none focus:border-zinc-700 min-h-[180px] text-zinc-100 text-sm leading-relaxed"
              placeholder="Describe the monetization logic (Subscription, Fee, Exit)."
              value={profile.monetization || ''}
              onChange={e => update('monetization', e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      {step > 0 && (
        <div className="flex gap-4">
           <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-4 border border-zinc-900 text-zinc-600 font-bold uppercase tracking-[0.1em] text-[9px] hover:text-white transition-all"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!(step === 1 ? profile.problem : step === 2 ? profile.targetUser : profile.monetization)}
            className="flex-1 bg-white text-black py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 disabled:opacity-30 transition-all shadow-xl"
          >
            {step === 3 ? 'Deploy Unit' : 'Next Protocol'}
          </button>
        </div>
      )}
    </div>
  );
};
