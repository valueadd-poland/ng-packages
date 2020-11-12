const pack = require("./package");

module.exports = {
  name: pack.name,
  preset: "../../jest.config.js",
  snapshotSerializers: [
    "jest-preset-angular/build/AngularSnapshotSerializer.js",
    "jest-preset-angular/build/HTMLCommentSerializer.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/test.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: "\\.(html|svg)$",
      astTransformers: [
        "jest-preset-angular/build/InlineFilesTransformer",
        "jest-preset-angular/build/StripStylesTransformer",
      ],
    },
  },
};
