# AI简历优化助手 V1.0 - 基于JadeAI融合版

## 项目简介

这是基于 [JadeAI](https://github.com/LingyiChen-AI/JadeAI) 真实代码融合的 AI 简历优化助手，新增了求职全流程跟踪、行业垂直化、协作评论三大模块。

## 功能特性

### ✅ 基础功能（来自JadeAI）
- **50+ 专业模板** - 涵盖IT/金融/设计/医疗/学术等各行业
- **拖拽编辑器** - @dnd-kit 实现，点击即改，实时预览
- **撤销/重做** - 50步完整实现
- **AI 功能** - 简历生成/优化/JD匹配/语法检查/翻译/求职信（支持OpenAI/Claude/DeepSeek/Gemini）
- **模拟面试** - 6种面试官，AI智能追问，5维度评估报告
- **导出** - PDF/DOCX/HTML/TXT，Puppeteer高质量渲染
- **分享** - 链接分享，密码保护
- **认证** - NextAuth（Google OAuth + 指纹登录）
- **多语言** - 中文/英文
- **暗色模式**

### 🆕 融合新增功能
- **求职全流程跟踪** - Kanban看板，7个状态，面试提醒，Offer管理，薪资对比
- **行业垂直化** - 8大行业（IT/金融/设计/医疗/教育/营销/销售/通用），行业关键词库，行业优化建议
- **协作评论** - 简历分享评论，修改建议（原文/建议/理由），权限管理

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env，填写必要的配置
```

必需配置：
- `OPENAI_API_KEY` - OpenAI API密钥（可选，不填则使用演示模式）
- `NEXTAUTH_SECRET` - NextAuth密钥（必填，可用 `openssl rand -base64 32` 生成）

### 3. 初始化数据库
```bash
npm run dev
# 启动后自动创建SQLite数据库并seed演示数据
```

### 4. 启动开发服务器
```bash
npm run dev
# 访问 http://localhost:3000
```

演示账号：
- 邮箱：demo@jadeai.com
- 密码：无需密码，指纹登录

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 |
| UI组件 | Radix UI + shadcn/ui |
| 状态管理 | Zustand (6个Store) |
| 数据库ORM | Drizzle ORM |
| 数据库 | SQLite (本地) / PostgreSQL (生产) |
| 认证 | NextAuth.js 5 |
| AI | Vercel AI SDK + OpenAI/Claude/DeepSeek/Gemini |
| PDF导出 | Puppeteer |
| 拖拽 | @dnd-kit |
| 国际化 | next-intl |
| 部署 | Docker / Vercel |

## 项目结构

```
ai-resume-fusion/
├── src/
│   ├── app/                    # Next.js 路由
│   │   ├── [locale]/           # 国际化路由
│   │   │   ├── dashboard/      # 仪表盘
│   │   │   ├── editor/[id]/    # 简历编辑器
│   │   │   ├── templates/      # 模板选择
│   │   │   ├── interview/      # 模拟面试
│   │   │   ├── tracker/        # 求职跟踪 (新增)
│   │   │   ├── industries/     # 行业垂直化 (新增)
│   │   │   └── collaboration/  # 协作评论 (新增)
│   │   └── api/                # API路由
│   ├── components/             # React组件
│   │   ├── editor/             # 编辑器组件
│   │   ├── preview/templates/  # 50个模板渲染
│   │   └── ui/                 # 基础UI组件
│   ├── stores/                 # Zustand状态管理
│   ├── lib/                    # 工具库
│   │   ├── db/                 # 数据库
│   │   ├── ai/                 # AI功能
│   │   └── auth/               # 认证
│   ├── hooks/                  # 自定义Hooks
│   └── types/                  # TypeScript类型
├── messages/                   # i18n翻译
├── drizzle/                    # 数据库迁移
└── public/                     # 静态资源
```

## API 路由

### 简历相关
- `GET/POST /api/resume` - 简历列表
- `GET/PUT/DELETE /api/resume/[id]` - 单份简历
- `POST /api/resume/[id]/export` - 导出
- `POST /api/resume/[id]/share` - 分享
- `POST /api/resume/parse` - 解析上传的简历

### AI 功能
- `POST /api/ai/generate-resume` - AI生成简历
- `POST /api/ai/jd-analysis` - JD匹配分析
- `POST /api/ai/grammar-check` - 语法检查
- `POST /api/ai/translate` - 翻译
- `POST /api/ai/cover-letter` - 求职信生成
- `GET /api/ai/models` - 可用模型列表

### 模拟面试
- `POST /api/interview` - 创建面试
- `POST /api/interview/[id]/chat` - 发送消息
- `POST /api/interview/[id]/control` - 控制面试
- `GET /api/interview/[id]/report` - 获取报告

### 求职跟踪 (新增)
- `GET/POST /api/tracker/applications` - 投递记录
- `PUT/DELETE /api/tracker/applications/[id]`
- `GET /api/tracker/stats` - 统计数据
- `GET/POST /api/tracker/offers` - Offer管理

### 协作评论 (新增)
- `GET/POST /api/comments` - 评论列表/创建

### 行业数据 (新增)
- `GET /api/industries` - 行业列表

## 环境变量

```env
# 必填
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# 可选 - AI功能
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1

# 可选 - 认证
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# 可选 - 数据库（默认SQLite）
DATABASE_URL=postgresql://...

# 可选 - 文件上传
BLOB_READ_WRITE_TOKEN=...
```

## 部署

### Docker 部署
```bash
docker build -t ai-resume-assistant .
docker run -p 3000:3000 ai-resume-assistant
```

### Vercel 部署
```bash
# 连接GitHub仓库到Vercel，自动部署
```

### 传统部署
```bash
npm run build
npm start
```

## 许可证

Apache License 2.0

## 致谢

- [JadeAI](https://github.com/LingyiChen-AI/JadeAI) - 基础代码
- [Reactive Resume](https://github.com/AmruthPillai/Reactive-Resume) - 设计参考
- [shadcn/ui](https://ui.shadcn.com) - UI组件
- [next-intl](https://next-intl-docs.vercel.app) - 国际化

## 联系方式

- 作者：你的名字
- GitHub：https://github.com/你的用户名/ai-resume-assistant
- 问题反馈：https://github.com/你的用户名/ai-resume-assistant/issues
