import React, { useState } from 'react';
import { DayData } from '../types/roadmap';
import confetti from 'canvas-confetti';
import { sounds } from '../audio/soundEffects';
import {
  X,
  CheckCircle,
  Circle,
  Copy,
  Check,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  ExternalLink,
  Code2,
} from 'lucide-react';

interface IslandDetailModalProps {
  dayData: DayData;
  onClose: () => void;
  onNavigateDay: (dayId: number) => void;
  completedTopics: string[];
  onToggleTopic: (topicId: string) => void;
  onMarkDayComplete: (dayId: number) => void;
  isDayCompleted: boolean;
}

export const IslandDetailModal: React.FC<IslandDetailModalProps> = ({
  dayData,
  onClose,
  onNavigateDay,
  completedTopics,
  onToggleTopic,
  onMarkDayComplete,
  isDayCompleted,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedQuestions, setRevealedQuestions] = useState<number[]>([]);
  const isTeal = dayData.theme === 'teal';

  const handleCopyCode = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    sounds.playButtonTap();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleReveal = (idx: number) => {
    sounds.playButtonTap();
    setRevealedQuestions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCelebrateCompletion = () => {
    sounds.playCompleteCheckmark();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: isTeal ? ['#14b8a6', '#5eead4', '#fef08a'] : ['#a855f7', '#c084fc', '#facc15'],
    });
    onMarkDayComplete(dayData.dayId);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-none animate-fadeIn select-none">
      <div
        className="relative w-full max-w-2xl max-h-[88vh] bg-[#151024] border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        style={{
          borderTopColor: isTeal ? '#2dd4bf' : '#c084fc',
        }}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 bg-[#1c1433] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                isTeal
                  ? 'bg-teal-900/60 text-teal-300 border border-teal-500/40'
                  : 'bg-purple-900/60 text-purple-300 border border-purple-500/40'
              }`}
            >
              {dayData.dayNumber}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {dayData.unitTitle}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-1">{dayData.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCelebrateCompletion}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isDayCompleted
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : isTeal
                  ? 'bg-teal-600 hover:bg-teal-500 text-slate-950 shadow-md'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{isDayCompleted ? 'Mastered ★' : 'Mark Done'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-slate-400 hover:text-white border border-purple-500/20 transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          {/* Quick Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-[#1d1633] border border-purple-500/20 text-slate-300 text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-purple-300">Stage Brief: </span>
            {dayData.quickSummary}
          </div>

          {/* Floating Key Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <span>Key Concept Takeaways</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dayData.keyHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#18112c] border border-purple-500/15 flex items-start gap-2 text-xs text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Topic List & Code Examples */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Syllabus Topics & Interactive Notes</span>
              <span className="text-[11px] text-purple-400 font-mono">
                Click circle to check off
              </span>
            </h3>

            <div className="space-y-3">
              {dayData.topics.map((topic) => {
                const isTopicDone = completedTopics.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className={`rounded-2xl border transition-all ${
                      isTopicDone
                        ? 'bg-[#121c29]/70 border-emerald-500/30'
                        : 'bg-[#18112e] border-purple-500/20 hover:border-purple-500/40'
                    } p-3.5 sm:p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => {
                          sounds.playButtonTap();
                          onToggleTopic(topic.id);
                        }}
                        className="mt-0.5 text-purple-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                        title={isTopicDone ? 'Mark as incomplete' : 'Mark topic as understood'}
                      >
                        {isTopicDone ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`font-semibold text-sm ${
                              isTopicDone ? 'text-emerald-200 line-through' : 'text-slate-100'
                            }`}
                          >
                            {topic.title}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-300 leading-normal">{topic.description}</p>

                        {/* Code Snippet Box */}
                        {topic.codeSnippet && (
                          <div className="rounded-xl bg-[#0d091a] border border-purple-500/20 overflow-hidden text-xs font-mono mt-2">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-[#17102b] border-b border-purple-500/20 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                                <span>python</span>
                              </span>
                              <button
                                onClick={() => handleCopyCode(topic.codeSnippet!, topic.id)}
                                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === topic.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 overflow-x-auto text-purple-200 text-[11px] leading-relaxed">
                              {topic.codeSnippet}
                            </pre>
                          </div>
                        )}

                        {/* Exam Tip Alert */}
                        {topic.examTip && (
                          <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-amber-300">Exam Trap: </span>
                              <span>{topic.examTip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Yield Past Exam Questions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>High-Yield End-Sem University Questions</span>
            </h3>

            <div className="space-y-2.5">
              {dayData.highYieldExamQuestions.map((q, idx) => {
                const isRevealed = revealedQuestions.includes(idx);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#17102e] border border-purple-500/20"
                  >
                    <div className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                      <div className="font-semibold text-slate-200">
                        Q{idx + 1}: {q.question}
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30 shrink-0">
                        {q.marks} Marks
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleReveal(idx)}
                      className="mt-2 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isRevealed ? 'Hide Model Answer' : 'Show Model Answer'}</span>
                    </button>

                    {isRevealed && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#0f091f] border border-purple-500/20 text-xs text-slate-300 font-mono leading-relaxed">
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="p-3 sm:p-4 border-t border-purple-500/20 bg-[#160f2b] flex items-center justify-between gap-3">
          <button
            onClick={() => onNavigateDay(Math.max(1, dayData.dayId - 1))}
            disabled={dayData.dayId <= 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#21163a] hover:bg-[#2e1f50] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev Stage</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Stage {dayData.dayId} of 5
          </span>

          <button
            onClick={() => onNavigateDay(Math.min(5, dayData.dayId + 1))}
            disabled={dayData.dayId >= 5}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition-colors cursor-pointer shadow-md"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
