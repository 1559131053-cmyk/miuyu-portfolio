# MIUYU Portfolio — 三维设计师个人作品集

> 暗色系个人作品集网站，展示三维手表渲染作品。基于 React + Vite + TypeScript + Tailwind CSS 构建。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2 | UI 框架 |
| TypeScript | 5.9 | 类型安全 |
| Vite | 7.2 | 构建工具 / Dev Server |
| Tailwind CSS | 3.4 | 原子化样式 |
| OGL | 1.0 | SoftAurora WebGL 极光背景 |
| Lucide React | 0.562 | 图标库 |

## 快速开始

```bash
# 安装依赖
pnpm install --frozen-lockfile

# 启动开发服务器 (localhost:5173)
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

## 项目结构

```
portfolio/
├── public/                     # 静态资源
│   ├── hero-video.mp4          # 首屏全屏背景视频（部署优化版，约 25MB）
│   ├── about-portrait.png      # About 板块人物照片
│   ├── watch-*.mp4             # 12 个项目展示视频
│   └── gallery/                # Gallery 精选图片（14 张 JPG）
├── src/
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件，组装所有板块
│   ├── App.css                 # 应用级样式
│   ├── index.css               # 全局样式 + Tailwind 指令 + 自定义动画
│   │
│   ├── sections/               # 页面板块组件
│   │   ├── Hero.tsx            # 首屏 — 全屏视频背景 + TextPressure 变量字体大字
│   │   ├── About.tsx           # 关于 — 人物照片 + 个人简介 + 技能统计
│   │   ├── Projects.tsx        # 三维项目展示 — 下滑驱动横向浏览
│   │   ├── Advantages.tsx      # 优势 — 卡片网格
│   │   ├── Gallery.tsx         # 作品图集 — 14 张精选图片编辑式排版
│   │   ├── Contact.tsx         # 联系方式 — 邮箱、电话、微信
│   │   └── Navbar.tsx          # 导航栏 — 固定顶部 + 滚动平滑跳转
│   │
│   ├── components/             # 可复用组件
│   │   ├── TextPressure.tsx    # 变量字体鼠标交互动效 (React Bits 移植)
│   │   ├── BorderGlow.tsx      # 边缘光晕卡片容器
│   │   ├── BorderGlow.css
│   │   ├── SoftAurora.tsx      # OGL 柔和极光能力卡背景
│   │   └── SoftAurora.css
│   │
│   ├── hooks/
│   │   └── useScrollReveal.ts  # 滚动进入视口触发淡入动画
│
├── tailwind.config.js          # Tailwind 配置 (自定义颜色/缓动/时长)
├── vite.config.ts              # Vite 配置 (@ 别名 → ./src)
├── tsconfig.json               # TypeScript 配置
├── tsconfig.app.json           # 应用 TS 配置 (resolveJsonModule: true)
├── postcss.config.js
├── eslint.config.js
├── DEPLOY.md                   # 中文上线部署说明
└── index.html                  # HTML 入口
```

## 页面板块说明

### 1. Hero (首屏)
- 全屏视频背景 (`hero-video.mp4`)，渐变蒙版
- **TextPressure** 变量字体组件：鼠标移动时 "MIUYU" 字符的 weight/width/italic 轴实时形变
- 使用 Google Fonts `Roboto Flex` 可变字体
- 下方统计数字 (50+ 项目 / 3Y+ 经验)

### 2. About (关于)
- 人物照片 (`about-portrait.png`)，底部渐变蒙版
- 个人简介、技能统计
- 邮箱：miuyu@qq.com

### 3. Projects (三维项目展示)
- **交互方式**：向下滚动时驱动卡片向右浏览，浏览完成后继续进入下一板块
- 向上滚动不会被横向轨道拦截，可直接返回上一板块
- 卡片视频进入视口附近才加载，离开后自动暂停
- lerp 插值平滑动画
- 点击卡片打开视频弹窗 (React Portal 渲染，全屏覆盖)
- 12 个项目卡片，每个含视频/图片缩略图

### 4. Advantages (优势)
- 卡片网格布局，包含 BorderGlow 边缘光晕和 SoftAurora 动态背景

### 5. Gallery (作品图集)
- 从原始素材中精选 14 张高精度三维手表渲染图
- 主图、双幅细节、横幅、三联图和收尾双幅组成编辑式节奏

### 6. Contact (联系方式)
- 邮箱、个人电话与微信号

## 关键技术实现

- **TextPressure**: 变量字体鼠标交互，requestAnimationFrame 持续循环，lerp 平滑跟随
- **横向滑动**: 滚轮输入转换为横向目标位移，lerp 插值 + translate3d 硬件加速
- **统一缓动**: `cubic-bezier(0.16, 1, 0.3, 1)` 注册为 Tailwind `ease-smooth`
- **滚动淡入**: IntersectionObserver，threshold 可配置
- **视频弹窗**: React `createPortal` 渲染到 document.body，避免 transform containing block 问题

## Tailwind 自定义配置

```js
// tailwind.config.js 关键配置
colors: {
  'foreground': 'rgb(255 255 255)',
  'muted-foreground': 'rgb(255 255 255 / 60%)',
  'portfolio': '1280px',  // max-width
}
transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)'
}
transitionDuration: {
  '400': '400ms', '600': '600ms', '800': '800ms', '1200': '1200ms'
}
```

## 注意事项

- `public/` 中保留 12 个实际使用的视频和 14 张精选图片，上线静态资源约 270MB
- 原始首屏视频、未使用视频和画廊原图保存在项目旁的素材备份目录，不参与构建
- 未使用的旧组件、历史数据和依赖已从上线项目中移出，并保存在素材备份目录
- 具体部署方式见 `DEPLOY.md`
