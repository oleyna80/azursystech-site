---
name: systematic-debugging
description: 4-phase root cause debugging. Use before proposing fixes for any bug, test failure, or unexpected behavior.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
---

# Skill: Systematic Debugging

## Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## Triggers
- bug, test failure, unexpected behavior
- "почему не работает", "сломалось", "ошибка"
- build failure, integration issue
- previous fix didn't work

## When to Use

Use for ANY technical issue, **especially** when:
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- You don't fully understand the issue

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read error messages carefully**
   - Don't skip past errors or warnings
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - If not reproducible → gather more data, don't guess

3. **Check recent changes**
   - `git log -5 --oneline` — what changed recently?
   - `git diff` — any uncommitted changes?
   - New dependencies, config changes, env differences?

4. **Gather evidence in multi-component systems**
   - For each component boundary: log what enters and exits
   - Run once to gather evidence showing WHERE it breaks
   - Then investigate the failing component specifically

5. **Trace data flow**
   - Where does the bad value originate?
   - What called this with the bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

1. **Find working examples** — locate similar working code in the same codebase
2. **Compare** — what's different between working and broken?
3. **List every difference**, however small — don't assume "that can't matter"
4. **Check dependencies** — settings, config, environment, assumptions

### Phase 3: Hypothesis and Testing

1. **Form single hypothesis** — "I think X is the root cause because Y"
2. **Test minimally** — smallest possible change, one variable at a time
3. **Verify** — did it work? Yes → Phase 4. No → new hypothesis, don't stack fixes

### Phase 4: Implementation

1. **Create failing test case** (if possible) — simplest reproduction
2. **Implement single fix** — address the root cause, ONE change at a time
3. **Verify fix** — test passes? No other tests broken? Issue resolved?
4. **If fix doesn't work after 3 attempts** → STOP. Question the architecture. Escalate to Owner.

## Red Flags — STOP and Return to Phase 1

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

## {{PROJECT_NAME}}-Specific Context

When debugging in this project, check:
- `web/` — Next.js app, check `npm run check:types` first
- `admin/` — separate Next.js app, check `npm run check:ci`
- API routes — check request/response shape, CORS, rate limiter
- DB — check SQL migrations applied, connection params, SSL mode
- VPS — check container health, nginx proxy, compose project name
- Chat/intake — check storage.ts, conversation flow, LLM response shape

## Handoff
- **Success condition**: root cause identified and documented, fix applied and verified, or escalated with evidence.
- **Next**: return to calling agent/skill
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
