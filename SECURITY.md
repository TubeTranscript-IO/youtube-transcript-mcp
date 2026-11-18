# Security policy

This repository holds setup configs, examples and documentation for the hosted
TubeTranscript MCP servers. The servers themselves are not in this repository.

## Reporting a vulnerability

Email **support@tubetranscript.io** with "Security" in the subject, a description of the problem and the steps
to reproduce it. Please do not open a public issue for a vulnerability in the
hosted service. We will reply by email.

For a mistake in the examples or docs in this repository (for example a config
that would leak a key), a normal issue is fine.

## Never post your API key

Do not paste a real API key (`tt_live_...`) into an issue, a discussion, a pull
request or a screenshot. Replace it with the placeholder
`tt_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` first.

If a key was exposed, revoke it in your TubeTranscript dashboard and create a
new one.
