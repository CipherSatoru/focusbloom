import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    updateSettings({ [key]: value } as any);
  };

  const handleDurationChange = (newDuration: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
    updateSettings({ defaultStudyDuration: newDuration });
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Settings"
        subtitle="Customize your focus"
        leftAction={
          <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, opacity: 0.5 }}>←</Text>
          </TouchableOpacity>
        }
      />

      {/* Study Mode settings — NOT centered */}
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
          Study Mode
        </Text>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card, marginBottom: 12 }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Default duration
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                {settings.defaultStudyDuration} minutes
              </Text>
            </View>
            <View style={styles.durationControls}>
              <TouchableOpacity
                onPress={() => handleDurationChange(Math.max(5, settings.defaultStudyDuration - 5))}
                style={[
                  styles.durationButton,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: theme.radii.sharp,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 16,
                    },
                  ]}
                >
                  −
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDurationChange(settings.defaultStudyDuration + 5)}
                style={[
                  styles.durationButton,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: theme.radii.sharp,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 16,
                    },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Block notifications
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                Silence distracting app notifications during study
              </Text>
            </View>
            <Switch
              value={settings.blockNotifications}
              onValueChange={(value) => handleToggle('blockNotifications', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={settings.blockNotifications ? '#FFFFFF' : colors.textTertiary}
            />
          </View>
        </Card>
      </View>

      {/* Emergency Unlock settings — NOT centered */}
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
          Emergency Unlock
        </Text>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card, marginBottom: 12 }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Max unlocks per day
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                {settings.maxEmergencyUnlocksPerDay} unlock{settings.maxEmergencyUnlocksPerDay !== 1 ? 's' : ''} allowed
              </Text>
            </View>
            <View style={styles.durationControls}>
              <TouchableOpacity
                onPress={() => updateSettings({ maxEmergencyUnlocksPerDay: Math.max(0, settings.maxEmergencyUnlocksPerDay - 1) })}
                style={[
                  styles.durationButton,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: theme.radii.sharp,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 16,
                    },
                  ]}
                >
                  −
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateSettings({ maxEmergencyUnlocksPerDay: settings.maxEmergencyUnlocksPerDay + 1 })}
                style={[
                  styles.durationButton,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderRadius: theme.radii.sharp,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.durationButtonText,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: colors.textPrimary,
                      fontSize: 16,
                    },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Require physical activity
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                Earn unlocks through steps or activity
              </Text>
            </View>
            <Switch
              value={settings.requirePhysicalActivity}
              onValueChange={(value) => handleToggle('requirePhysicalActivity', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={settings.requirePhysicalActivity ? '#FFFFFF' : colors.textTertiary}
            />
          </View>
        </Card>
      </View>

      {/* General settings — NOT centered */}
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
          General
        </Text>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card, marginBottom: 12 }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Study reminders
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                Get reminded to focus at scheduled times
              </Text>
            </View>
            <Switch
              value={settings.studyReminders}
              onValueChange={(value) => handleToggle('studyReminders', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={settings.studyReminders ? '#FFFFFF' : colors.textTertiary}
            />
          </View>
        </Card>

        <Card padding="md" elevated style={{ borderRadius: theme.radii.card }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingLabel,
                  {
                    fontFamily: theme.typography.body.fontFamily,
                    color: colors.textPrimary,
                    fontSize: 15,
                  },
                ]}
              >
                Motivational quotes
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  {
                    fontFamily: theme.typography.caption.fontFamily,
                    color: colors.textSecondary,
                    fontSize: 12,
                  },
                ]}
              >
                Show quotes during study sessions
              </Text>
            </View>
            <Switch
              value={settings.motivationalQuotes}
              onValueChange={(value) => handleToggle('motivationalQuotes', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={settings.motivationalQuotes ? '#FFFFFF' : colors.textTertiary}
            />
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
  sectionTitle: {
    alignSelf: 'flex-start',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    marginBottom: 2,
  },
  settingDescription: {
    lineHeight: 16,
  },
  durationControls: {
    flexDirection: 'row',
    gap: 6,
  },
  durationButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    lineHeight: 20,
  },
});
