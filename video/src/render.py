import asyncio, sys, os
from playwright.async_api import async_playwright
mode = sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1080, 'height': 1080})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.getcwd() + '/scene_built.html', wait_until='networkidle')
        await pg.evaluate('document.fonts.ready')
        if mode == 'keys':
            for t in [1.2, 3.0, 3.9, 5.9, 8.9, 11.3, 12.55, 14.5]:
                await pg.evaluate(f'render({t})'); await pg.screenshot(path=f'key-{t}.png')
        else:
            os.makedirs('frames', exist_ok=True)
            fps=30; dur=15.0
            for i in range(int(fps*dur)):
                await pg.evaluate(f'render({i/fps})'); await pg.screenshot(path=f'frames/f{i:04d}.png')
        print('errors', errs)
        await b.close()
asyncio.run(main())
