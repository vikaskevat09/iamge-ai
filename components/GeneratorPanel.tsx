
import React, { useState, useEffect } from 'react';
import { AspectRatio, ImageStyle, GenerationParams } from '../types';
import { improvePrompt } from '../services/geminiService';

interface GeneratorPanelProps {
  onGenerate: (params: GenerationParams) => Promise<void>;
  isGenerating: boolean;
}

const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.NONE);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [isImproving, setIsImproving] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = ["Neural Routing...", "Applying Style...", "Synthesizing...", "Finalizing..."];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % steps.length);
      }, 2000); // Faster step transitions for "feel"
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate({ prompt, aspectRatio, style, batchSize });
  };

  const handleMagicPrompt = async () => {
    if (!prompt.trim() || isImproving) return;
    setIsImproving(true);
    const enhanced = await improvePrompt(prompt);
    setPrompt(enhanced);
    setIsImproving(false);
  };

  const handleSurpriseMe = () => {
    const ideas = [
      "Clockwork heart with glowing gears and vines",
      "Cyberpunk Venice with neon gondolas",
      "Astronaut playing a saxophone on an asteroid",
      "Desert of iridescent glass under three moons",
      "Miniature forest inside a vintage lightbulb"
    ];
    setPrompt(ideas[Math.floor(Math.random() * ideas.length)]);
  };

  return (
    <section id="generate" className="py-12 px-6">
      <div className="max-w-4xl mx-auto glass rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[100px] pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Visualization Prompt</label>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={handleSurpriseMe}
                  className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider font-bold transition-colors"
                >
                  Surprise Me
                </button>
                <span className={`text-[10px] font-mono ${prompt.length > 1800 ? 'text-red-400' : 'text-zinc-600'}`}>
                  {prompt.length}/2000
                </span>
              </div>
            </div>
            
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                placeholder="A lonely robot sitting on a park bench..."
                className="w-full h-40 bg-black/40 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none leading-relaxed"
                disabled={isGenerating || isImproving}
              />
              <button
                type="button"
                onClick={handleMagicPrompt}
                disabled={!prompt.trim() || isGenerating || isImproving}
                title="AI Enhancement (Fast)"
                className="absolute right-3 bottom-3 p-2 rounded-lg bg-zinc-800 hover:bg-violet-600 text-zinc-400 hover:text-white transition-all disabled:opacity-50 group-hover:scale-110 active:scale-95"
              >
                {isImproving ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[2px]">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer"
                disabled={isGenerating}
              >
                {Object.values(AspectRatio).map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[2px]">Art Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ImageStyle)}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer"
                disabled={isGenerating}
              >
                {Object.values(ImageStyle).map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[2px]">Batch Size</label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer"
                disabled={isGenerating}
              >
                {[1, 2, 3, 4].map(n => (
                  <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-5 rounded-xl font-black text-white transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-[0_0_40px_rgba(124,58,237,0.05)] ${
              isGenerating || !prompt.trim()
                ? 'bg-zinc-800 cursor-not-allowed text-zinc-600'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span className="uppercase tracking-[3px] text-xs font-bold animate-pulse">{steps[loadingStep]}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="uppercase tracking-[4px] text-xs font-bold">Generate Artwork</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default GeneratorPanel;
