---
name: nowapi-image
description: Generate and edit images with NowAPI, including asynchronous Responses API image tasks.
license: Proprietary
compatibility: Requires Node.js 18+ and a NowAPI API key.
metadata:
  author: NowAPI
  version: "1.0.0"
---

# NowAPI Image

Use this skill when the user asks to create or inspect NowAPI image tasks.

## Configuration

- Read the API key only from `NOWAPI_API_KEY`.
- Read the base URL from `NOWAPI_BASE_URL`; default to `https://api.aiid.edu.kg`.
- Discover models through `/v1/models`; do not rely on a hardcoded model list.
- Never print the API key, full base64 media, or binary payloads.

## Commands

- `models`: List available models. Calls `GET /v1/models`.
- `generate`: Generate images. Calls `POST /v1/images/generations`.
- `edit`: Edit images from references. Calls `POST /v1/images/edits`.
- `responses-create`: Create an asynchronous image task. Calls `POST /v1/responses`.
- `responses-get`: Query an asynchronous image task. Calls `GET /v1/responses/{response_id}`.

```bash
node scripts/nowapi-image.mjs <command> [options]
```

Use `--json request.json` for request bodies and `--id <task_id>` for status commands. Creation and status checks are separate operations. Before a billable request, confirm cost-sensitive parameters with the user. Full documentation: https://docs.aiid.edu.kg.
