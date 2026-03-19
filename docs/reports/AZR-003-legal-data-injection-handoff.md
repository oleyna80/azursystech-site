# Handoff: Tech Lead -> RooCode

**Date**: 2026-03-15
**Ticket**: AZR-003-001 - Inject Real Legal Data
**Priority**: P0 (Launch Blocker)

## Context
The founder has officially resolved AZR-003-001 by providing the final, real legal identity and business data for AzurSysTech.
We now need to remove all `[TBD]` placeholders from the legal and privacy pages and inject the real data.

## Scope
1. **Target Files**:
   - `web/src/app/legal/page.tsx`
   - `web/src/app/privacy/page.tsx`
   - Any other route/component exposing corporate info in `web/`

2. **Provided Data**:
   > **[NOTE TO FOUNDER/TECH LEAD: Paste the real data list here before handing over to RooCode]**
   - Company Name: ...
   - SIRET / Business ID: ...
   - Registered Address: ...
   - Publication Director: ...
   - Hosting Provider (Name, Address): ...
   - Contact Email: ...

## Acceptance Criteria (AC)
- **AC1**: No `[TBD]` or `[PENDING_FOUNDER]` placeholders remain in the legal/privacy routes.
- **AC2**: The provided real data is exactly reflected on the legal and privacy pages.
- **AC3**: Build validation passes in `web/`.
- **AC4**: No structural or design changes apply to the pages — only data replacement.

## Constraints & Rules
- Do NOT alter any text outside of the variables/placeholders. The legal framing must remain exactly as published in `web/src/app/legal/page.tsx`.

## Expected Output
Return a structured report with:
1. What was done
2. Decisions made
3. Files / settings changed
4. Open blockers (if any)
5. Next recommended action
