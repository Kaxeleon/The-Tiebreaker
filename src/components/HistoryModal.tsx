import React from 'react';
import { X, Trash2, Download, FileText, Calendar, ArrowRight, Printer } from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';
import { exportDecisionAsMarkdown, downloadFile } from '../utils/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  const handleExportMarkdown = (d: DecisionAnalysis) => {
    const md = exportDecisionAsMarkdown(d);
    downloadFile(md, `${d.decisionTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_tiebreaker.md`, 'text/markdown');
  };

  const handleExportJson = (d: DecisionAnalysis) => {
    downloadFile(JSON.stringify(d, null, 2), `${d.decisionTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_tiebreaker.json`, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Saved Decision Dilemmas
            </h3>
            <p className="text-xs text-slate-400 font-editorial">
              Your previous evaluations and verdict snapshots
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No decisions saved yet. Analyze a dilemma to save it!</p>
            </div>
          ) : (
            savedDecisions.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1 cursor-pointer" onClick={() => onSelectDecision(d)}>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(d.timestamp).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-semibold">{d.options.length} options</span>
                    <span>·</span>
                    <span className="text-slate-400">Verdict: {d.verdict?.recommendedOption}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {d.decisionTitle}
                  </h4>
                  <p className="text-xs text-slate-400 font-editorial line-clamp-1">
                    {d.executiveSummary}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleExportMarkdown(d)}
                    title="Export as Markdown"
                    className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden md:inline">MD</span>
                  </button>

                  <button
                    onClick={() => onSelectDecision(d)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteDecision(d.id)}
                    title="Delete decision"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 px-5">
          <span>{savedDecisions.length} stored decisions</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-400 hover:text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
