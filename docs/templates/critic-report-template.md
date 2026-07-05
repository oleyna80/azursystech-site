# Critic Report Template

> Use when launching the `critic` agent. Copy into the mission brief as the expected output format.

---

## Critic Report — [Work Block ID]

**Date:** [YYYY-MM-DD]
**Reviewed:** Stage 0 Preflight + Work Block definition
**Verdict:** APPROVE / SUPPLEMENT / RECONSIDER

### Scope Review

| Issue | Detail | Recommendation |
|---|---|---|

### Skill Routing Review

| Skill | Status (matched/skipped/unchecked) | Skip Reason | Assessment |
|---|---|---|---|

### Subagent Topology Review

| Aspect | Finding | Recommendation |
|---|---|---|

### Risk Gaps

| Risk | Why Unmentioned | Potential Impact | Recommendation |
|---|---|---|---|

### Decision Quality

| Decision | Issue | Recommendation |
|---|---|---|

### Optional GPT Critic Merge

> Complete this section only when the GPT critic trigger fires. This is Stage 0
> critic evidence, not the Stage 2 -> 3 consolidation report.

**GPT Critic Status:** NOT_REQUIRED / READY / DEGRADED / FAILED
**Combined Assessment:** APPROVE / SUPPLEMENT / RECONSIDER

| Finding | Source | Resolution |
|---|---|---|

### Recommendations

#### Must Address (blocking quality)
- [ ] [Finding] — [Why] — [Recommended action]

#### Should Address (improves robustness)
- [ ] [Finding] — [Why] — [Recommended action]

#### Might Consider (optional refinement)
- [ ] [Finding] — [Why] — [Recommended action]

### Inspection Gaps

| Dimension | Target | Reason | Partial Coverage |
|---|---|---|---|
