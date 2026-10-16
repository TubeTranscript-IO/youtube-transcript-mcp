# YouTube transcript MCP for Windsurf

Add the hosted TubeTranscript MCP servers to Windsurf. You need a [Pro API key](https://tubetranscript.io/pricing). Back to the [main README](../../README.md).

1. Open `~/.codeium/windsurf/mcp_config.json`.
2. Paste the contents of [mcp_config.json](mcp_config.json) into it.
3. Replace both `tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` placeholders with your API key.
4. Save the file.
5. Refresh the MCP server list in Cascade.
6. Confirm that `get_transcript` and the AI tools appear in the tool list.

Windsurf uses `serverUrl` for remote servers, where Cursor uses `url`. The full tool list, limits and error codes are in the [MCP setup guide](https://tubetranscript.io/docs/mcp).
