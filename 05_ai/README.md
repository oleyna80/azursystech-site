# AI Agents Runtime

This folder contains the working MVP wrapper for AzurSysTech AI agents.

## What is included

- `agents/registry.json` - list of agents and runtime settings
- `prompts/` - system and user templates
- `examples/` - sample JSON payloads for local tests
- `runs/` - execution logs and approval notes

## CLI

Use `scripts/ai_agents.py` from repository root.

### List agents

```bash
./scripts/ai_agents.py list
```

### Dry run (no API call)

```bash
./scripts/ai_agents.py run \
  --agent lead_router \
  --input-file 05_ai/examples/lead_router_input.json \
  --dry-run \
  --print-prompts
```

### Live run (OpenAI API)

```bash
export OPENAI_API_KEY=your_key
./scripts/ai_agents.py run \
  --agent content_writer \
  --input-file 05_ai/examples/content_writer_input.json
```

## Environment variables

- `OPENAI_API_KEY` (required for live runs)
- `OPENAI_BASE_URL` (optional, default: `https://api.openai.com/v1`)

## Runtime behavior

- Loads strategy context files automatically from `registry.json`
- Renders prompt templates with JSON payload values
- Detects escalation keywords
- Creates run artifact in `05_ai/runs/*.json`
- Creates `*.approval.md` when approval is required
