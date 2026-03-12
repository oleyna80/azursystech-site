# Prompt Library - Content

## Active templates

- `05_ai/prompts/content_writer_system.md`
- `05_ai/prompts/content_writer_user.md`

## Variable map

Required:
- `task`
- `asset_type`
- `language`

Recommended:
- `audience`
- `length_target`
- `channel`
- `constraints`
- `source_points`
- `project_context` (auto-loaded by runtime)

## Quality checks

- Keep copy readable for non-technical audience
- Use local trust signals (Nice + alentours)
- Add `[TO_BE_VALIDATED]` marker when fact is uncertain
- Keep CTA single and explicit
