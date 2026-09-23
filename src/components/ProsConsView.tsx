import React, { useState } from 'react';
import { Plus, Check, ShieldAlert, Sparkles, Filter, Wrench, ArrowUpRight, ArrowDownRight, SlidersHorizontal } from 'lucide-react';
import { DecisionOption, ProItem, ConItem } from '../types/decision';

interface ProsConsViewProps {
  options: DecisionOption[];
  onUpdateOptions: (options: DecisionOption[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onUpdateOptions }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newType, setNewType] = useState<'pro' | 'con'>('pro');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemDetail, setNewItemDetail] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Career & Growth');
  const [newItemWeight, setNewItemWeight] = useState(3);
  const [newItemMitigation, setNewItemMitigation] = useState('');

  const currentOption = options.find((o) => o.id === selectedOptionId) || options[0];

  // Extract all available categories
  const categories = ['All', 'Financial', 'Career & Growth', 'Well-being & Life', 'Risk & Security', 'Strategic'];

  // Calculate dynamic weighted scores for current option
  const calculateScores = (opt: DecisionOption) => {
    const prosScore = opt.pros.reduce((acc, p) => acc + (p.userWeight ?? p.weight), 0);
    const consScore = opt.cons.reduce((acc, c) => acc + (c.userWeight ?? c.weight), 0);
    const netScore = prosScore - consScore;
    return { prosScore, consScore, netScore };
  };

  const handleWeightChange = (type: 'pro' | 'con', itemId: string, newWeight: number) => {
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      if (type === 'pro') {
        return {
          ...opt,
          pros: opt.pros.map((p) => (p.id === itemId ? { ...p, userWeight: newWeight } : p)),
        };
      } else {
        return {
          ...opt,
          cons: opt.cons.map((c) => (c.id === itemId ? { ...c, userWeight: newWeight } : c)),
        };
      }
    });
    onUpdateOptions(updated);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newId = 'custom_' + Date.now();
    const updated = options.map((opt) => {
      if (opt.id !== currentOption.id) return opt;
      if (newType === 'pro') {
        const newPro: ProItem = {
          id: newId,
          text: newItemText.trim(),
          detail: newItemDetail.trim() || 'User-added consideration',
          category: newItemCategory,
          weight: newItemWeight,
          userWeight: newItemWeight,
        };
        return { ...opt, pros: [newPro, ...opt.pros] };
      } else {
        const newCon: ConItem = {
          id: newId,
          text: newItemText.trim(),
          detail: newItemDetail.trim() || 'User-added consideration',
          category: newItemCategory,
          weight: newItemWeight,
          userWeight: newItemWeight,
          mitigation: newItemMitigation.trim() || 'Monitor closely and establish risk mitigation protocols.',
        };
        return { ...opt, cons: [newCon, ...opt.cons] };
      }
    });

    onUpdateOptions(updated);
    setShowAddModal(false);
    setNewItemText('');
    setNewItemDetail('');
    setNewItemMitigation('');
    setNewItemWeight(3);
  };

  const filteredPros = currentOption.pros.filter(
    (p) => selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const filteredCons = currentOption.cons.filter(
    (c) => selectedCategory === 'All' || c.category.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  const { prosScore, consScore, netScore } = calculateScores(currentOption);

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs & Scores Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-slate-900/80 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {options.map((opt, idx) => {
            const scores = calculateScores(opt);
            const isSelected = opt.id === currentOption.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{String.fromCharCode(65 + idx)}. {opt.name}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {scores.netScore > 0 ? `+${scores.netScore}` : scores.netScore}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 px-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Pros: +{prosScore}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-rose-400 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Cons: -{consScore}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="font-semibold text-slate-200">
            Net Weight:{' '}
            <span className={netScore >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}>
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
          </div>
        </div>
      </div>

      {/* Option Summary & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>{currentOption.name}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl font-editorial mt-0.5">
            {currentOption.summary}
          </p>
        </div>

        {/* Category Filter & Add Item */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-slate-300 focus:outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Factor</span>
          </button>
        </div>
      </div>

      {/* Dual Column Pros & Cons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pros Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 py-1.5 bg-emerald-950/30 border border-emerald-900/40 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Advantages & Upside ({filteredPros.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              Total Weight: +{prosScore}
            </span>
          </div>

          {filteredPros.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No pros found for category "{selectedCategory}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPros.map((pro) => {
                const currentWeight = pro.userWeight ?? pro.weight;
                return (
                  <div
                    key={pro.id}
                    className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-emerald-400">
                            +{currentWeight}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            · {pro.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-200 transition-colors">
                          {pro.text}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                      {pro.detail}
                    </p>

                    {/* Interactive Weight Slider */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-400">
                        <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                        Impact Rating:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleWeightChange('pro', pro.id, w)}
                            className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                              currentWeight === w
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            }`}
                            title={`Set impact weight to ${w}/5`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cons Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 py-1.5 bg-rose-950/30 border border-rose-900/40 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Drawbacks, Risks & Costs ({filteredCons.length})
              </h3>
            </div>
            <span className="text-xs font-semibold text-rose-400 font-mono">
              Total Weight: -{consScore}
            </span>
          </div>

          {filteredCons.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No cons found for category "{selectedCategory}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCons.map((con) => {
                const currentWeight = con.userWeight ?? con.weight;
                return (
                  <div
                    key={con.id}
                    className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-rose-500/30 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-rose-400">
                            -{currentWeight}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            · {con.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-rose-200 transition-colors">
                          {con.text}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-editorial leading-relaxed">
                      {con.detail}
                    </p>

                    {/* Mitigation Plan Box */}
                    {con.mitigation && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-200 text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-[11px] text-amber-400 mb-0.5">
                          <Wrench className="w-3 h-3" />
                          <span>Tiebreaker Mitigation:</span>
                        </div>
                        <p className="font-editorial text-[11px] text-amber-200/90 leading-normal">
                          {con.mitigation}
                        </p>
                      </div>
                    )}

                    {/* Interactive Weight Slider */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-400">
                        <SlidersHorizontal className="w-3 h-3 text-rose-400" />
                        Severity Rating:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleWeightChange('con', con.id, w)}
                            className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                              currentWeight === w
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            }`}
                            title={`Set severity weight to ${w}/5`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Factor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                Add Custom Factor to {currentOption.name}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Type of Factor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('pro')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      newType === 'pro'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Advantage (Pro)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('con')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      newType === 'con'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Risk / Cost (Con)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Headline <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="e.g. Requires a 45-minute longer commute"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Details / Context
                </label>
                <textarea
                  rows={2}
                  value={newItemDetail}
                  onChange={(e) => setNewItemDetail(e.target.value)}
                  placeholder="Additional context or notes..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {newType === 'con' && (
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Mitigation Idea (How will you handle this?)
                  </label>
                  <input
                    type="text"
                    value={newItemMitigation}
                    onChange={(e) => setNewItemMitigation(e.target.value)}
                    placeholder="e.g. Listen to audiobooks or take the commuter train to work"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Career & Growth">Career & Growth</option>
                    <option value="Financial">Financial</option>
                    <option value="Well-being & Life">Well-being & Life</option>
                    <option value="Risk & Security">Risk & Security</option>
                    <option value="Strategic">Strategic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Weight (1 to 5)
                  </label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewItemWeight(num)}
                        className={`flex-1 py-1 text-xs font-bold rounded ${
                          newItemWeight === num
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
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
                  Add Factor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
