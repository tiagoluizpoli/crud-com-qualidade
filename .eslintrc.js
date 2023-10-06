module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
    'cypress/globals': true,
  },
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint',
    'cypress',
    'chai-friendly',
    'no-only-tests',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:chai-friendly/recommended',
    'plugin:cypress/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/', '_explicacoes/'],
  // Cherry of the Cake
  rules: {
    'no-only-tests/no-only-tests': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        printWidth: 80,
        semi: true,
        doubleQuote: false,
        jsxSingleQuote: true,
        singleQuote: true,
        useTabs: false,
        tabWidth: 2,
      },
    ],
  },
};
