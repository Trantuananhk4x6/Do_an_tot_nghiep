@echo off
echo ====================================
echo Fixing Drizzle TypeScript Types
echo ====================================
echo.

echo Step 1: Deleting cache folders...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist node_modules\.drizzle rmdir /s /q node_modules\.drizzle
if exist .drizzle rmdir /s /q .drizzle
echo Cache cleared!
echo.

echo Step 2: Generating Drizzle schema...
call npx drizzle-kit generate
echo.

echo Step 3: Pushing schema to database...
call npm run db:push
echo.

echo ====================================
echo Done! Now please:
echo 1. Close VS Code completely
echo 2. Reopen VS Code
echo 3. Press Ctrl+Shift+P
echo 4. Type: TypeScript: Restart TS Server
echo 5. Press Enter
echo ====================================
echo.
pause
