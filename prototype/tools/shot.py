import sys, asyncio
from playwright.async_api import async_playwright
src, out = sys.argv[1], sys.argv[2]
async def main():
    html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + open(src).read() + '</body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w, h, tag in [(1440, 2200, 'desk'), (390, 1700, 'mob')]:
            pg = await b.new_page(viewport={'width': w, 'height': h})
            msgs = []
            pg.on('console', lambda m: msgs.append(m.text))
            pg.on('pageerror', lambda e: msgs.append('ERR ' + str(e)))
            await pg.set_content(html, wait_until='networkidle')
            sw = await pg.evaluate('document.documentElement.scrollWidth')
            await pg.screenshot(path=f'{out}-{tag}.png', full_page=(tag=='mob'))
            if tag=='desk': await pg.screenshot(path=f'{out}-deskfull.png', full_page=True)
            print(tag, 'scrollWidth', sw, msgs)
        await b.close()
asyncio.run(main())
