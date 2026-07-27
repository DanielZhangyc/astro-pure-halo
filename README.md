# Astro Pure for Halo

Astro Pure for Halo 是 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
的 Halo 移植版本。主题保留 Pure 的核心设计语言、主要布局和交互方式，并适配
Halo 的内容模型、模板 API、评论与插件生态。

## 功能

- 首页、文章列表、文章详情、归档、分类、标签、作者、搜索与错误页面；
- 独立页面、评论、分页、导航、封面图与响应式布局；
- 三态主题切换、文章目录、阅读进度、分享、二维码与图片缩放；
- 链接管理插件分组、筛选、随机排序与 Pure 风格友链卡片；
- Moments 插件页面适配；
- 可选的站点条款页面。

主题声明兼容 Halo `>=2.25.0`，并已在 Halo 2.25.0 环境验证。

## 安装与启用

1. 在 Halo Console 进入「外观 → 主题」。
2. 点击「主题管理 → 安装主题」，上传发布页提供的 ZIP 制品。
3. 安装完成后启用 Astro Pure。
4. 进入主题设置，填写首页资料并按需开启可选区块。
5. 配置 Primary Menu，并按下表创建所需独立页面或安装对应插件。

| 页面路径 | 页面模板或来源 | 用途                      |
| -------- | -------------- | ------------------------- |
| `/blog`  | Pure Blog      | Pure 风格文章列表         |
| `/about` | 默认           | 首页 “More about me” 入口 |
| `/terms` | Pure 站点条款  | 页脚站点条款入口          |
| `/links` | 链接管理插件   | Pure 风格友链页面         |

未安装评论插件时，其他页面仍可正常使用，只是不显示评论区。Moments 页面需要
[plugin-moments](https://github.com/halo-sigs/plugin-moments) 提供路由和数据；
没有使用瞬间功能的站点无需安装该插件。友链页面需要安装 Halo 官方
[链接管理插件](https://www.halo.run/store/apps/app-hfbQg)，链接与分组均在插件
管理界面维护，无需创建 `/links` 独立页面。

## 配置

站点标题、副标题、favicon、语言和主导航读取 Halo 站点设置。主题设置提供以下
能力：

- 首页头像、显示名称、所在地、简介，以及 Education、Website List、
  Certifications、Skills 等可选区块；
- IBM Plex Sans、系统字体或站点运营者上传的自定义 WOFF2 字体；
- Blog 每页文章数、文章分享平台、正文外链标记、图片说明和文字样式；
- 友链申请说明（链接与分组由链接管理插件维护）；
- 文章封面、目录、阅读进度、评论、相邻文章和 Medium Zoom；
- 页脚链接、社交链接、备案信息、版权名称和站点条款入口。

所有可选首页区块默认关闭，填写真实内容后再开启。随机名言默认关闭；启用时填写
返回 JSON 的 HTTP(S) 接口和字段路径，例如 `quote` 或 `data.content`。字段路径
只读取 JSON 数据，不执行 JavaScript。

## 外部请求与隐私

主题本身不包含遥测、访问统计、广告或隐藏的数据上报。默认状态下不会自动请求
随机名言或第三方字体服务。主题在本地加载随制品提供的 IBM Plex Sans，并在字体
缺字或加载失败时回退到系统无衬线字体；同时会在浏览器 `localStorage` 中保存
明暗主题偏好。

选择“自定义 WOFF2”后，Regular 字体文件为必填，Italic、Medium 和 Medium
Italic 可选。字体通过 Halo 附件库配置，不允许注入任意 CSS；只加载 HTTP(S)
地址并拒绝 HTTPS 页面中的 HTTP 字体。站点运营者应确认拥有相应字体的网页托管、
传输和使用授权。外部存储地址还需允许站点来源跨域加载字体。

以下功能会在站点运营者配置或访客主动操作后产生外部请求：

- 开启随机名言后，访客浏览器会请求所配置的 JSON 接口；
- 友链未配置头像时，访客浏览器会请求对应站点的 `/favicon.ico`；
- 访客点击微博、X 或 Bluesky 分享按钮后会打开相应分享服务；
- 访客点击外部链接、社交链接或站点运营者配置的其他地址后会访问目标站点。

站点运营者应确保所配置的第三方服务合法可用，并在站点隐私说明中披露服务名称、
用途、数据流向和关闭方式。删除相关配置或关闭对应开关即可停止主题发起该类请求。

## 升级、停用与卸载

升级前建议备份 Halo 数据和主题设置。上传新版本并完成升级后，如果
`settings.yaml` 有变化，请在主题详情菜单执行「重载主题配置」，再检查新增设置的
默认值。

停用或切换主题不会删除文章、页面、评论、附件或其他 Halo 内容。卸载前应先切换
到其他可用主题；卸载只移除主题文件和该主题的配置资源，不会删除站点内容。重新
安装后如需恢复个性化配置，请从备份恢复或重新填写。

## 故障排查

- 页面显示 404：确认已按安装表创建页面并选择正确模板；`/links` 还需确认链接管理
  插件已安装并启用。
- 设置项没有更新：在主题详情菜单执行「重载主题配置」。
- 评论区不显示：确认评论插件已安装、启用，且主题的文章评论开关已开启。
- Moments 页面不可用：确认 Moments 插件已安装、启用且版本与当前 Halo 兼容。
- 随机名言显示不可用：确认接口允许浏览器跨域访问、返回 JSON、字段路径正确，
  且请求能在 5 秒内完成。
- 图片缩放未启用：检查 Medium Zoom 选择器是否为有效 CSS 选择器。

问题反馈请使用
[GitHub Issues](https://github.com/DanielZhangyc/astro-pure-halo/issues)。

## 功能边界

本版本不提供 Projects、Sponsors、Sponsorship 或文章赞助入口。旧版本的
Pure Projects 模板会作为普通 Halo 页面展示正文，这些未提供的功能不会以占位
内容出现在默认站点中。

## 开发与构建

本地开发需要 Node.js 22.12+、pnpm 10+ 与 JRE 21+。

```bash
pnpm install
pnpm dev
```

默认地址：

- 站点：<http://localhost:8090>
- Console：<http://localhost:8090/console>

执行检查、构建与打包：

```bash
pnpm check
pnpm build
pnpm package
```

构建结果写入 `templates/`，主题 ZIP 写入 `dist/`。`templates/` 是生成物，不应
直接修改。

## 移植与许可证

- 上游仓库：[cworld1/astro-theme-pure](https://github.com/cworld1/astro-theme-pure)
- 本地只读对照：`.reference/astro-theme-pure`
- 当前对照提交：`0047f6d4278d4c3e823dca608022cd6ebe7b5c96`
- 项目约束：[AGENTS.md](AGENTS.md)

本项目基于 Apache License 2.0 发布，上游来源和第三方 JavaScript 许可证见
[NOTICE](NOTICE) 及制品内的许可证文件。

上游使用 Fontshare 提供的 Satoshi 字体。其 ITF Free Font License 不允许本项目
把字体文件作为主题制品再次分发，因此 Halo 移植版默认使用采用 SIL Open Font
License 1.1 的 IBM Plex Sans，并保留系统无衬线字体回退；这是为满足字体授权要求
而保留的受控差异。
