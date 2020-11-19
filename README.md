# ValueAdd Angular Packages

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![build](https://github.com/valueadd-poland/ng-packages/workflows/MASTER%20CI/badge.svg)](https://github.com/valueadd-poland/ng-packages/actions?query=workflow%3A%22MASTER+CI%22)

A collection of packages, modules and utilities for JavaScript developers.

| Package             | Description                                   | Version                                                                                                                                   | Changelog                                                |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Validation messages | Lib to handle validation messages in Angular. | [![version](https://img.shields.io/npm/v/@valueadd/validation-messages.svg)](https://www.npmjs.com/package/@valueadd/validation-messages) | [changelog](./packages/validation-messages/CHANGELOG.md) |
| Linking tool        | Generate links for routing across the app     | [![version](https://img.shields.io/npm/v/@valueadd/linking-tool.svg)](https://www.npmjs.com/package/@valueadd/linking-tool)               | [changelog](./packages/validation-messages/CHANGELOG.md) |

## Development

### Setup

- `$ npm install`
- `$ npm run lerna bootstrap`

### Publish packages

- `npm run lerna version -- --conventional-commits`
- `npm run lerna publish from-git`
