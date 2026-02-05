# Langfuse 国际化 (i18n) 中文支持实施计划

为 Langfuse 添加完整的国际化支持，支持中英文切换，英文默认，手动切换语言。

## 工作量评估

> **重要提示**：这是一个涉及大量文件修改的重大改动。完整的国际化需要：
> - 修改约 50+ 个组件文件
> - 创建包含 500+ 键值对的翻译文件
> - 建议采用**渐进式方法**：先完成核心导航和布局，后续逐步扩展

> **阶段性实施**：本计划采用渐进式实施。先实现基础设施和核心组件国际化，确保运行正常后再扩展到其他页面。

---

## 实施计划

### Phase 1: 基础设施搭建

#### [NEW] i18n.ts
国际化配置文件，定义支持的语言和默认语言：
```typescript
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
```

#### [NEW] en.json
英文翻译文件，包含所有 UI 文本：
```json
{
  "navigation": {
    "goTo": "Go to...",
    "organizations": "Organizations",
    "projects": "Projects",
    "home": "Home",
    "dashboards": "Dashboards",
    "tracing": "Tracing",
    "sessions": "Sessions",
    "users": "Users",
    "prompts": "Prompts",
    "playground": "Playground",
    "scores": "Scores",
    "llmAsAJudge": "LLM-as-a-Judge",
    "humanAnnotation": "Human Annotation",
    "datasets": "Datasets",
    "upgrade": "Upgrade",
    "cloudStatus": "Cloud Status",
    "settings": "Settings",
    "bookACall": "Book a call",
    "support": "Support"
  },
  "groups": {
    "observability": "Observability",
    "promptManagement": "Prompt Management",
    "evaluation": "Evaluation"
  },
  "common": {
    "loading": "Loading",
    "error": "Error",
    "signOut": "Sign out",
    "signIn": "Sign in"
  },
  "errors": {
    "projectNotFound": "Project Not Found",
    "projectAccessDenied": "The project you are trying to access does not exist or you do not have access to it.",
    "goToHome": "Go to Home"
  }
}
```

#### [NEW] zh.json
中文翻译文件：
```json
{
  "navigation": {
    "goTo": "跳转到...",
    "organizations": "组织",
    "projects": "项目",
    "home": "首页",
    "dashboards": "仪表盘",
    "tracing": "追踪",
    "sessions": "会话",
    "users": "用户",
    "prompts": "提示词",
    "playground": "体验场",
    "scores": "评分",
    "llmAsAJudge": "LLM 评估器",
    "humanAnnotation": "人工标注",
    "datasets": "数据集",
    "upgrade": "升级",
    "cloudStatus": "云端状态",
    "settings": "设置",
    "bookACall": "预约通话",
    "support": "支持"
  },
  "groups": {
    "observability": "可观测性",
    "promptManagement": "提示词管理",
    "evaluation": "评估"
  },
  "common": {
    "loading": "加载中",
    "error": "错误",
    "signOut": "退出登录",
    "signIn": "登录"
  },
  "errors": {
    "projectNotFound": "项目未找到",
    "projectAccessDenied": "您尝试访问的项目不存在或您没有访问权限。",
    "goToHome": "返回首页"
  }
}
```

#### [NEW] I18nProvider.tsx
国际化 Provider 组件，使用 React Context 管理语言状态。

#### [NEW] LanguageSwitcher.tsx
语言切换组件，添加到设置区域。

#### [MODIFY] _app.tsx
在 Provider 层级中添加 `I18nProvider`：
```diff
+import { I18nProvider } from "@/src/features/i18n";
 
 // 在 Provider 层级中包裹
 <I18nProvider>
   <QueryParamProvider adapter={NextAdapterPages}>
     ...
   </QueryParamProvider>
 </I18nProvider>
```

---

### Phase 2: 核心组件国际化

#### [NEW] useTranslatedRoutes.ts
创建 Hook 将导航路由标题翻译为当前语言。

#### [MODIFY] useFilteredNavigation.ts
使用翻译后的路由替代静态 ROUTES。

#### [MODIFY] app-layout/index.tsx
使用翻译替换硬编码文本：
```diff
+import { useTranslation } from "@/src/features/i18n";

-title="Project Not Found"
-message="The project you are trying to access..."
+title={t("errors.projectNotFound")}
+message={t("errors.projectAccessDenied")}
```

---

### Phase 3: 语言切换 UI

#### [NEW] AppearanceSettings.tsx
外观设置组件，包含语言切换功能。

#### [MODIFY] settings/index.tsx
添加 Appearance 设置页面到项目设置中。

---

## 验证计划

### 手动验证

1. **启动开发服务器**
   ```bash
   cd web
   pnpm run dev
   ```

2. **验证默认语言**
   - 访问 `http://localhost:3000`
   - 确认所有导航项显示为英文

3. **验证语言切换**
   - 导航到 Settings → Appearance
   - 选择中文
   - 确认导航项立即切换为中文
   - 刷新页面，确认语言选择已持久化

4. **验证所有翻译键**
   - 检查控制台是否有 "Missing translation" 警告
   - 遍历主要页面确认无缺失翻译

### 自动化测试 (后续添加)

可以后续添加单元测试验证翻译系统：
- 测试翻译函数对缺失键的处理
- 测试语言切换 hook 的状态管理
- 测试 localStorage 持久化

---

## 实施优先级

| 优先级 | 模块 | 说明 |
|--------|------|------|
| P0 | 基础设施 | i18n Provider, 翻译文件结构 |
| P0 | 语言切换器 | 用户可手动切换语言 |
| P1 | 导航菜单 | 侧边栏所有导航项 |
| P1 | 错误页面 | 404、权限错误等 |
| P2 | 设置页面 | 项目/组织设置 |
| P3 | 其他页面 | 逐步扩展 |
