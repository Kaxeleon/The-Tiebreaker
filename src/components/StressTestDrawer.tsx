import React, { useState } from 'react';
import { Flame, Send, X, AlertTriangle, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { DecisionAnalysis, StressTestResponse } from '../types/decision';

interface StressTestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionAnalysis;
}

const QUICK_CHALLENGES = [
  'Argue ruthlessly against the recommended option.',
  'What if the economy takes a downturn right after I decide?',
  'What emotional biases or sunk costs might be distorting my judgment?',
  'How easily can I reverse this decision if it proves disastrous?',
  'What is the catastrophic worst-case scenario and can I survive it?',
];

export const StressTestDrawer: React.FC<StressTestDrawerProps> = ({
  isOpen,
  onClose,
  decision,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StressTestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunStressTest = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle: decision.decisionTitle,
          currentVerdict: decision.verdict,
          question: promptText,
          context: {
            description: decision.description,
            priorities: decision.priorities,
            options: decision.options.map((o) => o.name),
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Stress test failed.');
      }

      const data: StressTestResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Error running stress test:', err);
      setError(err.message || 'Failed to stress-test decision.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                Devil's Advocate & Stress Test
              </h3>
              <p className="text-[11px] text-slate-400">
                Puncture optimism bias & pressure-test assumptions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Quick Challenge Chips */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-2">
              Select a Tough Interrogation Prompt:
            </span>
            <div className="space-y-1.5">
              {QUICK_CHALLENGES.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuestion(chip);
                    handleRunStressTest(chip);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/90 text-xs text-slate-300 hover:text-rose-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{chip}</span>
                  <span className="text-slate-500 group-hover:text-rose-400 text-xs ml-2">›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Or Ask a Specific What-If Scenario:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunStressTest(question)}
                placeholder="e.g. What if my partner hates the relocation?"
                className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
              <button
                onClick={() => handleRunStressTest(question)}
                disabled={isLoading || !question.trim()}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Challenge</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-editorial">
                Interrogating decision logic & stress-testing failure modes...
              </p>
            </div>
          )}

          {/* Result Card */}
          {result && !isLoading && (
            <div className="space-y-4 pt-2">
              {/* Core Deep-Dive */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Devil's Advocate Analysis</span>
                </div>
                <p className="text-xs text-slate-300 font-editorial leading-relaxed whitespace-pre-line">
                  {result.analysis}
                </p>
              </div>

              {/* Blind Spot */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hidden Blind Spot:</span>
                </div>
                <p className="text-xs text-amber-200/90 font-editorial leading-relaxed">
                  {result.blindSpot}
                </p>
              </div>

              {/* Counter-Perspective */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Strongest Counterargument:</span>
                </div>
                <p className="text-xs text-rose-200/90 font-editorial leading-relaxed">
                  {result.counterPerspective}
                </p>
              </div>

              {/* Recommended Pre-decision Action */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Critical Pre-Commitment Check:</span>
                </div>
                <p className="text-xs text-emerald-200/90 font-editorial leading-relaxed">
                  {result.recommendedAction}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
