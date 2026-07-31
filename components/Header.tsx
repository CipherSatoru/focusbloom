import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
  titleStyle,
}) => {
  const { colors, theme } = useTheme();

  return (
    <>
      <StatusBar style={colors.background === '#1A1A18' ? 'light' : 'dark'} />
      <View style={[styles.container, style]}>
        {leftAction && <View style={styles.leftAction}>{leftAction}</View>}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.heading.fontFamily,
                color: colors.textPrimary,
                fontSize: 26,
              },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  fontFamily: theme.typography.body.fontFamily,
                  color: colors.textSecondary,
                  fontSize: 14,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    width: '100%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    lineHeight: 30,
  },
  subtitle: {
    lineHeight: 18,
    marginTop: 2,
  },
  leftAction: {
    marginRight: 12,
  },
  rightAction: {
    marginLeft: 12,
  },
});
