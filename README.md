# YouTube Transcript MCP Server for Claude Code, Cursor and Windsurf

TubeTranscript is a hosted MCP server that lets AI agents fetch the transcript of a YouTube video, including videos without captions. Pro API key required.

[![Examples and docs: MIT](https://img.shields.io/badge/examples%20and%20docs-MIT-blue)](LICENSE)
[![Website: tubetranscript.io/youtube-transcript-mcp](https://img.shields.io/badge/website-tubetranscript.io-black)](https://tubetranscript.io/youtube-transcript-mcp)

| At a glance | |
| --- | --- |
| Type | Remote MCP server, Streamable HTTP |
| Hosting | Hosted by TubeTranscript. The server source is not in this repository. |
| Auth | `Authorization: Bearer <Pro API key>` |
| Price | Pro plan, $4.99/month (Enterprise $19/month) |
| Registry names | `io.tubetranscript/transcripts`, `io.tubetranscript/ai-tools` |

> This repository holds setup configs, examples and docs only. The server itself is hosted and closed-source, and every tool call needs a Pro API key.

## Quick start

TubeTranscript runs two remote MCP servers. `https://tubetranscript.io/api/mcp` fetches transcripts, and `https://tubetranscript.io/api/mcp/tools` turns a transcript into chapters, hooks, a mindmap, subtitles or a blog draft. Both take the same [Pro](https://tubetranscript.io/pricing) API key in an `Authorization: Bearer` header. The AI tools take the `job_id` that `get_transcript` returns, so register both.

In the examples, replace the placeholder `tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` with your key, and keep any file that contains the key out of version control.

### Claude Code

Export your key as `TUBETRANSCRIPT_API_KEY`, then register both servers:

```bash
claude mcp add --transport http tubetranscript https://tubetranscript.io/api/mcp \
  --header "Authorization: Bearer $TUBETRANSCRIPT_API_KEY"
claude mcp add --transport http tubetranscript-ai https://tubetranscript.io/api/mcp/tools \
  --header "Authorization: Bearer $TUBETRANSCRIPT_API_KEY"
```

Run `claude mcp list` to confirm both connect, then start a new session so the tools load. More in [examples/claude-code](examples/claude-code/README.md).

### Cursor

Add both servers to `.cursor/mcp.json` in the project, or to `~/.cursor/mcp.json` for every project. Cursor detects the Streamable HTTP transport from the URL. The file is also at [examples/cursor/mcp.json](examples/cursor/mcp.json).

```json
{
  "mcpServers": {
    "tubetranscript": {
      "url": "https://tubetranscript.io/api/mcp",
      "headers": { "Authorization": "Bearer tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
    },
    "tubetranscript-ai": {
      "url": "https://tubetranscript.io/api/mcp/tools",
      "headers": { "Authorization": "Bearer tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
    }
  }
}
```

### Windsurf

Add both servers to `~/.codeium/windsurf/mcp_config.json`. Windsurf uses `serverUrl` for remote servers. After saving, refresh the MCP server list in Cascade. The file is also at [examples/windsurf/mcp_config.json](examples/windsurf/mcp_config.json).

```json
{
  "mcpServers": {
    "tubetranscript": {
      "serverUrl": "https://tubetranscript.io/api/mcp",
      "headers": { "Authorization": "Bearer tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
    },
    "tubetranscript-ai": {
      "serverUrl": "https://tubetranscript.io/api/mcp/tools",
      "headers": { "Authorization": "Bearer tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }
    }
  }
}
```

### n8n

Add an MCP Client Tool node to an AI Agent workflow and set:

| n8n field | Value |
| --- | --- |
| Endpoint | `https://tubetranscript.io/api/mcp` (or `/api/mcp/tools`) |
| Server Transport | HTTP Streamable |
| Authentication | Bearer Auth |
| Credential token | Your `tt_live_…` API key |

Add a second MCP Client Tool node for `/api/mcp/tools`. See [examples/n8n](examples/n8n/README.md).

## Give Claude Code a YouTube transcript

Once both servers are registered, ask in plain language:

```text
Use get_transcript to fetch https://www.youtube.com/watch?v=jNQXAC9IVRw and summarize it in five bullet points. If the status is "processing", wait about a minute and call it again.
```

A typical agent workflow takes two or three calls:

1. The agent calls `get_transcript` with the video URL or ID and gets the transcript as plain text, plus a `job_id`.
2. If `status` is `processing`, the video has no captions and its audio is being transcribed. The agent calls again with the same video after about 60 seconds.
3. The agent passes the `job_id` to an AI tool such as `generate_chapters`, `extract_hooks` or `translate_subtitles`.

Repeat calls are safe: your team's existing job for a video is reused, so nothing is transcribed twice.

## Tools

| Tool | Server | Returns |
| --- | --- | --- |
| `get_transcript` | `/api/mcp` | The transcript as clean plain text, the video ID, a status and the `job_id` that stores it for your team. |
| `extract_hooks` | `/api/mcp/tools` | Up to 10 hooks with start and end time, a title and a summary. |
| `create_mindmap` | `/api/mcp/tools` | A Mermaid mindmap of the video. |
| `generate_chapters` | `/api/mcp/tools` | YouTube chapters with clock times and titles. |
| `generate_description` | `/api/mcp/tools` | A video description with tags and hashtags. |
| `find_moments` | `/api/mcp/tools` | Short-clip moments with a hook, a reason and a quote. |
| `analyze_hook` | `/api/mcp/tools` | An analysis of the opening, with rewrite suggestions. |
| `translate_subtitles` | `/api/mcp/tools` | Subtitles translated into the languages you choose. |
| `generate_brand_voice_blog` | `/api/mcp/tools` | A Markdown blog draft in one of your saved brand voices. |

`get_transcript` accepts `video_url` (any YouTube URL) or `video_id` (the 11-character ID). The AI tools read the transcript of a job you already have and never fetch videos themselves. Calling one again with the same `job_id` returns the stored result. Full input and output fields are in the [MCP setup guide](https://tubetranscript.io/docs/mcp).

## YouTube videos without captions

When a video has no captions, `get_transcript` falls back to audio transcription instead of returning an error. It returns `status: "processing"` and an empty transcript; call it again with the same video after about a minute until the status is `completed`. On Pro it handles videos up to 2 hours. Private and removed videos, and live streams in progress, still fail.

## Limits, authentication and errors

| | |
| --- | --- |
| Plan | Pro, $4.99/month, or Enterprise. A missing, unknown or non-Pro key gets `402 Payment Required`. |
| Rate limit | 100 tool calls per 24 hours per team on Pro (up to 30 transcribed from audio), 1,000 on Enterprise, shared with the REST API and all the team's keys. `initialize`, `tools/list` and `ping` are free. |
| Transport | Stateless Streamable HTTP. `GET` and `DELETE` on the server URL get `405`. |
| Output | `get_transcript` returns plain text without timestamps. For timed chunks, use the REST API. |

The `402` body carries a `reason`:

| `reason` | Meaning |
| --- | --- |
| `MISSING_API_KEY` | No key sent. |
| `INVALID_API_KEY` | Unknown or revoked key. |
| `PLAN_UPGRADE_REQUIRED` | The team is not on Pro. |
| `RATE_LIMIT_EXCEEDED` | The 24-hour limit is used up; wait `Retry-After` seconds. |

Arguments are validated before any quota is spent: a missing, mistyped or unknown argument returns HTTP 400 with JSON-RPC error `-32602`. A tool that runs but cannot finish returns HTTP 200 with `result.isError: true` and a JSON block `{ "error": "<CODE>", "message": "…" }`, for example `JOB_NOT_FOUND` or `JOB_NOT_READY`, so always check `isError`. The full list is in the [MCP setup guide](https://tubetranscript.io/docs/mcp). Key handling and limits: [security and rate limits](https://tubetranscript.io/docs/security).

## Use the REST API instead

If your own code, a script or an n8n HTTP Request node decides when to fetch a transcript, call the [REST API](https://tubetranscript.io/youtube-transcript-api) with the same Pro key and the same daily limit. It returns timed chunks as JSON.

```bash
curl -X POST https://tubetranscript.io/api/v1/extract \
  -H "Authorization: Bearer $TUBETRANSCRIPT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"}'
```

Python and JavaScript versions that wait for a transcription in progress are in [examples/rest-api](examples/rest-api/README.md).

## Compared with open-source YouTube transcript MCP servers

Free open-source servers such as [jkawamoto/mcp-youtube-transcript](https://github.com/jkawamoto/mcp-youtube-transcript) and [kimtaeyoon83/mcp-server-youtube-transcript](https://github.com/kimtaeyoon83/mcp-server-youtube-transcript) are a good fit when you are happy to run a process on your own machine. Read from their READMEs on 2026-10-16:

| | Open-source servers | TubeTranscript |
| --- | --- | --- |
| Where it runs | On your machine, started with `uvx` or `npx` | Hosted: you add a URL and a key |
| Cost | Free, MIT licence | Pro, $4.99/month |
| Videos without captions | Captions and subtitles only, per their READMEs. One adds an optional video-analysis tool that needs a TwelveLabs key. | Falls back to audio transcription |
| IP blocks | The first README says YouTube blocks cloud and data-centre IPs and shows how to set up your own proxy | No proxy to set up on your side |
| Timestamps | Timed segments are available through MCP | `get_transcript` returns plain text; timed chunks come from the REST API |

Choose an open-source server if you only need captions, want it free, or want timed segments inside MCP.

## FAQ

**What is the TubeTranscript MCP server?**
Two remote MCP servers that let an AI agent fetch the transcript of a YouTube video and turn it into hooks, chapters, a mindmap, subtitles or a blog draft. You register them once in Claude Code, Cursor, Windsurf or n8n, and the agent calls the tools itself.

**How much does it cost?**
The MCP servers are part of the Pro plan, $4.99/month: up to 100 tool calls per 24 hours per team, shared with the REST API. Enterprise, $19/month, raises that to 1,000. See [pricing](https://tubetranscript.io/pricing).

**Does get_transcript work for videos without captions?**
Yes. It reads the captions first. With none, it transcribes the audio and returns status processing; the agent calls it again with the same video after about a minute until the status is completed. Pro covers videos up to 2 hours.

**Do I need Pro just to try it?**
For the MCP servers, yes: every tool call needs a Pro API key. To see what a transcript looks like first, paste a link on the [home page](https://tubetranscript.io/), or use [Copy for Claude](https://tubetranscript.io/youtube-transcript-for-claude), which needs no account.

**Should I use MCP or the REST API?**
Use MCP when an agent decides when to fetch a transcript. Use the [REST API](https://tubetranscript.io/youtube-transcript-api) when your own code does, for example from a script or an automation. Both use the same Pro key and the same daily limit.

**How is this different from the free open-source YouTube transcript MCP servers?**
Those run on your machine and are free. This one is hosted, so there is no process or proxy to set up, and it falls back to audio transcription when a video has no captions. It costs Pro, and `get_transcript` returns plain text; timed segments come from the REST API. See the comparison above.

**Which clients are supported?**
Any client that speaks Streamable HTTP MCP with a Bearer header. The [setup guide](https://tubetranscript.io/docs/mcp) documents Claude Code, Cursor, Windsurf and n8n.

**Is the server source code in this repository?**
No. The server is hosted and closed-source. This repository has the setup configs, examples and registry metadata for it.

## Links

- [YouTube Transcript MCP Server](https://tubetranscript.io/youtube-transcript-mcp): the product page
- [MCP setup guide](https://tubetranscript.io/docs/mcp): every step, field and error code
- [YouTube Transcript API](https://tubetranscript.io/youtube-transcript-api): the REST endpoint
- [Transcripts for videos without captions](https://tubetranscript.io/youtube-transcript-no-captions)
- [Pricing](https://tubetranscript.io/pricing)
- Registry metadata: [registry/server.transcripts.json](registry/server.transcripts.json) (`io.tubetranscript/transcripts`) and [registry/server.ai-tools.json](registry/server.ai-tools.json) (`io.tubetranscript/ai-tools`)

TubeTranscript.io is not affiliated with tubetranscript.com. The examples and docs in this repository are MIT licensed. The hosted service is governed by https://tubetranscript.io/terms.
