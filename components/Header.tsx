
import React from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'about') => void;
  currentView: 'home' | 'about';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="fixed top-0 z-50 w-full glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LUMINARY <span className="text-violet-400">AI</span></span>
        </button>
        
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[2px]">
          <button 
            onClick={() => onNavigate('home')}
            className={`${currentView === 'home' ? 'text-white' : 'text-zinc-500'} hover:text-white transition-colors`}
          >
            Generator
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className={`${currentView === 'about' ? 'text-white' : 'text-zinc-500'} hover:text-white transition-colors`}
          >
            About Labs
          </button>
        </nav>

        <div className="flex items-center gap-4">
           <span className="text-[10px] px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-black uppercase tracking-widest">v2.5 Hybrid</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
