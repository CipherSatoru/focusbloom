import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  trackColor?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 10,
  color,
  trackColor,
  animated = true,
  style,
}) => {
  const { colors, theme } = useTheme();

  const clampedProgress = Math.max(0, Math.min(100, progress));
  const progressColor = color || colors.primary;
  const trackColorValue = trackColor || colors.surfaceAlt;

  // Haptic feedback at key milestones
  useEffect(() => {
    if (animated && clampedProgress > 0) {
      if (clampedProgress === 100) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
      } else if (clampedProgress >= 50 && clampedProgress < 51) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
      }
    }
  }, [clampedProgress, animated]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              {
                fontFamily: theme.typography.body.fontFamily,
                color: colors.textSecondary,
                fontSize: 13,
              },
            ]}
          >
            {label}
          </Text>
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                {
                  fontFamily: theme.typography.mono.fontFamily,
                  color: colors.textPrimary,
                  fontSize: 12,
                },
              ]}
            >
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColorValue,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: progressColor,
              borderRadius: height / 2,
              borderTopRightRadius: clampedProgress === 100 ? height / 2 : 0,
              borderBottomRightRadius: clampedProgress === 100 ? height / 2 : 0,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    flex: 1,
  },
  percentage: {
    flexShrink: 0,
    marginLeft: 8,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    width: 0,
  },
});
