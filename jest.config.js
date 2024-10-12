export default {
  rootDir: "./",
  preset: "ts-jest",
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './__tests__/tsconfig.jest.json'
    }]
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  testEnvironment: "node"
};
