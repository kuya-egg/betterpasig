import asyncio, os, json
from playwright.async_api import async_playwright
TL = json.load(open('timeline.json')); TOTAL = TL['total'] + 0.6
def n2o(T):
    for s in TL['segments']:
        play1 = s['h'] - s['a']; seglen = (s['b'] - s['a']) + s['extra']
        if T < s['S'] + seglen or s is TL['segments'][-1]:
            loc = T - s['S']
            if loc <= play1: return s['a'] + loc
            if loc <= play1 + s['extra']: return s['h']
            return min(s['b'], s['h'] + loc - play1 - s['extra'])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1080})
        await pg.goto('file://' + os.getcwd() + '/scene_built.html', wait_until='networkidle'); await pg.evaluate('document.fonts.ready')
        os.makedirs('frames2', exist_ok=True)
        for i in range(int(30 * TOTAL)):
            await pg.evaluate(f'render({n2o(i / 30):.4f})'); await pg.screenshot(path=f'frames2/f{i:04d}.png')
        await b.close()
asyncio.run(main())
