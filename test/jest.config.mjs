import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const { resolve } = require('path');
const root = path.resolve(__dirname, '..');
const rootConfig = await import(`${root}/jest.config.mjs`);

//import rootConfig from `${root}/jest.config.js`.normalize();

// module.exports = {...rootConfig, ...{
//   rootDir: root,
//   displayName: "end2end-tests",
//   setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
//   testMatch: ["<rootDir>/test/**/*.test.ts"]
// }}

export default {...rootConfig, ...{
  rootDir: root,
  displayName: "end2end-tests",
  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
  testMatch: ["<rootDir>/test/**/*.test.ts"]
}}