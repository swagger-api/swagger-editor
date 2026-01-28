#!/bin/bash

echo "🔧 Testing Vite Setup..."
echo ""

# Check if index.html exists in root
if [ -f "index.html" ]; then
    echo "✅ index.html found in root"
else
    echo "❌ index.html NOT found in root"
    exit 1
fi

# Check if src/index.tsx exists
if [ -f "src/index.tsx" ]; then
    echo "✅ src/index.tsx found"
else
    echo "❌ src/index.tsx NOT found"
    exit 1
fi

# Check if public directory exists
if [ -d "public" ]; then
    echo "✅ public directory found"
else
    echo "❌ public directory NOT found"
    exit 1
fi

# Check if vite is installed
if npm list vite | grep -q "vite@"; then
    echo "✅ Vite is installed"
else
    echo "❌ Vite is NOT installed"
    echo "Run: npm install"
    exit 1
fi

echo ""
echo "🚀 All checks passed! Starting Vite server..."
echo "Press Ctrl+C to stop the server"
echo ""

npm start
