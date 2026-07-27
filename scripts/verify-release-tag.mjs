import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const releaseTag = process.env.RELEASE_TAG;
const tagMatch = releaseTag?.match(/^v(\d+\.\d+\.\d+)$/);

function fail(message) {
  console.error(`Release tag policy failed: ${message}`);
  process.exit(1);
}

if (!tagMatch) {
  fail(`release tag must use vX.Y.Z, received "${releaseTag ?? ""}".`);
}

const version = tagMatch[1];
const packageVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
const themeVersion = readFileSync("theme.yaml", "utf8").match(
  /^\s*version:\s*["']?([^"'\s#]+)["']?\s*(?:#.*)?$/m,
)?.[1];

if (packageVersion !== version || themeVersion !== version) {
  fail(
    `tag ${releaseTag} must match package.json and theme.yaml; received ${packageVersion} and ${themeVersion}.`,
  );
}

const changelog = readFileSync("CHANGELOG.md", "utf8");
const escapedVersion = version.replaceAll(".", "\\.");
if (
  !new RegExp(
    `^## \\[?${escapedVersion}\\]? - \\d{4}-\\d{2}-\\d{2}$`,
    "m",
  ).test(changelog)
) {
  fail(`CHANGELOG.md does not contain a dated ${version} release entry.`);
}

try {
  execFileSync("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"], {
    stdio: "ignore",
  });
} catch {
  fail(`${releaseTag} must point to a commit contained in main.`);
}

console.log(`Validated release tag ${releaseTag}.`);
