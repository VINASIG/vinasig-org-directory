# VINASIG Organization Directory

The public VINASIG directory of organization account references, profile links and contact channels.

- Browse [ACCOUNTS.md](ACCOUNTS.md) for the human-readable inventory.
- Read [directory.json](directory.json) for structured data.
- Use [directory.schema.json](directory.schema.json) and [the data contract](docs/data-model.md) when maintaining or integrating the directory.

The inventory was supplied by the maintainer on 27 September 2026. A listed channel is a recorded reference; account ownership, current availability and mailbox deliverability have not been independently verified. Incomplete references are labeled explicitly.

## Directory scope

The directory covers the organization and website, email contacts, social/community accounts, and developer/publishing platforms. Public handles and contact addresses are the intended content. Keep sign-in associations, credentials, recovery information and private account administration outside this repository.

Yahoo currently has a supplied handle but no public Yahoo profile or Yahoo contact address. Packagist has no supplied account identifier. These remain incomplete entries. The supplied LinkedIn member profile and npm user profile are retained as supplied; no company page or organization namespace is inferred.

## Maintain the inventory

`directory.json` is the source of truth. `ACCOUNTS.md` is generated and checked against the data in CI. Use Node 24.21.0 and npm 12.2.0.

```sh
npx --yes npm@12.2.0 ci --ignore-scripts
npx --yes npm@12.2.0 run directory:generate
npx --yes npm@12.2.0 run check
npx --yes npm@12.2.0 test
```

After the pinned npm version is available, ordinary `npm` commands are equivalent. Update the data, regenerate the document, and review the diff together. The checker rejects schema violations, duplicate identities/channels, unsafe URLs, secret-like values and generated-document drift. It does not sign in, contact an account, send email or validate remote availability.

See [contributing](CONTRIBUTING.md) and [security reporting](SECURITY.md). Sensitive findings use GitHub's private reporting channel.

## VINASIG SI agent workflow

[AGENTS.md](AGENTS.md) specializes VINASIG SI agent standards for public directory work. This repository imports the reviewed `core` snapshot of [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards). [Snapshot provenance](docs/standards.md) records the source commit, bundle digest and verification boundary.

The repository has no web application. Its checks validate the data, generated documentation, local tooling and managed instruction files. Node dependencies are development tools, not dependencies for a consumer reading the JSON.

## Repository map

| Path                                                                           | Purpose                                                                |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| [directory.json](directory.json)                                               | Maintainer-supplied account inventory and explicit incomplete records. |
| [directory.schema.json](directory.schema.json)                                 | Versioned JSON Schema contract with no undeclared fields.              |
| [ACCOUNTS.md](ACCOUNTS.md)                                                     | Generated inventory with public profile and contact links.             |
| [scripts](scripts), [tests](tests)                                             | Data/rendering, security-boundary and standards checks.                |
| [docs/data-model.md](docs/data-model.md)                                       | Field meanings, status semantics and maintenance rules.                |
| [docs/toolchain.md](docs/toolchain.md)                                         | Verified and pinned development tool versions.                         |
| [docs/audits/publication-2026-10-03.md](docs/audits/publication-2026-10-03.md) | Preparation evidence and limits.                                       |

[Directory checks](https://github.com/VINASIG/vinasig-org-directory/actions/workflows/check.yml) run on Linux and Windows. Reports live in ignored `output/checks/` and CI artifacts. [Dependabot](.github/dependabot.yml) proposes reviewed updates; it does not merge them automatically.

## Related VINASIG repositories

- [Agent Standards](https://github.com/VINASIG/agent-standards) defines reusable SI agent policies and workflows.
- [Web Design System](https://github.com/VINASIG/web-design-system) defines interface guidance for VINASIG web projects.
- [Brand Assets](https://github.com/VINASIG/vinasig-brand-assets) preserves the identity assets and typography.

See [CHANGELOG.md](CHANGELOG.md) for directory changes.
