#!/bin/bash
# ============================================
# AI简历优化助手 - 智能增量上传脚本
# 自动检测已上传文件，只上传缺失的部分
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  AI简历优化助手 - 智能增量上传${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 切换到脚本所在目录
cd "$(dirname "$0")"

echo -e "${YELLOW}📍 当前目录: $(pwd)${NC}"
echo ""

# 步骤1：检查Git状态
echo -e "${BLUE}🔍 步骤1: 检查Git状态...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误：当前目录不是Git仓库！${NC}"
    exit 1
fi

# 步骤2：获取远程文件列表
echo -e "${BLUE}📥 步骤2: 获取远程文件列表...${NC}"
git fetch origin main 2>/dev/null || {
    echo -e "${RED}❌ 无法连接远程仓库，请检查网络${NC}"
    exit 1
}

REMOTE_FILES=$(git ls-tree -r --name-only origin/main)
LOCAL_FILES=$(git ls-tree -r --name-only HEAD)

REMOTE_COUNT=$(echo "$REMOTE_FILES" | wc -l)
LOCAL_COUNT=$(echo "$LOCAL_FILES" | wc -l)

echo -e "${GREEN}✅ 远程文件: $REMOTE_COUNT 个${NC}"
echo -e "${GREEN}✅ 本地文件: $LOCAL_COUNT 个${NC}"
echo ""

# 步骤3：计算需要上传的文件
echo -e "${BLUE}📊 步骤3: 对比文件差异...${NC}"

# 创建临时文件
REMOTE_TMP=$(mktemp)
LOCAL_TMP=$(mktemp)
MISSING_TMP=$(mktemp)

echo "$REMOTE_FILES" > "$REMOTE_TMP"
echo "$LOCAL_FILES" > "$LOCAL_TMP"

# 找出本地有但远程没有的文件
comm -23 <(sort "$LOCAL_TMP") <(sort "$REMOTE_TMP") > "$MISSING_TMP"

MISSING_COUNT=$(wc -l < "$MISSING_TMP")

echo -e "${YELLOW}📦 需要上传的文件: $MISSING_COUNT 个${NC}"
echo ""

if [ "$MISSING_COUNT" -eq 0 ]; then
    echo -e "${GREEN}🎉 所有文件都已上传！${NC}"
    rm -f "$REMOTE_TMP" "$LOCAL_TMP" "$MISSING_TMP"
    exit 0
fi

# 显示前20个需要上传的文件
echo -e "${YELLOW}📄 前20个需要上传的文件：${NC}"
head -20 "$MISSING_TMP" | sed 's/^/   - /'
echo "   ..."
echo ""

# 步骤4：询问确认
echo -e "${YELLOW}❓ 确认要上传这 $MISSING_COUNT 个文件吗？(y/n)${NC}"
read -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 取消上传${NC}"
    rm -f "$REMOTE_TMP" "$LOCAL_TMP" "$MISSING_TMP"
    exit 0
fi

# 步骤5：暂存缺失的文件
echo -e "${BLUE}📦 步骤5: 添加文件到Git...${NC}"
# 读取缺失文件列表，逐个添加
while IFS= read -r file; do
    if [ -f "$file" ]; then
        git add "$file" 2>/dev/null || echo -e "${YELLOW}⚠️ 跳过: $file${NC}"
    fi
done < "$MISSING_TMP"

ADDED_COUNT=$(git diff --cached --name-only | wc -l)
echo -e "${GREEN}✅ 已暂存 $ADDED_COUNT 个文件${NC}"
echo ""

# 步骤6：提交
echo -e "${BLUE}💾 步骤6: 创建提交...${NC}"
COMMIT_MSG="feat: 增量上传 $ADDED_COUNT 个文件 - 完整版AI简历优化助手"

git commit -m "$COMMIT_MSG" || {
    echo -e "${YELLOW}⚠️ 没有需要提交的更改${NC}"
    rm -f "$REMOTE_TMP" "$LOCAL_TMP" "$MISSING_TMP"
    exit 0
}

echo -e "${GREEN}✅ 提交成功${NC}"
echo ""

# 步骤7：推送到GitHub
echo -e "${BLUE}🚀 步骤7: 推送到GitHub...${NC}"
echo -e "${YELLOW}   如果提示需要登录：${NC}"
echo -e "${YELLOW}   - 选择浏览器登录（推荐）${NC}"
echo -e "${YELLOW}   - 在浏览器中授权${NC}"
echo ""

# 尝试推送
if git push origin main; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}  ✅ 上传成功！${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo -e "🎉 已成功上传 $ADDED_COUNT 个文件到GitHub！"
    echo ""
    echo -e "📦 仓库地址: ${BLUE}https://github.com/daidai696/AI-Resume-Helper${NC}"
else
    echo ""
    echo -e "${RED}❌ 推送失败！${NC}"
    echo ""
    echo -e "${YELLOW}可能的原因和解决方案：${NC}"
    echo ""
    echo -e "${YELLOW}方法1: 使用GitHub Personal Access Token${NC}"
    echo "  1. 访问: https://github.com/settings/tokens"
    echo "  2. 生成新token（勾选repo权限）"
    echo "  3. 运行以下命令："
    echo "     git remote set-url origin https://<你的token>@github.com/daidai696/AI-Resume-Helper.git"
    echo "  4. 重新运行此脚本"
    echo ""
    echo -e "${YELLOW}方法2: 使用SSH密钥${NC}"
    echo "  1. 生成密钥: ssh-keygen -t ed25519 -C \"3165845253@qq.com\""
    echo "  2. 复制公钥: cat ~/.ssh/id_ed25519.pub"
    echo "  3. 添加到GitHub: https://github.com/settings/keys"
    echo "  4. 重新运行此脚本"
    echo ""
fi

# 清理临时文件
rm -f "$REMOTE_TMP" "$LOCAL_TMP" "$MISSING_TMP"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "按任意键关闭窗口..."
read -r
