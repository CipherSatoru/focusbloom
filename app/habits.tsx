import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HabitItem } from '@/components/HabitItem';
import { useHabits, useStore } from '@/store';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

export default function HabitsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const habits = useHabits();
  const completeHabit = useStore((state) => state.completeHabit);
  const addHabit = useStore((state) => state.addHabit);
  const resetHabits = useStore((state) => state.resetHabits);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    if (habit.isCompleted) {
      // Uncomplete the habit
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
      useStore.getState().updateHabit(habitId, {
        isCompleted: false,
        completed: 0,
      });
    } else {
      // Complete the habit
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
      completeHabit(habitId, habit.target);
    }
  };

  const handleAddHabit = () => {
    setShowAddDialog(true);
  };

  const handleResetHabits = () => {
    Alert.alert(
      'Reset Habits?',
      'This will reset all habit progress for today. Your streaks will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
            resetHabits();
          },
        },
      ]
    );
  };

  const completedCount = habits.filter((h) => h.isCompleted).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Daily Habits"
        subtitle={`${completedCount} of ${totalCount} completed`}
        leftAction={
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, opacity: 0.5 }}>←</Text>
          </TouchableOpacity>
        }
        rightAction={
          <TouchableOpacity onPress={handleAddHabit} activeOpacity={0.7}>
            <Text style={{ fontSize: 20, opacity: 0.7 }}>+</Text>
          </TouchableOpacity>
        }
      />

      {/* Progress summary — NOT centered */}
      <View style={styles.section}>
        <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.progressSummary}>
            <Text
              style={[
                styles.progressLabel,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textSecondary,
                  fontSize: 13,
                },
              ]}
            >
              Today's completion
            </Text>
            <View style={styles.progressRow}>
              <Text
                style={[
                  styles.progressValue,
                  {
                    fontFamily: theme.typography.mono.fontFamily,
                    color: colors.primary,
                    fontSize: 22,
                  },
                ]}
              >
                {completionRate}%
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${completionRate}%`,
                      backgroundColor: colors.primary,
                      borderRadius: 2,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </Card>
      </View>

      {/* Habits list — NOT a three-card grid */}
      <View style={styles.section}>
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={handleToggleHabit}
              style={{ marginBottom: 10 }}
            />
          ))}
        </View>
      </View>

      {/* Reset button — NOT centered */}
      <View style={styles.section}>
        <Button
          title="Reset Today's Habits"
          onPress={handleResetHabits}
          variant="outline"
          size="sm"
          style={{ alignSelf: 'flex-start' }}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  progressSummary: {
    alignItems: 'flex-start',
  },
  progressLabel: {
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressValue: {
    lineHeight: 26,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8E2DA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  habitsList: {
    width: '100%',
  },
});
