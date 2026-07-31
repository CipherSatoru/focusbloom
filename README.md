# FocusBloom

A mobile app to help manage phone addiction while preserving study functionality. Built with anti-AI design principles and loophole-resistant architecture.

## What Makes FocusBloom Different

Unlike Apple Screen Time or other app blockers that hand you a one-tap "Ignore Limit" escape hatch, FocusBloom uses **three layers of loophole prevention**:

1. **No Ignore Button** — Blocked apps show an overlay with no dismiss button. The only way out is through the app's emergency unlock logic.
2. **Math-Problem Gate** — Emergency unlocks require solving a real arithmetic problem. No pattern matching, no memorization.
3. **Physical Activity Requirement** — Unlocks can be gated behind step counts or active minutes, making them impossible to bypass from the couch.

## Features

- **Study Mode** — Pomodoro-style focus sessions with app blocking
- **Habit-Based Unlocking** — Apps stay locked until daily habits are completed
- **Emergency Unlock** — Math-problem gate with configurable daily limits
- **Activity-Based Unlock** — Earn unlocks through physical activity
- **Usage Tracking** — See where your time goes with detailed statistics
- **Anti-AI Design** — Warm, earthy palette and asymmetric layouts that feel human-made

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Android Studio (for Android development)
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. For Android:
   ```bash
   npm run android
   ```

### Setup on Android

FocusBloom requires several Android permissions for app blocking:

1. **Usage Access** — Track app usage and detect app openings
2. **Accessibility Service** — Block apps at the system level
3. **Notification Access** — Block notifications from distracting apps
4. **Device Admin** — Prevent uninstallation during active blocks

When you first open the app, you'll be guided through enabling each permission.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture overview.

## Anti-AI Design

FocusBloom was built to avoid the visual fingerprints of AI-generated UIs. See [docs/ANTI_AI_DESIGN.md](docs/ANTI_AI_DESIGN.md) for the full design rationale.

## Loophole Prevention

See [docs/LOOPENESS_PREVENTION.md](docs/LOOPENESS_PREVENTION.md) for the full loophole prevention strategy.

## License

MIT
