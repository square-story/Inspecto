import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
};

export default config;
