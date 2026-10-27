import React, { useState } from 'react';
import { ROADMAP_DAYS } from '../data/roadmapData';
import { ChevronDown, ChevronUp, RotateCw, Play, Pause, Layers, BookCheck } from 'lucide-react';

interface BottomDockProps {
  selectedDayId: number | null;
  onSelectDay: (dayId: number) => void;
  onResetOverview: () => void;
  isAutoOrbiting: boolean;
  onToggleAutoOrbit: () => void;
  completedDays: number[];
  onOpenStudyNotes: (dayId: number) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  selectedDayId,
  onSelectDay,
  onResetOverview,
  isAutoOrbiting,
  onToggleAutoOrbit,
  completedDays,
  onOpenStudyNotes,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="fixed z-30 transition-all duration-300 ease-out select-none"
      style={{
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'min(960px, 95vw)',
        width: 'max-content',
      }}
    >
      {/* Collapse / Expand Toggle Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#1a122e] hover:bg-[#251a42] text-slate-300 border-t border-x border-purple-500/30 rounded-t-lg text-[11px] font-medium shadow-md transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Show Roadmap Dock</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
              <span>Hide Dock (Cinema Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!isCollapsed && (
        <div className="bg-[#140e24] border border-purple-500/30 rounded-2xl p-2 md:p-2.5 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          {/* Overview Button */}
          <button
            onClick={onResetOverview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDayId === null
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#21163a] hover:bg-[#2e1f50] text-slate-300 border border-purple-500/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <div className="h-5 w-px bg-purple-500/20 hidden sm:block" />

          {/* 5 Stages Navigation Pills */}
          <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto py-0.5">
            {ROADMAP_DAYS.map((day) => {
              const isSelected = selectedDayId === day.dayId;
              const isCompleted = completedDays.includes(day.dayId);
              const isTeal = day.theme === 'teal';

              return (
                <button
                  key={day.dayId}
                  onClick={() => onSelectDay(day.dayId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? isTeal
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/30 ring-2 ring-teal-300'
                        : 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30 ring-2 ring-purple-300'
                      : isTeal
                      ? 'bg-[#0f2928] hover:bg-[#133d3b] text-teal-200 border border-teal-500/30'
                      : 'bg-[#22133b] hover:bg-[#321c56] text-purple-200 border border-purple-500/30'
                  }`}
                >
                  {isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Completed" />
                  )}
                  <span>{day.dayNumber}</span>
                  <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
                    {day.unitTitle.split(':')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-purple-500/20 hidden sm:block" />

          {/* Controls: Auto-orbit toggle & Inspect Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleAutoOrbit}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isAutoOrbiting
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  : 'bg-[#21163a] text-slate-400 hover:text-slate-200 border border-purple-500/20'
              }`}
              title={isAutoOrbiting ? 'Pause 3D slow camera orbit' : 'Resume 3D camera orbit'}
            >
              {isAutoOrbiting ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Orbiting</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Auto-Orbit</span>
                </>
              )}
            </button>

            {selectedDayId !== null && (
              <button
                onClick={() => onOpenStudyNotes(selectedDayId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                <BookCheck className="w-3.5 h-3.5" />
                <span>Study Notes</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
