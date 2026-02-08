import { defineConfig } from '@shahrad/eslint-config';
import globals from 'globals';

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
          message: "Do not use 'as any'. Use a more specific type or 'unknown' instead.",
        },
      ],
    },
  }
);
