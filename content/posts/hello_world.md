---
title: "blog 1,自建博客网站"
date: 2026-07-09T14:40:30+08:00
draft: false
---

2026.7.9

第一篇博客

# 建立个人博客网站（Hugo + GitHub Pages）完整知识整理

> 基于实际操作经验整理，包含所有踩坑记录和解决方案

---

## 一、前置准备

1. 安装 Hugo（extended 版本）
2. 安装 Git
3. 注册 GitHub 账号
4. 安装 VS Code

---

## 二、Hugo 博客搭建步骤

### 2.1 创建博客站点

```bash
cd 你想放博客的目录
hugo new site 博客文件夹名
cd 博客文件夹名
git init
```

### 2.2 安装主题

```bash
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
```

### 2.3 配置 hugo.toml

关键配置项：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| baseURL | GitHub Pages 地址 | `https://用户名.github.io` |
| languageCode | 语言代码 | `zh-cn` |
| title | 博客标题 | `技术笔记` |
| theme | 主题名 | `PaperMod` |

完整配置示例：

```toml
baseURL = 'https://doublecloud999.github.io'
languageCode = 'zh-cn'
title = '技术笔记'
theme = 'PaperMod'

[params]
  author = 'doublecloud999'
  description = '记录技术学习过程'
  defaultTheme = 'auto'

[params.profileMode]
  enabled = true
  title = "你好"
  subtitle = "记录技术学习过程"

[[menu.main]]
  name = '首页'
  url = '/'
  weight = 10

[[menu.main]]
  name = '文章'
  url = '/posts/'
  weight = 20

[[menu.main]]
  name = '标签'
  url = '/tags/'
  weight = 30
```

> **踩坑记录**：baseURL 初始默认是 `https://example.com`，必须改成你的真实地址，否则所有链接都会跳转到 example.com

### 2.4 创建文章

方式一：命令行创建（自动生成 Front Matter）

```bash
hugo new content posts/文章标题.md
```

方式二：手动创建

在 VS Code 中右键 `content/posts` 文件夹 → 新建文件 → 输入 `文章标题.md`

文章格式：

```markdown
---
title: "文章标题"
date: 2026-07-10T13:51:00+08:00
draft: false
---

文章内容
```

> **踩坑记录**：
> 1. Front Matter 格式必须用 `---` 包裹
> 2. `draft` 必须设为 `false`，否则文章不显示
> 3. 不能有多套 Front Matter（如同时有 `+++` 和 `---`）

---

## 三、GitHub Pages 部署

### 3.1 创建仓库

- 仓库名必须是：`用户名.github.io`（如 `doublecloud999.github.io`）
- 必须是 **Public**

### 3.2 配置 Git

```bash
git config --global user.email "你的邮箱"
git config --global user.name "你的名字"
```

### 3.3 推送代码

```bash
git remote add origin https://github.com/用户名/用户名.github.io.git
git add .
git commit -m "init blog"
git branch -M main
git push -u origin main
```

> **踩坑记录**：GitHub 已不支持密码验证，必须用 Personal Access Token

### 3.4 生成 Token

1. GitHub 右上角头像 → **Settings**
2. 左侧最下方 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. 点击 **Generate new token (classic)**
5. Note 填 `blog deploy`
6. Expiration 选 **No expiration**（永不过期）
7. 勾选 **repo**（全部）和 **workflow**
8. 点击 **Generate token**
9. **复制 Token**（只显示一次）

### 3.5 用 Token 推送

```bash
git remote set-url origin https://用户名:Token@github.com/用户名/用户名.github.io.git
git push --set-upstream origin main
```

---

## 四、GitHub Actions 自动部署

### 4.1 创建 deploy.yml

路径：`.github/workflows/deploy.yml`

> **踩坑记录**：文件夹名必须是 `.github`（前面有点），不是 `github`

最终目录结构：

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── archetypes/
├── content/
│   └── posts/
│       └── hello_world.md
├── themes/
│   └── PaperMod/
├── hugo.toml
└── ...
```

### 4.2 deploy.yml 内容

> **核心踩坑**：对于 `username.github.io` 仓库，必须用 GitHub 官方部署方式，不能用推送到 `gh-pages` 分支的方式

```yaml
name: Deploy Hugo

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **为什么不能用 `peaceiris/actions-gh-pages`**：
> 对于 `username.github.io` 这种特殊仓库名，GitHub 会自动启用内置的 `pages-build-deployment` 工作流，该工作流无法禁用。如果使用推送到 `gh-pages` 分支的方式，会与内置工作流冲突，导致部署被覆盖。

### 4.3 配置 GitHub Pages

1. 仓库页面 → **Settings** → **Pages**
2. `Source` 选择 **GitHub Actions**
3. 点击 **Save**

### 4.4 配置 Actions 权限

1. 仓库页面 → **Settings** → **Actions** → **General**
2. 往下滚动到 **Workflow permissions**
3. 选择 **Read and write permissions**
4. 勾选 **Allow GitHub Actions to create and approve pull requests**
5. 点击 **Save**

---

## 五、网络问题处理

### 5.1 Git 走代理

```bash
git config --global http.proxy http://127.0.0.1:代理端口
git config --global https.proxy http://127.0.0.1:代理端口
```

常见代理端口：
- Clash：7890
- 你的梯子：33210（HTTP）/ 33211（SOCKS5）

### 5.2 取消代理

推送完成后可以取消：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

---

## 六、常见错误及解决

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `LF will be replaced by CRLF` | Windows 和 Linux 换行符不同 | 只是警告，忽略即可 |
| `Author identity unknown` | Git 未配置用户名和邮箱 | `git config --global user.email` 和 `user.name` |
| `Connection was reset` | 网络或代理问题 | 配置 Git 代理或检查梯子 |
| `src refspec main does not match any` | 没有提交记录 | 先 `git commit` 再推送 |
| `! [rejected] main -> main (fetch first)` | 远程有本地没有的更改 | 先 `git pull origin main` 再 `git push` |
| 打开 vim 编辑器 | `git pull` 需要合并消息 | 按 `Esc`，输入 `:wq`，回车 |
| 文章 404 | content 为空或 draft=true | 创建文章，确保 `draft: false` |
| 文章列表为空 | Front Matter 格式错误 | 只保留一套 `---`，draft 设为 false |
| 跳转到 example.com | baseURL 未修改 | `hugo.toml` 中改为真实地址 |
| Actions 权限不足 | 未开启写入权限 | Settings → Actions → Read and write permissions |
| `Invalid username or token` | 密码验证已禁用 | 使用 Personal Access Token |
| `Permission denied to github-actions[bot]` | Actions 权限不足 | 开启 Read and write permissions |

---

## 七、后续更新博客流程

### 7.1 写新文章

方式一（命令行）：

```bash
hugo new content posts/文章标题.md
```

方式二（手动）：

VS Code 中右键 `content/posts` → 新建文件 → 输入 `文章标题.md`

### 7.2 编辑内容

打开文件，在 `---` 下方写 Markdown 内容。

### 7.3 本地预览（可选）

```bash
hugo server -D
```

浏览器访问 `http://localhost:1313`

### 7.4 推送到 GitHub

```bash
git pull origin main
git add .
git commit -m "add: 文章标题"
git push
```

### 7.5 等待部署

等 2-3 分钟，GitHub Actions 自动构建并部署。

---

## 八、核心踩坑总结

1. **`username.github.io` 是特殊仓库**：GitHub 会自动启用内置 `pages-build-deployment` 工作流，无法禁用
2. **必须用官方部署方式**：使用 `actions/deploy-pages`，不能用推送到 `gh-pages` 分支的方式
3. **baseURL 必须正确**：改成 `https://用户名.github.io`，不能是 example.com
4. **文章 draft 必须 false**：否则 Hugo 不显示
5. **Front Matter 格式正确**：用 `---` 包裹，不能有多套
6. **GitHub 不支持密码验证**：必须用 Token，且需要 `repo` + `workflow` 权限
7. **推送前先 pull**：避免远程冲突
8. **.github 文件夹名**：前面有点，不是 `github`
9. **Actions 权限要开启**：Read and write permissions
10. **网络问题配代理**：Git 不走系统代理，需要单独配置

---

## 九、博客地址

部署成功后访问：

```
https://doublecloud999.github.io
```

---

*整理时间：2026-07-10*
