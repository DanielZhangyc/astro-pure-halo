# Astro Pure for Halo

本项目是 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) 的Halo 移植版本

## 功能概览

- Home、Blog、Post、Archives、Tags、Search 与错误页面；
- Halo 分类、作者、独立页面与评论；
- Header、Footer、三态主题切换与移动端菜单；
- 文章目录、阅读进度、分享、二维码、Medium Zoom 与相邻文章；
- Common Links、Links with Bad Status、Special Links 与友链历史；
- Moments 插件适配；
- 集中展示隐私、版权与使用规则的站点条款页面。

当前开发进度见 [Roadmap](docs/ROADMAP.md)。

## 安装与初始化

安装主题后，需要在 Halo「内容 → 页面」中创建以下页面：

| 页面路径 | 页面模板      | 是否必需 |
| -------- | ------------- | -------- |
| `/blog`  | Pure Blog     | 是       |
| `/about` | 默认          | 是       |
| `/terms` | Pure 站点条款 | 是       |
| `/links` | Pure Links    | 否       |

## 配置说明

### 基础与内容

站点标题、副标题、favicon、语言和主导航继续使用 Halo 的站点设置与 Primary
Menu。主题设置补充默认社交分享图片、标题分隔符、Open Graph locale 和日期
locale。

内容设置支持 Pure Blog 每页文章数、文章分享平台、正文外链标记、图片说明、
引用文字样式和行内代码样式。Pure Blog 的每页文章数只作用于该自定义页面；
Halo 原生分类、标签和作者列表的分页仍由 Halo 控制。

### 首页

首页支持个人资料、Education、Website List、Certifications、Skills 与随机名言。
各内容区块分别提供显示开关与内容列表。随机名言可设置 JSON 接口和与 Pure
`quote.target` 等价的解析函数；解析函数属于可执行 JavaScript，仅应使用受信任
的配置。

### 友链

友链设置由以下五部分组成：

1. Common Links；
2. Links with Bad Status；
3. Special Links；
4. Link History Book；
5. Apply Links 申请说明。

三类友链使用相同的数据结构，包括站点名称、简介、地址与头像。头像为空时，主题
根据站点地址请求 `/favicon.ico`。

Apply Links 中的本站名称、简介、地址与头像读取 Halo 站点设置，不需要重复配置。

### 文章

文章设置包括封面、目录样式、阅读进度、评论、相邻文章与 Medium Zoom。
Medium Zoom 可进一步设置图片选择器和打开状态的 className。

### 站点条款

`/terms` 默认包含使用规则、个人信息处理、第三方服务、未成年人、版权、免责
声明、条款更新与联系方式。普通个人博客可以直接使用默认内容。

### 页脚

页脚支持版权起始年份、两种位置的通用链接、社交链接、备案信息、站点条款、
Halo & Pure Powered、GitHub 与 RSS。未配置通用社交链接时继续使用 GitHub 与
RSS 兼容开关；备案信息默认为空。兼容开关中的 GitHub 地址固定指向
[DanielZhangyc/astro-pure-halo](https://github.com/DanielZhangyc/astro-pure-halo)。

Projects 专用页面仍处于撤下状态，本次设置补全没有恢复 Projects、Sponsors 或
Sponsorship 配置。

## 开发状态

- [x] About 使用 Halo 默认页面正文，并保留旧模板兼容
- [x] 友链页面及五项配置
- [x] 单页站点条款
- [x] Moments 插件适配
- [ ] Projects 专用页面与模块化设置
- [ ] 文章底部 “Buy me a cup of coffee”

Projects 与文章赞助入口当前不参与页面渲染。旧版本的 Pure Projects 模板会回退
为普通 Halo 页面正文。

## 开发与构建

本地开发需要 Node.js 22.12+、pnpm 10+ 与 JRE 21+。

```bash
pnpm install
pnpm dev
```

默认服务地址：

- 站点：<http://localhost:8090>
- Console：<http://localhost:8090/console>

可以通过环境变量修改端口：

```bash
HALO_PORT=8091 pnpm dev
```

执行检查、构建与打包：

```bash
pnpm check
pnpm build
pnpm package
```

构建结果写入 `templates/`，主题安装包写入 `dist/`。`templates/` 属于构建产物，
不应直接修改。

## 移植基准

- 上游仓库：[cworld1/astro-theme-pure](https://github.com/cworld1/astro-theme-pure)
- 本地对照：`.reference/astro-theme-pure`
- 对照提交：`0047f6d4278d4c3e823dca608022cd6ebe7b5c96`
- 项目约束：[AGENTS.md](AGENTS.md)

## 相关文档

- [开发说明](docs/DEVELOPMENT.md)
- [实施报告](docs/IMPLEMENTATION_REPORT.md)
- [开发计划](docs/ROADMAP.md)

## 开源许可

本项目基于 Apache License 2.0 发布，上游来源与许可信息见 [NOTICE](NOTICE)。

原主题仓库：[cworld1/astro-theme-pure](https://github.com/cworld1/astro-theme-pure)
