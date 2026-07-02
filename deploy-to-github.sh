#!/bin/bash

# AI简历优化助手 - GitHub部署脚本

echo "========================================="
echo "  AI简历优化助手 V1.0 - GitHub部署"
echo "========================================="
echo ""

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 ai-resume-fusion 目录下运行此脚本"
    exit 1
fi

echo "✅ 在 ai-resume-fusion 目录中"
echo ""

# 清理不需要的文件
echo "🧹 清理不需要的文件..."
rm -f npm-install-output.txt
rm -rf test/ 2>/dev/null
echo "✅ 清理完成"
echo ""

# 初始化Git
echo "📦 初始化 Git..."
git init
git branch -M main
echo "✅ Git 初始化完成"
echo ""

# 添加文件
echo "📁 添加文件到 Git..."
git add .
echo "✅ 文件添加完成"
echo ""

# 显示将要提交的文件数
FILE_COUNT=$(git status --porcelain | wc -l)
echo "📊 准备提交 $FILE_COUNT 个文件"
echo ""

# 提交
echo "💾 提交代码..."
git commit -m "feat: AI简历优化助手 V1.0 - 基于JadeAI融合版

功能特性：
- 50+ 专业模板 (IT/金融/设计/医疗/学术等)
- 拖拽编辑器 (点击即改，实时预览)
- 撤销/重做 (50步)
- AI功能 (生成/优化/JD匹配/语法检查/翻译/求职信)
- 模拟面试 (6种面试官，评估报告)
- PDF/DOCX/HTML/TXT 导出
- 分享链接 (密码保护)
- 求职全流程跟踪 (Kanban/Offer管理)
- 行业垂直化 (8大行业)
- 协作评论

技术栈：Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + Drizzle ORM + Zustand"
echo "✅ 提交完成"
echo ""

# 提示用户输入GitHub仓库
echo "========================================="
echo "  请在 GitHub 上创建新仓库"
echo "========================================="
echo ""
echo "步骤："
echo "1. 访问 https://github.com/new"
echo "2. 仓库名：ai-resume-assistant"
echo "3. 描述：AI简历优化助手 - 基于JadeAI融合版"
echo "4. 选择 Public 或 Private"
echo "5. 不要勾选 'Initialize with README'"
echo "6. 点击 'Create repository'"
echo ""
read -p "请输入 GitHub 仓库 URL (例如: https://github.com/你的用户名/ai-resume-assistant.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 错误：未输入仓库 URL"
    exit 1
fi

# 添加远程仓库
echo ""
echo "🔗 连接远程仓库..."
git remote add origin "$REPO_URL"
echo "✅ 远程仓库连接完成"
echo ""

# 推送
echo "🚀 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "  ✅ 部署成功！"
    echo "========================================="
    echo ""
    echo "你的仓库地址："
    echo "$REPO_URL"
    echo ""
    echo "下一步："
    echo "1. 访问仓库，确认所有文件已上传"
    echo "2. 编辑 README.md，补充你的信息"
    echo "3. 配置 GitHub Pages 或 Vercel 部署"
    echo "4. 邀请协作者（如需要）"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. GitHub 仓库是否已创建"
    echo "2. 仓库 URL 是否正确"
    echo "3. 是否已配置 Git 用户信息："
    echo "   git config --global user.name '你的名字'"
    echo "   git config --global user.email '你的邮箱'"
fi
