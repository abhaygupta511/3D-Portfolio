const grid=document.getElementById('archiveGrid');
const statusLine=document.getElementById('status');
const search=document.getElementById('search');
const filters=[...document.querySelectorAll('.filter')];
const lightbox=document.getElementById('lightbox');
const lightboxImage=document.getElementById('lightboxImage');
const lightboxCaption=document.getElementById('lightboxCaption');
const lightboxVideo=document.getElementById('lightboxVideo');
let items=[],activeFilter='All';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function niceCategory(c){return c==='Print Work'?'Print & OOH':c==='PPT'?'Presentation':c==='Cue Card'?'Cue card':c==='Motion Graphics'?'Motion & Video':'Mailer / Campaign'}
function render(){
 const q=search.value.trim().toLowerCase();
 const filtered=items.filter(x=>(activeFilter==='All'||x.category===activeFilter)&&(!q||(x.title+' '+x.category+' '+(x.format||'')).toLowerCase().includes(q)));
 grid.innerHTML='';
 if(!filtered.length){grid.innerHTML='<div class="empty-state">No projects found. Try another search or category.</div>';} else {
  const frag=document.createDocumentFragment();
  filtered.forEach((item,i)=>{
   const card=document.createElement('article');card.className='archive-card';card.style.animationDelay=Math.min(i%12,10)*25+'ms';
   let thumb='';
   if(item.type==='image') thumb=`<div class="archive-thumb"><img loading="lazy" src="${esc(item.file)}" alt="${esc(item.title)}" /></div>`;
   else if(item.type==='video') thumb=`<div class="archive-thumb video-thumb"><img loading="lazy" src="${esc(item.poster)}" alt="Video preview: ${esc(item.title)}" /><span class="play-badge" aria-label="Play video">▶</span><span class="video-tag">MOTION / MP4</span></div>`;
   else thumb=`<div class="archive-thumb book-stage"><div class="book-cover"><div class="book-spine"></div><div class="book-topline">${esc(item.format)} · ${esc(niceCategory(item.category)).toUpperCase()}</div><div class="book-orbit"></div><div class="book-cover-title">${esc(item.title)}</div><div class="book-cover-bottom"><span>ABHAY GUPTA</span><span>DESIGN ARCHIVE</span></div><div class="book-pages"></div></div><span class="book-open-hint">DOCUMENT / ${esc(item.format)}</span></div>`;
   card.innerHTML=`${thumb}<div class="archive-meta"><div><div class="archive-title">${esc(item.title)}</div><div class="archive-category">${esc(niceCategory(item.category))}${item.type==='document'?' · '+esc(item.format):''}</div></div><span class="archive-index">${String(items.indexOf(item)+1).padStart(2,'0')}</span></div>`;
   if(item.type==='image') card.addEventListener('click',()=>{lightboxVideo.pause();lightboxVideo.removeAttribute('src');lightboxVideo.style.display='none';lightboxImage.style.display='block';lightboxImage.src=item.file;lightboxImage.alt=item.title;lightboxCaption.textContent=item.title+' — '+niceCategory(item.category);lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'});
   if(item.type==='video') card.addEventListener('click',()=>{lightboxImage.style.display='none';lightboxVideo.style.display='block';lightboxVideo.src=item.file;lightboxVideo.load();lightboxCaption.textContent=item.title+' — Motion & Video';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lightboxVideo.play().catch(()=>{})});
   if(item.type==='document') card.addEventListener('click',()=>{lightboxVideo.pause();lightboxVideo.removeAttribute('src');lightboxVideo.style.display='none';lightboxImage.style.display='none';lightboxCaption.textContent=item.title+' — '+item.format+' · '+niceCategory(item.category)+' · Document preview is not uploaded yet.';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'});
   frag.appendChild(card);
  });grid.appendChild(frag);
 }
 statusLine.textContent=`SHOWING ${filtered.length} OF ${items.length} ARCHIVE ITEMS`;
}
fetch('work-data.json').then(r=>{if(!r.ok)throw new Error('Could not load archive');return r.json()}).then(data=>{
 items=data;document.getElementById('allCount').textContent=items.length;const params=new URLSearchParams(location.search);const requested=params.get('category');if(items.some(x=>x.category===requested))activeFilter=requested;
 filters.forEach(b=>b.classList.toggle('active',b.dataset.filter===activeFilter));render();
}).catch(()=>{statusLine.textContent='The archive could not load. Please open this portfolio through a local server or the published website.'});
filters.forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));render()}));search.addEventListener('input',render);
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxVideo.pause();lightboxVideo.removeAttribute('src');lightboxVideo.load();document.body.style.overflow=''}
document.getElementById('lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
