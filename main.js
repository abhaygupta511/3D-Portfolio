import * as THREE from 'three';

const toggle=document.getElementById('menuToggle');
const nav=document.getElementById('nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));

const revealTargets=document.querySelectorAll('.section-head,.work-intro,.work-card,.about-grid,.skill-row,.contact-bottom');
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
 revealTargets.forEach(el=>el.classList.add('reveal')||observer.observe(el));
 revealTargets.forEach(el=>observer.observe(el));
}

const canvas=document.getElementById('scene');
if(canvas){
 const scene=new THREE.Scene();
 scene.background=new THREE.Color('#080b10');
 scene.fog=new THREE.FogExp2('#080b10',.055);
 const camera=new THREE.PerspectiveCamera(36,1,.1,100);
 camera.position.set(0,1.8,9.2);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.15;
 scene.add(new THREE.HemisphereLight(0x9cbdd6,0x17121a,2.2));
 const key=new THREE.DirectionalLight(0xffdca0,3.2);key.position.set(4,6,5);scene.add(key);
 const rim=new THREE.PointLight(0x5086bd,22,14);rim.position.set(-3,2,1);scene.add(rim);
 const goldLight=new THREE.PointLight(0xd9b66b,14,10);goldLight.position.set(2,-1,2);scene.add(goldLight);
 const mat=(color,metalness=0,roughness=.45)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const navy=mat('#1b2b3b',.45,.32),blue=mat('#587f9b',.25,.3),gold=mat('#d9b66b',.72,.23),dark=mat('#111923',.25,.5),skin=mat('#bd967b',.05,.45),white=mat('#eee7d7',.1,.3);
 const person=new THREE.Group();person.position.set(.35,-1.35,0);scene.add(person);
 const sphere=(parent,material,pos,scale)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,28,20),material);m.position.set(...pos);m.scale.set(...scale);parent.add(m);return m;};
 const cylinder=(parent,material,r1,r2,h,pos)=>{const m=new THREE.Mesh(new THREE.CapsuleGeometry(r1,h,5,12),material);m.position.set(...pos);parent.add(m);return m;};
 // Stylised designer figure built from animated 3D primitives.
 const torso=sphere(person,navy,[0,1.35,0],[.48,.68,.28]);torso.rotation.z=-.08;
 sphere(person,blue,[0,1.55,.245],[.32,.34,.09]);
 sphere(person,skin,[0,2.22,.015],[.31,.36,.29]);
 const hair=sphere(person,dark,[0,2.47,-.035],[.33,.22,.3]);
 for(let i=0;i<7;i++){const curl=sphere(person,dark,[-.25+i*.083,2.59+Math.sin(i*1.4)*.035,.02],[.09,.1,.09]);}
 // collar and small gold pendant
 const collar=new THREE.Mesh(new THREE.TorusGeometry(.25,.035,8,36),gold);collar.position.set(0,1.93,.18);collar.rotation.x=Math.PI/2;person.add(collar);
 sphere(person,gold,[0,1.78,.32],[.055,.08,.035]);
 // upper/lower limbs pivot from shoulders and hips to create a continuous walk cycle
 function limb(parent,material,length,radius){const pivot=new THREE.Group();parent.add(pivot);const bone=new THREE.Mesh(new THREE.CapsuleGeometry(radius,length*.46,5,12),material);bone.position.y=-length*.43;pivot.add(bone);return pivot;}
 const arms=[],legs=[];
 for(const side of [-1,1]){
  const arm=limb(person,navy,.57,.105);arm.position.set(side*.48,1.78,0);arms.push(arm);
  const hand=sphere(arm,skin,[0,-.58,.015],[.095,.12,.09]);
  const leg=limb(person,blue,.72,.14);leg.position.set(side*.22,.9,0);legs.push(leg);
  const foot=sphere(leg,dark,[0,-.75,.1],[.15,.09,.28]);
  // thin gold cuff
  const cuff=new THREE.Mesh(new THREE.TorusGeometry(.108,.022,7,24),gold);cuff.position.y=-.26; cuff.rotation.x=Math.PI/2;arm.add(cuff);
 }
 // floating orbital rings and decorative geometry
 const orbitGroup=new THREE.Group();orbitGroup.position.set(.25,1.05,-.6);scene.add(orbitGroup);
 const ring1=new THREE.Mesh(new THREE.TorusGeometry(1.52,.012,8,120),gold);ring1.rotation.set(.9,.1,-.35);orbitGroup.add(ring1);
 const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.78,.008,8,120),blue);ring2.rotation.set(1.1,.7,.4);orbitGroup.add(ring2);
 const ring3=new THREE.Mesh(new THREE.TorusGeometry(1.25,.009,8,120),white);ring3.rotation.set(.3,1.2,.1);orbitGroup.add(ring3);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,80),new THREE.MeshBasicMaterial({color:'#0c121b'}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.42;scene.add(floor);
 for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4+i*.34,.006,5,100),new THREE.MeshBasicMaterial({color:i%2?'#34516a':'#7f6a43',transparent:true,opacity:.48-i*.06}));ring.rotation.x=-Math.PI/2;ring.position.y=-1.405+i*.002;ring.scale.set(1,.62,1);scene.add(ring);}
 const particles=new THREE.Group();scene.add(particles);
 for(let i=0;i<48;i++){const g=new THREE.Mesh(new THREE.SphereGeometry(.012+(i%4)*.004,8,8),i%3?gold:white);g.position.set((Math.random()-.5)*5,(Math.random()*4)-1.2,(Math.random()-.5)*2.4-1);particles.add(g);}
 let pointerX=0,pointerY=0,targetX=0,targetY=0;
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*.5;targetY=((e.clientY-r.top)/r.height-.5)*.28;});
 canvas.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});
 const resize=()=>{const r=canvas.getBoundingClientRect();const w=Math.max(1,r.width),h=Math.max(1,r.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
 new ResizeObserver(resize).observe(canvas);resize();
 const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();pointerX+=(targetX-pointerX)*.035;pointerY+=(targetY-pointerY)*.035;
  person.position.y=-1.35+Math.abs(Math.sin(t*3.2))*.045;
  arms[0].rotation.x=Math.sin(t*3.2)*.5;arms[1].rotation.x=-Math.sin(t*3.2)*.5;
  arms[0].rotation.z=.1+Math.sin(t*3.2)*.08;arms[1].rotation.z=-.1-Math.sin(t*3.2)*.08;
  legs[0].rotation.x=-Math.sin(t*3.2)*.48;legs[1].rotation.x=Math.sin(t*3.2)*.48;
  person.rotation.y=Math.sin(t*.65)*.09+pointerX;
  orbitGroup.rotation.y=t*.12;orbitGroup.rotation.z=Math.sin(t*.4)*.08;
  particles.rotation.y=t*.025;
  camera.position.x=pointerX*.9;camera.position.y=1.8-pointerY*.55;camera.lookAt(0,.85,0);
  renderer.render(scene,camera);
 }
 animate();
}
