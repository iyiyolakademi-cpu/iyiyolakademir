(function iyiYolFeatures(){
"use strict";
const API="https://byqfkrjiwefdnhnvjrbq.supabase.co/rest/v1";
const KEY="sb_publishable_NmrNx9632u62947Hol3DTw_n89-DYP_";
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
  const header=document.querySelector(".site-header");
  if(!header)return;
  document.documentElement.classList.remove("iya-drawer-ready");
  document.querySelectorAll(".iya-drawer,.iya-drawer-backdrop,.iya-drawer-trigger").forEach(el=>el.remove());
  const cssId="edEditorialCSS";
  if(!document.getElementById(cssId)){
    const css=document.createElement("link");
    css.id=cssId; css.rel="stylesheet"; css.href="editorial-system.css?v=20261118-v4";
    document.head.appendChild(css);
  }
  header.innerHTML="<div class=\"ed-topline\"><div class=\"ed-wrap\"><span>ÖĞRENME, KİŞİSEL GELİŞİM VE YENİ FİKİRLER</span><span class=\"ed-topright\">HER GÜN BİR ADIM DAHA.</span></div></div>\n<div class=\"ed-wrap ed-primary\">\n<a class=\"ed-wordmark\" href=\"index.html\" aria-label=\"İyi Yol Akademi ana sayfa\"><b>iyi<span>yol.</span></b><small>AKADEMİ</small></a>\n<nav class=\"ed-nav\" aria-label=\"Ana menü\">\n<a href=\"index.html\">Ana Sayfa</a><a href=\"egitimler.html\">Eğitimler</a><a href=\"blog.html\">Yazılar</a><a href=\"testler.html\">Testler</a><a href=\"yapilacaklar.html\">Gelişim</a>\n</nav>\n<div class=\"ed-actions\">\n<a class=\"ed-search\" href=\"arama.html\" aria-label=\"Site içi arama\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 5 5\"/></svg><span>Ara</span></a>\n<a class=\"iya-quick-link\" href=\"pomodoro.html\">Odaklan</a><a class=\"iya-quick-link\" href=\"kaydedilenler.html\">Kaydedilenler</a><details class=\"iya-profile-menu\" id=\"iyaProfileMenu\"><summary aria-label=\"Profil menüsünü aç\"><span aria-hidden=\"true\">◉</span> Profil <span aria-hidden=\"true\">⌄</span></summary><div class=\"iya-profile-dropdown\"><a href=\"hesabim.html#login\">Giriş Yap / Profilim</a><a href=\"hesabim.html#signup\">Üye Ol</a><a href=\"yapilacaklar.html\">Günlük Planım</a><a href=\"gelisim-araclari.html\">Gelişim Araçlarım</a><a href=\"kaydedilenler.html\">Kaydettiklerim</a><a href=\"pomodoro.html\">Odaklanma</a><a href=\"egitimler.html\">Eğitimlerim</a></div></details>\n<button id=\"edMobileToggle\" class=\"ed-mobile-toggle\" type=\"button\" aria-label=\"Menüyü aç\" aria-expanded=\"false\" aria-controls=\"edMobileMenu\">☰</button>\n</div></div>\n<nav id=\"edMobileMenu\" class=\"ed-mobile-menu\" aria-label=\"Mobil menü\" hidden>\n<a href=\"index.html\">Ana Sayfa</a><a href=\"blog.html\">Yazılar</a><a href=\"testler.html\">Kişilik Testleri</a><a href=\"premium-testler.html\">Keşif Testleri</a><a href=\"yapilacaklar.html\">Hedef ve Alışkanlıklar</a><a href=\"gelisim-araclari.html\">Gelişim Araçları</a><a href=\"pomodoro.html\">Pomodoro</a><a href=\"tarifler.html\">Yemek Tarifleri</a><a href=\"hesaplama.html\">Hesaplama Araçları</a><a href=\"kaydedilenler.html\">Kaydedilenler</a><a href=\"arama.html\">İçerik Ara</a>\n</nav>";
  const profile=header.querySelector("#iyaProfileMenu");
  initProfileAuth(header);
  document.addEventListener("click",event=>{if(profile&&!profile.contains(event.target))profile.open=false;});
  const current=location.pathname.split("/").pop()||"index.html";
  header.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute("href")||"";
    if(href.split("#")[0]===current)a.setAttribute("aria-current","page");
  });
  const btn=header.querySelector("#edMobileToggle"),mobile=header.querySelector("#edMobileMenu");
  function close(){mobile.hidden=true;btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Menüyü aç");btn.textContent="☰";}
  btn.addEventListener("click",()=>{
    const opening=mobile.hidden;mobile.hidden=!opening;
    btn.setAttribute("aria-expanded",String(opening));
    btn.setAttribute("aria-label",opening?"Menüyü kapat":"Menüyü aç");
    btn.textContent=opening?"×":"☰";
  });
  mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();if(profile)profile.open=false;}});
  const footer=document.querySelector("footer.footer");
  if(footer){footer.classList.add("ed-footer");footer.innerHTML="<div class=\"ed-footer-main\"><div class=\"ed-footer-brand-wrap\">\n<a class=\"ed-footer-brand\" href=\"index.html\">iyi<span>yol.</span><small>AKADEMİ</small></a>\n<p>Öğrenmek, keşfetmek ve her gün biraz daha ilerlemek için hazırlanmış dijital bir yaşam platformu.</p></div>\n<div><h3>Oku ve Keşfet</h3><nav class=\"ed-footer-links\"><a href=\"blog.html\">Blog Yazıları</a><a href=\"tarifler.html\">Yemek Tarifleri</a><a href=\"arama.html\">İçerik Ara</a></nav></div>\n<div><h3>Gelişim</h3><nav class=\"ed-footer-links\"><a href=\"testler.html\">Kişilik Testleri</a><a href=\"premium-testler.html\">Keşif Testleri</a><a href=\"yapilacaklar.html\">Günlük Planlama</a><a href=\"gelisim-araclari.html\">Gelişim Araçları</a><a href=\"pomodoro.html\">Pomodoro</a></nav></div>\n<div><h3>Bilgi</h3><nav class=\"ed-footer-links\"><a href=\"kaydedilenler.html\">Kaydedilenler</a><a href=\"yayin-ilkeleri.html\">Hakkımızda</a><a href=\"yayin-ilkeleri.html\">Yayın İlkeleri</a><a href=\"gizlilik.html\">Gizlilik Politikası</a></nav></div></div>\n<div class=\"ed-footer-bottom\"><span>© COPYRIGHT_YEAR İyi Yol Akademi. Tüm hakları saklıdır.</span><span>İyi bir yaşam, iyi bir yolla başlar.</span></div>".replace("COPYRIGHT_YEAR",String(new Date().getFullYear()));}
}

// Oturum durumunu tüm sayfalarda tek bir Supabase Auth istemcisiyle eşitle.
async function initProfileAuth(header){
 const menu=header.querySelector("#iyaProfileMenu");
 if(!menu)return;
 const summary=menu.querySelector("summary"),dropdown=menu.querySelector(".iya-profile-dropdown");
 const mobile=header.querySelector("#edMobileMenu");
 const render=(user,db)=>{
   dropdown.replaceChildren();
   const add=(label,href)=>{const a=node("a","",label);a.href=href;dropdown.appendChild(a);return a;};
   if(user){
     const display=(user.user_metadata?.full_name||user.user_metadata?.name||user.email?.split("@")[0]||"Üye").trim().slice(0,35);
     summary.replaceChildren(node("span","iya-avatar",display.charAt(0).toLocaleUpperCase("tr-TR")),document.createTextNode(" "+display+" ▾"));
     add("Profilim","profilim.html");
     add("Yazar / Yayın Paneli","yazar-paneli.html");
     add("Günlük Planım","yapilacaklar.html");
     add("Gelişim Araçlarım","gelisim-araclari.html");
     add("Kaydedilenler","kaydedilenler.html");
     add("Odaklanma","pomodoro.html");
     add("Eğitimler","egitimler.html");
     const logout=node("button","iya-profile-logout","Çıkış yap");
     logout.type="button";
     logout.addEventListener("click",async()=>{
       logout.disabled=true;
       const {error}=await db.auth.signOut();
       if(error){notify("Çıkış yapılamadı: "+error.message);logout.disabled=false;}
       else{menu.open=false;render(null,db);if(location.pathname.endsWith("hesabim.html"))location.reload();}
     });
     dropdown.appendChild(logout);
   }else{
     summary.replaceChildren(node("span","iya-avatar","♙"),document.createTextNode(" Profil ▾"));
     add("Giriş Yap","hesabim.html#login");
     add("Ücretsiz Üye Ol","hesabim.html#signup");
     add("Eğitimleri Keşfet","egitimler.html");
     add("Yazar olmak istiyorum","yazar-paneli.html");
   }
   if(mobile){
     mobile.querySelectorAll("[data-auth-mobile]").forEach(el=>el.remove());
     const a=node("a","",user?"Profilim":"Giriş Yap / Üye Ol");
     a.dataset.authMobile="true";a.href=user?"profilim.html":"hesabim.html#login";
     mobile.prepend(a);
   }
 };
 try{
   const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2.57.0");
   const db=createClient("https://byqfkrjiwefdnhnvjrbq.supabase.co",KEY);
   const {data:{session}}=await db.auth.getSession();
   render(session?.user||null,db);
   db.auth.onAuthStateChange((_event,session)=>render(session?.user||null,db));
 }catch(error){console.warn("Profil oturumu yüklenemedi",error);render(null,null);}
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
 foot.append(node("span","",item.detail||""),node("span","iya-result-go",item.kind==="test"?"Teste git →":item.kind==="recipe"?"Tarifi aç →":item.kind==="tool"?"Aracı aç →":"Yazıyı oku →"));
 link.appendChild(foot);article.appendChild(link);return article;
}
async function initSearch(){
 const input=$("#iyaSearchInput"),results=$("#iyaSearchResults"),count=$("#iyaSearchCount"),status=$("#iyaSearchStatus");
 if(!input||!results)return;
 const params=new URLSearchParams(location.search),initial=params.get("q")||"";
 input.value=initial.slice(0,100);
 let selected="all",entries=[];
 const sources=await Promise.allSettled([loadBlog(),fetchJson("recipes-data.json"),fetchJson("testler-index.json"),fetchJson("premium-testler-index.json")]);
 const blogs=sources[0].status==="fulfilled"?sources[0].value:[];
 const recipes=sources[1].status==="fulfilled"?sources[1].value:[];
 const tests=sources[2].status==="fulfilled"?sources[2].value:[];
 const premiumTests=sources[3].status==="fulfilled"?sources[3].value:[];
 for(const post of blogs){if(!safeSlug(post.slug))continue;entries.push({kind:"blog",kindLabel:"BLOG YAZISI",category:post.blog_categories?.name||"Blog",title:post.title,excerpt:post.excerpt||"",detail:post.read_minutes?post.read_minutes+" dk okuma":"Yazı",href:"post.html?slug="+encodeURIComponent(post.slug)});}
 for(const recipe of recipes){if(!Number.isInteger(Number(recipe.id)))continue;entries.push({kind:"recipe",kindLabel:"YEMEK TARİFİ",category:recipe.category||"Tarif",title:recipe.name||"",excerpt:recipe.desc||"",searchExtras:(recipe.ingredients||[]).join(" "),detail:recipe.totalTime||"Adım adım tarif",href:"tarifler.html?id="+encodeURIComponent(recipe.id)});}
 for(const test of tests){if(!Number.isInteger(Number(test.id)))continue;entries.push({kind:"test",kindLabel:"KİŞİLİK TESTİ",category:test.categoryName||"Test",title:test.title||"",excerpt:"Soruları cevaplayarak kendini tanımaya yönelik bu testi keşfet.",detail:"Kişilik testi",href:"testler.html?test="+encodeURIComponent(test.id)});}
 for(const test of premiumTests){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(test.id||"")))continue;entries.push({kind:"test",kindLabel:"KEŞİF TESTİ",category:test.categoryName||"Test",title:test.title||"",excerpt:test.description||"",detail:(Number(test.questionCount)||12)+" soru",premium:true,href:"premium-testler.html?test="+encodeURIComponent(test.id)});}
 const toolEntries=[["Günlük planlayıcı ve yapılacaklar","Görev ekle, öncelik belirle ve haftanı planla.","Günlük hedefler","yapilacaklar.html","görev plan program"],["Hedef ve alışkanlık merkezi","Alışkanlıklarını ve hedeflerini takip et.","Gelişim","yapilacaklar.html","hedef alışkanlık takip"],["Duygu günlüğü","Ruh hâlini ve günlük değerlendirmelerini kaydet.","Kişisel gelişim","yapilacaklar.html#duygu","duygu ruh hali günlük"],["7, 21 ve 30 günlük gelişim programları","Adım adım ilerleyen kişisel gelişim yolculuğu.","Programlar","yapilacaklar.html#programlar","okuma alışkanlık program"],["Kitap okuma takipçisi","Kitaplarını ve okuduğun sayfaları kaydet.","Okuma","gelisim-araclari.html#okuma","kitap okuma takip sayfa"],["Gelecekteki kendime mektup","Geleceğe saklamak için kendine mektup yaz.","Kişisel gelişim","gelisim-araclari.html#mektup","mektup gelecek"],["Akıllı çalışma planlayıcısı","Derslerini ve çalışma sürelerini planla.","Eğitim","gelisim-araclari.html#calisma","ders sınav çalışma"],["Hatırlatmalarım","Önemli tarihlerini planla ve takvime aktar.","Planlama","gelisim-araclari.html#hatirlatma","hatırlatma takvim tarih"],["Pomodoro odaklanma zamanlayıcısı","Odaklanma ve mola sürelerini takip et.","Verimlilik","pomodoro.html","odak çalışma pomodoro"],["Komisyon hesaplama","Satış tutarı ve kesinti oranına göre hesapla.","Hesaplamalar","hesaplama.html?tool=komisyon","komisyon kesinti"],["İndirim ve yüzde hesaplama","İndirimli fiyatı ve kazancını öğren.","Hesaplamalar","hesaplama.html?tool=indirim","indirim yüzde"],["İdeal uyku saati hesaplama","Yaklaşık yatış ve kalkış saatlerini keşfet.","Hesaplamalar","hesaplama.html?tool=uyku","uyku yatış kalkış"],["Maaşa göre saatlik kazanç","Aylık maaşını saatlik kazanca çevir.","Hesaplamalar","hesaplama.html?tool=maas","maaş ücret kazanç"],["TYT–AYT net hesaplama","Doğru ve yanlış sayılarını nete çevir.","Hesaplamalar","hesaplama.html?tool=tytayt","tyt ayt sınav net"],["Tarih arası gün hesaplama","İki tarih arasındaki süreyi hesapla.","Hesaplamalar","hesaplama.html?tool=tarih","tarih gün hafta"],["Vücut kitle indeksi hesaplama","Boy ve kilona göre yaklaşık VKİ hesapla.","Hesaplamalar","hesaplama.html?tool=bmi","bmi vki beden"],["Günlük kalori ihtiyacı","Yaklaşık enerji ihtiyacını hesapla.","Hesaplamalar","hesaplama.html?tool=kalori","kalori enerji beslenme"],["Günlük su tüketimi","Yaklaşık günlük su ihtiyacını hesapla.","Hesaplamalar","hesaplama.html?tool=su","su bardak tüketim"],["Vücut yağ oranı hesaplama","Vücut ölçülerine göre tahmini yağ oranı.","Hesaplamalar","hesaplama.html?tool=yag","vücut yağ oran"],["Hisse kâr zarar hesaplama","Alış ve satış tutarlarından getiri hesapla.","Hesaplamalar","hesaplama.html?tool=hisse","hisse yatırım kar zarar"]];
 for(const [title,excerpt,category,href,searchExtras] of toolEntries)entries.push({kind:"tool",kindLabel:"GELİŞİM ARACI",title,excerpt,category,href,searchExtras,detail:"Ücretsiz araç"});
 const success=sources.filter(s=>s.status==="fulfilled").length;
 if(status)status.textContent=success===4?"Blog, tarif, test ve gelişim araçlarını arayabilirsin.":success===0?"Bazı içerikler yüklenemiyor; gelişim araçlarını yine arayabilirsin.":"Bazı içerik kaynakları şu anda yüklenemedi; erişilebilen içerikler gösteriliyor.";
 const buttons=$$("[data-iya-type]");
 const render=()=>{
   const term=q(input.value.trim()),matches=entries.filter(x=>(selected==="all"||x.kind===selected)&&(!term||q([x.title,x.excerpt,x.category,x.searchExtras].join(" ")).includes(term)));
   const display=!term&&selected==="all"?[
       ...matches.filter(x=>x.kind==="blog").slice(0,4),
       ...matches.filter(x=>x.kind==="recipe").slice(0,5),
       ...matches.filter(x=>x.kind==="test"&&!x.premium).slice(0,3),
       ...matches.filter(x=>x.kind==="test"&&x.premium).slice(0,3),
       ...matches.filter(x=>x.kind==="tool").slice(0,4)
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
   const meta=$("#readerMeta");
   if(meta&&!meta.querySelector(".iya-reading-time")){
     const words=(body.innerText||"").trim().split(/\s+/).filter(Boolean).length;
     if(words){const reading=node("span","iya-reading-time"," · "+Math.max(1,Math.ceil(words/200))+" dk okuma");meta.appendChild(reading);}
   }
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
