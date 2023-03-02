import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//const { resolve } = require('path');
const root = path.resolve(__dirname);
// module.exports = {
//   rootDir: root,
//   displayName: 'root-tests',
//   testMatch: ['<rootDir>/src/**/*.test.ts'],
//   testEnvironment: 'node',
//   clearMocks: true,
//   preset: 'ts-jest',
//   moduleNameMapper: {
//     '@src/(.*)': '<rootDir>/src/$1',
//     '@test/(.*)': '<rootDir>/test/$1',
//   }
// };

export default {
  rootDir: root,
  displayName: 'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1',
  }
};