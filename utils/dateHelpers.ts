/**
 * Date and time utility functions.
 * Used throughout the app for formatting and calculations.
 */

/**
 * Format seconds into MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format minutes into human-readable duration
 * e.g., 90 -> "1h 30m", 45 -> "45m"
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

/**
 * Get today's date string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
};

/**
 * Get the start of today (midnight) as a timestamp
 */
export const getStartOfToday = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return start.getTime();
};

/**
 * Check if a date is today
 */
export const isToday = (timestamp: number): boolean => {
  const today = getStartOfToday();
  const dayEnd = today + 24 * 60 * 60 * 1000;
  return timestamp >= today && timestamp < dayEnd;
};

/**
 * Get the day name for a date
 */
export const getDayName = (date: Date = new Date()): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Get the month name for a date
 */
export const getMonthName = (date: Date = new Date()): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[date.getMonth()];
};

/**
 * Format a date as "Month Day" e.g., "July 22"
 */
export const formatDateShort = (date: Date = new Date()): string => {
  return `${getMonthName(date)} ${date.getDate()}`;
};

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Calculate streak from an array of completion dates
 */
export const calculateStreak = (completionDates: string[]): number => {
  if (completionDates.length === 0) return 0;

  const sorted = [...completionDates].sort().reverse();
  const today = getTodayString();

  let streak = 0;
  let currentDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (sorted.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Get the time string for a timestamp (HH:MM)
 */
export const formatTimeOnly = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Get the current hour (0-23)
 */
export const getCurrentHour = (): number => {
  return new Date().getHours();
};

/**
 * Check if it's night time (for bedtime mode)
 */
export const isNightTime = (hour?: number): boolean => {
  const h = hour ?? getCurrentHour();
  return h >= 21 || h <= 6;
};
