
import React from 'react';

interface AdSectionProps {
  className?: string;
  label?: string;
}

const AdSection: React.FC<AdSectionProps> = ({ className = "", label = "Responsive Display Ad" }) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-8 ${className}`}>
      <span className="text-[10px] text-zinc-600 mb-2 uppercase tracking-widest">Advertisement</span>
      <div className="w-full min-h-[100px] md:min-h-[250px] bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="text-center px-4">
          <p className="text-zinc-500 font-medium text-sm">Google AdSense</p>
          <p className="text-zinc-700 text-xs mt-1">{label}</p>
        </div>
        {/* Real AdSense tag would go here */}
        {/* <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXX" data-ad-slot="XXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins> */}
      </div>
    </div>
  );
};

export default AdSection;
