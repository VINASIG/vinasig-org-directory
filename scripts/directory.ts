import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import {
  directoryRoot,
  localPath,
  message,
  parseJson,
  readLocal,
  record,
  repositoryRoot,
  writeOutput,
} from "./local.ts";

export const categories = {
  organization: "Organization and website",
  contact: "Email and contact accounts",
  social: "Social and community accounts",
  developer: "Developer, publishing, and creative platforms",
} as const;

export interface Entry {
  id: string;
  category: keyof typeof categories;
  platform: string;
  identifier: string | null;
  url: string | null;
  email: string | null;
  status: "listed" | "incomplete";
  notes: string | null;
}

export interface Directory {
  $schema: "./directory.schema.json";
  format: 1;
  organization: "VINASIG";
  inventoryDate: string;
  updatedOn: string;
  verification: "not-independently-verified";
  entries: Entry[];
}

export async function createValidator(
  root = repositoryRoot,
): Promise<ValidateFunction<Directory>> {
  const schema = record(
    parseJson(await readLocal(root, "directory.schema.json")),
  );
  return new Ajv2020({ strict: true, allErrors: true }).compile<Directory>(
    schema,
  );
}

function date(value: string): void {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), "Invalid date format");
  const parsed = new Date(`${value}T00:00:00.000Z`);
  assert(
    Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value,
    "Invalid calendar date",
  );
}

function plain(value: string): void {
  assert(
    value === value.trim() && !/[<>`]/.test(value),
    "Unsafe directory text",
  );
  for (let index = 0; index < value.length; index++) {
    const unit = value.charCodeAt(index);
    assert(unit >= 32 && unit !== 127, "Unsafe directory text");
  }
}

function publicUrl(value: string): string {
  assert(!/[\s\\<>"']/.test(value), "Unsafe profile URL text");
  const parsed = new URL(value);
  assert(parsed.protocol === "https:", "Profile URLs must use HTTPS");
  assert(
    !parsed.username && !parsed.password && !parsed.search && !parsed.hash,
    "Credential, query or fragment in profile URL",
  );
  const host = parsed.hostname.replace(/^\[|\]$/g, "");
  assert(
    isIP(host) === 0 &&
      host.includes(".") &&
      !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(host),
    "Profile URL must use a public domain",
  );
  assert(
    !(host === "packagist.org" && /^\/profile\/?$/.test(parsed.pathname)),
    "Generic Packagist endpoint is not an account URL",
  );
  return parsed.href.replace(/\/$/, "");
}

export function validateDirectory(
  value: unknown,
  schema: ValidateFunction<Directory>,
): Directory {
  assert(schema(value), "Directory schema validation failed");
  date(value.inventoryDate);
  date(value.updatedOn);
  assert(
    value.updatedOn >= value.inventoryDate,
    "Update date precedes the inventory",
  );
  const encoded = JSON.stringify(value);
  assert(
    !/(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-(?:proj-|svcacct-)[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|[A-Za-z]:\\+Users\\+)/i.test(
      encoded,
    ),
    "Secret-like content or personal machine path in directory input",
  );
  const ids = new Set<string>();
  const identities = new Set<string>();
  const channels = new Set<string>();
  for (const entry of value.entries) {
    assert(!ids.has(entry.id), "Duplicate directory ID");
    ids.add(entry.id);
    for (const field of [entry.platform, entry.identifier, entry.notes])
      if (field !== null) plain(field);
    const identity = `${entry.platform.toLowerCase()}|${entry.identifier?.toLowerCase() ?? ""}`;
    assert(!identities.has(identity), "Duplicate platform and identifier");
    identities.add(identity);
    if (entry.status === "incomplete") {
      assert(
        entry.url === null && entry.email === null && entry.notes !== null,
        "Incomplete entries must explain the missing public channel",
      );
      continue;
    }
    assert(
      entry.identifier !== null &&
        (entry.url !== null) !== (entry.email !== null),
      "Listed entries must have an identifier and exactly one public channel",
    );
    let channel: string;
    if (entry.url !== null) {
      channel = publicUrl(entry.url);
    } else {
      assert(
        entry.email !== null &&
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(entry.email),
        "Invalid public contact address",
      );
      channel = `mailto:${entry.email.toLowerCase()}`;
    }
    assert(!channels.has(channel), "Duplicate public channel");
    channels.add(channel);
  }
  return value;
}

export async function loadDirectory(root = repositoryRoot): Promise<Directory> {
  return validateDirectory(
    parseJson(await readLocal(root, "directory.json")),
    await createValidator(root),
  );
}

function markdown(value: string): string {
  return value.replace(/[\\|[\]*_]/g, "\\$&");
}

function markdownUrl(value: string): string {
  return value.replace(
    /[()|[\]`]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function renderDirectory(directory: Directory): string {
  const listed = directory.entries.filter(
    (entry) => entry.status === "listed",
  ).length;
  const lines = [
    "<!-- Generated from directory.json by scripts/directory.ts. Do not edit by hand. -->",
    "# VINASIG Organization Accounts",
    "",
    `Original inventory date: ${directory.inventoryDate}. Directory updated: ${directory.updatedOn}.`,
    "",
    `This maintainer-supplied directory contains ${String(directory.entries.length)} entries: ${String(listed)} listed public channels and ${String(directory.entries.length - listed)} incomplete references. Listing does not independently verify account ownership, availability or mailbox deliverability.`,
    "",
    "Use [directory.json](directory.json) for structured data and [the data contract](docs/data-model.md) for update rules. Public contact addresses are contact channels; they are not account access instructions.",
    "",
    "This VINASIG directory database is available under the [Open Database License 1.0](LICENSE). Preserve attribution and applicable share-alike terms. Individual facts and third-party marks keep their independent rights. Read [LICENSES.md](LICENSES.md) for the database, documentation and tooling scopes.",
  ];
  for (const [category, heading] of Object.entries(categories)) {
    const entries = directory.entries.filter(
      (entry) => entry.category === category,
    );
    if (entries.length === 0) continue;
    lines.push(
      "",
      `## ${heading}`,
      "",
      "| Platform | Identifier | Public channel | Status and notes |",
      "| --- | --- | --- | --- |",
    );
    for (const entry of entries) {
      const identifier =
        entry.identifier === null
          ? "Not supplied"
          : `\`${entry.identifier.replace(/\|/g, "\\|")}\``;
      const channel =
        entry.url !== null
          ? `[Profile](${markdownUrl(entry.url)})`
          : entry.email !== null
            ? `[${entry.email}](mailto:${entry.email})`
            : "Not supplied";
      const notes =
        entry.status === "incomplete" ? "Incomplete reference." : "Listed.";
      lines.push(
        `| ${markdown(entry.platform)} | ${identifier} | ${channel} | ${notes}${entry.notes === null ? "" : ` ${markdown(entry.notes)}`} |`,
      );
    }
  }
  lines.push(
    "",
    "The maintainer must supply missing public references before they can be listed. Do not infer a Yahoo mailbox, Packagist username, LinkedIn company page or npm organization from another identifier.",
    "",
  );
  return lines.join("\n");
}

export async function verifyDirectory(directory = repositoryRoot): Promise<{
  status: "PASS";
  entries: number;
  listed: number;
  incomplete: string[];
  profileUrls: number;
  contactEmails: number;
}> {
  const root = await directoryRoot(directory);
  const data = await loadDirectory(root);
  assert.equal(
    (await readLocal(root, "ACCOUNTS.md")).toString("utf8"),
    renderDirectory(data),
    "Generated ACCOUNTS.md differs from directory.json; run npm run directory:generate",
  );
  return {
    status: "PASS",
    entries: data.entries.length,
    listed: data.entries.filter((entry) => entry.status === "listed").length,
    incomplete: data.entries
      .filter((entry) => entry.status === "incomplete")
      .map((entry) => entry.id),
    profileUrls: data.entries.filter((entry) => entry.url !== null).length,
    contactEmails: data.entries.filter((entry) => entry.email !== null).length,
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    assert(
      process.argv.length === 2 ||
        (process.argv.length === 3 && process.argv[2] === "--write"),
      "Usage: node scripts/directory.ts [--write]",
    );
    if (process.argv[2] === "--write") {
      const data = await loadDirectory();
      await writeFile(
        await localPath(repositoryRoot, "ACCOUNTS.md", true),
        renderDirectory(data),
        "utf8",
      );
    }
    const result = await verifyDirectory();
    await writeOutput(
      repositoryRoot,
      "output/checks/directory.json",
      `${JSON.stringify(result, null, 2)}\n`,
    );
    console.log(
      `Directory integrity passed: ${String(result.entries)} entries, ${String(result.listed)} listed channels, ${String(result.incomplete.length)} incomplete references.`,
    );
  } catch (error) {
    console.error(`Directory integrity failed: ${message(error)}`);
    process.exitCode = 1;
  }
}
