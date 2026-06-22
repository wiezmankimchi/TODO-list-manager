import React from 'react';
import { View, Text, StyleSheet, type ViewProps, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export function Card({ style, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

export function CardTitle({ style, ...props }: TextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        styles.cardTitle,
        {
          color: theme.cardForeground,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardDescription({ style, ...props }: TextProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        styles.cardDescription,
        {
          color: theme.mutedForeground,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardContent({ style, ...props }: ViewProps) {
  return <View style={[styles.cardContent, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[styles.cardFooter, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignSelf: 'stretch',
  },
  cardHeader: {
    marginBottom: 12,
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  cardContent: {
    // Basic wrapper
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
});
