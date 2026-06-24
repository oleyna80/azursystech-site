# Subagent Anti-Patterns

> When delegation hurts more than it helps — and how to avoid it.

**Status:** reference
**Audience:** Control Tower (orchestrator)
**Based on:** Skilljar "Introduction to Subagents" + AzurSysTech project experience
**Last updated:** 2026-06-01

---

## The Delegation Decision

Subagents are a context-management tool, not a parallelism hack. The question is always:

> Is the cost of spinning up a new context outweighed by preserving main-context focus?

If the answer is "no" or "I'm not sure" — don't delegate.

---

## Anti-Pattern 1: Delegating Trivial Tasks

**Symptom:** You spawn a subagent to check one file or answer a single-fact question.

**Why it hurts:**
- Context-spinup cost (~200-500ms + token overhead) exceeds task cost
- Main context already has the answer or can get it with one Read/grep
- Adds orchestration latency with zero quality gain

**When it's actually harmful:**
- 1-file inspection with a known path
- Single line fix (typo, import, formatting)
- Grep/find that takes <5 seconds

**Heuristic:** If the task description fits in one sentence and requires ≤2 tool calls — it's inline.

**AGENTS.md already covers this:** Subagent-Required triggers skip with reason `trivial`.

---

## Anti-Pattern 2: Chain-of-Agents Without Intermediate Validation

**Symptom:** Agent A → Agent B → Agent C, each passing raw output to the next, with no Control Tower check in between.

**Why it hurts:**
- Errors compound: Agent A's plausible-but-wrong output becomes Agent B's foundation
- Token cost multiplies without quality multiplier
- Control Tower loses visibility into intermediate results

**Fix:**
- Control Tower reads and validates each agent's output before passing to the next
- Each agent gets the same original context (task spec, not previous agent's interpretation)
- Verifier gates between stages for high-risk chains

**Example from project:**
```
✅ Good:  solution-architect → Control Tower reviews → Plan mode → Control Tower approves → Scoped Coder → Verifier
❌ Bad:   solution-architect → Scoped Coder (blind handoff, no CT review)
```

---

## Anti-Pattern 3: Context-Isolation Harms Accuracy

**Symptom:** A subagent makes a decision that contradicts project-wide context because it only saw the files in its scope.

**Why it hurts:**
- Subagent can't see conventions, naming patterns, or recent decisions outside its read-set
- Produces code that's correct in isolation but wrong in context
- Creates inconsistency that future maintainers must reconcile

**Fix:**
- Always include `AGENTS.md`, `CLAUDE.md`, and relevant `memory_bank/` files in subagent read scope
- For Scoped Coder: include at least 2-3 existing files in the same module as examples
- If the subagent's decision affects project-wide conventions — it's a red flag: Control Tower should decide, not the subagent

**Heuristic:** If you'd feel the need to say "but make sure it follows our patterns" — the subagent doesn't have enough context. Either expand its read scope or do it inline.

---

## Anti-Pattern 4: Overly Broad Subagent Scope

**Symptom:** "Review the entire codebase for bugs" or "Refactor the auth module" — scope too large for one subagent context.

**Why it hurts:**
- Subagent runs out of context before completing
- Returns shallow findings (first N files, no depth)
- Misses systemic issues that require cross-file tracing

**Fix:**
- Split by dimension (code, security, architecture) → separate Reviewer agents per dimension
- Split by module (auth, intake, showcase) → separate Coder agents per module
- Use explicit file lists, not wildcards
- If a single agent would need to read 50+ files — break it into 2-3 scoped agents

**Heuristic:** Each subagent should read 3-15 files. More than 20 → scope too broad.

---

## Anti-Pattern 5: Single-Verifier Blindness

**Symptom:** One Verifier agent confirms the work of one Scoped Coder — no adversarial check.

**Why it hurts:**
- Coder and Verifier share the same blind spots (both Claude, both see same context)
- False positives: both agree on wrong assumption
- False negatives: both miss the same edge case

**Fix (from SDD protocol proven pattern):**
- Reviewer (adversarial) BEFORE Verifier (confirmatory)
- Verifier uses structured checks (not "does it look right?")
- For high-risk Work Blocks: 2 Verifier runs with different tiers or focus areas

**From the proven pattern documented in CLAUDE.md:**
```
solution-architect → verifier(skill) → Plan mode → Implement → verifier(agent)
```
The key is two verifier passes: one pre-implementation (confirm research), one post-implementation (confirm result).

---

## Anti-Pattern 6: Subagent as Decision-Maker

**Symptom:** "Let me ask the architect whether we should do this" — delegating an Owner decision to a subagent.

**Why it hurts:**
- Subagents recommend — they don't decide
- Product, budget, risk-appetite, and priority decisions belong to Owner
- Subagent can't weigh business context it wasn't given

**Fix:**
- Subagent output is **evidence, not acceptance** (AGENTS.md rule)
- Control Tower presents options to Owner, not subagent's single recommendation
- Hard Stops always require Owner — subagent can flag but not resolve

**Red flag phrases from subagents:**
- "We should definitely..."
- "The right approach is..."
- "Production deploy is safe because..."

These are Control Tower / Owner decisions. Subagent should say "Option A has lower risk than Option B because..."

---

## Decision Heuristics

| Task | Delegate? | Why |
|---|---|---|
| Fix a typo in one file | ❌ Inline | Cost of spinup > benefit |
| Review 5 changed files for bugs | ✅ Reviewer subagent | Isolated, focused, read-only |
| Refactor across 10 files | ✅ Scoped Coder | Write-set isolation, focused context |
| Decide between 2 architectural approaches | ❌ Inline (research: ✅) | Decision is Control Tower's; research can be delegated |
| Verify after implementation (3 files) | ✅ Verifier subagent | Independent second look |
| Verify after implementation (1 file, trivial) | ❌ Inline | `trivial` skip |
| Run npm audit + check types | ❌ Inline Bash | One command, no context needed |
| Investigate a 404 across 4 modules | ✅ Explore subagent | Broad file sweep |
| Write a new API route + tests | ✅ Scoped Coder | Multi-file, needs focused context |
| "Make sure everything looks good" | ❌ Too vague | Scope undefined → garbage output |

---

## Quick Pre-Delegation Checklist

Before spawning a subagent, answer these 4 questions:

1. **Can I do this with ≤2 tool calls?** → Inline
2. **Does the subagent have enough context to be right?** → If no, expand read scope or do inline
3. **Is the scope bounded to 3-15 files?** → If more, split into multiple agents
4. **Am I delegating a decision or a task?** → Tasks: ✅. Decisions: ❌

If all 4 pass → delegate. If any fail → reconsider.

---

## Related

- `AGENTS.md § Multi-Agent Default` — Subagent-Required triggers
- `AGENTS.md § Structural Authority Model` — Role boundaries
- `AGENTS.md § Agent Roster` — Agent roles and authority
- `.agent/workflows/sdd-protocol.md` — Stage flow with subagent handoffs
- `.agent/ROSTER.md` — Agent/mode and skill routing
