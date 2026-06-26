// ESLint flat config for highland-review-site.
//
// Wiring notes:
// - Base ruleset is the mikey-pro React preset (@mikey-pro/eslint-config-react),
//   which bundles the core mikey-pro guardrails plus React/JSX/a11y rules on top
//   of ESLint 10. We re-use it verbatim via the spread below.
// - The preset's TypeScript layer enables type-checked rules (project: true), so
//   eslint resolves types from tsconfig.json. No extra wiring needed.
// - The preset attaches the eslint-plugin-jest ruleset to *.test.ts files. This
//   project uses Vitest, not Jest, so the trailing override block below turns the
//   Jest plugin rules off for test files and registers the Vitest/jsdom globals.
// eslint-disable-next-line import-x/no-extraneous-dependencies -- mikey-pro shim: config preset is a devDep
import reactConfig from '@mikey-pro/eslint-config-react';

export default [
  ...reactConfig,
  {
    // The preset does not type-aware-lint config files; keep them out of the
    // type-checked program to avoid "file not in project" parser errors.
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  {
    // Vitest test files: drop the Jest-plugin expectations and supply test
    // globals so describe/it/expect/vi resolve without import.
    files: ['**/*.test.ts', '**/*.test.tsx', 'src/test/**/*.ts'],
    languageOptions: {
      globals: {
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
    rules: {
      'jest/consistent-test-it': 'off',
      'jest/no-deprecated-functions': 'off',
      'jest/no-hooks': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-importing-jest-globals': 'off',
      'jest/require-hook': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/unbound-method': 'off',
      'jest/valid-title': 'off',
    },
  },
];
