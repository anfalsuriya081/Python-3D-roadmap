import React from 'react';
import { Compass, BookOpen, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderBarProps {
  completedTopicsCount: number;
  totalTopicsCount: number;
  onOpenCheatSheet: () => void;
  onOpenHelp: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetOverview: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  completedTopicsCount,
  totalTopicsCount,
  onOpenCheatSheet,
  onOpenHelp,
  soundEnabled,
  onToggleSound,
  onResetOverview,
}) => {
  const progressPercent = Math.round((completedTopicsCount / Math.max(totalTopicsCount, 1)) * 100);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 md:p-4 flex items-center justify-between">
      {/* Title & Roadmap Badge */}
      <div className="pointer-events-auto flex items-center gap-3 bg-[#1e1533]/90 border border-purple-500/30 rounded-xl px-3.5 py-2.5 shadow-lg backdrop-blur-none">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-amber-300 shadow-md">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-base font-bold tracking-tight text-white font-sans">
              Python End-Sem Roadmap
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30">
              7-Day Plan
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Floating archipelago of 5 study stages • Unit I to Final Revision
          </p>
        </div>
      </div>

      {/* Right Actions: Progress Meter & Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Progress Tracker Widget */}
        <div className="hidden sm:flex items-center gap-2.5 bg-[#17132a]/90 border border-purple-500/20 rounded-xl px-3 py-1.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-slate-300 font-medium">Exam Readiness</span>
              <span className="text-teal-300 font-bold font-mono">{progressPercent}%</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cheat Sheet Shortcut */}
        <button
          onClick={onOpenCheatSheet}
          className="flex items-center gap-1.5 bg-teal-950/80 hover:bg-teal-900 text-teal-200 border border-teal-500/40 px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
          title="Open 1-Page Cheat Sheet"
        >
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden md:inline">1-Page</span> Cheat Sheet
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl bg-[#1e1533]/90 hover:bg-[#2b1f48] text-slate-300 border border-purple-500/20 shadow-md transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute procedural audio' : 'Enable procedural audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Reset Camera View */}
        <button
          onClick={onResetOverview}
          className="p-2 rounded-xl bg-[#1e1533]/90 hover:bg-[#2b1f48] text-slate-300 border border-purple-500/20 shadow-md transition-colors cursor-pointer"
          title="Overview View"
        >
          <Compass className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </header>
  );
};
