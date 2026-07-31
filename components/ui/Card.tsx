import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  header?: string;
  headerStyle?: TextStyle;
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
  variant?: 'default' | 'surface' | 'soft';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  header,
  headerStyle,
  padding = 'md',
  elevated = false,
  variant = 'default',
}) => {
  const { colors, theme } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'sm': return theme.spacing.sm;
      case 'lg': return theme.spacing.lg;
      default: return theme.spacing.md;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'surface':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        };
      case 'soft':
        return {
          backgroundColor: colors.secondarySoft,
          borderColor: colors.secondarySoft,
        };
      default:
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: theme.radii.card,
          padding: getPadding(),
          borderWidth: 1,
        },
        elevated ? theme.shadows.md : undefined,
        getVariantStyle(),
        style,
      ]}
    >
      {header && (
        <Text
          style={[
            styles.header,
            {
              fontFamily: theme.typography.heading.fontFamily,
              fontWeight: String(theme.typography.heading.fontWeight),
              color: colors.textPrimary,
              marginBottom: theme.spacing.sm,
              fontSize: 18,
            },
            headerStyle,
          ]}
        >
          {header}
        </Text>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  header: {
    width: '100%',
  },
});
