# -AI-
一个 7 x 24 小时 不抱怨的网站小AI客服
 **"YiYiAi Core (核心版)"**。

# YiYiAi Management Core (益益AI 管理核心)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)](YiYiAi-manage.js)

**YiYiAi Management Core** 是一款专为前端开发与网站管理设计的轻量级 AI 辅助引擎。

作为一个单文件（Single-file）解决方案，它能无缝嵌入任何网页，提供 **DOM 实时可视化编辑**、**AI 代码辅助修改**、**智能对话调试**以及**SEO 深度分析**功能。

> **注意**: 本仓库开源的是 YiYiAi 的**核心管理引擎**。它包含了所有功能逻辑、编辑器和 AI 交互能力。
> *(注：移动端适配插件与高级 UI 主题包属于商业版组件，不包含在此开源版本中，但核心功能完全可用。)*

## ✨ 核心功能

### 1. 🛠 可视化 DOM 智能编辑器
* **深度探查**: 提供类似 Chrome DevTools 的元素树状视图，支持折叠/展开。
* **双向编辑**: 支持“代码视图”与“实时预览”分屏操作，所见即所得。
* **安全沙箱**: 编辑操作在隔离环境中进行，确保页面稳定性。

### 2. 🤖 AI 代码修改 (Text-to-Code)
* **自然语言指令**: 选中页面任意元素，告诉 AI “把这个按钮改成圆角并加阴影”，AI 将自动生成代码并应用。
* **智能回滚**: 支持撤销 AI 的修改操作，保留修改历史。

### 3. 🧠 深度思考 AI 助手
* **流式对话**: 集成 SSE (Server-Sent Events) 流式响应。
* **思维链展示**: 支持显示 AI 的 `reasoning_content` (深度思考过程)，适合复杂逻辑调试。
* **上下文感知**: 可配置 Persona (人设) 和外部知识库 URL。

### 4. 📊 SEO 智能诊断
* **一键分析**: 自动抓取页面 HTML 结构。
* **专业报告**: 生成包含 Head 标签优化、内容策略、关键词布局的 Markdown 格式建议书。

## 🚀 快速集成

只需将 `YiYiAi-manage.js` 引入您的 HTML 页面即可（通常放置在 `</body>` 之前）。

```html
<script 
    id="yiyiai-boot-script" 
    src="path/to/YiYiAi-manage.js" 
    persona="你是一个资深的前端开发与SEO专家"
    data-url="[https://your-docs-url.com](https://your-docs-url.com)"
></script>

```

### 配置参数

* `id="yiyiai-boot-script"`: **必须保留**，用于脚本识别自身配置。
* `persona`: (可选) 定义 AI 的角色设定。
* `data-url`: (可选) 传递给 AI 的额外上下文链接。

## ⚙️ 后端接口配置 (必读)

本项目是一个纯前端引擎，需要配合后端接口使用以连接 LLM（如 OpenAI, Claude, DeepSeek 等）。

前端默认请求地址为 `/YiYiAi-manage.php`。您需要实现一个满足以下协议的后端接口：

* **请求方式**: `POST`
* **数据格式**: JSON
```json
{
    "messages": [
        {"role": "system", "content": "..."},
        {"role": "user", "content": "..."}
    ],
    "stream": true
}

```


* **响应格式**: 标准 SSE (Server-Sent Events) 流。

*(如果您有自己的后端地址，请在 JS 文件中全局搜索 `/YiYiAi-manage.php` 并替换为您自己的 API URL。)*

## 📦 项目结构

```text
.
├── YiYiAi-manage.js    # 核心引擎 (包含所有逻辑、样式注入与编辑器)
├── README.md           # 说明文档
└── LICENSE             # 开源协议

```

## 🛠 开发指南

本项目采用 **"All-in-One"** 架构，无需 Webpack/Vite 打包。

* **样式管理**: CSS 通过 `WIDGET_CSS` 常量直接注入，修改 JS 内的 CSS 字符串即可实时生效。
* **外部依赖**: 自动通过 CDN 加载 `marked.js`, `purify.js`, `highlight.js`，无需本地安装。

## 🤝 贡献与协议

本项目基于 **MIT 协议** 开源。
欢迎提交 Issue 反馈 Bug，或提交 PR 贡献代码。

---

*Created with ❤️ by YiYiAi (王喜乐) Team*

```

```
