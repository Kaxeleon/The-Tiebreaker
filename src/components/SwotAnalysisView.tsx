import React, { useState } from 'react';
import { OptionSwot } from '../types/decision';
import { Shield, AlertTriangle, TrendingUp, Zap, Sparkles, Wrench } from 'lucide-react';

interface SwotAnalysisViewProps {
  swotAnalysis: OptionSwot[];
}

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({ swotAnalysis }) => {
  const [selectedOptionName, setSelectedOptionName] = useState<string>(
    swotAnalysis[0]?.optionName || ''
  );

  const activeSwot =
    swotAnalysis.find((s) => s.optionName === selectedOptionName) || swotAnalysis[0];

  if (!activeSwot) {
    return (
      <div className="p-8 text-center text-slate-500">
        No SWOT analysis available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Options Tab Header */}
      <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {swotAnalysis.map((swot, idx) => {
            const isSelected = swot.optionName === activeSwot.optionName;
            return (
              <button
                key={swot.optionName}
                onClick={() => setSelectedOptionName(swot.optionName)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                SWOT: {String.fromCharCode(65 + idx)}. {swot.optionName}
              </button>
            );
          })}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pr-2 font-editorial">
          Strategic 4-Quadrant Assessment
        </div>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Strengths */}
        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-4 hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                  Strengths (Internal)
                </h3>
                <p className="text-[11px] text-emerald-400/80">Inherent advantages & resources</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400/90 font-mono">
              {activeSwot.strengths.length} Factors
            </span>
          </div>

          <div className="space-y-3">
            {activeSwot.strengths.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-emerald-900/30 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: Weaknesses */}
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 space-y-4 hover:border-amber-700/50 transition-all">
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                W
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                  Weaknesses (Internal)
                </h3>
                <p className="text-[11px] text-amber-400/80">Vulnerabilities & missing competencies</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-400/90 font-mono">
              {activeSwot.weaknesses.length} Factors
            </span>
          </div>

          <div className="space-y-3">
            {activeSwot.weaknesses.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-amber-900/30 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    {item.impact} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: Opportunities */}
        <div className="rounded-2xl border border-sky-900/40 bg-sky-950/20 p-5 space-y-4 hover:border-sky-700/50 transition-all">
          <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                O
              </div>
              <div>
                <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wide">
                  Opportunities (External)
                </h3>
                <p className="text-[11px] text-sky-400/80">External tailwinds & upside possibilities</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-400/90 font-mono">
              {activeSwot.opportunities.length} Factors
            </span>
          </div>

          <div className="space-y-3">
            {activeSwot.opportunities.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-sky-900/30 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
                    {item.impact} Upside
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: Threats */}
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 space-y-4 hover:border-rose-700/50 transition-all">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                T
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
                  Threats (External)
                </h3>
                <p className="text-[11px] text-rose-400/80">Downside risks & market/environment traps</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-rose-400/90 font-mono">
              {activeSwot.threats.length} Factors
            </span>
          </div>

          <div className="space-y-3">
            {activeSwot.threats.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-rose-900/30 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-100">
                    {item.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                    {item.impact} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  {item.explanation}
                </p>
                {item.mitigationPlan && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-rose-950 text-[11px] text-rose-300/90">
                    <span className="font-semibold text-rose-400 flex items-center gap-1 mb-0.5">
                      <Wrench className="w-3 h-3" />
                      Defensive Shield:
                    </span>
                    <p className="font-editorial">{item.mitigationPlan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
