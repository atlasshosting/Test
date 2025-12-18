
import React from 'react';
import { AppView, StartupProfile } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  profile: StartupProfile;
  subHeader: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, profile, subHeader }) => {
  const items: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 'tasks', label: 'Execution', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /> },
    { id: 'decisions', label: 'Decisions', icon: <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> },
    { id: 'health', label: 'Diagnostics', icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
    { id: 'review', label: 'Review', icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];

  const isFree = profile.tier === 'Free';

  return (
    <aside className="w-64 border-r border-zinc-900 bg-black flex flex-col shrink-0 h-full">
      <div className="p-6 border-b border-zinc-900">
        <h1 className="text-white font-bold tracking-[0.25em] text-sm uppercase mono mb-1">AXIOM OS</h1>
        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mono">{subHeader}</div>
      </div>
      
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all mono ${
              currentView === item.id 
                ? 'bg-zinc-900 text-white border border-white/5' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        {/* Logic Token Indicator for Free Tier */}
        {isFree && (
          <div className="px-3 py-3 bg-red-950/10 border border-red-900/20 rounded-sm">
             <div className="flex justify-between items-center mb-2">
               <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest mono">Logic Window</span>
               <span className="text-[8px] text-red-400 mono">3/3 Left</span>
             </div>
             <div className="h-1 bg-zinc-900 w-full rounded-full overflow-hidden">
                <div className="h-full bg-red-600 w-full" />
             </div>
          </div>
        )}

        <div className="px-3 py-4 bg-zinc-950 border border-zinc-900 rounded-sm">
          <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mb-2 mono">Founding Thesis</div>
          <div className="text-[10px] text-zinc-400 font-medium leading-tight mb-1 line-clamp-1">Target: {profile.targetUser}</div>
          <div className="text-[10px] text-zinc-500 italic line-clamp-1">{profile.problem}</div>
        </div>

        <div className="flex items-center justify-between px-3 text-[9px] mono uppercase font-bold text-zinc-600 tracking-tighter">
          <span>Streak</span>
          <span className="text-zinc-300">{profile.executionStreak}/5 Units</span>
        </div>

        <button 
          onClick={() => setView('billing')}
          className={`w-full text-center py-2.5 font-bold uppercase text-[9px] tracking-widest transition-all active:scale-95 ${
            isFree ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {profile.tier} Plan
        </button>
      </div>
    </aside>
  );
};
