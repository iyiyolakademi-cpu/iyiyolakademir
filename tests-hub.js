/* İyi Yol Akademi – test kayıtları, sadece bu cihazda */
(function(){
"use strict";
const KEY="iya_test_history_v2",FREE="kisilikArsiviResultsV3",PREMIUM="iya_pt_saved_results_v1";
const $=q=>document.querySelector(q);
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=String(text);return x;};
const get=(key,def)=>{try{const v=JSON.parse(localStorage.getItem(key));return v==null?def:v;}catch(_){return def;}};
const put=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));return true;}catch(_){return false;}};
const valid=s=>/^[a-z0-9-]{1,70}$/.test(String(s||""));
const clip=(s,n=250)=>String(s||"").slice(0,n);
const number=n=>n==null||!Number.isFinite(Number(n))?null:Math.max(0,Math.min(100,Math.round(Number(n))));
const entries=()=>{const v=get(KEY,[]);return Array.isArray(v)?v.filter(r=>r&&["free","premium"].includes(r.type)&&valid(r.testId)):[];};
function add(r){
 if(!r||!["free","premium"].includes(r.type)||!valid(r.testId))return false;
 const row={type:r.type,testId:String(r.testId),title:clip(r.title,170),category:clip(r.category,90),score:number(r.score),scoreLabel:clip(r.scoreLabel,80),level:clip(r.level,80),description:clip(r.description,350),dimensions:(Array.isArray(r.dimensions)?r.dimensions:[]).slice(0,12).map(d=>({label:clip(d.label,80),percent:number(d.percent),detail:clip(d.detail,350)})),advice:(Array.isArray(r.advice)?r.advice:[]).slice(0,5).map(t=>clip(t,350)),date:new Date().toISOString(),uid:"r-"+Date.now()+"-"+Math.random().toString(36).slice(2,8)};
 const all=entries();if(all[0]&&all[0].type===row.type&&all[0].testId===row.testId&&all[0].score===row.score&&Date.now()-Date.parse(all[0].date)<12000)return true;
 return put(KEY,[row,...all].slice(0,350));
}
function list(){
 const all=entries(),existing=new Set(all.map(x=>x.type+":"+x.testId));
 const free=get(FREE,{});
 if(free&&typeof free==="object"&&!Array.isArray(free))for(const [id,v] of Object.entries(free)){
  if(!/^\d{1,3}$/.test(id)||!v||existing.has("free:"+id))continue;
  all.push({legacy:true,type:"free",testId:id,uid:"old-free-"+id,title:clip(v.title,170),category:clip(v.cat,90),score:number(v.percent),scoreLabel:"Yanıt eğilimi",level:clip(v.level,80),date:new Date(Number(v.date)||Date.now()).toISOString(),dimensions:[],advice:[]});
 }
 const premium=get(PREMIUM,{});
 if(premium&&typeof premium==="object"&&!Array.isArray(premium))for(const [id,v] of Object.entries(premium)){
  if(!valid(id)||!v||existing.has("premium:"+id))continue;
  all.push({legacy:true,type:"premium",testId:id,uid:"old-premium-"+id,title:clip(v.title,170),category:"Keşif",score:null,scoreLabel:"Kayıtlı rapor",date:v.savedAt||new Date().toISOString(),dimensions:[],advice:[]});
 }
 return all.sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
}
function remove(type,id){
 if(!["free","premium"].includes(type)||!valid(id))return false;
 const ok=put(KEY,entries().filter(x=>!(x.type===type&&x.testId===id)));
 const key=type==="free"?FREE:PREMIUM,old=get(key,{});
 if(old&&typeof old==="object"&&!Array.isArray(old)){delete old[id];put(key,old);}
 return ok;
}
const api={add,list,remove};
window.IYA_TEST_CENTER=api;
if(document.body.dataset.page!=="test-results")return;
const date=s=>{const d=new Date(s);return Number.isNaN(d.getTime())?"Tarih bilinmiyor":d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});};
const link=r=>r.type==="free"?"testler.html?test="+encodeURIComponent(r.testId):"premium-testler.html?test="+encodeURIComponent(r.testId);
const addText=(parent,tag,cls,txt)=>{const v=el(tag,cls,txt);parent.append(v);return v;};
const button=(parent,text,fn,cls="hub-button")=>{const b=el("button",cls,text);b.type="button";b.addEventListener("click",fn);parent.append(b);return b;};
const anchor=(parent,text,href)=>{const a=el("a","hub-link",text);a.href=href;parent.append(a);return a;};
const area=$("#hubList"),stats=$("#hubStats"),count=$("#hubCount"),details=$("#hubDetail");
let filter="all",query="";
function render(){
 const all=api.list(),found=all.filter(r=>(filter==="all"||r.type===filter)&&(!query||(r.title+" "+r.category).toLocaleLowerCase("tr-TR").includes(query)));
 stats.replaceChildren();
 for(const [a,b] of [[new Set(all.map(x=>x.type+":"+x.testId)).size,"Farklı test"],[all.filter(x=>x.type==="free").length,"Ücretsiz sonuç"],[all.filter(x=>x.type==="premium").length,"Keşif raporu"]]){
  const item=el("div","hub-stat");addText(item,"strong","",a);addText(item,"span","",b);stats.append(item);
 }
 count.textContent=found.length+" kayıt";
 area.replaceChildren();
 if(!found.length){
  const empty=el("div","hub-empty");addText(empty,"h3","","Henüz burada bir sonuç yok.");
  addText(empty,"p","","Bir testi tamamlayarak ilk kişisel raporunu oluşturabilirsin.");
  anchor(empty,"Ücretsiz testlere göz at →","testler.html");area.append(empty);return;
 }
 for(const r of found){
  const card=el("article","hub-card"),top=el("div","hub-card-top");
  addText(top,"span","hub-pill",r.type==="free"?"Ücretsiz test":"Keşif testi");
  addText(top,"span","hub-date",date(r.date));card.append(top);
  addText(card,"h3","",r.title||"Test sonucu");
  addText(card,"p","hub-muted",r.category||"Kişisel değerlendirme");
  const score=el("div","hub-card-score");
  addText(score,"strong","",r.score===null?"Kayıtlı rapor":r.score+"/100");
  addText(score,"small","",r.scoreLabel||"Yanıt özeti");card.append(score);
  const actions=el("div","hub-actions");
  button(actions,"Raporu aç",()=>show(r));
  anchor(actions,"Testi tekrar yap ↗",link(r));card.append(actions);area.append(card);
 }
}
function show(r){
 details.hidden=false;details.replaceChildren();
 const top=el("div","hub-detail-top");
 button(top,"← Sonuçlara dön",()=>{details.hidden=true;details.replaceChildren();},"hub-back");
 addText(top,"span","hub-date",date(r.date));details.append(top);
 const paper=el("div","hub-paper");
 addText(paper,"span","hub-eyebrow",r.type==="free"?"ÜCRETSİZ KİŞİLİK TESTİ":"KAPSAMLI KEŞİF TESTİ");
 addText(paper,"h2","",r.title||"Test sonucu");
 addText(paper,"p","hub-muted",r.description||"Bu rapor verdiğin cevapların özetidir.");
 if(r.score!==null){const score=el("div","hub-summary-score");addText(score,"strong","",r.score+"/100");addText(score,"span","",r.scoreLabel||"Yanıt eğilimi");paper.append(score);}
 if(r.level)addText(paper,"p","hub-level",r.level);
 for(const d of r.dimensions||[]){
  const box=el("div","hub-dimension"),line=el("div","hub-dimension-head");
  addText(line,"strong","",d.label);addText(line,"span","",d.percent==null?"—":d.percent+"/100");
  box.append(line);const track=el("div","hub-track"),bar=el("span");
  bar.style.width=(d.percent||0)+"%";track.append(bar);box.append(track);
  if(d.detail)addText(box,"p","",d.detail);paper.append(box);
 }
 if(r.advice?.length){addText(paper,"h3","","Gelişim önerileri");for(const tip of r.advice)addText(paper,"p","hub-advice",tip);}
 const previous=api.list().filter(x=>x.type===r.type&&x.testId===r.testId&&x.uid!==r.uid&&x.score!==null&&r.score!==null&&Date.parse(x.date)<Date.parse(r.date)).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date))[0];
 if(previous){addText(paper,"h3","","Önceki yanıtların");addText(paper,"p","hub-muted","Bu kayıt: "+r.score+"/100 · Önceki kayıt ("+date(previous.date)+"): "+previous.score+"/100 · Fark: "+Math.abs(r.score-previous.score)+" puan. Bu değişim klinik iyileşme veya gerileme kanıtı değildir.");}
 addText(paper,"p","hub-note","Bu testler öz farkındalık ve eğlence amaçlıdır. Skorlar toplum yüzdelik dilimi, tanı, IQ veya bilimsel olarak doğrulanmış psikolojik ölçüm değildir.");
 const actions=el("div","hub-detail-actions");
 button(actions,"PDF / Yazdır",()=>window.print());anchor(actions,"Testi yeniden aç",link(r));
 button(actions,"Bu testin kayıtlarını sil",()=>{if(confirm("Bu testin bu tarayıcıdaki bütün sonuçları silinsin mi?")){api.remove(r.type,r.testId);details.hidden=true;render();}},"hub-danger");
 paper.append(actions);details.append(paper);details.scrollIntoView({block:"start",behavior:"smooth"});
}
$("#hubFilter")?.addEventListener("change",e=>{filter=e.target.value;render();});
$("#hubSearch")?.addEventListener("input",e=>{query=e.target.value.toLocaleLowerCase("tr-TR").trim();render();});
$("#hubExport")?.addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),records:api.list()},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=el("a");a.href=url;a.download="iyi-yol-akademi-test-kayitlari.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
});
render();
})();