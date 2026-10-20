import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas=document.querySelector('#world');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x07111f,.022);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,180);
camera.position.set(0,4,13);
const hemi=new THREE.HemisphereLight(0xa9d8ff,0x101321,2.0);scene.add(hemi);
const key=new THREE.DirectionalLight(0xffe4b4,3.2);key.position.set(4,10,5);scene.add(key);
const blue=new THREE.PointLight(0x2a9cff,22,30);blue.position.set(-4,3,-5);scene.add(blue);
const gold=new THREE.PointLight(0xffba55,18,25);gold.position.set(5,3,-18);scene.add(gold);
const world=new THREE.Group();scene.add(world);
const mat=(color,metalness=0,roughness=.65,emissive=0x000000,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity});
const navy=mat(0x101f32,.6,.3), dark=mat(0x0a1524,.25,.5), glass=mat(0x183a55,.5,.2,0x0a4d77,.5), lit=mat(0x63c8ff,.2,.35,0x43aaff,2), goldmat=mat(0xd7a950,.55,.3,0x8d5b19,.4), floorMat=mat(0x0b1727,.25,.55);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(180,180),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.03;world.add(floor);
const grid=new THREE.GridHelper(150,90,0x235072,0x142a40);grid.position.y=.005;grid.material.transparent=true;grid.material.opacity=.34;world.add(grid);
// glowing route through the city
function line(points,color,opacity=.8){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const m=new THREE.LineBasicMaterial({color,transparent:true,opacity});const l=new THREE.Line(g,m);world.add(l);return l}
line([[-1,.03,8],[-1,.03,3],[-.4,.03,-2],[.7,.03,-8],[.2,.03,-15],[1,.03,-25],[0,.03,-36]],0x2c9cff,.7);
line([[1,.035,8],[1,.035,3],[.6,.035,-2],[1,.035,-8],[.3,.035,-15],[1.2,.035,-25],[.2,.035,-36]],0xd8a64c,.5);
// city architecture: repeated clusters with intentional blue/gold accents
let seed=44;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
for(let i=0;i<110;i++){
 const z=6-rnd()*70, side=rnd()>.5?1:-1, x=side*(5+rnd()*17), w=1.1+rnd()*3.2, h=2.8+rnd()*13, d=1.4+rnd()*3.5;
 const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),rnd()>.6?navy:dark);b.position.set(x,h/2-.02,z);world.add(b);
 // glass front facing the camera corridor
 const face=new THREE.Mesh(new THREE.BoxGeometry(w*.84,h*.86,.035),glass);face.position.set(x,h/2,z+(side===1?d/2+.025:-d/2-.025));world.add(face);
 // window bands
 for(let y=1;y<h-0.2;y+=1.15){
   if(rnd()>.26){const win=new THREE.Mesh(new THREE.BoxGeometry(w*.67,.045,.05),rnd()>.65?goldmat:lit);win.position.set(x,y,z+(side===1?d/2+.055:-d/2-.055));world.add(win)}
 }
 // rooftop light
 if(i%4===0){const cap=new THREE.Mesh(new THREE.BoxGeometry(w*.45,.08,d*.45),goldmat);cap.position.set(x,h,z);world.add(cap)}
}
// floating ring gateways along the route
for(let i=0;i<5;i++){
 const z=-4-i*8, ring=new THREE.Mesh(new THREE.TorusGeometry(2.5,.035,8,100),i%2?goldmat:lit);
 ring.position.set(0,2.2,z);ring.rotation.y=.15;world.add(ring);
 const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.18,.012,6,90),mat(0x6eb9e8,.3,.3,0x397eb0,1.2));ring2.position.set(0,2.2,z-.08);world.add(ring2);
}
// floating particles
const particleN=650, positions=new Float32Array(particleN*3);
for(let i=0;i<particleN;i++){positions[i*3]=(rnd()-.5)*48;positions[i*3+1]=rnd()*17;positions[i*3+2]=6-rnd()*80}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(positions,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9bdcff,size:.035,transparent:true,opacity:.65}));world.add(pts);
// character: load animated sample GLB; if unavailable, show a stylised procedural character
const character=new THREE.Group();character.position.set(-.65,0,4.2);world.add(character);
let mixer=null, avatar=null;
const loader=new GLTFLoader();
loader.load('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',g=>{
 avatar=g.scene;avatar.scale.setScalar(.68);avatar.position.y=0;avatar.rotation.y=Math.PI;character.add(avatar);
 mixer=new THREE.AnimationMixer(avatar);
 const walk=g.animations.find(a=>a.name.toLowerCase().includes('walking'))||g.animations[0];if(walk)mixer.clipAction(walk).play();
},undefined,()=>{ // local stylised stand-in when external model cannot load
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.75,5,10),mat(0xdde7ed,.5,.32));body.position.y=1.05;character.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.3,18,16),mat(0x8bcdf0,.3,.35));head.position.y=1.83;character.add(head);
 const visor=new THREE.Mesh(new THREE.BoxGeometry(.42,.13,.08),mat(0x101c2a,.6,.2,0x49baff,1));visor.position.set(0,1.85,.27);character.add(visor);
 for(let s of [-1,1]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.11,.55,4,8),mat(0x7896ac,.4,.4));leg.position.set(s*.18,.38,0);character.add(leg);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.09,.5,4,8),mat(0x9eb8c8,.4,.4));arm.position.set(s*.43,1.12,0);arm.rotation.z=s*.25;character.add(arm)}
 const pack=new THREE.Mesh(new THREE.BoxGeometry(.48,.48,.2),goldmat);pack.position.set(0,1.15,-.25);character.add(pack);
});
// Camera follows page scroll across a 3D journey
const cameraStops=[
 {p:[0,4.1,13],look:[0,2,-2]},
 {p:[0.2,3.4,2],look:[0,2,-9]},
 {p:[-.4,3.2,-9],look:[0,2,-18]},
 {p:[.4,3.5,-22],look:[0,2,-30]},
 {p:[0,4,-34],look:[0,2,-42]}
];
let scrollP=0,targetP=0,mouseX=0,mouseY=0;
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;targetP=max>0?scrollY/max:0;});
window.addEventListener('pointermove',e=>{mouseX=(e.clientX/innerWidth-.5);mouseY=(e.clientY/innerHeight-.5)});
const v=(a)=>new THREE.Vector3(...a);
function smooth(a,b,t){return a+(b-a)*t}
function cameraAt(t){
 const f=t*(cameraStops.length-1),i=Math.min(Math.floor(f),cameraStops.length-2),u=f-i,a=cameraStops[i],b=cameraStops[i+1];
 const ease=u*u*(3-2*u);
 camera.position.set(smooth(a.p[0],b.p[0],ease)+mouseX*.28,smooth(a.p[1],b.p[1],ease)-mouseY*.18,smooth(a.p[2],b.p[2],ease));
 const look=v(a.look).lerp(v(b.look),ease);camera.lookAt(look);
}
const menu=document.querySelector('#menuToggle'),nav=document.querySelector('#navPanel');
menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const hud=document.querySelector('#hudProgress'),num=document.querySelector('#hudNumber');
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);scrollP+=(targetP-scrollP)*.06;cameraAt(scrollP);
 if(mixer)mixer.update(dt);
 // subtle forward walk as the camera passes the avatar, while keeping the figure in the scene
 if(avatar){avatar.position.z=0;avatar.position.x=Math.sin(clock.elapsedTime*.65)*.045}
 pts.rotation.y=clock.elapsedTime*.003;
 world.children.forEach(o=>{if(o.geometry&&o.geometry.type==='TorusGeometry')o.rotation.z=Math.sin(clock.elapsedTime*.35+o.position.z)*.035});
 renderer.render(scene,camera);
 hud.style.width=`${Math.max(8,scrollP*100)}%`;num.textContent=`${String(Math.min(5,Math.floor(scrollP*4)+1)).padStart(2,'0')} / 05`;
}
animate();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
window.addEventListener('load',()=>setTimeout(()=>document.querySelector('#loader').classList.add('done'),750));
