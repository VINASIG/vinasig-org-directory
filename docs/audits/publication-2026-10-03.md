# Public preparation audit

Scope: standardize and publish the existing `VINASIG/vinasig-org-directory` repository under the owner's task authorization. Preparation date: 3 October 2026.

## Baseline

The checkout was clean on `main`, with local and remote HEAD at `aca6762b0522a0be4e54773240dff208aeed91eb`. It had one commit and two tracked Markdown files, `README.md` and `ACCOUNTS.md`, with no application or existing check infrastructure.

The original inventory contains 34 platform references. The structured inventory retains all 34. Its 32 listed channels comprise 29 URLs and three unique public contact email addresses. Yahoo and Packagist are incomplete.

Yahoo's supplied Gmail/sign-in association is not presented as a Yahoo public mailbox. Its handle remains, and the original Gmail contact remains its own entry. Packagist's generic `/profile/` endpoint is not a profile and is not listed as an account URL. LinkedIn's supplied member URL and npm's supplied user URL remain unchanged. No platform account, company page or organization namespace is inferred.

A scoped scan of both original files across the one-commit history found no recognized private-key headers, provider-token signatures or personal Windows user paths. The original contact identifiers remain available in Git history. This check is scoped and does not certify every secret format.

## Integration

The public directory uses a committed JSON Schema plus semantic validation and a deterministic Markdown renderer. CI checks generated drift instead of rewriting a baseline. Regression cases cover duplicates, unsafe inputs, incomplete references and snapshot ownership.

The reviewed Agent Standards 0.1.0 `core` snapshot comes from public commit `c9d33c73a89edaf1773fa4d31f1c7258e549b7b1`, with bundle digest `ad5dcbe4601a9a3668d3433330a582e6d780b8f2527e1dcc8cfbb93f8f264870`. Source and remote were compared before bundling; the install preview was reviewed. The source doctor passed 21 structural checks and explicitly left fresh-session discovery unrun.

## Verification

| Check                                                  | Preparation result                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| Original inventory reconciliation                      | PASS; all 34 references retained with two explicit incomplete records |
| Scoped original-history scan                           | PASS within the stated patterns                                       |
| Schema, semantic and generated-document gates          | PASS; 34 entries, 32 listed channels, two incomplete records          |
| Typecheck, typed lint and formatting                   | PASS; strict TypeScript and typed ESLint, zero warnings               |
| Regression tests                                       | PASS; 20 tests, zero failures and zero skipped tests                  |
| Dependency audit                                       | PASS; zero reported vulnerabilities in the installed dependency tree  |
| Source standards doctor                                | PASS for structural checks                                            |
| Fresh Codex session discovery                          | NOT_RUN; structural verification does not prove runtime discovery     |
| External profile ownership and mailbox deliverability  | NOT_RUN; references remain maintainer-supplied                        |
| Web responsive, animation, SEO and browser-flow audits | NOT_APPLICABLE; this repository has no web application                |

Local reports live in ignored `output/checks/`. CI retains equivalent reports on Linux and Windows. Exact-commit CI, private vulnerability reporting and anonymous page/data/archive access are verified after push/publication and included in the final handoff.

Publication changes repository visibility and metadata. It does not change platform accounts, add a general license, create a release or rewrite history.
