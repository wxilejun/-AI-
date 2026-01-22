// 使用IIFE（立即调用函数表达式）来创建私有作用域，避免污染全局命名空间
(function() {
    // --- 获取启动脚本和自定义属性 ---
    const bootScript = document.getElementById('yiyiai-boot-script');
    let customPersona = null;
    let contextUrl = null;

    if (bootScript) {
        customPersona = bootScript.getAttribute('persona');
        contextUrl = bootScript.getAttribute('data-url');
        console.log(
            '%c益益AI',
            'color: #4285f4; text-decoration: underline; cursor: pointer',
            '-> 益益AI 为您的网站保驾护航：https://ai.xlj0.com'
        );
        console.log('AI助手配置加载:', { persona: customPersona, url: contextUrl });
    } else {
        console.warn('AI助手警告：未能找到ID为 "yiyiai-boot-script" 的script标签，无法加载自定义 persona 和 data-url。');
    }

    // 1. 定义所有需要的资源和内容
    const VENDOR_RESOURCES = {
        css: ["https://ai.xlj0.com/morething/YiYiAi-manage/static/atom-one-dark.min.css"],
        js: [
            "https://ai.xlj0.com/morething/YiYiAi-manage/static/marked.min.js",
            "https://ai.xlj0.com/morething/YiYiAi-manage/static/purify.min.js",
            "https://ai.xlj0.com/morething/YiYiAi-manage/static/highlight.min.js"
        ]
    };

    // --- 修改: 新增综合信息选项卡的HTML结构 ---
    const WIDGET_HTML = `
        <div id="yiyiai-trigger-btn" title="AI助手">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 85.333333H128C104.533333 85.333333 85.333333 104.533333 85.333333 128v512c0 23.466667 19.2 42.666667 42.666667 42.666667h512c23.466667 0 42.666667-19.2 42.666667-42.666667v-85.333333h128c23.466667 0 42.666667-19.2 42.666667-42.666667V128c0-23.466667-19.2-42.666667-42.666667-42.666667zM725.333333 597.333333c0 23.466667-19.2 42.666667-42.666666 42.666667H170.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667V170.666667c0-23.466667 19.2-42.666667 42.666667-42.666667h512c23.466667 0 42.666666 19.2 42.666666 42.666667v426.666666z m213.333334-128c0 23.466667-19.2 42.666667-42.666667 42.666667h-85.333333V170.666667c0-47.36-38.4-85.333333-85.333334-85.333334H170.666667v-0.533333h682.666666c23.466667 0 42.666667 19.2 42.666667 42.666667v341.333333z m-469.333334-85.333333a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z"></path></svg>
        </div>
        <div id="yiyiai-overlay">
            <div id="yiyiai-modal">
                <div class="yiyiai-header">
                    <div class="yiyiai-tabs">
                        <button class="yiyiai-tab active" data-tab="main">益益 AI 助手</button>
                        <button class="yiyiai-tab" data-tab="overview">综合信息</button> <!-- 新增 -->
                        <button class="yiyiai-tab" data-tab="elements">页面元素</button>
                        <button class="yiyiai-tab" data-tab="seo">SEO 优化</button>
                    </div>
                    <button id="yiyiai-close-btn">&times;</button>
                </div>
                <!-- 主面板（原有） -->
                <div id="yiyiai-main-panel" class="yiyiai-tab-content active">
                    <div id="yiyiai-thinking-panel"><details open><summary><span class="yiyiai-summary-text">AI 深度思考中...</span><div class="yiyiai-progress-bar"><div class="yiyiai-progress-bar-inner"></div></div></summary><pre id="yiyiai-reasoning-log"></pre></details></div>
                    <div id="yiyiai-chat-container"><div class="yiyiai-message yiyiai-bot-msg"><div class="yiyiai-avatar"></div><div class="yiyiai-content">您好！我是益益AI助手。您可以随时问我问题。</div></div></div>
                    <div class="yiyiai-input-area"><input type="text" id="yiyiai-user-input" placeholder="输入您的问题..."><button id="yiyiai-send-btn">发送</button></div>
                </div>
                <!-- 新增：综合信息面板 -->
                <div id="yiyiai-overview-panel" class="yiyiai-tab-content">
                    <div class="yiyiai-overview-toolbar">
                        <h3>页面综合信息概览</h3>
                        <p>当前页面核心技术与内容信息汇总（实时更新）</p>
                    </div>
                    <div id="yiyiai-overview-content" class="yiyiai-overview-details"></div>
                </div>
                <!-- 页面元素面板（原有） -->
                <div id="yiyiai-elements-panel" class="yiyiai-tab-content">
                    <div id="yiyiai-elements-toolbar"><input type="text" id="yiyiai-search-input" placeholder="通过 #id, .class 或文字搜索..."><button id="yiyiai-search-btn">搜索</button><button id="yiyiai-clear-search-btn">清除</button></div>
                    <div id="yiyiai-elements-content"></div>
                </div>
                <!-- SEO优化面板（原有） -->
                <div id="yiyiai-seo-panel" class="yiyiai-tab-content">
                    <div class="yiyiai-seo-toolbar">
                        <h3>网站 SEO 智能分析</h3>
                        <p>点击下方按钮，AI将对当前页面进行全面分析，并提供详细的优化建议。</p>
                        <button id="yiyiai-seo-analyze-btn">开始智能分析</button>
                    </div>
                    <div id="yiyiai-seo-content"></div>
                </div>
            </div>
        </div>
        <!-- 编辑器弹窗（原有） -->
        <div id="yiyiai-editor-overlay" style="display: none;">
             <div id="yiyiai-editor-modal">
                <div class="yiyiai-editor-header">
                    <h3>编辑 & 预览元素</h3>
                    <div id="yiyiai-editor-view-controls">
                        <button id="yiyiai-view-split-btn" class="active" title="分屏视图">分屏</button>
                        <button id="yiyiai-view-code-btn" title="仅代码">代码</button>
                        <button id="yiyiai-view-preview-btn" title="仅预览">预览</button>
                    </div>
                    <button id="yiyiai-editor-close-btn">&times;</button>
                </div>
                
                <div id="yiyiai-editor-main-area">
                     <textarea id="yiyiai-editor-textarea"></textarea>
                     <div id="yiyiai-preview-wrapper">
                         <iframe id="yiyiai-preview-iframe" sandbox="allow-scripts allow-same-origin"></iframe>
                     </div>
                </div>

                <div id="yiyiai-editor-progress-container" style="display: none;">
                    <div class="yiyiai-editor-progress-bar"></div>
                </div>
                <div class="yiyiai-editor-footer">
                    <div class="yiyiai-editor-notice">警告: 不正确的修改可能破坏页面</div>
                    <div>
                        <span id="yiyiai-ai-actions-wrapper">
                            <button id="yiyiai-editor-ai-btn">与 AI 沟通修改</button>
                        </span>
                        <button id="yiyiai-editor-cancel-btn">取消</button>
                        <button id="yiyiai-editor-save-btn">保存并更新页面</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- AI提示弹窗（原有） -->
        <div id="yiyiai-ai-prompt-overlay" style="display: none;">
            <div id="yiyiai-ai-prompt-modal">
                <h4>告诉 AI 如何修改</h4>
                <p>例如：“给最外层div添加一个红色的虚线边框”</p>
                <input type="text" id="yiyiai-ai-prompt-input" placeholder="输入您的修改指令...">
                <div class="yiyiai-ai-prompt-footer">
                    <button id="yiyiai-ai-prompt-cancel-btn">取消</button>
                    <button id="yiyiai-ai-prompt-confirm-btn">确认修改</button>
                </div>
            </div>
        </div>
        <div id="yiyiai-toast-container"></div>
    `;

    // --- 修改: 新增综合信息面板样式 ---
    const WIDGET_CSS = `
        /* General Styles */
        #yiyiai-trigger-btn { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: linear-gradient(45deg, #2563eb, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); z-index: 99997; transition: transform 0.2s ease-in-out; animation: yiyiai-pulse 2.5s infinite; }
        #yiyiai-trigger-btn:hover { transform: scale(1.1); animation-play-state: paused; }
        #yiyiai-trigger-btn svg { width: 32px; height: 32px; fill: white; }
        @keyframes yiyiai-pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); } 70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }
        
        /* Main Modal & Overlay */
        #yiyiai-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 99998; display: none; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #yiyiai-overlay #yiyiai-modal { width: 90%; height: 85%; max-width: 700px; max-height: 800px; background-color: #0f172a; color: #f1f5f9; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); display: flex; flex-direction: column; overflow: hidden; animation: yiyiai-fadein 0.3s ease; }
        @keyframes yiyiai-fadein { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        #yiyiai-overlay .yiyiai-header { padding: 15px 20px; border-bottom: 1px solid rgba(148, 163, 184, 0.3); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        #yiyiai-overlay #yiyiai-close-btn { background: none; border: none; color: #94a3b8; font-size: 28px; cursor: pointer; line-height: 1; }
        .yiyiai-tabs { display: flex; gap: 8px; align-items: center; }
        .yiyiai-tab { background-color: transparent; border: 1px solid transparent; color: #94a3b8; padding: 6px 14px; font-size: 16px; font-weight: 500; border-radius: 6px; cursor: pointer; transition: all 0.2s ease-in-out; }
        .yiyiai-tab:hover:not(.active) { background-color: rgba(71, 85, 105, 0.4); }
        .yiyiai-tab.active { color: #f1f5f9; background-color: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.6); }
        .yiyiai-tab-content { display: none; flex-grow: 1; overflow: hidden; }
        .yiyiai-tab-content.active { display: flex; flex-direction: column; }

        /* Chat Panel（原有） */
        #yiyiai-overlay #yiyiai-chat-container { flex-grow: 1; overflow-y: auto; padding: 20px; }
        #yiyiai-overlay .yiyiai-message { margin-bottom: 15px; display: flex; max-width: 85%; }
        #yiyiai-overlay .yiyiai-message .yiyiai-avatar { width: 36px; height: 36px; border-radius: 50%; margin-right: 12px; flex-shrink: 0; }
        #yiyiai-overlay .yiyiai-message .yiyiai-content { overflow: auto; padding: 12px 16px; border-radius: 18px; line-height: 1.6; word-wrap: break-word; }
        .yiyiai-content ul, .yiyiai-content ol { color: #c1bcb4; padding-left: 20px; }
        .yiyiai-content h1, .yiyiai-content h2, .yiyiai-content h3, .yiyiai-content h4, .yiyiai-content h5, .yiyiai-content h6 { color: #ffffff; }
        .yiyiai-content p { margin: 0 0 10px; }
        .yiyiai-content li { margin-bottom: 5px; }
        #yiyiai-overlay .yiyiai-user-msg { margin-left: auto; flex-direction: row-reverse; }
        #yiyiai-overlay .yiyiai-user-msg .yiyiai-avatar { margin-left: 12px; margin-right: 0; background-color: #2563eb; }
        #yiyiai-overlay .yiyiai-user-msg .yiyiai-content { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); }
        #yiyiai-overlay .yiyiai-bot-msg .yiyiai-avatar { background-color: #7c3aed; }
        #yiyiai-overlay .yiyiai-bot-msg .yiyiai-content { background: linear-gradient(135deg, #374151 0%, #4b5563 100%); }
        #yiyiai-overlay .yiyiai-input-area { padding: 15px; border-top: 1px solid rgba(148, 163, 184, 0.3); display: flex; gap: 10px; flex-shrink: 0; }
        #yiyiai-overlay #yiyiai-user-input { flex-grow: 1; padding: 12px; border: 1px solid rgba(71, 85, 105, 0.7); border-radius: 8px; background-color: rgba(30, 41, 59, 0.5); color: #f1f5f9; font-size: 16px; }
        #yiyiai-overlay #yiyiai-send-btn { padding: 12px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
        #yiyiai-overlay #yiyiai-send-btn:disabled { background: #4b5563; cursor: not-allowed; }
        #yiyiai-overlay #yiyiai-thinking-panel { padding: 0px 20px 10px; border-bottom: 1px solid rgba(148, 163, 184, 0.2); display: none; flex-shrink: 0; }
        #yiyiai-overlay #yiyiai-thinking-panel summary { cursor: pointer; color: #94a3b8; font-weight: bold; padding: 10px 0; outline: none; display: flex; flex-direction: column; }
        #yiyiai-overlay #yiyiai-reasoning-log { display: none; margin-top: 10px; padding: 10px; background-color: rgba(0,0,0,0.2); border-radius: 6px; font-family: 'Courier New', monospace; font-size: 13px; color: #a5b4fc; white-space: pre-wrap; max-height: 150px; overflow-y: auto; border: 1px solid rgba(148, 163, 184, 0.2); }
        #yiyiai-overlay .yiyiai-summary-text { margin-bottom: 8px; }
        #yiyiai-overlay .yiyiai-progress-bar { width: 100%; height: 4px; background-color: rgba(148, 163, 184, 0.2); border-radius: 2px; overflow: hidden; }
        #yiyiai-overlay .yiyiai-progress-bar-inner { width: 50%; height: 100%; background: linear-gradient(90deg, #60a5fa, #a5b4fc); animation: yiyiai-progress-anim 2s infinite linear; }
        @keyframes yiyiai-progress-anim { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        #yiyiai-overlay .yiyiai-content pre { position: relative; margin: 15px 0; border-radius: 6px; }
        #yiyiai-overlay .yiyiai-content pre code { display: block; padding: 15px; font-size: 14px; }
        #yiyiai-overlay .yiyiai-content pre .yiyiai-copy-btn { position: absolute; top: 8px; right: 8px; background-color: #4b5563; color: #e5e7eb; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; opacity: 0.7; transition: opacity 0.2s; }
        #yiyiai-overlay .yiyiai-content pre:hover .yiyiai-copy-btn { opacity: 1; }

        /* 新增：综合信息面板样式 */
        #yiyiai-overview-panel { padding: 20px; background-color: rgba(0,0,0,0.2); flex-direction: column; }
        .yiyiai-overview-toolbar { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(148, 163, 184, 0.3); flex-shrink: 0; }
        .yiyiai-overview-toolbar h3 { margin: 0 0 10px; color: #a5b4fc; font-size: 20px; }
        .yiyiai-overview-toolbar p { margin: 0 0 15px; color: #94a3b8; font-size: 14px; line-height: 1.5; }
        .yiyiai-overview-details { flex-grow: 1; overflow-y: auto; padding-top: 20px; line-height: 1.7; color: #f1f5f9; }
        .yiyiai-overview-category { margin: 0 0 10px; color: #60a5fa; font-size: 16px; }
        .yiyiai-overview-item { margin-bottom: 15px; padding: 12px; background-color: rgba(30, 41, 59, 0.5); border-radius: 8px; transition: background 0.2s; }
        .yiyiai-overview-item:hover { background-color: rgba(30, 41, 59, 0.7); }
        .yiyiai-overview-label { font-weight: bold; color: #93c5fd; margin-right: 8px; }
        .yiyiai-overview-value { word-break: break-all; color: #e2e8f0; }

        /* Elements Panel（原有） */
        #yiyiai-elements-panel { background-color: rgba(0,0,0,0.2); overflow-y: auto; }
        #yiyiai-elements-toolbar { display: flex; padding: 10px 15px; border-bottom: 1px solid rgba(148, 163, 184, 0.3); gap: 10px; flex-shrink: 0; align-items: center; }
        #yiyiai-search-input { flex-grow: 1; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(148, 163, 184, 0.3); color: #f1f5f9; padding: 8px; border-radius: 4px; }
        #yiyiai-search-btn, #yiyiai-clear-search-btn { background: #2563eb; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        #yiyiai-clear-search-btn { background-color: #4b5563; }
        #yiyiai-elements-content { font-family: 'SF Mono', 'Courier New', monospace; font-size: 13px; flex-grow: 1; overflow: auto; padding: 10px 15px; }
        #yiyiai-elements-content .line { padding-left: calc(var(--indent, 0) * 2ch); white-space: pre; border-radius: 3px; transition: background-color 0.3s; }
        #yiyiai-elements-content .line.highlight { background-color: rgba(96, 165, 250, 0.2); }
        #yiyiai-elements-content .line.has-children > .toggle { display: inline-block; width: 2ch; cursor: pointer; user-select: none; color: #60a5fa; }
        #yiyiai-elements-content .line.editable:hover { background: rgba(96, 165, 250, 0.1); }
        #yiyiai-elements-content .line .tag-wrapper { cursor: pointer; }
        #yiyiai-elements-content mark { background-color: #facc15; color: black; border-radius: 2px; }
        
        /* SEO优化面板（原有） */
        #yiyiai-seo-panel { padding: 20px; background-color: rgba(0,0,0,0.2); flex-direction: column; }
        .yiyiai-seo-toolbar { text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(148, 163, 184, 0.3); flex-shrink: 0; }
        .yiyiai-seo-toolbar h3 { margin: 0 0 10px; color: #a5b4fc; font-size: 20px; }
        .yiyiai-seo-toolbar p { margin: 0 0 15px; color: #94a3b8; font-size: 14px; line-height: 1.5; }
        #yiyiai-seo-analyze-btn { background: #7c3aed; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.2s; }
        #yiyiai-seo-analyze-btn:hover { background: #6d28d9; }
        #yiyiai-seo-analyze-btn:disabled { background: #4b5563; color: #9ca3af; cursor: not-allowed; }
        #yiyiai-seo-content { flex-grow: 1; overflow-y: auto; padding-top: 20px; line-height: 1.7; }
        #yiyiai-seo-content .yiyiai-seo-loading { display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8; font-size: 16px; }
        #yiyiai-seo-content .yiyiai-seo-loading .yiyiai-spinner { width: 24px; height: 24px; border: 3px solid rgba(148, 163, 184, 0.3); border-top-color: #a5b4fc; border-radius: 50%; animation: yiyiai-spin 1s linear infinite; margin-right: 12px; }
        @keyframes yiyiai-spin { to { transform: rotate(360deg); } }
        #yiyiai-seo-content .yiyiai-content { background: none !important; padding: 0 !important; }

        /* Editor Modal（原有） */
        #yiyiai-editor-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100001; display: none; align-items: center; justify-content: center; }
        #yiyiai-editor-modal { width: 90%; max-width: 1200px; height: 85%; background: #0f172a; border: 1px solid rgba(148, 163, 184, 0.3); border-radius: 8px; display: flex; flex-direction: column; box-shadow: 0 10px 40px black; }
        .yiyiai-editor-header, .yiyiai-editor-footer { padding: 15px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; }
        .yiyiai-editor-header { border-bottom: 1px solid rgba(148, 163, 184, 0.3); }
        .yiyiai-editor-footer { border-top: 1px solid rgba(148, 163, 184, 0.3); flex-wrap: wrap; }
        .yiyiai-editor-footer > div:last-child { display: flex; gap: 10px; align-items: center; }
        .yiyiai-editor-header h3 { margin: 0; color: #60a5fa; }
        #yiyiai-editor-close-btn { background: none; border: none; color: #94a3b8; font-size: 28px; cursor: pointer; }
        #yiyiai-editor-cancel-btn { background: #4b5563; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        #yiyiai-editor-save-btn { background: #2563eb; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
        .yiyiai-editor-notice { font-size: 12px; color: #f87171; flex-grow: 1; }
        #yiyiai-editor-ai-btn { background: #7c3aed; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        #yiyiai-editor-ai-btn:hover { background: #6d28d9; }
        #yiyiai-editor-ai-btn:disabled { background: #4b5563; color: #9ca3af; cursor: not-allowed; }
        #yiyiai-editor-progress-container { width: 100%; height: 4px; background-color: rgba(148, 163, 184, 0.15); overflow: hidden; flex-shrink: 0; }
        .yiyiai-editor-progress-bar { width: 40%; height: 100%; background: linear-gradient(90deg, #a5b4fc, #7c3aed); animation: yiyiai-progress-anim 2s infinite linear; }
        #yiyiai-ai-actions-wrapper { display: inline-flex; gap: 10px; }
        #yiyiai-editor-undo-btn, #yiyiai-editor-regen-btn { background-color: #4b5563; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        #yiyiai-editor-undo-btn:hover, #yiyiai-editor-regen-btn:hover { background-color: #6b7280; }
        
        #yiyiai-editor-main-area { flex-grow: 1; display: flex; overflow: hidden; }
        #yiyiai-editor-textarea { flex-grow: 1; flex-basis: 50%; background: #020617; color: #e2e8f0; font-family: 'SF Mono', 'Courier New', monospace; font-size: 14px; border: none; resize: none; padding: 15px; border-right: 1px solid rgba(148, 163, 184, 0.3); }
        #yiyiai-preview-wrapper { flex-grow: 1; flex-basis: 50%; background-color: #ffffff; overflow: auto; }
        #yiyiai-preview-iframe { width: 100%; height: 100%; border: none; }
        #yiyiai-editor-view-controls { display: flex; gap: 5px; position: absolute; left: 50%; transform: translateX(-50%); }
        #yiyiai-editor-view-controls button { background: #4b5563; color: white; border: 1px solid transparent; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        #yiyiai-editor-view-controls button:hover { background: #6b7280; }
        #yiyiai-editor-view-controls button.active { background: #2563eb; border-color: #60a5fa; }
        
        /* Toast & Cursor（原有） */
        #yiyiai-toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 100002; display: flex; flex-direction: column; align-items: center; gap: 10px; pointer-events: none; }
        .yiyiai-toast { padding: 12px 20px; border-radius: 8px; color: #f1f5f9; font-size: 14px; font-weight: 500; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.1); opacity: 0; transform: translateY(-20px); transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1); max-width: 90vw; text-align: center; }
        .yiyiai-toast.show { opacity: 1; transform: translateY(0); }
        .yiyiai-toast.success { background: linear-gradient(135deg, #166534, #22c55e); }
        .yiyiai-toast.error { background: linear-gradient(135deg, #991b1b, #ef4444); }
        .yiyiai-toast.info { background: linear-gradient(135deg, #1e3a8a, #3b82f6); }
        .yiyiai-cursor { display: inline-block; width: 8px; height: 1em; background-color: #f1f5f9; vertical-align: text-bottom; animation: yiyiai-blink 1s step-end infinite; }
        @keyframes yiyiai-blink { 50% { opacity: 0; } }

        /* AI Prompt Modal（原有） */
        #yiyiai-ai-prompt-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100002; display: none; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #yiyiai-ai-prompt-modal { background: #0f172a; color: #f1f5f9; padding: 25px; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid rgba(148, 163, 184, 0.3); animation: yiyiai-fadein 0.3s ease; }
        #yiyiai-ai-prompt-modal h4 { margin: 0 0 8px 0; font-size: 18px; color: #60a5fa; }
        #yiyiai-ai-prompt-modal p { margin: 0 0 15px 0; font-size: 14px; color: #94a3b8; }
        #yiyiai-ai-prompt-input { width: 100%; padding: 12px; border: 1px solid rgba(71, 85, 105, 0.7); border-radius: 8px; background-color: rgba(30, 41, 59, 0.5); color: #f1f5f9; font-size: 16px; margin-bottom: 20px; box-sizing: border-box; }
        .yiyiai-ai-prompt-footer { display: flex; justify-content: flex-end; gap: 12px; }
        #yiyiai-ai-prompt-cancel-btn, #yiyiai-ai-prompt-confirm-btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 500; }
        #yiyiai-ai-prompt-cancel-btn { background-color: #4b5563; color: white; }
        #yiyiai-ai-prompt-confirm-btn { background-color: #7c3aed; color: white; }

        /* General Reset（原有） */
        #yiyiai-trigger-btn, #yiyiai-modal a, button, summary { outline: none; -webkit-tap-highlight-color: transparent; }
    `;

    // 2. 辅助函数（原有）
    function loadResource(url) {
        return new Promise((resolve, reject) => {
            if (url.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                link.onload = () => resolve();
                link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
                document.head.appendChild(link);
            } else if (url.endsWith('.js')) {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
                document.head.appendChild(script);
            }
        });
    }

    async function loadDependencies() {
        try {
            const promises = [
                ...VENDOR_RESOURCES.css.map(loadResource),
                ...VENDOR_RESOURCES.js.map(loadResource)
            ];
            await Promise.all(promises);
            console.log('所有依赖库加载完成');
        } catch (error) {
            console.error('加载依赖库失败:', error);
            throw error;
        }
    }

    function formatHTML(html) {
        let indent = 0;
        const tab = '  ';
        let formatted = '';
        html = html.replace(/>\s*</g, '>\n<');
        const lines = html.split('\n');
    
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;
    
            if (trimmedLine.startsWith('</')) {
                indent = Math.max(0, indent - 1);
            }
    
            formatted += tab.repeat(indent) + trimmedLine + '\n';
    
            const isSelfClosing = trimmedLine.endsWith('/>');
            const isClosingTag = trimmedLine.startsWith('</');
            const isDoctypeOrComment = trimmedLine.startsWith('<!');
    
            if (trimmedLine.startsWith('<') && !isSelfClosing && !isClosingTag && !isDoctypeOrComment) {
                indent++;
            }
        });
        return formatted.trim();
    }


    const escapeHTML = (str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    const showToast = (message, type = 'info', duration = 3000) => {
        const toastContainer = document.getElementById('yiyiai-toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `yiyiai-toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    };

    const showFriendlyError = (error, context = '操作') => {
        console.error(`${context}失败:`, error);
        const msg = (error && error.message) ? error.message.toLowerCase() : '';
        let friendlyMessage = `抱歉，${context}时发生未知错误。`;

        if (msg.includes('failed to fetch')) {
            friendlyMessage = '网络连接失败，请检查您的网络并重试。';
        } else if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('504')) {
            friendlyMessage = '服务器暂时遇到问题，请稍后再试。';
        } else if (msg.includes('ai未能返回')) {
            friendlyMessage = 'AI未能按预期返回内容，请尝试调整您的问题后重试。';
        } else if (msg.includes('无法解析')) {
            friendlyMessage = '无法解析返回的内容，可能是格式有误。';
        }
        
        showToast(friendlyMessage, 'error');
    };


    // 3. 核心应用逻辑
    function initializeWidget() {
        document.body.insertAdjacentHTML('beforeend', WIDGET_HTML);
        const styleTag = document.createElement('style');
        styleTag.innerHTML = WIDGET_CSS;
        document.head.appendChild(styleTag);

        const getEl = (id) => document.getElementById(id);
        
        // --- 修改: 新增综合信息面板的DOM元素引用 ---
        const elements = {
            triggerBtn: getEl('yiyiai-trigger-btn'),
            overlay: getEl('yiyiai-overlay'),
            closeBtn: getEl('yiyiai-close-btn'),
            tabs: document.querySelectorAll('.yiyiai-tab'),
            tabContents: document.querySelectorAll('.yiyiai-tab-content'),
            // 综合信息面板（新增）
            overviewPanel: getEl('yiyiai-overview-panel'),
            overviewContent: getEl('yiyiai-overview-content'),
            // 页面元素面板（原有）
            elementsContent: getEl('yiyiai-elements-content'),
            searchInput: getEl('yiyiai-search-input'),
            searchBtn: getEl('yiyiai-search-btn'),
            clearSearchBtn: getEl('yiyiai-clear-search-btn'),
            // 编辑器（原有）
            editorOverlay: getEl('yiyiai-editor-overlay'),
            editorTextarea: getEl('yiyiai-editor-textarea'),
            editorSaveBtn: getEl('yiyiai-editor-save-btn'),
            editorCancelBtn: getEl('yiyiai-editor-cancel-btn'),
            editorCloseBtn: getEl('yiyiai-editor-close-btn'),
            editorProgressContainer: getEl('yiyiai-editor-progress-container'),
            // 聊天面板（原有）
            chatContainer: getEl('yiyiai-chat-container'),
            userInput: getEl('yiyiai-user-input'),
            sendBtn: getEl('yiyiai-send-btn'),
            thinkingPanel: getEl('yiyiai-thinking-panel'),
            reasoningLog: getEl('yiyiai-reasoning-log'),
            thinkingDetails: getEl('yiyiai-thinking-panel').querySelector('details'),
            summaryText: getEl('yiyiai-thinking-panel').querySelector('.yiyiai-summary-text'),
            // AI提示（原有）
            aiPromptOverlay: getEl('yiyiai-ai-prompt-overlay'),
            aiPromptInput: getEl('yiyiai-ai-prompt-input'),
            aiPromptConfirmBtn: getEl('yiyiai-ai-prompt-confirm-btn'),
            aiPromptCancelBtn: getEl('yiyiai-ai-prompt-cancel-btn'),
            aiActionsWrapper: getEl('yiyiai-ai-actions-wrapper'),
            // 编辑器视图（原有）
            editorMainArea: getEl('yiyiai-editor-main-area'),
            previewIframe: getEl('yiyiai-preview-iframe'),
            previewWrapper: getEl('yiyiai-preview-wrapper'),
            viewSplitBtn: getEl('yiyiai-view-split-btn'),
            viewCodeBtn: getEl('yiyiai-view-code-btn'),
            viewPreviewBtn: getEl('yiyiai-view-preview-btn'),
            // SEO面板（原有）
            seoPanel: getEl('yiyiai-seo-panel'),
            seoAnalyzeBtn: getEl('yiyiai-seo-analyze-btn'),
            seoContent: getEl('yiyiai-seo-content'),
        };
        elements.editorAiBtn = getEl('yiyiai-editor-ai-btn'); 

        let isElementsTabPopulated = false;
        let currentEditingElement = null;
        
        let codeBeforeAiEdit = null;
        let lastUserInstruction = '';

        // --- 新增：综合信息相关函数 ---
        /**
         * 收集页面综合信息
         */
        function getPageOverview() {
            // 基础信息
            const title = document.title || '未设置';
            const url = window.location.href;
            const metaDesc = document.querySelector('meta[name="description"]')?.content || '未设置';
            const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '未设置';
            const generator = document.querySelector('meta[name="generator"]')?.content || '未知';

            // 资源统计
            const imageCount = document.images.length;
            const linkCount = document.links.length;
            const scriptCount = document.scripts.length;
            const styleCount = document.styleSheets.length;
            const pageSize = (document.documentElement.outerHTML.length / 1024).toFixed(2) + ' KB';

            // 性能信息
            const performanceData = performance.getEntriesByType('navigation')[0];
            const loadTime = performanceData ? (performanceData.loadEventEnd - performanceData.startTime).toFixed(2) + ' ms' : '无法获取';

            // 响应式信息
            const viewportWidth = window.innerWidth + ' px';
            const isMobile = window.matchMedia('(max-width: 767px)').matches ? '是' : '否';
            const viewportMeta = document.querySelector('meta[name="viewport"]') ? '已设置' : '未设置';

            return {
                基础信息: [
                    { label: '页面标题', value: title },
                    { label: '页面URL', value: url },
                    { label: '元描述', value: metaDesc },
                    { label: '元关键词', value: metaKeywords },
                    { label: '网站生成器', value: generator }
                ],
                资源统计: [
                    { label: '图片数量', value: imageCount },
                    { label: '链接数量', value: linkCount },
                    { label: '脚本数量', value: scriptCount },
                    { label: '样式表数量', value: styleCount },
                    { label: '页面大小', value: pageSize }
                ],
                性能与适配: [
                    { label: '页面加载时间', value: loadTime },
                    { label: '当前视口宽度', value: viewportWidth },
                    { label: '移动端适配', value: isMobile },
                    { label: 'Viewport Meta', value: viewportMeta }
                ]
            };
        }

        /**
         * 渲染综合信息
         */
        function renderOverview() {
            const overviewData = getPageOverview();
            let html = '';

            Object.entries(overviewData).forEach(([category, items]) => {
                html += `<h4 class="yiyiai-overview-category">${category}</h4>`;
                items.forEach(item => {
                    html += `
                        <div class="yiyiai-overview-item">
                            <span class="yiyiai-overview-label">${item.label}:</span>
                            <span class="yiyiai-overview-value">${item.value}</span>
                        </div>
                    `;
                });
            });

            elements.overviewContent.innerHTML = html;
        }

        // --- 原有逻辑保持不变 ---
        const updateAiActionButtons = () => {
            elements.aiActionsWrapper.innerHTML = '';

            const mainAiBtn = document.createElement('button');
            mainAiBtn.id = 'yiyiai-editor-ai-btn';
            mainAiBtn.textContent = '与 AI 沟通修改';
            mainAiBtn.addEventListener('click', openAiPromptDialog);
            elements.aiActionsWrapper.appendChild(mainAiBtn);

            if (codeBeforeAiEdit) {
                const undoBtn = document.createElement('button');
                undoBtn.id = 'yiyiai-editor-undo-btn';
                undoBtn.textContent = '撤销';
                undoBtn.title = '撤销上一次AI修改';
                undoBtn.addEventListener('click', () => {
                    elements.editorTextarea.value = codeBeforeAiEdit;
                    updatePreview();
                    codeBeforeAiEdit = null;
                    lastUserInstruction = '';
                    updateAiActionButtons();
                    showToast('AI的修改已撤销', 'info');
                });
                elements.aiActionsWrapper.appendChild(undoBtn);
            }
            
            if (lastUserInstruction) {
                const regenBtn = document.createElement('button');
                regenBtn.id = 'yiyiai-editor-regen-btn';
                regenBtn.textContent = '换个方案';
                regenBtn.title = '让AI用相同指令再试一次';
                regenBtn.addEventListener('click', () => {
                    executeAiCodeModification(true);
                });
                elements.aiActionsWrapper.appendChild(regenBtn);
            }
            
            elements.editorAiBtn = mainAiBtn;
        };

        const resetAiState = () => {
            codeBeforeAiEdit = null;
            lastUserInstruction = '';
            elements.aiPromptInput.value = '';
            updateAiActionButtons();
        };
        
        const createLine = (data) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'line';
            lineEl.style.setProperty('--indent', data.indent);
            lineEl.yiyiNodeRef = data.node;
            const hasChildren = data.node && Array.from(data.node.children).some(c => !['SCRIPT', 'STYLE', 'LINK'].includes(c.tagName) && !(c.id && c.id.startsWith('yiyiai-')));
            if (hasChildren) lineEl.classList.add('has-children');
            const toggle = `<span class="toggle">${hasChildren ? '►' : ' '}</span>`;
            const tagWrapper = `<span class="tag-wrapper" ${data.node ? 'title="双击编辑"' : ''}>${data.html}</span>`;
            lineEl.innerHTML = toggle + tagWrapper;
            if (data.node) lineEl.classList.add('editable');
            return lineEl;
        };

        const buildAndAppendLevel = (parentLineEl, node, indent) => {
            parentLineEl.dataset.expanded = 'true';
            const toggleEl = parentLineEl.querySelector('.toggle');
            if (toggleEl) toggleEl.innerHTML = '▼';
            const fragment = document.createDocumentFragment();
            Array.from(node.children).forEach(child => {
                if (['SCRIPT', 'STYLE', 'LINK', 'HEAD'].includes(child.tagName) || (child.id && child.id.startsWith('yiyiai-'))) return;
                const attrs = Array.from(child.attributes).map(attr => ` <span class="hljs-attr">${escapeHTML(attr.name)}</span>=<span class="hljs-string">"${escapeHTML(attr.value)}"</span>`).join('');
                const tagName = child.tagName.toLowerCase();
                const openTagHtml = `<span class="hljs-tag">&lt;${tagName}</span>${attrs}<span class="hljs-tag">&gt;</span>`;
                const lineEl = createLine({ node: child, indent, html: openTagHtml });
                fragment.appendChild(lineEl);
            });
            parentLineEl.after(fragment);
        };

        const removeChildren = (parentLineEl) => {
            parentLineEl.dataset.expanded = 'false';
            parentLineEl.querySelector('.toggle').innerHTML = '►';
            let nextSibling = parentLineEl.nextElementSibling;
            const parentIndent = parseInt(parentLineEl.style.getPropertyValue('--indent'));
            while (nextSibling && parseInt(nextSibling.style.getPropertyValue('--indent')) > parentIndent) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }
        };

        const refreshElementsView = () => {
            try {
                const scrollState = { top: elements.elementsContent.scrollTop, left: elements.elementsContent.scrollLeft };
                elements.elementsContent.innerHTML = '';
                const rootNode = document.documentElement;
                if (!rootNode) return;
                const rootLine = createLine({ node: rootNode, indent: 0, html: `<span class="hljs-tag">&lt;html&gt;</span>` });
                elements.elementsContent.appendChild(rootLine);
                buildAndAppendLevel(rootLine, rootNode, 1);
                isElementsTabPopulated = true;
                elements.elementsContent.scrollTop = scrollState.top;
                elements.elementsContent.scrollLeft = scrollState.left;
            } catch (error) {
                showFriendlyError(error, '刷新元素视图');
            }
        };

        elements.triggerBtn.addEventListener('click', () => {
            elements.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            elements.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
        elements.closeBtn.addEventListener('click', closeModal);
        elements.overlay.addEventListener('click', (e) => {
            if (e.target === elements.overlay) closeModal();
        });

        // --- 修改: 选项卡切换时处理综合信息面板 ---
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('active')) return;
                elements.tabs.forEach(t => t.classList.remove('active'));
                elements.tabContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const targetPanel = getEl(`yiyiai-${tab.dataset.tab}-panel`);
                if (targetPanel) targetPanel.classList.add('active');
                
                // 根据不同Tab触发对应逻辑
                switch(tab.dataset.tab) {
                    case 'elements':
                        if (!isElementsTabPopulated) refreshElementsView();
                        break;
                    case 'overview':
                        renderOverview(); // 切换到综合信息时渲染数据
                        break;
                    default:
                        break;
                }
            });
        });

        // --- 以下原有逻辑保持不变 ---
        elements.elementsContent.addEventListener('click', (e) => {
            const toggle = e.target.closest('.toggle');
            if (toggle) {
                const parentLine = toggle.parentElement;
                if (parentLine.dataset.expanded === 'true') {
                    removeChildren(parentLine);
                } else {
                    buildAndAppendLevel(parentLine, parentLine.yiyiNodeRef, parseInt(parentLine.style.getPropertyValue('--indent')) + 1);
                }
            }
        });

        const openEditorForElement = (element, searchText = null) => {
            if (element === document.body) {
                showToast('为了页面稳定，不允许直接编辑 <body> 标签。', 'info');
                return;
            }
            if (!document.contains(element)) {
                showToast('目标元素已不存在。', 'error');
                return;
            }
            currentEditingElement = element;
            elements.editorTextarea.value = formatHTML(element.outerHTML);
            elements.editorOverlay.style.display = 'flex';
            
            resetAiState();

            elements.editorTextarea.focus();
            if (searchText) {
                const textIndex = elements.editorTextarea.value.toLowerCase().indexOf(searchText.toLowerCase());
                if (textIndex !== -1) {
                    setTimeout(() => {
                        elements.editorTextarea.setSelectionRange(textIndex, textIndex + searchText.length);
                    }, 100);
                }
            }
            
            setEditorView('split');
            updatePreview();
        };
        
        const updatePreview = () => {
            if (!elements.previewIframe) return;
        
            const styles = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
                .map(el => el.outerHTML)
                .join('');
        
            const content = elements.editorTextarea.value;
            const iframeContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    ${styles}
                    <style>
                        body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; background-color: #f0f2f5; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
                </html>
            `;
            elements.previewIframe.srcdoc = iframeContent;
        };
        
        elements.editorTextarea.addEventListener('input', updatePreview);

        elements.elementsContent.addEventListener('dblclick', (e) => {
            const lineEl = e.target.closest('.line.editable');
            if (lineEl && lineEl.yiyiNodeRef) {
                openEditorForElement(lineEl.yiyiNodeRef);
            }
        });

        const closeEditor = () => {
            elements.editorOverlay.style.display = 'none';
            currentEditingElement = null;
        };

        elements.editorSaveBtn.addEventListener('click', () => {
            if (!currentEditingElement) return;
            if (!document.body.contains(currentEditingElement)) {
                showFriendlyError(new Error("目标元素已从页面移除，无法保存。"));
                closeEditor();
                refreshElementsView();
                return;
            }
            try {
                const newHTML = elements.editorTextarea.value;
                if (newHTML.trim() === currentEditingElement.outerHTML.trim()) {
                    showToast('内容未改变，已取消。', 'info');
                    closeEditor();
                    return;
                }
        
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHTML.trim();
                
                const newNodes = Array.from(tempDiv.childNodes);
        
                if (newNodes.length > 0) {
                    currentEditingElement.replaceWith(...newNodes);
                    showToast('元素已成功更新！', 'success');
                    setTimeout(refreshElementsView, 150);
                } else {
                    throw new Error("无法解析您输入的HTML，请检查代码。");
                }
            } catch (error) {
                showFriendlyError(error, '保存修改');
            } finally {
                closeEditor();
            }
        });

        elements.editorCancelBtn.addEventListener('click', closeEditor);
        elements.editorCloseBtn.addEventListener('click', closeEditor);

        const executeAiCodeModification = async (isRegeneration = false) => {
            const userInstruction = elements.aiPromptInput.value;
            if (!isRegeneration && (!userInstruction || userInstruction.trim() === '')) {
                showToast('请输入修改指令', 'info');
                return;
            }
        
            if (!isRegeneration) {
                elements.aiPromptOverlay.style.display = 'none';
            }
            
            const codeToModify = isRegeneration ? codeBeforeAiEdit : elements.editorTextarea.value;
            const instructionToUse = isRegeneration ? lastUserInstruction : userInstruction;
            
            if (!isRegeneration) {
                codeBeforeAiEdit = elements.editorTextarea.value; 
            }
            lastUserInstruction = instructionToUse;

            const systemPrompt = `你是一个精通前端开发的专家。你的任务是根据用户的指示修改给定的HTML代码。你必须只返回修改后的、完整的、格式良好的HTML代码块，用\`\`\`html ... \`\`\`包裹，不要包含任何额外的解释、前言或评论。`;
            const userPrompt = `请根据以下指示修改HTML代码：\n\n【用户指示】: ${instructionToUse}\n\n---\n【原始HTML代码】:\n\`\`\`html\n${codeToModify}\n\`\`\``;
        
            elements.editorAiBtn.disabled = true;
            elements.editorSaveBtn.disabled = true;
            elements.editorTextarea.disabled = true;
            elements.editorAiBtn.textContent = 'AI 正在修改...';
            elements.editorProgressContainer.style.display = 'block';
            elements.editorTextarea.value = 'AI 正在分析您的需求，请稍候...';
            elements.editorTextarea.style.color = '#94a3b8';
        
            try {
                const response = await fetch('/YiYiAi-manage.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [ { role: "system", content: systemPrompt }, { role: "user", content: userPrompt } ],
                        stream: true
                    })
                });
        
                if (!response.ok) throw new Error(`服务器错误，状态码: ${response.status}`);
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullContent = '';
                let isFirstReasoningChunk = true;
                let hasSwitchedToCode = false;
        
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
        
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n\n');
        
                    for (const line of lines) {
                        if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
                        const jsonStr = line.substring(6);
                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.error) throw new Error(data.error);
                            const delta = data.choices[0].delta;
        
                            if (delta.reasoning_content && !hasSwitchedToCode) {
                                if (isFirstReasoningChunk) {
                                    elements.editorTextarea.value = '';
                                    isFirstReasoningChunk = false;
                                }
                                elements.editorTextarea.value += delta.reasoning_content;
                            }
        
                            if (delta.content) {
                                if (!hasSwitchedToCode) {
                                    elements.editorTextarea.value = '';
                                    elements.editorTextarea.style.color = '';
                                    hasSwitchedToCode = true;
                                }
                                fullContent += delta.content;
                                elements.editorTextarea.value += delta.content;
                            }
                        } catch (e) { /* Silently ignore */ }
                    }
                }
                
                if (!fullContent) throw new Error('AI未能返回有效代码内容。');

                let cleanHtml = fullContent.trim();
                const htmlMatch = cleanHtml.match(/```html\n([\s\S]*?)\n```/);
                if (htmlMatch && htmlMatch[1]) {
                    cleanHtml = htmlMatch[1];
                } else {
                    const firstTag = cleanHtml.indexOf('<');
                    if (firstTag > 0) {
                       cleanHtml = cleanHtml.substring(firstTag);
                    }
                }
        
                elements.editorTextarea.value = formatHTML(cleanHtml);
                updatePreview();
                showToast('AI 修改建议已应用！', 'success');
        
            } catch (error) {
                showFriendlyError(error, 'AI代码修改');
                elements.editorTextarea.value = codeBeforeAiEdit;
                updatePreview();
            } finally {
                elements.editorProgressContainer.style.display = 'none';
                elements.editorTextarea.style.color = '';
                elements.editorAiBtn.disabled = false;
                elements.editorSaveBtn.disabled = false;
                elements.editorTextarea.disabled = false;
                updateAiActionButtons();
            }
        };

        const openAiPromptDialog = () => {
            elements.aiPromptOverlay.style.display = 'flex';
            setTimeout(() => elements.aiPromptInput.focus(), 50);
        };
        
        elements.editorAiBtn.addEventListener('click', openAiPromptDialog);

        elements.aiPromptCancelBtn.addEventListener('click', () => {
            elements.aiPromptOverlay.style.display = 'none';
        });

        elements.aiPromptConfirmBtn.addEventListener('click', () => executeAiCodeModification(false));
        
        elements.aiPromptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeAiCodeModification(false);
            }
        });
        
        const findFirstElementWithText = (query) => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeValue.toLowerCase().includes(query.toLowerCase())) {
                    const parent = node.parentElement;
                    if (parent && !['SCRIPT', 'STYLE'].includes(parent.tagName) && !parent.closest('[id^="yiyiai-"]')) {
                        return parent;
                    }
                }
            }
            return null;
        };

        const revealElementInTree = async (element) => {
            const ancestors = [];
            let current = element;
            while (current && current !== document.documentElement) {
                ancestors.unshift(current);
                current = current.parentElement;
            }
            ancestors.unshift(document.documentElement);
            refreshElementsView();
            let parentLine = null;
            for (const ancestorNode of ancestors) {
                const lineEl = Array.from(elements.elementsContent.querySelectorAll('.line')).find(line => line.yiyiNodeRef === ancestorNode);
                if (!lineEl) {
                    console.warn('在树中未找到祖先节点:', ancestorNode);
                    return null;
                }
                if (lineEl.dataset.expanded !== 'true' && lineEl.classList.contains('has-children')) {
                    buildAndAppendLevel(lineEl, ancestorNode, parseInt(lineEl.style.getPropertyValue('--indent')) + 1);
                    await new Promise(r => setTimeout(r, 10));
                }
                parentLine = lineEl;
            }
            return parentLine;
        };
        
        const performSearch = async () => {
            const query = elements.searchInput.value.trim();
            if (!query) return;
            let targetElement = null;
            if (query.startsWith('#') || query.startsWith('.')) {
                try {
                    targetElement = document.querySelector(query);
                    if (!targetElement) {
                        showToast(`未找到匹配选择器 "${query}" 的元素。`, 'info');
                        return;
                    }
                    if (targetElement.closest('[id^="yiyiai-"]')) {
                        showToast('不允许选择AI助手自身的元素。', 'info');
                        return;
                    }
                } catch (e) {
                    showFriendlyError(e, '元素搜索');
                    return;
                }
                
                showToast(`正在定位 ${query}...`, 'info', 1500);
                const targetLine = await revealElementInTree(targetElement);
                if (targetLine) {
                    targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetLine.classList.add('highlight');
                    setTimeout(() => targetLine.classList.remove('highlight'), 2000);
                    openEditorForElement(targetElement); 
                }
            } else {
                targetElement = findFirstElementWithText(query);
                if (targetElement) {
                    showToast('正在定位元素...', 'info', 1500);
                    const targetLine = await revealElementInTree(targetElement);
                    if (targetLine) {
                        targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetLine.classList.add('highlight');
                        setTimeout(() => targetLine.classList.remove('highlight'), 2000);
                        openEditorForElement(targetElement, query);
                    }
                } else {
                    showToast('未在页面内容中找到该文字。', 'info');
                }
            }
        };
        
        elements.searchBtn.addEventListener('click', performSearch);
        elements.clearSearchBtn.addEventListener('click', () => {
            elements.searchInput.value = '';
        });
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        let conversationHistory = [];
        const addMessage = (sender, text) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `yiyiai-message ${sender === 'user' ? 'yiyiai-user-msg' : 'yiyiai-bot-msg'}`;
            msgDiv.innerHTML = `<div class="yiyiai-avatar"></div><div class="yiyiai-content">${text}</div>`;
            elements.chatContainer.appendChild(msgDiv);
            elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
            return msgDiv.querySelector('.yiyiai-content');
        };

        const addCopyButtons = (element) => {
            element.querySelectorAll('pre').forEach(block => {
                if (block.querySelector('.yiyiai-copy-btn')) return;
                const copyBtn = document.createElement('button');
                copyBtn.className = 'yiyiai-copy-btn';
                copyBtn.textContent = '复制';
                block.appendChild(copyBtn);
                copyBtn.addEventListener('click', () => {
                    const code = block.querySelector('code').innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        copyBtn.textContent = '已复制!';
                        setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
                    }).catch(() => showToast('复制失败', 'error'));
                });
            });
        };

        async function handleSendMessage() {
            const userText = elements.userInput.value.trim();
            if (!userText) return;
            addMessage('user', DOMPurify.sanitize(userText));
            conversationHistory.push({ role: "user", content: userText });
            elements.userInput.value = '';
            elements.sendBtn.disabled = true;
            elements.sendBtn.textContent = '思考中';
            elements.thinkingPanel.style.display = 'block';
            elements.reasoningLog.textContent = '';
            elements.reasoningLog.style.display = 'none';
            elements.summaryText.textContent = 'AI 深度思考中...';
            elements.thinkingDetails.querySelector('.yiyiai-progress-bar').style.display = 'block';
            elements.thinkingDetails.open = true;
            let thinkingOccurred = false;
            const botMessageElement = addMessage('bot', '<span class="yiyiai-cursor">|</span>');
            let botReply = '';
            try {
                const response = await fetch('/YiYiAi-manage.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        persona: customPersona,
                        context_url: contextUrl,
                        stream: true
                    })
                });
                if (!response.ok) throw new Error(`服务器错误，状态码: ${response.status}`);
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n\n');
                    for (const line of lines) {
                        if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
                        const jsonStr = line.substring(6);
                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.error) throw new Error(data.error);
                            const delta = data.choices[0].delta;
                            if (delta.reasoning_content) {
                                if (!thinkingOccurred) {
                                    elements.reasoningLog.style.display = 'block';
                                    thinkingOccurred = true;
                                }
                                elements.reasoningLog.textContent += delta.reasoning_content;
                                elements.reasoningLog.scrollTop = elements.reasoningLog.scrollHeight;
                            }
                            if (delta.content) {
                                botReply += delta.content;
                                const dirtyHtml = marked.parse(botReply + '<span class="yiyiai-cursor">|</span>');
                                botMessageElement.innerHTML = DOMPurify.sanitize(dirtyHtml);
                                elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
                            }
                        } catch (e) { /* Silently ignore */ }
                    }
                }
                conversationHistory.push({ role: "assistant", content: botReply });
                botMessageElement.querySelector('.yiyiai-cursor')?.remove();
                botMessageElement.querySelectorAll('pre code').forEach(block => {
                    if (window.hljs) hljs.highlightElement(block);
                });
                addCopyButtons(botMessageElement);
                if (thinkingOccurred) {
                    elements.summaryText.textContent = '查看AI深度思考过程';
                    elements.thinkingDetails.querySelector('.yiyiai-progress-bar').style.display = 'none';
                } else {
                    elements.thinkingPanel.style.display = 'none';
                }
            } catch (error) {
                showFriendlyError(error, 'AI聊天');
                botMessageElement.innerHTML = `<span style="color: #f87171;">抱歉，当前无法回复，请稍后重试。</span>`;
                elements.thinkingPanel.style.display = 'none';
            } finally {
                elements.sendBtn.disabled = false;
                elements.sendBtn.textContent = '发送';
                
                // ✨ 新增代码：如果思考过程被触发过，则在完成后自动折叠
                if (thinkingOccurred) {
                    elements.thinkingDetails.open = false;
                }
            }
        }

        elements.sendBtn.addEventListener('click', handleSendMessage);
        elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !elements.sendBtn.disabled) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        const setEditorView = (mode) => {
            const isCodeVisible = mode === 'code' || mode === 'split';
            const isPreviewVisible = mode === 'preview' || mode === 'split';

            elements.editorTextarea.style.display = isCodeVisible ? 'block' : 'none';
            elements.previewWrapper.style.display = isPreviewVisible ? 'block' : 'none';
            
            elements.editorTextarea.style.flexBasis = mode === 'code' ? '100%' : (mode === 'split' ? '50%' : '0');
            elements.previewWrapper.style.flexBasis = mode === 'preview' ? '100%' : (mode === 'split' ? '50%' : '0');

            elements.viewSplitBtn.classList.toggle('active', mode === 'split');
            elements.viewCodeBtn.classList.toggle('active', mode === 'code');
            elements.viewPreviewBtn.classList.toggle('active', mode === 'preview');
        };

        elements.viewSplitBtn.addEventListener('click', () => setEditorView('split'));
        elements.viewCodeBtn.addEventListener('click', () => setEditorView('code'));
        elements.viewPreviewBtn.addEventListener('click', () => setEditorView('preview'));

        // --- SEO分析功能（原有） ---
        async function generateSeoReport() {
            elements.seoAnalyzeBtn.disabled = true;
            elements.seoAnalyzeBtn.textContent = '分析中...';
            elements.seoContent.innerHTML = `
                <div class="yiyiai-seo-loading">
                    <div class="yiyiai-spinner"></div>
                    AI 正在对您的网站进行全面扫描和深度分析，请稍候...
                </div>
            `;

            const pageHtml = document.documentElement.outerHTML;
            const pageUrl = window.location.href;

            const systemPrompt = `你是一名资深的SEO优化专家和网站架构师。你的任务是基于用户提供的网站URL和完整HTML代码，生成一份详细、专业且易于理解的优化报告。报告必须使用Markdown格式，并且严格按照以下三个部分进行组织，使用h2标题 (##) 分隔：

1.  **网站 head 优化建议**: 详细分析 \`<head>\` 标签内的内容。检查并提出针对 \`<title>\`, \`<meta name="description">\`, \`<meta name="keywords">\` (并说明其当前的重要性), Open Graph 标签 (\`og:title\`, \`og:description\`, \`og:image\`等), Canonical URL, 以及其他相关meta标签的优化建议。对于缺失或不佳的标签，请提供推荐的、优化后的代码示例。

2.  **网站整体方向以及综合优化建议**: 从更宏观的角度分析网站。内容应包括但不限于：
    * **内容策略**: 网站主题是否明确？内容质量如何？建议哪些内容方向？
    * **用户体验 (UX)**: 网站结构是否清晰？导航是否便捷？移动端适配性如何？
    * **性能优化**: 页面加载速度的关键点（指出即可，无需详细代码），如图片优化、资源压缩等。
    * **内部链接**: 内部链接结构是否合理？有何改进建议？
    * **关键词布局**: 页面关键词分布情况，是否存在关键词堆砌或不足。

3.  **SEO 优惠建议和方案**: 根据网站的当前状况，以服务提供商的口吻，提供清晰的、分阶段的SEO优化服务建议方案。方案应分为几个等级（例如：基础版、进阶版、尊享版），每个方案包含：
    * **方案名称**
    * **核心服务内容** (例如：基础版包含关键词研究和TDK优化；进阶版增加内容创建和外链建设等)
    * **预期效果**
    * **象征性的价格或优惠说明** (例如：限时优惠价 ¥XXX 或 联系我们获取专属报价)

请确保你的回答内容丰富、建议具体、可操作性强。`;

            const userPrompt = `网站URL: ${pageUrl}\n\n以下是网站的完整HTML代码，请根据此内容生成SEO优化报告：\n\n\`\`\`html\n${pageHtml}\n\`\`\``;
            
            let reportContent = '';
            try {
                const response = await fetch('/YiYiAi-manage.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        stream: true
                    })
                });

                if (!response.ok) {
                    throw new Error(`服务器错误, 状态码: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                            const jsonStr = line.substring(6);
                            try {
                                const data = JSON.parse(jsonStr);
                                if (data.choices && data.choices[0].delta.content) {
                                    reportContent += data.choices[0].delta.content;
                                    const dirtyHtml = marked.parse(reportContent + '<span class="yiyiai-cursor">|</span>');
                                    elements.seoContent.innerHTML = `<div class="yiyiai-content">${DOMPurify.sanitize(dirtyHtml)}</div>`;
                                    elements.seoContent.scrollTop = elements.seoContent.scrollHeight;
                                }
                            } catch (e) { /* 忽略JSON解析错误 */ }
                        }
                    }
                }
                
                const finalHtml = marked.parse(reportContent);
                elements.seoContent.innerHTML = `<div class="yiyiai-content">${DOMPurify.sanitize(finalHtml)}</div>`;
                
                elements.seoContent.querySelectorAll('pre code').forEach(block => {
                    if (window.hljs) hljs.highlightElement(block);
                });
                addCopyButtons(elements.seoContent);


            } catch (error) {
                showFriendlyError(error, '生成SEO报告');
                elements.seoContent.innerHTML = `<div class="yiyiai-content" style="color: #f87171;">抱歉，生成SEO报告时遇到问题，请稍后重试。</div>`;
            } finally {
                elements.seoAnalyzeBtn.disabled = false;
                elements.seoAnalyzeBtn.textContent = '重新分析';
            }
        }

        elements.seoAnalyzeBtn.addEventListener('click', generateSeoReport);
    }

    async function main() {
        try {
            console.log('开始加载AI助手...');
            await loadDependencies();
            initializeWidget();
            console.log('AI助手加载成功！');
        } catch (error) {
            console.error("加载AI助手部件失败:", error);
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `position: fixed; bottom: 20px; right: 20px; padding: 12px 20px; background: #dc2626; color: white; border-radius: 8px; z-index: 100002; font-family: sans-serif; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);`;
            let detailMessage = '初始化错误';
            if (error && error.message && typeof error.message.includes === 'function' && error.message.includes('load')) {
                detailMessage = '网络缓慢或资源加载失败';
            }
            errorDiv.innerText = 'AI助手加载失败: ' + detailMessage;
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
