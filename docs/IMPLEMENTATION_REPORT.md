# Astro Theme Pure → Halo 实施报告

## 目标

将 `cworld1/astro-theme-pure` 直接移植到 Halo 2。可见结果以原版源码和原版
运行页面为唯一标准，不进行重新设计、风格化模仿或主观简化。

## Halo 官方开发流程

根据 Halo 官方主题开发文档，主题由 `theme.yaml` 描述，模板位于
`templates/`，静态资源通过主题资源路径访问，运行时数据由 Thymeleaf 模型、
Finder API 和 Halo 标签注入：

- [主题开发准备](https://docs.halo.run/developer-guide/theme/prepare/)
- [主题目录结构](https://docs.halo.run/developer-guide/theme/structure)
- [模板路由映射](https://docs.halo.run/developer-guide/theme/template-route-mapping)
- [独立页面 Finder API](https://docs.halo.run/developer-guide/theme/finder-apis/single-page)
- [Post Finder API](https://docs.halo.run/developer-guide/theme/finder-apis/post)
- [Halo API 文档](https://api.halo.run/)

本项目采用 Astro 作为构建期组件系统，最终仍输出 Halo 所需的静态
Thymeleaf HTML，因此生产环境不需要 Node.js。

## 对照基准

- 上游：`cworld1/astro-theme-pure`
- 本地副本：`.reference/astro-theme-pure`
- 基准提交：`0047f6d4278d4c3e823dca608022cd6ebe7b5c96`
- 版本文件数量：240

直接复用或逐行适配的内容包括原版 CSS、字体、图标、favicon、头像、项目图、
工具图标、二维码资源，以及 Header、Footer、布局和各页面组件。

## 实施映射

| Pure 原实现 | Halo 实现 |
| --- | --- |
| Astro Content Collection | Halo Finder API / 路由模型 |
| `BaseLayout.astro` | `src/layouts/Layout.astro` |
| `ContentLayout.astro` | `src/layouts/ContentLayout.astro` |
| `CommonPage.astro` | `src/layouts/CommonPage.astro` |
| `/blog/[...page]` | Halo 页面或分类自定义模板 |
| `/blog/[...id]` | `post.html` |
| `/tags/*` | Halo Tag 模型 |
| Pagefind UI | 相同 DOM/CSS + Halo Search API |
| Waline 评论插槽 | `halo:comment` |
| Astro 构建期日期格式 | 浏览器 `en-US` 日期格式化 |
| Astro 菜单配置 | Halo Primary Menu |

分类和作者是 Halo 额外内容类型。因为上游没有独立设计，移植直接复用了上游
Tag 列表结构，避免创造新的视觉语言。

## 验证记录

- `pnpm check`：0 errors、0 warnings、0 hints。
- `pnpm build`：生成 20 个 Halo Thymeleaf 页面模板。
- `pnpm package`：成功生成可安装 ZIP。
- Halo 2.25.0：真实实例安装、启用、主题重载和路由渲染通过。
- Search：对 `Halo` 搜索得到 1 条真实文章结果，标题与摘要高亮正常。
- Post：1280px 主容器与文章列几何位置与原版一致。
- Mobile：390px 菜单展开、滚动悬浮和主题循环通过。
- Theme：`light → system → dark` 状态和本地持久化通过。

浏览器对照产物保存在本地 `output/playwright/`，该目录不提交到仓库。

## 运行与端口

`pnpm dev` 默认在 `8090` 启动 Halo。脚本同时启动 Astro 模板监听和 Halo；
真正提供 Web 服务的是 Halo，所以 Astro 不会再打印一个开发服务器端口。
端口可通过 `HALO_PORT` 覆盖：

```bash
HALO_PORT=8091 pnpm dev
```

启动脚本会显式输出站点及 Console URL。

## 保留的运行时边界

- 文章、页面、菜单和统计数字来自 Halo，内容自然不会与 Pure 演示数据相同。
- 评论区域由用户安装的 Halo 评论插件渲染；主题只负责保持原版容器位置。
- Medium Zoom 和 QRCode 使用与上游相同的库，并固定版本随主题本地打包，避免
  jsDelivr 不可达时阻塞文章页面初始化。
- Terms 集中为一个 Halo 自定义页面，默认提供适用于普通个人博客的完整政策
  结构，不依赖额外二级页面。
- About 使用 Halo 默认页面正文；`about.html` 仅作为旧版模板绑定的无设置兼容
  路由，不再在主题自定义模板中公开。
- Projects 专用页面和文章底部赞助入口暂时撤下，相关源码验证记录保留在版本
  历史中；`projects.html` 仅作为旧版模板绑定的普通正文兼容路由。
