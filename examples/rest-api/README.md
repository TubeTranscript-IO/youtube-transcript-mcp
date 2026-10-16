# YouTube transcript API examples: curl, Python and JavaScript

The TubeTranscript REST API returns a YouTube video's timestamped transcript as JSON from one `POST /api/v1/extract` call. It reads the captions first and transcribes the audio when a video has none. It needs a [Pro API key](https://tubetranscript.io/pricing) in `TUBETRANSCRIPT_API_KEY`. Back to the [main README](../../README.md).

| File | Language |
| --- | --- |
| [curl.sh](curl.sh) | curl |
| [get_transcript.py](get_transcript.py) | Python (`requests`) |
| [get_transcript.mjs](get_transcript.mjs) | JavaScript (Node 18+, `fetch`) |

When transcription of a video without captions is still running, the API answers `202 EXTRACTION_IN_PROGRESS` with a `Retry-After` header. The Python and JavaScript examples wait that long and send the same request again; nothing is transcribed twice. Set the client timeout to 300 seconds.

The response holds the plain text in `data.transcript.text` and timed lines in `data.transcript.chunks` (`start` and `duration` in seconds). Every field and error code is on the [YouTube Transcript API page](https://tubetranscript.io/youtube-transcript-api) and in the [API reference](https://tubetranscript.io/docs/api).
