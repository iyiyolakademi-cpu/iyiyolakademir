/* İyi Yol Akademi | Pratik hesaplayıcılar: istemci üzerinde hesaplar, veri göndermez. */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const tools = {
  percent:{title:'Yüzde hesaplama',category:'MATEMATİK / SAYILAR',icon:'%',description:'Bir sayının belirli bir yüzdesini kolayca hesapla.',fields:[['number','Sayı','Örn. 250'],['rate','Yüzde oranı (%)','Örn. 18']]},
  discount:{title:'İndirim hesaplama',category:'ALIŞVERİŞ / BÜTÇE',icon:'↘',description:'Bir ürünün indirimli fiyatını ve tasarruf miktarını hesapla.',fields:[['price','İlk fiyat (₺)','Örn. 1200'],['discount','İndirim oranı (%)','Örn. 25']]},
  vat:{title:'KDV hesaplama',category:'FİNANS / VERGİ',icon:'₺',description:'Tutarına KDV ekle veya KDV dahil fiyattan vergi tutarını bul.',fields:[['amount','Tutar (₺)','Örn. 1000'],['rate','KDV oranı (%)','Örn. 20'],['mode','İşlem türü','', 'select',[['add','KDV ekle'],['extract','KDV dahil tutardan çıkar']]]]},
  grade:{title:'Not ortalaması',category:'EĞİTİM / BAŞARI',icon:'A+',description:'Vize ve final notlarını farklı ağırlıklarla hesapla.',fields:[['midterm','Vize notu (0–100)','Örn. 70'],['final','Final notu (0–100)','Örn. 85'],['weight','Final ağırlığı (%)','Örn. 60']]},
  study:{title:'Çalışma süresi',category:'ZAMAN / VERİMLİLİK',icon:'◷',description:'Odaklanma oturumlarını ve molaları hesaba katarak toplam süreni planla.',fields:[['focus','Oturum süresi (dakika)','Örn. 25'],['sessions','Oturum sayısı','Örn. 4'],['break','Oturum arası mola (dakika)','Örn. 5']]},
  days:{title:'İki tarih arası gün',category:'TAKVİM / PLANLAMA',icon:'▦',description:'İki tarih arasında kaç gün olduğunu öğren.',fields:[['start','Başlangıç tarihi','','date'],['end','Bitiş tarihi','','date']]}
};
const numberFormat=new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2});
const moneyFormat=new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:2});
function numeric(raw){
  let str=String(raw||'').trim().replace(/\s+/g,'');
  if(!str)return NaN;
  if(str.includes(','))str=str.replace(/\./g,'').replace(',','.');
  const value=Number(str);
  return Number.isFinite(value)?value:NaN;
}
function dateKey(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
const form=$('#calcForm'),fields=$('#calcFields'),result=$('#calcResult');
let selected='percent';
function showTool(name){
  selected=tools[name]?name:'percent';const data=tools[selected];
  document.querySelectorAll('[data-tool]').forEach(b=>{const active=b.dataset.tool===selected;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  $('#calcTitle').textContent=data.title;$('#calcDescription').textContent=data.description;$('#calcCategory').textContent=data.category;$('#calcIcon').textContent=data.icon;
  fields.replaceChildren();
  data.fields.forEach(field=>{
    const key=field[0],label=field[1],placeholder=field[2],type=field[3],options=field[4];
    const outer=document.createElement('div');outer.className='calc-field';
    const l=document.createElement('label');l.textContent=label;l.htmlFor='field-'+key;
    let input;
    if(type==='select'){input=document.createElement('select');for(const entry of options){const opt=document.createElement('option');opt.value=entry[0];opt.textContent=entry[1];input.appendChild(opt)}}
    else {input=document.createElement('input');input.type=type==='date'?'date':'text';if(type!=='date'){input.inputMode='decimal';input.autocomplete='off';input.placeholder=placeholder}if(type==='date')input.value=dateKey(new Date())}
    input.id='field-'+key;input.name=key;input.required=true;outer.append(l,input);fields.appendChild(outer);
  });
  $('#calcError').textContent='';result.hidden=true;form.reset();
  if(selected==='days')fields.querySelectorAll('input[type=date]').forEach(i=>i.value=dateKey(new Date()));
}
function getValue(key){return new FormData(form).get(key)}
function getNum(key,min,max){
  const value=numeric(getValue(key));if(!Number.isFinite(value)||value<min||value>max)throw Error(tools[selected].fields.find(f=>f[0]===key)[1]+' alanına '+min+' ile '+max+' arasında geçerli bir sayı gir.');
  return value;
}
function duration(minutes){const h=Math.floor(minutes/60),m=Math.round(minutes%60);return h?(h+' saat'+(m?' '+m+' dakika':'')):(m+' dakika');}
function display(value,desc){$('#calcResultNumber').textContent=value;$('#calcResultDescription').textContent=desc;result.hidden=false}
form.addEventListener('submit',event=>{
  event.preventDefault();$('#calcError').textContent='';
  try{
    let value='',desc='';
    switch(selected){
      case 'percent': {
        const a=getNum('number',-1e12,1e12),p=getNum('rate',-1e6,1e6);
        value=numberFormat.format(a*p/100);desc=numberFormat.format(a)+' sayısının %'+numberFormat.format(p)+' değeri.';break;
      }
      case 'discount': {
        const price=getNum('price',0,1e12),discount=getNum('discount',0,100);
        value=moneyFormat.format(price*(1-discount/100));desc='İndirim tutarı: '+moneyFormat.format(price*discount/100)+' · İlk fiyat: '+moneyFormat.format(price);break;
      }
      case 'vat': {
        const amount=getNum('amount',0,1e12),rate=getNum('rate',0,100),mode=getValue('mode');
        if(mode==='add'){const tax=amount*rate/100;value=moneyFormat.format(amount+tax);desc='KDV tutarı: '+moneyFormat.format(tax)+' · Vergisiz: '+moneyFormat.format(amount)}
        else {const net=amount/(1+rate/100);value=moneyFormat.format(net);desc='KDV tutarı: '+moneyFormat.format(amount-net)+' · KDV dahil: '+moneyFormat.format(amount)}
        break;
      }
      case 'grade': {
        const midterm=getNum('midterm',0,100),final=getNum('final',0,100),weight=getNum('weight',0,100);
        value=numberFormat.format(midterm*(1-weight/100)+final*weight/100);
        desc='Vize ağırlığı %'+numberFormat.format(100-weight)+', final ağırlığı %'+numberFormat.format(weight)+'. Geçme notu kurumuna göre değişir.';break;
      }
      case 'study': {
        const focus=getNum('focus',1,10080),sessions=getNum('sessions',1,1000),pause=getNum('break',0,10080);
        if(!Number.isInteger(sessions))throw Error('Oturum sayısı tam sayı olmalıdır.');
        const focusTotal=focus*sessions,breakTotal=(sessions-1)*pause;
        value=duration(focusTotal+breakTotal);desc='Odaklanma: '+duration(focusTotal)+' · Molalar: '+duration(breakTotal)+' (son oturumdan sonra mola eklenmez).';break;
      }
      case 'days': {
        const a=String(getValue('start')||''),b=String(getValue('end')||'');
        if(!/^\d{4}-\d{2}-\d{2}$/.test(a)||!/^\d{4}-\d{2}-\d{2}$/.test(b))throw Error('Her iki tarihi de seçmelisin.');
        const av=a.split('-').map(Number),bv=b.split('-').map(Number);
        const from=Date.UTC(av[0],av[1]-1,av[2]),to=Date.UTC(bv[0],bv[1]-1,bv[2]);
        const days=Math.abs(Math.round((to-from)/86400000));
        value=numberFormat.format(days)+' gün';desc='Başlangıç günü hariç tutulur. Aynı tarihler arasında 0 gün bulunur.';break;
      }
    }
    display(value,desc);
  }catch(err){result.hidden=true;$('#calcError').textContent=err.message||'Geçerli değerler girip tekrar dene.'}
});
$('#calcClear').addEventListener('click',()=>showTool(selected));
document.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>showTool(b.dataset.tool)));
showTool('percent');
})();