
import React from 'react';
import { CoFounderResponse } from '../types';

interface ResponseViewProps {
  data: CoFounderResponse;
}

export const ResponseView: React.FC<ResponseViewProps> = ({ data }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
           <h3 className="text-zinc-600 text-[9px] font-bold tracking-[0.3em] uppercase mono border-b border-zinc-900 pb-2">Diagnostic Summary</h3>
           <p className="text-zinc-100 text-sm leading-relaxed font-medium">{data.summary}</p>
        </div>
        <div className="space-y-4">
           <h3 className="text-zinc-600 text-[9px] font-bold tracking-[0.3em] uppercase mono border-b border-zinc-900 pb-2">Validation Score</h3>
           <div className="flex items-baseline gap-2">
             <span className={`text-4xl font-bold mono ${data.validationScore > 70 ? 'text-green-500' : 'text-yellow-500'}`}>
               {data.validationScore}
             </span>
             <span className="text-[10px] text-zinc-600 font-bold mono">/ 100</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border border-zinc-800 bg-zinc-900/10 rounded-sm">
          <h3 className="text-blue-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 mono">Priority Command</h3>
          <p className="text-white text-sm font-bold leading-tight">{data.nextAction}</p>
        </div>

        <div className="p-6 border border-red-900/30 bg-red-950/5 rounded-sm">
          <h3 className="text-red-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 mono">Survival Threat</h3>
          <p className="text-zinc-200 text-sm font-medium leading-tight italic">{data.riskAlert}</p>
        </div>

        <div className="p-6 border border-zinc-800 bg-zinc-900/10 rounded-sm">
          <h3 className="text-zinc-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 mono">Target Metric</h3>
          <p className="text-white text-lg font-bold mono">{data.metric}</p>
        </div>

        <div className="p-6 border border-zinc-800 bg-zinc-900/10 rounded-sm">
          <h3 className="text-zinc-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 mono">Operational Insight</h3>
          <p className="text-zinc-400 text-xs leading-relaxed italic">
            {data.insight || "Prioritize distribution loops over feature additions."}
          </p>
        </div>
      </div>

      <div className="p-8 border border-zinc-800 bg-zinc-900/20 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-zinc-500 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 mono">Active Execution Protocol (60 min)</h3>
        <div className="text-zinc-100 text-base whitespace-pre-wrap leading-relaxed font-medium">
          {data.task60Min}
        </div>
      </div>
    </div>
  );
};
