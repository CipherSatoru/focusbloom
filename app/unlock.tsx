import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MathProblemInput } from '@/components/MathProblemInput';
import { useStore, useEmergencyUnlock } from '@/store';
import { getDifficultyByTime } from '@/utils/mathProblems';
import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';

export default function EmergencyUnlockScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const { usedToday, maxPerDay, recordUnlock } = useEmergencyUnlock();
  const settings = useStore((state) => state.settings);
  const [showMathProblem, setShowMathProblem] = useState(false);
  const [mathDifficulty, setMathDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    setMathDifficulty(getDifficultyByTime());
  }, []);

  const handleRequestUnlock = () => {
    if (usedToday >= maxPerDay) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'No Unlocks Remaining',
        `You've used all ${maxPerDay} emergency unlocks for today. They reset at midnight.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
      return;
    }

    if (settings.requirePhysicalActivity) {
      const { activityGoal } = settings;
      if (activityGoal.current < activityGoal.target) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          'Activity Goal Not Met',
          `You need ${activityGoal.target - activityGoal.current} more ${activityGoal.unit} to unlock.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Show Math Problem', onPress: () => setShowMathProblem(true) },
          ]
        );
        return;
      }
    }

    setShowMathProblem(true);
  };

  const handleMathSolved = (correct: boolean) => {
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      recordUnlock({
        id: `unlock-${Date.now()}`,
        timestamp: Date.now(),
        problem: `${mathDifficulty} difficulty`,
        answer: 0,
        userAnswer: 0,
        wasCorrect: true,
        wasUsed: true,
      });

      Alert.alert(
        'Unlock Granted',
        'You may now access your apps. Use this wisely.',
        [{ text: 'Continue', onPress: () => router.back() }]
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Incorrect Answer',
        'Please try again. The answer must be correct to unlock.',
        [{ text: 'OK' }]
      );
    }
  };

  const remaining = maxPerDay - usedToday;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Emergency Unlock"
        subtitle="For genuine emergencies only"
        leftAction={
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, opacity: 0.5 }}>×</Text>
          </TouchableOpacity>
        }
      />

      {!showMathProblem ? (
        <>
          {/* Warning card — NOT centered */}
          <View style={styles.section}>
            <Card padding="md" elevated style={{ borderRadius: theme.radii.card, borderColor: colors.error }}>
              <View style={styles.warningContent}>
                <Text
                  style={[
                    styles.warningText,
                    {
                      fontFamily: theme.typography.body.fontFamily,
                      color: colors.error,
                      fontSize: 14,
                      lineHeight: 20,
                    },
                  ]}
                >
                  This unlock is for genuine emergencies only. Each use counts against your daily limit.
                  Misusing this feature will reduce your ability to stay focused.
                </Text>
              </View>
            </Card>
          </View>

          {/* Status — NOT centered */}
          <View style={styles.section}>
            <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
              <View style={styles.statusContent}>
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      fontFamily: theme.typography.body.fontFamily,
                      color: colors.textSecondary,
                      fontSize: 13,
                    },
                  ]}
                >
                  Unlocks remaining today
                </Text>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: remaining > 0 ? colors.success : colors.error,
                      fontSize: 24,
                    },
                  ]}
                >
                  {remaining}/{maxPerDay}
                </Text>
              </View>
            </Card>
          </View>

          {/* Physical activity requirement — NOT centered */}
          {settings.requirePhysicalActivity && (
            <View style={styles.section}>
              <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
                <View style={styles.activityContent}>
                  <Text
                    style={[
                      styles.activityLabel,
                      {
                        fontFamily: theme.typography.body.fontFamily,
                        color: colors.textPrimary,
                        fontSize: 14,
                        marginBottom: 6,
                      },
                    ]}
                  >
                    Physical activity goal
                  </Text>
                  <Text
                    style={[
                      styles.activityValue,
                      {
                        fontFamily: theme.typography.mono.fontFamily,
                        color: colors.textSecondary,
                        fontSize: 16,
                      },
                    ]}
                  >
                    {settings.activityGoal.current}/{settings.activityGoal.target} {settings.activityGoal.unit}
                  </Text>
                  <View style={styles.activityProgress}>
                    <View
                      style={[
                        styles.activityBar,
                        {
                          width: `${Math.min(100, (settings.activityGoal.current / settings.activityGoal.target) * 100)}%`,
                          backgroundColor: colors.primary,
                          borderRadius: 2,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Card>
            </View>
          )}

          {/* Unlock button — NOT centered */}
          <View style={styles.section}>
            <Button
              title="Request Unlock"
              onPress={handleRequestUnlock}
              variant="primary"
              size="md"
              disabled={remaining <= 0}
              style={{ alignSelf: 'flex-start' }}
            />
          </View>
        </>
      ) : (
        // Math problem input — NOT centered
        <View style={styles.section}>
          <MathProblemInput
            difficulty={mathDifficulty}
            onSolve={handleMathSolved}
          />
        </View>
      )}
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
  warningContent: {
    alignItems: 'flex-start',
  },
  warningText: {
    lineHeight: 20,
  },
  statusContent: {
    alignItems: 'flex-start',
  },
  statusLabel: {
    marginBottom: 4,
  },
  statusValue: {
    lineHeight: 28,
  },
  activityContent: {
    width: '100%',
  },
  activityLabel: {
    alignSelf: 'flex-start',
  },
  activityValue: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  activityProgress: {
    height: 6,
    backgroundColor: '#E8E2DA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  activityBar: {
    height: '100%',
  },
});
