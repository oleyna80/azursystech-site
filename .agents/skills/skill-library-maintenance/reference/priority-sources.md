# Priority External Skill Sources

Discovery catalog for requests that do not name a specific upstream source.
The priority number determines lookup order only; it does not authorize an
import or alter the trust model.

| Priority | Publisher | Repository | Skill directory | Default ref |
| --- | --- | --- | --- | --- |
| 1 | OpenAI | `https://github.com/openai/codex` | `.codex/skills` | `main` |
| 2 | Anthropic | `https://github.com/anthropics/skills` | `skills` | `main` |

Record the resolved full commit SHA, not `main`, when reporting a result or
creating provenance.
