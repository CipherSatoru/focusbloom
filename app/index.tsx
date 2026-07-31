import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useStore, useStudyMode, useHabits, useEmergencyUnlock } from '@/store';
import { formatTime, formatDuration, getDayName, formatDateShort } from '@/utils/dateHelpers';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const { isStudyModeActive, currentSession, startSession, endSession } = useStudyMode();
  const habits = useHabits();
  const { usedToday, maxPerDay } = useEmergencyUnlock();
  const settings = useStore((state) => state.settings);
  const studySessions = useStore((state) => state.studySessions);

  // Calculate today's stats
  const todaySessions = studySessions.filter(
    (s) => s.startTime >= Date.now() - 24 * 60 * 60 * 1000
  );
  const todayStudyTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const completedHabits = habits.filter((h) => h.isCompleted).length;
  const totalHabits = habits.length;

  // Calculate streak
  const streak = habits.reduce((sum, h) => sum + h.streak, 0);

  const handleStartStudy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
    startSession(settings.defaultStudyDuration * 60);
    router.push('/study');
  };

  const handleHabitsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    router.push('/habits');
  };

  const handleStatsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    router.push('/stats');
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    router.push('/settings');
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header — left-aligned, NOT centered */}
      <Header
        title={getDayName()}
        subtitle={formatDateShort()}
        rightAction={
          <TouchableOpacity onPress={handleSettingsPress} activeOpacity={0.7}>
            <Text style={{ fontSize: 20, opacity: 0.5 }}>⋯</Text>
          </TouchableOpacity>
        }
      />

      {/* Study mode card — prominent, asymmetric */}
      <View style={styles.section}>
        <Card
          header="Focus Session"
          elevated
          style={{ borderRadius: theme.radii.card }}
          padding="md"
        >
          <View style={styles.studyCard}>
            {/* Timer preview — left-aligned */}
            <View style={styles.timerPreview}>
              <Text
                style={[
                  styles.timerText,
                  {
                    fontFamily: theme.typography.mono.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 36,
                  },
                ]}
              >
                {isStudyModeActive && currentSession
                  ? formatTime(0)
                  : formatTime(settings.defaultStudyDuration * 60)}
              </Text>
              <Text
                style={[
                  styles.timerLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 13,
                  },
                ]}
              >
                {isStudyModeActive ? 'In progress' : 'Ready to focus?'}
              </Text>
            </View>

            {/* Start button — NOT centered */}
            <Button
              title={isStudyModeActive ? 'CONTINUE' : 'START FOCUS'}
              onPress={handleStartStudy}
              variant="primary"
              size="md"
              style={styles.startButton}
            />
          </View>
        </Card>
      </View>

      {/* Stats row — NOT a three-card grid, varied widths */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <StatCard
            title="Today"
            value={formatDuration(todayStudyTime)}
            subtitle="focused"
            color={colors.primary}
            style={{ flex: 1.2, marginRight: 8 }}
          />
          <StatCard
            title="Streak"
            value={streak}
            subtitle="days"
            color={colors.secondary}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Habits preview — NOT centered */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontFamily: theme.typography.heading.fontFamily,
                color: colors.textPrimary,
                fontSize: 18,
              },
            ]}
          >
            Daily Habits
          </Text>
          <TouchableOpacity onPress={handleHabitsPress} activeOpacity={0.7}>
            <Text
              style={[
                styles.seeAll,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.secondary,
                  fontSize: 13,
                },
              ]}
            >
              {completedHabits}/{totalHabits} done · see all
            </Text>
          </TouchableOpacity>
        </View>

        <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
          {habits.slice(0, 3).map((habit) => (
            <View key={habit.id} style={styles.habitPreview}>
              <Text style={{ fontSize: 18 }}>{habit.emoji || '•'}</Text>
              <View style={styles.habitInfo}>
                <Text
                  style={[
                    styles.habitName,
                    {
                      fontFamily: theme.typography.body.fontFamily,
                      color: habit.isCompleted ? colors.textSecondary : colors.textPrimary,
                      fontSize: 14,
                      textDecorationLine: habit.isCompleted ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {habit.name}
                </Text>
                <ProgressBar
                  progress={(habit.completed / habit.target) * 100}
                  height={4}
                  showPercentage={false}
                  color={habit.isCompleted ? colors.success : colors.secondary}
                  style={styles.habitProgress}
                />
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Emergency unlock status — NOT centered */}
      <View style={styles.section}>
        <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.emergencyStatus}>
            <Text
              style={[
                styles.emergencyTitle,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textPrimary,
                  fontSize: 14,
                },
              ]}
            >
              Emergency unlocks
            </Text>
            <Text
              style={[
                styles.emergencyCount,
                {
                  fontFamily: theme.typography.mono.fontFamily,
                  color: usedToday >= maxPerDay ? colors.error : colors.success,
                  fontSize: 16,
                },
              ]}
            >
              {usedToday}/{maxPerDay} used today
            </Text>
          </View>
        </Card>
      </View>

      {/* Quick actions — NOT a three-card grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontFamily: theme.typography.heading.fontFamily,
                color: colors.textPrimary,
                fontSize: 18,
              },
            ]}
          >
            Quick Actions
          </Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            onPress={handleHabitsPress}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.primarySoft,
                borderRadius: theme.radii.button,
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>📝</Text>
            <Text
              style={[
                styles.actionLabel,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.primary,
                  fontSize: 13,
                },
              ]}
            >
              Habits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleStatsPress}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.secondarySoft,
                borderRadius: theme.radii.button,
              },
            ]}
          >
            <Text style={{ fontSize: 22 }}>📊</Text>
            <Text
              style={[
                styles.actionLabel,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textPrimary,
                  fontSize: 13,
                },
              ]}
            >
              Stats
            </Text>
          </TouchableOpacity>
        </View>
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
  studyCard: {
    alignItems: 'flex-start',
  },
  timerPreview: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  timerText: {
    letterSpacing: -1,
    lineHeight: 36,
  },
  timerLabel: {
    marginTop: 2,
  },
  startButton: {
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    lineHeight: 22,
  },
  seeAll: {
    lineHeight: 16,
  },
  habitPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    marginBottom: 4,
  },
  habitProgress: {
    width: '100%',
  },
  emergencyStatus: {
    alignItems: 'flex-start',
  },
  emergencyTitle: {
    marginBottom: 4,
  },
  emergencyCount: {
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 6,
  },
  actionLabel: {
    lineHeight: 16,
  },
});
