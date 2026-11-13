/* İyi Yol Akademi | Hedef, alışkanlık, program ve duygu merkezi.
   Tüm bilgiler bu cihazın tarayıcısında kalır. */
(() => {
"use strict";
const KEY="iya-growth-center-v1";
const OLD_TASK_KEY="iyi-yol-akademi-tasks-v1";
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const pad=n=>String(n).padStart(2,"0");
const day=(d=new Date())=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const date=s=>{let a=String(s).split("-").map(Number);return new Date(a[0],a[1]-1,a[2],12,0,0)};
const addDays=(s,n)=>{let d=date(s);d.setDate(d.getDate()+n);return day(d)};
const weekStart=s=>{let d=date(s);d.setDate(d.getDate()-(d.getDay()+6)%7);return day(d)};
const tr=s=>date(s).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uuid=()=>window.crypto&&crypto.randomUUID?crypto.randomUUID():"id-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const capped=(s,n=180)=>String(s||"").trim().slice(0,n);
const number=(v,min=0,max=999999)=>Math.min(max,Math.max(min,Math.floor(Number(v)||0)));
const TODAY=day(), PERIODS={daily:"Günlük",weekly:"Haftalık",monthly:"Aylık",yearly:"Yıllık"};
const MOODS=[{score:1,emoji:"😞",label:"Zor bir gün"},{score:2,emoji:"😕",label:"Biraz düşük"},{score:3,emoji:"😐",label:"Dengeli"},{score:4,emoji:"🙂",label:"İyi"},{score:5,emoji:"😊",label:"Çok iyi"}];
const TEMPLATES=[
  {id:"farkindalik7",name:"7 Gün Kendime Zaman",days:7,type:"check",desc:"Her gün kendin için küçük bir farkındalık molası.",action:"Bugünkü farkındalık çalışmamı yaptım."},
  {id:"rutin21",name:"21 Günlük İyi Alışkanlık",days:21,type:"check",desc:"Kendin için seçtiğin küçük alışkanlığa her gün devam et.",action:"Bugünkü küçük adımımı gerçekleştirdim."},
  {id:"okuma30",name:"30 Günde Okuma Alışkanlığı",days:30,type:"pages",desc:"Okuduğun sayfaları kaydet. Ara verdiğinde kaldığın yerden sürdür.",action:"Bugün kaç sayfa okudun?"}
];

const HABIT_PRESETS=[["10 dakika kitap oku","daily"],["15 dakika yürüyüş yap","daily"],["5 dakika nefes egzersizi","daily"],["Günümü 3 maddeyle planla","weekdays"],["Haftalık değerlendirme yap","weekly"]];
function habitSummary(h){
 const days=Array.from({length:7},(_,i)=>addDays(TODAY,i-6)),marked=days.filter(d=>h.logs[d]).length;
 if(h.frequency==="weekly")return {label:"Son 7 gün "+marked+" kayıt",streak:"Haftalık alışkanlık"};
 let count=0,at=h.logs[TODAY]?TODAY:addDays(TODAY,-1);
 for(let n=0;n<365;n++,at=addDays(at,-1)){
  const weekday=date(at).getDay();
  if(h.frequency==="weekdays"&&(weekday===0||weekday===6))continue;
  if(!h.logs[at])break;
  count++;
 }
 const due=days.filter(d=>h.frequency!=="weekdays"||![0,6].includes(date(d).getDay())).length;
 return {label:"Son 7 gün "+marked+" / "+due,streak:count?count+" planlı gün üst üste":"Bugün yeniden başlayabilirsin"};
}
const PROGRAM_GUIDES={
 farkindalik7:[
 "Kendine iyi gelen üç küçük şeyi yaz.","Bugün 5 dakika boyunca dikkatini nefesine ver.",
 "Seni mutlu eden bir anı hatırla.","Bugün kendin için küçük bir mola ayır.",
 "Zor bir düşünceni yargılamadan yaz.","İyi geldiğini bildiğin bir davranışı tekrar et.","Bu haftanın en anlamlı kazanımını not al."
 ],
 rutin21:[
 "Küçük alışkanlığını bugün yap ve ne zaman yaptığını not al.","Alışkanlığı kolaylaştıran bir ortam oluştur.",
 "Başlamanı zorlaştıran tek bir engeli azalt.","Alışkanlığını günlük bir rutine bağla.","İlk dört günün nasıl geçtiğini düşün.","Gerekirse hedefini küçült, ama sürdür.","İlk haftanı değerlendir: işe yarayan ne?",
 "Bugün sadece başlamaya odaklan.","Alışkanlık için sabit bir saat dene.","Kendine nazik bir hatırlatma yaz.","İlerlemeni bir cümleyle özetle.","Alışkanlığı daha keyifli kılacak bir değişiklik yap.","Bugünkü küçük çabanı fark et.","İkinci haftayı değerlendir.",
 "Bugün de küçük adımına devam et.","Bir zor günü nasıl kolaylaştırabileceğini düşün.","Yeni bir engel varsa onu azalt.","Hangi saatlerde daha rahat yaptığını gözlemle.","Kendine iyi gelen kısmını not al.","Bugünkü adımını tamamla ve kendini kutla.","Üç haftalık deneyiminden öğrendiklerini yaz."
 ]
};
function programGuide(t,completed){
 if(t.id==="okuma30"){
  const n=completed+1;
  if(n<=7)return "Bugün rahat bir yerde birkaç sayfa oku. Okuduğun sayfayı kaydet.";
  if(n<=14)return "Okumaya başlamak için kısa bir zaman aralığı ayır.";
  if(n<=21)return "Okuduklarından aklında kalan bir fikri not al.";
  return "Okuma düzenini sürdür; bu alışkanlığı gelecek aya nasıl taşıyacağını düşün.";
 }
 return (PROGRAM_GUIDES[t.id]||[])[completed]||t.action;
}

const blank=()=>({goals:[],habits:[],programs:[],moods:[],reviews:[],settings:{notifications:false}});
function clean(data){
  let out=blank();
  if(!data||typeof data!=="object"||Array.isArray(data))return out;
  if(Array.isArray(data.goals))out.goals=data.goals.slice(0,200).filter(g=>g&&typeof g.title==="string"&&PERIODS[g.period]).map(g=>({id:capped(g.id,80)||uuid(),title:capped(g.title),period:g.period,target:number(g.target,1,100000),unit:capped(g.unit,30),counts:g.counts&&typeof g.counts==="object"&&!Array.isArray(g.counts)?Object.fromEntries(Object.entries(g.counts).slice(-450).filter(([k])=>/^[\d-]{4,10}$/.test(k)).map(([k,v])=>[k,number(v)])):{},reminder:/^\d{2}:\d{2}$/.test(g.reminder||"")?g.reminder:""}));
  if(Array.isArray(data.habits))out.habits=data.habits.slice(0,100).filter(h=>h&&typeof h.title==="string").map(h=>({id:capped(h.id,80)||uuid(),title:capped(h.title),frequency:["daily","weekdays","weekly"].includes(h.frequency)?h.frequency:"daily",logs:h.logs&&typeof h.logs==="object"&&!Array.isArray(h.logs)?Object.fromEntries(Object.entries(h.logs).slice(-900).filter(([k,v])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&v===true)):{} ,reminder:/^\d{2}:\d{2}$/.test(h.reminder||"")?h.reminder:""}));
  if(Array.isArray(data.programs))out.programs=data.programs.slice(0,100).filter(p=>p&&TEMPLATES.some(t=>t.id===p.templateId)).map(p=>({id:capped(p.id,80)||uuid(),templateId:p.templateId,started:capped(p.started,10)||TODAY,logs:Array.isArray(p.logs)?p.logs.slice(0,30).map(v=>({date:/^\d{4}-\d{2}-\d{2}$/.test(v.date)?v.date:TODAY,pages:number(v.pages,0,10000)})):[]}));
  if(Array.isArray(data.moods))out.moods=data.moods.slice(-800).filter(m=>m&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)).map(m=>({date:m.date,score:number(m.score,1,5),energy:number(m.energy,1,5),note:capped(m.note,1500),good:capped(m.good,600)}));
  if(Array.isArray(data.reviews))out.reviews=data.reviews.slice(-200).filter(r=>r&&/^\d{4}-\d{2}-\d{2}$/.test(r.week)).map(r=>({week:r.week,win:capped(r.win,1000),learn:capped(r.learn,1000),next:capped(r.next,1000)}));
  if(data.settings&&typeof data.settings==="object")out.settings.notifications=data.settings.notifications===true;
  return out;
}
let state;
try{state=clean(JSON.parse(localStorage.getItem(KEY)||"null"))}catch(_){state=blank()}
let tab=["ozet","gorevler","hedefler","aliskanliklar","programlar","duygu","haftalik"].includes(location.hash.slice(1))?location.hash.slice(1):"ozet";
let moodDate=TODAY, reviewWeek=weekStart(TODAY), habitOffset=0;
let currentMessage="";
const root=document.createElement("div");root.id="growthRoot";root.className="growth-root container";
const main=$("#main");
const taskIntro=$(".task-intro"),taskWorkspace=$(".task-workspace");
if(!main||!taskIntro||!taskWorkspace)return;
const legacy=document.createElement("div");
legacy.id="growthPanel-gorevler";legacy.className="growth-panel";legacy.hidden=true;
legacy.append(taskIntro,taskWorkspace);
main.prepend(root);
main.append(legacy);
const TABS=[["ozet","Genel Bakış"],["gorevler","Günlük Görevler"],["hedefler","Hedeflerim"],["aliskanliklar","Alışkanlıklar"],["programlar","Gelişim Programları"],["duygu","Duygu Günlüğü"],["haftalik","Haftalık Değerlendirme"]];
const panels={};
const shell=document.createElement("div");
shell.innerHTML='<div class="growth-hero"><div><div class="growth-eyebrow">İYİ YOL AKADEMİ / KİŞİSEL GELİŞİM</div><h1>Hedef ve Alışkanlık <em>Merkezi</em></h1><p>Hedeflerini düzenle, alışkanlıklarını sürdür, duygularını anla. Küçük adımların burada birikiyor.</p></div><div class="growth-hero-side"><span class="growth-hero-icon">✳</span><strong>Kendi hızında ilerle.</strong><small>Bir gün ara vermek ilerlemeni silmez.</small></div></div><div class="growth-tabs" role="tablist" aria-label="Gelişim merkezi bölümleri"></div><div id="growthFlash" class="growth-flash" role="status" aria-live="polite"></div><div id="growthPanels"></div>';
root.append(...Array.from(shell.children));
const tabs=$(".growth-tabs",root), target=$("#growthPanels",root);
TABS.forEach(([id,label])=>{
  const b=document.createElement("button");b.type="button";b.className="growth-tab";b.textContent=label;b.dataset.tab=id;b.id="growthTab-"+id;b.setAttribute("role","tab");b.setAttribute("aria-controls","growthPanel-"+id);
  tabs.append(b);
  if(id!=="gorevler"){const p=document.createElement("section");p.className="growth-panel";p.id="growthPanel-"+id;p.setAttribute("role","tabpanel");p.setAttribute("aria-labelledby",b.id);p.hidden=true;target.append(p);panels[id]=p}
});
legacy.setAttribute("role","tabpanel");legacy.setAttribute("aria-labelledby","growthTab-gorevler");panels.gorevler=legacy;
const notify=msg=>{currentMessage=msg;const n=$("#growthFlash");n.textContent=msg;n.hidden=!msg;window.clearTimeout(notify.timer);notify.timer=window.setTimeout(()=>{n.textContent="";n.hidden=true},4300)};
function persist(){
  try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(_){notify("Tarayıcı depolaması kullanılamıyor. Değişiklik kaydedilemedi.");return false}
}
function transaction(fn,msg){
  const old=JSON.stringify(state);fn();if(!persist()){state=clean(JSON.parse(old));render();return}render();if(msg)notify(msg);
}
function key(g,at=TODAY){
  if(g.period==="daily")return at;
  if(g.period==="weekly")return weekStart(at);
  if(g.period==="monthly")return at.slice(0,7);
  return at.slice(0,4);
}
const count=g=>number(g.counts[key(g)]||0);
const doneHabit=(h,at=TODAY)=>!!h.logs[at];
function freqText(f){return {daily:"Her gün",weekdays:"Hafta içi",weekly:"Haftada bir"}[f]||"Her gün"}
function dueHabit(h,at=TODAY){if(h.frequency==="weekdays"){let n=date(at).getDay();return n!==0&&n!==6}if(h.frequency==="weekly"){let w=weekStart(at);return !Object.keys(h.logs).some(d=>h.logs[d]&&weekStart(d)===w)}return true}
function weekCount(h){const start=weekStart(TODAY);return Object.keys(h.logs).filter(d=>h.logs[d]&&d>=start&&d<=TODAY).length}
function periodStats(){
  let goals=state.goals.filter(g=>count(g)>=g.target).length;
  let habits=state.habits.filter(h=>doneHabit(h)).length;
  let steps=state.programs.reduce((n,p)=>n+p.logs.filter(x=>x.date>=weekStart(TODAY)&&x.date<=TODAY).length,0);
  let mood=state.moods.find(m=>m.date===TODAY);
  return {goals,habits,steps,mood};
}
const bar=(now,total)=>'<div class="growth-bar" aria-label="İlerleme: '+Math.min(100,Math.round(now/(total||1)*100))+' yüzde"><span style="width:'+Math.min(100,Math.round(now/(total||1)*100))+'%"></span></div>';
const empty=(title,detail)=>'<div class="growth-empty"><span aria-hidden="true">✳</span><h3>'+esc(title)+'</h3><p>'+esc(detail)+'</p></div>';
const sectionTitle=(tag,title,desc)=>'<div class="growth-section-title"><div><span class="growth-overline">'+esc(tag)+'</span><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div></div>';
function overview(){
  const s=periodStats();
  let todayHabits=state.habits.filter(h=>dueHabit(h)||doneHabit(h));
  let active=state.programs.filter(p=>{let t=TEMPLATES.find(x=>x.id===p.templateId);return t&&p.logs.length<t.days});
  let todayTasks=[],weeklyTasks=[];
  try{
    const items=JSON.parse(localStorage.getItem(OLD_TASK_KEY)||"[]");
    if(Array.isArray(items)){todayTasks=items.filter(x=>x.day===TODAY);weeklyTasks=items.filter(x=>x.day>=addDays(TODAY,-6)&&x.day<=TODAY);}
  }catch(_){}
  const oldCount=todayTasks.filter(x=>!x.done).length;
  const topTasks=todayTasks.filter(x=>!x.done).sort((a,b)=>({high:0,medium:1,low:2}[a.priority]??1)-({high:0,medium:1,low:2}[b.priority]??1)).slice(0,3);
  const habitWeek=state.habits.reduce((n,h)=>n+Object.keys(h.logs).filter(d=>h.logs[d]&&d>=addDays(TODAY,-6)&&d<=TODAY).length,0);
  const programWeek=state.programs.reduce((n,p)=>n+p.logs.filter(x=>x.date>=addDays(TODAY,-6)&&x.date<=TODAY).length,0);
  panels.ozet.innerHTML=sectionTitle("GÜNÜN ÖZETİ","Bugün kendin için bir adım","Küçük bir ilerleme bile kıymetli.")
  +'<div class="growth-stats"><div><span>Aktif hedefler</span><strong>'+state.goals.length+'</strong><small>'+s.goals+' hedef tamamlandı</small></div><div><span>Bugünkü alışkanlıklar</span><strong>'+s.habits+' / '+todayHabits.length+'</strong><small>İşaretlenen adımlar</small></div><div><span>Bu haftaki program adımı</span><strong>'+s.steps+'</strong><small>Ara vermek sorun değil</small></div><div><span>Bekleyen görevler</span><strong>'+oldCount+'</strong><small>Günlük planlayıcın</small></div></div>'
  +'<div class="growth-pulse-row"><div><span>Son 7 günde</span><strong>'+weeklyTasks.filter(x=>x.done).length+'</strong><small>görev tamamlandı</small></div><div><span>Son 7 günde</span><strong>'+habitWeek+'</strong><small>alışkanlık işaretlendi</small></div><div><span>Son 7 günde</span><strong>'+programWeek+'</strong><small>program adımı tamamlandı</small></div></div>'
  +'<article class="growth-card growth-today-focus"><div><span class="growth-overline">BUGÜNÜN ÖNCELİKLERİ</span><h3>Önce küçük bir adım</h3>'+(topTasks.length?'<ul>'+topTasks.map(x=>'<li>'+esc(x.title)+'</li>').join("")+'</ul>':'<p>Bugün için bekleyen görevin yok. İstersen yeni bir görev ekleyebilirsin.</p>')+'</div><button type="button" class="growth-secondary" data-tab="gorevler">Görevlerime git →</button></article>'
  +'<div class="growth-two-cols"><article class="growth-card"><div class="growth-card-heading"><div><span class="growth-overline">BUGÜNÜN ALIŞKANLIKLARI</span><h3>Günlük adımların</h3></div><button class="growth-link" data-tab="aliskanliklar" type="button">Tümünü gör →</button></div>'
  +(todayHabits.length?todayHabits.slice(0,6).map(h=>'<div class="growth-quick-row"><button type="button" data-action="habit-today" data-id="'+esc(h.id)+'" class="growth-tick '+(doneHabit(h)?"is-checked":"")+'" aria-label="'+esc(h.title)+' tamamla">'+(doneHabit(h)?"✓":"")+'</button><span>'+esc(h.title)+'</span></div>').join(""):empty("Henüz alışkanlık eklemedin","İlk küçük adımını belirleyerek başlayabilirsin."))
  +'</article><article class="growth-card"><div class="growth-card-heading"><div><span class="growth-overline">GELİŞİM YOLCULUĞU</span><h3>Devam eden programlar</h3></div><button class="growth-link" data-tab="programlar" type="button">Programlar →</button></div>'
  +(active.length?active.slice(0,3).map(p=>{let t=TEMPLATES.find(x=>x.id===p.templateId);return '<div class="growth-progress-row"><strong>'+esc(t.name)+'</strong><small>'+p.logs.length+' / '+t.days+' gün</small>'+bar(p.logs.length,t.days)+'</div>'}).join(""):empty("Bir program seç","7, 21 veya 30 günlük bir yolculuğa katıl."))
  +'</article></div>'
  +'<div class="growth-two-cols"><article class="growth-card growth-gentle"><span class="growth-overline">DUYGU GÜNLÜĞÜ</span><h3>Bugün nasıl hissediyorsun?</h3><p>'+(s.mood?"Bugünkü kaydın: "+MOODS[s.mood.score-1].emoji+" "+MOODS[s.mood.score-1].label:"Bir iki dakikanı kendine ayır. Hislerini yazmak zorunda değilsin; bir duygu seçmek de yeterli.")+'</p><button class="growth-primary" data-tab="duygu" type="button">'+(s.mood?"Bugünkü kaydı düzenle":"Duygumu kaydet")+' →</button></article><article class="growth-card"><span class="growth-overline">BU HAFTANIN KISA ÖZETİ</span><h3>Haftanı değerlendir</h3><p>Bu hafta ne iyi gitti? Gelecek hafta için tek bir öncelik belirle.</p><button class="growth-secondary" data-tab="haftalik" type="button">Haftalık değerlendirme →</button></article></div>'
  +'<article class="growth-card growth-tools"><div><h3>Verilerinin kontrolü sende</h3><p>Kayıtların bu tarayıcıda saklanır, başka bir cihazla otomatik eşitlenmez. Yedek alabilir veya geri yükleyebilirsin. Duygu günlüğün dahil tüm gelişim bilgilerin yedeğe girer; dosyayı güvenli sakla.</p></div><div class="growth-actions"><button class="growth-secondary" type="button" data-action="backup">Yedek indir</button><button class="growth-secondary" type="button" data-action="restore">Yedek yükle</button><button class="growth-text-danger" type="button" data-action="reset">Gelişim verilerini sil</button></div></article>';
}
function goals(){
  panels.hedefler.innerHTML=sectionTitle("GÜNLÜK · HAFTALIK · AYLIK · YILLIK","Hedeflerim","Her hedefin ilerlemesi kendi döneminde tutulur; yeni dönemde sıfırdan başlar, geçmiş kayıtlar korunur.")
  +'<div class="growth-card"><details class="growth-details" id="growthGoalDetails"><summary>＋ Yeni hedef oluştur</summary><form id="growthGoalForm" class="growth-form"><label>Hedef adı<input name="title" maxlength="120" required placeholder="Örneğin: Kitap oku"></label><div class="growth-form-grid"><label>Dönem<select name="period"><option value="daily">Günlük</option><option value="weekly">Haftalık</option><option value="monthly">Aylık</option><option value="yearly">Yıllık</option></select></label><label>Hedef miktarı<input name="target" type="number" min="1" max="100000" value="20" required></label><label>Birim<input name="unit" maxlength="30" value="sayfa" placeholder="sayfa, dakika, kez"></label><label>Hatırlatma saati (isteğe bağlı)<input name="reminder" type="time"></label></div><button class="growth-primary" type="submit">Hedefi kaydet</button></form></details></div>'
  +(state.goals.length?'<div class="growth-grid-list">'+state.goals.map(g=>{let n=count(g);let percent=Math.min(100,Math.round(n/g.target*100));return '<article class="growth-card growth-goal"><div class="growth-goal-head"><div><span class="growth-pill">'+PERIODS[g.period]+'</span><h3>'+esc(g.title)+'</h3><p>'+n+' / '+g.target+' '+esc(g.unit||"adım")+'</p></div><strong>'+percent+'%</strong></div>'+bar(n,g.target)+'<div class="growth-actions"><button class="growth-primary small" type="button" data-action="goal-plus" data-id="'+esc(g.id)+'">＋ 1 ekle</button><button class="growth-secondary small" type="button" data-action="goal-plus-five" data-id="'+esc(g.id)+'">＋ 5 ekle</button><button class="growth-secondary small" type="button" data-action="goal-minus" data-id="'+esc(g.id)+'" '+(n===0?"disabled":"")+'>− 1</button><button class="growth-secondary small" type="button" data-action="goal-edit" data-id="'+esc(g.id)+'">Düzenle</button><button class="growth-secondary small" type="button" data-action="goal-set" data-id="'+esc(g.id)+'">İlerleme gir</button><button class="growth-text-danger small" type="button" data-action="goal-delete" data-id="'+esc(g.id)+'">Sil</button></div>'+(g.reminder?'<small class="growth-footnote">Hatırlatma: '+esc(g.reminder)+' · Site açıkken bildirim</small>':'')+'</article>'}).join("")+'</div>':empty("İlk hedefini ekle","Günde 20 sayfa okumak gibi ulaşılabilir bir hedef seç."));
}
function habits(){
 const first=addDays(TODAY,habitOffset-13);
 const presets='<div class="growth-preset-head"><span class="growth-overline">HAZIR KÜÇÜK ADIMLAR</span><p>Tek dokunuşla başlayabilirsin.</p></div><div class="growth-habit-presets">'+HABIT_PRESETS.map(([title,frequency],i)=>'<button class="growth-preset-button" type="button" data-action="habit-preset" data-preset="'+i+'">＋ '+esc(title)+'</button>').join("")+'</div>';
 panels.aliskanliklar.innerHTML=sectionTitle("ALIŞKANLIK TAKVİMİ","Küçük adımlar, güçlü rutinler","Bir gün ara vermek başarısızlık değildir. Takvimin sana yol göstersin.")
 +'<div class="growth-card growth-habit-create">'+presets+'<details class="growth-details"><summary>＋ Kendi alışkanlığımı oluştur</summary><form id="growthHabitForm" class="growth-form"><label>Alışkanlık adı<input name="title" maxlength="120" required placeholder="Örneğin: 10 dakika yürüyüş"></label><div class="growth-form-grid"><label>Sıklık<select name="frequency"><option value="daily">Her gün</option><option value="weekdays">Hafta içi</option><option value="weekly">Haftada bir</option></select></label><label>Hatırlatma saati (isteğe bağlı)<input name="reminder" type="time"></label></div><button class="growth-primary" type="submit">Alışkanlık ekle</button></form></details></div>'
 +(state.habits.length?'<div class="growth-calendar-head"><strong>14 günlük görünüm</strong><div class="growth-actions"><button class="growth-secondary small" data-action="habit-prev" type="button">← Önceki</button><button class="growth-secondary small" data-action="habit-next" type="button" '+(habitOffset>=0?"disabled":"")+'>Sonraki →</button></div></div><div class="growth-grid-list">'+state.habits.map(h=>{
  const days=Array.from({length:14},(_,i)=>addDays(first,i)),summary=habitSummary(h);
  const edit='<details class="growth-habit-editor"><summary>Alışkanlığı düzenle</summary><form class="growth-form growth-edit-form" data-form="habit-edit" data-id="'+esc(h.id)+'"><label>Alışkanlık adı<input name="title" maxlength="120" required value="'+esc(h.title)+'"></label><div class="growth-form-grid"><label>Sıklık<select name="frequency"><option value="daily" '+(h.frequency==="daily"?"selected":"")+'>Her gün</option><option value="weekdays" '+(h.frequency==="weekdays"?"selected":"")+'>Hafta içi</option><option value="weekly" '+(h.frequency==="weekly"?"selected":"")+'>Haftada bir</option></select></label><label>Hatırlatma saati<input name="reminder" type="time" value="'+esc(h.reminder||"")+'"></label></div><button class="growth-primary small" type="submit">Değişiklikleri kaydet</button></form></details>';
  return '<article class="growth-card growth-habit"><div class="growth-card-heading"><div><span class="growth-overline">'+freqText(h.frequency)+'</span><h3>'+esc(h.title)+'</h3><p>'+esc(summary.label)+' · '+esc(summary.streak)+'</p></div><button class="growth-text-danger small" data-action="habit-delete" data-id="'+esc(h.id)+'" type="button">Sil</button></div><div class="growth-14days">'+days.map(d=>{
   let checked=doneHabit(h,d),future=d>TODAY,label=date(d).toLocaleDateString("tr-TR",{weekday:"short"});
   return '<button type="button" class="growth-day '+(checked?"is-done ":"")+(d===TODAY?"is-today":"")+'" data-action="habit-date" data-id="'+esc(h.id)+'" data-date="'+d+'" '+(future?"disabled":"")+' aria-pressed="'+checked+'" aria-label="'+esc(tr(d)+" "+h.title)+'"><small>'+esc(label)+'</small><strong>'+Number(d.slice(-2))+'</strong><span>'+(checked?"✓":"·")+'</span></button>';
  }).join("")+'</div>'+edit+(h.reminder?'<small class="growth-footnote">Hatırlatma: '+esc(h.reminder)+' · Site açıkken</small>':'')+'</article>';
 }).join("")+'</div>':empty("Alışkanlıkların burada görünecek","Hazır küçük adımlardan birini seçebilir veya kendin oluşturabilirsin."));
}
function programs(){
 panels.programlar.innerHTML=sectionTitle("KENDİ HIZINDA GELİŞ","7, 21 ve 30 günlük programlar","Her adım kişisel takvimine kaydedilir. Bir gün ara versen de kaldığın yerden devam edebilirsin.")
 +'<div class="growth-program-templates">'+TEMPLATES.map(t=>{
  const active=state.programs.some(p=>p.templateId===t.id&&p.logs.length<t.days);
  return '<article class="growth-card growth-template"><span class="growth-pill">'+t.days+' GÜN</span><h3>'+esc(t.name)+'</h3><p>'+esc(t.desc)+'</p><button class="growth-secondary" data-action="program-start" data-template="'+t.id+'" type="button">'+(active?"Programa devam et →":"Programa başla →")+'</button></article>';
 }).join("")+'</div><h2 class="growth-subhead">Programlarım</h2>'
 +(state.programs.length?'<div class="growth-grid-list">'+state.programs.map(p=>{
  const t=TEMPLATES.find(x=>x.id===p.templateId);
  const n=p.logs.length,complete=n>=t.days,alreadyToday=p.logs.some(x=>x.date===TODAY);
  const pages=p.logs.reduce((s,x)=>s+x.pages,0);
  const milestone=n===0?"Başlangıç":n>=t.days?"Tamamlandı":n>=Math.ceil(t.days*.75)?"Son aşama":n>=Math.ceil(t.days*.5)?"Yarı yolu geçtin":n>=Math.ceil(t.days*.25)?"İlk adımlar kaydedildi":"Yeni başladın";
  const tiles='<div class="growth-program-tiles" aria-label="'+n+' / '+t.days+' adım tamamlandı">'+Array.from({length:t.days},(_,i)=>'<span class="'+(i<n?"is-done ":"")+(i===n?"is-next":"")+'" title="'+(i+1)+'. adım">'+(i<n?"✓":i+1)+'</span>').join("")+'</div>';
  const history=n?'<details class="growth-program-history"><summary>Önceki adımlar ('+n+')</summary><ol>'+p.logs.map((x,i)=>'<li>'+Number(i+1)+'. adım · '+esc(tr(x.date))+(t.type==="pages"?" · "+x.pages+" sayfa":"")+'</li>').join("")+'</ol><button class="growth-secondary small" data-action="program-undo" data-id="'+esc(p.id)+'" type="button">Son adımı geri al</button></details>':'';
  const action=complete?'<div class="growth-success">Programın tüm adımlarını tamamladın. Kendi hızında yeni bir yolculuğa başlayabilirsin.</div>':alreadyToday?'<div class="growth-success">Bugünkü adımın tamamlandı. Bir sonraki adıma yarın devam edebilirsin.</div>':'<div class="growth-program-next"><span class="growth-step-kicker">SIRADAKİ ADIM · '+(n+1)+' / '+t.days+'</span><p>'+esc(programGuide(t,n))+'</p>'+(t.type==="pages"?'<label class="growth-page-label">Bugün okuduğun sayfa <input type="number" min="1" max="10000" placeholder="Örn. 15" data-pages="'+esc(p.id)+'"></label>':'')+'<button class="growth-primary" data-action="program-complete" data-id="'+esc(p.id)+'" type="button">Bugünkü adımı tamamla ✓</button></div>';
  return '<article class="growth-card growth-program"><div class="growth-card-heading"><div><span class="growth-overline">'+t.days+' GÜNLÜK PROGRAM · '+esc(milestone)+'</span><h3>'+esc(t.name)+'</h3><p>'+n+' / '+t.days+' adım'+(t.type==="pages"?" · "+pages+" sayfa okundu":"")+'</p></div><button class="growth-text-danger small" type="button" data-action="program-delete" data-id="'+esc(p.id)+'">Sil</button></div>'+bar(n,t.days)+tiles+action+history+'<div class="growth-program-footer"><button class="growth-secondary small" type="button" data-action="program-export" data-id="'+esc(p.id)+'">İlerleme özetini indir ↓</button><span>Boş günler ilerlemeni silmez.</span></div></article>';
 }).join("")+'</div>':empty("Henüz aktif programın yok","Yukarıdaki programlardan birini seçerek ilk adımı at."));
}
function moods(){
  const previous=state.moods.find(m=>m.date===moodDate);
  const score=previous?.score||3, energy=previous?.energy||3;
  panels.duygu.innerHTML=sectionTitle("KENDİNE KULAK VER","Duygu Günlüğü","Hislerini yargılamadan kaydet. Bugünkü yazını daha sonra düzenleyebilirsin.")
  +'<div class="growth-two-cols growth-mood-layout"><article class="growth-card"><form id="growthMoodForm" class="growth-form"><label>Tarih<input type="date" id="growthMoodDate" name="date" max="'+TODAY+'" value="'+moodDate+'"></label><fieldset><legend>O gün nasıl hissediyordun?</legend><div class="growth-mood-options">'+MOODS.map(m=>'<label class="growth-mood-option"><input type="radio" name="score" value="'+m.score+'" '+(score===m.score?"checked":"")+'><span><b>'+m.emoji+'</b><small>'+m.label+'</small></span></label>').join("")+'</div></fieldset><label>Enerji seviyen (1–5)<select name="energy">'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(energy===n?"selected":"")+'>'+n+' / 5</option>').join("")+'</select></label><label>Bugün aklında ne var?<textarea name="note" maxlength="1500" rows="4" placeholder="İçinden geçenleri burada yazabilirsin.">'+esc(previous?.note||"")+'</textarea></label><label>Günümün üç iyi şeyi <small>(önerdiğim ek özellik)</small><textarea name="good" maxlength="600" rows="3" placeholder="Küçük de olsa iyi gelen üç şeyi yaz.">'+esc(previous?.good||"")+'</textarea></label><button class="growth-primary" type="submit">'+(previous?"Kaydı güncelle":"Günlüğü kaydet")+'</button>'+(previous?'<button class="growth-text-danger" type="button" data-action="mood-delete" data-date="'+moodDate+'">Bu kaydı sil</button>':'')+'</form><p class="growth-privacy">🔒 Günlüğün bu cihazın tarayıcısında saklanır. Ortak cihaz kullanıyorsan dikkat et. Bu bir tıbbi değerlendirme veya terapi hizmeti değildir.</p></article>'
  +'<article class="growth-card"><span class="growth-overline">DUYGU GEÇMİŞİ</span><h3>Geçmişe dönüp bak</h3>'+(state.moods.length?state.moods.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30).map(m=>'<button class="growth-mood-history" data-action="mood-open" data-date="'+m.date+'" type="button"><span>'+MOODS[m.score-1].emoji+'</span><span><strong>'+esc(tr(m.date))+'</strong><small>'+MOODS[m.score-1].label+' · Enerji '+m.energy+'/5</small></span><span>→</span></button>').join(""):empty("Henüz günlük kaydın yok","İlk kaydını oluşturduğunda burada görünür."))+'</article></div>';
}
function reviews(){
  const prev=state.reviews.find(r=>r.week===reviewWeek);
  let end=addDays(reviewWeek,6);
  panels.haftalik.innerHTML=sectionTitle("HAFTALIK DEĞERLENDİRME","Bir haftaya dönüp bak","Kendini puanlamak yerine nelerin işe yaradığını keşfet.")
  +'<div class="growth-review-nav"><button class="growth-secondary small" data-action="review-prev" type="button">← Önceki hafta</button><strong>'+esc(tr(reviewWeek))+' – '+esc(tr(end))+'</strong><button class="growth-secondary small" data-action="review-next" type="button" '+(reviewWeek>=weekStart(TODAY)?"disabled":"")+'>Sonraki hafta →</button></div>'
  +'<div class="growth-two-cols"><article class="growth-card"><form id="growthReviewForm" class="growth-form"><label>Bu hafta iyi giden neydi?<textarea name="win" rows="4" maxlength="1000" placeholder="Küçük bir başarı bile olabilir.">'+esc(prev?.win||"")+'</textarea></label><label>Neyi öğrendin veya değiştirmek istiyorsun?<textarea name="learn" rows="4" maxlength="1000" placeholder="Kendine karşı anlayışlı ol.">'+esc(prev?.learn||"")+'</textarea></label><label>Gelecek haftanın tek önceliği ne?<textarea name="next" rows="3" maxlength="1000" placeholder="Örneğin: Günde 10 dakika okumak.">'+esc(prev?.next||"")+'</textarea></label><button class="growth-primary" type="submit">'+(prev?"Değerlendirmeyi güncelle":"Değerlendirmemi kaydet")+'</button></form></article><article class="growth-card"><span class="growth-overline">BU HAFTAKİ ADIMLAR</span><h3>Küçük kazanımlarını gör</h3><div class="growth-week-stats"><div><strong>'+state.habits.reduce((n,h)=>n+Object.keys(h.logs).filter(d=>h.logs[d]&&d>=reviewWeek&&d<=end).length,0)+'</strong><span>Alışkanlık kaydı</span></div><div><strong>'+state.programs.reduce((n,p)=>n+p.logs.filter(x=>x.date>=reviewWeek&&x.date<=end).length,0)+'</strong><span>Program adımı</span></div><div><strong>'+state.moods.filter(m=>m.date>=reviewWeek&&m.date<=end).length+'</strong><span>Duygu günlüğü kaydı</span></div></div><p>Her hafta aynı miktarda ilerlemek zorunda değilsin. Bu alan bir yarış değil, kendini gözlemleme fırsatı.</p></article></div>'
  +(state.reviews.length?'<div class="growth-card growth-review-history"><h3>Önceki değerlendirmelerin</h3>'+state.reviews.slice().sort((a,b)=>b.week.localeCompare(a.week)).slice(0,6).map(r=>'<button class="growth-secondary small" data-action="review-open" data-date="'+r.week+'" type="button">'+esc(tr(r.week))+'</button>').join(" ")+'</div>':'');
}
const renderers={ozet:overview,hedefler:goals,aliskanliklar:habits,programlar:programs,duygu:moods,haftalik:reviews};
function render(){
  Object.values(renderers).forEach(fn=>fn());
  $$(".growth-tab",root).forEach(b=>{let active=b.dataset.tab===tab;b.classList.toggle("is-active",active);b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1});
  Object.entries(panels).forEach(([id,p])=>{p.hidden=id!==tab});
  const flash=$("#growthFlash");flash.hidden=!flash.textContent;
}
function navigate(id,hash=true){
  if(!panels[id])return;
  tab=id;if(hash&&location.hash!=="#"+id)history.replaceState(null,"","#"+id);
  render();const heading=$("#growthRoot .growth-tabs");if(heading)heading.scrollIntoView({behavior:"smooth",block:"start"});
}
function notifyBrowser(){
  if(!state.settings.notifications||!("Notification" in window)||Notification.permission!=="granted")return;
  const now=new Date(),hm=pad(now.getHours())+":"+pad(now.getMinutes());
  const work=[
    ...state.goals.filter(g=>g.reminder&&count(g)<g.target).map(g=>({title:g.title,time:g.reminder})),
    ...state.habits.filter(h=>h.reminder&&dueHabit(h)&&!doneHabit(h)).map(h=>({title:h.title,time:h.reminder}))
  ];
  work.forEach(x=>{if(x.time!==hm)return;const mark="iya-reminder-"+TODAY+"-"+x.title+"-"+x.time;if(sessionStorage.getItem(mark))return;sessionStorage.setItem(mark,"1");new Notification("İyi Yol Akademi",{body:"Küçük bir hatırlatma: "+x.title,icon:"brand-transparent.svg"})});
}
function download(filename,content,type){
  let blob=new Blob([content],{type:type||"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
root.addEventListener("click",async e=>{
  const jump=e.target.closest("[data-tab]");if(jump){navigate(jump.dataset.tab);return}
  const b=e.target.closest("[data-action]");if(!b)return;
  const a=b.dataset.action,id=b.dataset.id;
  if(a==="goal-plus"||a==="goal-plus-five"||a==="goal-minus"){transaction(()=>{let g=state.goals.find(x=>x.id===id);if(!g)return;let k=key(g);g.counts[k]=number((g.counts[k]||0)+(a==="goal-minus"?-1:a==="goal-plus-five"?5:1))},"Hedef ilerlemen kaydedildi.");return}
  if(a==="goal-set"){let g=state.goals.find(x=>x.id===id);if(!g)return;let value=prompt("Bu dönem için tamamladığın toplam "+(g.unit||"adım")+" miktarı:",count(g));if(value===null)return;let n=Number(value);if(!Number.isInteger(n)||n<0||n>999999){notify("0 ile 999999 arasında tam sayı gir.");return}transaction(()=>{g.counts[key(g)]=n},"İlerlemen güncellendi.");return}
  if(a==="goal-delete"){if(!confirm("Bu hedefi ve ilerleme kayıtlarını silmek istiyor musun?"))return;transaction(()=>{state.goals=state.goals.filter(g=>g.id!==id)},"Hedef silindi.");return}
  if(a==="goal-edit"){let g=state.goals.find(x=>x.id===id);if(!g)return;let title=prompt("Hedefin yeni adı:",g.title);if(title===null)return;title=capped(title,120);if(!title)return;let target=prompt("Yeni hedef miktarı:",g.target);if(target===null)return;let n=Number(target);if(!Number.isInteger(n)||n<1||n>100000){notify("Hedef miktarı 1–100000 arasında tam sayı olmalı.");return}let unit=prompt("Ölçü birimi:",g.unit);if(unit===null)return;let reminder=prompt("Hatırlatma saati (SS:DD; istemiyorsan boş):",g.reminder||"");if(reminder===null)return;if(reminder&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminder)){notify("Saati 09:30 biçiminde yaz.");return}transaction(()=>{g.title=title;g.target=n;g.unit=capped(unit,30);g.reminder=reminder},"Hedef güncellendi.");return}
  if(a==="habit-preset"){
    const preset=HABIT_PRESETS[Number(b.dataset.preset)];
    if(!preset)return;
    if(state.habits.some(h=>h.title.toLocaleLowerCase("tr-TR")===preset[0].toLocaleLowerCase("tr-TR"))){notify("Bu alışkanlığı daha önce ekledin.");return}
    if(state.habits.length>=100){notify("En fazla 100 alışkanlık oluşturabilirsin.");return}
    transaction(()=>{state.habits.unshift({id:uuid(),title:preset[0],frequency:preset[1],logs:{},reminder:""});tab="aliskanliklar"},"Alışkanlık eklendi. Bugün işaretleyerek başlayabilirsin.");return;
  }
  if(a==="habit-today"||a==="habit-date"){let at=a==="habit-today"?TODAY:b.dataset.date;let h=state.habits.find(x=>x.id===id);if(!h||at>TODAY)return;transaction(()=>{if(h.logs[at])delete h.logs[at];else h.logs[at]=true},"Alışkanlık takvimi güncellendi.");return}
  if(a==="habit-delete"){if(!confirm("Alışkanlığı ve işaretlenmiş günleri silmek istiyor musun?"))return;transaction(()=>{state.habits=state.habits.filter(h=>h.id!==id)},"Alışkanlık silindi.");return}
  if(a==="habit-prev"){habitOffset-=14;render();return}
  if(a==="habit-next"){habitOffset=Math.min(0,habitOffset+14);render();return}
  if(a==="program-start"){const t=TEMPLATES.find(t=>t.id===b.dataset.template);if(!t)return;transaction(()=>{state.programs.unshift({id:uuid(),templateId:t.id,started:TODAY,logs:[]});tab="programlar";history.replaceState(null,"","#programlar")},"Programın başladı. Her gün kendi hızında ilerleyebilirsin.");return}
  if(a==="program-complete"){let p=state.programs.find(x=>x.id===id);if(!p)return;let t=TEMPLATES.find(x=>x.id===p.templateId);if(p.logs.length>=t.days)return;if(p.logs.some(x=>x.date===TODAY)){notify("Bugünkü adımın kayıtlı. Yarın kaldığın yerden devam edebilirsin.");return}let pages=0;if(t.type==="pages"){const input=$('[data-pages="'+CSS.escape(id)+'"]',root);pages=Number(input?.value);if(!Number.isInteger(pages)||pages<1||pages>10000){notify("Okuduğun sayfa sayısını 1–10000 arasında gir.");input?.focus();return}}transaction(()=>{p.logs.push({date:TODAY,pages})},"Harika! Bir adım daha kaydettin.");return}
  if(a==="program-undo"){let p=state.programs.find(x=>x.id===id);if(!p||!p.logs.length)return;transaction(()=>{p.logs.pop()},"Son adım geri alındı.");return}
  if(a==="program-delete"){if(!confirm("Bu programı ve bütün ilerleme kayıtlarını silmek istiyor musun?"))return;transaction(()=>{state.programs=state.programs.filter(p=>p.id!==id)},"Program kaldırıldı.");return}
  if(a==="mood-open"){moodDate=b.dataset.date;tab="duygu";render();$("#growthMoodDate")?.focus();return}
  if(a==="mood-delete"){if(!confirm("Bu duygu günlüğü kaydını kalıcı olarak silmek istiyor musun?"))return;transaction(()=>{state.moods=state.moods.filter(m=>m.date!==b.dataset.date)},"Günlük kaydı silindi.");return}
  if(a==="review-prev"){reviewWeek=addDays(reviewWeek,-7);render();return}
  if(a==="review-next"){reviewWeek=addDays(reviewWeek,7);render();return}
  if(a==="review-open"){reviewWeek=b.dataset.date;tab="haftalik";render();return}
  if(a==="backup"){download("iyi-yol-akademi-gelisim-yedegi-"+TODAY+".json",JSON.stringify({app:"iyi-yol-akademi-growth",version:1,exportedAt:new Date().toISOString(),data:state},null,2));notify("Yedek indirildi. Duygu günlüğün de dosyanın içinde; güvenli sakla.");return}
  if(a==="restore"){$("#growthRestoreInput").click();return}
  if(a==="reset"){if(!confirm("Hedef, alışkanlık, program, duygu günlüğü ve değerlendirme kayıtlarının tamamı bu tarayıcıdan silinecek. Günlük görev listen korunacak. Emin misin?"))return;transaction(()=>{state=blank()},"Gelişim merkezi kayıtları silindi.");return}
  if(a==="notify"){if(!("Notification" in window)){notify("Bu tarayıcı bildirimleri desteklemiyor.");return}if(Notification.permission==="denied"){notify("Tarayıcı ayarlarından bildirim izni vermen gerekiyor.");return}let status=await Notification.requestPermission();transaction(()=>{state.settings.notifications=status==="granted"},status==="granted"?"Hatırlatmalar bu sayfa açıkken çalışacak.":"Bildirim izni verilmedi.");return}
});
root.addEventListener("submit",e=>{
  const form=e.target;if(!["growthGoalForm","growthHabitForm","growthMoodForm","growthReviewForm"].includes(form.id)&&form.dataset.form!=="habit-edit")return;
  e.preventDefault();const f=new FormData(form);
  if(form.id==="growthGoalForm"){let title=capped(f.get("title"),120),target=Number(f.get("target")),period=f.get("period"),reminder=f.get("reminder")||"";if(!title||!Number.isInteger(target)||target<1||target>100000||!PERIODS[period])return notify("Hedef alanlarını kontrol et.");if(state.goals.length>=200)return notify("En fazla 200 hedef oluşturabilirsin.");transaction(()=>{state.goals.unshift({id:uuid(),title,target,period,unit:capped(f.get("unit"),30),reminder,counts:{}})},"Yeni hedef eklendi.");return}
  if(form.dataset.form==="habit-edit"){
    const h=state.habits.find(x=>x.id===form.dataset.id);
    if(!h)return;
    const title=capped(f.get("title"),120),frequency=f.get("frequency"),reminder=f.get("reminder")||"";
    if(!title||!["daily","weekdays","weekly"].includes(frequency)||(reminder&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminder))){notify("Alışkanlık bilgilerini kontrol et.");return}
    transaction(()=>{h.title=title;h.frequency=frequency;h.reminder=reminder},"Alışkanlık güncellendi.");return;
  }
  if(form.id==="growthHabitForm"){let title=capped(f.get("title"),120),frequency=f.get("frequency");if(!title||!["daily","weekdays","weekly"].includes(frequency))return notify("Alışkanlık bilgilerini kontrol et.");if(state.habits.length>=100)return notify("En fazla 100 alışkanlık oluşturabilirsin.");transaction(()=>{state.habits.unshift({id:uuid(),title,frequency,reminder:f.get("reminder")||"",logs:{}})},"Alışkanlığın eklendi.");return}
  if(form.id==="growthMoodForm"){let dateValue=f.get("date"),score=Number(f.get("score")),energy=Number(f.get("energy"));if(!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)||dateValue>TODAY||score<1||score>5||energy<1||energy>5)return notify("Tarih ve duygu değerlerini kontrol et.");moodDate=dateValue;transaction(()=>{state.moods=state.moods.filter(m=>m.date!==dateValue);state.moods.push({date:dateValue,score,energy,note:capped(f.get("note"),1500),good:capped(f.get("good"),600)})},"Duygu günlüğün kaydedildi.");return}
  if(form.id==="growthReviewForm"){let x={week:reviewWeek,win:capped(f.get("win"),1000),learn:capped(f.get("learn"),1000),next:capped(f.get("next"),1000)};transaction(()=>{state.reviews=state.reviews.filter(r=>r.week!==reviewWeek);state.reviews.push(x)},"Haftalık değerlendirmen kaydedildi.");return}
});
root.addEventListener("change",e=>{if(e.target.id==="growthMoodDate"){moodDate=e.target.value;render()}});
window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(panels[id]){tab=id;render()}});
const restore=document.createElement("input");restore.type="file";restore.accept=".json,application/json";restore.id="growthRestoreInput";restore.hidden=true;root.appendChild(restore);
restore.addEventListener("change",async e=>{
 const file=e.target.files?.[0];e.target.value="";if(!file)return;if(file.size>2000000){notify("Yedek dosyası 2 MB sınırını aşıyor.");return}
 try{const parsed=JSON.parse(await file.text());if(parsed.app!=="iyi-yol-akademi-growth"||!parsed.data||!Array.isArray(parsed.data.goals)||!Array.isArray(parsed.data.habits)){notify("Bu, geçerli bir İyi Yol Akademi gelişim yedeği değil.");return}if(!confirm("Mevcut gelişim kayıtlarının üzerine yedek içeriği yazılacak. Devam edilsin mi?"))return;transaction(()=>{state=clean(parsed.data)},"Gelişim yedeği geri yüklendi.")}catch(_){notify("Yedek okunamadı. Dosyayı kontrol et.")}
});
window.addEventListener('iya:tasks-updated',()=>overview());
const settings=document.createElement("div");settings.className="growth-notification-tools";settings.innerHTML='<button class="growth-secondary small" type="button" data-action="notify">🔔 Site açıkken hatırlatmaları aç</button><small>Tarayıcı bildirimleri sayfa kapalıyken güvenilir biçimde çalışmaz. Saat belirlediğin hedef ve alışkanlıklar için geçerlidir.</small>';
root.appendChild(settings);
render();
window.setInterval(notifyBrowser,30000);
notifyBrowser();
})();
