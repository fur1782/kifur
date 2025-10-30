import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: [
      'node_modules/**',
      'data/**',
      'dist/**',
      'coverage/**',
      'client-test/html/**',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-console': 'off',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/order': 'off',
      eqeqeq: ['error', 'always'],
      'no-undef': 'error',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs'],
        },
      },
    },
  },
  {
    files: ['client-test/html/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
  {
    files: ['client-test/js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
