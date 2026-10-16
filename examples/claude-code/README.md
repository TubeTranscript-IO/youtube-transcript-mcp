# YouTube transcript MCP for Claude Code

Register the hosted TubeTranscript MCP servers with the Claude Code CLI. You need a [Pro API key](https://tubetranscript.io/pricing). Back to the [main README](../../README.md).

1. Export your key as `TUBETRANSCRIPT_API_KEY`.
2. Run both commands below. The first registers `tubetranscript` (transcripts), the second `tubetranscript-ai` (the AI tools that take the `job_id` from `get_transcript`).
3. Run `claude mcp list` and confirm both servers connect.
4. Start a new Claude Code session so the tools load.

```bash
claude mcp add --transport http tubetranscript https://tubetranscript.io/api/mcp \
  --header "Authorization: Bearer $TUBETRANSCRIPT_API_KEY"
claude mcp add --transport http tubetranscript-ai https://tubetranscript.io/api/mcp/tools \
  --header "Authorization: Bearer $TUBETRANSCRIPT_API_KEY"
```

```bash
claude mcp list
```

## A starter prompt

```text
Use get_transcript to fetch https://www.youtube.com/watch?v=jNQXAC9IVRw and summarize it in five bullet points. If the status is "processing", wait about a minute and call it again.
```

If a video has no captions, `get_transcript` transcribes the audio and returns `status: "processing"` first. The full tool list, limits and error codes are in the [MCP setup guide](https://tubetranscript.io/docs/mcp).
