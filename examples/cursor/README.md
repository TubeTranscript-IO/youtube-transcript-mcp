# YouTube transcript MCP for Cursor

Add the hosted TubeTranscript MCP servers to Cursor. You need a [Pro API key](https://tubetranscript.io/pricing). Back to the [main README](../../README.md).

1. Create `.cursor/mcp.json` in the project root, or `~/.cursor/mcp.json` for all projects.
2. Paste the contents of [mcp.json](mcp.json) into it.
3. Replace both `tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` placeholders with your API key.
4. Add `.cursor/mcp.json` to `.gitignore`, because the file contains your key.
5. Confirm that `tubetranscript` and `tubetranscript-ai` appear in Cursor's MCP settings.

Cursor detects the Streamable HTTP transport from the URL. The `tubetranscript-ai` tools take the `job_id` that `get_transcript` returns, so keep both entries. The full tool list, limits and error codes are in the [MCP setup guide](https://tubetranscript.io/docs/mcp).
