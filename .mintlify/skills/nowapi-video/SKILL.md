---
name: nowapi-video
description: Create and query Sora-compatible and Seedance-compatible video generation tasks with NowAPI.
license: Proprietary
compatibility: Requires Node.js 18+ and a NowAPI API key.
metadata:
  author: NowAPI
  version: "1.0.0"
---

# NowAPI Video

Use this skill when the user asks to create or inspect NowAPI video tasks.

## Configuration

- Read the API key only from `NOWAPI_API_KEY`.
- Read the base URL from `NOWAPI_BASE_URL`; default to `https://api.aiid.edu.kg`.
- Discover models through `/v1/models`; do not rely on a hardcoded model list.
- Never print the API key, full base64 media, or binary payloads.

## Commands

- `models`: List available models. Calls `GET /v1/models`.
- `sora-create`: Create a Sora-compatible video task. Calls `POST /v1/videos`.
- `sora-status`: Query a Sora-compatible video task. Calls `GET /v1/videos/{task_id}`.
- `sora-content`: Download completed video content. Calls `GET /v1/videos/{task_id}/content`.
- `seedance-create`: Create a Seedance-compatible video task. Calls `POST /api/v3/contents/generations/tasks`.
- `seedance-status`: Query a Seedance-compatible video task. Calls `GET /api/v3/contents/generations/tasks/{task_id}`.

```bash
node scripts/nowapi-video.mjs <command> [options]
```

Use `--json request.json` for request bodies and `--id <task_id>` for status commands. Creation and status checks are separate operations. Before a billable request, confirm cost-sensitive parameters with the user. Full documentation: https://docs.aiid.edu.kg.
