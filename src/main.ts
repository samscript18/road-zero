import * as THREE from 'three';
import createHero from './assets/hero_coupe.js';
import createTrack from './assets/track_module.js';
import createPylon from './assets/infrastructure_pylon.js';
import { bakeStatic } from './assetlib.js';
import './styles.css';

const TUNE = {
  maxSpeed: 52, acceleration: 14, steer: 18, grip: 8.2, driftGrip: 2.5,
  driftSteer: 27, roadHalf: 5.55, redHalf: 2.25, safeHalf: 3.65,
  cameraDistance: 2.25, cameraHeight: 1.18, lookAhead: 4.2, fallTime: 1.15,
};

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div id="menu" class="screen">
    <div><div class="eyebrow">404 GAME JAM 001 // BUILD 00</div><h1>ROAD<span class="slash">//</span>ZERO</h1>
    <div class="tagline">THE ROAD DOESN'T EXIST UNTIL YOU RACE IT.</div>
    <div class="menu"><button id="startb" class="action primary">RUN // YOU VS THE ROAD</button><button id="champ" class="action">CHAMPIONSHIP // LOCKED IN BASELINE</button><button id="how" class="action">HOW TO PLAY</button><button id="audio" class="action">AUDIO // ON</button></div>
    <div class="fine">ARROWS / A D TO STEER · SPACE TO DRIFT · ESC TO PAUSE</div></div>
  </div>
  <div id="modal" class="screen hidden"><div class="panel"><div class="eyebrow">DRIVER BRIEF</div><h2>OWN THE ROAD BEFORE IT EXISTS.</h2><p>Steer with arrows, A/D, or the touch stick. Hold SPACE or DRIFT to break grip. SAFE is wider. REDLINE is narrow, faster scoring, and unforgiving.</p><button id="close" class="action primary">UNDERSTOOD</button></div></div>
  <div id="results" class="screen hidden"><div><div id="result-title" class="eyebrow">RUN TERMINATED</div><h1 id="result-score">0</h1><div class="tagline" id="result-copy">DISTANCE 0 M</div><div class="menu"><button id="again" class="action primary">RUN AGAIN</button><button id="main" class="action">MAIN MENU</button></div></div></div>
  <div id="hud"><div class="hud-top"><div class="metric"><b id="speed">000</b><span>KM/H</span></div><div id="race-position" class="metric hidden"><b>1 / 4</b><span>POSITION</span></div><div class="metric"><b id="score">000000</b><span>SCORE // <i id="multi">X1.0</i></span></div></div><div id="world" class="eyebrow">01 // NEON DISTRICT</div><div id="route-call"><div class="eyebrow">ROUTE SPLIT // COMMIT</div><div class="route-grid"><div class="route safe">◫ SAFE // WIDE</div><div class="route red">◆ REDLINE // ×2</div></div></div><div id="event">ROAD LINKED</div></div>
  <div id="touch"><div id="stick"><div id="knob"></div></div><button id="drift">DRIFT</button></div>`;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65)); renderer.setSize(innerWidth, innerHeight); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.18; app.prepend(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x05070b); scene.fog = new THREE.FogExp2(0x07111a, .008);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, .1, 700);
scene.add(new THREE.HemisphereLight(0x8bc8df, 0x071017, 2.1));
const sun = new THREE.DirectionalLight(0xe6fbff, 5.2); sun.position.set(-8, 14, -10); scene.add(sun);
const rim = new THREE.DirectionalLight(0x24e5ff, 2.2); rim.position.set(12, 5, 18); scene.add(rim);

type Module = { group: THREE.Group; z:number; x:number; assembled:number; startOffsets:THREE.Vector3[]; finalPositions:THREE.Vector3[]; finalRotations:number[]; branch:'main'|'safe'|'red' };
const modules: Module[] = [];
function addModule(z:number,x=0,branch:Module['branch']='main',scaleX=1){
  const group=bakeStatic(createTrack(THREE)); group.position.set(x,0,z); group.scale.x=scaleX; scene.add(group);
  const startOffsets:THREE.Vector3[]=[],finalPositions:THREE.Vector3[]=[],finalRotations:number[]=[];
  let plate=0;group.children.forEach((child,i)=>{const ground=child instanceof THREE.Mesh&&child.material instanceof THREE.Material&&child.material.name==='ground';const p=plate++;const side=p<2?-1:1;const off=ground?new THREE.Vector3(side*(8.5+Math.abs(p-1.5)*1.5),1.6,(p%2?1.2:-1.2)):new THREE.Vector3((i%2?1:-1)*(15+i*2.5),8+i*2.2,(i-1.5)*5);if(!ground)plate--;child.userData.assemblyGround=ground;startOffsets.push(off);finalPositions.push(child.position.clone());finalRotations.push(child.rotation.z);child.position.add(off);child.rotation.x=ground?(p%2?-.08:.08):child.rotation.x;child.rotation.z+=(i%2?1:-1)*(ground?.22:.52);});
  modules.push({group,z,x,assembled:0,startOffsets,finalPositions,finalRotations,branch});
}
for(let i=-1;i<5;i++)addModule(i*48);
for(let i=4;i<=7;i++){addModule(i*48,-4.3,'safe',.7);addModule(i*48,4.3,'red',.46);}
for(let i=8;i<15;i++)addModule(i*48);

const pylons:THREE.Group[]=[];
for(let i=0;i<8;i++)for(const side of [-1,1]){const p=bakeStatic(createPylon(THREE));p.position.set(side*(i===5?14:18),0,72+i*84);p.rotation.y=side<0?Math.PI:0;if(i===5){p.scale.set(.82,1.35,.82);}if(i>=6){p.rotation.z=side*.22;p.scale.multiplyScalar(1.18);}scene.add(p);pylons.push(p);}

const car=bakeStatic(createHero(THREE)); car.scale.setScalar(1.55);car.position.set(0,1.68,4); scene.add(car);
type Rival={name:string;car:THREE.Group;pace:number;lane:number;redline:boolean;points:number};
const rivalDefs=[['NOVA',50,-1.6,true,0xff304c],['VEX',48,0,true,0x8d63ff],['KAI',45,1.6,false,0xffb547]] as const;
const rivals:Rival[]=rivalDefs.map(([name,pace,lane,redline,color])=>{const r=bakeStatic(createHero(THREE));r.traverse(o=>{if(o instanceof THREE.Mesh){o.material=o.material.clone();if(o.material.emissive)o.material.emissive.setHex(color);}});r.visible=false;scene.add(r);return{name,car:r,pace,lane,redline,points:0};});
let mode:'run'|'championship'='run',raceIndex=0,playerPoints=0,countdown=0,lastPosition=1;
let playing=false, over=false, paused=false, route='UNDECIDED', routeAwarded=false;
let speed=0,lateralVel=0,score=0,multiplier=1,distance=4,fall=0,constructionCount=0;
const keys=new Set<string>(); let touchSteer=0,touchDrift=false,last=performance.now(),fps=60,fpsFrames=0,fpsStamp=last;
const clock=new THREE.Clock();

const menu=document.querySelector('#menu')!,hud=document.querySelector('#hud')!,touch=document.querySelector('#touch')!,results=document.querySelector('#results')!;
const speedEl=document.querySelector('#speed')!,scoreEl=document.querySelector('#score')!,multiEl=document.querySelector('#multi')!,routeCall=document.querySelector('#route-call')!,eventEl=document.querySelector('#event')!;
const worldEl=document.querySelector('#world')!;
const positionEl=document.querySelector('#race-position')!;
const WORLDS=[{name:'01 // NEON DISTRICT',bg:0x05070b,fog:0x07111a},{name:'02 // REDLINE CANYON',bg:0x140807,fog:0x37140d},{name:'03 // SKYLINE',bg:0x527a96,fog:0x9bc8dc},{name:'04 // ORBITAL',bg:0x03020a,fog:0x120a2b}];
const isTouch=matchMedia('(pointer:coarse)').matches; if(isTouch)document.documentElement.classList.add('touchy');

function reset(nextMode=mode){
  mode=nextMode;if(mode==='run'){raceIndex=0;playerPoints=0;rivals.forEach(r=>r.points=0);}countdown=mode==='championship'?3.25:0;
  playing=true;over=false;paused=false;route='UNDECIDED';routeAwarded=false;speed=5;lateralVel=0;score=0;multiplier=1;distance=4;fall=0;constructionCount=0;
  car.visible=true;car.position.set(0,1.68,4);car.rotation.set(0,0,0);
  rivals.forEach((r,i)=>{r.car.visible=mode==='championship';r.car.position.set(r.lane,1.68,-4-i*5);r.car.rotation.set(0,0,0);});positionEl.classList.toggle('hidden',mode!=='championship');
  modules.forEach(m=>{m.assembled=0;m.group.children.forEach((c,i)=>{c.position.copy(m.finalPositions[i]).add(m.startOffsets[i]);c.rotation.x=c.userData.assemblyGround?(i%2?-.08:.08):0;c.rotation.z=m.finalRotations[i]+(i%2?1:-1)*(c.userData.assemblyGround?.22:.52);});});
  menu.classList.add('hidden');results.classList.add('hidden');hud.classList.add('live');touch.classList.add('live');
  startAudio();
}
function mainMenu(){playing=false;over=false;results.classList.add('hidden');hud.classList.remove('live');touch.classList.remove('live');menu.classList.remove('hidden');}
function showResults(title:string,copy:string){over=true;playing=false;document.querySelector('#result-title')!.textContent=title;document.querySelector('#result-score')!.textContent=mode==='run'?Math.floor(score).toString().padStart(6,'0'):`${lastPosition} / 4`;document.querySelector('#result-copy')!.textContent=copy;setTimeout(()=>{hud.classList.remove('live');touch.classList.remove('live');results.classList.remove('hidden');},650);}
function endRun(title='RUN TERMINATED'){if(over)return;showResults(title,`DISTANCE ${Math.floor(distance)} M // ${route}`);}
function endRace(){if(over)return;const order=[{name:'YOU',z:distance},...rivals.map(r=>({name:r.name,z:r.car.position.z}))].sort((a,b)=>b.z-a.z);lastPosition=order.findIndex(x=>x.name==='YOU')+1;const awards=[10,7,5,3];playerPoints+=awards[lastPosition-1];order.filter(x=>x.name!=='YOU').forEach((x,i)=>{const r=rivals.find(q=>q.name===x.name)!;r.points+=awards[i+(i>=lastPosition-1?1:0)]||3;});const final=raceIndex===3;document.querySelector('#again')!.textContent=final?'NEW CHAMPIONSHIP':'NEXT RACE';showResults(final?(playerPoints>=Math.max(...rivals.map(r=>r.points))?'CHAMPION // ROAD OWNED':'CHAMPIONSHIP COMPLETE'):`RACE ${raceIndex+1} COMPLETE`,`+${awards[lastPosition-1]} PTS // TOTAL ${playerPoints} // ${WORLDS[raceIndex].name}`);if(!final)raceIndex++;}

document.querySelector('#startb')!.addEventListener('click',()=>reset('run'));document.querySelector('#again')!.addEventListener('click',()=>{if(mode==='championship'&&raceIndex===3){raceIndex=0;playerPoints=0;rivals.forEach(r=>r.points=0);}reset(mode);});document.querySelector('#main')!.addEventListener('click',mainMenu);
document.querySelector('#how')!.addEventListener('click',()=>document.querySelector('#modal')!.classList.remove('hidden'));document.querySelector('#close')!.addEventListener('click',()=>document.querySelector('#modal')!.classList.add('hidden'));
document.querySelector('#champ')!.addEventListener('click',()=>reset('championship'));
addEventListener('keydown',e=>{keys.add(e.code);if(e.code==='Escape'&&playing)paused=!paused;e.preventDefault();});addEventListener('keyup',e=>keys.delete(e.code));

const stick=document.querySelector<HTMLElement>('#stick')!,knob=document.querySelector<HTMLElement>('#knob')!;
function moveStick(e:PointerEvent){const r=stick.getBoundingClientRect(),v=(e.clientX-(r.left+r.width/2))/(r.width*.38);touchSteer=THREE.MathUtils.clamp(v,-1,1);knob.style.transform=`translateX(${touchSteer*34}px)`;}
stick.addEventListener('pointerdown',e=>{stick.setPointerCapture(e.pointerId);moveStick(e);});stick.addEventListener('pointermove',e=>{if(stick.hasPointerCapture(e.pointerId))moveStick(e);});stick.addEventListener('pointerup',()=>{touchSteer=0;knob.style.transform='';});
const driftButton=document.querySelector<HTMLElement>('#drift')!;driftButton.addEventListener('pointerdown',e=>{driftButton.setPointerCapture(e.pointerId);touchDrift=true;});driftButton.addEventListener('pointerup',()=>touchDrift=false);

let audio:AudioContext|null=null,engine:OscillatorNode|null=null,engineGain:GainNode|null=null,muted=false;
function startAudio(){if(!audio){audio=new AudioContext();engine=audio.createOscillator();engineGain=audio.createGain();engine.type='sawtooth';engineGain.gain.value=.018;engine.connect(engineGain).connect(audio.destination);engine.start();}audio.resume();}
document.querySelector('#audio')!.addEventListener('click',()=>{muted=!muted;if(engineGain)engineGain.gain.value=muted?0:.018;document.querySelector('#audio')!.textContent=`AUDIO // ${muted?'OFF':'ON'}`;});

function roadInfo(z:number){
  if(z<184||z>372)return[{x:0,half:TUNE.roadHalf}];
  return[{x:-4.3,half:TUNE.safeHalf},{x:4.3,half:TUNE.redHalf}];
}
function onRoad(x:number,z:number){return roadInfo(z).some(r=>Math.abs(x-r.x)<=r.half);}
function smooth(t:number){return t*t*(3-2*t);}
function update(dt:number){
  if(!playing||paused)return;
  if(countdown>0){countdown-=dt;speed=0;eventEl.textContent=countdown>.25?String(Math.ceil(countdown)):'DRIVE';eventEl.classList.add('show');if(countdown<=0)eventEl.classList.remove('show');return;}
  const drift=keys.has('Space')||touchDrift;const steer=(keys.has('ArrowLeft')||keys.has('KeyA')?-1:0)+(keys.has('ArrowRight')||keys.has('KeyD')?1:0)+touchSteer;
  speed=Math.min(TUNE.maxSpeed,speed+TUNE.acceleration*dt);const target=steer*(drift?TUNE.driftSteer:TUNE.steer)*(speed/TUNE.maxSpeed+.25);lateralVel=THREE.MathUtils.damp(lateralVel,target,drift?TUNE.driftGrip:TUNE.grip,dt);
  car.position.x+=lateralVel*dt;distance+=speed*dt;car.position.z=distance;car.rotation.y=THREE.MathUtils.damp(car.rotation.y,-lateralVel*.025,6,dt);car.rotation.z=THREE.MathUtils.damp(car.rotation.z,-steer*.08,7,dt);
  if(distance>170&&distance<212)routeCall.classList.add('show');else routeCall.classList.remove('show');
  if(distance>=212&&route==='UNDECIDED'){route=car.position.x>=0?'REDLINE':'SAFE';multiplier=route==='REDLINE'?2:1.2;eventEl.textContent=route==='REDLINE'?'REDLINE COMMITTED // ×2':'SAFE LINE // ×1.2';eventEl.classList.add('show');setTimeout(()=>eventEl.classList.remove('show'),1100);}
  if(distance>355&&!routeAwarded&&route!=='UNDECIDED'){routeAwarded=true;score+=route==='REDLINE'?5000:1600;eventEl.textContent=route==='REDLINE'?'REDLINE CLEARED +5000':'SAFE ROUTE CLEARED';eventEl.classList.add('show');setTimeout(()=>eventEl.classList.remove('show'),1200);}
  if(!onRoad(car.position.x,distance)){fall+=dt;speed*=Math.pow(.93,dt*60);car.position.y-=12*dt*fall;car.rotation.z+=dt*2.2;if(fall>TUNE.fallTime)endRun();}else{fall=0;car.position.y=THREE.MathUtils.damp(car.position.y,1.68,12,dt);}
  score+=speed*dt*multiplier*(drift&&Math.abs(steer)>.1?1.7:1);if(drift&&Math.abs(steer)>.1)multiplier=Math.min(route==='REDLINE'?4:3,multiplier+dt*.35);
  if(mode==='championship'){rivals.forEach((r,i)=>{const bend=r.car.position.z>184&&r.car.position.z<372?(r.redline?4.3:-4.3):r.lane;r.car.position.x=THREE.MathUtils.damp(r.car.position.x,bend,2.2,dt);r.car.position.z+=r.pace*dt*(1+Math.sin(r.car.position.z*.02+i)*.018);});lastPosition=1+rivals.filter(r=>r.car.position.z>distance).length;positionEl.querySelector('b')!.textContent=`${lastPosition} / 4`;}
  if(distance>=660){if(mode==='championship')endRace();else{score+=10000;eventEl.textContent='ROAD//ZERO COMPLETE';eventEl.classList.add('show');endRun('RUN COMPLETE // FOUR WORLDS');}return;}
  const worldIndex=mode==='championship'?raceIndex:Math.min(3,Math.floor(distance/168)),world=WORLDS[worldIndex];worldEl.textContent=world.name;(scene.background as THREE.Color).lerp(new THREE.Color(world.bg),1-Math.exp(-dt*1.2));scene.fog!.color.lerp(new THREE.Color(world.fog),1-Math.exp(-dt*1.2));
  pylons.forEach((p,i)=>{if(worldIndex===3)p.rotation.y+=dt*(i%2?-.08:.08);});
  for(const m of modules){
    const ahead=m.z-distance;const desired=THREE.MathUtils.clamp(1-(ahead-22)/40,0,1);const before=m.assembled;m.assembled=Math.max(m.assembled,desired);
    const p=smooth(m.assembled);m.group.children.forEach((c,i)=>{const off=m.startOffsets[i];c.position.copy(m.finalPositions[i]).addScaledVector(off,1-p);c.rotation.x=c.userData.assemblyGround?(i%2?-.08:.08)*(1-p):0;c.rotation.z=m.finalRotations[i]+(i%2?1:-1)*(c.userData.assemblyGround?.22:.52)*(1-p);if(c instanceof THREE.Mesh&&c.material instanceof THREE.MeshStandardMaterial&&c.material.name==='ground'){c.material.emissive.setHex(0x087080);c.material.emissiveIntensity=(1-p)*1.15;}});
    if(before<1&&m.assembled>=1){constructionCount++;eventEl.textContent='ROAD LINKED';eventEl.classList.add('show');setTimeout(()=>eventEl.classList.remove('show'),500);}
  }
  const camTarget=new THREE.Vector3(car.position.x*.9,car.position.y+TUNE.cameraHeight,car.position.z-TUNE.cameraDistance);
  camera.position.lerp(camTarget,1-Math.exp(-dt*5.5));camera.lookAt(car.position.x*.78,car.position.y+.34,car.position.z+TUNE.lookAhead);camera.fov=THREE.MathUtils.damp(camera.fov,50+(speed/TUNE.maxSpeed)*11,4,dt);camera.updateProjectionMatrix();
  speedEl.textContent=Math.round(speed*6.4).toString().padStart(3,'0');scoreEl.textContent=Math.floor(score).toString().padStart(6,'0');multiEl.textContent=`X${multiplier.toFixed(1)}`;
  if(engine&&engineGain&&!muted){engine.frequency.setTargetAtTime(48+speed*3,audio!.currentTime,.05);engineGain.gain.setTargetAtTime(.012+speed/TUNE.maxSpeed*.026,audio!.currentTime,.08);}
}

function frame(now:number){requestAnimationFrame(frame);const realDt=Math.min((now-last)/1000,.05);last=now;update(realDt);renderer.render(scene,camera);fpsFrames++;if(now-fpsStamp>500){fps=fpsFrames*1000/(now-fpsStamp);fpsFrames=0;fpsStamp=now;}
  const assembling=modules.filter(m=>m.z>distance&&m.assembled>0&&m.assembled<1).sort((a,b)=>a.z-b.z)[0];
  window.__GAME__={pos:[car.position.x,car.position.z],fps,speed,score,over,draws:renderer.info.render.calls,tris:renderer.info.render.triangles,progress:Math.min(distance/672,1),drift:(keys.has('Space')||touchDrift)?1:0,route,construction:constructionCount,modules:modules.length,heading:0,position:lastPosition,aiProgress:rivals.map(r=>r.car.position.z/660),mode,assemblyProgress:assembling?.assembled??0};
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);});
window.__READY__=true;window.__START__=reset;window.__GAME__={pos:[0,4],fps:0,speed:0,score:0,over:false,draws:0,tris:0,progress:0,drift:0,route:'MENU',construction:0,modules:modules.length,heading:0};
camera.position.set(5,4,-6);camera.lookAt(0,.8,12);frame(performance.now());
