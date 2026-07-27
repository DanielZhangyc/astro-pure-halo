import { execFileSync } from "node:child_process";

const baseRef = process.env.GITHUB_BASE_REF;
const headRef = process.env.GITHUB_HEAD_REF;
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;
const integrationSha = process.env.INTEGRATION_SHA;

if (!baseRef || !headRef || !baseSha || !headSha) {
  fail(
    "Missing pull request metadata. Expected GITHUB_BASE_REF, GITHUB_HEAD_REF, BASE_SHA and HEAD_SHA.",
  );
}

const stableVersionPattern = /^(\d+)\.(\d+)\.(\d+)$/;

function fail(message) {
  console.error(`Release policy failed: ${message}`);
  process.exit(1);
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function readAt(sha, path) {
  try {
    return git("show", `${sha}:${path}`);
  } catch {
    fail(`Unable to read ${path} at ${sha}.`);
  }
}

function readVersions(sha) {
  const packageVersion = JSON.parse(readAt(sha, "package.json")).version;
  const themeSource = readAt(sha, "theme.yaml");
  const themeVersion = themeSource.match(
    /^\s*version:\s*["']?([^"'\s#]+)["']?\s*(?:#.*)?$/m,
  )?.[1];

  if (!themeVersion) {
    fail(`theme.yaml at ${sha} does not contain a readable spec.version.`);
  }

  return { packageVersion, themeVersion };
}

function parseStableVersion(version, source) {
  const match = version.match(stableVersionPattern);
  if (!match) {
    fail(`${source} must use a stable X.Y.Z version, received "${version}".`);
  }
  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] > right[index] ? 1 : -1;
    }
  }
  return 0;
}

function assertVersionFilesMatch(versions, source) {
  if (versions.packageVersion !== versions.themeVersion) {
    fail(
      `${source} has mismatched versions: package.json=${versions.packageVersion}, theme.yaml=${versions.themeVersion}.`,
    );
  }
}

const baseVersions = readVersions(baseSha);
const headVersions = readVersions(headSha);
assertVersionFilesMatch(baseVersions, "Base");
assertVersionFilesMatch(headVersions, "Head");

if (baseRef === "main") {
  const branchMatch = headRef.match(/^(release|hotfix)\/v(\d+\.\d+\.\d+)$/);
  if (!branchMatch) {
    fail(
      `pull requests to main must come from release/vX.Y.Z or hotfix/vX.Y.Z, received "${headRef}".`,
    );
  }

  const [, branchType, branchVersion] = branchMatch;
  if (headVersions.packageVersion !== branchVersion) {
    fail(
      `branch version ${branchVersion} does not match release version ${headVersions.packageVersion}.`,
    );
  }

  const baseVersion = parseStableVersion(
    baseVersions.packageVersion,
    "The main branch",
  );
  const headVersion = parseStableVersion(
    headVersions.packageVersion,
    "The release branch",
  );
  if (compareVersions(headVersion, baseVersion) <= 0) {
    fail(
      `main must advance to a newer version (${baseVersions.packageVersion} -> ${headVersions.packageVersion}).`,
    );
  }

  const changelog = readAt(headSha, "CHANGELOG.md");
  const escapedVersion = headVersions.packageVersion.replaceAll(".", "\\.");
  const changelogHeading = new RegExp(
    `^## \\[?${escapedVersion}\\]? - \\d{4}-\\d{2}-\\d{2}$`,
    "m",
  );
  if (!changelogHeading.test(changelog)) {
    fail(
      `CHANGELOG.md must contain "## [${headVersions.packageVersion}] - YYYY-MM-DD".`,
    );
  }

  if (branchType === "release") {
    if (!integrationSha) {
      fail("INTEGRATION_SHA is required for a release pull request.");
    }
    try {
      execFileSync(
        "git",
        ["merge-base", "--is-ancestor", integrationSha, headSha],
        { stdio: "ignore" },
      );
    } catch {
      fail("release branch must contain the latest dev commit.");
    }
  }

  console.log(
    `Validated ${branchType} ${headVersions.packageVersion} for main.`,
  );
  process.exit(0);
}

if (baseRef === "dev") {
  if (headRef === "main") {
    const baseVersion = parseStableVersion(
      baseVersions.packageVersion,
      "The dev branch",
    );
    const headVersion = parseStableVersion(
      headVersions.packageVersion,
      "The main branch",
    );
    if (compareVersions(headVersion, baseVersion) < 0) {
      fail("main cannot be older than dev when synchronizing a release.");
    }
    console.log("Validated main-to-dev release synchronization.");
    process.exit(0);
  }

  const developmentBranchPattern =
    /^(feat|feature|fix|docs|refactor|perf|test|build|ci|chore)\/[a-z0-9][a-z0-9._/-]*$/;
  const agentBranchPattern = /^codex\/[a-z0-9][a-z0-9._/-]*$/;
  if (
    !developmentBranchPattern.test(headRef) &&
    !agentBranchPattern.test(headRef)
  ) {
    fail(
      `pull requests to dev must use a documented development branch prefix, received "${headRef}".`,
    );
  }

  if (
    headVersions.packageVersion !== baseVersions.packageVersion ||
    headVersions.themeVersion !== baseVersions.themeVersion
  ) {
    fail(
      "ordinary development pull requests must not change release versions; bump them on release/vX.Y.Z.",
    );
  }

  console.log(`Validated development branch ${headRef} for dev.`);
  process.exit(0);
}

fail(`unsupported protected base branch "${baseRef}".`);
