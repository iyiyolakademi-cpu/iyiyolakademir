/* İyi Yol Akademi – Pomodoro: 15/25/50 dk odak, mola, günlük ilerleme. */
(()=>{
"use strict";
const KEY="iya_pomodoro_v1";
const $=sel=>document.querySelector(sel);
const fmt=n=>String(n).padStart(2,"0");
const dayKey=()=>new Date().toLocaleDateString("sv-SE");
const PRESETS={"25":{work:25,short:5,long:15},"50":{work:50,short:10,long:20},"15":{work:15,short:5,long:15}};
const safe=(v,d)=>Number.isFinite(v)?v:d;
let state={preset:"25",mode:"work",remainingMs:25*60000,running:false,endsAt:0,completed:0,daily:{},cycle:0};
try{
 const loaded=JSON.parse(localStorage.getItem(KEY)||"null");
 if(loaded&&typeof loaded==="object"){
  const preset=Object.hasOwn(PRESETS,loaded.preset)?loaded.preset:"25";
  const mode=["work","short","long"].includes(loaded.mode)?loaded.mode:"work";
  const conf=PRESETS[preset],minutes=mode==="work"?conf.work:mode==="long"?conf.long:conf.short;
  state={preset,mode,remainingMs:Math.max(0,Math.min(minutes*60000,safe(Number(loaded.remainingMs),minutes*60000))),
   running:Boolean(loaded.running)&&Number.isFinite(Number(loaded.endsAt)),endsAt:safe(Number(loaded.endsAt),0),
   completed:Math.max(0,Math.min(50000,safe(Number(loaded.completed),0))),
   cycle:Math.max(0,Math.min(4,safe(Number(loaded.cycle),0))),
   daily:loaded.daily&&typeof loaded.daily==="object"&&!Array.isArray(loaded.daily)?loaded.daily:{}};
 }
}catch(_){}
function currentMinutes(){
 const preset=PRESETS[state.preset];return state.mode==="work"?preset.work:state.mode==="long"?preset.long:preset.short;
}
function resetForMode(mode){
 state.mode=mode;state.remainingMs=currentMinutes()*60000;state.running=false;state.endsAt=0;
}
function persist(){
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
}
function updateMetrics(){
 const daily=state.daily[dayKey()]||{count:0,minutes:0};
 $("#pomTodaySessions").textContent=String(daily.count||0);
 $("#pomTodayMinutes").textContent=String(daily.minutes||0)+" dk";
 $("#pomRound").textContent=String(state.cycle)+"/4";
}
function render(){
 const total=currentMinutes()*60000,remaining=state.running?Math.max(0,state.endsAt-Date.now()):state.remainingMs;
 const secs=Math.ceil(Math.max(0,remaining)/1000);
 $("#pomClock").textContent=fmt(Math.floor(secs/60))+":"+fmt(secs%60);
 $("#pomClock").setAttribute("aria-label",Math.floor(secs/60)+" dakika "+secs%60+" saniye");
 $("#pomProgress").style.setProperty("--pom-percent",String(Math.max(0,Math.min(100,100*(total-remaining)/total)))+"%");
 $("#pomStatus").textContent=state.mode==="work"?"Odaklanma":state.mode==="short"?"Kısa mola":"Uzun mola";
 $("#pomMessage").textContent=state.mode==="work"?"Tek bir işe odaklan. Zamanlayıcı senin için takip ediyor.":"Kendine bir mola ver. Hazır olduğunda yeni tura başla.";
 $("#pomStart").textContent=state.running?"Duraklat":"Başlat";
 $("#pomStart").setAttribute("aria-pressed",String(state.running));
 $("#pomModeWork").classList.toggle("active",state.mode==="work");
 $("#pomModeShort").classList.toggle("active",state.mode==="short");
 $("#pomModeLong").classList.toggle("active",state.mode==="long");
 for(const button of document.querySelectorAll("[data-pom-preset]")){
  const selected=button.dataset.pomPreset===state.preset;
  button.classList.toggle("active",selected);button.setAttribute("aria-pressed",String(selected));
 }
 document.title=(state.running?$("#pomClock").textContent+" · ":"")+"Pomodoro | İyi Yol Akademi";
 updateMetrics();
}
function notify(message){$("#pomFeedback").textContent=message;}
function finishSession(){
 state.running=false;state.endsAt=0;
 if(state.mode==="work"){
  state.completed+=1;
  const key=dayKey(),metric=state.daily[key]||{count:0,minutes:0};
  metric.count=Number(metric.count||0)+1;metric.minutes=Number(metric.minutes||0)+PRESETS[state.preset].work;state.daily[key]=metric;
  state.cycle=(state.cycle+1)%4;
  state.mode=state.cycle===0?"long":"short";
  state.remainingMs=currentMinutes()*60000;
  notify("Odaklanma tamamlandı! Şimdi molanı başlatabilirsin.");
 }else{
  state.mode="work";state.remainingMs=currentMinutes()*60000;
  notify("Mola tamamlandı! Yeni odaklanma turuna hazırsın.");
 }
 persist();render();
}
function tick(){
 if(!state.running)return;
 state.remainingMs=Math.max(0,state.endsAt-Date.now());
 if(state.remainingMs<=0){finishSession();return;}
 render();
}
function pause(){
 if(!state.running)return;
 state.remainingMs=Math.max(0,state.endsAt-Date.now());state.running=false;state.endsAt=0;
 persist();render();notify("Zamanlayıcı duraklatıldı.");
}
function start(){
 if(state.running){pause();return;}
 if(state.remainingMs<=0)state.remainingMs=currentMinutes()*60000;
 state.running=true;state.endsAt=Date.now()+state.remainingMs;
 persist();render();notify("Zamanlayıcı çalışıyor.");
}
function chooseMode(mode){
 if(!["work","short","long"].includes(mode))return;
 const changed=state.mode!==mode;
 state.mode=mode;state.remainingMs=currentMinutes()*60000;state.running=false;state.endsAt=0;
 persist();render();if(changed)notify("Zamanlayıcı modu değiştirildi.");
}
function preset(key){
 if(!Object.hasOwn(PRESETS,key))return;
 state.preset=key;state.running=false;state.endsAt=0;state.remainingMs=currentMinutes()*60000;
 persist();render();notify("Süre seçildi. Yeni oturumu başlatabilirsin.");
}
$("#pomStart").addEventListener("click",start);
$("#pomReset").addEventListener("click",()=>{state.running=false;state.endsAt=0;state.remainingMs=currentMinutes()*60000;persist();render();notify("Zamanlayıcı sıfırlandı.")});
$("#pomSkip").addEventListener("click",()=>{state.running=false;state.endsAt=0;
  state.mode=state.mode==="work"?"short":"work";state.remainingMs=currentMinutes()*60000;
  persist();render();notify("Bir sonraki aşamaya geçildi. Bu aşama tamamlanmış sayılmadı.");
});
$("#pomModeWork").addEventListener("click",()=>chooseMode("work"));
$("#pomModeShort").addEventListener("click",()=>chooseMode("short"));
$("#pomModeLong").addEventListener("click",()=>chooseMode("long"));
document.querySelectorAll("[data-pom-preset]").forEach(button=>button.addEventListener("click",()=>preset(button.dataset.pomPreset)));
document.addEventListener("visibilitychange",tick);
window.addEventListener("pageshow",tick);
setInterval(tick,250);
if(state.running&&state.endsAt<=Date.now())finishSession();
render();
})();