/**
 * Haptic feedback utilities.
 *
 * Used to provide tactile feedback for interactions,
 * reinforcing the physicality of the interface.
 * This makes the app feel more "real" and less digital/AI-like.
 */
import * as Haptics from 'expo-haptics';

/**
 * Light impact — for subtle interactions
 */
export const lightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact — for important interactions
 */
export const mediumImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Heavy impact — for critical interactions
 */
export const heavyImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};

/**
 * Success notification — soft success haptic
 */
export const successHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Warning notification — warning haptic
 */
export const warningHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

/**
 * Error notification — error haptic
 */
export const errorHaptic = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Selection impact — for selection changes
 */
export const selectionImpact = () => {
  Haptics.selectionAsync();
};
