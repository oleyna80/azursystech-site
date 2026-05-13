#!/bin/bash
# Ensures headless Chromium is running with CDP open on port 9222 for WSL.

# 1. Check if port is already answering (browser is running and ready)
if curl -s -f http://127.0.0.1:9222/json/version > /dev/null; then
  echo "✅ CDP already available on 127.0.0.1:9222."
  exit 0
fi

# 2. Kill any hung Chromium processes keeping the port open but not answering
echo "🔄 Cleaning up old Chromium processes..."
pkill -f "chromium.*remote-debugging-port=9222" || true
sleep 1

# 3. Start Chromium in the background with WSL-safe flags
echo "🚀 Starting headless Chromium (CDP port 9222)..."
nohup chromium \
  --headless \
  --disable-gpu \
  --remote-debugging-port=9222 \
  --no-sandbox \
  --disable-dev-shm-usage \
  > /dev/null 2>&1 &

# 4. Wait for CDP to be ready (up to 5 seconds)
echo "⏳ Waiting for CDP..."
for i in {1..5}; do
  if curl -s http://127.0.0.1:9222/json/version > /dev/null; then
    echo "✅ Success: Browser started and CDP available!"
    exit 0
  fi
  sleep 1
done

echo "❌ Error: Failed to start Chromium on port 9222 within 5 seconds."
exit 1
