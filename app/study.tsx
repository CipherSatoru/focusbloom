import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StudyTimer } from '@/components/StudyTimer';
import { useStudyMode, useStore } from '@/store';
import { formatTime, isNightTime } from '@/utils/dateHelpers';
import * as Haptics from 'expo-haptics';
import { useEffect, useState, useRef } from 'react';

export default function StudyModeScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const { isStudyModeActive, currentSession, startSession, endSession } = useStudyMode();
  const settings = useStore((state) => state.settings);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionsBlocked, setDistractionsBlocked] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetDuration = settings.defaultStudyDuration * 60;

  // Initialize timer
  useEffect(() => {
    if (!isStudyModeActive || !currentSession) {
      // Start a new session if not active
      if (!currentSession) {
        startSession(targetDuration);
      }
    }
  }, []);

  useEffect(() => {
    if (currentSession) {
      const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
      const remaining = Math.max(0, targetDuration - elapsed);
      setSecondsRemaining(remaining);
    }
  }, [currentSession]);

  // Timer logic
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, secondsRemaining]);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
    setIsRunning(true);
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    setIsRunning(false);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    setIsRunning(false);
    setSecondsRemaining(targetDuration);
  };

  const handleSessionComplete = (completed: boolean) => {
    setIsRunning(false);
    endSession(completed);

    if (completed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Focus Session Complete',
        `You studied for ${settings.defaultStudyDuration} minutes. Well done!`,
        [
          { text: 'Back to Dashboard', onPress: () => router.push('/') },
          { text: 'Start Another', onPress: () => startSession(targetDuration) },
        ]
      );
    }
  };

  const handleExit = () => {
    Alert.alert(
      'End Session?',
      'Your progress will not be saved if you exit now.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);
            handleSessionComplete(false);
            router.push('/');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Study Mode"
        subtitle={isNightTime() ? 'Night focus' : 'Deep work session'}
        leftAction={
          <TouchableOpacity onPress={handleExit} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, opacity: 0.5 }}>←</Text>
          </TouchableOpacity>
        }
      />

      {/* Timer — prominent, NOT centered */}
      <View style={styles.timerSection}>
        <StudyTimer
          secondsRemaining={secondsRemaining}
          totalSeconds={targetDuration}
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onComplete={() => handleSessionComplete(true)}
        />
      </View>

      {/* Distractions blocked counter */}
      <View style={styles.distractionsSection}>
        <Card padding="sm" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.distractionsContent}>
            <Text
              style={[
                styles.distractionsLabel,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textSecondary,
                  fontSize: 13,
                },
              ]}
            >
              Distractions blocked
            </Text>
            <Text
              style={[
                styles.distractionsCount,
                {
                  fontFamily: theme.typography.mono.fontFamily,
                  color: colors.primary,
                  fontSize: 24,
                },
              ]}
            >
              {distractionsBlocked}
            </Text>
          </View>
        </Card>
      </View>

      {/* Study tips — NOT centered, specific content */}
      <View style={styles.tipsSection}>
        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <Text
            style={[
              styles.tipTitle,
              {
                fontFamily: theme.typography.heading.fontFamily,
                color: colors.textPrimary,
                fontSize: 16,
                marginBottom: 8,
              },
            ]}
          >
            Focus Tip
          </Text>
          <Text
            style={[
              styles.tipText,
              {
                fontFamily: theme.typography.body.fontFamily,
                color: colors.textSecondary,
                fontSize: 14,
                lineHeight: 20,
              },
            ]}
          >
            The hardest part is starting. Once you begin, your brain will follow.
            Keep your phone in another room and close the door.
          </Text>
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
  timerSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  distractionsSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  distractionsContent: {
    alignItems: 'flex-start',
  },
  distractionsLabel: {
    marginBottom: 4,
  },
  distractionsCount: {
    lineHeight: 28,
  },
  tipsSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tipTitle: {
    alignSelf: 'flex-start',
  },
  tipText: {
    alignSelf: 'flex-start',
  },
});
