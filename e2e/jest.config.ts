import { format } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();
const fileName = format(new Date(), 'yyyy-MM-dd-HH-mm');
process.env.JEST_HTML_REPORTER_FILE_NAME = `${fileName}.html`;

import type { Config } from 'jest';

const config: Config = {
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Optional: Alias configuration (if using path mappings)
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: `./reports/${fileName}.html`,
      },
    ],
  ],
  globalTeardown: './src/lib/globalTeardown.ts',
};

export default config;
