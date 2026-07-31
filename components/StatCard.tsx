import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  style,
  onPress,
}) => {
  const { colors, theme } = useTheme();
  const valueColor = color || colors.primary;

  return (
    <Card
      style={[
        styles.card,
        {
          borderRadius: theme.radii.card,
        },
        style,
      ]}
      padding="sm"
      elevated
    >
      <View style={styles.content}>
        {/* Top row — title and icon, NOT centered */}
        <View style={styles.topRow}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.caption.fontFamily,
                color: colors.textSecondary,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              },
            ]}
          >
            {title}
          </Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>

        {/* Value — large, left-aligned */}
        <Text
          style={[
            styles.value,
            {
              fontFamily: theme.typography.mono.fontFamily,
              color: valueColor,
              fontSize: 28,
            },
          ]}
        >
          {value}
        </Text>

        {/* Subtitle — small, left-aligned */}
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                fontFamily: theme.typography.body.fontFamily,
                color: colors.textTertiary,
                fontSize: 12,
              },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  content: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    flex: 1,
  },
  icon: {
    flexShrink: 0,
  },
  value: {
    lineHeight: 32,
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 16,
  },
});
