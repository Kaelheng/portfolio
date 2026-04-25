# GitHub Pages 部署指南（从零开始）

这份文档适合你当前这个 `portfolio` 项目，目标是：

- 把网站发布到外网可访问地址
- 用 GitHub 自动部署（每次 push 自动更新）
- 可选绑定自己的域名（如 `www.yourdomain.com`）

---

## 0. 前提准备

你需要准备好：

- 已注册 GitHub 账号
- 本地已安装 Git
- 项目能本地运行并构建成功（本项目命令是 `npm run build`）
建议先在项目目录执行一次：

```bash
npm install
npm run build
```

如果构建成功，再继续下面步骤。

---

## 1. 在 GitHub 创建仓库

1. 登录 GitHub，点击右上角 `+` -> `New repository`
2. 仓库名建议用：`portfolio`
3. 选择 `Public`（公开仓库更方便展示）
4. 不要勾选初始化 README（本地已有项目）
5. 点击 `Create repository`

创建后你会看到仓库地址，形如：

`https://github.com/<你的用户名>/portfolio.git`

---

## 2. 本地项目首次推送到 GitHub

在 `portfolio` 目录执行（PowerShell 或终端均可）：

```bash
git init
git add .
git commit -m "feat: initial portfolio site"
git branch -M main
git remote add origin https://github.com/Kaelheng/portfolio.git
git push -u origin main
```

如果你已经 `git add` 过但还没提交，直接执行这两条也可以：

```bash
git commit -m "feat: initial portfolio site"
git push -u origin main
```

> 出现 `error: src refspec main does not match any` 的原因通常是“还没有 commit”。先执行 `git commit` 再 `git push` 即可。

> 出现 `SSL certificate problem: unable to get local issuer certificate` 时，不要继续改 Git 配置。请先在系统里修复证书链（安装系统更新 / 更新 Git for Windows 到最新版），或改用 GitHub Desktop 完成首次 push。

如果你之前已经初始化过 git，只需要：

```bash
git add .
git commit -m "chore: update portfolio"
git push
```

---

## 3. 开启 GitHub Pages 自动部署

本项目已经准备好自动部署文件：

- `.github/workflows/deploy.yml`
- `vite.config.ts` 中已处理 GitHub Pages 的 `base`

你只需要在 GitHub 网页上开启：

1. 进入仓库 `Settings` -> `Pages`
2. `Build and deployment` 选择 `GitHub Actions`
3. 返回仓库 `Actions` 页面，等待 `Deploy to GitHub Pages` 工作流成功（绿色）

成功后访问地址通常是：

`https://<你的用户名>.github.io/portfolio/`

---

## 4. 以后怎么更新网站

每次改完代码后执行：

```bash
git add .
git commit -m "feat: update content"
git push
```

推送后 GitHub 会自动重新构建并发布，通常 1-2 分钟生效。

---

## 5. 可选：绑定你自己的域名（推荐）

比如你有域名 `yourdomain.com`，想用 `www.yourdomain.com`：

### 5.1 在项目里添加 CNAME 文件

在 `public` 目录新建 `CNAME` 文件，内容只写一行：

```txt
www.yourdomain.com
```

然后提交并 push。

### 5.2 配置 DNS（到域名服务商）

- 主机记录：`www`
- 记录类型：`CNAME`
- 记录值：`<你的用户名>.github.io`

### 5.3 GitHub 里填写自定义域名

1. 仓库 `Settings` -> `Pages`
2. `Custom domain` 填：`www.yourdomain.com`
3. 等待证书签发后，勾选 `Enforce HTTPS`

---

## 6. 想让搜索引擎更容易搜到（SEO基础）

至少做这三件事：

- 设置网页标题和描述（`index.html`）
- 添加 `public/robots.txt`
- 添加 `public/sitemap.xml`

然后去提交站长平台：

- Google Search Console
- Bing Webmaster Tools

---

## 7. 常见问题排查

### Q1: 页面 404 或空白

- 检查仓库名是否与访问路径一致（`/portfolio/`）
- 检查 `Settings -> Pages` 是否选了 `GitHub Actions`
- 看 `Actions` 里是否构建失败

### Q2: CSS/JS 丢失

- 常见原因是 `base` 路径不对
- 本项目 `vite.config.ts` 已自动处理，确认你是通过工作流部署

### Q3: 域名已配但打不开

- DNS 生效可能要几分钟到 48 小时
- 确认 CNAME 指向 `<用户名>.github.io`
- GitHub Pages 里 Custom domain 拼写必须完全一致

### Q4: 国内有人访问不了

- 这是网络链路问题，GitHub Pages 无法保证所有地区稳定访问
- 需要“国内稳定访问”时，建议主站迁移到国内托管（如 OSS + CDN 或备案服务器）

---

## 8. 推荐你的上线流程（最稳）

1. 先用 GitHub Pages 上线，拿到可访问链接用于投递简历  
2. 再绑定自己的域名，提升专业度  
3. 再补齐 `robots.txt` + `sitemap.xml`，做收录  
4. 如果要面向国内稳定访问，再做国内托管主站，GitHub 作为备份

---

## 9. 一条命令检查当前状态（可选）

```bash
git status
git remote -v
```

---

如果你愿意，我可以下一步继续帮你：

- 直接生成 `public/CNAME`（你给我真实域名）
- 直接生成 `robots.txt` 和 `sitemap.xml`
- 再给你一版“简历投递专用”的超短部署清单（1页）
