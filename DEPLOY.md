# MIUYU Portfolio 部署说明

## 推荐环境

- Node.js 20 或更高版本
- pnpm 9.15.5
- 构建命令：`pnpm build`
- 发布目录：`dist`

## 本地生成上线包

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

构建完成后，将 `dist` 文件夹上传到静态网站托管平台即可。项目使用相对基础路径，并通过 `import.meta.env.BASE_URL` 生成资源地址，兼容根域名和子目录部署。

## Netlify

项目已经包含 `netlify.toml`。可以直接连接代码仓库，也可以把构建后的 `dist` 文件夹拖入 Netlify Deploys 页面。

## Vercel

项目已经包含 `vercel.json`。导入项目后会自动使用 pnpm 安装依赖、执行 Vite 构建并发布 `dist`。

## Cloudflare Pages 或其他静态托管

设置以下参数：

- Build command：`pnpm build`
- Build output directory：`dist`
- Node version：`20`

## 静态资源说明

- 首屏原视频已备份并裁剪为网页实际播放的 17.5 秒版本。
- 首屏部署版保持 1920×1080，移除音轨并启用 MP4 Fast Start。
- 项目卡片视频采用进入视口附近才加载、离开后暂停的策略。
- 画廊仅保留网页实际展示的 14 张精选图片。
- 未使用图片和原视频保存在相邻目录 `G:\作品集网页\miuyu-portfolio-assets-backup`，不要上传该目录。

## 上线前检查

1. 使用 `pnpm preview` 检查首页、横向作品区、视频弹窗和联系信息。
2. 确认自定义域名已启用 HTTPS；自动播放视频在 HTTPS 环境下兼容性最佳。
3. 视频与图片应使用长期缓存。Netlify/Cloudflare 可直接读取项目中的 `public/_headers`。
4. 如果后续替换同名图片或视频，请同时更新文件名，避免浏览器继续使用旧缓存。
