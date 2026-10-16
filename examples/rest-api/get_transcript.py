import os, time, requests

def get_transcript(video_url):
    api_key = os.environ['TUBETRANSCRIPT_API_KEY']
    while True:
        r = requests.post(
            'https://tubetranscript.io/api/v1/extract',
            headers={'Authorization': f'Bearer {api_key}'},
            json={'url': video_url},
            timeout=300,
        )
        body = r.json()
        if r.status_code == 202:  # audio transcription still running
            time.sleep(int(r.headers.get('Retry-After', 60)))
            continue  # send the same request again
        if not body['success']:
            raise RuntimeError(body['error']['code'])
        return body['data']

data = get_transcript('https://www.youtube.com/watch?v=jNQXAC9IVRw')
print(data['transcript']['text'])
