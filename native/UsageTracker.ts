/**
 * Native module interface for Android app usage tracking.
 *
 * This module provides usage data for the app's statistics and insights.
 * It uses Android's UsageStatsManager API to collect data.
 *
 * Key features:
 * - Tracks time spent in each app
 * - Tracks number of app opens
 * - Provides daily, weekly, and monthly summaries
 * - Runs in the background via a foreground service
 * - Data is stored locally — no third-party analytics
 *
 * Android APIs used:
 * - UsageStatsManager (app usage statistics)
 * - JobScheduler (background task scheduling)
 * - SharedPreferences (local data storage)
 */

import { NativeModules, Platform } from 'react-native';
import { AppUsageEntry, DailySummary } from '@/types';

const { UsageTracker } = NativeModules;

/**
 * Request usage access permission
 * This opens the system settings page where the user must grant permission
 */
export const requestUsageAccess = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return false;
  }

  return await UsageTracker.requestUsageAccess();
};

/**
 * Check if usage access permission is granted
 */
export const hasUsageAccess = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return false;
  }

  return await UsageTracker.hasUsageAccess();
};

/**
 * Get usage data for a specific time range
 */
export const getUsageData = async (
  startTime: number,
  endTime: number
): Promise<AppUsageEntry[]> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return [];
  }

  return await UsageTracker.getUsageData(startTime, endTime);
};

/**
 * Get today's usage data
 */
export const getTodayUsage = async (): Promise<AppUsageEntry[]> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return [];
  }

  return await UsageTracker.getTodayUsage();
};

/**
 * Get this week's usage data
 */
export const getWeekUsage = async (): Promise<AppUsageEntry[]> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return [];
  }

  return await UsageTracker.getWeekUsage();
};

/**
 * Get daily summaries for the past N days
 */
export const getDailySummaries = async (days: number = 7): Promise<DailySummary[]> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return [];
  }

  return await UsageTracker.getDailySummaries(days);
};

/**
 * Get the total screen time for today
 */
export const getTodayScreenTime = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return 0;
  }

  return await UsageTracker.getTodayScreenTime();
};

/**
 * Get the total study time for today
 */
export const getTodayStudyTime = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return 0;
  }

  return await UsageTracker.getTodayStudyTime();
};

/**
 * Get the focus score for today (0-100)
 * Based on time spent in productive vs distracting apps
 */
export const getTodayFocusScore = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return 0;
  }

  return await UsageTracker.getTodayFocusScore();
};

/**
 * Start tracking usage (foreground service)
 */
export const startTracking = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return;
  }

  await UsageTracker.startTracking();
};

/**
 * Stop tracking usage
 */
export const stopTracking = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return;
  }

  await UsageTracker.stopTracking();
};

/**
 * Get the most used apps (sorted by time spent)
 */
export const getMostUsedApps = async (limit: number = 5): Promise<AppUsageEntry[]> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return [];
  }

  return await UsageTracker.getMostUsedApps(limit);
};

/**
 * Get the number of distractions blocked today
 */
export const getDistractionsBlockedToday = async (): Promise<number> => {
  if (Platform.OS !== 'android' || !UsageTracker) {
    return 0;
  }

  return await UsageTracker.getDistractionsBlockedToday();
};
