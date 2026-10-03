# Toolchain selection

Official registry and release metadata were checked on 3 October 2026. Consumers of the public JSON or Markdown do not need these development tools.

| Tool              | Latest verified                            | Selected | Compatibility decision                                                                                         |
| ----------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| Node.js           | Latest verified LTS in major 24 is 24.21.0 | 24.21.0  | Supported LTS; pinned runtime for native TypeScript execution.                                                 |
| npm               | 12.2.0                                     | 12.2.0   | Its engine range accepts Node 24.21.0.                                                                         |
| TypeScript        | 7.0.2                                      | 6.0.3    | typescript-eslint 8.71.0 requires `>=4.8.4 <6.1.0`. Review a compatible typed-lint release before moving to 7. |
| typescript-eslint | 8.71.0                                     | 8.71.0   | Current compatible typed-lint release with the strict preset.                                                  |
| ESLint            | 10.11.0                                    | 10.11.0  | Accepted by typed-lint peer requirements.                                                                      |
| @eslint/js        | 10.0.1                                     | 10.0.1   | Compatible with ESLint 10.                                                                                     |
| @types/node       | Latest verified major 24 is 24.19.1        | 24.19.1  | Types follow the runtime major.                                                                                |
| Prettier          | 3.9.9                                      | 3.9.9    | Owner files only; generated and managed bytes have separate integrity checks.                                  |
| Ajv               | 8.20.0                                     | 8.20.0   | Strict JSON Schema draft 2020-12 validation before semantic checks.                                            |

Sources: [Node.js release index](https://nodejs.org/dist/index.json), official npm metadata for [npm](https://registry.npmjs.org/npm/latest), [TypeScript](https://registry.npmjs.org/typescript/latest), [typescript-eslint](https://registry.npmjs.org/typescript-eslint/latest), [ESLint](https://registry.npmjs.org/eslint/latest), [@eslint/js](https://registry.npmjs.org/@eslint/js/latest), [Node types](https://registry.npmjs.org/@types/node), [Prettier](https://registry.npmjs.org/prettier/latest) and [Ajv](https://registry.npmjs.org/ajv/latest). The [Ajv schema guide](https://ajv.js.org/json-schema.html) documents its draft 2020-12 class.

The toolchain uses strict type checking, unchecked-index protection, exact optional properties and typed lint with zero warnings. All development dependencies use exact versions and a committed lockfile. The package is private tooling and is not published to npm. The owner selected GPL-3.0-or-later for these tools, ODbL-1.0 for the directory database and CC-BY-SA-4.0 for authored documentation. See [the material map](../LICENSES.md).

Local verification reuses the available project-local Node 24.21.0 runtime that was checked against the official archive checksum during the preceding VINASIG publication work. Global tooling settings are unchanged. npm is explicitly bootstrapped with `npx --yes npm@12.2.0`.

## GitHub Actions

Exact official tag commits were rechecked:

| Action                                                                                    | Release | Commit                                     |
| ----------------------------------------------------------------------------------------- | ------- | ------------------------------------------ |
| [actions/checkout](https://github.com/actions/checkout/releases/tag/v7.0.1)               | 7.0.1   | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| [actions/setup-node](https://github.com/actions/setup-node/releases/tag/v7.0.0)           | 7.0.0   | `820762786026740c76f36085b0efc47a31fe5020` |
| [actions/upload-artifact](https://github.com/actions/upload-artifact/releases/tag/v7.0.1) | 7.0.1   | `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a` |

Dependabot proposes weekly dependency and action updates. There is no automatic merge policy. Changes to the schema, verification semantics and managed snapshot require explicit review; dependency updates do not authorize them.
