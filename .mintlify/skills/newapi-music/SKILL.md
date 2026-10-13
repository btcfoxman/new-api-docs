---
name: newapi-music
description: Create music generation tasks and query their results by task ID with NewAPI.
license: Proprietary
compatibility: Requires Node.js 18+ and a NewAPI API key.
metadata:
  author: NewAPI
  version: "1.0.0"
---

# NewAPI Music

Use this skill when the user asks to create or inspect NewAPI music tasks.

## Configuration

- Read the API key only from `NEWAPI_API_KEY`.
- Read the base URL from `NEWAPI_BASE_URL`; default to `https://api.aiid.edu.kg`.
- Discover models through `/v1/models`; do not rely on a hardcoded model list.
- Never print the API key, full base64 media, or binary payloads.

## Commands

- `models`: List available models. Calls `GET /v1/models`.
- `create`: Create a music generation task. Calls `POST /suno/submit/music`.
- `status`: Query a music task by ID. Calls `GET /suno/fetch/{task_id}`.

```bash
node scripts/newapi-music.mjs <command> [options]
```

Use `--json request.json` for request bodies and `--id <task_id>` for status commands. Creation and status checks are separate operations. Before a billable request, confirm cost-sensitive parameters with the user. Full documentation: https://docs.aiid.edu.kg.
