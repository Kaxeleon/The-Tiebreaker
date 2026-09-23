/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { VerdictView } from './components/VerdictView';
import { StressTestDrawer } from './components/StressTestDrawer';
import { CoinFlipModal } from './components/CoinFlipModal';
import { HistoryModal } from './components/HistoryModal';
import { DecisionAnalysis, DecisionOption, ComparisonCriterion } from './types/decision';
import {
  getSavedDecisions,
  saveDecisionToStorage,
  deleteDecisionFromStorage,
  exportDecisionAsMarkdown,
  downloadFile,
} from './utils/storage';
import {
  Scale,
  Award,
  TableProperties,
  Compass,
  Flame,
  Download,
  Printer,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';

export default function App() {
  const [activeDecision, setActiveDecision] = useState<DecisionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'comparison' | 'swot'>('verdict');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [lastFormData, setLastFormData] = useState<{
    decisionTitle: string;
    description: string;
    options: string[];
    priorities: string[];
    urgency: string;
    riskTolerance: string;
  } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStressTestOpen, setIsStressTestOpen] = useState(false);
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Load saved decisions from storage on mount
  useEffect(() => {
    const loaded = getSavedDecisions();
    setSavedDecisions(loaded);
  }, []);

  const handleAnalyzeDecision = async (formData: {
    decisionTitle: string;
    description: string;
    options: string[];
    priorities: string[];
    urgency: string;
    riskTolerance: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLastFormData(formData);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const analysis: DecisionAnalysis = await response.json();
      setActiveDecision(analysis);
      setActiveTab('verdict');

      // Save to localStorage
      saveDecisionToStorage(analysis);
      setSavedDecisions(getSavedDecisions());
    } catch (err: any) {
      console.error('Failed to generate analysis:', err);
      setError(err.message || 'The AI model is currently experiencing high demand. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOptions = (updatedOptions: DecisionOption[]) => {
    if (!activeDecision) return;
    const updated = { ...activeDecision, options: updatedOptions };
    setActiveDecision(updated);
    saveDecisionToStorage(updated);
  };

  const handleUpdateCriteria = (updatedCriteria: ComparisonCriterion[]) => {
    if (!activeDecision) return;
    const updated = {
      ...activeDecision,
      comparisonTable: { criteria: updatedCriteria },
    };
    setActiveDecision(updated);
    saveDecisionToStorage(updated);
  };

  const handleDeleteDecision = (id: string) => {
    const updated = deleteDecisionFromStorage(id);
    setSavedDecisions(updated);
    if (activeDecision?.id === id) {
      setActiveDecision(null);
    }
  };

  const handleSelectSaved = (decision: DecisionAnalysis) => {
    setActiveDecision(decision);
    setActiveTab('verdict');
    setIsHistoryOpen(false);
  };

  const handleShareOrCopySummary = () => {
    if (!activeDecision) return;
    const md = exportDecisionAsMarkdown(activeDecision);
    navigator.clipboard.writeText(md).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e14] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        hasActiveDecision={!!activeDecision}
        savedCount={savedDecisions.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCoinFlip={() => setIsCoinFlipOpen(true)}
        onNewDecision={() => {
          setActiveDecision(null);
          setError(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <span className="text-base">⚠️</span>
              <div>
                <p className="font-semibold text-rose-100">Decision Analysis Interrupted</p>
                <p className="text-xs text-rose-300/90 font-editorial mt-0.5">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {lastFormData && (
                <button
                  onClick={() => handleAnalyzeDecision(lastFormData)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <span>Retry Now</span>
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="px-2 py-1.5 text-rose-400 hover:text-white text-xs underline font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!activeDecision ? (
          /* Decision Input Form */
          <div>
            <DecisionForm onSubmit={handleAnalyzeDecision} isLoading={isLoading} />

            {/* Feature Showcase Pillars */}
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Pros & Cons Matrix
                </h3>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  Deep impact-weighted advantages and risks with custom tactical mitigations for every drawback.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <TableProperties className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Comparison Table
                </h3>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  Multi-criteria side-by-side scoring with interactive importance weights calculated live.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  SWOT Analysis
                </h3>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  Comprehensive 4-quadrant strategic breakdown: Strengths, Weaknesses, Opportunities, Threats.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Decisive Verdict
                </h3>
                <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                  Definitive AI ruling, condition matrix, non-negotiable red flags, and low-risk 48h tests.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Decision Analysis View */
          <div className="space-y-6">
            {/* Top Bar: Title & Meta */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <button
                      onClick={() => setActiveDecision(null)}
                      className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to Inputs
                    </button>
                    <span>·</span>
                    <span>Urgency: {activeDecision.urgency}</span>
                    <span>·</span>
                    <span>Risk: {activeDecision.riskTolerance}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                    {activeDecision.decisionTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-editorial leading-relaxed">
                    {activeDecision.executiveSummary}
                  </p>
                  <div className="pt-1 text-xs text-amber-300/90 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Fundamental Dilemma: {activeDecision.primaryDilemmaCore}</span>
                  </div>
                </div>

                {/* Utility Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
                  <button
                    onClick={() => setIsStressTestOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Devil's Advocate</span>
                  </button>

                  <button
                    onClick={handleShareOrCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-all"
                    title="Copy full Markdown summary"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadFile(exportDecisionAsMarkdown(activeDecision), `${activeDecision.decisionTitle.substring(0, 20)}.md`, 'text/markdown')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
                    title="Export Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all hidden sm:block"
                    title="Print analysis"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High Demand Fallback Notice if applicable */}
              {activeDecision.isHighDemandFallback && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>High-Demand Mode:</strong> Synthesized by The Tiebreaker Engine during peak AI traffic. Full matrix is ready below.
                    </span>
                  </div>
                  {lastFormData && (
                    <button
                      onClick={() => handleAnalyzeDecision(lastFormData)}
                      disabled={isLoading}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md text-[11px] shrink-0 transition-all self-start sm:self-center"
                    >
                      {isLoading ? 'Re-analyzing...' : 'Re-query Gemini Live'}
                    </button>
                  )}
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 border-t border-slate-800 pt-3 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('verdict')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'verdict'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>The Verdict</span>
                </button>

                <button
                  onClick={() => setActiveTab('proscons')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'proscons'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Pros & Cons</span>
                </button>

                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'comparison'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <TableProperties className="w-4 h-4" />
                  <span>Comparison Matrix</span>
                </button>

                <button
                  onClick={() => setActiveTab('swot')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'swot'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>SWOT Analysis</span>
                </button>
              </div>
            </div>

            {/* Active Tab Panels */}
            {activeTab === 'verdict' && (
              <VerdictView
                verdict={activeDecision.verdict}
                decisionTitle={activeDecision.decisionTitle}
                onOpenStressTest={() => setIsStressTestOpen(true)}
                onOpenCoinFlip={() => setIsCoinFlipOpen(true)}
              />
            )}

            {activeTab === 'proscons' && (
              <ProsConsView
                options={activeDecision.options}
                onUpdateOptions={handleUpdateOptions}
              />
            )}

            {activeTab === 'comparison' && (
              <ComparisonTableView
                criteria={activeDecision.comparisonTable.criteria}
                options={activeDecision.options}
                onUpdateCriteria={handleUpdateCriteria}
              />
            )}

            {activeTab === 'swot' && (
              <SwotAnalysisView swotAnalysis={activeDecision.swotAnalysis} />
            )}
          </div>
        )}
      </main>

      {/* Slide-over Drawers & Modals */}
      {activeDecision && (
        <StressTestDrawer
          isOpen={isStressTestOpen}
          onClose={() => setIsStressTestOpen(false)}
          decision={activeDecision}
        />
      )}

      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        defaultOptionA={activeDecision?.options[0]?.name || 'Option A'}
        defaultOptionB={activeDecision?.options[1]?.name || 'Option B'}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSaved}
        onDeleteDecision={handleDeleteDecision}
      />
    </div>
  );
}
