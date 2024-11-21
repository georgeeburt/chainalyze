import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': ['ts-jest', {
      useESM: true
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/client/'],
  moduleFileExtensions: ['js', 'ts', 'json'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};

export default config;