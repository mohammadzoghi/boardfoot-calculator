// filepath: /Users/mohammad.zoghi/PetProjects/boardfoot-calculator/utils/validation.ts

/**
 * Sanitizes a string or number input to a valid number, or returns 0 if invalid.
 * @param input The input value to sanitize.
 */
export function sanitizeNumberInput(input: string | number): number {
  const num = typeof input === 'number' ? input : parseFloat(input);
  return isNaN(num) ? 0 : num;
}

