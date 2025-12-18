
import React, { useState, useEffect, useRef } from 'react';
import { Onboarding } from './components/Onboarding';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PricingView } from './components/PricingView';
import { StartupProfile, Message, CoFounderResponse, AppView, SubscriptionTier } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const gemini = useRef(new GeminiService());

  const handleOnboarding = async (p: StartupProfile) => {
    const fullProfile: StartupProfile = {
      ...p,
      runwayMonths: 12,
      monthlyBurn: 0,
      executionStreak: 0,
      validationScore: 0,
      tier: 'Free'
    };
    
    setProfile(fullProfile);
    setIsThinking(true);
    
    const initialPrompt = `Protocol Start:
Persona: ${fullProfile.userType}
Thesis: ${fullProfile.problem}
Target: ${fullProfile.targetUser}
Capture: ${fullProfile.monetization}

Establish tactical command and audit the thesis.`;

    try {
      const text = await gemini.current.generateResponse([
        { role: 'user', parts: [{ text: initialPrompt }] }
      ]);
      const structured = gemini.current.parseResponse(text);
      
      setMessages([
        { role: 'user', content: initialPrompt, timestamp: Date.now() },
        { role: 'model', content: text, structuredData: structured, timestamp: Date.now() }
      ]);
      
      setProfile(prev => prev ? { ...prev, validationScore: structured.validationScore } : null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || isThinking) return;

    // OPTIMISTIC UPDATE: Add user message and "Thinking" state immediately
    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const text = await gemini.current.generateResponse(history);
      const structured = gemini.current.parseResponse(text);

      setMessages(prev => [...prev, {
        role: 'model',
        content: text,
        structuredData: structured,
        timestamp: Date.now()
      }]);
      
      setProfile(prev => prev ? { ...prev, validationScore: structured.validationScore } : null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const completeTask = () => {
    setProfile(prev => prev ? { ...prev, executionStreak: Math.min(prev.executionStreak + 1, 5) } : null);
    handleSendMessage("Strategic objective achieved. Analyze next unit.");
    setCurrentView('dashboard');
  };

  const lastModelResponse = messages.filter(m => m.role === 'model').pop()?.structuredData;

  const getSubHeader = () => {
    if (!profile) return "SYS_OFFLINE";
    switch(profile.userType) {
      case 'Agency': return "ARCHITECT_MODE";
      case 'Freelancer': return "SOLO_MODE";
      case 'Student': return "LAUNCH_MODE";
      default: return "FOUNDER_MODE";
    }
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentView]);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col p-6 md:p-12 lg:p-24 max-w-7xl mx-auto bg-black selection:bg-blue-500">
        <header className="py-12 md:py-24 border-b border-zinc-900 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] mono text-white mb-6">AXIOM</h1>
          <p className="text-zinc-800 text-[10px] font-bold uppercase tracking-[0.6em] mono">Objective Founding OS / Stable_v2.5</p>
        </header>
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Onboarding onComplete={handleOnboarding} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          profile={profile}
          subHeader={getSubHeader()}
        />
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-black w-full">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-black shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-zinc-400 active:scale-95 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <span className="text-white font-bold tracking-widest text-xs mono">AXIOM OS</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="h-full animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            {currentView === 'dashboard' && (
              <DashboardView 
                lastUpdate={lastModelResponse} 
                onExecute={() => setCurrentView('tasks')} 
                validationScore={profile.validationScore}
                userType={profile.userType}
                messages={messages}
                isThinking={isThinking}
                onCommand={handleSendMessage}
                executionStreak={profile.executionStreak}
              />
            )}

            {currentView === 'tasks' && (
              <div className="p-6 md:p-16 max-w-5xl mx-auto h-full flex flex-col">
                <header className="mb-8 md:mb-12 border-b border-zinc-900 pb-6 md:pb-8">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mono">Execution Queue</h2>
                </header>
                {lastModelResponse?.task60Min ? (
                  <div className="p-8 md:p-16 border border-zinc-900 bg-zinc-950/50 flex flex-col flex-1">
                    <div className="text-[8px] md:text-[10px] text-zinc-600 font-bold uppercase tracking-widest mono mb-6 md:mb-10">Unit_001 / High_Priority</div>
                    <div className="flex-1 overflow-y-auto mb-10 md:mb-16 custom-scrollbar">
                      <div className="text-3xl md:text-5xl text-white font-bold tracking-tighter leading-[1.1]">
                        {lastModelResponse.task60Min}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mt-auto">
                      <button 
                        onClick={completeTask}
                        className="flex-1 bg-white text-black py-4 md:py-5 font-bold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-zinc-100 transition-all active:scale-95"
                      >
                        Mark as Validated
                      </button>
                      <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="px-6 md:px-10 border border-zinc-800 text-zinc-600 hover:text-white transition-all py-4 md:py-0 uppercase text-[9px] md:text-[10px] font-bold tracking-widest mono active:scale-95"
                      >
                        Defer Logic
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-800 mono uppercase text-[10px] md:text-[11px] tracking-[0.6em] font-bold italic text-center px-6">Queue_Empty. Awaiting_Tactical_Update.</div>
                )}
              </div>
            )}

            {currentView === 'decisions' && (
              <div className="p-8 md:p-16 max-w-5xl mx-auto h-full flex flex-col items-center justify-center text-center space-y-8">
                <svg className="w-10 md:w-12 h-10 md:h-12 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <div className="space-y-4">
                  <h3 className="text-zinc-600 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.5em] mono">Decision Node Locked</h3>
                  <p className="text-zinc-400 text-xs md:text-sm max-w-md leading-relaxed">No strategic impasses detected. The OS is operating on your current Founding Thesis without logic contradictions.</p>
                </div>
              </div>
            )}

            {currentView === 'review' && (
              <div className="p-8 md:p-16 max-w-5xl mx-auto h-full flex flex-col">
                <header className="mb-10 md:mb-16 border-b border-zinc-900 pb-8 md:pb-12">
                   <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Strategic Review</h2>
                   <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-700 mono mt-2">Historical Performance Audit</p>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                   <div className="space-y-4">
                     <div className="text-[8px] md:text-[9px] text-zinc-600 uppercase mono font-bold tracking-widest">Execution_Velocity</div>
                     <div className="p-6 md:p-8 border border-zinc-900 bg-zinc-950">
                        <div className="text-3xl md:text-4xl font-bold text-white mono">100%</div>
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div className="text-[8px] md:text-[9px] text-zinc-600 uppercase mono font-bold tracking-widest">Logic_Stability</div>
                     <div className="p-6 md:p-8 border border-zinc-900 bg-zinc-950">
                        <div className="text-3xl md:text-4xl font-bold text-white mono">{profile.validationScore}%</div>
                   </div>
                   </div>
                </div>

                <div className="mt-12 md:mt-16 space-y-6 pb-24">
                  <h3 className="text-[9px] md:text-[10px] text-zinc-700 uppercase mono font-bold tracking-widest">Protocol Timeline</h3>
                  <div className="space-y-8 border-l border-zinc-900 pl-6 md:pl-8">
                     {messages.filter(m => m.role === 'model').map((msg, idx) => (
                       <div key={idx} className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                         <div className="text-[8px] md:text-[9px] text-zinc-800 mono">Cycle_{idx}</div>
                         <p className="text-xs text-zinc-500 italic leading-relaxed">{msg.structuredData?.nextAction}</p>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'health' && (
               <div className="p-6 md:p-16 max-w-7xl mx-auto space-y-12 md:space-y-16 pb-32">
                  <header className="border-b border-zinc-900 pb-8 md:pb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter">Diagnostic Analytics</h2>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 mono mt-2">v2.5 Condition Audit</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                     <div className="lg:col-span-8 space-y-12">
                        <section className="space-y-6">
                           <h3 className="text-red-500 text-[10px] font-bold uppercase tracking-widest mono">Primary Logic Flaw</h3>
                           <div className="p-6 md:p-10 border border-red-900/30 bg-red-950/5">
                              <p className="text-zinc-300 text-base md:text-lg font-medium leading-relaxed italic">{lastModelResponse?.riskAlert}</p>
                           </div>
                        </section>

                        <section className="space-y-6">
                           <h3 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mono">Solvency Window</h3>
                           <div className="p-8 md:p-12 border border-zinc-900 bg-zinc-950">
                              <div className="text-5xl md:text-7xl font-bold text-white mono tracking-tighter">12.0<span className="text-lg md:text-xl text-zinc-800 ml-3 md:ml-4">MO</span></div>
                              <div className="text-[9px] md:text-[10px] text-zinc-600 font-bold uppercase tracking-widest mono mt-4">Calculated Runway Baseline</div>
                           </div>
                        </section>
                     </div>

                     <div className="lg:col-span-4 h-full">
                        <div className="p-8 md:p-12 border border-zinc-900 bg-zinc-950 h-full flex flex-col justify-center items-center text-center">
                           <div className="text-6xl md:text-8xl font-bold text-white mono tracking-tighter">{profile.validationScore}%</div>
                           <div className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mono mt-6 md:mt-8">Strategy Strength</div>
                           <p className="text-[10px] md:text-[11px] text-zinc-700 leading-relaxed italic mt-8 md:mt-12 border-t border-zinc-900 pt-6 md:pt-8">
                              Calculated based on {profile.userType} success paradigms and internal logic consistency.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {currentView === 'billing' && (
              <div className="p-6 md:p-0 h-full">
                <PricingView 
                  currentTier={profile.tier} 
                  onUpgrade={(tier) => setProfile(prev => prev ? {...prev, tier} : null)} 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
