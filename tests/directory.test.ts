import assert from "node:assert/strict";
import {
  appendFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  createValidator,
  loadDirectory,
  renderDirectory,
  validateDirectory,
  verifyDirectory,
} from "../scripts/directory.ts";
import type { Directory } from "../scripts/directory.ts";
import { verifyStandards } from "../scripts/check-standards.ts";
import { localPath, record, repositoryRoot, text } from "../scripts/local.ts";

const schema = await createValidator();
const current = await loadDirectory();

function changed(): Directory {
  return structuredClone(current);
}
function first(data: Directory) {
  const entry = data.entries[0];
  assert(entry);
  return entry;
}

async function fixture(): Promise<string> {
  const parent = await localPath(repositoryRoot, "output/tests", true);
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(path.join(parent, "directory-"));
  for (const folder of [".agents", ".vinasig/standards"]) {
    await mkdir(path.dirname(path.join(root, folder)), { recursive: true });
    await cp(path.join(repositoryRoot, folder), path.join(root, folder), {
      recursive: true,
    });
  }
  for (const file of [
    "directory.json",
    "directory.schema.json",
    "ACCOUNTS.md",
    "AGENTS.md",
    ".vinasig/manifest.json",
    ".vinasig/provenance.json",
  ])
    await cp(path.join(repositoryRoot, file), path.join(root, file));
  return root;
}

await test("the current 34-entry inventory, generated document and core snapshot pass", async () => {
  const report = await verifyDirectory();
  assert.equal(report.entries, 34);
  assert.equal(report.listed, 32);
  assert.equal(report.profileUrls, 29);
  assert.equal(report.contactEmails, 3);
  assert.deepEqual(report.incomplete, ["yahoo", "packagist"]);
  const standards = await verifyStandards();
  assert.equal(standards.files, 18);
  assert.equal(standards.runtimeDiscovery, "NOT_RUN");
});

await test("duplicate IDs are rejected", () => {
  const data = changed();
  data.entries.push({ ...first(data) });
  assert.throws(
    () => validateDirectory(data, schema),
    /Duplicate directory ID/,
  );
});

await test("duplicate identities are rejected even under a different ID", () => {
  const data = changed();
  data.entries.push({ ...first(data), id: "duplicate-reference" });
  assert.throws(
    () => validateDirectory(data, schema),
    /Duplicate platform and identifier/,
  );
});

await test("duplicate public channels are rejected", () => {
  const data = changed();
  data.entries.push({
    ...first(data),
    id: "duplicate-channel",
    platform: "Different platform",
  });
  assert.throws(
    () => validateDirectory(data, schema),
    /Duplicate public channel/,
  );
});

await test("matching handles on different platforms remain distinct references", () => {
  const data = changed();
  const github = first(data);
  const gitlab = data.entries.find((entry) => entry.id === "gitlab");
  assert(gitlab && github.identifier === gitlab.identifier);
  validateDirectory(data, schema);
});

await test("undeclared authentication fields are rejected by the schema", () => {
  const data = changed();
  const entry = record(first(data));
  entry["password"] = "deliberate-invalid-fixture";
  assert.throws(
    () => validateDirectory(data, schema),
    /Directory schema validation failed/,
  );
});

await test("incorrect status and category values are rejected", () => {
  const data = changed();
  record(first(data))["status"] = "verified";
  assert.throws(
    () => validateDirectory(data, schema),
    /Directory schema validation failed/,
  );
  const other = changed();
  record(first(other))["category"] = "private-admin";
  assert.throws(
    () => validateDirectory(other, schema),
    /Directory schema validation failed/,
  );
});

await test("listed references require exactly one supplied public channel", () => {
  const data = changed();
  first(data).email = "example@example.org";
  assert.throws(
    () => validateDirectory(data, schema),
    /exactly one public channel/,
  );
  const other = changed();
  first(other).url = null;
  assert.throws(
    () => validateDirectory(other, schema),
    /exactly one public channel/,
  );
});

await test("incomplete references retain supplied handles without invented channels", () => {
  const yahoo = current.entries.find((entry) => entry.id === "yahoo");
  const packagist = current.entries.find((entry) => entry.id === "packagist");
  assert(yahoo && packagist);
  assert.equal(yahoo.identifier, "@vinasig");
  assert.equal(yahoo.email, null);
  assert.equal(packagist.identifier, null);
  assert.equal(packagist.url, null);
  const data = changed();
  const missing = data.entries.find((entry) => entry.id === "yahoo");
  assert(missing);
  missing.notes = null;
  assert.throws(
    () => validateDirectory(data, schema),
    /Incomplete entries must explain/,
  );
});

await test("HTTP and credential-bearing URLs are rejected", () => {
  const data = changed();
  first(data).url = "http://example.org/vinasig";
  assert.throws(() => validateDirectory(data, schema), /must use HTTPS/);
  const other = changed();
  first(other).url =
    "https://fixture-user:fixture-password@example.org/vinasig";
  assert.throws(
    () => validateDirectory(other, schema),
    /Credential, query or fragment/,
  );
});

await test("query/fragment URLs and local targets are rejected", () => {
  for (const url of [
    "https://example.org/vinasig?token=fixture",
    "https://example.org/vinasig#private",
    "https://127.0.0.1/vinasig",
    "https://localhost/vinasig",
    "https://service.internal/vinasig",
  ]) {
    const data = changed();
    first(data).url = url;
    assert.throws(
      () => validateDirectory(data, schema),
      /Credential, query or fragment|public domain/,
    );
  }
});

await test("the generic Packagist endpoint cannot be listed as a profile", () => {
  const data = changed();
  const packagist = data.entries.find((entry) => entry.id === "packagist");
  assert(packagist);
  packagist.identifier = "fixture-name";
  packagist.url = "https://packagist.org/profile/";
  packagist.status = "listed";
  assert.throws(
    () => validateDirectory(data, schema),
    /Generic Packagist endpoint/,
  );
});

await test("invalid calendar dates and reversed update dates are rejected", () => {
  const data = changed();
  data.updatedOn = "2026-02-30";
  assert.throws(() => validateDirectory(data, schema), /Invalid calendar date/);
  const other = changed();
  other.updatedOn = "2026-01-01";
  assert.throws(() => validateDirectory(other, schema), /Update date precedes/);
});

await test("invalid mail syntax and secret-like fixture content are rejected", () => {
  const data = changed();
  const gmail = data.entries.find((entry) => entry.id === "gmail");
  assert(gmail);
  gmail.email = "not-an-email";
  assert.throws(
    () => validateDirectory(data, schema),
    /Invalid public contact address/,
  );
  const other = changed();
  first(other).notes = "github_pat_" + "x".repeat(40);
  assert.throws(() => validateDirectory(other, schema), /Secret-like content/);
});

await test("Markdown pipes are escaped and active markup is rejected", () => {
  const data = changed();
  first(data).identifier = "VINASIG|fixture";
  first(data).notes = "A pipe | and bracket [example].";
  first(data).url = "https://example.org/name(alt)|fixture";
  validateDirectory(data, schema);
  const rendered = renderDirectory(data);
  assert(rendered.includes("VINASIG\\|fixture"));
  assert(rendered.includes("pipe \\| and bracket \\[example\\]"));
  assert(
    rendered.includes("[Profile](https://example.org/name%28alt%29%7Cfixture)"),
  );
  const other = changed();
  first(other).notes = "<script>fixture</script>";
  assert.throws(
    () => validateDirectory(other, schema),
    /Unsafe directory text/,
  );
});

await test("the renderer is deterministic and generated drift fails without rewriting", async () => {
  assert.equal(
    renderDirectory(current),
    renderDirectory(structuredClone(current)),
  );
  const root = await fixture();
  const file = path.join(root, "ACCOUNTS.md");
  await appendFile(file, "\nChanged generated document.\n");
  const before = await readFile(file);
  await assert.rejects(verifyDirectory(root), /Generated ACCOUNTS.md differs/);
  assert.deepEqual(await readFile(file), before);
});

await test("managed policy and manifest corruption are rejected", async () => {
  const policy = await fixture();
  await appendFile(
    path.join(policy, ".vinasig/standards/policies/language.md"),
    "\nmodified\n",
  );
  await assert.rejects(verifyStandards(policy), /Snapshot integrity failed/);
  const manifest = await fixture();
  await appendFile(path.join(manifest, ".vinasig/manifest.json"), "\n");
  await assert.rejects(
    verifyStandards(manifest),
    /Manifest differs from reviewed provenance/,
  );
});

await test("root overrides and managed block edits are rejected", async () => {
  const override = await fixture();
  await writeFile(path.join(override, "AGENTS.override.md"), "shadow");
  await assert.rejects(verifyStandards(override), /Root override shadows/);
  const block = await fixture();
  const file = path.join(block, "AGENTS.md");
  const source = await readFile(file, "utf8");
  await writeFile(
    file,
    source.replace(
      "<!-- VINASIG STANDARDS BEGIN -->",
      "<!-- VINASIG STANDARDS BEGIN -->\nModified block.",
    ),
  );
  await assert.rejects(
    verifyStandards(block),
    /Managed instruction block differs/,
  );
});

await test("owner text outside the managed block remains editable", async () => {
  const root = await fixture();
  await appendFile(
    path.join(root, "AGENTS.md"),
    "\nOwner note outside the managed block.\n",
  );
  await verifyStandards(root);
});

await test("local publication documentation links resolve inside the checkout", async () => {
  for (const file of [
    "README.md",
    "ACCOUNTS.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "docs/data-model.md",
    "docs/standards.md",
    "docs/toolchain.md",
    "docs/audits/publication-2026-10-03.md",
  ]) {
    const source = await readFile(path.join(repositoryRoot, file), "utf8");
    for (const match of source.matchAll(
      /\[[^\]]+\]\((?:<([^>]+)>|([^\s)]+))\)/g,
    )) {
      const target = text(match[1] ?? match[2]);
      if (/^https?:|^mailto:|^#/.test(target)) continue;
      const withoutFragment = target.split("#")[0];
      assert(withoutFragment);
      const resolved = path.resolve(
        path.dirname(path.join(repositoryRoot, file)),
        decodeURIComponent(withoutFragment),
      );
      const relative = path.relative(repositoryRoot, resolved);
      assert(
        !relative.startsWith("..") && !path.isAbsolute(relative),
        "Documentation link leaves checkout",
      );
      await stat(resolved);
    }
  }
});
