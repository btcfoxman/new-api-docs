#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";

const DEFAULT_BASE_URL = "https://api.aiid.edu.kg";
const COMMANDS = {
  "models": {
    "method": "GET",
    "path": "/v1/models"
  },
  "sora-create": {
    "method": "POST",
    "path": "/v1/videos",
    "body": true
  },
  "sora-status": {
    "method": "GET",
    "path": "/v1/videos/{task_id}",
    "id": "task_id"
  },
  "sora-content": {
    "method": "GET",
    "path": "/v1/videos/{task_id}/content",
    "id": "task_id",
    "binary": true
  },
  "seedance-create": {
    "method": "POST",
    "path": "/api/v3/contents/generations/tasks",
    "body": true
  },
  "seedance-status": {
    "method": "GET",
    "path": "/api/v3/contents/generations/tasks/{task_id}",
    "id": "task_id"
  }
};
const SLUG = "nowapi-video";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function redact(value) {
  return String(value ?? "")
    .replace(/Bearer\s+[^\s"']+/gi, "Bearer [REDACTED]")
    .replace(/data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,[a-z0-9+/=]+/gi, "data:$1;base64,[REDACTED]")
    .slice(0, 4000);
}

function usage() {
  console.error(`Usage: node scripts/${SLUG}.mjs <command> [--json request.json] [--id task_id] [--out output.file]\nCommands: ${Object.keys(COMMANDS).join(", ")}`);
}

async function main() {
  const command = process.argv[2];
  if (!command || command === "help" || process.argv.includes("--help")) {
    usage();
    process.exit(command === "help" || process.argv.includes("--help") ? 0 : 2);
  }
  const spec = COMMANDS[command];
  if (!spec) {
    usage();
    process.exit(2);
  }
  const apiKey = process.env.NOWAPI_API_KEY;
  if (!apiKey) throw new Error("NOWAPI_API_KEY is required");
  const baseURL = (process.env.NOWAPI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  let path = spec.path;
  if (spec.id) {
    const id = option("--id");
    if (!id) throw new Error(`--id is required for ${command}`);
    path = path.replace("{" + spec.id + "}", encodeURIComponent(id));
  }
  let body;
  if (spec.body) {
    const inputPath = option("--json");
    if (!inputPath) throw new Error(`--json is required for ${command}`);
    body = await readFile(inputPath, "utf8");
    JSON.parse(body);
  }
  const timeout = Number(process.env.NOWAPI_TIMEOUT_MS || 120000);
  const response = await fetch(baseURL + path, {
    method: spec.method,
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
    body,
    signal: AbortSignal.timeout(timeout),
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${redact(await response.text()) || response.statusText}`);
  if (spec.binary) {
    const outputPath = option("--out");
    if (!outputPath) throw new Error("--out is required when downloading video content");
    const data = Buffer.from(await response.arrayBuffer());
    await writeFile(outputPath, data);
    console.log(JSON.stringify({ ok: true, output: outputPath, bytes: data.length }, null, 2));
    return;
  }
  const contentType = response.headers.get("content-type") || "";
  console.log(contentType.includes("application/json") ? JSON.stringify(await response.json(), null, 2) : redact(await response.text()));
}

main().catch((error) => {
  console.error(redact(error?.message || error));
  process.exit(1);
});
