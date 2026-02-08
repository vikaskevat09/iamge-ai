
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AdSection from './components/AdSection';
import GeneratorPanel from './components/GeneratorPanel';
import PolicyModal, { PolicyType } from './components/PolicyModal';
import AboutPage from './components/AboutPage';
import { generateAIImage } from './services/geminiService';
import { GeneratedImage, GenerationParams, AspectRatio } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [latestBatch, setLatestBatch] = useState<GeneratedImage[]>(() => {
    // Load cached images for instant startup speed
    const saved = localStorage.getItem('luminary_latest_batch');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  // Sync to localStorage for fast persistence
  useEffect(() => {
    localStorage.setItem('luminary_latest_batch', JSON.stringify(latestBatch));
  }, [latestBatch]);

  const handleGenerate = async (params: GenerationParams) => {
    setError(null);
    setIsGenerating(true);
    
    try {
      // Parallel generation for maximum throughput
      const generationPromises = Array.from({ length: params.batchSize }).map(async (_, idx) => {
        const url = await generateAIImage(params);
        return {
          id: Math.random().toString(36).substr(2, 9) + idx + Date.now(),
          url,
          prompt: params.prompt,
          timestamp: Date.now(),
          params: {
            aspectRatio: params.aspectRatio,
            style: params.style
          }
        } as GeneratedImage;
      });

      const results = await Promise.all(generationPromises);
      setLatestBatch(results);
      
      // Instant visual feedback scroll
      const resultEl = document.getElementById('result-theater');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      if (err.message === "PRO_KEY_REQUIRED") {
        setError("Access Restricted: Valid API key required.");
        try {
          await (window as any).aistudio.openSelectKey();
        } catch (e) {}
      } else {
        setError(err.message || "Synthesis disrupted.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    setLatestBatch(prev => prev.filter(img => img.id !== id));
  };

  const getAspectClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.LANDSCAPE: return 'aspect-video';
      case AspectRatio.PORTRAIT: return 'aspect-[9/16]';
      case AspectRatio.TALL: return 'aspect-[3/4]';
      case AspectRatio.STANDARD: return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-4xl';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-6xl';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3 max-w-7xl';
    return 'grid-cols-1 md:grid-cols-2 max-w-7xl';
  };

  const handleNavigate = (view: 'home' | 'about') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' }); // Faster than smooth for navigation
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-violet-500/30">
      <Header onNavigate={handleNavigate} currentView={currentView} />
      
      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <section className="pt-32 pb-12 px-6 text-center overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-violet-600/5 blur-[120px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-4xl mx-auto space-y-6 relative">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
                  PURE <span className="text-gradient">CREATION.</span>
                </h1>
                <p className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
                  Experience the pinnacle of AI image synthesis. High-fidelity results in any dimension.
                </p>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-6">
               <AdSection label="Horizontal Billboard" />
            </div>

            <GeneratorPanel onGenerate={handleGenerate} isGenerating={isGenerating} />

            {error && (
              <div className="max-w-4xl mx-auto px-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-red-400 flex flex-col md:flex-row items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm uppercase tracking-wider mb-1">System Alert</p>
                    <p className="text-sm opacity-80">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {latestBatch.length > 0 && (
              <section id="result-theater" className="py-16 px-6 mx-auto animate-in zoom-in-95 fade-in duration-500">
                <div className={`grid gap-8 mx-auto ${getGridClass(latestBatch.length)}`}>
                  {latestBatch.map((image) => (
                    <div key={image.id} className="glass rounded-[24px] overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.1)] group relative">
                      <div className={`relative w-full ${getAspectClass(image.params.aspectRatio)} bg-zinc-900 overflow-hidden`}>
                        <img 
                          src={image.url} 
                          alt={image.prompt} 
                          className="w-full h-full object-cover"
                          decoding="async"
                          loading="eager"
                          // Fix React fetchPriority attribute casing (line 149 error)
                          fetchPriority="high"
                        />
                        
                        <button
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <div className="flex flex-col gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Masterpiece Generated</p>
                              <p className="text-white text-xs font-medium leading-snug line-clamp-2">{image.prompt}</p>
                            </div>
                            <a 
                              href={image.url} 
                              download={`luminary-ai-${image.id}.png`}
                              className="w-full py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-violet-100 transition-all active:scale-95 shadow-2xl text-center"
                            >
                              Save Artwork
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-zinc-950/50 flex justify-between items-center border-t border-white/5">
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Ratio</span>
                            <span className="text-xs text-zinc-300 font-medium">{image.params.aspectRatio}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Style</span>
                            <span className="text-xs text-zinc-300 font-medium">{image.params.style}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Generated</span>
                          <p className="text-xs text-zinc-300 font-medium">{new Date(image.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <AboutPage />
        )}
      </main>

      <footer className="glass border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-black text-xl">L</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">LUMINARY <span className="text-violet-500">AI</span></span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Leading the revolution in generative visuals. Built with cutting-edge neural technology for the next generation of creators.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-xs font-bold uppercase tracking-[2px]">
             <div className="flex flex-col gap-4">
               <span className="text-white">Platform</span>
               <button onClick={() => handleNavigate('home')} className="text-left text-zinc-600 hover:text-violet-400 transition-colors uppercase tracking-[2px]">Generator</button>
               <button onClick={() => handleNavigate('about')} className="text-left text-zinc-600 hover:text-violet-400 transition-colors uppercase tracking-[2px]">About Labs</button>
             </div>
             <div className="flex flex-col gap-4">
               <span className="text-white">Legal</span>
               <button onClick={() => setActivePolicy('privacy')} className="text-left text-zinc-600 hover:text-violet-400 transition-colors uppercase tracking-[2px]">Privacy</button>
               <button onClick={() => setActivePolicy('licensing')} className="text-left text-zinc-600 hover:text-violet-400 transition-colors uppercase tracking-[2px]">Licensing</button>
               <button onClick={() => setActivePolicy('terms')} className="text-left text-zinc-600 hover:text-violet-400 transition-colors uppercase tracking-[2px]">Terms</button>
             </div>
             <div className="flex flex-col gap-4">
               <span className="text-white">Connect</span>
               <a href="https://ai.google.dev" className="text-zinc-600 hover:text-violet-400 transition-colors">Developer Portal</a>
               <a href="#" className="text-zinc-600 hover:text-violet-400 transition-colors">Support</a>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
           <span>Created with Neural AI Excellence</span>
           <span>&copy; 2025 Luminary AI Labs. All rights reserved.</span>
        </div>
      </footer>

      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />
    </div>
  );
};

export default App;
