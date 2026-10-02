# Contributing

Read [AGENTS.md](AGENTS.md), [the data contract](docs/data-model.md) and [the standards adoption record](docs/standards.md) before changing the directory.

## Public inventory

- Edit `directory.json`; generate `ACCOUNTS.md` with `npm run directory:generate`.
- Preserve supplied platform names, handles and channels. Never infer a missing account or replace a member/user profile with an organization page.
- Keep incomplete records explicit. A directory update date is not account verification.
- Add public contact references only. Do not add sign-in associations, credentials, recovery data or administrative links.
- Use public read-only information for a reference lookup. Do not log in, send messages/email, join communities or change accounts as part of maintenance.

## Verification

Use the pinned [toolchain](docs/toolchain.md), install the committed lockfile with scripts disabled, then run:

```sh
npm run directory:generate
npm run check
npm test
```

Add relevant positive and failure cases when changing validation or rendering. Never weaken a schema, assertion or integrity pin to accept defective input. Review data, generated output and validation changes together. Snapshot updates follow the reviewed installer contract.

Keep temporary reports, bundles, fixtures and installer backups in ignored `output/` or the existing ignored backup location. Review the staged diff before an authorized commit; push the current branch and verify that commit's CI. Repository publication and external account changes follow the user's explicit task authorization.

Ordinary corrections go through [repository issues](https://github.com/VINASIG/vinasig-org-directory/issues). Sensitive findings follow [SECURITY.md](SECURITY.md).
