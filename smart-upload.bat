@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   AI简历优化助手 - 智能增量上传（Windows版）
echo ============================================
echo.

cd /d "%~dp0"

echo 📍 当前目录: %CD%
echo.

:: 步骤1：检查Git
echo 🔍 步骤1: 检查Git状态...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未安装Git！
    echo 请先安装Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 步骤2：获取远程文件列表
echo 📥 步骤2: 获取远程文件列表...
git fetch origin main 2>nul
if errorlevel 1 (
    echo ❌ 无法连接远程仓库，请检查网络
    pause
    exit /b 1
)

:: 统计文件数量
echo.
echo 📊 统计文件数量...

:: 获取远程文件数
for /f "delims=" %%i in ('git ls-tree -r --name-only origin/main 2^>nul ^| find /c /v ""') do set REMOTE_COUNT=%%i
:: 获取本地文件数
for /f "delims=" %%i in ('git ls-tree -r --name-only HEAD 2^>nul ^| find /c /v ""') do set LOCAL_COUNT=%%i

echo ✅ 远程文件: !REMOTE_COUNT! 个
echo ✅ 本地文件: !LOCAL_COUNT! 个
echo.

:: 步骤3：生成缺失文件列表
echo 📊 步骤3: 对比文件差异...

git ls-tree -r --name-only origin/main | sort > "%TEMP%\remote_files.txt"
git ls-tree -r --name-only HEAD | sort > "%TEMP%\local_files.txt"

:: 使用comm找出差异（需要Git Bash或使用PowerShell）
powershell -Command "Compare-Object -ReferenceObject (Get-Content '%TEMP%\local_files.txt') -DifferenceObject (Get-Content '%TEMP%\remote_files.txt') | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object -ExpandProperty InputObject | Out-File -Encoding UTF8 '%TEMP%\missing_files.txt'"

set /a MISSING_COUNT=0
for /f "delims=" %%i in ('type "%TEMP%\missing_files.txt" 2^>nul ^| find /c /v ""') do set MISSING_COUNT=%%i

echo 📦 需要上传的文件: !MISSING_COUNT! 个
echo.

if !MISSING_COUNT! equ 0 (
    echo 🎉 所有文件都已上传！
    pause
    exit /b 0
)

:: 显示前20个文件
echo 📄 前20个需要上传的文件：
set /a SHOWN=0
for /f "delims=" %%i in ('type "%TEMP%\missing_files.txt"') do (
    if !SHOWN! lss 20 (
        echo    - %%i
        set /a SHOWN+=1
    )
)
echo    ...
echo.

:: 步骤4：确认
echo ❓ 确认要上传这 !MISSING_COUNT! 个文件吗？(y/n)
set /p CONFIRM=
if /i not "%CONFIRM%"=="y" (
    echo ❌ 取消上传
    pause
    exit /b 0
)

:: 步骤5：添加文件
echo.
echo 📦 步骤4: 添加文件到Git...
set /a ADDED=0
for /f "delims=" %%i in ('type "%TEMP%\missing_files.txt"') do (
    if exist "%%i" (
        git add "%%i" >nul 2>&1
        if not errorlevel 1 set /a ADDED+=1
    )
)
echo ✅ 已暂存 !ADDED! 个文件
echo.

:: 步骤6：提交
echo 💾 步骤5: 创建提交...
git commit -m "feat: 增量上传 !ADDED! 个文件 - 完整版AI简历优化助手" >nul 2>&1
if errorlevel 1 (
    echo ⚠️ 没有需要提交的更改
    pause
    exit /b 0
)
echo ✅ 提交成功
echo.

:: 步骤7：推送
echo 🚀 步骤6: 推送到GitHub...
echo.
echo    如果提示需要登录：
echo    - 选择浏览器登录（会自动打开浏览器）
echo    - 在浏览器中授权即可
echo.

git push origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 可能的原因和解决方案：
    echo.
    echo 方法1: 使用GitHub Personal Access Token
    echo   1. 访问: https://github.com/settings/tokens
    echo   2. 生成新token（勾选repo权限）
    echo   3. 运行: git remote set-url origin https://^<你的token^>@github.com/daidai696/AI-Resume-Helper.git
    echo   4. 重新运行此脚本
    echo.
    echo 方法2: 配置Git凭据
    echo   git config --global user.email "3165845253@qq.com"
    echo   git config --global user.name "daidai696"
    echo   git credential-manager configure
    echo.
) else (
    echo.
    echo ============================================
    echo   ✅ 上传成功！
    echo ============================================
    echo.
    echo 🎉 已成功上传 !ADDED! 个文件到GitHub！
    echo.
    echo 📦 仓库地址: https://github.com/daidai696/AI-Resume-Helper
    echo.
)

:: 清理临时文件
del "%TEMP%\remote_files.txt" 2>nul
del "%TEMP%\local_files.txt" 2>nul
del "%TEMP%\missing_files.txt" 2>nul

echo.
pause
