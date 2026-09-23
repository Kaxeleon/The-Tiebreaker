import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Sliders, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';
import { PRESET_DECISIONS, DecisionPreset } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (formData: {
    decisionTitle: string;
    description: string;
    options: string[];
    priorities: string[];
    urgency: string;
    riskTolerance: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const COMMON_PRIORITIES = [
  'Financial Upside',
  'Work-Life Balance',
  'Career & Skill Growth',
  'Emotional Peace & Low Stress',
  'Autonomy & Freedom',
  'Family & Relationships',
  'Downside Risk Protection',
  'Speed & Momentum',
  'Long-Term Reversibility',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({ onSubmit, isLoading }) => {
  const [decisionTitle, setDecisionTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Option A: Accept the new path / Say Yes',
    'Option B: Stay with current path / Say No',
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Financial Upside',
    'Work-Life Balance',
    'Long-Term Reversibility',
  ]);
  const [customPriority, setCustomPriority] = useState('');
  const [urgency, setUrgency] = useState('Within 1 to 2 weeks');
  const [riskTolerance, setRiskTolerance] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  const handleAddCustomPriority = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customPriority.trim()) {
      e.preventDefault();
      if (!selectedPriorities.includes(customPriority.trim())) {
        setSelectedPriorities([...selectedPriorities, customPriority.trim()]);
      }
      setCustomPriority('');
    }
  };

  const applyPreset = (preset: DecisionPreset) => {
    setDecisionTitle(preset.title);
    setDescription(preset.description);
    setOptions(preset.options);
    setSelectedPriorities(preset.priorities);
    setUrgency(preset.urgency);
    setRiskTolerance(preset.riskTolerance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTitle.trim()) return;

    onSubmit({
      decisionTitle: decisionTitle.trim(),
      description: description.trim(),
      options: options.map((o) => o.trim()).filter(Boolean),
      priorities: selectedPriorities,
      urgency,
      riskTolerance,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Editorial Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cut through the noise & break decision paralysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 font-display">
          What is your decision dilemma?
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-editorial">
          Provide the crossroads you're standing at. The Tiebreaker will build a rigorous pros & cons matrix,
          comparative score breakdown, SWOT analysis, and a definitive verdict.
        </p>
      </div>

      {/* Curated Presets Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Example Dilemmas
          </span>
          <span className="text-xs text-slate-500">Click to load</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_DECISIONS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="group-hover:text-amber-300 transition-colors font-medium">
                  {preset.category}
                </span>
                <span className="text-slate-500 text-[10px]">{preset.options.length} options</span>
              </div>
              <p className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-white">
                {preset.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40">
        {/* Core Decision Title */}
        <div>
          <label htmlFor="decisionTitle" className="block text-sm font-semibold text-slate-200 mb-2">
            The Central Decision <span className="text-amber-400">*</span>
          </label>
          <input
            id="decisionTitle"
            type="text"
            required
            value={decisionTitle}
            onChange={(e) => setDecisionTitle(e.target.value)}
            placeholder="e.g. Should I accept the startup offer vs stay at my stable corporate role?"
            className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all text-sm sm:text-base font-medium"
          />
        </div>

        {/* Options to compare */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-200">
              Options to Evaluate & Compare
            </label>
            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Option ({options.length}/5)
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <input
                  type="text"
                  required
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)} name`}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Optional Context */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
            <span>Context, Stakes, & Key Numbers <span className="text-slate-500 font-normal text-xs">(Optional)</span></span>
            <span className="text-slate-500 text-xs font-normal">Salary, locations, dates, gut worries</span>
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Salary difference is $30k. Commute would increase by 25 minutes. Spouse is supportive but worried about burnout. If I fail at the startup, could I return to my old field within 6 months?"
            className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm resize-none"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Priorities, Urgency & Risk Tolerance
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 pt-2 border-t border-slate-800/60">
              {/* Priorities Tag Cloud */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2">
                  What matters most in this decision? (Select relevant priorities)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_PRIORITIES.map((priority) => {
                    const isSelected = selectedPriorities.includes(priority);
                    return (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => togglePriority(priority)}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {priority}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value)}
                    onKeyDown={handleAddCustomPriority}
                    placeholder="Add custom priority (press Enter)..."
                    className="w-full sm:w-64 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Urgency & Risk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="urgencySelect" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Timeline Urgency
                  </label>
                  <select
                    id="urgencySelect"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Urgent (Today / 24-48 Hours)">Urgent (Today / 24-48 Hours)</option>
                    <option value="Within 1 to 2 weeks">Within 1 to 2 weeks</option>
                    <option value="This Month">This Month</option>
                    <option value="Long-Term Planning (Months/Years)">Long-Term Planning (Months/Years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Personal Risk Tolerance
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Low', 'Moderate', 'High'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setRiskTolerance(level)}
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          riskTolerance === level
                            ? 'bg-amber-400 text-slate-950 font-semibold border-amber-400 shadow-sm'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !decisionTitle.trim()}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isLoading || !decisionTitle.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Weighing Tradeoffs & Building Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Tiebreaker Analysis</span>
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Builds Pros & Cons, Multi-Criteria Matrix, SWOT, and Decisive Verdict
          </p>
        </div>
      </form>
    </div>
  );
};
