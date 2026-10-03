# VINASIG SI agent standards adoption

This documentation and directory-tooling repository adopts the `core` profile from [VINASIG Agent Standards](https://github.com/VINASIG/agent-standards), version 0.1.0 public preview.

| Field             | Reviewed value                                                     |
| ----------------- | ------------------------------------------------------------------ |
| Source repository | `VINASIG/agent-standards`                                          |
| Source commit     | `7c699d1dccd05c1dd2c4f0de4bb3abae23174ccd`                         |
| Profile           | `core`                                                             |
| Bundle SHA-256    | `bd59e07ba80969e9e5b6788a9438e81ba14a6e22ce121e6ef192ef89f54cd07f` |
| Owner provenance  | [.vinasig/provenance.json](../.vinasig/provenance.json)            |
| Managed file map  | [.vinasig/manifest.json](../.vinasig/manifest.json)                |

The clean source checkout was compared with the public remote before bundling. The installation preview was reviewed before importing the snapshot. `source.ref` is a content digest; the owner provenance records the separately verified Git commit.

The installer owns the marked block in [AGENTS.md](../AGENTS.md), the manifest, `.vinasig/standards/` and the workflow/dependency skills in `.agents/skills/`. Owner instructions outside the block specialize public-data handling, incomplete references and directory checks.

Use the reviewed installer for a snapshot update. Inspect the next source and bundle digest, review a dry run, then update the explicit target. Do not edit or format managed bytes manually, fetch a moving branch during a session, or change global Codex/MCP settings as part of adoption.

The copied source registry describes its original research context. Its references to private VINASIG archives are historical and do not describe the visibility of repositories published later.

`npm run check:standards` validates the provenance/manifest relationship, all 18 managed files, the instruction block, the root 8 KiB budget and the absence of a shadowing root override. The source installer's doctor passed its structural checks. Actual skill discovery in a fresh Codex session is `NOT_RUN`; file integrity does not prove runtime discovery.

Responsive, animation, SEO and browser-flow audits are `NOT_APPLICABLE` here because the repository has no web application. Consumers that render these references in a website must run their own web checks.

## Interface rules approved on 3 October 2026

The owner requested this standards update across VINASIG. LANG-004 requires natural punctuation, sentence case and custom list markers in authored interfaces. LANG-005 requires ordinary-reader language and limits parenthetical labels. Required code, URLs, times, regulatory identifiers, official names and user input retain their correct syntax.

## Header rules approved on 4 October 2026

The owner approved original transparent horizontal logos selected for the actual header surface under WEB-001. Keep the source asset bytes, proportions and internal artwork. Avoid white panels, padded or rounded cards and artwork effects. Maintain the accessible logo link and its usable target independently of image size.

This repository has no website header. Its core profile remains appropriate. The source guidance is updated for consuming websites without inventing a browser audit or changing archived asset bytes or directory data.
