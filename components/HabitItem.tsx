import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { Habit } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface HabitItemProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  style?: ViewStyle;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, style }) => {
  const { colors, theme } = useTheme();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    onToggle(habit.id);
  };

  const progress = habit.target > 0 ? (habit.completed / habit.target) * 100 : 0;

  // Use the user's chosen emoji — NOT a default AI emoji
  const displayEmoji = habit.emoji || '•';

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: habit.isCompleted ? colors.success : colors.border,
          borderRadius: theme.radii.card,
          borderWidth: 1.5,
          borderLeftWidth: 4,
          borderLeftColor: habit.isCompleted ? colors.success : colors.secondary,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Left side — emoji and details */}
        <View style={styles.leftSection}>
          <View
            style={[
              styles.emojiContainer,
              {
                backgroundColor: habit.isCompleted ? colors.successSoft : colors.surfaceAlt,
                borderRadius: theme.radii.badge,
              },
            ]}
          >
            <Text style={styles.emoji}>{displayEmoji}</Text>
          </View>
          <View style={styles.details}>
            <Text
              style={[
                styles.name,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textPrimary,
                  fontSize: 15,
                  textDecorationLine: habit.isCompleted ? 'line-through' : 'none',
                  opacity: habit.isCompleted ? 0.7 : 1,
                },
              ]}
            >
              {habit.name}
            </Text>
            <Text
              style={[
                styles.description,
                {
                  fontFamily: theme.typography.caption.fontFamily,
                  color: colors.textSecondary,
                  fontSize: 12,
                },
              ]}
            >
              {habit.description}
            </Text>
            <Text
              style={[
                styles.progressText,
                {
                  fontFamily: theme.typography.mono.fontFamily,
                  color: colors.textTertiary,
                  fontSize: 11,
                },
              ]}
            >
              {habit.completed}/{habit.target} {habit.unit} · streak: {habit.streak}
            </Text>
          </View>
        </View>

        {/* Right side — progress bar */}
        <View style={styles.rightSection}>
          <ProgressBar
            progress={progress}
            height={6}
            showPercentage={false}
            color={habit.isCompleted ? colors.success : colors.secondary}
            style={styles.progressBar}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  details: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
  description: {
    marginBottom: 4,
  },
  progressText: {
    marginTop: 2,
  },
  rightSection: {
    width: 80,
    marginLeft: 12,
  },
  progressBar: {
    width: '100%',
  },
});
