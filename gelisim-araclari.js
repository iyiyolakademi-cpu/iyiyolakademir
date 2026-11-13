/* İyi Yol Akademi - Kişisel Araçlar (kitap, geleceğe mektup, çalışma, takvim hatırlatması)
   Kayıtlar yalnızca localStorage içindedir. Takvim alarmları harici takvim uygulamasınca yönetilir. */
(() => {
"use strict";
const KEY="iya-personal-tools-v1";
const GROWTH_KEY="iya-growth-center-v1";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const pad=n=>String(n).padStart(2,"0");
const localDay=(dt=new Date())=>dt.getFullYear()+"-"+pad(dt.getMonth()+1)+"-"+pad(dt.getDate());
const localDateTime=(dt=new Date())=>localDay(dt)+"T"+pad(dt.getHours())+":"+pad(dt.getMinutes());
const fromDay=s=>{let v=String(s).split("-").map(Number);return new Date(v[0],v[1]-1,v[2],12)};
const addDays=(s,n)=>{let d=fromDay(s);d.setDate(d.getDate()+n);return localDay(d)};
const weekStart=s=>{let d=fromDay(s);d.setDate(d.getDate()-(d.getDay()+6)%7);return localDay(d)};
const formatDay=s=>fromDay(s).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
const formatDateTime=s=>new Date(s).toLocaleString("tr-TR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});
const safe=s=>String(s==null?"":s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const cleanText=(s,n)=>String(s||"").trim().slice(0,n);
const id=()=>window.crypto&&crypto.randomUUID?crypto.randomUUID():"id-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const int=(v,min=0,max=999999)=>Math.max(min,Math.min(max,Math.floor(Number(v)||0)));
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||""))&&!isNaN(fromDay(s).getTime())&&localDay(fromDay(s))===s;
const validDT=s=>/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(s||""))&&validDate(s.slice(0,10));
const TODAY=localDay(),REPEATS={once:"Bir kez",daily:"Her gün",weekdays:"Hafta içi",weekly:"Her hafta",monthly:"Her ay",yearly:"Her yıl"};
const weekdays=[["1","Pzt"],["2","Sal"],["3","Çar"],["4","Per"],["5","Cum"],["6","Cmt"],["0","Paz"]];
const blank=()=>({books:[],letters:[],plan:null,reminders:[],readingGoal:50,letterDraft:null});
function sanitize(input){
 let out=blank();if(!input||typeof input!=="object"||Array.isArray(input))return out;
 out.readingGoal=int(input.readingGoal||50,1,10000);
 if(input.letterDraft&&typeof input.letterDraft==="object"){const d=input.letterDraft;out.letterDraft={title:cleanText(d.title,140),body:cleanText(d.body,10000),openDate:validDate(d.openDate)?d.openDate:addDays(TODAY,30)};}
 if(Array.isArray(input.books))out.books=input.books.slice(0,150).filter(b=>b&&typeof b.title==="string").map(b=>({
  id:cleanText(b.id,80)||id(),title:cleanText(b.title,140),author:cleanText(b.author,100),pages:int(b.pages,1,100000),initial:int(b.initial,0,100000),created:validDate(b.created)?b.created:TODAY,
  logs:Array.isArray(b.logs)?b.logs.slice(-1500).filter(x=>x&&validDate(x.date)).map(x=>({id:cleanText(x.id,80)||id(),date:x.date,pages:int(x.pages,1,10000)})):[]
 }));
 if(Array.isArray(input.letters))out.letters=input.letters.slice(0,120).filter(l=>l&&typeof l.body==="string"&&validDate(l.openDate)).map(l=>({id:cleanText(l.id,80)||id(),title:cleanText(l.title,140),body:cleanText(l.body,10000),openDate:l.openDate,created:validDate(l.created)?l.created:TODAY}));
 const p=input.plan;if(p&&typeof p==="object"&&validDate(p.examDate)&&Array.isArray(p.entries)){
  out.plan={id:cleanText(p.id,80)||id(),name:cleanText(p.name,120),examDate:p.examDate,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time||"")?p.time:"18:00",
    minutes:int(p.minutes,15,480),weekdays:Array.isArray(p.weekdays)?p.weekdays.map(Number).filter(n=>n>=0&&n<=6):[1,2,3,4,5],
    subjects:Array.isArray(p.subjects)?p.subjects.map(s=>cleanText(s,100)).filter(Boolean).slice(0,15):[],
    entries:p.entries.slice(0,1000).filter(e=>e&&validDate(e.date)).map(e=>({id:cleanText(e.id,80)||id(),date:e.date,subject:cleanText(e.subject,100),minutes:int(e.minutes,1,480),done:e.done===true}))
  };
 }
 if(Array.isArray(input.reminders))out.reminders=input.reminders.slice(0,300).filter(r=>r&&typeof r.title==="string"&&validDT(r.start)&&REPEATS[r.repeat]).map(r=>({id:cleanText(r.id,120)||id(),title:cleanText(r.title,150),start:r.start,repeat:r.repeat,source:cleanText(r.source,150),enabled:r.enabled!==false}));
 return out;
}
let state;
try{state=sanitize(JSON.parse(localStorage.getItem(KEY)||"null"))}catch(_){state=blank()}
const root=$("#toolkit");if(!root)return;
const tabs=["okuma","mektup","calisma","hatirlatma"];
let current=tabs.includes(location.hash.slice(1))?location.hash.slice(1):"okuma";
let opened=new Set(),showAllPlan=false,bookSearch="",bookStatus="all",letterFilter="all";
const notice=(message)=>{const x=$("#toolkit-message");x.textContent=message;x.hidden=false;clearTimeout(notice.timer);notice.timer=setTimeout(()=>{x.textContent="";x.hidden=true},4600)};
function commit(change,message){
 const backup=JSON.stringify(state);
 change();
 try{localStorage.setItem(KEY,JSON.stringify(state))}
 catch(err){state=sanitize(JSON.parse(backup));notice("Tarayıcı depolaması dolu veya kapalı. Değişiklik kaydedilemedi.");draw();return false}
 draw();if(message)notice(message);return true;
}
const panelTitle=(k,t,p)=>'<div class="toolkit-section-intro"><div><span class="toolkit-kicker-sm">'+k+'</span><h2>'+t+'</h2><p>'+p+'</p></div></div>';
const empty=(title,desc)=>'<div class="toolkit-empty"><span class="toolkit-empty-icon" aria-hidden="true">✳</span><strong>'+safe(title)+'</strong><p>'+safe(desc)+'</p></div>';
const progress=(v,total)=>'<div class="toolkit-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.min(100,Math.round(v/Math.max(1,total)*100))+'"><span style="width:'+Math.min(100,Math.round(v/Math.max(1,total)*100))+'%"></span></div>';
const button=(action,title,extra="",classes="secondary small")=>'<button type="button" class="toolkit-btn '+classes+'" data-action="'+action+'" '+extra+'>'+title+'</button>';
const download=(name,content,type)=>{let obj=new Blob([content],{type:type||"application/json;charset=utf-8"});let url=URL.createObjectURL(obj);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)};
const totalRead=b=>b.initial+b.logs.reduce((n,x)=>n+x.pages,0);
const weeklyRead=()=>state.books.reduce((n,b)=>n+b.logs.filter(x=>x.date>=weekStart(TODAY)&&x.date<=TODAY).reduce((s,x)=>s+x.pages,0),0);

const last7Read=()=>state.books.reduce((n,b)=>n+b.logs.filter(x=>x.date>=addDays(TODAY,-6)&&x.date<=TODAY).reduce((a,x)=>a+x.pages,0),0);
const bookReadingDays=()=>new Set(state.books.flatMap(b=>b.logs.filter(x=>x.date>=addDays(TODAY,-6)&&x.date<=TODAY).map(x=>x.date))).size;
const dueLetters=()=>state.letters.filter(l=>l.openDate<=TODAY).length;
const letterPrompts=["Bugün hayatımda en önemli olan şey...","Gelecekteki ben, umarım şunu hatırlarsın...","Bugün verdiğim küçük karar...","Kendime teşekkür etmek istediğim şey..."];

function booksRender(){
 const finished=state.books.filter(b=>totalRead(b)>=b.pages).length;
 const total=state.books.reduce((n,b)=>n+Math.min(b.pages,totalRead(b)),0);
 $("#toolkit-okuma").innerHTML=panelTitle("DİJİTAL KİTAPLIĞIM","Kitap Okuma Takipçisi","Okuduğun sayfaları kaydet, kitaplarının ilerlemesini gör, bitirdiklerini arşivle.")
 +'<div class="toolkit-summaries"><div class="toolkit-summary"><span>Kitaplarım</span><strong>'+state.books.length+'</strong><small>Eklenen kitap</small></div><div class="toolkit-summary"><span>Okunan sayfa</span><strong>'+total+'</strong><small>Toplam ilerleme</small></div><div class="toolkit-summary"><span>Bu hafta</span><strong>'+weeklyRead()+'</strong><small>Yeni sayfa</small></div></div>'
 +'<div class="toolkit-split"><div class="toolkit-card toolkit-soft"><h3>Yeni kitap ekle</h3><p>Okumaya başlayacağın veya hâlihazırda okuduğun kitabı kaydet.</p><form class="toolkit-form" id="toolkit-book-form"><label>Kitap adı<input name="title" required maxlength="140" placeholder="Örneğin: İnsan Ne ile Yaşar?"></label><label>Yazar (isteğe bağlı)<input name="author" maxlength="100" placeholder="Yazarın adı"></label><div class="toolkit-fields"><label>Toplam sayfa<input name="pages" type="number" min="1" max="100000" required placeholder="240"></label><label>Şu ana kadar okunan<input name="initial" type="number" min="0" max="100000" value="0" required></label></div><button type="submit" class="toolkit-btn">Kitabı ekle</button></form><p><a class="toolkit-link" href="yapilacaklar.html#programlar">30 günlük okuma programına da göz at →</a></p></div>'
 +'<div><div class="toolkit-card-header"><h3>Kitaplığım <small style="color:#819084;font-weight:500">('+finished+' tamamlanan)</small></h3></div>'
 +(state.books.length?'<div class="toolkit-grid" style="grid-template-columns:1fr">'+state.books.map(b=>{const currentRead=totalRead(b),pct=Math.min(100,Math.round(currentRead/b.pages*100)),complete=currentRead>=b.pages;
 return '<article class="toolkit-card toolkit-book-card"><div class="toolkit-book-head"><div><span class="toolkit-book-badge '+(complete?"is-finished":"")+'">'+(complete?"Okundu":"Okunuyor")+'</span><h3>'+safe(b.title)+'</h3><small>'+safe(b.author||"Yazar belirtilmedi")+'</small></div>'+button("book-delete","Sil",'data-id="'+safe(b.id)+'"',"secondary small")+'</div><div><div class="toolkit-book-number"><span>İlerleme</span><strong>'+Math.min(currentRead,b.pages)+' / '+b.pages+' sayfa · %'+pct+'</strong></div>'+progress(currentRead,b.pages)+'</div>'
 +(!complete?'<form class="toolkit-book-log" data-form="book-log" data-id="'+safe(b.id)+'"><label>Okunan sayfa<input class="toolkit-inline-input" name="pages" type="number" min="1" max="10000" required placeholder="Örn. 12"></label><label>Tarih<input class="toolkit-inline-input" name="date" type="date" max="'+TODAY+'" value="'+TODAY+'" required></label><button class="toolkit-btn small" type="submit">Kaydet</button></form>':'<div class="toolkit-note"><b>Kitabını tamamladın.</b> Yeni bir kitapla devam edebilirsin.</div>')
 +(b.logs.length?'<details class="toolkit-book-history"><summary>Okuma geçmişi ('+b.logs.length+')</summary><ul>'+b.logs.slice().reverse().slice(0,40).map(l=>'<li>'+safe(formatDay(l.date))+' · '+l.pages+' sayfa <button type="button" data-action="book-log-delete" data-id="'+safe(b.id)+'" data-log="'+safe(l.id)+'" aria-label="Bu okuma kaydını sil">Sil</button></li>').join("")+'</ul></details>':'')
 +'</article>'}).join("")+'</div>':empty("Henüz kitap eklemedin","İlk kitabını ekleyerek kendi okuma geçmişini oluşturmaya başla."))
 +'</div></div>';
}
function lettersRender(){
 const sorted=state.letters.slice().sort((a,b)=>a.openDate.localeCompare(b.openDate));
 $("#toolkit-mektup").innerHTML=panelTitle("GELECEKTEKİ KENDİME","Geleceğe Mektup","Bugünkü düşüncelerini ve umutlarını yaz. Seçtiğin tarih gelene kadar mektubun bu ekranda kapalı kalır.")
 +'<div class="toolkit-split"><div class="toolkit-card toolkit-soft"><h3>Kendine bir mektup yaz</h3><p>Ne hissettiğini, neleri başarmak istediğini veya gelecekte hatırlamak istediğin bir anı yazabilirsin.</p><form class="toolkit-form" id="toolkit-letter-form"><label>Mektubun başlığı<input name="title" maxlength="140" required placeholder="Bir yıl sonraki kendime"></label><label>Açılacağı tarih<input name="openDate" type="date" min="'+addDays(TODAY,1)+'" value="'+addDays(TODAY,30)+'" required></label><label>Mektubun<textarea name="body" rows="9" maxlength="10000" required placeholder="Merhaba gelecekteki ben..."></textarea></label><button type="submit" class="toolkit-btn">Mektubumu mühürle</button></form><p class="toolkit-note">Mektuplar yalnızca bu tarayıcıda tutulur. E-posta ile gönderilmez ve teknik olarak şifreli değildir. Tarayıcı verilerini silersen kaybolabilir; istersen aşağıdan yedek al.</p></div>'
 +'<div><div class="toolkit-card-header"><h3>Mektuplarım</h3><span class="toolkit-book-badge">'+state.letters.length+' mektup</span></div>'
 +(sorted.length?'<div class="toolkit-grid" style="grid-template-columns:1fr">'+sorted.map(l=>{const due=l.openDate<=TODAY,shown=opened.has(l.id)&&due;
 return '<article class="toolkit-card toolkit-letter"><div class="toolkit-card-header"><div><span class="toolkit-kicker-sm">'+(due?"AÇILMAYA HAZIR":"MÜHÜRLÜ MEKTUP")+'</span><h3>'+safe(l.title)+'</h3><span class="toolkit-letter-date">'+safe(formatDay(l.openDate))+' tarihinde açılacak</span></div><span aria-hidden="true">'+(due?"✉":"🔒")+'</span></div>'
 +(shown?'<div class="toolkit-letter-open">'+safe(l.body)+'</div>':due?'<p class="toolkit-countdown">Mektubunun zamanı geldi. Hazırsan açabilirsin.</p>':'<div class="toolkit-letter-locked"><b>✉</b><span>Mektubun saklanıyor. Açılacağı günü bekliyor.</span></div>')
 +'<div class="toolkit-action-row">'+(due?button("letter-open",shown?"Mektubu gizle":"Mektubu aç",'data-id="'+safe(l.id)+'"'):'')
 +button("letter-calendar","Takvime ekle",'data-id="'+safe(l.id)+'"')+
 '<button type="button" class="toolkit-danger" data-action="letter-delete" data-id="'+safe(l.id)+'">Sil</button></div></article>'}).join("")+'</div>':empty("Henüz mektubun yok","Gelecekteki kendine küçük bir not bırak."))
 +'</div></div>';
}
function generateStudy(data){
 const entries=[];let index=0;
 for(let d=TODAY;d<data.examDate;d=addDays(d,1)){
  if(!data.weekdays.includes(fromDay(d).getDay()))continue;
  const subjectsToday=data.subjects.length>1&&data.minutes>=50?2:1;
  let dayMin=data.minutes;
  for(let i=0;i<subjectsToday;i++){
   const subject=data.subjects[(index++)%data.subjects.length],minutes=i===subjectsToday-1?dayMin:Math.floor(data.minutes/subjectsToday);
   entries.push({id:id(),date:d,subject,minutes,done:false});dayMin-=minutes;
  }
  if(entries.length>900)break;
 }
 return entries;
}
function studyRender(){
 const p=state.plan;
 const all=p?p.entries.length:0,completed=p?p.entries.filter(e=>e.done).length:0;
 let visible=p?p.entries.filter(x=>showAllPlan||x.date>=addDays(TODAY,-7)).slice(0,showAllPlan?900:30):[];
 const remaining=p?Math.max(0,Math.round((fromDay(p.examDate)-fromDay(TODAY))/86400000)):0;
 $("#toolkit-calisma").innerHTML=panelTitle("ÖĞRENCİLER İÇİN","Akıllı Çalışma Planlayıcısı","Sınav tarihini, derslerini ve müsait günlerini belirle. Dersleri dengeli şekilde dağıtan bir plan oluştur.")
 +'<div class="toolkit-split"><article class="toolkit-card toolkit-soft"><h3>Yeni çalışma planı</h3><p>Planı hazırladıktan sonra her ders çalışmasını tamamlandı olarak işaretleyebilirsin.</p><form class="toolkit-form" id="toolkit-study-form"><label>Sınav veya hedefin adı<input name="name" maxlength="120" required placeholder="Örneğin: Matematik finali" value="'+safe(p?.name||"")+'"></label><label>Sınav tarihi<input name="examDate" type="date" required min="'+addDays(TODAY,1)+'" max="'+addDays(TODAY,365)+'" value="'+safe(p&&p.examDate>TODAY?p.examDate:addDays(TODAY,30))+'"></label><label>Dersler (her satıra bir ders)<textarea name="subjects" rows="5" required maxlength="1000" placeholder="Matematik&#10;Türkçe&#10;Fizik">'+safe(p?.subjects?.join("\n")||"")+'</textarea></label><div class="toolkit-fields"><label>Günlük çalışma süresi (dakika)<input name="minutes" type="number" min="15" max="480" required value="'+(p?.minutes||60)+'"></label><label>Başlangıç saati<input name="time" type="time" required value="'+(p?.time||"18:00")+'"></label></div><fieldset><legend>Çalışabileceğin günler</legend><div class="toolkit-checkbox-grid">'+weekdays.map(([v,label])=>'<label class="toolkit-checkbox"><input type="checkbox" name="weekdays" value="'+v+'" '+((p?.weekdays||[1,2,3,4,5]).includes(Number(v))?"checked":"")+'>'+label+'</label>').join("")+'</div></fieldset><button class="toolkit-btn" type="submit">'+(p?"Planı yeniden oluştur":"Çalışma planı oluştur")+'</button></form><div class="toolkit-note" style="margin-top:16px">Bu plan dersleri sırayla dengeli dağıtır; sınav konularının zorluk derecesini veya öğrenme durumunu otomatik ölçmez. Gerekirse yeni plan oluşturabilirsin.</div></article>'
 +'<div><div class="toolkit-card"><div class="toolkit-card-header"><div><span class="toolkit-kicker-sm">ÇALIŞMA TAKİBİ</span><h3>'+safe(p?.name||"Planın burada görünecek")+'</h3></div></div>'
 +(p?'<div class="toolkit-study-status"><span>'+completed+' / '+all+' çalışma tamamlandı</span><span>•</span><span>Sınava '+remaining+' gün</span></div>'+progress(completed,all)+'<div class="toolkit-action-row" style="margin-top:16px">'+button("study-calendar","Takvime aktar")+button("study-delete","Planı sil",'',"secondary small")+'</div><p>'+safe(formatDay(p.examDate))+' · '+safe(p.time)+' başlangıç</p>'
 +'<h3>Günlük planım</h3><div class="toolkit-plan-table">'+(visible.length?visible.map(e=>'<div class="toolkit-plan-day '+(e.done?"is-done":"")+'"><div><small>'+safe(formatDay(e.date))+'</small><strong>'+safe(e.subject)+' · '+e.minutes+' dakika '+(e.done?"✓":"")+'</strong></div><div class="toolkit-action-row"><a class="toolkit-btn secondary small" href="pomodoro.html">Pomodoro</a>'+button("study-toggle",e.done?"Geri al":"Tamamla",'data-id="'+safe(e.id)+'"',e.done?"secondary small":"small")+'</div></div>').join(""):empty("Planlanan yeni çalışma yok","Sınav tarihini kontrol edebilirsin."))+'</div>'
 +(p.entries.length>30?'<div class="toolkit-action-row" style="margin-top:14px">'+button("study-more",showAllPlan?"Güncel programı göster":"Bütün planı göster")+'</div>':'')
 :empty("Henüz çalışma planın yok","Sol taraftan sınavını ve derslerini girerek başlayabilirsin."))+'</div></div></div>';
}
function remindersRender(){
 const reminders=state.reminders.slice().sort((a,b)=>a.start.localeCompare(b.start));
 $("#toolkit-hatirlatma").innerHTML=panelTitle("ZAMANINDA HATIRLA","Hatırlatmalarım","Hatırlatma oluştur ve telefonunun veya bilgisayarının takvimine ekle. Takvimin alarmı site kapalıyken de çalışabilir.")
 +'<div class="toolkit-split"><article class="toolkit-card toolkit-soft"><h3>Yeni hatırlatma</h3><p>Bir görev, çalışma saati ya da alışkanlık için kendine bildirim planla.</p><form class="toolkit-form" id="toolkit-reminder-form"><label>Hatırlatma başlığı<input name="title" maxlength="150" required placeholder="Örneğin: 20 sayfa oku"></label><label>Başlangıç tarihi ve saati<input name="start" type="datetime-local" required min="'+localDateTime()+'" value="'+localDateTime(new Date(Date.now()+3600000))+'"></label><label>Tekrar<select name="repeat"><option value="once">Sadece bir kez</option><option value="daily">Her gün</option><option value="weekdays">Hafta içi</option><option value="weekly">Her hafta</option><option value="monthly">Her ay</option><option value="yearly">Her yıl</option></select></label><button class="toolkit-btn" type="submit">Hatırlatmayı kaydet</button></form>'
 +'<div class="toolkit-action-row" style="margin-top:18px">'+button("reminder-permission","Tarayıcı bildirimine izin ver")+button("reminder-import-growth","Hedeflerden aktar")+'</div><p class="toolkit-note" style="margin-top:18px"><b>Önemli:</b> Tarayıcı bildirimi sayfa açıkken çalışır. Site kapalıyken gerçek alarm için hatırlatmaları <b>Takvime Aktar</b> ile cihazının takvim uygulamasına eklemelisin. İçe aktarmadan tek başına bu site kapalıyken bildirim gönderemez.</p></article>'
 +'<div class="toolkit-card"><div class="toolkit-card-header"><div><span class="toolkit-kicker-sm">PLANLANANLAR</span><h3>Hatırlatmalar</h3></div><span class="toolkit-book-badge">'+reminders.length+' kayıt</span></div>'
 +'<div class="toolkit-action-row" style="margin-bottom:15px">'+button("reminder-export","Takvime aktar (.ics)",'',"small")+'</div>'
 +(reminders.length?reminders.map(r=>'<div class="toolkit-reminder-row"><div><h3>'+safe(r.title)+'</h3><p>'+safe(formatDateTime(r.start))+' · '+safe(REPEATS[r.repeat])+(r.enabled?"":" · Kapalı")+'</p></div><div class="toolkit-action-row">'+button("reminder-toggle",r.enabled?"Durdur":"Etkinleştir",'data-id="'+safe(r.id)+'"')+'<button type="button" class="toolkit-danger" data-action="reminder-delete" data-id="'+safe(r.id)+'">Sil</button></div></div>').join(""):empty("Henüz hatırlatman yok","Soldaki formdan ilk hatırlatmanı ekleyebilirsin."))+'</div></div>'
 +'<div class="toolkit-card" style="margin-top:20px"><h3>Takvim bildirimleri nasıl çalışır?</h3><p>1. Hatırlatmanı kaydet. 2. “Takvime aktar” ile <b>.ics</b> dosyasını indir. 3. Dosyayı Google Takvim, Apple Takvim veya kullandığın takvime içe aktar. 4. Takvim uygulamasının bildirim izinlerini açık tut. Bazı takvimler içe aktarılan alarmı değiştirebilir; ilk kaydı kontrol et.</p><p>Gelecekteki kendine yazdığın mektubu ve çalışma planını da ilgili sekmelerden takvime aktarabilirsin.</p></div>';
}
function draw(){
 const f={okuma:booksRender,mektup:lettersRender,calisma:studyRender,hatirlatma:remindersRender};Object.values(f).forEach(fn=>fn());
 $$(".toolkit-tab",root).forEach(t=>{let sel=t.dataset.tab===current;t.classList.toggle("is-active",sel);t.setAttribute("aria-selected",String(sel));t.tabIndex=sel?0:-1});
 tabs.forEach(t=>{$("#toolkit-"+t).hidden=t!==current});
}
function navigate(to,changeHash=true){if(!tabs.includes(to))return;current=to;if(changeHash&&location.hash!=="#"+to)history.replaceState(null,"","#"+to);draw();$(".toolkit-tabs").scrollIntoView({block:"start",behavior:"smooth"})}
function icsEscape(s){return String(s||"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}
function icsDate(s){return String(s).replace(/[-:]/g,"").slice(0,15)+"00"}
function icsEnd(s,minutes=30){let d=new Date(s);d.setMinutes(d.getMinutes()+minutes);return icsDate(localDateTime(d))}
function icsFromEvents(events,name){
 if(!events.length){notice("Aktarılacak kayıt bulunamadı.");return}
 let lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Iyi Yol Akademi//Gelisim//TR","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:İyi Yol Akademi Hatırlatmaları"];
 for(const e of events){
  if(!validDT(e.start))continue;
  lines.push("BEGIN:VEVENT","UID:"+icsEscape(e.id)+"@iyiyolakademi","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""),"DTSTART:"+icsDate(e.start),"DTEND:"+icsEnd(e.start,e.minutes||30),"SUMMARY:"+icsEscape(e.title),"DESCRIPTION:"+icsEscape("İyi Yol Akademi kişisel hatırlatma"));
  let rules={daily:"FREQ=DAILY",weekdays:"FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",weekly:"FREQ=WEEKLY",monthly:"FREQ=MONTHLY",yearly:"FREQ=YEARLY"};
  if(rules[e.repeat])lines.push("RRULE:"+rules[e.repeat]);
  lines.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEscape(e.title),"TRIGGER:PT0S","END:VALARM","END:VEVENT");
 }
 lines.push("END:VCALENDAR");
 const encoder=new TextEncoder();
 const folded=[];
 for(const line of lines){let segment="",bytes=0;for(const char of line){const len=encoder.encode(char).length;if(bytes+len>73){folded.push(segment);segment=" ";bytes=1}segment+=char;bytes+=len}folded.push(segment)}
 download(name,folded.join("\r\n")+"\r\n","text/calendar;charset=utf-8");
 notice("Takvim dosyası hazır. Hatırlatmaların çalışması için dosyayı takvim uygulamana içe aktar.");
}
function eligibleReminder(r,now){
 if(!r.enabled||r.start>localDateTime(now))return false;
 let d=localDay(now),t=pad(now.getHours())+":"+pad(now.getMinutes()),begin=r.start.slice(0,10);
 if(r.start.slice(11)!==t||d<begin)return false;
 if(r.repeat==="once")return d===begin;
 if(r.repeat==="daily")return true;
 if(r.repeat==="weekdays")return now.getDay()!==0&&now.getDay()!==6;
 if(r.repeat==="weekly")return now.getDay()===fromDay(begin).getDay();
 if(r.repeat==="monthly")return now.getDate()===fromDay(begin).getDate();
 if(r.repeat==="yearly")return d.slice(5)===begin.slice(5);
 return false;
}
function tick(){
 const now=new Date(),minute=localDateTime(now);
 for(const r of state.reminders){
  if(!eligibleReminder(r,now))continue;
  let key="iya-tick:"+r.id+":"+minute;
  try{if(sessionStorage.getItem(key))continue;sessionStorage.setItem(key,"1")}catch(_){}
  notice("Hatırlatma: "+r.title);
  if("Notification" in window&&Notification.permission==="granted")try{new Notification("İyi Yol Akademi",{body:r.title,icon:"brand-transparent.svg"})}catch(_){}
 }
}
root.addEventListener("click",async event=>{
 const tabButton=event.target.closest("[data-tab]");if(tabButton){navigate(tabButton.dataset.tab);return}
 const b=event.target.closest("[data-action]");if(!b)return;
 const action=b.dataset.action,targetId=b.dataset.id;
 if(action==="book-delete"){if(!confirm("Bu kitabı ve okuma geçmişini silmek istiyor musun?"))return;commit(()=>{state.books=state.books.filter(x=>x.id!==targetId)},"Kitap silindi.");return}
 if(action==="book-log-delete"){const book=state.books.find(x=>x.id===targetId);if(!book)return;if(!confirm("Bu okuma kaydı silinsin mi?"))return;commit(()=>{book.logs=book.logs.filter(x=>x.id!==b.dataset.log)},"Okuma kaydı kaldırıldı.");return}
 if(action==="letter-delete"){if(!confirm("Mektup ve içeriği kalıcı olarak silinsin mi?"))return;commit(()=>{state.letters=state.letters.filter(l=>l.id!==targetId);opened.delete(targetId)},"Mektup silindi.");return}
 if(action==="letter-open"){const letter=state.letters.find(x=>x.id===targetId);if(!letter||letter.openDate>TODAY)return;opened.has(targetId)?opened.delete(targetId):opened.add(targetId);draw();return}
 if(action==="letter-calendar"){const letter=state.letters.find(x=>x.id===targetId);if(!letter)return;icsFromEvents([{id:"letter-"+letter.id,start:letter.openDate+"T09:00",title:"Kendime mektubum açılıyor: "+letter.title,repeat:"once"}],"gelecege-mektubum.ics");return}
 if(action==="study-toggle"){const p=state.plan;if(!p)return;const e=p.entries.find(x=>x.id===targetId);if(!e)return;commit(()=>{e.done=!e.done},"Çalışma kaydın güncellendi.");return}
 if(action==="study-more"){showAllPlan=!showAllPlan;draw();return}
 if(action==="study-delete"){if(!confirm("Çalışma planını ve işaretlediğin dersleri silmek istiyor musun?"))return;commit(()=>{state.plan=null},"Çalışma planı silindi.");return}
 if(action==="study-calendar"){const p=state.plan;if(!p)return;const spent={};const events=p.entries.map(e=>{const begin=new Date(e.date+"T"+p.time);begin.setMinutes(begin.getMinutes()+(spent[e.date]||0));spent[e.date]=(spent[e.date]||0)+e.minutes;return {id:"study-"+e.id,title:"Ders çalış: "+e.subject+" ("+e.minutes+" dk)",start:localDateTime(begin),minutes:e.minutes,repeat:"once"}});icsFromEvents(events,"calisma-planim.ics");return}
 if(action==="reminder-delete"){if(!confirm("Bu hatırlatma silinsin mi? Takvim uygulamana eklediysen oradan ayrıca silmelisin."))return;commit(()=>{state.reminders=state.reminders.filter(x=>x.id!==targetId)},"Hatırlatma silindi. Daha önce aktardığın takvim kayıtları etkilenmez.");return}
 if(action==="reminder-toggle"){let r=state.reminders.find(x=>x.id===targetId);if(!r)return;commit(()=>{r.enabled=!r.enabled},"Hatırlatma durumu değişti. Takvime aktarılan kayıtlardan bağımsızdır.");return}
 if(action==="reminder-export"){icsFromEvents(state.reminders.filter(x=>x.enabled),"iyi-yol-hatirlatmalarim.ics");return}
 if(action==="reminder-permission"){
  if(!("Notification" in window))return notice("Tarayıcın bildirimleri desteklemiyor.");
  try{const result=await Notification.requestPermission();notice(result==="granted"?"Tarayıcı izni verildi. Hatırlatmalar sayfa açıkken gösterilebilir.":"Bildirim izni verilmedi. Kapalıyken bildirim için takvim kullanabilirsin.")}catch(_){notice("Bildirim izni alınamadı. Takvime aktar seçeneğini kullanabilirsin.")}
  return;
 }
 if(action==="reminder-import-growth"){
  let g;try{g=JSON.parse(localStorage.getItem(GROWTH_KEY)||"null")}catch(_){}
  if(!g||!Array.isArray(g.goals)||!Array.isArray(g.habits))return notice("Hedef ve alışkanlıklarda saatli hatırlatma bulamadım.");
  let upcoming=[];
  for(const item of g.goals){
   if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.reminder||""))continue;
   const repeat={daily:"daily",weekly:"weekly",monthly:"monthly",yearly:"yearly"}[item.period]||"daily";
   upcoming.push({id:"import-goal-"+item.id,title:"Hedef: "+item.title,start:TODAY+"T"+item.reminder,repeat,source:"goal:"+item.id,enabled:true});
  }
  for(const item of g.habits){
   if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(item.reminder||""))continue;
   const repeat=item.frequency==="weekdays"?"weekdays":item.frequency==="weekly"?"weekly":"daily";
   upcoming.push({id:"import-habit-"+item.id,title:"Alışkanlık: "+item.title,start:TODAY+"T"+item.reminder,repeat,source:"habit:"+item.id,enabled:true});
  }
  upcoming=upcoming.filter(e=>!state.reminders.some(x=>x.source===e.source)).slice(0,Math.max(0,300-state.reminders.length));
  if(!upcoming.length)return notice("Yeni saatli hatırlatma bulunamadı. Hedef ve alışkanlıklara saat ekleyebilirsin.");
  commit(()=>{state.reminders.push(...upcoming)} ,upcoming.length+" hatırlatma aktarıldı. Takvim dosyasını yeniden indirmeyi unutma.");return;
 }
 if(action==="backup"){download("iyi-yol-kisisel-araclar-"+TODAY+".json",JSON.stringify({app:"iya-personal-tools",version:1,created:new Date().toISOString(),data:state},null,2));notice("Yedek indirildi. Mektupların da içeride; dosyayı gizli sakla.");return}
 if(action==="restore"){$("#toolkit-restore-file").click();return}
});
root.addEventListener("submit",event=>{
 const form=event.target,formId=form.id;const fd=new FormData(form);
 if(!["toolkit-book-form","toolkit-letter-form","toolkit-study-form","toolkit-reminder-form"].includes(formId)&&form.dataset.form!=="book-log")return;
 event.preventDefault();
 if(formId==="toolkit-book-form"){
  let title=cleanText(fd.get("title"),140),author=cleanText(fd.get("author"),100),pages=Number(fd.get("pages")),initial=Number(fd.get("initial"));
  if(!title||!Number.isInteger(pages)||pages<1||pages>100000||!Number.isInteger(initial)||initial<0||initial>pages)return notice("Kitap adı, toplam sayfa ve okunan sayfa bilgilerini kontrol et.");
  if(state.books.length>=150)return notice("En fazla 150 kitap ekleyebilirsin.");
  commit(()=>{state.books.unshift({id:id(),title,author,pages,initial,created:TODAY,logs:[]})},"Kitabın eklendi.");return;
 }
 if(form.dataset.form==="book-log"){
  const book=state.books.find(b=>b.id===form.dataset.id);if(!book)return;
  let pages=Number(fd.get("pages")),d=fd.get("date");
  if(!validDate(d)||d>TODAY||!Number.isInteger(pages)||pages<1||pages>10000||totalRead(book)+pages>book.pages)return notice("Tarih ve sayfa sayısını kontrol et. Toplam sayfa sınırını aşma.");
  commit(()=>{book.logs.push({id:id(),date:d,pages})},"Bugünkü okuman kaydedildi.");return;
 }
 if(formId==="toolkit-letter-form"){
  const title=cleanText(fd.get("title"),140),body=cleanText(fd.get("body"),10000),openDate=String(fd.get("openDate")||"");
  if(!title||!body||!validDate(openDate)||openDate<=TODAY)return notice("Mektubun başlığı, metni ve gelecekteki açılma tarihini kontrol et.");
  if(state.letters.length>=120)return notice("En fazla 120 mektup saklayabilirsin.");
  commit(()=>{state.letters.unshift({id:id(),title,body,openDate,created:TODAY})},"Mektubun mühürlendi. İstersen takvimine hatırlatma ekleyebilirsin.");return;
 }
 if(formId==="toolkit-study-form"){
  const name=cleanText(fd.get("name"),120),examDate=String(fd.get("examDate")||""),minutes=Number(fd.get("minutes")),time=String(fd.get("time")||""),
  subjects=[...new Set(String(fd.get("subjects")||"").split(/\r?\n/).map(x=>cleanText(x,100)).filter(Boolean))].slice(0,15),
  selected=fd.getAll("weekdays").map(Number).filter(v=>v>=0&&v<=6);
  if(!name||!validDate(examDate)||examDate<=TODAY||examDate>addDays(TODAY,365)||!Number.isInteger(minutes)||minutes<15||minutes>480||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)||!subjects.length||!selected.length)return notice("Sınav tarihi, dersler, çalışma süresi ve müsait günleri kontrol et.");
  if(state.plan&&!confirm("Mevcut plan ve tamamlanma işaretleri yenisiyle değişecek. Devam etmek istiyor musun?"))return;
  const newPlan={id:id(),name,examDate,minutes,time,subjects,weekdays:selected,entries:[]};
  newPlan.entries=generateStudy(newPlan);
  if(!newPlan.entries.length)return notice("Seçtiğin tarihe kadar uygun çalışma günü bulunamadı.");
  showAllPlan=false;
  commit(()=>{state.plan=newPlan},newPlan.entries.length+" çalışma oturumu planlandı.");return;
 }
 if(formId==="toolkit-reminder-form"){
  let title=cleanText(fd.get("title"),150),start=String(fd.get("start")||""),repeat=String(fd.get("repeat")||"");
  if(!title||!validDT(start)||!REPEATS[repeat]||start<=localDateTime())return notice("Başlangıç saatini ileri bir zaman olarak belirle.");
  if(state.reminders.length>=300)return notice("En fazla 300 hatırlatma ekleyebilirsin.");
  commit(()=>{state.reminders.unshift({id:id(),title,start,repeat,source:"",enabled:true})},"Hatırlatma kaydedildi. Kapalıyken çalışması için takvime aktarman gerekiyor.");return;
 }
});
$("#toolkit-restore-file").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";if(!file)return;
 if(file.size>3000000)return notice("Yedek dosyası 3 MB sınırını aşıyor.");
 try{const imported=JSON.parse(await file.text());if(imported.app!=="iya-personal-tools"||!imported.data||!Array.isArray(imported.data.books)||!Array.isArray(imported.data.letters)||!Array.isArray(imported.data.reminders))return notice("Geçerli bir İyi Yol Akademi yedeği seç.");if(!confirm("Yeni yedek kitap, mektup, çalışma ve hatırlatma kayıtlarının üzerine yazılacak. Devam edilsin mi?"))return;commit(()=>{state=sanitize(imported.data);opened.clear()},"Yedeğin geri yüklendi.")}catch(_){notice("Yedek okunamadı. Dosyayı kontrol et.")}
});
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(tabs.includes(h)){current=h;draw()}});
draw();tick();setInterval(tick,20000);document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick()});
})();