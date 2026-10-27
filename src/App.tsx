import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RoadmapScene } from './three/RoadmapScene';
import { ROADMAP_DAYS } from './data/roadmapData';
import { HeaderBar } from './components/HeaderBar';
import { BottomDock } from './components/BottomDock';
import { IslandDetailModal } from './components/IslandDetailModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { NavHelpModal } from './components/NavHelpModal';
import { sounds } from './audio/soundEffects';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoadmapScene | null>(null);

  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [hoveredDayId, setHoveredDayId] = useState<number | null>(null);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAutoOrbiting, setIsAutoOrbiting] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // LocalStorage persisted state for topic checkmarks and completed stages
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('py_roadmap_topics');
      return saved ? JSON.parse(saved) : ['u1-1', 'u1-2'];
    } catch {
      return ['u1-1', 'u1-2'];
    }
  });

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('py_roadmap_days');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate total topic count
  const totalTopicsCount = ROADMAP_DAYS.reduce((sum, d) => sum + d.topics.length, 0);

  // Callbacks ref to avoid recreating Three.js scene on React re-renders
  const callbacksRef = useRef({
    onSelectDay: (dayId: number) => {
      setSelectedDayId(dayId);
      setIsStudyModalOpen(true);
    },
    onHoverIsland: (dayId: number | null) => {
      setHoveredDayId(dayId);
    },
  });

  useEffect(() => {
    callbacksRef.current = {
      onSelectDay: (dayId: number) => {
        setSelectedDayId(dayId);
        setIsStudyModalOpen(true);
      },
      onHoverIsland: (dayId: number | null) => {
        setHoveredDayId(dayId);
      },
    };
  });

  // Initialize Three.js scene once on mount
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new RoadmapScene(mountRef.current, {
      onSelectDay: (id) => callbacksRef.current.onSelectDay(id),
      onHoverIsland: (id) => callbacksRef.current.onHoverIsland(id),
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Sync auto-orbit state with scene
  const handleToggleAutoOrbit = useCallback(() => {
    sounds.playButtonTap();
    if (sceneRef.current) {
      sceneRef.current.toggleAutoOrbit();
      setIsAutoOrbiting(sceneRef.current.getAutoOrbit());
    }
  }, []);

  const handleSelectDay = useCallback((dayId: number) => {
    setSelectedDayId(dayId);
    setIsStudyModalOpen(true);
    if (sceneRef.current) {
      sceneRef.current.selectDay(dayId);
      setIsAutoOrbiting(false);
    }
  }, []);

  const handleResetOverview = useCallback(() => {
    sounds.playButtonTap();
    setSelectedDayId(null);
    setIsStudyModalOpen(false);
    if (sceneRef.current) {
      sceneRef.current.resetToOverview();
      setIsAutoOrbiting(true);
    }
  }, []);

  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playButtonTap();
  }, [soundEnabled]);

  const handleToggleTopic = useCallback((topicId: string) => {
    setCompletedTopics((prev) => {
      const next = prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];
      try {
        localStorage.setItem('py_roadmap_topics', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleMarkDayComplete = useCallback((dayId: number) => {
    setCompletedDays((prev) => {
      const next = prev.includes(dayId) ? prev : [...prev, dayId];
      try {
        localStorage.setItem('py_roadmap_days', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '1' && e.key <= '5') {
        const id = parseInt(e.key, 10);
        handleSelectDay(id);
      } else if (e.key === '0' || e.key === 'Escape') {
        if (isStudyModalOpen) {
          setIsStudyModalOpen(false);
        } else if (isCheatSheetOpen) {
          setIsCheatSheetOpen(false);
        } else if (isHelpOpen) {
          setIsHelpOpen(false);
        } else {
          handleResetOverview();
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleToggleAutoOrbit();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleSelectDay,
    handleResetOverview,
    handleToggleAutoOrbit,
    isStudyModalOpen,
    isCheatSheetOpen,
    isHelpOpen,
  ]);

  const currentDayData = ROADMAP_DAYS.find((d) => d.dayId === selectedDayId);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#12101e] font-sans">
      {/* 1. Full-screen WebGL 3D Canvas Mount (Outside React UI to avoid re-renders) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing" />

      {/* 2. Top Header Navigation Bar */}
      <HeaderBar
        completedTopicsCount={completedTopics.length}
        totalTopicsCount={totalTopicsCount}
        onOpenCheatSheet={() => {
          sounds.playButtonTap();
          setIsCheatSheetOpen(true);
        }}
        onOpenHelp={() => {
          sounds.playButtonTap();
          setIsHelpOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetOverview={handleResetOverview}
      />

      {/* 3. Floating Hover Tooltip over Canvas */}
      {hoveredDayId && !selectedDayId && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#1e1338]/95 border border-purple-500/40 rounded-xl px-3 py-1.5 shadow-xl text-center">
          <p className="text-xs font-bold text-white">
            {ROADMAP_DAYS.find((d) => d.dayId === hoveredDayId)?.dayNumber} :{' '}
            {ROADMAP_DAYS.find((d) => d.dayId === hoveredDayId)?.unitTitle.split(':')[0]}
          </p>
          <p className="text-[11px] text-purple-300">Click to fly in and explore syllabus</p>
        </div>
      )}

      {/* 4. Collapsible Ergonomic Bottom Dock (Zero Center Viewport Occlusion) */}
      <BottomDock
        selectedDayId={selectedDayId}
        onSelectDay={handleSelectDay}
        onResetOverview={handleResetOverview}
        isAutoOrbiting={isAutoOrbiting}
        onToggleAutoOrbit={handleToggleAutoOrbit}
        completedDays={completedDays}
        onOpenStudyNotes={(dayId) => {
          sounds.playButtonTap();
          setSelectedDayId(dayId);
          setIsStudyModalOpen(true);
        }}
      />

      {/* 5. Island Detail / Study Notes Modal */}
      {isStudyModalOpen && currentDayData && (
        <IslandDetailModal
          dayData={currentDayData}
          onClose={() => setIsStudyModalOpen(false)}
          onNavigateDay={(newDayId) => handleSelectDay(newDayId)}
          completedTopics={completedTopics}
          onToggleTopic={handleToggleTopic}
          onMarkDayComplete={handleMarkDayComplete}
          isDayCompleted={completedDays.includes(currentDayData.dayId)}
        />
      )}

      {/* 6. Cheat Sheet Modal */}
      {isCheatSheetOpen && (
        <CheatSheetModal onClose={() => setIsCheatSheetOpen(false)} />
      )}

      {/* 7. Navigation Help Modal */}
      {isHelpOpen && <NavHelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
