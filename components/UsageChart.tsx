import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { AppUsageEntry } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface UsageChartProps {
  data: AppUsageEntry[];
  maxBarHeight?: number;
  style?: ViewStyle;
  showLabels?: boolean;
  limit?: number; // show only top N apps
}

export const UsageChart: React.FC<UsageChartProps> = ({
  data,
  maxBarHeight = 120,
  style,
  showLabels = true,
  limit = 5,
}) => {
  const { colors, theme } = useTheme();

  // Sort by time spent and take top N
  const sortedData = [...data]
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, limit);

  const maxTime = sortedData.length > 0 ? Math.max(...sortedData.map(d => d.timeSpent)) : 1;

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'social': return colors.accent;
      case 'entertainment': return colors.warning;
      case 'productivity': return colors.success;
      case 'communication': return colors.secondary;
      case 'study': return colors.primary;
      default: return colors.textTertiary;
    }
  };

  if (sortedData.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text
          style={[
            styles.emptyText,
            {
              fontFamily: theme.typography.body.fontFamily,
              color: colors.textTertiary,
            },
          ]}
        >
          No data yet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Bars — NOT centered, left-aligned with varied widths */}
      <View style={styles.barsContainer}>
        {sortedData.map((entry, index) => {
          const barHeight = (entry.timeSpent / maxTime) * maxBarHeight;
          const barColor = getCategoryColor(entry.category);

          return (
            <View key={entry.packageName} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: 36 + (index % 3) * 8, // varied widths — NOT uniform
                    backgroundColor: barColor,
                    borderRadius: theme.radii.sharp,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  },
                ]}
              >
                {/* Time label on top of bar */}
                {showLabels && (
                  <Text
                    style={[
                      styles.barLabel,
                      {
                        fontFamily: theme.typography.mono.fontFamily,
                        color: colors.textSecondary,
                        fontSize: 10,
                      },
                    ]}
                  >
                    {entry.timeSpent}m
                  </Text>
                )}
              </View>
              {/* App name below bar */}
              {showLabels && (
                <Text
                  style={[
                    styles.barName,
                    {
                      fontFamily: theme.typography.caption.fontFamily,
                      color: colors.textSecondary,
                      fontSize: 11,
                      marginTop: 4,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {entry.appName}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Summary stats — NOT a three-card grid */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text
            style={[
              styles.summaryValue,
              {
                fontFamily: theme.typography.mono.fontFamily,
                color: colors.textPrimary,
                fontSize: 18,
              },
            ]}
          >
            {sortedData.reduce((sum, d) => sum + d.timeSpent, 0)}m
          </Text>
          <Text
            style={[
              styles.summaryLabel,
              {
                fontFamily: theme.typography.caption.fontFamily,
                color: colors.textTertiary,
                fontSize: 11,
              },
            ]}
          >
            total tracked
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text
            style={[
              styles.summaryValue,
              {
                fontFamily: theme.typography.mono.fontFamily,
                color: colors.secondary,
                fontSize: 18,
              },
            ]}
          >
            {sortedData.length}
          </Text>
          <Text
            style={[
              styles.summaryLabel,
              {
                fontFamily: theme.typography.caption.fontFamily,
                color: colors.textTertiary,
                fontSize: 11,
              },
            ]}
          >
            apps tracked
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    height: 140,
    paddingLeft: 4,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    position: 'relative',
  },
  barLabel: {
    position: 'absolute',
    top: -18,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  barName: {
    textAlign: 'center',
    marginTop: 4,
  },
  summary: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
    paddingLeft: 4,
  },
  summaryItem: {
    alignItems: 'flex-start',
  },
  summaryValue: {
    lineHeight: 22,
  },
  summaryLabel: {
    lineHeight: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
  },
});
