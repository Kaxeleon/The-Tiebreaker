import React from 'react';
import { Scale, History, Coins, PlusCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  hasActiveDecision: boolean;
  savedCount: number;
  onOpenHistory: () => void;
  onOpenCoinFlip: () => void;
  onNewDecision: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasActiveDecision,
  savedCount,
  onOpenHistory,
  onOpenCoinFlip,
  onNewDecision,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-200 shadow-sm shadow-amber-500/10">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display tracking-widest text-base font-bold text-slate-100 uppercase">
                The Tiebreaker
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Pros & Cons · Comparison Matrix · SWOT · Decisive Verdicts
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coin Flip / Gut check */}
          <button
            onClick={onOpenCoinFlip}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-750 rounded-lg transition-all"
            title="Emotional Gut Check & Coin Flip Test"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Gut Check</span>
            <span className="md:hidden">Flip</span>
          </button>

          {/* Saved Decisions */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-750 rounded-lg transition-all"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded-full font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          {hasActiveDecision && (
            <button
              onClick={onNewDecision}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Dilemma</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
