import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { colors, theme } = useTheme();

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(event);
  };

  const getVariantStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
            fontFamily: theme.typography.body.fontFamily,
            fontWeight: '600',
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondary,
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
            fontFamily: theme.typography.body.fontFamily,
            fontWeight: '600',
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.borderStrong,
          },
          text: {
            color: colors.textPrimary,
            fontFamily: theme.typography.body.fontFamily,
            fontWeight: '500',
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
            borderWidth: 0,
          },
          text: {
            color: '#FFFFFF',
            fontFamily: theme.typography.body.fontFamily,
            fontWeight: '600',
          },
        };
      case 'ghost':
      default:
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: {
            color: colors.textSecondary,
            fontFamily: theme.typography.body.fontFamily,
            fontWeight: '500',
          },
        };
    }
  };

  const getSizeStyle = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            minHeight: 36,
          },
          text: {
            fontSize: 13,
            lineHeight: 18,
          },
        };
      case 'lg':
        return {
          container: {
            paddingHorizontal: 26,
            paddingVertical: 16,
            minHeight: 56,
          },
          text: {
            fontSize: 17,
            lineHeight: 24,
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            minHeight: 44,
          },
          text: {
            fontSize: 15,
            lineHeight: 22,
          },
        };
    }
  };

  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          borderRadius: theme.radii.button,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        variantStyle.container,
        sizeStyle.container,
        style,
      ]}
    >
      {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
      <Text
        style={[
          styles.text,
          variantStyle.text,
          sizeStyle.text,
          textStyle,
        ]}
      >
        {title}
      </Text>
      {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
