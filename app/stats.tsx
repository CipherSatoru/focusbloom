import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UsageChart } from '@/components/UsageChart';
import { useStore } from '@/store';
import { formatDuration, getDayName, getMonthName } from '@/utils/dateHelpers';
import { useEffect, useState } from 'react';
import { AppUsageEntry, DailySummary } from '@/types';

export default function StatsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const studySessions = useStore((state) => state.studySessions);
  const usageHistory = useStore((state) => state.usageHistory);
  const habits = useStore((state) => state.habits);
  const settings = useStore((state) => state.settings);

  const [todayUsage, setTodayUsage] = useState<AppUsageEntry[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<DailySummary[]>([]);

  useEffect(() => {
    // Filter today's usage
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const todayData = usageHistory.filter((entry) => entry.date === todayStr);
    setTodayUsage(todayData);

    // Generate weekly summaries from study sessions
    const weekData: DailySummary[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

      const daySessions = studySessions.filter((s) => {
        const sessionDate = new Date(s.startTime);
        const sessionDateStr = `${sessionDate.getFullYear()}-${(sessionDate.getMonth() + 1).toString().padStart(2, '0')}-${sessionDate.getDate().toString().padStart(2, '0')}`;
        return sessionDateStr === dateStr;
      });

      const studyTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const completedHabits = habits.filter((h) => h.isCompleted).length;

      weekData.push({
        date: dateStr,
        totalScreenTime: studyTime + todayData.reduce((sum, e) => sum + e.timeSpent, 0),
        studyTime,
        habitsCompleted: completedHabits,
        totalHabits: habits.length,
        focusScore: studyTime > 0 ? Math.min(100, studyTime * 2) : 0,
        distractionsBlocked: daySessions.reduce((sum, s) => sum + s.distractionsBlocked, 0),
      });
    }
    setWeeklySummaries(weekData);
  }, [usageHistory, studySessions, habits]);

  // Calculate overall stats
  const totalStudyTime = studySessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = studySessions.length;
  const completedSessions = studySessions.filter((s) => s.wasCompleted).length;
  const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  const totalDistractionsBlocked = studySessions.reduce((sum, s) => sum + s.distractionsBlocked, 0);

  const avgSessionLength = totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Statistics"
        subtitle="Your focus journey"
        leftAction={
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, opacity: 0.5 }}>←</Text>
          </TouchableOpacity>
        }
      />

      {/* Overview stats — NOT a three-card grid, varied widths */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Study"
            value={formatDuration(totalStudyTime)}
            subtitle="all time"
            color={colors.primary}
            style={{ flex: 1.3, marginRight: 8 }}
          />
          <StatCard
            title="Sessions"
            value={totalSessions}
            subtitle="completed"
            color={colors.secondary}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <View style={[styles.statsGrid, { marginTop: 12 }]}>
          <StatCard
            title="Completion"
            value={`${completionRate}%`}
            subtitle="rate"
            color={colors.success}
            style={{ flex: 1, marginRight: 8 }}
          />
          <StatCard
            title="Blocked"
            value={totalDistractionsBlocked}
            subtitle="distractions"
            color={colors.accent}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Weekly focus trend — NOT centered */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontFamily: theme.typography.heading.fontFamily,
              color: colors.textPrimary,
              fontSize: 18,
              marginBottom: 12,
            },
          ]}
        >
          This Week
        </Text>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.weeklyChart}>
            {weeklySummaries.map((day, index) => {
              const dayName = index === 6 ? 'Sun' : index === 5 ? 'Sat' : getDayName(new Date(day.date)).substring(0, 3);
              const barHeight = (day.studyTime / 120) * 100; // max 120 min per day
              const isToday = index === 6;

              return (
                <View key={day.date} style={styles.dayColumn}>
                  <View
                    style={[
                      styles.dayBar,
                      {
                        height: Math.max(4, barHeight),
                        backgroundColor: isToday ? colors.primary : colors.secondarySoft,
                        borderRadius: theme.radii.sharp,
                        width: 20 + (index % 3) * 4, // varied widths
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.dayLabel,
                      {
                        fontFamily: theme.typography.caption.fontFamily,
                        color: isToday ? colors.textPrimary : colors.textSecondary,
                        fontSize: 11,
                      },
                    ]}
                  >
                    {dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayValue,
                      {
                        fontFamily: theme.typography.mono.fontFamily,
                        color: colors.textTertiary,
                        fontSize: 10,
                      },
                    ]}
                  >
                    {day.studyTime}m
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>

      {/* Top apps — NOT a three-card grid */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontFamily: theme.typography.heading.fontFamily,
              color: colors.textPrimary,
              fontSize: 18,
              marginBottom: 12,
            },
          ]}
        >
          Top Apps Today
        </Text>

        <UsageChart data={todayUsage} limit={5} showLabels={true} />
      </View>

      {/* Focus score breakdown — NOT centered */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            {
              fontFamily: theme.typography.heading.fontFamily,
              color: colors.textPrimary,
              fontSize: 18,
              marginBottom: 12,
            },
          ]}
        >
          Focus Score
        </Text>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.focusScore}>
            <View style={styles.focusScoreHeader}>
              <Text
                style={[
                  styles.focusScoreValue,
                  {
                    fontFamily: theme.typography.mono.fontFamily,
                    color: colors.primary,
                    fontSize: 32,
                  },
                ]}
              >
                {weeklySummaries[weeklySummaries.length - 1]?.focusScore || 0}
              </Text>
              <Text
                style={[
                  styles.focusScoreLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 14,
                  },
                ]}
              >
                / 100
              </Text>
            </View>

            <ProgressBar
              progress={weeklySummaries[weeklySummaries.length - 1]?.focusScore || 0}
              height={8}
              showPercentage={false}
              color={colors.primary}
              style={{ marginTop: 12 }}
            />

            <View style={styles.focusBreakdown}>
              <View style={styles.focusItem}>
                <Text
                  style={[
                    styles.focusItemLabel,
                    {
                      fontFamily: theme.typography.caption.fontFamily,
                      color: colors.textSecondary,
                      fontSize: 12,
                    },
                  ]}
                >
                  Avg session
                </Text>
                <Text
                  style={[
                    styles.focusItemValue,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 14,
                    },
                  ]}
                >
                  {formatDuration(avgSessionLength)}
                </Text>
              </View>
              <View style={styles.focusItem}>
                <Text
                  style={[
                    styles.focusItemLabel,
                    {
                      fontFamily: theme.typography.caption.fontFamily,
                      color: colors.textSecondary,
                      fontSize: 12,
                    },
                  ]}
                >
                  Distractions blocked
                </Text>
                <Text
                  style={[
                    styles.focusItemValue,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 14,
                    },
                  ]}
                >
                  {totalDistractionsBlocked}
                </Text>
              </View>
            </View>
          </View>
        </Card>
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
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
  },
  weeklyChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    gap: 8,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    marginBottom: 4,
  },
  dayLabel: {
    textAlign: 'center',
  },
  dayValue: {
    textAlign: 'center',
  },
  focusScore: {
    alignItems: 'flex-start',
  },
  focusScoreHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  focusScoreValue: {
    lineHeight: 36,
  },
  focusScoreLabel: {
    lineHeight: 16,
  },
  focusBreakdown: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 12,
  },
  focusItem: {
    alignItems: 'flex-start',
  },
  focusItemLabel: {
    marginBottom: 2,
  },
  focusItemValue: {
    lineHeight: 18,
  },
});
