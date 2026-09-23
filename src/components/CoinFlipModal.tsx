import React, { useState } from 'react';
import { X, RotateCcw, Heart, Sparkles, Coins } from 'lucide-react';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultOptionA?: string;
  defaultOptionB?: string;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  isOpen,
  onClose,
  defaultOptionA = 'Option A',
  defaultOptionB = 'Option B',
}) => {
  const [optionA, setOptionA] = useState(defaultOptionA);
  const [optionB, setOptionB] = useState(defaultOptionB);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipsCount, setFlipsCount] = useState(0);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    // Random outcome after 1.8 seconds of spin
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
      setFlipsCount((c) => c + 1);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-6 shadow-2xl relative text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5" />
            <span>Behavioral Psychology Hack</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 font-display">
            The Gut-Check Coin Flip
          </h3>
          <p className="text-xs text-slate-400 font-editorial">
            Freud's famous tiebreaker: While the coin is in the air, notice what your intuition is secretly hoping for.
          </p>
        </div>

        {/* Option Mapping */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Heads (Face)
            </span>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="First choice"
              className="w-full text-xs bg-transparent border-b border-slate-700 pb-0.5 text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tails (Cross)
            </span>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Second choice"
              className="w-full text-xs bg-transparent border-b border-slate-700 pb-0.5 text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>
        </div>

        {/* Coin Visual */}
        <div className="py-4 flex flex-col items-center justify-center">
          <div
            onClick={handleFlip}
            className={`w-28 h-28 rounded-full border-4 border-amber-400/80 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 flex items-center justify-center shadow-xl shadow-amber-500/20 cursor-pointer select-none transition-transform duration-300 ${
              isFlipping ? 'animate-spin scale-110' : 'hover:scale-105 active:scale-95'
            }`}
          >
            <div className="w-24 h-24 rounded-full border-2 border-amber-300/40 bg-slate-950 flex flex-col items-center justify-center text-center p-2">
              {isFlipping ? (
                <span className="text-xs font-mono font-bold text-amber-300 animate-pulse">
                  Spinning...
                </span>
              ) : result ? (
                <div>
                  <span className="text-xl font-black font-display text-amber-300 uppercase">
                    {result}
                  </span>
                </div>
              ) : (
                <div>
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                  <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                    Click to Flip
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Psychology Prompt while spinning or landed */}
          {isFlipping && (
            <p className="mt-4 text-xs font-serif italic text-amber-300 animate-bounce">
              "Quick! What result are you wishing for right now in your chest?"
            </p>
          )}

          {result && !isFlipping && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
              <div className="text-xs font-semibold text-slate-400">
                Landed on <span className="text-amber-400 font-bold uppercase">{result}</span>:
              </div>
              <div className="text-sm font-bold text-white font-display">
                {result === 'heads' ? optionA : optionB}
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 font-editorial space-y-1">
                <p>
                  Did this result make you feel <span className="text-emerald-400 font-bold">Relief</span> or{' '}
                  <span className="text-rose-400 font-bold">Disappointment</span>?
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  If relief: take this path. If disappointment: your gut clearly wants the other option.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Flip button */}
        <div className="flex gap-2">
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{flipsCount === 0 ? 'Toss the Tiebreaker Coin' : 'Flip Again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
