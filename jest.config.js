/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** Jest configuration for client components, shared libraries, and API-boundary tests. */
const customJestConfig = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.{spec,test}.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '\\.e2e\\.spec\\.[jt]sx?$'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};

module.exports = createJestConfig(customJestConfig);
