import React, { useState } from 'react';
import { ComparisonCriterion, DecisionOption } from '../types/decision';
import { Trophy, Sliders, Info, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ComparisonTableViewProps {
  criteria: ComparisonCriterion[];
  options: DecisionOption[];
  onUpdateCriteria: (updatedCriteria: ComparisonCriterion[]) => void;
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  criteria,
  options,
  onUpdateCriteria,
}) => {
  const [expandedRationale, setExpandedRationale] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionDesc, setNewCriterionDesc] = useState('');
  const [newCriterionWeight, setNewCriterionWeight] = useState(4);
  const [newScores, setNewScores] = useState<{ [optionName: string]: number }>({});

  const handleWeightChange = (critId: string, weight: number) => {
    const updated = criteria.map((c) => (c.id === critId ? { ...c, userWeight: weight } : c));
    onUpdateCriteria(updated);
  };

  // Calculate dynamic composite scores for each option
  const calculateOptionTotals = () => {
    const totals: { [optionName: string]: { weightedSum: number; maxPossible: number; percentage: number } } = {};

    options.forEach((opt) => {
      totals[opt.name] = { weightedSum: 0, maxPossible: 0, percentage: 0 };
    });

    criteria.forEach((crit) => {
      const weight = crit.userWeight ?? crit.importanceWeight;
      crit.optionScores.forEach((os) => {
        if (totals[os.optionName]) {
          totals[os.optionName].weightedSum += os.score * weight;
          totals[os.optionName].maxPossible += 10 * weight;
        }
      });
    });

    options.forEach((opt) => {
      const item = totals[opt.name];
      if (item && item.maxPossible > 0) {
        item.percentage = Math.round((item.weightedSum / item.maxPossible) * 100);
      }
    });

    return totals;
  };

  const optionTotals = calculateOptionTotals();

  // Determine top winning option based on weighted score
  const sortedOptions = [...options].sort((a, b) => {
    const scoreA = optionTotals[a.name]?.percentage || 0;
    const scoreB = optionTotals[b.name]?.percentage || 0;
    return scoreB - scoreA;
  });

  const leadingOptionName = sortedOptions[0]?.name;

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newCrit: ComparisonCriterion = {
      id: 'crit_' + Date.now(),
      name: newCriterionName.trim(),
      description: newCriterionDesc.trim() || 'User-defined evaluation criterion',
      importanceWeight: newCriterionWeight,
      userWeight: newCriterionWeight,
      optionScores: options.map((opt) => ({
        optionName: opt.name,
        score: newScores[opt.name] || 7,
        rationale: 'User evaluation based on personal assessment.',
      })),
    };

    onUpdateCriteria([...criteria, newCrit]);
    setShowAddModal(false);
    setNewCriterionName('');
    setNewCriterionDesc('');
    setNewScores({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Leaderboard Summary */}
      <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">
              Multi-Criteria Decision Matrix
            </h2>
            <span className="text-[11px] text-slate-400">
              · Interactive Weighted Model
            </span>
          </div>
          <p className="text-xs text-slate-400 font-editorial mt-0.5">
            Adjust the importance slider for any criterion. The overall weighted scores will recalibrate in real time.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30 rounded-lg self-start md:self-auto transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Criterion</span>
        </button>
      </div>

      {/* Leaderboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sortedOptions.map((opt, rank) => {
          const stats = optionTotals[opt.name];
          const isWinner = opt.name === leadingOptionName;
          return (
            <div
              key={opt.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isWinner
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm shadow-amber-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {isWinner ? (
                    <Trophy className="w-4 h-4 text-amber-400" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-500">#{rank + 1}</span>
                  )}
                  <span className="text-xs font-bold text-slate-200 line-clamp-1">
                    {opt.name}
                  </span>
                </div>
                <span className={`text-base font-extrabold font-mono ${
                  isWinner ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {stats?.percentage || 0}%
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isWinner ? 'bg-amber-400' : 'bg-slate-500'
                  }`}
                  style={{ width: `${stats?.percentage || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Weighted: {stats?.weightedSum || 0} pts</span>
                <span>Max: {stats?.maxPossible || 0} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <th className="p-3.5 font-semibold min-w-[220px]">
                Evaluation Criterion
              </th>
              <th className="p-3.5 font-semibold w-[130px] text-center">
                Importance Weight
              </th>
              {options.map((opt) => {
                const isWinner = opt.name === leadingOptionName;
                return (
                  <th
                    key={opt.id}
                    className={`p-3.5 font-bold min-w-[200px] ${
                      isWinner ? 'text-amber-300 bg-amber-500/5' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isWinner && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span>{opt.name}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {criteria.map((crit) => {
              const currentWeight = crit.userWeight ?? crit.importanceWeight;
              const isExpanded = expandedRationale === crit.id;

              return (
                <tr key={crit.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Criterion Info */}
                  <td className="p-3.5 align-top">
                    <div className="font-semibold text-slate-100 text-xs">
                      {crit.name}
                    </div>
                    <p className="text-[11px] text-slate-400 font-editorial mt-0.5 line-clamp-2">
                      {crit.description}
                    </p>
                    <button
                      onClick={() => setExpandedRationale(isExpanded ? null : crit.id)}
                      className="mt-1.5 text-[10px] text-amber-400/80 hover:text-amber-300 flex items-center gap-0.5"
                    >
                      {isExpanded ? (
                        <>Hide details <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>View rationale <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  </td>

                  {/* Interactive Weight Slider */}
                  <td className="p-3.5 align-top text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleWeightChange(crit.id, w)}
                            className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                              currentWeight === w
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                            title={`Set importance weight to ${w}/5`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {currentWeight === 5
                          ? 'Critical'
                          : currentWeight >= 4
                          ? 'High'
                          : currentWeight === 3
                          ? 'Moderate'
                          : 'Low'}
                      </span>
                    </div>
                  </td>

                  {/* Option Scores */}
                  {options.map((opt) => {
                    const scoreObj = crit.optionScores.find((s) => s.optionName === opt.name) || {
                      score: 5,
                      rationale: 'No rationale available',
                    };
                    const isWinner = opt.name === leadingOptionName;

                    // Color based on score
                    const scoreColor =
                      scoreObj.score >= 8
                        ? 'text-emerald-400'
                        : scoreObj.score >= 6
                        ? 'text-amber-300'
                        : 'text-rose-400';

                    return (
                      <td
                        key={opt.id}
                        className={`p-3.5 align-top ${
                          isWinner ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-base font-extrabold font-mono ${scoreColor}`}>
                            {scoreObj.score}
                            <span className="text-slate-600 text-xs font-normal">/10</span>
                          </span>

                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full ${
                                scoreObj.score >= 8
                                  ? 'bg-emerald-400'
                                  : scoreObj.score >= 6
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{ width: `${scoreObj.score * 10}%` }}
                            />
                          </div>
                        </div>

                        {/* Rationale */}
                        <p
                          className={`text-[11px] text-slate-400 font-editorial leading-relaxed ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}
                        >
                          {scoreObj.rationale}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/* Summary Row */}
          <tfoot>
            <tr className="bg-slate-950/90 border-t-2 border-slate-800 text-slate-100 font-bold">
              <td className="p-3.5 text-xs uppercase tracking-wider text-slate-300">
                Composite Score
              </td>
              <td className="p-3.5 text-center text-xs text-slate-400 font-mono">
                Σ Weighted
              </td>
              {options.map((opt) => {
                const stats = optionTotals[opt.name];
                const isWinner = opt.name === leadingOptionName;
                return (
                  <td
                    key={opt.id}
                    className={`p-3.5 ${isWinner ? 'bg-amber-500/10 text-amber-400' : 'text-slate-200'}`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold font-mono">
                        {stats?.percentage || 0}%
                      </span>
                      {isWinner && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                          Leader
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add Custom Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                Add Evaluation Criterion
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCriterion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Criterion Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCriterionName}
                  onChange={(e) => setNewCriterionName(e.target.value)}
                  placeholder="e.g. Health & Sleep Quality, Autonomy, Exit Multiples"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCriterionDesc}
                  onChange={(e) => setNewCriterionDesc(e.target.value)}
                  placeholder="What does high performance in this criterion look like?"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Importance Weight (1 to 5)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setNewCriterionWeight(w)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded ${
                        newCriterionWeight === w
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Rate each option on this criterion (1-10)
                </label>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between gap-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-200 font-medium truncate flex-1">
                        {opt.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={newScores[opt.name] ?? 7}
                          onChange={(e) =>
                            setNewScores({
                              ...newScores,
                              [opt.name]: Number(e.target.value),
                            })
                          }
                          className="w-24 accent-amber-400"
                        />
                        <span className="text-xs font-mono font-bold text-amber-400 w-6 text-right">
                          {newScores[opt.name] ?? 7}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
                >
                  Save Criterion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
