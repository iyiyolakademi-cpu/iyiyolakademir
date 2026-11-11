(function iyiYolFeatures(){
"use strict";
const API="https://jcnokkpduzdgymwvxuoh.supabase.co/rest/v1";
const KEY="sb_publishable_C2NPcTXgB4-GNZGyvgfuMw__vJpIaSm";
const BOOKMARK_KEY="iya_saved_articles_v1";
const HISTORY_KEY="iya_reading_history_v1";
const FAVORITES_KEY="iyi-yol-akademi-recipes-favorites-v1";
// Özgün logoyu tüm sayfalarda aynı, çerçevesiz sürümle göster.
document.querySelectorAll('img[src="brand-full.svg"]').forEach(img=>{img.src="brand-transparent.svg";});
document.querySelectorAll('link[rel="icon"][href="brand-full.svg"]').forEach(icon=>{icon.href="brand-transparent.svg";});
const $=(selector,parent=document)=>parent.querySelector(selector);
const $$=(selector,parent=document)=>Array.from(parent.querySelectorAll(selector));
const q=(txt)=>String(txt||"").toLocaleLowerCase("tr-TR");
const node=(tag,cls,value)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(value!=null)x.textContent=String(value);return x;};
const readStorage=(key,def=[])=>{try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:def;}catch(_){return def;}};
const saveStorage=(key,items)=>{try{localStorage.setItem(key,JSON.stringify(items));}catch(_){notify("Tarayıcı bu bilgiyi kaydetmeye izin vermiyor.");}};
const safeSlug=(slug)=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug||""));
function notify(message){
 let toast=$("#iyaToast");if(!toast){toast=node("div","iya-toast");toast.id="iyaToast";toast.setAttribute("role","status");toast.setAttribute("aria-live","polite");document.body.appendChild(toast);}
 toast.textContent=message;toast.classList.add("visible");clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove("visible"),2800);
}
function nav(){
 const header=$(".site-header .header-content");
 if(!header)return;
 const oldMenu=$("#menuToggle");
 const current=(location.pathname.split("/").pop()||"index.html").toLowerCase();
 const sections=[
  {label:"ANA SAYFA",items:[["index.html","Ana Sayfa"],["arama.html","İçerik Ara"]]},
  {label:"İÇERİKLER",items:[["blog.html","Blog Yazıları"],["tarifler.html","Yemek Tarifleri"],["testler.html","Kişilik Testleri"],["gunun-sozu.html","Günün Sözü ve Tavsiyesi"]]},
  {label:"ARAÇLAR",items:[["yapilacaklar.html","Yapılacaklar Listesi"],["pomodoro.html","Pomodoro / Odaklanma"],["hesaplama.html","Pratik Hesaplamalar"]]},
  {label:"KİŞİSEL ALAN",items:[["kaydedilenler.html","Kaydedilenler"]]},
  {label:"BİLGİ",items:[["yayin-ilkeleri.html","Hakkımızda ve Yayın İlkeleri"],["gizlilik.html","Gizlilik"]]}
 ];
 const trigger=node("button","iya-drawer-trigger");
 trigger.type="button";trigger.id="iyaDrawerTrigger";trigger.setAttribute("aria-label","Sol menüyü aç");
 trigger.setAttribute("aria-expanded","false");trigger.setAttribute("aria-controls","iyaDrawer");
 const bars=node("span","iya-bars");bars.setAttribute("aria-hidden","true");
 for(let i=0;i<3;i++)bars.appendChild(node("i"));
 trigger.append(bars,node("span","iya-trigger-text","Menü"));
 header.insertBefore(trigger,header.firstChild);
 const headerSearch=node("a","iya-header-search","Ara");
 headerSearch.href="arama.html";headerSearch.setAttribute("aria-label","Site içeriğinde ara");
 header.appendChild(headerSearch);
 const overlay=node("div","iya-drawer-backdrop");overlay.id="iyaDrawerBackdrop";overlay.hidden=true;
 const drawer=node("aside","iya-drawer");drawer.id="iyaDrawer";drawer.setAttribute("aria-label","İyi Yol Akademi bölümleri");
 drawer.setAttribute("aria-hidden","true");drawer.setAttribute("inert","");
 const drawerHead=node("div","iya-drawer-header");
 const brand=node("div","iya-drawer-brand");
 const logo=node("img");logo.src="brand-transparent.svg";logo.alt="İyi Yol Akademi";
 const brandWords=node("div","iya-drawer-brand-words");
 brandWords.append(node("strong","","İYİ YOL AKADEMİ"),node("small","","Öğren, keşfet, geliş"));
 brand.append(logo,brandWords);
 const close=node("button","iya-drawer-close","×");
 close.type="button";close.setAttribute("aria-label","Menüyü kapat");
 drawerHead.append(brand,close);drawer.appendChild(drawerHead);
 const navContent=node("nav","iya-drawer-links");
 navContent.setAttribute("aria-label","Tüm özellikler");
 for(const section of sections){
  const group=node("section","iya-drawer-section");
  group.appendChild(node("h2","",section.label));
  for(const [href,label] of section.items){
   const link=node("a","iya-drawer-link",label);link.href=href;
   if(current===href||(current==="post.html"&&href==="blog.html")){
     link.classList.add("current");link.setAttribute("aria-current","page");
   }
   group.appendChild(link);
  }
  navContent.appendChild(group);
 }
 drawer.appendChild(navContent);
 const drawerFoot=node("div","iya-drawer-foot","İyi Yol Akademi · Her gün daha iyiye");
 drawer.appendChild(drawerFoot);
 document.body.append(overlay,drawer);
 const isOpen=()=>drawer.classList.contains("is-open");
 let previousFocus=null;
 function closeDrawer(restore=true){
  if(!isOpen())return;
  drawer.classList.remove("is-open");overlay.classList.remove("is-visible");
  drawer.setAttribute("aria-hidden","true");drawer.setAttribute("inert","");
  overlay.hidden=true;trigger.setAttribute("aria-expanded","false");trigger.setAttribute("aria-label","Sol menüyü aç");
  document.body.classList.remove("iya-no-scroll");
  if(restore)(previousFocus?.isConnected?previousFocus:trigger).focus();
 }
 function openDrawer(){
  if(isOpen())return;
  previousFocus=document.activeElement;
  overlay.hidden=false;overlay.classList.add("is-visible");
  drawer.removeAttribute("inert");drawer.setAttribute("aria-hidden","false");
  drawer.classList.add("is-open");
  trigger.setAttribute("aria-expanded","true");trigger.setAttribute("aria-label","Sol menüyü kapat");
  document.body.classList.add("iya-no-scroll");
  close.focus();
 }
 trigger.addEventListener("click",()=>isOpen()?closeDrawer():openDrawer());
 close.addEventListener("click",()=>closeDrawer());
 overlay.addEventListener("click",()=>closeDrawer());
 drawer.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>closeDrawer(false)));
 document.addEventListener("keydown",event=>{
  if(!isOpen())return;
  if(event.key==="Escape"){event.preventDefault();closeDrawer();return;}
  if(event.key!=="Tab")return;
  const focusables=Array.from(drawer.querySelectorAll('button:not([disabled]),a[href]'));
  if(!focusables.length)return;
  const first=focusables[0],last=focusables[focusables.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 if(oldMenu)oldMenu.setAttribute("aria-hidden","true");
 document.documentElement.classList.add("iya-drawer-ready");
 // Desktopta görünür, klavyeyle erişilebilir kalıcı menü; mobilde erişilebilir çekmece.
 const layoutQuery=window.matchMedia("(min-width:1100px)");
 function syncMenuLayout(){
   if(layoutQuery.matches){
     closeDrawer(false);
     drawer.removeAttribute("inert");
     drawer.setAttribute("aria-hidden","false");
     overlay.hidden=true;
     document.body.classList.remove("iya-no-scroll");
     trigger.setAttribute("aria-expanded","false");
   }else if(!isOpen()){
     drawer.setAttribute("inert","");
     drawer.setAttribute("aria-hidden","true");
     overlay.hidden=true;
   }
 }
 syncMenuLayout();
 if(layoutQuery.addEventListener)layoutQuery.addEventListener("change",syncMenuLayout);
 else if(layoutQuery.addListener)layoutQuery.addListener(syncMenuLayout);
}
async function fetchJson(url,options={}){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch(url,{...options,signal:controller.signal});if(!response.ok)throw new Error("HTTP "+response.status);return await response.json();}
 finally{clearTimeout(timeout);}
}
async function loadBlog(){
 const params=new URLSearchParams({select:"slug,title,excerpt,read_minutes,published_at,blog_categories(name,slug)",status:"eq.published",published_at:"lte."+new Date().toISOString(),order:"published_at.desc",limit:"200"});
 return fetchJson(API+"/blog_posts?"+params.toString(),{headers:{apikey:KEY,Accept:"application/json"},cache:"no-store"});
}
function makeResult(item){
 const article=node("article","iya-result");
 const link=node("a","iya-result-link");link.href=item.href;
 const labels=node("div","iya-result-labels");
 labels.append(node("span","iya-result-kind",item.kindLabel),node("span","iya-result-category",item.category||""));
 link.appendChild(labels);
 link.appendChild(node("h3","",item.title));
 if(item.excerpt)link.appendChild(node("p","",item.excerpt));
 const foot=node("div","iya-result-footer");
 foot.append(node("span","",item.detail||""),node("span","iya-result-go",item.kind==="test"?"Teste git →":item.kind==="recipe"?"Tarifi aç →":"Yazıyı oku →"));
 link.appendChild(foot);article.appendChild(link);return article;
}
async function initSearch(){
 const input=$("#iyaSearchInput"),results=$("#iyaSearchResults"),count=$("#iyaSearchCount"),status=$("#iyaSearchStatus");
 if(!input||!results)return;
 const params=new URLSearchParams(location.search),initial=params.get("q")||"";
 input.value=initial.slice(0,100);
 let selected="all",entries=[];
 const sources=await Promise.allSettled([loadBlog(),fetchJson("recipes-data.json"),fetchJson("testler-index.json")]);
 const blogs=sources[0].status==="fulfilled"?sources[0].value:[];
 const recipes=sources[1].status==="fulfilled"?sources[1].value:[];
 const tests=sources[2].status==="fulfilled"?sources[2].value:[];
 for(const post of blogs){if(!safeSlug(post.slug))continue;entries.push({kind:"blog",kindLabel:"BLOG YAZISI",category:post.blog_categories?.name||"Blog",title:post.title,excerpt:post.excerpt||"",detail:post.read_minutes?post.read_minutes+" dk okuma":"Yazı",href:"post.html?slug="+encodeURIComponent(post.slug)});}
 for(const recipe of recipes){if(!Number.isInteger(Number(recipe.id)))continue;entries.push({kind:"recipe",kindLabel:"YEMEK TARİFİ",category:recipe.category||"Tarif",title:recipe.name||"",excerpt:recipe.desc||"",searchExtras:(recipe.ingredients||[]).join(" "),detail:recipe.totalTime||"Adım adım tarif",href:"tarifler.html?id="+encodeURIComponent(recipe.id)});}
 for(const test of tests){if(!Number.isInteger(Number(test.id)))continue;entries.push({kind:"test",kindLabel:"KİŞİLİK TESTİ",category:test.categoryName||"Test",title:test.title||"",excerpt:"Soruları cevaplayarak kendini tanımaya yönelik bu testi keşfet.",detail:"Kişilik testi",href:"testler.html?test="+encodeURIComponent(test.id)});}
 const success=sources.filter(s=>s.status==="fulfilled").length;
 if(status)status.textContent=success===3?"Bloglar, tarifler ve kişilik testleri arasında arama yapabilirsin.":success===0?"İçerikler yüklenemedi. Sayfayı yenileyip yeniden dene.":"Bazı içerik kaynakları şu anda yüklenemedi; erişilebilen içerikler gösteriliyor.";
 const buttons=$$("[data-iya-type]");
 const render=()=>{
   const term=q(input.value.trim()),matches=entries.filter(x=>(selected==="all"||x.kind===selected)&&(!term||q([x.title,x.excerpt,x.category,x.searchExtras].join(" ")).includes(term)));
   const display=!term&&selected==="all"?[
       ...matches.filter(x=>x.kind==="blog").slice(0,4),
       ...matches.filter(x=>x.kind==="recipe").slice(0,5),
       ...matches.filter(x=>x.kind==="test").slice(0,5)
     ]:matches.slice(0,100);
   results.replaceChildren();
   if(!display.length)results.append(node("p","iya-empty","Aramana uygun içerik bulunamadı. Başka bir kelime deneyebilirsin."));
   else results.append(...display.map(makeResult));
   if(count)count.textContent=term||selected!=="all"?matches.length+" sonuç":entries.length+" içerikten öne çıkanlar";
 };
 for(const button of buttons){button.addEventListener("click",()=>{
   selected=button.dataset.iyaType;for(const b of buttons){const active=b===button;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active));}
   render();
 });}
 let timer;
 input.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(()=>{const url=new URL(location.href);if(input.value.trim())url.searchParams.set("q",input.value.trim());else url.searchParams.delete("q");history.replaceState(null,"",url.pathname+url.search);render();},140);});
 render();
}
function savedArticles(){return readStorage(BOOKMARK_KEY).filter(x=>safeSlug(x.slug)&&typeof x.title==="string");}
function readingHistory(){return readStorage(HISTORY_KEY).filter(x=>safeSlug(x.slug)&&typeof x.title==="string");}
function saveHistory(slug,title,category){
 if(!safeSlug(slug)||!title)return;
 const old=readingHistory().filter(x=>x.slug!==slug);
 saveStorage(HISTORY_KEY,[{slug,title,category,date:Date.now()},...old].slice(0,15));
}
function toggleSaved(slug,title,category){
 if(!safeSlug(slug))return false;
 const current=savedArticles(),existing=current.some(x=>x.slug===slug);
 const next=existing?current.filter(x=>x.slug!==slug):[{slug,title,category,date:Date.now()},...current].slice(0,200);
 saveStorage(BOOKMARK_KEY,next);
 return !existing;
}
function addReadingTools(){
 const reader=$("#reader"),body=$("#articleBody"),toolbar=$(".reader-toolbar"),slug=new URLSearchParams(location.search).get("slug");
 if(!reader||!body||!toolbar||!safeSlug(slug))return;
 const progress=node("div","iya-progress");progress.setAttribute("aria-hidden","true");document.body.appendChild(progress);
 const actions=node("div","iya-reader-actions");
 const bookmark=node("button","iya-reader-btn","Kaydet");bookmark.type="button";
 const share=node("button","iya-reader-btn","Paylaş");share.type="button";
 actions.append(bookmark,share);toolbar.appendChild(actions);
 const status=()=>{const active=savedArticles().some(x=>x.slug===slug);bookmark.textContent=active?"Kaydedildi ✓":"Yazıyı kaydet";bookmark.setAttribute("aria-pressed",String(active));};
 status();
 bookmark.addEventListener("click",()=>{const title=document.title.split(" | ")[0];const category=($("#readerMeta")?.textContent||"").split(" · ")[0];const active=toggleSaved(slug,title,category);status();notify(active?"Blog yazısı kaydedildi.":"Blog yazısı kaydedilenlerden çıkarıldı.");});
 share.addEventListener("click",async()=>{
  const url=location.href,title=document.title.split(" | ")[0];
  if(navigator.share){try{await navigator.share({title,url});return;}catch(e){if(e.name==="AbortError")return;}}
  try{await navigator.clipboard.writeText(url);notify("Yazının bağlantısı kopyalandı.");}catch(_){notify("Adres çubuğundan bağlantıyı kopyalayabilirsin.");}
 });
 const onScroll=()=>{const top=body.getBoundingClientRect().top+scrollY;const usable=body.offsetHeight-innerHeight*.65;const percent=usable>0?Math.max(0,Math.min(100,(scrollY-top+90)/usable*100)):0;progress.style.width=percent+"%";};
 addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);
 let rendered=false;
 const observer=new MutationObserver(()=>{
   if(rendered||!body.querySelector("p,h2,h3"))return;
   if(body.querySelector(".loading-state,.error-state"))return;
   rendered=true;
   const title=document.title.split(" | ")[0];const category=($("#readerMeta")?.textContent||"").split(" · ")[0];
   saveHistory(slug,title,category);status();onScroll();
   const headings=$$("h2,h3",body).filter(x=>x.textContent.trim().length>6).slice(0,25);
   if(headings.length>=3){
      const toc=node("details","iya-toc");
      const summary=node("summary","", "Bu yazıda neler var?");
      const list=node("ol");
      headings.forEach((heading,i)=>{
        const id="bolum-"+(i+1);heading.id=id;
        const item=node("li"),link=node("a","",heading.textContent.trim());link.href="#"+id;
        link.addEventListener("click",()=>{toc.open=false;});
        item.append(link);list.append(item);
      });
      toc.append(summary,list);body.parentNode.insertBefore(toc,body);
   }
   addRelated(slug,category,reader);
 });
 observer.observe(body,{childList:true,subtree:false});
 if(body.querySelector("p,h2,h3")&&!body.querySelector(".loading-state,.error-state"))observer.takeRecords(),setTimeout(()=>{if(!rendered){body.appendChild(document.createTextNode(""));}},0);
}
async function addRelated(slug,category,reader){
 try{
   const posts=await loadBlog();
   const chosen=posts.filter(x=>x.slug!==slug).sort((a,b)=>Number(b.blog_categories?.name===category)-Number(a.blog_categories?.name===category)).slice(0,3);
   if(!chosen.length)return;
   const box=node("section","iya-related");box.appendChild(node("h2","","Diğer blog yazıları"));
   const grid=node("div","iya-related-grid");
   for(const post of chosen){
      if(!safeSlug(post.slug))continue;
      const item=node("a","iya-related-card");item.href="post.html?slug="+encodeURIComponent(post.slug);
      item.append(node("span","",post.blog_categories?.name||"Blog yazısı"),node("strong","",post.title),node("small","","Yazıyı oku →"));grid.append(item);
   }
   box.append(grid);reader.insertAdjacentElement("afterend",box);
 }catch(_){}
}
function renderSaved(){
 const saved=$("#iyaSavedArticles"),recipes=$("#iyaSavedRecipes"),recent=$("#iyaRecentReads");
 if(!saved||!recipes||!recent)return;
 function renderArticles(container,items,empty){
   container.replaceChildren();if(!items.length){container.append(node("p","iya-empty",empty));return;}
   items.forEach(x=>{const link=node("a","iya-saved-row");link.href="post.html?slug="+encodeURIComponent(x.slug);link.append(node("span","",x.category||"Blog Yazısı"),node("strong","",x.title),node("small","","Yazıyı aç →"));container.append(link);});
 }
 renderArticles(saved,savedArticles(),"Henüz kaydettiğin bir blog yazısı yok. Bir yazıyı açıp 'Yazıyı kaydet' seçeneğine basabilirsin.");
 renderArticles(recent,readingHistory().slice(0,6),"Henüz açtığın bir blog yazısı yok.");
 const favs=readStorage(FAVORITES_KEY).map(Number).filter(Number.isInteger);
 if(!favs.length){recipes.replaceChildren(node("p","iya-empty","Henüz favori tarifin bulunmuyor."));return;}
 fetchJson("recipes-data.json").then(list=>{
   const items=list.filter(x=>favs.includes(Number(x.id)));
   recipes.replaceChildren();
   if(!items.length)recipes.append(node("p","iya-empty","Favori tarif bulunamadı."));
   else items.forEach(x=>{const link=node("a","iya-saved-row");link.href="tarifler.html?id="+encodeURIComponent(x.id);link.append(node("span","",x.category||"Yemek Tarifi"),node("strong","",x.name),node("small","","Tarifi aç →"));recipes.append(link);});
 }).catch(()=>recipes.replaceChildren(node("p","iya-empty","Tarifler şu anda yüklenemiyor.")));
}
function initDirectTest(){
 const frame=$("#personalityFrame"),test=new URLSearchParams(location.search).get("test");
 if(!frame||!test||!/^\d{1,3}$/.test(test))return;
 const id=Number(test);if(id<1||id>100)return;
 frame.src="testler-uygulama.html?test="+id;
}
nav();
const page=document.body.dataset.page;
if(page==="search")initSearch();
if(page==="saved")renderSaved();
if(page==="post")addReadingTools();
if(page==="personality")initDirectTest();
})();
