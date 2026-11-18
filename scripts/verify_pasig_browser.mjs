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
async function search(page,query){await page.locator('#q').fill(query);await page.locator('#search-results a').first().waitFor();}
const auditDir=resolve(process.env.BETTERPASIG_AUDIT_DIR??'research/implementation-audit');
const origin=`http://localhost:${server.port}`;const report={html_pages:files.length,checked_internal_links:links,browser_checks:[],payload:{}};mkdirSync(auditDir,{recursive:true});
try{
 const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const locale of ['','/fil']){
  const label=locale?'fil':'en';
  await page.goto(origin+locale+'/');
  const footer=page.locator('footer');
  assert.match(await footer.innerText(),/Eulogio Amang Rodriguez Avenue, Bridgetowne/);
  assert.match(await footer.locator('a[href^="https://www.google.com/maps/search/"]').getAttribute('href'),/Bridgetowne/);
  assert.equal(await footer.locator('a[href="tel:0286431111"]').count(),1);
  assert.doesNotMatch(await footer.innerText(),/Being checked|Sinusuri pa/);
  await search(page,locale?'rekord ng kasal':'birth or marriage record');
  await page.locator('#q').press('ArrowDown');
  await page.locator('#q').press('Enter');
  await page.waitForURL(`**${locale}/serbisyo/certified-copy-civil-document/`);
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${label} ${width}`);
   await page.screenshot({path:join(auditDir,`${label}-${width}.png`),fullPage:true});
  }
  for(const path of ['/serbisyo/business-permit-renewal/','/lugar/temporary-city-hall/']){
   assert.equal((await page.goto(origin+locale+path)).status(),404,path);
  }
  await page.goto(origin+locale+'/barangay/');
  assert.equal(await page.locator('[data-map3d] a[data-id]').count(),30);
  assert.doesNotMatch(await page.content(),/Ferdinand Alicante Avis|671-0681/);
  await page.goto(origin+locale+'/emergency/');
  assert.equal(await page.locator('main a[href="tel:0286320099"]').count(),0);
  assert.ok(await page.locator('main a[href="tel:0286430000"]').first().isVisible());
  await page.goto(origin+locale+'/ngayong-linggo/arkibo/');
  assert.equal(await page.locator('#caspay-2026-10-30').count(),0);
  const dates=await (await page.request.get(origin+'/notice-dates.json')).json();
  assert.equal(Object.hasOwn(dates.notices,'caspay-2026-10-30'),false);
  assert.equal(Object.hasOwn(dates.places,'temporary-city-hall'),false);
  report.browser_checks.push(`${label} confirmed footer, verified service search and unpublished services, places, contacts and notices`);
 }
 assert.deepEqual(errors,[]);await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const staticPage=await nojs.newPage();await staticPage.goto(origin+'/fil/ngayong-linggo/');assert.ok(await staticPage.getByText('Wala pang nakalistang bagong opisyal na abiso.').isVisible());await nojs.close();
 const payloadContext=await browser.newContext();const payloadPage=await payloadContext.newPage();let wire=0,decoded=0;const pending=[];payloadPage.on('response',r=>{pending.push((async()=>{try{decoded+=(await r.body()).length;const size=await r.request().sizes();wire+=size.responseBodySize;}catch{}})());});await payloadPage.goto(origin+'/',{waitUntil:'networkidle'});await Promise.all(pending);const timing=await payloadPage.evaluate(()=>[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].reduce((sum,entry)=>({encoded:sum.encoded+entry.encodedBodySize,decoded:sum.decoded+entry.decodedBodySize}),{encoded:0,decoded:0}));report.payload={local_gzip_bytes:timing.encoded,decoded_bytes:timing.decoded,under_300KB:timing.encoded<300*1024};await payloadContext.close();
 assert.ok(report.payload.under_300KB, `Homepage first load was ${report.payload.local_gzip_bytes} bytes`);
 report.result='PASS';writeFileSync(join(auditDir,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server.stop(true);}
