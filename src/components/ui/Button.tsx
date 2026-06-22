import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  label,
  labelStyle,
  style,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  // Dynamically resolve styles based on theme and variant
  const getButtonStyles = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8, // Rounded-md in shadcn
      borderWidth: 1,
      borderColor: 'transparent',
    };

    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'default':
        variantStyle = {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
        break;
      case 'destructive':
        variantStyle = {
          backgroundColor: theme.destructive,
          borderColor: theme.destructive,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderColor: theme.border,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
      case 'link':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        break;
    }

    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'default':
        sizeStyle = { paddingHorizontal: 16, paddingVertical: 10 };
        break;
      case 'sm':
        sizeStyle = { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 };
        break;
      case 'lg':
        sizeStyle = { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 };
        break;
      case 'icon':
        sizeStyle = { width: 40, height: 40, padding: 0 };
        break;
    }

    return { ...base, ...variantStyle, ...sizeStyle };
  };

  const getLabelStyles = (): TextStyle => {
    const base: TextStyle = {
      fontSize: size === 'sm' ? 14 : 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    let variantLabelStyle: TextStyle = {};
    switch (variant) {
      case 'default':
        variantLabelStyle = { color: theme.primaryForeground };
        break;
      case 'destructive':
        variantLabelStyle = { color: theme.destructiveForeground };
        break;
      case 'outline':
      case 'ghost':
        variantLabelStyle = { color: theme.text };
        break;
      case 'secondary':
        variantLabelStyle = { color: theme.secondaryForeground };
        break;
      case 'link':
        variantLabelStyle = {
          color: theme.text,
          textDecorationLine: 'underline',
        };
        break;
    }

    return { ...base, ...variantLabelStyle };
  };

  const buttonStyle = getButtonStyles();
  const textStyle = getLabelStyles();

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.5 },
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' || variant === 'destructive' ? theme.primaryForeground : theme.text}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          {label ? (
            <Text style={[textStyle, labelStyle]}>{label}</Text>
          ) : (
            children
          )}
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
