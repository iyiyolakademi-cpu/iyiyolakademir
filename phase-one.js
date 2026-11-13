/* İyi Yol Akademi | Paket 01: mevcut sistemlere zarar vermeyen geliştirmeler. */
(function(){
'use strict';
const page=document.body.dataset.page||'';
const KEYS={
 saved:'iya_saved_articles_v1',
 history:'iya_reading_history_v1',
 favorites:'iyi-yol-akademi-recipes-favorites-v1',
 collections:'iya_saved_collections_v1',
 progress:'iya_reading_progress_v1',
 searches:'iya_search_history_v1'
};
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const el=(name,cls,text)=>{
 const node=document.createElement(name);if(cls)node.className=cls;
 if(text!==undefined)node.textContent=String(text);return node;
};
const validSlug=s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(s||''));
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v===null?fallback:v;}catch(_){return fallback;}};
const save=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));return true;}catch(_){toast('Bu cihazda kayıt yapılamıyor.');return false;}};
const arr=key=>{const v=read(key,[]);return Array.isArray(v)?v:[];};
const fmt=n=>new Intl.NumberFormat('tr-TR').format(n);
let toastTimer;
function toast(message){
 let t=$('#phaseToast');if(!t){t=el('div','phase-toast');t.id='phaseToast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.append(t);}
 t.textContent=message;t.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('is-visible'),2600);
}
function getSlug(href){
 try{const u=new URL(href,location.href);return u.pathname.endsWith('/post.html')?u.searchParams.get('slug'):null;}catch(_){return null;}
}
function isSaved(slug){return arr(KEYS.saved).some(x=>x&&x.slug===slug);}
function toggleBookmark(slug,title,category){
 if(!validSlug(slug))return;
 const items=arr(KEYS.saved).filter(x=>x&&validSlug(x.slug));
 const existed=items.some(x=>x.slug===slug);
 const next=existed?items.filter(x=>x.slug!==slug):[{slug,title,category,date:Date.now()},...items].slice(0,200);
 if(save(KEYS.saved,next)){
  syncBookmarks();
  toast(existed?'Yazı kaydedilenlerden çıkarıldı.':'Yazı kaydedildi.');
  document.dispatchEvent(new CustomEvent('iya:bookmark-change'));
 }
}
function syncBookmarks(){
 $$('.phase-bookmark').forEach(btn=>{
  const active=isSaved(btn.dataset.slug);
  btn.setAttribute('aria-pressed',String(active));
  btn.textContent=active?'✓ Kaydedildi':'＋ Kaydet';
  btn.setAttribute('aria-label',active?'Yazıyı kaydedilenlerden çıkar':'Yazıyı kaydet');
 });
 const count=$('#phaseSavedCount');if(count)count.textContent=fmt(arr(KEYS.saved).length);
}
function decoratePostCards(root){
 if(!root)return;
 $$('.post-card',root).forEach(card=>{
  if($('.phase-bookmark',card))return;
  const titleLink=$('.post-content h3 a',card)||$('h3 a',card);
  if(!titleLink)return;
  const slug=getSlug(titleLink.href);if(!validSlug(slug))return;
  const holder=el('div','phase-bookmark-slot');
  const button=el('button','phase-bookmark');
  button.type='button';button.dataset.slug=slug;
  button.addEventListener('click',()=>toggleBookmark(slug,titleLink.textContent.trim(),$('.post-category-label',card)?.textContent.trim()||'Blog'));
  holder.append(button);
  const target=$('.post-content',card)||card;
  target.append(holder);
 });
 syncBookmarks();
}
function observeCards(){
 for(const id of ['#latestPosts','#blogPosts']){
  const host=$(id);if(!host)continue;
  decoratePostCards(host);
  new MutationObserver(records=>{
   if(records.some(rec=>[...rec.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.post-card')||node.querySelector?.('.post-card')))))decoratePostCards(host);
  }).observe(host,{childList:true});
 }
}
function initHome(){
 const date=$('#phaseTodayDate');if(date)date.textContent=new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'});
 const reads=arr(KEYS.history).filter(x=>x&&validSlug(x.slug)&&typeof x.title==='string');
 const progress=read(KEYS.progress,{});
 const current=reads.find(x=>(Number(progress?.[x.slug])||0)<96)||reads[0];
 const title=$('#phaseContinueTitle'),description=$('#phaseContinueDesc'),link=$('#phaseContinueLink'),bar=$('#phaseContinueBar');
 if(title&&link&&description){
  if(current){
   const pct=Math.min(100,Math.max(0,Math.round(Number(progress?.[current.slug])||0)));
   title.textContent=current.title;
   description.textContent=pct>=97?'Tamamladığın yazıyı yeniden aç.':pct>3?'Yaklaşık %'+pct+' okudun. Kaldığın yerden devam et.':'Son açtığın yazıya geri dön.';
   link.href='post.html?slug='+encodeURIComponent(current.slug);
   if(bar)bar.style.width=pct+'%';
  }else{
   title.textContent='İlk yazını keşfet';
   description.textContent='Kendine ayırdığın küçük bir okumayla başla.';
   link.href='blog.html';
  }
 }
 const saved=$('#phaseSavedCount');if(saved)saved.textContent=fmt(arr(KEYS.saved).length);
 const historyCount=$('#phaseHistoryCount');if(historyCount)historyCount.textContent=fmt(reads.length);
}
function initReader(){
 const article=$('#articleBody'),reader=$('#reader');
 if(!article||!reader)return;
 const slug=new URLSearchParams(location.search).get('slug');
 if(!validSlug(slug))return;
 const box=el('div','phase-reader-resume');box.hidden=true;
 const msg=el('span','','Okumaya kaldığın yerden devam edebilirsin.');
 const resume=el('button','','Kaldığım yere git');resume.type='button';
 box.append(msg,resume);
 article.before(box);
 const info=el('div','phase-reader-percent');article.before(info);
 let ready=false,timer=0;
 const getPct=()=>{
  const top=article.getBoundingClientRect().top+scrollY;
  const distance=Math.max(1,article.offsetHeight-innerHeight+100);
  return Math.round(Math.max(0,Math.min(100,(scrollY-top+100)/distance*100)));
 };
 const writeProgress=()=>{
  if(!ready)return;
  const current=read(KEYS.progress,{});
  const store=current&&typeof current==='object'&&!Array.isArray(current)?current:{};
  const p=getPct();
  if(p<=0)return;
  store[slug]=p;
  const keys=Object.keys(store);if(keys.length>150)delete store[keys[0]];
  save(KEYS.progress,store);
  info.textContent=p>=97?'Okuma tamamlandı': 'Okuma ilerlemen: %'+p;
 };
 const onScroll=()=>{clearTimeout(timer);timer=setTimeout(writeProgress,300);};
 const observer=new MutationObserver(()=>{
  if(ready||article.querySelector('.loading-state,.error-state'))return;
  if(!article.querySelector('p,h1,h2,h3,blockquote'))return;
  ready=true;observer.disconnect();
  const pct=Number(read(KEYS.progress,{})?.[slug])||0;
  if(pct>7&&pct<97){
   msg.textContent='Bu yazının yaklaşık %'+Math.round(pct)+' bölümünü okumuştun.';
   box.hidden=false;
   resume.addEventListener('click',()=>{
    const top=article.getBoundingClientRect().top+scrollY;
    const distance=Math.max(1,article.offsetHeight-innerHeight+100);
    scrollTo({top:top+distance*pct/100,behavior:'smooth'});
    box.hidden=true;
   });
  }
  info.textContent=pct>=97?'Bu yazıyı daha önce tamamladın.':pct>0?'Önceki ilerlemen: %'+Math.round(pct):'';
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('pagehide',writeProgress);
 });
 observer.observe(article,{childList:true,subtree:false});
}
function initSearchHistory(){
 const input=$('#iyaSearchInput'),shell=$('.iy-search-shell');if(!input||!shell)return;
 const block=el('div','phase-search-tools');
 const label=el('strong','','Hızlı keşfet');
 const chips=el('div','phase-search-chips');
 const clear=el('button','phase-search-clear','Geçmişi temizle');clear.type='button';
 block.append(label,chips,clear);
 const filters=$('.iy-filter-row',shell);if(filters)shell.insertBefore(block,filters);else shell.append(block);
 const getHistory=()=>arr(KEYS.searches).filter(x=>typeof x==='string').slice(0,7);
 const remember=()=>{
  const term=input.value.trim().slice(0,100);if(term.length<2)return;
  const normalized=term.toLocaleLowerCase('tr-TR');
  save(KEYS.searches,[term,...getHistory().filter(x=>x.toLocaleLowerCase('tr-TR')!==normalized)].slice(0,7));
 };
 const paint=()=>{
  chips.replaceChildren();
  const historical=getHistory(),items=historical.length?historical:['psikoloji','alışkanlık','liderlik'];
  label.textContent=historical.length?'Son aramalar':'Örnek aramalar';
  clear.hidden=!historical.length;
  for(const text of items){
   const button=el('button','phase-chip',text);button.type='button';
   button.addEventListener('click',()=>{
    input.value=text;
    input.dispatchEvent(new Event('input',{bubbles:true}));
    remember();paint();
   });
   chips.append(button);
  }
  block.hidden=Boolean(input.value.trim());
 };
 input.addEventListener('input',paint);
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();remember();paint();input.blur();}});
 $('#iyaSearchResults')?.addEventListener('click',event=>{if(event.target.closest('a'))remember();});
 clear.addEventListener('click',()=>{save(KEYS.searches,[]);paint();});
 paint();
}
function initLibrary(){
 const host=$('.iy-saved-grid');if(!host)return;
 const input=$('#phaseLibrarySearch'),filter=$('#phaseLibraryCollection');
 const collections=['Genel','Okunacaklar','Favoriler','Araştırma'];
 const map=()=>{const obj=read(KEYS.collections,{});return obj&&typeof obj==='object'&&!Array.isArray(obj)?obj:{};};
 const containerToType=id=>id==='iyaSavedArticles'?'articles':id==='iyaSavedRecipes'?'recipes':'recent';
 function prepare(container){
  if(!container)return;
  const type=containerToType(container.id);
  $$(':scope > a.iya-saved-row',container).forEach(a=>{
   const wrap=el('div','phase-library-entry');
   wrap.dataset.type=type;
   wrap.dataset.search=a.textContent.toLocaleLowerCase('tr-TR');
   const slug=getSlug(a.href);
   if(type==='articles'&&validSlug(slug))wrap.dataset.slug=slug;
   a.before(wrap);wrap.append(a);
   if(type==='articles'&&validSlug(slug)){
    const actions=el('div','phase-entry-actions');
    const select=el('select','phase-collection');select.setAttribute('aria-label','Yazının koleksiyonu');
    for(const val of collections){const opt=el('option','',val);opt.value=val;select.append(opt);}
    select.value=collections.includes(map()[slug])?map()[slug]:'Genel';
    select.addEventListener('change',()=>{
     const obj=map();if(select.value==='Genel')delete obj[slug];else obj[slug]=select.value;
     save(KEYS.collections,obj);applyFilters();
    });
    const remove=el('button','phase-remove','Kaydı kaldır');remove.type='button';
    remove.addEventListener('click',()=>{
     save(KEYS.saved,arr(KEYS.saved).filter(x=>x?.slug!==slug));
     const obj=map();delete obj[slug];save(KEYS.collections,obj);
     wrap.remove();syncBookmarks();applyFilters();toast('Kayıt kaldırıldı.');
    });
    actions.append(select,remove);wrap.append(actions);
   }
   if(type==='recipes'){
    const actions=el('div','phase-entry-actions');
    const remove=el('button','phase-remove','Favorilerden çıkar');remove.type='button';
    remove.addEventListener('click',()=>{
     const id=new URL(a.href).searchParams.get('id');
     save(KEYS.favorites,arr(KEYS.favorites).filter(x=>String(x)!==String(id)));
     wrap.remove();applyFilters();toast('Tarif favorilerden çıkarıldı.');
    });
    actions.append(remove);wrap.append(actions);
   }
  });
  applyFilters();
 }
 function applyFilters(){
  const query=(input?.value||'').trim().toLocaleLowerCase('tr-TR');
  const selected=filter?.value||'Tümü';
  for(const section of $$('.iy-saved-section',host)){
   const container=section.querySelector('[id^="iyaSaved"],#iyaRecentReads');
   if(!container)continue;
   const type=containerToType(container.id);
   section.hidden=selected!=='Tümü'&&type!=='articles';
   let shown=0;
   for(const row of $$('.phase-library-entry',container)){
    const byText=!query||row.dataset.search.includes(query);
    const byCollection=selected==='Tümü'||type==='articles'&&validSlug(row.dataset.slug)&&((map()[row.dataset.slug]||'Genel')===selected);
    row.hidden=!(byText&&byCollection);if(!row.hidden)shown++;
   }
   if(type==='recent'){
    for(const a of $$(':scope > a.iya-saved-row',container)){
     a.hidden=Boolean(query)&&!a.textContent.toLocaleLowerCase('tr-TR').includes(query);
     if(!a.hidden)shown++;
    }
   }
   let empty=$('.phase-library-empty',container);
   if(!empty){empty=el('p','phase-library-empty');empty.hidden=true;container.append(empty);}
   const hasRows=Boolean($('.phase-library-entry, a.iya-saved-row',container));
   empty.hidden=!hasRows||shown!==0;
   empty.textContent='Bu filtreye uygun kayıt bulunamadı.';
   const counter=$('.phase-library-count',section);
   if(counter)counter.textContent=shown+' kayıt';
  }
 }
 for(const id of ['iyaSavedArticles','iyaSavedRecipes','iyaRecentReads']){
  const c=$('#'+id);if(!c)continue;
  const section=c.closest('.iy-saved-section');
  if(section&&!$('.phase-library-count',section)){
   const count=el('small','phase-library-count','');
   section.querySelector('h2')?.after(count);
  }
  prepare(c);
  new MutationObserver(()=>prepare(c)).observe(c,{childList:true});
 }
 input?.addEventListener('input',applyFilters);
 filter?.addEventListener('change',applyFilters);
 $('#phaseExport')?.addEventListener('click',()=>{
  const data={version:1,exportedAt:new Date().toISOString(),savedArticles:arr(KEYS.saved),recipeFavorites:arr(KEYS.favorites),readingHistory:arr(KEYS.history),collections:map(),readingProgress:read(KEYS.progress,{})};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='iyi-yol-akademi-kutuphanem.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500);toast('Kütüphane yedeği indirildi.');
 });
 $('#phaseImport')?.addEventListener('change',async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   if(file.size>1024*1024)throw Error('Dosya 1 MB sınırını aşıyor.');
   const data=JSON.parse(await file.text());
   if(data?.version!==1||!Array.isArray(data.savedArticles)||!Array.isArray(data.recipeFavorites)||!Array.isArray(data.readingHistory))throw Error('Bu dosya geçerli bir kütüphane yedeği değil.');
   const validArticle=x=>x&&validSlug(x.slug)&&typeof x.title==='string';
   const cleanSaved=data.savedArticles.filter(validArticle).slice(0,200).map(x=>({slug:x.slug,title:x.title.slice(0,250),category:String(x.category||'Blog').slice(0,80),date:Number(x.date)||Date.now()}));
   const cleanHistory=data.readingHistory.filter(validArticle).slice(0,15).map(x=>({slug:x.slug,title:x.title.slice(0,250),category:String(x.category||'Blog').slice(0,80),date:Number(x.date)||Date.now()}));
   const cleanFavorites=data.recipeFavorites.filter(x=>Number.isInteger(Number(x))&&Number(x)>0).slice(0,300).map(Number);
   const cleanCollections=Object.create(null),cleanProgress=Object.create(null);
   if(data.collections&&typeof data.collections==='object')for(const [slug,name] of Object.entries(data.collections)){if(validSlug(slug)&&collections.includes(name))cleanCollections[slug]=name;}
   if(data.readingProgress&&typeof data.readingProgress==='object')for(const [slug,pct] of Object.entries(data.readingProgress)){if(validSlug(slug)&&Number.isFinite(Number(pct)))cleanProgress[slug]=Math.max(0,Math.min(100,Number(pct)));}
   if(!confirm('Bu yedek, bu tarayıcıdaki mevcut kütüphane kayıtlarının yerine geçecek. Devam edilsin mi?'))return;
   save(KEYS.saved,cleanSaved);save(KEYS.favorites,cleanFavorites);save(KEYS.history,cleanHistory);save(KEYS.collections,cleanCollections);save(KEYS.progress,cleanProgress);
   location.reload();
  }catch(err){toast(err.message||'Yedek yüklenemedi.');}
  finally{event.target.value='';}
 });
}
observeCards();
if(page==='home')initHome();
if(page==='post')initReader();
if(page==='search')initSearchHistory();
if(page==='saved')initLibrary();
})();