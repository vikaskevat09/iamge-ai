
import React from 'react';

export type PolicyType = 'privacy' | 'licensing' | 'terms' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    privacy: {
      title: "Privacy Policy",
      sections: [
        { h: "Data Collection", p: "We do not store your personal identity. Prompts are processed in real-time to generate images." },
        { h: "Cookies", p: "We use local storage only to save your generation history locally on your device." },
        { h: "Third Parties", p: "Prompts are sent to our AI processing partners to synthesize images. No personal data is shared." }
      ]
    },
    terms: {
      title: "Terms of Service",
      sections: [
        { h: "Acceptable Use", p: "Users must not generate illegal, harmful, or sexually explicit content." },
        { h: "Service Availability", p: "Luminary AI is provided 'as is' without warranties of uptime or consistency." },
        { h: "API Usage", p: "Users providing their own keys are responsible for their own billing and usage limits." }
      ]
    },
    licensing: {
      title: "Licensing & Ownership",
      sections: [
        { h: "User Ownership", p: "You own the rights to the images you generate using this platform." },
        { h: "Commercial Use", p: "Generated images may be used for commercial projects, subject to the neural model provider's core terms." },
        { h: "Attribution", p: "Attribution to Luminary AI is appreciated but not required." }
      ]
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[32px] p-8 md:p-12 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">{content.title}</h2>
        
        <div className="space-y-8">
          {content.sections.map((s, i) => (
            <div key={i} className="space-y-3">
              <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest">{s.h}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onClose}
          className="mt-12 w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all"
        >
          Close Document
        </button>
      </div>
    </div>
  );
};

export default PolicyModal;
