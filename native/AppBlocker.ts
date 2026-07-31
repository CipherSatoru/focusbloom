/**
 * Native module interface for Android app blocking.
 *
 * This module provides the core loophole-resistant app blocking functionality.
 * It uses Android's native APIs to enforce blocks at the OS level.
 *
 * Key features:
 * - Blocks apps at the system level (not just overlays)
 * - No "Ignore" button — the only way to unblock is through the app's logic
 * - Prevents uninstallation during active blocks (Device Admin)
 * - Blocks notifications from blocked apps
 * - Reads physical activity (steps) for activity-based unlock
 *
 * Android APIs used:
 * - UsageStatsManager (app usage monitoring)
 * - AccessibilityService (app open detection and blocking)
 * - DevicePolicyManager (anti-uninstall protection)
 * - NotificationListenerService (notification blocking)
 * - Settings.Secure (system settings)
 */

import { NativeModules, Platform } from 'react-native';
import { TrackedApp, ActivityGoal } from '@/types';

const { AppBlocker } = NativeModules;

export interface BlockedAppInfo {
  packageName: string;
  appName: string;
  isBlocked: boolean;
  blockReason: 'study_mode' | 'habit_unlock' | 'schedule' | 'emergency';
  blockedAt: number;
  blockedUntil: number | null;
}

export interface BlockStats {
  totalBlocks: number;
  blocksToday: number;
  mostBlockedApp: string;
  lastBlockTime: number | null;
}

/**
 * Check if the app has the necessary permissions
 */
export const checkPermissions = async (): Promise<{
  usageAccess: boolean;
  accessibility: boolean;
  notificationAccess: boolean;
  deviceAdmin: boolean;
}> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return {
      usageAccess: false,
      accessibility: false,
      notificationAccess: false,
      deviceAdmin: false,
    };
  }

  return await AppBlocker.checkPermissions();
};

/**
 * Request all necessary permissions
 * This will show system dialogs to the user
 */
export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return false;
  }

  return await AppBlocker.requestPermissions();
};

/**
 * Block a specific app
 * This blocks the app at the OS level — no overlay, no tap-through
 */
export const blockApp = async (
  packageName: string,
  reason: BlockedAppInfo['blockReason'],
  durationMinutes?: number
): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    console.warn('AppBlocker: not available on this platform');
    return false;
  }

  return await AppBlocker.blockApp(packageName, reason, durationMinutes ?? null);
};

/**
 * Unblock a specific app
 * Only the app's own logic can call this — no system-level override
 */
export const unblockApp = async (packageName: string): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return false;
  }

  return await AppBlocker.unblockApp(packageName);
};

/**
 * Block all apps in a list
 */
export const blockApps = async (
  packageNames: string[],
  reason: BlockedAppInfo['blockReason']
): Promise<void> => {
  for (const pkg of packageNames) {
    await blockApp(pkg, reason);
  }
};

/**
 * Unblock all apps
 */
export const unblockAllApps = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.unblockAllApps();
};

/**
 * Get the list of currently blocked apps
 */
export const getBlockedApps = async (): Promise<BlockedAppInfo[]> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return [];
  }

  return await AppBlocker.getBlockedApps();
};

/**
 * Get block statistics
 */
export const getBlockStats = async (): Promise<BlockStats> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return {
      totalBlocks: 0,
      blocksToday: 0,
      mostBlockedApp: '',
      lastBlockTime: null,
    };
  }

  return await AppBlocker.getBlockStats();
};

/**
 * Enable device admin protection
 * This prevents the user from uninstalling the app during active blocks
 */
export const enableDeviceAdmin = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return false;
  }

  return await AppBlocker.enableDeviceAdmin();
};

/**
 * Check if device admin is active
 */
export const isDeviceAdminActive = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return false;
  }

  return await AppBlocker.isDeviceAdminActive();
};

/**
 * Block notifications from a specific app
 */
export const blockNotifications = async (packageName: string): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.blockNotifications(packageName);
};

/**
 * Unblock notifications from a specific app
 */
export const unblockNotifications = async (packageName: string): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.unblockNotifications(packageName);
};

/**
 * Get the current step count from the device
 * Used for activity-based unlock (EarnLock pattern)
 */
export const getStepCount = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return 0;
  }

  return await AppBlocker.getStepCount();
};

/**
 * Get active minutes from the device
 */
export const getActiveMinutes = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return 0;
  }

  return await AppBlocker.getActiveMinutes();
};

/**
 * Get the current activity goal progress
 */
export const getActivityGoalProgress = async (): Promise<ActivityGoal> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return {
      type: 'steps',
      target: 500,
      current: 0,
      unit: 'steps',
    };
  }

  return await AppBlocker.getActivityGoalProgress();
};

/**
 * Set the activity goal for unlock
 */
export const setActivityGoal = async (goal: ActivityGoal): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.setActivityGoal(goal);
};

/**
 * Emergency unblock — only available through the app's logic
 * This is NOT a system-level override. It requires solving a math problem
 * and is limited to a configurable number of uses per day.
 */
export const emergencyUnblock = async (
  packageName: string,
  mathAnswer: number,
  problemId: string
): Promise<{ success: boolean; reason?: string }> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return { success: false, reason: 'Native module not available' };
  }

  return await AppBlocker.emergencyUnblock(packageName, mathAnswer, problemId);
};

/**
 * Check if an app is currently blocked
 */
export const isAppBlocked = async (packageName: string): Promise<boolean> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return false;
  }

  return await AppBlocker.isAppBlocked(packageName);
};

/**
 * Get the list of installed apps (for configuration)
 */
export const getInstalledApps = async (): Promise<TrackedApp[]> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return [];
  }

  return await AppBlocker.getInstalledApps();
};

/**
 * Start a foreground service to maintain blocking
 * This prevents the system from killing the blocking service
 */
export const startBlockingService = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.startBlockingService();
};

/**
 * Stop the foreground blocking service
 */
export const stopBlockingService = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !AppBlocker) {
    return;
  }

  await AppBlocker.stopBlockingService();
};
