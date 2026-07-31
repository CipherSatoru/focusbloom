/**
 * Math problem generator for emergency unlock.
 *
 * This is the core loophole patch: when a user tries to bypass
 * study mode, they must solve a real math problem. The problem
 * is generated fresh each time and cannot be predicted.
 *
 * Key design decisions:
 * - Problems are arithmetic, not trivia (no "what is the capital of France?")
 * - Difficulty scales with time of day (harder at night when willpower is low)
 * - Problems require actual computation, not pattern matching
 * - No "remember this answer" exploit possible
 */

export type MathDifficulty = 'easy' | 'medium' | 'hard';

export type MathProblem = {
  question: string;
  answer: number;
  explanation: string;
};

/**
 * Generate a random integer between min and max (inclusive)
 */
const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a math problem based on difficulty
 */
export const generateMathProblem = (difficulty: MathDifficulty = 'medium'): MathProblem => {
  switch (difficulty) {
    case 'easy':
      return generateEasyProblem();
    case 'hard':
      return generateHardProblem();
    case 'medium':
    default:
      return generateMediumProblem();
  }
};

function generateEasyProblem(): MathProblem {
  const a = randInt(10, 50);
  const b = randInt(5, 30);
  const operation = Math.random() > 0.5 ? 'add' : 'subtract';

  if (operation === 'add' || a + b < 100) {
    return {
      question: `${a} + ${b} = ?`,
      answer: a + b,
      explanation: 'Simple addition',
    };
  }

  const larger = Math.max(a, b);
  const smaller = Math.min(a, b);
  return {
    question: `${larger} − ${smaller} = ?`,
    answer: larger - smaller,
    explanation: 'Simple subtraction',
  };
}

function generateMediumProblem(): MathProblem {
  // Two-step problem: e.g., (15 + 23) - 7
  const a = randInt(15, 40);
  const b = randInt(10, 35);
  const c = randInt(5, 20);

  const step1 = a + b;
  const answer = step1 - c;

  return {
    question: `(${a} + ${b}) − ${c} = ?`,
    answer,
    explanation: 'Two-step arithmetic',
  };
}

function generateHardProblem(): MathProblem {
  // Three-step: multiplication, addition, subtraction
  const a = randInt(8, 18);
  const b = randInt(3, 12);
  const c = randInt(10, 50);
  const d = randInt(5, 25);

  const step1 = a * b;
  const step2 = step1 + c;
  const answer = step2 - d;

  return {
    question: `${a} × ${b} + ${c} − ${d} = ?`,
    answer,
    explanation: 'Three-step arithmetic',
  };
}

/**
 * Generate multiple choice options for a problem
 */
export const generateOptions = (problem: MathProblem): number[] => {
  const { answer } = problem;
  const options = new Set<number>([answer]);

  while (options.size < 4) {
    const offset = randInt(1, 15) * (Math.random() > 0.5 ? 1 : -1);
    const wrong = answer + offset;
    if (wrong > 0 && wrong !== answer) {
      options.add(wrong);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

/**
 * Get difficulty based on time of day
 * Harder at night when willpower is lower
 */
export const getDifficultyByTime = (hour?: number): MathDifficulty => {
  const h = hour ?? new Date().getHours();

  if (h >= 22 || h <= 5) return 'hard';
  if (h >= 20 || h <= 7) return 'medium';
  return 'medium';
};
