import React, { useState } from 'react';
import { FULL_CHEAT_SHEET_CONTENT } from '../data/roadmapData';
import { X, Copy, Check, Printer, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface CheatSheetModalProps {
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    sounds.playButtonTap();
    let text = `${FULL_CHEAT_SHEET_CONTENT.title}\n${FULL_CHEAT_SHEET_CONTENT.subtitle}\n\n`;
    FULL_CHEAT_SHEET_CONTENT.sections.forEach((sec) => {
      text += `=== ${sec.category} ===\n`;
      sec.items.forEach((it) => {
        text += `• ${it.label}: ${it.text}\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    sounds.playButtonTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-none animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#140f24] border border-teal-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-teal-500/30 bg-[#0e302e] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-teal-100 tracking-tight">
                {FULL_CHEAT_SHEET_CONTENT.title}
              </h2>
              <p className="text-xs text-teal-300/80">
                {FULL_CHEAT_SHEET_CONTENT.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied All' : 'Copy All'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 border border-teal-500/30 transition-colors cursor-pointer"
              title="Print Cheat Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-teal-950/40 hover:bg-teal-900 text-slate-400 hover:text-white border border-teal-500/20 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Matrix */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FULL_CHEAT_SHEET_CONTENT.sections.map((section, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#17112b] border border-teal-500/20 space-y-2.5"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-teal-500/20 pb-1.5">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itIdx) => (
                    <div key={itIdx} className="text-xs">
                      <span className="font-semibold text-purple-300 font-mono">
                        {item.label}:{' '}
                      </span>
                      <span className="text-slate-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-center text-xs text-teal-200 font-medium">
            ★ Located on the Day 7 Summit Pedestal in the 3D scene • Memorize before entering the exam hall!
          </div>
        </div>
      </div>
    </div>
  );
};
