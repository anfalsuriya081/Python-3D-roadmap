import React from 'react';
import { X, MousePointerClick, RotateCw, ZoomIn, Keyboard } from 'lucide-react';

interface NavHelpModalProps {
  onClose: () => void;
}

export const NavHelpModal: React.FC<NavHelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-[#161026] border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>3D Controls & Navigation</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#1d1633] border border-purple-500/15">
            <MousePointerClick className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-200">Click any Island: </span>
              <span className="text-slate-300">
                Smoothly zooms camera into that day, activates the glowing path, and opens the syllabus topic notes.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#1d1633] border border-purple-500/15">
            <RotateCw className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-teal-200">Drag to Orbit: </span>
              <span className="text-slate-300">
                Left-click and drag (or touch swipe) to rotate around the floating archipelago.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#1d1633] border border-purple-500/15">
            <ZoomIn className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-200">Scroll to Zoom: </span>
              <span className="text-slate-300">
                Use mouse wheel or pinch gesture to zoom in and out of props.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#1d1633] border border-purple-500/15">
            <Keyboard className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-indigo-200">Keyboard Shortcuts:</span>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-300">
                <div><kbd className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/30 rounded">1 - 5</kbd> Jump to Day</div>
                <div><kbd className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/30 rounded">Space</kbd> Orbit toggle</div>
                <div><kbd className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/30 rounded">0 / Esc</kbd> Overview</div>
                <div><kbd className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/30 rounded">H</kbd> Hide Dock</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Got it! Explore the Roadmap
        </button>
      </div>
    </div>
  );
};
