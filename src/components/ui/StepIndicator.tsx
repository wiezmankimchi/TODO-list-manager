import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <View key={label} style={styles.stepWrapper}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isActive || isCompleted ? theme.primary : theme.border,
                },
              ]}
            >
              {isCompleted ? (
                <Text style={[styles.dotText, { color: theme.primaryForeground }]}>
                  ✓
                </Text>
              ) : (
                <Text
                  style={[
                    styles.dotText,
                    {
                      color: isActive ? theme.primaryForeground : theme.mutedForeground,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? theme.text : theme.mutedForeground,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {label}
            </Text>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor: isCompleted ? theme.primary : theme.border,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    marginLeft: 4,
  },
  connector: {
    height: 2,
    width: 20,
    marginHorizontal: 4,
  },
});
