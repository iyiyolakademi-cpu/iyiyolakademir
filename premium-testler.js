/* İyi Yol Akademi – Premium görünümlü Test Merkezi
   Tamamen istemci tarafında çalışır; ödeme/kullanıcı hesabı doğrulaması yapmaz. */
(function(){
"use strict";
const lib=window.PT_LIBRARY;
const root=document.getElementById("ptRoot");
if(!root || !lib || !Array.isArray(lib.tests)){return;}
const $=(q,from=document)=>from.querySelector(q);
const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const categories=Object.fromEntries(lib.categories);
const current={category:"all",query:"",test:null,index:0,answers:[]};
const hero=$("#ptHero"),catalog=$("#ptCatalog"),info=$(".pt-info"),space=$("#ptWorkspace"),exam=$("#ptExam"),report=$("#ptReport");
const filters=$("#ptFilters"),cards=$("#ptCards"),search=$("#ptSearch"),count=$("#ptShown"),toast=$("#ptToast");
const STORAGE_PREFIX="iya_pt_draft_v1_";
const SAVED_KEY="iya_pt_saved_results_v1";
let toastTimer;
function flash(message){
 toast.textContent=message;toast.hidden=false;
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,3100);
}
function readJson(storage,key,fallback){
 try {const raw=storage.getItem(key);return raw?JSON.parse(raw):fallback;}
 catch(_) {return fallback;}
}
function writeJson(storage,key,value){
 try{storage.setItem(key,JSON.stringify(value));return true;}
 catch(_) {flash("Bu tarayıcıda kayıt kullanılamıyor.");return false;}
}
function draftKey(id){return STORAGE_PREFIX+id;}
function saveDraft(){
 if(!current.test)return;
 writeJson(localStorage,draftKey(current.test.id),{index:current.index,answers:current.answers});
}
function loadDraft(test){
 const saved=readJson(localStorage,draftKey(test.id),null)||readJson(sessionStorage,draftKey(test.id),null);
 if(!saved||!Array.isArray(saved.answers)||saved.answers.length!==test.questions.length)return null;
 const max=test.mode==="logic"?4:test.mode==="scale"?7:5;
 if(saved.answers.some(x=>x!==null&&(!Number.isInteger(x)||x<1||x>max)))return null;
 return saved;
}
function updateLocation(id,replace=false){
 const url=new URL(window.location.href);
 if(id)url.searchParams.set("test",id);
 else url.searchParams.delete("test");
 const method=replace?"replaceState":"pushState";
 try{history[method]({ptTest:id||null},"",url.pathname+url.search+url.hash);}catch(_){}
}
function jumpTop(){
 const y=root.getBoundingClientRect().top+window.scrollY-24;
 window.scrollTo({top:Math.max(0,y),behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
}
function setCatalogVisibility(visible){
 hero.hidden=!visible;catalog.hidden=!visible;info.hidden=!visible;
 space.hidden=visible;
}
function showCatalog(opts={}){
 current.test=null;current.index=0;current.answers=[];
 setCatalogVisibility(true);
 report.hidden=true;exam.hidden=false;
 if(!opts.fromHistory)updateLocation(null);
 renderCards();jumpTop();
}
function savedResults(){const v=readJson(localStorage,SAVED_KEY,{});return v&&typeof v==="object"&&!Array.isArray(v)?v:{};}
function hasSaved(id){return Boolean(savedResults()[id]);}
function filterButton([key,label]){
 return '<button type="button" class="pt-filter" data-filter="'+esc(key)+'" aria-pressed="'+String(current.category===key)+'">'+esc(label)+'</button>';
}
function renderFilters(){
 filters.innerHTML=lib.categories.map(filterButton).join("");
 filters.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
  current.category=btn.dataset.filter;renderFilters();renderCards();
 }));
}
function renderCards(){
 const query=current.query.trim().toLocaleLowerCase("tr-TR");
 const matched=lib.tests.filter(t=>(current.category==="all"||t.category===current.category)&&
  (!query||(t.title+" "+t.description+" "+(categories[t.category]||"")).toLocaleLowerCase("tr-TR").includes(query)));
 count.textContent=matched.length+" test";
 cards.innerHTML=matched.map(t=>'<article class="pt-card">'+
  '<div class="pt-card-head"><span class="pt-card-symbol" aria-hidden="true">'+esc(t.icon)+'</span><span class="pt-card-label">'+esc(categories[t.category]||"Keşif")+'</span></div>'+
  '<h3>'+esc(t.title)+'</h3><p>'+esc(t.description)+'</p>'+
  '<div class="pt-card-footer"><span class="pt-card-meta">'+t.questions.length+' soru · '+Math.max(3,Math.round(t.questions.length/5))+' dk'+(hasSaved(t.id)?" · ✓ Kaydedildi":"")+(loadDraft(t)?.answers.some(v=>v!==null)?" · Yarım kalan test":"")+'</span>'+
  '<button type="button" data-open="'+esc(t.id)+'" aria-label="'+esc(t.title)+' testini aç">'+(loadDraft(t)?.answers.some(v=>v!==null)?"Devam et →":"Teste başla ↗")+'</button></div></article>').join("")||
  '<div class="pt-empty">Aramana uygun bir test bulunamadı. Farklı bir kelime veya kategori dene.</div>';
 cards.querySelectorAll("button[data-open]").forEach(btn=>btn.addEventListener("click",()=>openTest(btn.dataset.open)));
}
function openTest(id,opts={}){
 const test=lib.tests.find(t=>t.id===id);
 if(!test){flash("İstenen test bulunamadı.");return;}
 const saved=loadDraft(test);
 current.test=test;
 current.index=saved?Math.min(Math.max(0,saved.index),test.questions.length-1):0;
 current.answers=saved?saved.answers.slice():Array(test.questions.length).fill(null);
 setCatalogVisibility(false);
 exam.hidden=false;report.hidden=true;
 if(!opts.fromHistory)updateLocation(id);
 renderQuestion();jumpTop();
 if(saved&&saved.answers.some(v=>v!==null))flash("Yarım bıraktığın testin cevapları geri getirildi.");
}
const scaleLabels=["Kesinlikle katılıyorum","Katılıyorum","Biraz katılıyorum","Kararsızım","Biraz katılmıyorum","Katılmıyorum","Kesinlikle katılmıyorum"];
const interestLabels=["Hiç sevmem","Sevmem","Kararsızım","Severim","Çok severim"];
const duoLabels=["A bana çok yakın","A bana daha yakın","İkisi de eşit","B bana daha yakın","B bana çok yakın"];
function makeScale(value,selected,mode){
 const label=mode==="interest"?interestLabels:scaleLabels;
 const total=label.length;
 const buttons=[];
 for(let v=1;v<=total;v++){
  const chosen=selected===v;
  buttons.push('<button type="button" class="pt-scale-choice pt-answer-choice" data-choice="'+v+'" aria-pressed="'+chosen+'" aria-label="'+esc(label[v-1])+'" title="'+esc(label[v-1])+'">'+(chosen?"✓":v)+'</button>');
 }
 return '<div class="pt-scale-head"><span>'+(mode==="interest"?"Hiç sevmem":"Katılıyorum")+'</span><span>'+(mode==="interest"?"Çok severim":"Katılmıyorum")+'</span></div>'+
 '<div class="pt-scale-options" role="group" aria-label="Cevap seçenekleri">'+buttons.join("")+'</div>'+
 '<div class="pt-answer-caption" id="ptAnswerCaption" role="status">'+(selected===null?"Bir seçenek seç":esc(label[selected-1]))+'</div>';
}
function makeDuo(q,answer){
 const choices=Array.from({length:5},(_,i)=>'<button type="button" class="pt-duo-choice pt-answer-choice" data-choice="'+(i+1)+'" aria-pressed="'+String(answer===i+1)+'" aria-label="'+esc(duoLabels[i])+'">'+(answer===i+1?"✓":i+1)+'</button>').join("");
 return '<div class="pt-duo-cards"><div class="pt-duo-card"><small>YAKLAŞIM A</small><p>'+esc(q.a)+'</p></div><div class="pt-duo-card"><small>YAKLAŞIM B</small><p>'+esc(q.b)+'</p></div></div>'+
 '<div class="pt-duo-labels"><span>A seçeneğine yakın</span><span>B seçeneğine yakın</span></div>'+
 '<div class="pt-duo-choices" role="group" aria-label="İki yaklaşımı karşılaştır">'+choices+'</div>'+
 '<div class="pt-answer-caption" id="ptAnswerCaption" role="status">'+(answer===null?"Sana en yakın seçeneği işaretle":esc(duoLabels[answer-1]))+'</div>';
}
function makeOptions(q,answer){
 return '<div class="pt-options" role="group" aria-label="Yanıt seçenekleri">'+
  q.options.map((label,i)=>'<button type="button" class="pt-option pt-answer-choice" data-choice="'+(i+1)+'" aria-pressed="'+String(answer===i+1)+'"><i aria-hidden="true">'+(answer===i+1?"✓":String.fromCharCode(65+i))+'</i>'+esc(label)+'</button>').join("")+'</div>';
}
function renderQuestion(){
 const t=current.test;if(!t)return;
 const i=current.index,total=t.questions.length,q=t.questions[i],answer=current.answers[i];
 const progress=Math.round(((i+1)/total)*100);
 const instruction=t.mode==="duo"?"A ve B arasında hangisi sana daha yakın?":t.mode==="interest"?"Bu faaliyetle uğraşmak sana ne kadar çekici geliyor?":t.mode==="logic"?"En uygun yanıtı seç.":"Bu ifade seni ne kadar anlatıyor?";
 const title=t.mode==="duo"?"Sana hangi yaklaşım daha yakın?":q.text;
 const answers=t.mode==="duo"?makeDuo(q,answer):t.mode==="logic"?makeOptions(q,answer):makeScale(null,answer,t.mode);
 exam.innerHTML='<div class="pt-exam-card">'+
  '<div class="pt-exam-heading"><span class="pt-exam-title">'+esc(t.title)+'</span><span class="pt-exam-category">'+esc(categories[t.category])+'</span></div>'+
  '<p class="pt-exam-intro">'+esc(t.description)+'</p>'+
  '<div class="pt-exam-heading"><span class="pt-q-overline">SORU '+String(i+1).padStart(2,"0")+' / '+String(total).padStart(2,"0")+'</span><span class="pt-q-overline">'+progress+'%</span></div>'+
  '<div class="pt-progress-line" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'" aria-label="Test ilerlemesi"><i style="width:'+progress+'%"></i></div>'+
  '<p class="pt-question">'+esc(title)+'</p><p class="pt-helper">'+esc(instruction)+'</p>'+
  answers+
  '<div class="pt-exam-nav"><button type="button" id="ptPrev" '+(i===0?"disabled":"")+'>← Önceki</button><button type="button" id="ptNext" class="pt-next" '+(answer===null?"disabled":"")+'>'+(i===total-1?"Sonuçlarımı gör →":"Sonraki soru →")+'</button></div>'+
  '<div class="pt-question-note">Doğru ya da yanlış kişilik cevabı yoktur. Yarım kalan testin bu cihazın tarayıcısında saklanır.</div></div>';
 exam.querySelectorAll(".pt-answer-choice").forEach(btn=>btn.addEventListener("click",()=>chooseAnswer(Number(btn.dataset.choice))));
 $("#ptPrev",exam).addEventListener("click",()=>navigate(-1));
 $("#ptNext",exam).addEventListener("click",()=>navigate(1));
}
function chooseAnswer(value){
 if(!current.test)return;
 current.answers[current.index]=value;
 saveDraft();
 const t=current.test,answerText=t.mode==="duo"?duoLabels[value-1]:t.mode==="interest"?interestLabels[value-1]:t.mode==="scale"?scaleLabels[value-1]:"";
 exam.querySelectorAll(".pt-answer-choice").forEach(btn=>{
  const selected=Number(btn.dataset.choice)===value;
  btn.setAttribute("aria-pressed",String(selected));
  if(t.mode==="logic")btn.querySelector("i").textContent=selected?"✓":String.fromCharCode(64+Number(btn.dataset.choice));
  else if(t.mode!=="logic")btn.textContent=selected?"✓":btn.dataset.choice;
 });
 const caption=$("#ptAnswerCaption",exam);
 if(caption)caption.textContent=answerText;
 $("#ptNext",exam).disabled=false;
}
function navigate(delta){
 if(!current.test)return;
 if(delta>0 && current.answers[current.index]===null){flash("Devam etmek için bir cevap seç.");return;}
 const next=current.index+delta;
 if(next<0 || next>=current.test.questions.length){
  if(next>=current.test.questions.length && current.answers.every(v=>v!==null))renderReport();
  return;
 }
 current.index=next;saveDraft();renderQuestion();
 const question=$(".pt-question",exam);
 if(question)question.setAttribute("tabindex","-1"),question.focus({preventScroll:true});
 jumpTop();
}
function dimensionsFor(t){
 const max=t.mode==="interest"?5:t.mode==="duo"?5:7;
 return t.dims.map(d=>{
  let values=[];
  t.questions.forEach((q,i)=>{
   if(q.dim!==d.key||current.answers[i]===null)return;
   let val=current.answers[i];
   if(t.mode==="scale")val=max+1-val;
   if(q.reverse)val=max+1-val;
   values.push(val);
  });
  const avg=values.length?values.reduce((a,b)=>a+b,0)/values.length:1;
  const percent=Math.max(0,Math.min(100,Math.round((avg-1)*100/(max-1))));
  const detail=percent>=58?d.high:percent<=42?d.low:"Bu alanda her iki yaklaşım arasında dengeli yanıtlar verdin; koşullara göre farklı tercihler gösterebilirsin.";
  return {...d,percent,detail};
 });
}
function reportMarkup(t){
 const total=t.questions.length;
 const intro='<span class="pt-report-eyebrow">KİŞİSEL KEŞİF RAPORU · '+esc(categories[t.category])+'</span>'+
  '<h2>'+esc(t.title)+'</h2><p>'+esc(t.description)+'</p>';
 let score="",results="";
 if(t.mode==="logic"){
  const correct=t.questions.reduce((sum,q,i)=>sum+(current.answers[i]-1===q.correct?1:0),0);
  score='<div class="pt-score-top"><div class="pt-big-score"><strong>'+correct+'/'+total+'</strong><small>DOĞRU</small></div><div><strong>Alıştırma tamamlandı.</strong><p>Bu sayı yalnızca bu alıştırmadaki doğru yanıtlarını gösterir; bir zekâ veya IQ puanı değildir.</p></div></div>';
  results='<div class="pt-report-section"><h3>Yanıt kontrolü</h3><div class="pt-results">'+t.questions.map((q,i)=>{
   const yes=current.answers[i]-1===q.correct;
   return '<div class="pt-result-row"><div class="pt-result-line"><span>'+esc((i+1)+'. '+q.text)+'</span><span>'+(yes?"Doğru":"Gözden geçir")+'</span></div><p class="pt-result-detail">Doğru seçenek: '+esc(q.options[q.correct])+'</p></div>';
  }).join("")+'</div></div>';
 }else{
  const dims=dimensionsFor(t);
  score='<div class="pt-score-top"><div class="pt-big-score"><strong>'+total+'/'+total+'</strong><small>YANIT</small></div><div><strong>Kendine dair yeni bir bakış açısı.</strong><p>Bu grafikler yalnızca verdiğin yanıtların ortalamasını özetler. Yüzdelik dilim veya toplumla karşılaştırma değildir.</p></div></div>';
  results='<div class="pt-report-section"><h3>Yanıt eğilimlerin</h3><div class="pt-results">'+dims.map(d=>
   '<div class="pt-result-row"><div class="pt-result-line"><span>'+esc(d.label)+'</span><span>'+d.percent+'/100</span></div>'+
   '<div class="pt-bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+d.percent+'" aria-label="'+esc(d.label)+'"><i style="width:'+d.percent+'%"></i></div>'+
   '<p class="pt-result-detail">'+esc(d.detail)+'</p></div>'
  ).join("")+'</div></div>';
 }
 const tips='<div class="pt-report-section"><h3>Bundan sonra ne yapabilirsin?</h3>'+t.tips.map((tip,i)=>
  '<p class="pt-tip"><b>'+String(i+1).padStart(2,"0")+'</b><span>'+esc(tip)+'</span></p>').join("")+'</div>';
 return '<div class="pt-report-card">'+intro+score+results+tips+
 '<div class="pt-report-actions"><button type="button" id="ptSaveResult">Sonuç merkezime kaydet</button><a class="pt-btn pt-btn-light" href="test-sonuclari.html">Sonuçlarım ↗</a><button type="button" id="ptPrint">PDF olarak yazdır</button><button type="button" id="ptRetry">Tekrar yap</button><button type="button" id="ptRemoveSave">Kaydı sil</button></div>'+
 '<p class="pt-smallprint">Bilgilendirme: Bu testler İyi Yol Akademi tarafından hazırlanmış özgün öz değerlendirme ve alıştırmalardır. Klinik, mesleki tanı veya standartlaştırılmış psikometrik ölçüm yerine geçmez. Yanıtların otomatik olarak sunucuya gönderilmez; kaydetmeyi seçersen yalnızca kullandığın cihazın tarayıcısına kaydedilir. Paylaşılan cihazlarda kaydı silmeni öneririz.</p>'+
 '</div>';
}
function renderReport(){
 const t=current.test;if(!t)return;
 if(current.answers.some(v=>v===null)){flash("Önce tüm soruları yanıtla.");return;}
 exam.hidden=true;report.hidden=false;
 report.innerHTML=reportMarkup(t);
 $("#ptSaveResult",report).addEventListener("click",()=>{
  const all=savedResults();
  all[t.id]={id:t.id,title:t.title,answers:current.answers.slice(),savedAt:new Date().toISOString()};
  if(writeJson(localStorage,SAVED_KEY,all)){
    if(window.IYA_TEST_CENTER){
      const dims=t.mode==="logic"?[]:dimensionsFor(t);
      const right=t.mode==="logic"?t.questions.reduce((sum,q,i)=>sum+(current.answers[i]-1===q.correct?1:0),0):null;
      window.IYA_TEST_CENTER.add({type:"premium",testId:t.id,title:t.title,category:categories[t.category]||"Keşif",score:right===null?null:Math.round(right*100/t.questions.length),scoreLabel:right===null?"Boyut raporu":right+"/"+t.questions.length+" doğru",level:"Kişisel keşif değerlendirmesi",description:t.description,dimensions:dims,advice:t.tips});
    }
    flash("Raporun sonuç merkezine kaydedildi.");
    renderCards();
   }
 });
 $("#ptRemoveSave",report).addEventListener("click",()=>{
  const all=savedResults();delete all[t.id];
  if(writeJson(localStorage,SAVED_KEY,all)){window.IYA_TEST_CENTER?.remove("premium",t.id);flash("Bu testin cihazdaki kayıtları silindi.");renderCards();}
 });
 $("#ptPrint",report).addEventListener("click",()=>window.print());
 $("#ptRetry",report).addEventListener("click",()=>{
  current.index=0;current.answers=Array(t.questions.length).fill(null);
  try{localStorage.removeItem(draftKey(t.id));sessionStorage.removeItem(draftKey(t.id));}catch(_){}
  report.hidden=true;exam.hidden=false;renderQuestion();jumpTop();
 });
 try{localStorage.removeItem(draftKey(t.id));sessionStorage.removeItem(draftKey(t.id));}catch(_){}
 jumpTop();
}
$("#ptBack").addEventListener("click",()=>showCatalog());
search.addEventListener("input",()=>{current.query=search.value;renderCards();});
window.addEventListener("popstate",()=>{
 const id=new URLSearchParams(location.search).get("test");
 if(id&&lib.tests.some(t=>t.id===id))openTest(id,{fromHistory:true});
 else showCatalog({fromHistory:true});
});
$("#ptTestCount").textContent=String(lib.tests.length);
renderFilters();renderCards();
const initial=new URLSearchParams(location.search).get("test");
if(initial&&lib.tests.some(t=>t.id===initial))openTest(initial,{fromHistory:true});
})();