import type { Plugin } from "@opencode-ai/plugin"
import fs from "node:fs"
import path from "node:path"

const LOG = path.join(process.cwd(), ".opencode", "plugin", "smoke.log")
const CRITIC_GATE = path.join(process.cwd(), ".agent", "critic-gate.md")
const VERIFICATION_GATE = path.join(process.cwd(), ".agent", "verification-gate.md")

const CONTROL_WRITE_PREFIXES = [
  "docs/plans/",
  "docs/reports/",
]

const CONTROL_WRITE_FILES = new Set([
  "memory_bank/orchestrator-log.md",
  "memory_bank/review-log.md",
  "memory_bank/external-team-log.md",
  ".agent/critic-gate.md",
  ".agent/verification-gate.md",
  ".agent/write-gate.md",
])

const SECRET_PATTERNS = [
  /(^|\/)\.env($|[./])/,
  /(^|\/)\.env\./,
  /secret/i,
  /credential/i,
  /private[-_]?key/i,
  /token/i,
]

const HARD_STOP_COMMANDS = [
  /\bgit\s+push\b/i,
  /\bgit\s+reset\s+--hard\b/i,
  /\bgit\s+clean\s+-/i,
  /\bgit\s+checkout\s+--\b/i,
  /\brm\s+-[^\n]*[rf]/i,
  /\bscp\b/i,
  /\bssh\b/i,
  /\bdocker\s+push\b/i,
  /\bprisma\s+migrate\s+deploy\b/i,
  /\bprisma\s+db\s+push\b/i,
]

function log(line: string) {
  const ts = new Date().toISOString()
  try {
    fs.appendFileSync(LOG, `[${ts}] ${line}\n`)
  } catch {
    // best-effort; never crash the host on log failure
  }
}

function asText(value: unknown): string {
  if (Array.isArray(value)) return value.map(asText).join(" ")
  if (typeof value === "string") return value
  if (value == null) return ""
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function normalizeRepoPath(raw: string): string {
  const repo = process.cwd()
  const value = raw.trim().replace(/^["']|["']$/g, "")
  const absolute = path.isAbsolute(value) ? value : path.join(repo, value)
  const relative = path.relative(repo, absolute).replaceAll(path.sep, "/")
  return relative.startsWith("../") ? value.replaceAll(path.sep, "/") : relative
}

function parseGate(file: string): { status: string; approved: string[] } {
  try {
    const text = fs.readFileSync(file, "utf8")
    const status = text.match(/^Status:\s*(.+)$/m)?.[1]?.trim() ?? "UNKNOWN"
    const approved: string[] = []
    const lines = text.split(/\r?\n/)
    let inWriteSet = false

    for (const line of lines) {
      if (/^Approved Write-Set:/i.test(line)) {
        inWriteSet = true
        continue
      }
      if (inWriteSet && !line.trim()) break
      if (inWriteSet) {
        const match = line.match(/^\s*-\s+`?([^`]+?)`?\s*$/)
        if (match) approved.push(normalizeRepoPath(match[1]))
      }
    }

    return { status, approved }
  } catch {
    return { status: "MISSING", approved: [] }
  }
}

function isGateReady(status: string): boolean {
  return /^(READY|APPROVED)$/i.test(status)
}

function approvedWriteSet(critic: { status: string; approved: string[] }, verification: { status: string; approved: string[] }): string[] {
  return [
    ...(isGateReady(critic.status) ? critic.approved : []),
    ...(isGateReady(verification.status) ? verification.approved : []),
  ]
}

function isControlWrite(target: string): boolean {
  const normalized = normalizeRepoPath(target)
  return CONTROL_WRITE_FILES.has(normalized) || CONTROL_WRITE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function isApproved(target: string, approved: string[]): boolean {
  const normalized = normalizeRepoPath(target)
  return approved.some((entry) => {
    const clean = entry.replace(/^\.\//, "")
    if (clean.endsWith("/**")) return normalized.startsWith(clean.slice(0, -3))
    if (clean.endsWith("/")) return normalized.startsWith(clean)
    return normalized === clean || normalized.startsWith(clean + "/")
  })
}

function looksLikeSecretTarget(text: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(text))
}

function looksLikeHardStopCommand(text: string): boolean {
  return HARD_STOP_COMMANDS.some((pattern) => pattern.test(text))
}

function isWriteTool(tool: string): boolean {
  return /^(edit|write|patch)$/i.test(tool)
}

function collectStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collectStringValues)
  return []
}

function toolTargets(tool: string, args: unknown): string[] {
  if (!args || typeof args !== "object") return []
  const record = args as Record<string, unknown>
  const keys = isWriteTool(tool)
    ? ["filePath", "path", "target", "targets", "files", "oldPath", "newPath"]
    : ["filePath", "path", "target", "targets", "files"]

  return keys.flatMap((key) => collectStringValues(record[key])).filter(Boolean)
}

function assertAllowedWriteTargets(source: string, targets: string[], approved: string[]) {
  if (!targets.length) return

  const secretTarget = targets.find(looksLikeSecretTarget)
  if (secretTarget) {
    log(`SDLC_GUARD deny ${source} secret-sensitive target: ${secretTarget}`)
    throw new Error(`SDLC guard denied secret-sensitive target: ${secretTarget}`)
  }

  const denied = targets.filter((target) => !isControlWrite(target) && !isApproved(target, approved))
  if (denied.length) {
    log(`SDLC_GUARD deny ${source} non-approved write target: ${denied.join(", ")}`)
    throw new Error(`SDLC guard denied non-approved write target: ${denied.join(", ")}`)
  }
}

export default (async ({ directory }) => {
  log("PLUGIN LOADED dir=" + directory)
  // Do not call OpenCode client APIs during plugin startup. Some commands wait
  // for plugin initialization before the session API is ready, which can hang
  // the whole process.

  return {
    "permission.ask": async (input, output) => {
      const pattern = asText(input.pattern)
      const metadata = asText(input.metadata)
      const text = [input.type, input.title, pattern, metadata].filter(Boolean).join(" ")
      const critic = parseGate(CRITIC_GATE)
      const verification = parseGate(VERIFICATION_GATE)
      const approved = approvedWriteSet(critic, verification)

      log(
        `permission.ask type=${input.type} pattern=${JSON.stringify(input.pattern)} sessionID=${input.sessionID} critic=${critic.status} verification=${verification.status}`,
      )

      if (looksLikeSecretTarget(text)) {
        output.status = "deny"
        log(`SDLC_GUARD deny secret-sensitive target: ${text}`)
        return
      }

      if (looksLikeHardStopCommand(text)) {
        output.status = "deny"
        log(`SDLC_GUARD deny hard-stop command: ${text}`)
        return
      }

      if (/edit|write|patch|file/i.test(input.type) && pattern) {
        const targets = Array.isArray(input.pattern) ? input.pattern.map(asText) : [pattern]
        const allControlTargets = targets.every(isControlWrite)
        const allAllowedTargets = targets.every((target) => isControlWrite(target) || isApproved(target, approved))

        if (allControlTargets) {
          output.status = "allow"
          log(`SDLC_GUARD allow control/journal write: ${targets.join(", ")}`)
          return
        }

        if (!allAllowedTargets) {
          output.status = "ask"
          log(`SDLC_GUARD ask non-approved write target: ${targets.join(", ")}`)
        }
      }
    },
    "tool.execute.before": async (input, output) => {
      log(`tool.execute.before tool=${input.tool} sessionID=${input.sessionID} callID=${input.callID}`)
      const argsText = asText(output.args)

      if (input.tool === "bash" && looksLikeHardStopCommand(argsText)) {
        log(`SDLC_GUARD deny hard-stop bash: ${argsText}`)
        throw new Error("SDLC guard denied hard-stop bash command")
      }

      const targets = toolTargets(input.tool, output.args)
      const secretTarget = targets.find(looksLikeSecretTarget)
      if (secretTarget) {
        log(`SDLC_GUARD deny ${input.tool} secret-sensitive target: ${secretTarget}`)
        throw new Error(`SDLC guard denied secret-sensitive target: ${secretTarget}`)
      }

      if (isWriteTool(input.tool)) {
        const critic = parseGate(CRITIC_GATE)
        const verification = parseGate(VERIFICATION_GATE)
        assertAllowedWriteTargets(input.tool, targets, approvedWriteSet(critic, verification))
      }
    },
    "tool.execute.after": async (input, output) => {
      log(`tool.execute.after tool=${input.tool} callID=${input.callID}`)
    },
    event: async ({ event }) => {
      const t = (event as { type?: string })?.type
      if (t && /session/i.test(t)) {
        log(`event type=${t}`)
      }
    },
  } as Parameters<Plugin>[0] extends never ? never : Awaited<ReturnType<Plugin>>
}) satisfies Plugin
