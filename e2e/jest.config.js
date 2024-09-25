/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // Optional: Alias configuration (if using path mappings)
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};