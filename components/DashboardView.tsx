
import React, { useState } from 'react';
import { CoFounderResponse, Message } from '../types';

interface DashboardViewProps {
  lastUpdate?: CoFounderResponse;
  onExecute: () => void;
  validationScore: number;
  userType: string;
  messages: Message[];
  isThinking: boolean;
  onCommand: (cmd: string) => void;
  executionStreak: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  lastUpdate, onExecute, validationScore, messages, isThinking, onCommand, executionStreak 
}) => {
  const [input, setInput] = useState('');

  const isLoading = !lastUpdate;
  
  // Use the specific score from the last update if available, otherwise fallback to prop
  const displayScore = lastUpdate?.validationScore ?? validationScore;

  return (
    <div className="flex flex-col xl:flex-row h-full bg-black overflow-hidden">
      {/* Strategic Hub */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-900">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
            
            {/* Header Section */}
            <header className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-blue-500 animate-pulse' : 'bg-green-500'} shadow-[0_0_8px_rgba(34,197,94,0.3)]`}></span>
                  <span className="text-zinc-600 font-bold text-[8px] md:text-[9px] uppercase tracking-[0.4em] mono">
                    {isThinking ? 'Synthesizing Protocol' : 'Tactical Alpha'}
                  </span>
                </div>
                {/* Visual Streak Counter */}
                <div className="flex gap-1.5 items-center">
                  <span className="text-[8px] md:text-[9px] text-zinc-700 font-bold uppercase mono tracking-widest mr-2">Consistency</span>
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 w-3 md:w-4 rounded-full transition-all duration-700 ${
                        i < executionStreak ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' : 'bg-zinc-900'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-10 md:h-14 bg-zinc-900 animate-pulse w-3/4"></div>
                  <div className="h-10 md:h-14 bg-zinc-900 animate-pulse w-1/2"></div>
                </div>
              ) : (
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tighter leading-[1.1] md:leading-[1] max-w-3xl animate-in fade-in slide-in-from-left-4 duration-500">
                  {lastUpdate.nextAction}
                </h2>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={onExecute}
                  disabled={isLoading}
                  className="bg-white text-black px-6 md:px-8 py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-100 transition-all active:scale-95 disabled:opacity-20"
                >
                  Confirm Execution
                </button>
                <div className="px-4 md:px-5 py-3 border border-zinc-800 flex items-center justify-between sm:justify-start gap-4 group">
                  <span className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest mono group-hover:text-zinc-400 transition-colors">Market Alignment</span>
                  {isLoading ? (
                    <div className="w-8 h-4 bg-zinc-900 animate-pulse"></div>
                  ) : (
                    <span className={`text-sm font-bold mono ${displayScore > 70 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {displayScore}%
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Audit & Risk Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-5 md:p-6 lg:p-8 bg-zinc-950 border border-zinc-900 space-y-3 hover:border-zinc-700 transition-colors group">
                <h3 className="text-zinc-600 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mono group-hover:text-zinc-500">System Audit</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-3 bg-zinc-900 animate-pulse w-full"></div>
                    <div className="h-3 bg-zinc-900 animate-pulse w-5/6"></div>
                    <div className="h-3 bg-zinc-900 animate-pulse w-4/6"></div>
                  </div>
                ) : (
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium animate-in fade-in duration-700">{lastUpdate.summary}</p>
                )}
              </div>
              <div className="p-5 md:p-6 lg:p-8 bg-red-950/5 border border-red-900/10 space-y-3 hover:border-red-900/30 transition-colors group">
                <h3 className="text-red-500 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mono">Survival Risk</h3>
                {isLoading ? (
                   <div className="space-y-2">
                    <div className="h-3 bg-zinc-900 animate-pulse w-full"></div>
                    <div className="h-3 bg-zinc-900 animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <p className="text-zinc-300 text-xs italic font-medium leading-relaxed animate-in fade-in duration-700">{lastUpdate.riskAlert}</p>
                )}
              </div>
            </div>

            {/* Metric Board */}
            <div className="p-5 md:p-8 border border-zinc-900 bg-zinc-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-zinc-800 transition-colors">
               <div>
                  <h3 className="text-zinc-600 font-bold text-[8px] md:text-[9px] uppercase tracking-widest mono mb-2">Performance Target</h3>
                  {isLoading ? (
                    <div className="h-8 md:h-10 w-32 bg-zinc-900 animate-pulse"></div>
                  ) : (
                    <div className="flex items-baseline gap-3 animate-in zoom-in-95 duration-500">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tighter mono">
                        {lastUpdate.metric.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mono">
                        {lastUpdate.metric.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                  )}
               </div>
               <div className="text-right hidden sm:block">
                 <div className="text-[8px] md:text-[9px] text-zinc-800 font-bold mono uppercase tracking-widest">Axiom Instance v2.5.5</div>
               </div>
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <div className="p-4 md:p-6 bg-zinc-950 border-t border-zinc-900 shrink-0">
          <div className="max-w-4xl mx-auto relative group">
            <input
              type="text"
              disabled={isThinking}
              className="w-full bg-black border border-zinc-800 rounded-sm py-4 pl-5 pr-28 focus:outline-none focus:border-zinc-500 text-[10px] md:text-[11px] text-zinc-100 placeholder:text-zinc-800 mono transition-all disabled:opacity-50"
              placeholder={isThinking ? "Synthesizing next deployment..." : "Update strategic status or log progress..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if(e.key === 'Enter' && input.trim()) {
                  onCommand(input);
                  setInput('');
                }
              }}
            />
            <button
              onClick={() => { if(input.trim()) { onCommand(input); setInput(''); } }}
              disabled={isThinking || !input.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-zinc-900 text-zinc-400 border border-zinc-800 px-4 md:px-6 rounded-sm font-bold text-[8px] md:text-[9px] uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-all active:scale-95 disabled:opacity-30"
            >
              Commit
            </button>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="hidden xl:flex w-80 flex-col bg-zinc-950 border-l border-zinc-900 overflow-hidden shrink-0">
        <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-black/20">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mono">Audit Trail</span>
          <div className="flex gap-1">
             <div className={`w-1 h-1 rounded-full ${isThinking ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`}></div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {isThinking && (
            <div className="space-y-3 animate-in fade-in duration-300">
               <div className="text-[8px] text-blue-500 uppercase mono tracking-tighter">Commit_In_Progress</div>
               <div className="space-y-2">
                 <div className="h-1.5 bg-zinc-900 animate-pulse w-full"></div>
                 <div className="h-1.5 bg-zinc-900 animate-pulse w-3/4"></div>
               </div>
            </div>
          )}
          {messages.filter(m => m.role === 'model').slice().reverse().map((msg, idx) => (
            <div key={idx} className="opacity-40 hover:opacity-100 transition-opacity space-y-2 cursor-default border-b border-zinc-900/50 pb-4 last:border-0">
               <div className="text-[8px] text-zinc-800 uppercase mono tracking-tighter">Sequence_{String(messages.length - idx).padStart(3, '0')}</div>
               {msg.structuredData && (
                 <div className="text-[10px] text-zinc-400 font-medium leading-relaxed italic border-l border-zinc-900 pl-3">
                   {msg.structuredData.insight}
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
