import React from 'react';
import { VerdictData } from '../types/decision';
import { Award, AlertOctagon, ArrowRight, Lightbulb, Compass, Flame, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface VerdictViewProps {
  verdict: VerdictData;
  decisionTitle: string;
  onOpenStressTest: () => void;
  onOpenCoinFlip: () => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  decisionTitle,
  onOpenStressTest,
  onOpenCoinFlip,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Recommendation Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-6">
          {/* Header Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                The Tiebreaker Official Ruling
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Confidence Rating:</span>
              <span className="text-xs font-extrabold font-mono text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full">
                {verdict.confidenceScore}% Certainty
              </span>
            </div>
          </div>

          {/* Primary Recommendation */}
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Optimal Selected Path:
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display tracking-tight text-amber-300">
              {verdict.recommendedOption}
            </h2>
          </div>

          {/* The Tiebreaker Principle Quote */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>The Tiebreaker Principle</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic text-slate-200 leading-relaxed">
              "{verdict.tiebreakerInsight}"
            </p>
          </div>

          {/* Quick Action CTA Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenStressTest}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Challenge This Verdict (Devil's Advocate)</span>
            </button>

            <button
              onClick={onOpenCoinFlip}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-750 border border-slate-750 rounded-xl transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Your Emotional Gut Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditions Matrix: When to Choose Which */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">
            Conditional Roadmap: When to Choose Each Option
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-editorial">
          No decision exists in a vacuum. Verify your personal constraints against these criteria:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {verdict.whenToChooseEachOption.map((item, idx) => {
            const isRecommended = item.optionName === verdict.recommendedOption;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-3 ${
                  isRecommended
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">
                    {item.optionName}
                  </h4>
                  {isRecommended && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {item.conditions.map((cond, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-amber-400 font-bold mt-0.5">›</span>
                      <span className="font-editorial leading-normal">{cond}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Red Lines & 48h Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Lines */}
        <div className="rounded-2xl bg-slate-900/60 border border-rose-900/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertOctagon className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300">
              Non-Negotiable Red Lines
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-editorial">
            Immediate exit triggers. If any of these materialize, halt and re-evaluate immediately:
          </p>
          <div className="space-y-2 pt-1">
            {verdict.redLines.map((line, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-900/20 flex items-start gap-2.5 text-xs text-slate-300"
              >
                <span className="text-rose-400 font-bold text-sm leading-none">⚠️</span>
                <span className="font-editorial leading-normal text-rose-200/90">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 48-Hour Next Step */}
        <div className="rounded-2xl bg-slate-900/60 border border-emerald-900/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <ArrowRight className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Low-Risk 48-Hour Next Move
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-editorial">
            Do not commit irrevocably today. Take this high-information, low-risk test action first:
          </p>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/40 text-xs text-slate-200 font-editorial leading-relaxed">
            {verdict.immediateNextStep}
          </div>
        </div>
      </div>

      {/* Thought Experiment Box */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Lightbulb className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Clarity Mental Experiment
          </h3>
        </div>
        <p className="text-sm text-slate-300 font-serif italic leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          {verdict.thoughtExperiment}
        </p>
      </div>
    </div>
  );
};
