// ─── App-wide type definitions ─────────────────────────────────

// A tracked app that can be blocked or allowed
export type TrackedApp = {
  id: string;
  packageName: string;
  name: string;
  icon: string | null;
  category: AppCategory;
  isBlocked: boolean;
  dailyLimit: number | null; // minutes, null = no limit
  isWhitelisted: boolean; // allowed during study mode
};

export type AppCategory =
  | 'social'
  | 'entertainment'
  | 'productivity'
  | 'communication'
  | 'study'
  | 'utilities'
  | 'other';

// A daily habit that must be completed to unlock apps
export type Habit = {
  id: string;
  name: string;
  description: string;
  target: number; // target count (e.g., 30 minutes, 1 session)
  unit: 'minutes' | 'sessions' | 'times';
  completed: number; // current progress
  isCompleted: boolean;
  streak: number; // consecutive days completed
  bestStreak: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string; // personal color choice
  emoji: string; // user's chosen emoji, NOT a default
};

// A study session
export type StudySession = {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number; // actual minutes
  targetDuration: number; // planned minutes
  wasCompleted: boolean;
  distractionsBlocked: number; // how many app-open attempts were blocked
};

// Usage data for a single app on a single day
export type AppUsageEntry = {
  packageName: string;
  appName: string;
  category: AppCategory;
  timeSpent: number; // minutes
  opens: number;
  date: string; // YYYY-MM-DD
};

// Daily summary
export type DailySummary = {
  date: string;
  totalScreenTime: number; // minutes
  studyTime: number; // minutes
  habitsCompleted: number;
  totalHabits: number;
  focusScore: number; // 0-100
  distractionsBlocked: number;
};

// Emergency unlock attempt
export type EmergencyUnlock = {
  id: string;
  timestamp: number;
  problem: string;
  answer: number;
  userAnswer: number | null;
  wasCorrect: boolean;
  wasUsed: boolean;
};

// Physical activity goal for unlock
export type ActivityGoal = {
  type: 'steps' | 'activeMinutes' | 'activeCalories';
  target: number;
  current: number;
  unit: string;
};

// Settings
export type Settings = {
  // Study mode
  defaultStudyDuration: number; // minutes
  autoStartBreaks: boolean;
  breakDuration: number; // minutes
  blockedApps: string[]; // package names
  whitelistedApps: string[]; // package names allowed during study
  blockNotifications: boolean;
  blockWebsites: boolean;
  blockedWebsites: string[];

  // Emergency unlock
  maxEmergencyUnlocksPerDay: number;
  mathProblemDifficulty: 'easy' | 'medium' | 'hard';
  requirePhysicalActivity: boolean;
  activityGoal: ActivityGoal;

  // Habit-based unlocking
  enableHabitUnlock: boolean;
  requiredHabitsForUnlock: number; // how many habits must be completed

  // General
  darkMode: 'auto' | 'light' | 'dark';
  notificationsEnabled: boolean;
  studyReminders: boolean;
  reminderTimes: string[]; // HH:MM format
  motivationalQuotes: boolean;
  quoteFrequency: number; // minutes between quotes
  lastEmergencyReset: number; // timestamp of last daily reset
};

// Store state
export type RootStore = {
  // Data
  trackedApps: TrackedApp[];
  habits: Habit[];
  studySessions: StudySession[];
  usageHistory: AppUsageEntry[];
  dailySummaries: DailySummary[];
  emergencyUnlocks: EmergencyUnlock[];
  settings: Settings;

  // Runtime state
  isStudyModeActive: boolean;
  currentStudySession: StudySession | null;
  isBlocked: boolean;
  blockedAppPackageName: string | null;
  emergencyUnlocksUsedToday: number;

  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completed' | 'isCompleted'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  completeHabit: (id: string, amount?: number) => void;
  resetHabits: () => void;
  startStudySession: (duration: number) => void;
  endStudySession: (completed: boolean) => void;
  blockApp: (packageName: string) => void;
  unblockApp: (packageName: string) => void;
  setStudyMode: (active: boolean) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  recordEmergencyUnlock: (unlock: EmergencyUnlock) => void;
  resetDailyEmergencyUnlocks: () => void;
  addUsageEntry: (entry: AppUsageEntry) => void;
  updateActivityGoal: (current: number) => void;
};
