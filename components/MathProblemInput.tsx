import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import * as Haptics from 'expo-haptics';

interface MathProblemInputProps {
  onSolve: (correct: boolean) => void;
  difficulty: 'easy' | 'medium' | 'hard';
  style?: ViewStyle;
}

type MathProblem = {
  question: string;
  answer: number;
  options: number[];
};

export const MathProblemInput: React.FC<MathProblemInputProps> = ({
  onSolve,
  difficulty,
  style,
}) => {
  const { colors, theme } = useTheme();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateProblem = (): MathProblem => {
    const rng = Math.random;
    let a: number, b: number, answer: number, question: string;

    switch (difficulty) {
      case 'hard': {
        // Multiplication with larger numbers
        a = Math.floor(rng() * 20) + 10;
        b = Math.floor(rng() * 15) + 5;
        answer = a * b;
        question = `${a} × ${b}`;
        break;
      }
      case 'medium': {
        // Two-step: addition then multiplication
        a = Math.floor(rng() * 30) + 10;
        b = Math.floor(rng() * 20) + 5;
        const c = Math.floor(rng() * 10) + 3;
        answer = a + b - c;
        question = `${a} + ${b} − ${c}`;
        break;
      }
      case 'easy':
      default: {
        // Simple addition/subtraction
        a = Math.floor(rng() * 50) + 10;
        b = Math.floor(rng() * 30) + 5;
        answer = a + b;
        question = `${a} + ${b}`;
        break;
      }
    }

    // Generate wrong options
    const options = new Set<number>([answer]);
    while (options.size < 4) {
      const wrong = answer + Math.floor(rng() * 20) - 10;
      if (wrong !== answer && wrong > 0) {
        options.add(wrong);
      }
    }

    return {
      question,
      answer,
      options: Array.from(options).sort(() => rng() - 0.5),
    };
  };

  useEffect(() => {
    setProblem(generateProblem());
    setSelectedAnswer(null);
  }, [difficulty]);

  const handleSubmit = () => {
    if (selectedAnswer === null || !problem) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Medium);

    const correct = selectedAnswer === problem.answer;

    setTimeout(() => {
      onSolve(correct);
    }, 300);
  };

  if (!problem) {
    return null;
  }

  return (
    <Card style={style} header="Solve to unlock" elevated>
      <View style={styles.content}>
        {/* Problem — large, left-aligned */}
        <Text
          style={[
            styles.question,
            {
              fontFamily: theme.typography.mono.fontFamily,
              color: colors.textPrimary,
              fontSize: 28,
            },
          ]}
        >
          {problem.question} = ?
        </Text>

        {/* Options — NOT a uniform grid, varied positions */}
        <View style={styles.optionsContainer}>
          {problem.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === problem.answer;

            return (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setSelectedAnswer(option);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle_Light);
                }}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surfaceAlt,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.border,
                    borderRadius: theme.radii.button,
                    // Varied widths — NOT uniform
                    width: 60 + (index % 3) * 12,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      fontFamily: theme.typography.mono.fontFamily,
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontSize: 16,
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit button */}
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={selectedAnswer === null || isSubmitting}
          variant="primary"
          size="md"
          style={styles.submitButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  question: {
    lineHeight: 32,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  option: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  optionText: {
    lineHeight: 20,
  },
  submitButton: {
    alignSelf: 'flex-start',
  },
});
