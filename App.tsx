
import React, { useState, useEffect, useMemo } from 'react';
import { TabType, HistoryItem } from './types.ts';
import { SINHALA_MAPPINGS } from './constants.tsx';
import { fixGrammar, smartTransliterate } from './services/geminiService.ts';
import { transliterate } from './utils/sinhalaEngine.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.EDITOR);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('helatype_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [language, setLanguage] = useState<'SI' | 'EN'>('SI');
  const [helpSearch, setHelpSearch] = useState('');

  // Handle PWA installation prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
        alert("ඔබේ බ්‍රවුසරය දැනටමත් මෙම ඇප් එක ඉන්ස්ටෝල් කිරීමට සූදානම්. කරුණාකර බ්‍රවුසරයේ ඉහළ ඇති Install ලකුණ බලන්න.");
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (language === 'SI' && inputText) {
        setOutputText(transliterate(inputText));
    } else if (language === 'EN') {
        setOutputText(inputText);
    } else if (!inputText) {
        setOutputText('');
    }
  }, [inputText, language]);

  useEffect(() => {
    localStorage.setItem('helatype_history', JSON.stringify(history));
  }, [history]);

  const handleSmartSave = async () => {
    if (!outputText.trim()) return;
    setIsProcessing(true);
    try {
      const newItem: HistoryItem = { 
        id: Date.now().toString(), 
        text: outputText, 
        timestamp: Date.now() 
      };
      setHistory(prev => [newItem, ...prev]);
      alert("වැඩේ සාර්ථකව Save වුණා!");
    } catch (err) {
      alert("Save කිරීමට නොහැකි වුණා.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const filteredMappings = useMemo(() => {
    if (!helpSearch) return SINHALA_MAPPINGS;
    const s = helpSearch.toLowerCase();
    return SINHALA_MAPPINGS.filter(m => 
      m.english.toLowerCase().includes(s) || 
      m.sinhala.includes(s)
    );
  }, [helpSearch]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 flex items-center justify-center p-0 md:p-6 overflow-hidden">
      
      {/* Main Desktop Window Container */}
      <div className="w-full max-w-[1400px] h-full md:h-[90vh] bg-[#121215] md:rounded-[2.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col relative overflow-hidden">
        
        {/* Native Title Bar Simulation */}
        <div className="h-14 bg-white/5 border-b border-white/5 flex items-center justify-between px-6 shrink-0 select-none">
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="h-4 w-px bg-white/10 mx-2"></div>
                <div className="flex items-center gap-3">
                    <span className="bg-orange-600 p-1 rounded-md text-[10px]"><i className="fas fa-feather-pointed text-white"></i></span>
                    <span className="text-[11px] font-bold tracking-widest uppercase opacity-40">HelaType Pro Master v1.0</span>
                </div>
            </div>

            {!isInstalled && (
                <button 
                    onClick={handleInstallClick}
                    className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-orange-400 transition-all flex items-center gap-2 border border-orange-500/20"
                >
                    <i className="fas fa-download"></i> INSTALL TO DESKTOP
                </button>
            )}

            <div className="flex items-center gap-6">
                <i className="fas fa-signal text-xs opacity-20"></i>
                <i className="fas fa-battery-three-quarters text-xs opacity-20"></i>
                <span className="text-[10px] font-mono opacity-40">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-24 md:w-72 bg-black/20 border-r border-white/5 flex flex-col p-6 shrink-0">
                <div className="mb-12 px-4 hidden md:block">
                    <h2 className="text-2xl font-black text-white">HelaType</h2>
                    <p className="text-[10px] text-orange-500 font-black tracking-[4px] uppercase opacity-60">Professional</p>
                </div>

                <nav className="space-y-4 flex-1">
                    {[
                        { id: TabType.EDITOR, label: 'Editor', icon: 'fa-keyboard' },
                        { id: TabType.AI_TOOLS, label: 'AI Power', icon: 'fa-wand-magic-sparkles' },
                        { id: TabType.HISTORY, label: 'Vault', icon: 'fa-box-archive' },
                        { id: TabType.HELP, label: 'Alphabet', icon: 'fa-book' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-5 p-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'hover:bg-white/5 text-slate-500 hover:text-white'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                <i className={`fas ${tab.icon}`}></i>
                            </div>
                            <span className="font-bold text-sm hidden md:block">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hidden md:block">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black opacity-30 uppercase">Language</span>
                            <span className="text-[10px] font-black text-orange-500">PRO</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setLanguage('SI')} className={`py-2 rounded-lg text-[10px] font-black ${language === 'SI' ? 'bg-orange-500 text-white' : 'bg-black/40 text-slate-500'}`}>SINGLISH</button>
                            <button onClick={() => setLanguage('EN')} className={`py-2 rounded-lg text-[10px] font-black ${language === 'EN' ? 'bg-blue-600 text-white' : 'bg-black/40 text-slate-500'}`}>ENGLISH</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Application Area */}
            <main className="flex-1 flex flex-col bg-[#0d0d0f] relative overflow-hidden">
                
                {activeTab === TabType.EDITOR && (
                    <div className="flex-1 flex flex-col p-10 animate-in fade-in slide-in-from-right-10 duration-500">
                        {/* Control Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-black text-white">Sinhala Workspace</h3>
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">Live Engine</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setInputText('')} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all border border-white/5">
                                    <i className="fas fa-trash-can"></i>
                                </button>
                                <button onClick={handleSmartSave} className="px-6 rounded-xl bg-white/5 flex items-center gap-3 text-xs font-black text-slate-300 hover:bg-white/10 transition-all border border-white/5">
                                    <i className="fas fa-floppy-disk"></i> SAVE TO VAULT
                                </button>
                            </div>
                        </div>

                        {/* Editor Split View */}
                        <div className="flex-1 grid grid-rows-2 gap-6">
                            {/* Input Area */}
                            <div className="bg-black/30 rounded-3xl border border-white/5 p-8 relative group">
                                <textarea 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="මෙහි සිංග්ලිෂ් වලින් ලියන්න (Type Singlish here)..."
                                    className="w-full h-full bg-transparent text-3xl md:text-4xl font-semibold resize-none focus:outline-none placeholder:text-slate-800 text-slate-300 no-scrollbar"
                                    autoFocus
                                />
                                <div className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-700 tracking-widest uppercase">Input Source</div>
                            </div>

                            {/* Output Area */}
                            <div className="bg-[#1a1a1e] rounded-3xl border border-white/5 p-8 relative shadow-inner overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex justify-between items-start mb-6 shrink-0">
                                    <span className="text-[10px] font-black text-orange-500/50 tracking-[5px] uppercase">Unicode Master Output</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar">
                                    <p className="text-5xl md:text-6xl sinhala-font text-white font-black leading-snug break-words">
                                        {outputText || <span className="opacity-5 italic font-medium">මෙතන සිංහල අකුරු පෙනෙයි...</span>}
                                    </p>
                                </div>
                                
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center mt-auto">
                                    <div className="text-[10px] font-bold text-slate-600">CHARACTERS: {outputText.length}</div>
                                    <button 
                                        onClick={copyToClipboard}
                                        className={`px-12 py-5 rounded-2xl font-black text-sm transition-all shadow-2xl flex items-center gap-4 ${copySuccess ? 'bg-green-600 text-white' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                                    >
                                        {copySuccess ? <><i className="fas fa-check"></i> COPIED!</> : <><i className="fas fa-copy"></i> COPY TO WORD</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === TabType.HELP && (
                    <div className="flex-1 flex flex-col p-10 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-white">Sinhala Alphabet Guide</h3>
                            <div className="relative w-96">
                                <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"></i>
                                <input 
                                    type="text"
                                    placeholder="අකුරක් සොයන්න (Search letter)..."
                                    value={helpSearch}
                                    onChange={(e) => setHelpSearch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-4 no-scrollbar pb-20">
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                {filteredMappings.map((m, i) => (
                                    <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col items-center hover:bg-orange-500/10 hover:border-orange-500/20 transition-all group">
                                        <span className="text-4xl sinhala-font text-white mb-3 font-bold group-hover:scale-110 transition-transform">{m.sinhala}</span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.english}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === TabType.HISTORY && (
                    <div className="flex-1 p-10 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
                        <h3 className="text-2xl font-black text-white mb-10">Saved Vault</h3>
                        {history.length === 0 ? (
                            <div className="h-[400px] flex flex-col items-center justify-center opacity-10">
                                <i className="fas fa-folder-open text-9xl mb-6"></i>
                                <p className="text-xl font-black tracking-widest uppercase">Empty Vault</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {history.map(item => (
                                    <div key={item.id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</span>
                                            <button 
                                                onClick={() => setHistory(h => h.filter(i => i.id !== item.id))}
                                                className="text-red-500/40 hover:text-red-500 transition-all"
                                            >
                                                <i className="fas fa-trash-can text-sm"></i>
                                            </button>
                                        </div>
                                        <p className="sinhala-font text-2xl text-white mb-8 line-clamp-3">{item.text}</p>
                                        <button 
                                            onClick={() => {setOutputText(item.text); setInputText(''); setActiveTab(TabType.EDITOR);}}
                                            className="w-full py-4 rounded-xl bg-white/5 hover:bg-white text-slate-400 hover:text-black font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            RESTORE TO EDITOR
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === TabType.AI_TOOLS && (
                    <div className="flex-1 p-10 animate-in fade-in duration-500">
                        <h3 className="text-2xl font-black text-white mb-10">AI Power Suite</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Grammar Shield', icon: 'fa-shield-halved', desc: 'අකුරු වැරදි සහ ව්‍යාකරණ AI මගින් නිවැරදි කරයි.', action: async () => {
                                    if (!outputText) return;
                                    setIsProcessing(true);
                                    const res = await fixGrammar(outputText);
                                    setOutputText(res);
                                    setIsProcessing(false);
                                }},
                                { title: 'Formal Letter AI', icon: 'fa-file-signature', desc: 'ඔබේ ලිපිය රාජකාරිමය මට්ටමට පත් කරයි.', action: async () => {
                                    if (!outputText) return;
                                    setIsProcessing(true);
                                    const res = await fixGrammar(`Rewrite this Sinhala text formally: ${outputText}`);
                                    setOutputText(res);
                                    setIsProcessing(false);
                                }},
                                { title: 'English Transcribe', icon: 'fa-language', desc: 'සිංහල අදහස් ඉංග්‍රීසියට හරවයි.', action: async () => {
                                    if (!outputText) return;
                                    setIsProcessing(true);
                                    const res = await smartTransliterate(`Translate this Sinhala text to English: ${outputText}`);
                                    setOutputText(res);
                                    setIsProcessing(false);
                                }}
                            ].map(tool => (
                                <button key={tool.title} onClick={tool.action} className="bg-white/5 border border-white/5 p-10 rounded-[3rem] text-left hover:bg-white/10 transition-all group relative overflow-hidden shadow-2xl">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 text-2xl mb-8 group-hover:scale-110 transition-transform">
                                        <i className={`fas ${tool.icon}`}></i>
                                    </div>
                                    <h4 className="text-xl font-black text-white mb-3">{tool.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                                    {isProcessing && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default App;
