@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   AI简历优化助手 - 合并远程并推送
echo ============================================
echo.

cd /d "%~dp0"

echo 📍 当前目录: %CD%
echo.

echo 🔍 步骤1: 拉取远程仓库的更改...
git pull origin main --allow-unrelated-histories --no-edit

if errorlevel 1 (
    echo.
    echo ⚠️ 拉取时出现冲突，自动使用本地版本...
    git checkout --ours .
    git add .
    git commit -m "merge: 合并远程仓库，保留本地版本"
)

echo.
echo ✅ 步骤1完成
echo.

echo 📦 步骤2: 确保所有文件已添加...
git add .
echo ✅ 文件已添加
echo.

echo 💾 步骤3: 提交本地更改（如果有）...
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "feat: 合并后补充本地文件"
    echo ✅ 提交完成
) else (
    echo ℹ️ 没有需要提交的更改
)
echo.

echo 🚀 步骤4: 推送到GitHub...
echo    如果弹出浏览器，请登录GitHub并授权
echo.

git push origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败
    echo.
    echo 如果是身份验证问题，请：
    echo 1. 等待浏览器自动打开
    echo 2. 登录GitHub账号
    echo 3. 点击"授权"
    echo.
    pause
) else (
    echo.
    echo ============================================
    echo   ✅ 推送成功！
    echo ============================================
    echo.
    echo 🎉 所有文件已成功上传到GitHub！
    echo.
    echo 📦 仓库地址: https://github.com/daidai696/AI-Resume-Helper
    echo.
    pause
)
