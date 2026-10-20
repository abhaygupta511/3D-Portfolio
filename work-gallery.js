const grid=document.getElementById('archiveGrid');
const status=document.getElementById('status');
const search=document.getElementById('search');
const filters=[...document.querySelectorAll('[data-filter]')];
let items=[],active='All';
const fallback=[
 {title:'Campaign & Mailer Collection',category:'Mailer',type:'collection',tone:'mailer',description:'Digital campaigns, mailers and social communication.'},
 {title:'Print & OOH Collection',category:'Print Work',type:'collection',tone:'print',description:'Print collateral and out-of-home design work.'},
 {title:'Event & Cue Card Collection',category:'Cue Card',type:'collection',tone:'cue',description:'Event communication, cue cards and supporting collateral.'},
 {title:'Presentation Design Collection',category:'PPT',type:'collection',tone:'deck',description:'PowerPoint decks, storytelling and information design.'},
 {title:'Motion & Video Collection',category:'Motion Graphics',type:'collection',tone:'motion',description:'Motion graphics, animated campaigns and brand films.'}
];
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const q=(search?.value||'').trim().toLowerCase();
 const shown=items.filter(x=>(active==='All'||x.category===active)&&((x.title||'').toLowerCase().includes(q)||(x.category||'').toLowerCase().includes(q)));
 grid.innerHTML='';
 shown.forEach(item=>{
  const card=document.createElement('article');card.className='archive-card';
  if(item.type==='collection'){
   card.innerHTML='<div class="archive-art '+esc(item.tone)+'"><span>ABHAY GUPTA / '+esc(item.category).toUpperCase()+'</span><b>'+esc(item.title)+'</b><i>↗</i></div><b>'+esc(item.title)+'</b><small>'+esc(item.category)+'</small>';
  }else{
   const preview=item.poster||item.file;
   card.innerHTML=(item.type==='document'?'<div class="cover"><b>'+esc(item.title)+'</b><small>PDF presentation</small></div>':'<img loading="lazy" src="'+esc(preview)+'" alt="'+esc(item.title)+'">')+'<b>'+esc(item.title)+'</b><small>'+esc(item.category)+'</small>';
  }
  card.addEventListener('click',()=>openItem(item));grid.appendChild(card);
 });
 status.textContent=shown.length?'SHOWING '+shown.length+' OF '+items.length+' PROJECTS':'NO MATCHES — TRY ANOTHER SEARCH OR CATEGORY';
}
function openItem(x){
 const box=document.getElementById('lightbox'),img=document.getElementById('lightboxImage'),vid=document.getElementById('lightboxVideo'),doc=document.getElementById('lightboxDocument');
 img.style.display=vid.style.display=doc.style.display='none';vid.pause();
 if(x.type==='collection'){
  document.getElementById('lightboxCaption').textContent=x.title+' — '+x.description+' Upload the matching project assets to display individual pieces here.';
 }else{
  if(x.type==='video'){vid.src=x.file;vid.style.display='block';vid.play().catch(()=>{});}
  else if(x.type==='document'){doc.src=x.file;doc.style.display='block';}
  else{img.src=x.file;img.style.display='block';}
  document.getElementById('lightboxCaption').textContent=x.title;
 }
 box.classList.add('open');
}
document.getElementById('lightboxClose').onclick=()=>{document.getElementById('lightbox').classList.remove('open');const v=document.getElementById('lightboxVideo');v.pause();v.removeAttribute('src');document.getElementById('lightboxDocument').removeAttribute('src');};
document.getElementById('lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox'){document.getElementById('lightboxClose').click();}});
filters.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));render();}));
search?.addEventListener('input',render);
fetch('work-data.json').then(r=>{if(!r.ok)throw Error('index unavailable');return r.json();}).then(d=>{items=Array.isArray(d)&&d.length?d:fallback;render();}).catch(()=>{items=fallback;render();});
