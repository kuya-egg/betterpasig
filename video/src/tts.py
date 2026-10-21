import asyncio, json, sys, certifi
certifi.where = lambda: '/root/.ccr/ca-bundle.crt'   # trust the workspace proxy's CA (verification stays on)
import edge_tts
async def main():
    for k, t in json.load(open('lines.json')):
        for v in ['fil-PH-AngeloNeural']:
            await edge_tts.Communicate(t, v, rate='+6%').save(f'vo/{k}.mp3')
asyncio.run(main())
