import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStore, Habit, Settings, TrackedApp, StudySession, AppUsageEntry, DailySummary, EmergencyUnlock, ActivityGoal } from '@/types';

// Default settings — carefully chosen to be effective without being punitive
const defaultSettings: Settings = {
  // Study mode
  defaultStudyDuration: 25,
  autoStartBreaks: true,
  breakDuration: 5,
  blockedApps: [],
  whitelistedApps: [],
  blockNotifications: true,
  blockWebsites: false,
  blockedWebsites: [],

  // Emergency unlock
  maxEmergencyUnlocksPerDay: 1,
  mathProblemDifficulty: 'medium',
  requirePhysicalActivity: true,
  activityGoal: {
    type: 'steps',
    target: 500,
    current: 0,
    unit: 'steps',
  },

  // Habit-based unlocking
  enableHabitUnlock: true,
  requiredHabitsForUnlock: 1,

  // General
  darkMode: 'auto',
  notificationsEnabled: true,
  studyReminders: true,
  reminderTimes: ['09:00', '14:00', '19:00'],
  motivationalQuotes: true,
  quoteFrequency: 30,
  lastEmergencyReset: 0,
};

// Default habits — practical, achievable
const defaultHabits: Habit[] = [
  {
    id: 'read-30',
    name: 'Read for 30 minutes',
    description: 'Physical book or e-reader, not phone scrolling',
    target: 30,
    unit: 'minutes',
    completed: 0,
    isCompleted: false,
    streak: 0,
    bestStreak: 0,
    difficulty: 'medium',
    color: '#2D5A3D',
    emoji: '📚',
  },
  {
    id: 'no-phone-bed',
    name: 'No phone in bed',
    description: 'Keep phone out of reach for 30 minutes before sleep',
    target: 1,
    unit: 'times',
    completed: 0,
    isCompleted: false,
    streak: 0,
    bestStreak: 0,
    difficulty: 'hard',
    color: '#C17A62',
    emoji: '��',
  },
  {
    id: 'morning-pages',
    name: 'Write morning pages',
    description: '3 pages of stream-of-consciousness writing',
    target: 1,
    unit: 'times',
    completed: 0,
    isCompleted: false,
    streak: 0,
    bestStreak: 0,
    difficulty: 'easy',
    color: '#D4A373',
    emoji: '✍️',
  },
];

export const useStore = create<RootStore>()(
  persist(
    (set, get) => ({
      // Data
      trackedApps: [],
      habits: defaultHabits,
      studySessions: [],
      usageHistory: [],
      dailySummaries: [],
      emergencyUnlocks: [],
      settings: defaultSettings,

      // Runtime state
      isStudyModeActive: false,
      currentStudySession: null,
      isBlocked: false,
      blockedAppPackageName: null,
      emergencyUnlocksUsedToday: 0,

      // ─── Habit Actions ──────────────────────────────────────
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          completed: 0,
          isCompleted: false,
          streak: 0,
          bestStreak: 0,
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        }));
      },

      completeHabit: (id, amount = 1) => {
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const newCompleted = Math.min(h.target, h.completed + amount);
            const newIsCompleted = newCompleted >= h.target;
            const newStreak = newIsCompleted && !h.isCompleted ? h.streak + 1 : h.streak;
            const newBestStreak = Math.max(h.bestStreak, newStreak);
            return {
              ...h,
              completed: newCompleted,
              isCompleted: newIsCompleted,
              streak: newStreak,
              bestStreak: newBestStreak,
            };
          }),
        }));
      },

      resetHabits: () => {
        set((state) => ({
          habits: state.habits.map((h) => ({
            ...h,
            completed: 0,
            isCompleted: false,
          })),
        }));
      },

      // ─── Study Session Actions ──────────────────────────────
      startStudySession: (duration) => {
        const session: StudySession = {
          id: `session-${Date.now()}`,
          startTime: Date.now(),
          endTime: null,
          duration: 0,
          targetDuration: duration,
          wasCompleted: false,
          distractionsBlocked: 0,
        };
        set({
          isStudyModeActive: true,
          currentStudySession: session,
        });
      },

      endStudySession: (completed) => {
        const { currentStudySession, studySessions } = get();
        if (!currentStudySession) return;

        const endTime = Date.now();
        const durationMs = endTime - currentStudySession.startTime;
        const durationMinutes = Math.floor(durationMs / 60000);

        const completedSession: StudySession = {
          ...currentStudySession,
          endTime,
          duration: durationMinutes,
          wasCompleted: completed,
        };

        set({
          isStudyModeActive: false,
          currentStudySession: null,
          studySessions: [completedSession, ...studySessions],
        });
      },

      // ─── App Blocking Actions ───────────────────────────────
      blockApp: (packageName) => {
        set((state) => ({
          trackedApps: state.trackedApps.map((app) =>
            app.packageName === packageName
              ? { ...app, isBlocked: true }
              : app
          ),
        }));
      },

      unblockApp: (packageName) => {
        set((state) => ({
          trackedApps: state.trackedApps.map((app) =>
            app.packageName === packageName
              ? { ...app, isBlocked: false }
              : app
          ),
        }));
      },

      setStudyMode: (active) => {
        set({ isStudyModeActive: active });
      },

      // ─── Settings Actions ───────────────────────────────────
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // ─── Emergency Unlock Actions ───────────────────────────
      recordEmergencyUnlock: (unlock) => {
        set((state) => ({
          emergencyUnlocks: [unlock, ...state.emergencyUnlocks],
          emergencyUnlocksUsedToday: state.emergencyUnlocksUsedToday + 1,
        }));
      },

      resetDailyEmergencyUnlocks: () => {
        set({ emergencyUnlocksUsedToday: 0 });
      },

      // ─── Usage Tracking Actions ─────────────────────────────
      addUsageEntry: (entry) => {
        set((state) => ({
          usageHistory: [entry, ...state.usageHistory],
        }));
      },

      updateActivityGoal: (current) => {
        set((state) => ({
          settings: {
            ...state.settings,
            activityGoal: {
              ...state.settings.activityGoal,
              current,
            },
          },
        }));
      },
    }),
    {
      name: 'focusbloom-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist data, not runtime state
        trackedApps: state.trackedApps,
        habits: state.habits,
        studySessions: state.studySessions,
        usageHistory: state.usageHistory,
        dailySummaries: state.dailySummaries,
        emergencyUnlocks: state.emergencyUnlocks,
        settings: state.settings,
        emergencyUnlocksUsedToday: state.emergencyUnlocksUsedToday,
      }),
    }
  )
);

// Selectors for common use cases
export const useHabits = () => useStore((state) => state.habits);
export const useStudyMode = () =>
  useStore((state) => ({
    isStudyModeActive: state.isStudyModeActive,
    currentSession: state.currentStudySession,
    startSession: state.startStudySession,
    endSession: state.endStudySession,
    setStudyMode: state.setStudyMode,
  }));
export const useSettings = () =>
  useStore((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));
export const useEmergencyUnlock = () =>
  useStore((state) => ({
    usedToday: state.emergencyUnlocksUsedToday,
    maxPerDay: state.settings.maxEmergencyUnlocksPerDay,
    recordUnlock: state.recordEmergencyUnlock,
    resetDaily: state.resetDailyEmergencyUnlocks,
  }));
