# Changelog

本项目的显著变更记录在此文件中。版本号遵循
[Semantic Versioning](https://semver.org/)。

## [Unreleased]

## [0.1.8] - 2026-07-27

### Added

- 增加由 `main` 成功 CI 自动创建同版本 GitHub Release 和上传主题 ZIP 的流程，
  同时支持维护者从 Actions 页面输入版本号进行幂等重试。

### Fixed

- 修复 Pure Blog 自定义页面一次加载全部文章导致的加载错误，改用 Halo
  服务端分页。
- 修复友链卡片显示多余外链标记的问题。

## [0.1.7] - 2026-07-27

### Added

- 增加 IBM Plex Sans 内置字体和用户自定义 WOFF2 字体设置。
- 增加 Halo 应用市场所需的主题预览图和第三方资源许可说明。

### Changed

- 改进默认配置、搜索行为和主题打包内容，以满足 Halo 应用市场审核要求。
- 引入 `dev` 集成分支、版本发布分支和 GitHub Actions 发布门禁。

### Removed

- 移除授权来源不明确的 Satoshi 字体文件。

[Unreleased]: https://github.com/DanielZhangyc/astro-pure-halo/compare/v0.1.8...HEAD
[0.1.8]: https://github.com/DanielZhangyc/astro-pure-halo/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/DanielZhangyc/astro-pure-halo/compare/v0.1.6...v0.1.7
