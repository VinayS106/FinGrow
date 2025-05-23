export default {
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
      "src/Components/**/*.{tsx}",
      "src/Forms/**/*.{tsx}",  
      "src/Views/**/*.{tsx}",  
      "!<rootDir>/src/index.tsx"
    ],
    coveragePathIgnorePatterns: ["<rootDir>/src/index.tsx"],
    testMatch: [
      "<rootDir>/src/tests/*.test.tsx",
    ],
};
  