@echo off
REM Consulting & Connection Feature Setup Script for Windows

echo 🚀 Setting up Consulting & Connection Feature...
echo.

REM Install dependencies
echo 📦 Installing required dependencies...
call npm install date-fns @radix-ui/react-avatar

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Run database migrations
echo 🗄️ Running database migrations...
call npm run db:push

echo.
echo ✅ Database migrations completed!
echo.

echo 🎉 Setup complete!
echo.
echo You can now access the Consulting ^& Connection features at:
echo   - Main page: /consulting
echo   - Mentor dashboard: /consulting/mentor
echo   - Browse courses: /consulting/courses
echo   - Setup profile: /consulting/profile
echo   - Discover people: /consulting/network/discover
echo   - Connections: /consulting/network/connections
echo   - Messages: /consulting/network/messages
echo.
echo For more information, check CONSULTING_FEATURE_README.md
echo.
pause
