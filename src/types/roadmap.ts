export interface TopicItem {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  examTip?: string;
  completed?: boolean;
}

export interface DayData {
  dayId: number; // 1 to 5 representing stages (Day 1, Days 2-3, Days 4-5, Day 6, Day 7)
  dayNumber: string; // e.g. "Day 1", "Days 2-3"
  unitTitle: string; // "Unit I", "Unit II", etc.
  theme: 'purple' | 'teal';
  subtitle: string;
  colorHex: string;
  islandPosition: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  keyHighlights: string[];
  floatingLabels: string[];
  topics: TopicItem[];
  highYieldExamQuestions: {
    question: string;
    answer: string;
    marks: number;
  }[];
  quickSummary: string;
}

export interface SceneInteractionState {
  selectedDayId: number | null;
  hoveredIslandId: number | null;
  isOrbiting: boolean;
  soundEnabled: boolean;
  activePathProgress: number; // 1 to 5 indicating how far the glowing path has illuminated
  completedDays: number[];
}
