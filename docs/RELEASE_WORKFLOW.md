# 开发与发布工作流

## 分支职责

```text
feat/* ─┐
fix/*  ─┼─ PR ─> dev ─> release/vX.Y.Z ─ PR ─> main ─> vX.Y.Z Release ─> Halo CD
docs/* ─┘                                      │
                                               └─ PR ─> dev（版本回灌）

main ─> hotfix/vX.Y.Z ─ PR ─> main ─> vX.Y.Z Release
                                  └─ PR ─> dev（修复回灌）
```

- `main`：稳定、可安装、可回退的版本账本。每次更新都必须是一个完整的新版本。
- `dev`：下一版本的集成分支。普通开发只向这里提交 Pull Request。
- `feat/*`、`fix/*`、`docs/*`、`refactor/*`、`perf/*`、`test/*`、
  `build/*`、`ci/*`、`chore/*`：从 `dev` 创建，不修改发布版本号。
- `release/vX.Y.Z`：从最新 `dev` 创建，只做发布收口、版本号和变更记录更新。
- `hotfix/vX.Y.Z`：从 `main` 创建，用于已发布版本的紧急修复。

仓库 CI 会检查：普通开发 PR 不得升版；发布 PR 的分支名、`package.json`、
`theme.yaml` 和 `CHANGELOG.md` 必须使用相同的新版本；`release/*` 必须包含最新
`dev`；发布标签必须是位于 `main` 上的同版本 `vX.Y.Z`。

## 日常开发

```bash
git fetch origin
git switch dev
git pull --ff-only origin dev
git switch -c feat/example
```

完成后推送分支，并创建以 `dev` 为 base 的 Pull Request。仓库只使用 Squash
merge，因此进入 `dev` 的每项改动都是一个可识别、可回退的提交。

## 准备版本

```bash
git fetch origin
git switch dev
git pull --ff-only origin dev
git switch -c release/v0.2.0
```

在发布分支完成以下工作：

1. 同时更新 `package.json` 和 `theme.yaml` 的版本号。
2. 将 `[Unreleased]` 内容整理到 `CHANGELOG.md` 的新版本标题下，标题格式为
   `## [0.2.0] - YYYY-MM-DD`。
3. 运行 `pnpm check` 和 `pnpm build`，验证生成
   `dist/astro-pure-halo-0.2.0.zip`。
4. 创建以 `main` 为 base 的 Pull Request，等待全部必选检查通过后 Squash
   merge。
5. 在合入后的 `main` 提交上创建并发布 `v0.2.0` GitHub Release。Halo 官方 CD
   会重新构建并把 ZIP 上传到该 Release。
6. 创建 `main` 到 `dev` 的同步 Pull Request，使两个长期分支拥有相同的发布
   版本基线。

不要修改已经发布版本的 tag 或 ZIP；有任何修复都发布更高版本。

## Halo 应用市场自动发布

当前 `.github/workflows/cd.yaml` 使用 Halo 官方
`halo-sigs/reusable-workflows/.github/workflows/theme-cd.yaml@v4`，并设置
`skip-appstore-release: true`，所以首次审核前只上传 GitHub Release 资产。

首次审核通过后：

1. 在 Halo 应用管理页面取得应用 ID。
2. 在 Halo 官网个人中心创建个人令牌，权限选择“应用市场开发者 > 版本管理”。
3. 在 GitHub 仓库 `Settings > Secrets and variables > Actions` 创建
   `HALO_PAT`。
4. 将 CD 的 `skip-appstore-release: true` 替换为：

   ```yaml
   secrets:
     halo-pat: ${{ secrets.HALO_PAT }}
   with:
     app-id: app-xxxxxxxx
     node-version: "24"
     pnpm-version: ""
   ```

令牌只放 GitHub Actions Secret，不写入仓库，也不是本地 Halo 后台令牌。

## GitHub 仓库合并设置

在 `Settings > General > Pull Requests`：

- 开启 **Allow squash merging**。
- 关闭 **Allow merge commits** 和 **Allow rebase merging**。
- 开启 **Automatically delete head branches**。
- 默认分支保持 `main`，让仓库首页和下载者看到稳定版本；创建开发 PR 时明确选择
  `dev` 为 base。

只保留 Squash merge 是为了让 `main` 和 `dev` 保持线性、易回退；默认分支保留
`main` 是为了避免尚未发布的 `dev` 内容成为仓库对外默认视图。

## Ruleset：`main-release`

创建 Branch ruleset，名称 `main-release`，状态先设为 **Evaluate**。目标分支选择
**Include by pattern**：`main`。第一次 CI 在 Pull Request 中成功运行后再改为
**Active**，否则 GitHub 的必选检查列表可能还没有这些检查名称。

Bypass list 保持空；单人维护阶段也不要给管理员永久绕过。启用：

- **Restrict deletions**：防止稳定版本账本被删除。
- **Require linear history**：拒绝 merge commit，与仅允许 Squash merge 配套。
- **Require a pull request before merging**：
  - Required approvals：单人仓库设 `0`；有第二位维护者后改为 `1`。
  - 开启 Dismiss stale pull request approvals when new commits are pushed。
  - 开启 Require conversation resolution before merging。
- **Require status checks to pass**：
  - `CI validate`
  - `PR policy`
  - 开启 Require branches to be up to date before merging。
  - 状态检查来源选择 **GitHub Actions**。
- **Block force pushes**：防止改写已经审核和发布的历史。

不要启用：

- **Restrict creations**：`main` 已存在，没有额外收益。
- **Restrict updates**：它只允许 bypass 用户更新分支，会连正常 PR 合入一起封死。
- **Require deployments to succeed**：Halo CD 在 Release 发布后运行，不是 PR 前部署。
- **Require signed commits**：等所有维护者和自动化都完成签名配置后再启用，否则会
  无谓阻塞 Squash merge。
- Code scanning、code quality、coverage：只有先接入相应结果提供方后再启用；空
  配置直接勾选会让合并永久等待。

GitHub Ruleset 本身不能限定 PR 的来源分支，所以必须把
`PR policy` 设为必选检查。这个检查负责保证 `main` 只接受
`release/vX.Y.Z` 或 `hotfix/vX.Y.Z`，并且每次都升版。

## Ruleset：`dev-integration`

创建第二个 Branch ruleset，名称 `dev-integration`，目标分支为 `dev`，同样先用
**Evaluate** 验证，再切换 **Active**。Bypass list 保持空。启用：

- **Restrict deletions**
- **Require linear history**
- **Require a pull request before merging**
  - Required approvals：单人仓库 `0`，多人协作 `1`
  - Dismiss stale approvals
  - Require conversation resolution
- **Require status checks to pass**
  - `CI validate`
  - `PR policy`
  - Require branches to be up to date before merging
  - 来源选择 GitHub Actions
- **Block force pushes**

不启用项及原因与 `main-release` 相同。两套 Ruleset 分开配置，便于以后只给
`main` 增加发布审批或部署门禁，而不拖慢 `dev` 的日常集成。

## Ruleset：`release-tags`（推荐）

创建 Tag ruleset，目标为 **Include by pattern**：`v*`，启用：

- **Restrict updates**
- **Restrict deletions**
- **Block force pushes**

不要限制 tag 创建；否则没有 bypass 身份时连正常 GitHub Release 都无法创建。
CD 中的 Release policy 会进一步验证 tag 名、两个版本文件、变更记录，以及 tag
指向的提交是否已经包含在 `main`。

## 初次迁移顺序

1. 从当前 `origin/main` 创建并推送 `dev`，不要携带尚未发布的工作区改动。
2. 先把 CI、Policy 和 CD 作为一个版本发布到 `main`。
3. 通过 `main` 到 `dev` 的 Pull Request 同步发布后的基线。
4. 创建两个 Branch ruleset，先用 Evaluate 观察一次 PR。
5. 在 Ruleset 中选择已经出现的 `CI validate` 与 `PR policy`，然后切换
   Active。
6. 最后创建 Tag ruleset。
