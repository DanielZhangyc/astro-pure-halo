import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test, { afterEach } from "node:test";
import { fileURLToPath } from "node:url";

const policySource = fileURLToPath(
  new URL("./verify-pr-policy.mjs", import.meta.url),
);
const temporaryRepositories = new Set();

afterEach(() => {
  for (const path of temporaryRepositories) {
    rmSync(path, { recursive: true, force: true });
  }
  temporaryRepositories.clear();
});

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function packageJson(version, extra = {}) {
  return `${JSON.stringify({ name: "policy-fixture", version, ...extra }, null, 2)}\n`;
}

function themeYaml(version, displayName = "Policy Fixture") {
  return `apiVersion: theme.halo.run/v1alpha1
kind: Theme
metadata:
  name: policy-fixture
spec:
  displayName: ${displayName}
  version: "${version}"
`;
}

function changelog(version, note = "Release metadata") {
  return `# Changelog

## [Unreleased]

## [${version}] - 2026-09-22

- ${note}
`;
}

function writeState(cwd, state) {
  writeFileSync(
    join(cwd, "package.json"),
    packageJson(state.packageVersion, state.packageExtra),
  );
  writeFileSync(
    join(cwd, "theme.yaml"),
    themeYaml(state.themeVersion ?? state.packageVersion, state.displayName),
  );
  writeFileSync(
    join(cwd, "CHANGELOG.md"),
    state.changelog ?? changelog(state.packageVersion),
  );
  for (const [path, contents] of Object.entries(state.extraFiles ?? {})) {
    const destination = join(cwd, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, contents);
  }
}

function commit(cwd, message) {
  git(cwd, "add", "-A");
  git(cwd, "commit", "-m", message);
  return git(cwd, "rev-parse", "HEAD");
}

function fixture({
  baseVersion = "1.2.0",
  baseState = {},
  stableVersion = "1.3.0",
  stableState = {},
  headState,
} = {}) {
  const cwd = mkdtempSync(join(tmpdir(), "verify-pr-policy-"));
  temporaryRepositories.add(cwd);
  git(cwd, "init", "--quiet");
  git(cwd, "config", "user.name", "Policy Test");
  git(cwd, "config", "user.email", "policy-test@example.invalid");
  copyFileSync(policySource, join(cwd, "verify-pr-policy.mjs"));

  writeState(cwd, { packageVersion: baseVersion, ...baseState });
  const baseSha = commit(cwd, "base");

  writeState(cwd, { packageVersion: stableVersion, ...stableState });
  const stableSha = commit(cwd, "stable");

  let headSha = stableSha;
  if (headState) {
    writeState(cwd, {
      packageVersion: stableVersion,
      ...stableState,
      ...headState,
    });
    headSha = commit(cwd, "head");
  }

  return { cwd, baseSha, stableSha, headSha };
}

function verify(repo, headRef = "sync/v1.3.0") {
  return spawnSync(process.execPath, ["verify-pr-policy.mjs"], {
    cwd: repo.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      GITHUB_BASE_REF: "dev",
      GITHUB_HEAD_REF: headRef,
      BASE_SHA: repo.baseSha,
      HEAD_SHA: repo.headSha,
      STABLE_SHA: repo.stableSha,
    },
  });
}

function assertAccepted(result, message) {
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(message));
}

function assertRejected(result, message) {
  assert.equal(result.status, 1, result.stdout);
  assert.match(result.stderr, new RegExp(message));
}

test("accepts an exact main release metadata sync", () => {
  const result = verify(
    fixture({
      baseState: {
        extraFiles: { ".github/workflows/dev.yaml": "name: dev-only\n" },
      },
    }),
  );
  assertAccepted(result, "Validated release metadata synchronization 1\\.3\\.0");
});

test("rejects a sync branch whose version does not match main", () => {
  const result = verify(fixture(), "sync/v1.3.1");
  assertRejected(result, "sync branch and head versions must match");
});

test("rejects a release sync that downgrades dev", () => {
  const result = verify(fixture({ baseVersion: "1.4.0" }));
  assertRejected(result, "release synchronization cannot downgrade dev");
});

test("rejects mismatched package and theme versions on main", () => {
  const repo = fixture({
    stableState: { themeVersion: "1.3.1" },
    headState: { themeVersion: "1.3.0" },
  });
  const result = verify(repo);
  assertRejected(result, "Main has mismatched versions");
});

test("rejects sync branches that carry non-metadata files", () => {
  const repo = fixture({
    headState: { extraFiles: { "feature.txt": "smuggled change\n" } },
  });
  const result = verify(repo);
  assertRejected(result, "may only change release metadata files");
});

test("rejects non-version package.json changes during sync", () => {
  const repo = fixture({ stableState: { packageExtra: { private: true } } });
  const result = verify(repo);
  assertRejected(result, "may only update the version in package\\.json");
});

test("rejects non-version theme.yaml changes during sync", () => {
  const repo = fixture({ stableState: { displayName: "Renamed Fixture" } });
  const result = verify(repo);
  assertRejected(result, "may only update the version in theme\\.yaml");
});

test("rejects sync metadata that differs from main", () => {
  const repo = fixture({
    headState: { changelog: changelog("1.3.0", "Different release notes") },
  });
  const result = verify(repo);
  assertRejected(result, "sync release metadata must exactly match main");
});

test("ordinary feature branches still cannot bump release versions", () => {
  const result = verify(fixture(), "feature/new-widget");
  assertRejected(
    result,
    "ordinary development pull requests must not change release versions",
  );
});
