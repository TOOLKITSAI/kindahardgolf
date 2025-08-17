#!/bin/bash

# Kinda Hard Golf - Local Development Server Launcher
# This script starts a local web server for testing the website

echo "🎯 Kinda Hard Golf - Local Server Launcher"
echo "========================================="
echo ""

# Check which web server is available
if command -v python3 &> /dev/null; then
    echo "✅ Starting server with Python 3..."
    echo "📍 Server will run at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Starting server with Python 2..."
    echo "📍 Server will run at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✅ Starting server with npx serve..."
    echo "📍 Server will run at: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    npx serve
elif command -v php &> /dev/null; then
    echo "✅ Starting server with PHP..."
    echo "📍 Server will run at: http://localhost:8080"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "----------------------------------------"
    php -S localhost:8080
else
    echo "❌ No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  • Python: https://www.python.org/downloads/"
    echo "  • Node.js: https://nodejs.org/"
    echo "  • PHP: https://www.php.net/"
    echo ""
    echo "Or use a browser extension like 'Web Server for Chrome'"
    exit 1
fi