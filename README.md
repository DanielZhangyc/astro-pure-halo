# Astro Pure for Halo

一个简洁、快速、专注内容的 Halo 主题，移植自
[Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)，兼容
Halo `>=2.25.0`。

[![Halo](https://img.shields.io/badge/Halo-%3E%3D2.25.0-7546e8?logo=halo&logoColor=white)](https://www.halo.run/)
[![Release](https://img.shields.io/github/v/release/DanielZhangyc/astro-pure-halo)](https://github.com/DanielZhangyc/astro-pure-halo/releases)
[![License](https://img.shields.io/github/license/DanielZhangyc/astro-pure-halo)](LICENSE)

![Astro Pure for Halo 主题预览](preview.webp)

## 特性

- 首页、文章、归档、分类、标签、作者、搜索与独立页面；
- 响应式布局和跟随系统、浅色、深色三态主题；
- 文章目录、阅读进度、分享、二维码与图片缩放；
- Halo 评论、链接管理和瞬间插件适配；
- 本地字体、无遥测。

## 安装

1. 从 [Releases](https://github.com/DanielZhangyc/astro-pure-halo/releases)
   下载最新的主题 ZIP。
2. 在 Halo Console 进入「外观 → 主题」，上传并安装主题。
3. 启用 Astro Pure，进入主题设置填写首页资料。
4. 配置 Primary Menu，并按需创建页面或安装插件。

### 页面

| 路径     | 页面模板      | 用途              |
| -------- | ------------- | ----------------- |
| `/blog`  | Pure Blog     | Pure 风格文章列表 |
| `/about` | 默认          | 个人介绍          |
| `/terms` | Pure 站点条款 | 站点条款与隐私    |

### 可选插件

| 功能     | 插件                                                          | 路由       |
| -------- | ------------------------------------------------------------- | ---------- |
| 评论     | Halo 评论插件                                                 | 文章与页面 |
| 友情链接 | [链接管理](https://www.halo.run/store/apps/app-hfbQg)         | `/links`   |
| 瞬间     | [plugin-moments](https://github.com/halo-sigs/plugin-moments) | `/moments` |

## 开发

需要 Node.js 22.12+、pnpm 11+ 与 JRE 21+。

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
```

构建结果位于 `templates/`，主题 ZIP 位于 `dist/`。详见
[开发文档](docs/DEVELOPMENT.md)与[开发计划](docs/ROADMAP.md)。

## 许可

本项目基于 [Apache License 2.0](LICENSE) 发布。上游及第三方许可见
[NOTICE](NOTICE)，问题和建议请提交至
[GitHub Issues](https://github.com/DanielZhangyc/astro-pure-halo/issues)。
