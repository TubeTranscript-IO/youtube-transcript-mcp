#!/usr/bin/env bash
# Needs a Pro API key in TUBETRANSCRIPT_API_KEY.
curl -X POST https://tubetranscript.io/api/v1/extract \
  -H "Authorization: Bearer $TUBETRANSCRIPT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"}'
