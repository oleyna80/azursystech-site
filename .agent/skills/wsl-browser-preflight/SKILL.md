---
name: wsl-browser-preflight
description: Preflight script to ensure headless Chromium is running with CDP open on port 9222 before using the browser_subagent on WSL.
---

# Skill: WSL Browser Preflight

## Objective
Prevent `ECONNREFUSED 127.0.0.1:9222` errors when attempting to use the `browser_subagent` tool on WSL (Ubuntu). The agent expects Chromium to be running and listening for Chrome DevTools Protocol (CDP) connections, but WSL does not manage this process automatically.

## Triggers
- `browser_subagent` or browser verification is planned on WSL.
- Playwright/browser checks fail with `ECONNREFUSED 127.0.0.1:9222`.
- A verifier needs CDP-backed Chromium before visual/runtime checks.

## Preconditions
- The agent intends to use `browser_subagent` in the current turn or the next step.

## Workflow

1. **Run Preflight Script**
   Before calling `browser_subagent`, execute the preflight script using the `run_command` tool:
   ```bash
   bash .agent/skills/wsl-browser-preflight/preflight.sh
   ```

2. **Verify Output**
   - The script will check if CDP is already available.
   - If not, it will kill hung instances and launch `chromium --headless` with WSL-safe flags (`--no-sandbox`, `--disable-dev-shm-usage`).
   - Wait for the script to return `✅ Success: Browser started and CDP available!`.

3. **Proceed with Browser Agent**
   - Once the script exits successfully (exit code 0), it is safe to invoke `browser_subagent`.

## Guardrails
- **Do not skip this step on WSL.** Calling the browser agent blindly will result in timeouts and wasted tool calls.
- The browser runs in the background (`nohup ... &`). Do not attempt to run it interactively or block the terminal.

## Handoff
- **Success condition**: The script exits 0 and prints the success message.
- **Next**: Invoke `browser_subagent`.
- **Auto-proceed**: 🟢 YES for local preflight inside an approved browser verification scope.
- **Hard stop**: 🔴 YES before installing browsers/packages, opening a GUI browser, or killing non-owned processes.
