# 本地开发环境

本项目使用 Astro 编写组件，在构建时输出 Halo 可读取的 Thymeleaf
模板。`src/` 是源码，`templates/` 是构建产物，请勿直接修改后者。

## 环境要求

- Node.js 22.12 或更高版本
- pnpm 10 或更高版本
- JRE 21 或更高版本
- macOS、Linux，或带有 Bash 环境的 Windows

本地环境使用 H2 数据库，仅供主题开发和测试，不适用于生产部署。

## 首次启动

```bash
pnpm install
pnpm dev
```

`dev`（`halo:dev` 是兼容别名）会完成以下工作：

1. 构建主题到 `templates/`。
2. 下载 Halo 2.25.0 到项目内的 `.halo-test/`。
3. 在项目的同级目录创建 `.halo2-astro-pure-halo/` 测试数据目录。
4. 将当前主题链接到 Halo 的 `themes/astro-pure-halo`。
5. 启动模板构建监听和 Halo。

启动完成后访问 <http://localhost:8090>。第一次运行需要完成 Halo
初始化，然后进入 Console：

1. 打开「外观 → 主题」。
2. 点击「主题管理 / 切换主题」。
3. 在未安装列表中找到 Astro Pure 并安装。
4. 启用主题。
5. 修改 `theme.yaml` 或 `settings.yaml` 后，执行「重载主题配置」。

## 常用命令

```bash
pnpm dev            # 启动模板监听与 Halo，默认访问 http://localhost:8090
pnpm theme:watch    # 只监听并重建 Astro 模板，不启动 Web 服务
pnpm build          # 构建 templates/
pnpm check          # Astro 与 TypeScript 检查
pnpm halo:download  # 只下载 Halo 测试运行包
pnpm halo:start     # 只启动 Halo
pnpm halo:dev       # pnpm dev 的兼容别名
pnpm package        # 构建并生成 Halo 主题 ZIP
```

可以通过环境变量覆盖测试参数：

```bash
HALO_VERSION=2.25.0 \
HALO_PORT=8091 \
HALO_WORK_DIR=/tmp/halo-astro-pure \
pnpm halo:start
```

## 开发约定

- 所有可见实现都必须遵守仓库根目录的 `AGENTS.md`。
- 开始页面或组件修改前，先读取 `.reference/astro-theme-pure` 中的原文件。
- 更新上游对照只允许执行
  `git -C .reference/astro-theme-pure pull --ff-only`。
- Halo 运行时数据必须使用 Thymeleaf 表达式，不在 Astro frontmatter 中读取。
- 页面模板位于 `src/pages/`；纯 Thymeleaf 片段放在 `public/fragments/`。
- 静态资源引用必须使用主题资源路径，不能依赖 Astro 开发服务器。
- 内容链接优先使用 `status.permalink`，避免硬编码 Halo 路由。
- Search 使用 Halo 官方搜索索引 API，但保持原版 Pagefind DOM 和 CSS。
- 评论通过 `halo:comment` 接入，插件缺失时不改变其他页面结构。
- 每次修改设置结构后都需要在 Halo Console 重载主题配置。

## 页面模板与插件路由

Blog 和站点条款页面通过 `theme.yaml` 声明为 Halo 自定义页面模板。Links 的
`/links` 路由、模板变量和评论来源由 Halo 官方 `plugin-links` 提供，主题仅提供
`templates/links.html` 展示模板；不要另建同路径独立页面。About 和暂时移除的
Projects 使用 Halo 默认页面模板和正文。创建页面后按项目 README 的路径表选择
模板。

## 重置测试数据

停止 Halo 后，删除项目同级目录 `.halo2-astro-pure-halo/`，再次执行
`pnpm dev` 即可得到一个全新的测试环境。删除前请确认其中没有需要保留的内容。
