# 灵境 Web Demo

纯前端切片（Vite + React + TypeScript），数据在 `localStorage`。

```sh
npm install
npm run dev
```

## 字体

正文使用本地 **思源黑体 Noto Sans SC**（OFL），标题使用思源宋体。不要外链 Google Fonts。

源文件（`public/fonts/`）：

- `NotoSansSC-Regular.otf`
- `NotoSansSC-Medium.otf`
- `OFL.txt`

子集化后页面加载：

- `sans-regular.woff2`(400) / `sans-medium.woff2`(500)，注册为 `LingjingSans`；不提供 600，请求 600 时回落到 Medium
- `serif-regular.woff2`(400) / `serif-medium.woff2`(500) / `serif-semibold.woff2`(600)，注册为 `SourceHanSerif`

衬线源文件为原 App 使用的 `SourceHanSerifCN-*.otf`，放在 `fonts-src/`（不入库，从 `lingjing/assets/font/` 复制）。
全局 `font-synthesis: none`，禁止浏览器伪粗体。

重新子集：

```sh
npm run fonts:subset
```

需要 `python` 以及 `fonttools`、`brotli`：`python -m pip install fonttools brotli`
