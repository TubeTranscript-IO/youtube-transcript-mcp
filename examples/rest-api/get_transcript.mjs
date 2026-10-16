async function getTranscript(videoUrl) {
  while (true) {
    const res = await fetch('https://tubetranscript.io/api/v1/extract', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TUBETRANSCRIPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: videoUrl }),
      signal: AbortSignal.timeout(300000),
    });
    const body = await res.json();
    if (res.status === 202) {
      // audio transcription still running: wait, then send the same request again
      const seconds = Number(res.headers.get('Retry-After') ?? 60);
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
      continue;
    }
    if (!body.success) throw new Error(body.error.code);
    return body.data;
  }
}

const data = await getTranscript('https://www.youtube.com/watch?v=jNQXAC9IVRw');
console.log(data.transcript.text);
