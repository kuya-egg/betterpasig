import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {gzipSync} from 'node:zlib';
import {chromium} from 'playwright-core';
const root=resolve('dist');const files=[];
function collect(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())collect(p);else if(p.endsWith('.html'))files.push(p);}}collect(root);
let links=0;for(const file of files){const html=readFileSync(file,'utf8');assert.ok(html.includes('hindi ito opisyal na website')||html.includes('not the official Pasig City website'),file);assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file);for(const match of html.matchAll(/href="(\/[^"#?]*)(?:[^" ]*)"/g)){const path=decodeURIComponent(match[1]);if(path.startsWith('//'))continue;const target=resolve(root,'.'+path);assert.ok(existsSync(target)||existsSync(join(target,'index.html')),`Broken link ${path} in ${file}`);links++;}}
const server=Bun.serve({port:0,async fetch(request){let pathname=decodeURIComponent(new URL(request.url).pathname);let file=resolve(root,'.'+pathname);if(!file.startsWith(root))return new Response('',{status:403});if(existsSync(file)&&!file.endsWith('.html')&&!file.split(/[\\/]/).at(-1).includes('.'))file=join(file,'index.html');if(pathname.endsWith('/'))file=join(resolve(root,'.'+pathname),'index.html');if(!existsSync(file))return new Response('Missing',{status:404});const f=Bun.file(file);return new Response(gzipSync(Buffer.from(await f.arrayBuffer())),{headers:{'Content-Type':f.type,'Content-Encoding':'gzip'}});}});
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH??'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
// Pagefind loads and searches asynchronously; the fake clock must advance before results appear.
async function search(page,query){await page.locator('#q').fill(query);for(let i=0;i<40&&!(await page.locator('#search-results a').count());i++){await page.clock.runFor(100);await page.waitForTimeout(100);}}
const auditDir=resolve(process.env.BETTERPASIG_AUDIT_DIR??'research/implementation-audit');
const origin=`http://localhost:${server.port}`;const report={html_pages:files.length,checked_internal_links:links,browser_checks:[],payload:{}};mkdirSync(auditDir,{recursive:true});
try{
 const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-10-29T12:00:00+08:00')});
 for(const locale of ['','/en']){
  await page.clock.setSystemTime(new Date('2026-10-29T12:00:00+08:00'));
  await page.goto(origin+locale+'/');await search(page,'temporary');await page.locator('#q').press('ArrowDown');await page.locator('#q').press('Enter');await page.waitForURL('**/lugar/temporary-city-hall/');report.browser_checks.push(`${locale||'fil'} keyboard search -> place`);
  await page.goto(origin+locale+'/lugar/revolving-tower-rpt/');assert.equal(await page.locator('a[href*="/barangay/null"]').count(),0);
  for(const width of [390,1280]){await page.setViewportSize({width,height:900});await page.goto(origin+locale+'/serbisyo/spay-neuter/');assert.ok(await page.locator('[data-event-date]').count());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${locale} ${width}`);await page.clock.runFor(2500);await page.screenshot({path:join(auditDir,`${locale?'en':'fil'}-${width}.png`),fullPage:true});}
  await page.clock.setSystemTime(new Date('2026-10-30T23:59:55+08:00'));await page.goto(origin+locale+'/serbisyo/spay-neuter/');await page.clock.runFor(6000);assert.match(await page.locator('[data-event-status]').innerText(),locale?/passed/:/Lumipas/);assert.equal(await page.locator('[data-registration]').count(),0);report.browser_checks.push(`${locale||'fil'} event midnight expiry`);
  await page.clock.setSystemTime(new Date('2026-11-15T12:00:00+08:00'));await page.goto(origin+locale+'/');assert.equal(await page.locator('[data-current-feed] [data-published-date]:visible').count(),0);assert.ok((await page.locator('[data-place-source-dates]').allTextContents()).every(value=>value==='0'));await search(page,'caspay');const caspay=await page.locator('#search-results a').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h.includes('caspay-2026-10-30')));assert.ok(caspay.length&&caspay.every(h=>h.includes('/arkibo/')),`CaSpay notice not archived: ${caspay}`);
  await page.goto(origin+locale+'/ngayong-linggo/arkibo/');assert.ok(await page.locator('#caspay-2026-10-30').isVisible());report.browser_checks.push(`${locale||'fil'} stale feed removed, search archived, static archive revealed`);
 }
 assert.deepEqual(errors,[]);await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(origin+'/serbisyo/spay-neuter/');assert.ok((await staticPage.locator('main').innerText()).includes('Okt 30, 2026'));assert.equal(await staticPage.locator('a[href^="https://forms.gle"]').count(),0);report.browser_checks.push('No-JS dated source action, no live registration promise');await nojs.close();
 const payloadContext=await browser.newContext();const payloadPage=await payloadContext.newPage();let wire=0,decoded=0;const pending=[];payloadPage.on('response',r=>{pending.push((async()=>{try{decoded+=(await r.body()).length;const size=await r.request().sizes();wire+=size.responseBodySize;}catch{}})());});await payloadPage.goto(origin+'/',{waitUntil:'networkidle'});await Promise.all(pending);const timing=await payloadPage.evaluate(()=>[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].reduce((sum,entry)=>({encoded:sum.encoded+entry.encodedBodySize,decoded:sum.decoded+entry.decodedBodySize}),{encoded:0,decoded:0}));report.payload={local_gzip_bytes:timing.encoded,decoded_bytes:timing.decoded,under_300KB:timing.encoded<300*1024};await payloadContext.close();
 assert.ok(report.payload.under_300KB, `Homepage first load was ${report.payload.local_gzip_bytes} bytes`);
 report.result='PASS';writeFileSync(join(auditDir,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server.stop(true);}
