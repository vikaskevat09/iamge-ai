
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
            Behind the <span className="text-gradient">Lens.</span>
          </h2>
          <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
            Luminary AI is more than a tool—it's a digital atelier where neural networks meet human imagination.
          </p>
        </section>

        {/* Mission Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
            <div className="w-12 h-12 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Our Mission</h3>
            <p className="text-zinc-500 leading-relaxed">
              We empower creators to manifest their wildest visions instantly. By bridging the gap between descriptive text and photorealistic imagery, we eliminate the barriers to artistic expression.
            </p>
          </div>

          <div className="glass p-8 rounded-[32px] border-white/5 space-y-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 0l-2.387.477a2 2 0 00-1.022.547l-1.14 1.14a2 2 0 01-2.829 0l-1.14-1.14a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 0l-2.387.477a2 2 0 00-1.022.547l-1.14 1.14a2 2 0 01-2.829 0l-1.14-1.14a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 0l-2.387.477a2 2 0 00-1.022.547l-1.14 1.14a2 2 0 01-2.829 0l-1.14-1.14a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86 0l-2.387.477a2 2 0 00-1.022.547l-1.14 1.14a2 2 0 01-2.829 0l-1.14-1.14" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Advanced Logic</h3>
            <p className="text-zinc-500 leading-relaxed">
              Leveraging the latest in stable neural diffusion and transformer architecture, Luminary processes complex semantic prompts to produce high-dynamic-range outputs in any aspect ratio.
            </p>
          </div>
        </section>

        {/* Features Table */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-[4px]">Core Capabilities</h3>
            <div className="w-24 h-1 bg-violet-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Neural Expansion", desc: "Proprietary prompt improvement" },
              { label: "Multi-Batch", desc: "Generate up to 4 variations" },
              { label: "Any Ratio", desc: "Cinematic to Portrait formats" },
              { label: "Zero Data Retain", desc: "Your prompts stay private" }
            ].map((f, i) => (
              <div key={i} className="text-center space-y-2">
                <p className="text-white font-bold text-sm uppercase tracking-wider">{f.label}</p>
                <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-white/5 p-12 rounded-[48px] text-center space-y-6">
          <h4 className="text-2xl font-bold text-white uppercase">Ready to Create?</h4>
          <p className="text-zinc-400 max-w-sm mx-auto text-sm">Join the thousands of digital artists pushing the boundaries of what's possible.</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-violet-100 transition-all"
          >
            Start Generating
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
