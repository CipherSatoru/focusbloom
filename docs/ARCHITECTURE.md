# Architecture

FocusBloom is built with React Native + Expo, using a layered architecture that separates concerns clearly.

## Project Structure

```
/home/cipher/
├── App.js                          # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── babel.config.js                 # Babel config
├── app/                            # Expo Router screens
│   ├── _layout.tsx                 # Root layout (ThemeProvider + Stack)
│   ├── index.tsx                   # Dashboard
│   ├── study.tsx                   # Study Mode
│   ├── habits.tsx                  # Habit tracking
│   ├── stats.tsx                   # Statistics
│   ├── settings.tsx                # Settings
│   └── unlock.tsx                  # Emergency unlock
├── components/                     # Reusable UI components
│   ├── ui/                         # Basic UI primitives
│   │   ├── Button.tsx              # Custom button (no shadcn)
│   │   ├── Card.tsx                # Custom card
│   │   └── ProgressBar.tsx         # Progress bar
│   ├── Header.tsx                  # Screen header
│   ├── StatCard.tsx                # Statistics card
│   ├── StudyTimer.tsx              # Pomodoro timer
│   ├── HabitItem.tsx               # Habit list item
│   ├── UsageChart.tsx              # Usage statistics chart
│   └── MathProblemInput.tsx        # Emergency unlock input
├── theme/                          # Anti-AI design system
│   ├── index.ts                    # Colors, typography, spacing
│   └── ThemeProvider.tsx           # React context provider
├── store/                          # State management
│   └── index.ts                    # Zustand store
├── native/                         # Native module interfaces
│   ├── AppBlocker.ts               # App blocking interface
│   └── UsageTracker.ts             # Usage tracking interface
├── utils/                          # Utility functions
│   ├── dateHelpers.ts              # Date/time formatting
│   ├── mathProblems.ts             # Math problem generator
│   └── haptics.ts                  # Haptic feedback
├── types/                          # TypeScript type definitions
│   └── index.ts                    # All app types
├── android/                        # Android native code
│   ├── app/src/main/java/com/focusbloom/
│   │   ├── AppBlockerModule.kt     # Native app blocking
│   │   ├── AppBlockerService.kt    # AccessibilityService
│   │   ├── UsageTrackerModule.kt   # Native usage tracking
│   │   ├── FocusBloomDeviceAdmin.kt # Device admin
│   │   ├── FocusBloomNotificationListener.kt
│   │   ├── FocusBloomBootReceiver.kt
│   │   └── FocusBloomApplication.kt
│   └── app/src/main/res/
│       ├── layout/blocked_app_overlay.xml
│       ├── xml/device_admin.xml
│       ├── xml/accessibility_service_config.xml
│       ├── values/strings.xml
│       └── values/styles.xml
└── docs/                           # Documentation
    ├── ANTI_AI_DESIGN.md
    ├── ARCHITECTURE.md
    └── LOOPHOLE_PREVENTION.md
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.73.4 + Expo SDK 50 |
| Navigation | Expo Router (file-based) |
| State Management | Zustand |
| Storage | AsyncStorage (via Zustand persist) |
| Native Modules | React Native Native Modules (Kotlin) |
| Haptics | expo-haptics |
| Charts | Custom SVG (react-native-svg) |

## Data Flow

```
User Action → Zustand Store → React Component → Native Module → Android API
```

1. User interacts with a React component
2. Component dispatches an action to the Zustand store
3. Store updates state and triggers re-renders
4. If native functionality is needed, the component calls the native module interface
5. The native module (Kotlin) calls Android APIs
6. Results flow back through the same path

## State Management

The app uses Zustand with AsyncStorage persistence. Only data is persisted, not runtime state:

- **Persisted**: habits, study sessions, usage history, settings
- **Not persisted**: isStudyModeActive, currentStudySession, isBlocked

## Native Modules

### AppBlockerModule

Provides app blocking at the OS level using:

1. **AccessibilityService** — Detects app openings and shows blocking overlay
2. **DevicePolicyManager** — Prevents uninstallation during active blocks
3. **NotificationListenerService** — Blocks notifications from blocked apps

### UsageTrackerModule

Provides usage data using:

1. **UsageStatsManager** — Collects app usage statistics
2. **SharedPreferences** — Stores data locally (no network calls)

## Key Design Patterns

- **Unidirectional data flow** — Actions flow down, events flow up
- **Composition over inheritance** — Components are composed, not extended
- **Separation of concerns** — UI, state, and native logic are separate
- **Type safety** — All data is typed with TypeScript
