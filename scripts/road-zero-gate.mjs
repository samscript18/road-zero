#!/usr/bin/env node
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const root=path.resolve(process.argv[2]||'dist'),out=path.resolve(process.argv[3]||'docs/evidence/baseline');
if(!fs.existsSync(path.join(root,'index.html')))throw new Error(`No production index at ${root}; run npm run build first.`);
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
const missing=[];
const server=createServer((req,res)=>{let rel=decodeURIComponent(req.url.split('?')[0]);if(rel==='/favicon.ico'){res.writeHead(204);res.end();return;}if(rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,`.${rel}`);if(!file.startsWith(root)||!fs.existsSync(file)){missing.push(rel);res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
console.log(`gate server ready on ${port}`);
const browser=await puppeteer.launch({headless:true,executablePath:process.env.PUPPETEER_EXECUTABLE_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox','--enable-unsafe-swiftshader','--disable-gpu','--window-size=1280,720']});
console.log('browser launched');
const errors=[];const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'domcontentloaded',timeout:30000});console.log('page loaded');await page.waitForFunction(()=>window.__READY__===true,{timeout:60000});console.log('game ready');await page.screenshot({path:path.join(out,'frame-00-menu.png')});
await page.click('#startb');await page.waitForFunction(()=>window.__GAME__?.speed>0);const start=await page.evaluate(()=>window.__GAME__);
await page.keyboard.down('ArrowRight');await new Promise(r=>setTimeout(r,900));await page.keyboard.up('ArrowRight');
await page.keyboard.down('Space');await page.keyboard.down('ArrowLeft');await new Promise(r=>setTimeout(r,1000));await page.keyboard.up('ArrowLeft');await page.keyboard.up('Space');
const shots=[35,90,150,205,255,330];
for(let i=0;i<shots.length;i++){await page.waitForFunction(z=>window.__GAME__?.pos?.[1]>=z,{timeout:30000},shots[i]);await page.screenshot({path:path.join(out,`frame-${String(i+1).padStart(2,'0')}.png`)});}
const desktop=await page.evaluate(()=>window.__GAME__);
await page.setViewport({width:844,height:390,deviceScaleFactor:1,isMobile:true,hasTouch:true});await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__READY__===true,{timeout:60000});
const cdp=await page.createCDPSession();const startButton=await page.$('#startb'),startBox=await startButton?.boundingBox();if(!startBox)throw new Error('Mobile start button hidden');
const sx=startBox.x+startBox.width/2,sy=startBox.y+startBox.height/2;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForFunction(()=>window.__GAME__?.speed>0);
const stick=await page.$('#stick');if(!stick)throw new Error('Touch stick missing');const box=await stick.boundingBox();if(!box)throw new Error('Touch stick hidden');
const x=box.x+box.width/2,y=box.y+box.height/2;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+18,y,id:1}]});await new Promise(r=>setTimeout(r,650));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
const mobile=await page.evaluate(()=>window.__GAME__);await page.screenshot({path:path.join(out,'frame-07-mobile.png')});
await browser.close();server.close();
const checks={ready:true,buttonStart:start.speed>0,desktopMoved:desktop.pos[1]>start.pos[1]+250,steering:Math.abs(desktop.pos[0]-start.pos[0])>.25,drift:desktop.score>0,construction:desktop.construction>0,touchMoved:mobile.pos[1]>4,touchSteered:Math.abs(mobile.pos[0])>.1,draws:desktop.draws<900,tris:desktop.tris<1500000,no404:missing.length===0,noConsole:errors.length===0};
const failed=Object.entries(checks).filter(([,v])=>!v);const report={checks,desktop,mobile,missing,errors,renderer:'SwiftShader/software; FPS is smoke data only'};fs.writeFileSync(path.join(out,'gate-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(failed.length){console.error(`FAILED: ${failed.map(([k])=>k).join(', ')}`);process.exit(1);}console.log('PASS: real click, keyboard, drift chord, touch drag, movement, construction and budgets.');
