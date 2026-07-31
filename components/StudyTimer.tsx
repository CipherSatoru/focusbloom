import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { formatTime } from '@/utils/dateHelpers';

interface StudyTimerProps {
  secondsRemaining: number;
  totalSeconds: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete: () => void;
  style?: ViewStyle;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  secondsRemaining,
  totalSeconds,
  isRunning,
  onStart,
  onPause,
  onReset,
  onComplete,
  style,
}) => {
  const { colors, theme } = useTheme();

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  // Haptic pulse every minute
  useEffect(() => {
    if (isRunning && secondsRemaining > 0 && secondsRemaining % 60 === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    }
  }, [secondsRemaining, isRunning]);

  const handleStartPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    onReset();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Timer display — large, left-aligned, NOT centered */}
      <View style={styles.timerRow}>
        <Text
          style={[
            styles.timer,
            {
              fontFamily: theme.typography.mono.fontFamily,
              color: colors.textPrimary,
            },
          ]}
        >
          {formatTime(secondsRemaining)}
        </Text>
        <Text
          style={[
            styles.target,
            {
              fontFamily: theme.typography.body.fontFamily,
              color: colors.textSecondary,
            },
          ]}
        >
          of {formatTime(totalSeconds)}
        </Text>
      </View>

      {/* Progress ring — custom SVG-like circle */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressCircle,
            {
              borderWidth: 4,
              borderColor: colors.surfaceAlt,
              borderTopColor: colors.primary,
              borderRadius: 140,
              width: 280,
              height: 280,
            },
          ]}
        >
          <View style={styles.centerContent}>
            <Text
              style={[
                styles.phaseLabel,
                {
                  fontFamily: theme.typography.subheading.fontFamily,
                  color: colors.primary,
                  fontSize: 16,
                },
              ]}
            >
              {isRunning ? 'FOCUSING' : secondsRemaining === 0 ? 'DONE' : 'READY'}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls — NOT centered, left-aligned */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handleStartPause}
          style={[
            styles.controlButton,
            {
              backgroundColor: isRunning ? colors.warning : colors.primary,
              borderRadius: theme.radii.button,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.controlButtonText,
              {
                fontFamily: theme.typography.body.fontFamily,
                color: '#FFFFFF',
              },
            ]}
          >
            {isRunning ? 'PAUSE' : secondsRemaining === 0 ? 'RESTART' : 'START'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          style={[
            styles.controlButton,
            {
              backgroundColor: 'transparent',
              borderRadius: theme.radii.button,
              borderWidth: 1,
              borderColor: colors.borderStrong,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.controlButtonText,
              {
                fontFamily: theme.typography.body.fontFamily,
                color: colors.textSecondary,
              },
            ]}
          >
            RESET
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  timer: {
    fontSize: 48,
    letterSpacing: -2,
    lineHeight: 48,
  },
  target: {
    fontSize: 16,
    marginLeft: 8,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  progressCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    letterSpacing: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'flex-start',
  },
  controlButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    letterSpacing: 1,
  },
});
