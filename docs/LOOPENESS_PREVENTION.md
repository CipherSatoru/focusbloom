# Loophole Prevention Strategy

This document explains how FocusBloom patches every known bypass method for phone addiction apps.

## The Core Problem

Every screen-time blocker on the market has the same fatal flaw: **the user sets the rules when calm, and bypasses them when not calm**.

Apple Screen Time's "Ignore Limit" button is the most obvious example. But even third-party apps like Opal, One Sec, and ScreenZen all have tap-through escapes. The user sets a strict block on Sunday, encounters it on Thursday night, and taps "I really need this" or waits out the timer.

## FocusBloom's Approach

FocusBloom doesn't rely on a single mechanism. It uses **three layers** of loophole prevention:

### Layer 1: No Ignore Button

When a blocked app is opened, an overlay appears with **no dismiss button**. The only way to dismiss it is through the app's emergency unlock logic.

This patches:
- ✅ Tap-to-override (Apple Screen Time's "Ignore Limit")
- ✅ Time-change exploit (overlay uses system uptime, not wall clock)
- ✅ Force-quit bypass (AccessibilityService runs independently)
- ✅ Safe Mode bypass (blocks are re-applied on boot via BootReceiver)

### Layer 2: Math-Problem Gate

Emergency unlocks require solving a real arithmetic problem. The problem is generated fresh each time and cannot be predicted or memorized.

This patches:
- ✅ Pattern matching (problems are random arithmetic, not trivia)
- ✅ Memorization (each problem is unique)
- ✅ External help (problems require actual computation)

### Layer 3: Physical Activity Requirement

Unlocks can be gated behind step counts or active minutes. This makes them impossible to bypass from the couch — the user must physically move.

This patches:
- ✅ Couch bypass (can't earn steps while scrolling)
- ✅ Midnight cravings (willpower is low, but physical effort is required)

## Bypass Methods and How They're Patched

### 1. Tap-to-Override (Apple Screen Time's "Ignore Limit")

**The bypass**: When a limit is reached, Apple shows "Ignore Limit for Today" — one tap, and the block dissolves.

**FocusBloom's patch**: The blocking overlay has NO "Ignore" button. The only way to dismiss it is through the emergency unlock flow, which requires solving a math problem.

### 2. Time-Change Exploit

**The bypass**: Change the device clock to reset daily limits.

**FocusBloom's patch**: The blocking service uses `System.currentTimeMillis()` (system uptime) for time checks, not the wall clock. Changing the device clock does not affect the system uptime.

### 3. App-Delete-and-Reinstall

**The bypass**: Delete the blocker app, then reinstall it with a fresh state.

**FocusBloom's patch**: Device admin protection prevents uninstallation during active blocks. The user must first deactivate device admin in system settings (Settings > Security > Device Admins > Deactivate), which is a deliberate multi-step process.

### 4. Force-Quit

**The bypass**: Kill the blocker app via the multitasking switcher.

**FocusBloom's patch**: The AccessibilityService runs independently of the main app process. Even if the app is force-quoted, the service continues to monitor for blocked apps.

### 5. Safe Mode

**The bypass**: Reboot into Safe Mode, which disables all third-party apps.

**FocusBloom's patch**: A BootReceiver re-applies all blocks when the device boots normally. The user would need to uninstall the app in Safe Mode, which requires the device admin to be deactivated first.

### 6. Accessibility Service Revocation

**The bypass**: Disable the blocker's accessibility service in Settings.

**FocusBloom's patch**: The app monitors for accessibility service deactivation and shows a persistent notification reminding the user to re-enable it. The blocking service also has a foreground service notification that cannot be dismissed.

### 7. Device Admin Deactivation

**The bypass**: Deactivate device admin, then uninstall the app.

**FocusBloom's patch**: This is the one bypass that works — but it requires navigating to Settings > Security > Device Admins > Deactivate, which is a deliberate multi-step process that interrupts the compulsive reach for the phone.

### 8. VPN Profile Deletion (iOS)

**The bypass**: Delete the VPN profile used for website blocking.

**FocusBloom's patch**: FocusBloom uses Android's native APIs, not VPN profiles. The blocking is enforced at the AccessibilityService level, not the network level.

### 9. Screen Time Passcode Reset

**The bypass**: Reset the Screen Time passcode using the Apple ID.

**FocusBloom's patch**: FocusBloom doesn't use a Screen Time passcode. The emergency unlock requires solving a math problem, which cannot be reset.

## Emergency Unlock Design

The emergency unlock is designed to be:

1. **Available** — For genuine emergencies (medical, family, work)
2. **Difficult** — Requires solving a math problem
3. **Limited** — Configurable number of uses per day (default: 1)
4. **Auditable** — Every attempt is logged with timestamp and result

### Math Problem Difficulty

The difficulty scales with time of day:

- **Night (22:00 - 05:00)**: Hard problems (three-step arithmetic)
- **Evening (20:00 - 07:00)**: Medium problems (two-step arithmetic)
- **Day (07:00 - 20:00)**: Medium problems

This ensures that when willpower is lowest (late at night), the unlock is hardest.

### Physical Activity Requirement

When enabled, the emergency unlock also requires:

- **Steps**: 500 steps since the last unlock
- **Active minutes**: 10 active minutes
- **Active calories**: 20 calories burned

The user must physically move to earn an unlock. This cannot be faked from the couch.

## Psychological Principles

### Friction, Not Punishment

FocusBloom adds friction, not punishment. The user can always access their apps — they just have to pause first. That pause is where behavior change happens.

### Pre-Commitment

The user sets their rules when calm (on a Sunday). The Thursday-night version of the user cannot change those rules — they can only unlock through the emergency flow.

### No Reactance

Unlike hard blockers that feel like punishment, FocusBloom doesn't take away agency. The user can always unlock — they just have to earn it. This avoids psychological reactance (the urge to rebel against restriction).

## Comparison with Other Apps

| App | Bypass Difficulty | Key Weakness |
|---|---|---|
| Apple Screen Time | Very Low | "Ignore Limit" button |
| One Sec | Low | 1-second breathing pause can be tapped through |
| ScreenZen | Low | 30-second delay can be waited out |
| Opal | Medium | "I really need this" button |
| Freedom | Medium | VPN profile can be deleted |
| **FocusBloom** | **High** | **Only bypass is device admin deactivation** |

## Testing Bypass Resistance

The bypass resistance is tested against five methods:

1. ✅ Tap-to-override — No override button exists
2. ✅ Time-change — Uses system uptime, not wall clock
3. ✅ App-delete-and-reinstall — Device admin protection
4. ✅ Force-quit — AccessibilityService runs independently
5. ✅ Safe Mode — BootReceiver re-applies blocks

FocusBloom resists 4 of 5 methods. The only bypass is device admin deactivation, which requires deliberate multi-step action.
