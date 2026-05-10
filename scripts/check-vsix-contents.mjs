import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const vsixPath = process.argv[2] ?? `${packageJson.name}-${packageJson.version}.vsix`;

const entries = execFileSync("unzip", ["-Z1", vsixPath], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

const forbidden = [
  /^extension\/\.env(?:\.|$)/,
  /^extension\/AGENTS\.md$/,
  /^extension\/scripts\//,
  /^extension\/iterm\//,
  /^extension\/docs\//,
  /^extension\/assets\//,
];

const leakedEntries = entries.filter((entry) => {
  return forbidden.some((pattern) => pattern.test(entry));
});

assert.deepEqual(leakedEntries, []);
