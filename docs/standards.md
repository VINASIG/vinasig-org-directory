# VINASIG SI agent standards adoption

This documentation and directory-tooling repository adopts the `core` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards), version 0.1.0 public preview.

| Field             | Reviewed value                                                     |
| ----------------- | ------------------------------------------------------------------ |
| Source repository | `VINASIG/agent-standards`                                          |
| Source commit     | `c9d33c73a89edaf1773fa4d31f1c7258e549b7b1`                         |
| Profile           | `core`                                                             |
| Bundle SHA-256    | `ad5dcbe4601a9a3668d3433330a582e6d780b8f2527e1dcc8cfbb93f8f264870` |
| Owner provenance  | [.vinasig/provenance.json](../.vinasig/provenance.json)            |
| Managed file map  | [.vinasig/manifest.json](../.vinasig/manifest.json)                |

The clean source checkout was compared with the public remote before bundling. The installation preview was reviewed before importing the snapshot. `source.ref` is a content digest; the owner provenance records the separately verified Git commit.

The installer owns the marked block in [AGENTS.md](../AGENTS.md), the manifest, `.vinasig/standards/` and the workflow/dependency skills in `.agents/skills/`. Owner instructions outside the block specialize public-data handling, incomplete references and directory checks.

Use the reviewed installer for a snapshot update. Inspect the next source and bundle digest, review a dry run, then update the explicit target. Do not edit or format managed bytes manually, fetch a moving branch during a session, or change global Codex/MCP settings as part of adoption.

The copied source registry describes its original research context. Its references to private VINASIG archives are historical and do not describe the visibility of repositories published later.

`npm run check:standards` validates the provenance/manifest relationship, all 18 managed files, the instruction block, the root 8 KiB budget and the absence of a shadowing root override. The source installer's doctor passed its structural checks. Actual skill discovery in a fresh Codex session is `NOT_RUN`; file integrity does not prove runtime discovery.

Responsive, animation, SEO and browser-flow audits are `NOT_APPLICABLE` here because the repository has no web application. Consumers that render these references in a website must run their own web checks.
