# YouTube transcript MCP for n8n

Use the hosted TubeTranscript MCP servers from an n8n AI Agent. You need a [Pro API key](https://tubetranscript.io/pricing). Back to the [main README](../../README.md).

1. Open a workflow that contains an AI Agent node.
2. Add an MCP Client Tool node to the agent's tool input.
3. Set Endpoint to `https://tubetranscript.io/api/mcp`.
4. Set Server Transport to HTTP Streamable.
5. Set Authentication to Bearer Auth.
6. Create a Bearer credential whose token is your `tt_live_…` API key.
7. Save the workflow.
8. Repeat steps 2 to 7 with endpoint `https://tubetranscript.io/api/mcp/tools` to add the AI tools. The agent needs both, because the AI tools take the `job_id` that `get_transcript` returns.

| n8n field | Value |
| --- | --- |
| Endpoint | `https://tubetranscript.io/api/mcp` (or `/api/mcp/tools`) |
| Server Transport | HTTP Streamable |
| Authentication | Bearer Auth |
| Credential token | Your `tt_live_…` API key |

For a single step without an agent, call `POST /api/v1/extract` from an HTTP Request node instead: see the [REST API examples](../rest-api/README.md). The full tool list, limits and error codes are in the [MCP setup guide](https://tubetranscript.io/docs/mcp).
