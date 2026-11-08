/* İyi Yol Akademi | Günlük görev planlayıcı. Veriler yalnızca bu cihazın tarayıcısında tutulur. */
(() => {
'use strict';
const KEY = 'iyi-yol-akademi-tasks-v1';
const $ = s => document.querySelector(s);
const dayNames = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const shortNames = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const PRIORITY = {high:{label:'Yüksek öncelik',color:'#e85c60'},medium:{label:'Orta öncelik',color:'#efbe42'},low:{label:'Düşük öncelik',color:'#45ac76'}};
function localDay(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
function fromDay(day){const [y,m,d]=day.split('-').map(Number);return new Date(y,m-1,d,12)}
function plusDays(day,amount){const d=fromDay(day);d.setDate(d.getDate()+amount);return localDay(d)}
function trDate(day,options){return fromDay(day).toLocaleDateString('tr-TR',options)}
const today=localDay(new Date());
let selected=today, filter='all', editing=null, items=[];
try {
  const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(Array.isArray(parsed)) items=parsed.filter(t=>t&&typeof t.id==='string'&&typeof t.title==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(t.day)&&PRIORITY[t.priority]).slice(0,3000);
} catch(error) { console.warn('Kayıtlı görevler okunamadı.',error); }
function save(){
  try {localStorage.setItem(KEY,JSON.stringify(items));return true;}
  catch(e){alert('Tarayıcı depolaması şu anda kullanılmıyor. Görevler kaydedilemiyor.');return false;}
}
function button(label,className,handler){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.className=className;b.addEventListener('click',handler);return b;
}
function startOfWeek(day){
  const d=fromDay(day); const offset=(d.getDay()+6)%7;d.setDate(d.getDate()-offset);return localDay(d);
}
function renderWeek(){
  const start=startOfWeek(selected); const week=$('#weekDays');week.replaceChildren();
  const end=plusDays(start,6);
  $('#weekTitle').textContent=trDate(start,{month:'long',year:'numeric'})+(fromDay(start).getMonth()!==fromDay(end).getMonth()?' — '+trDate(end,{month:'short'}):'');
  for(let i=0;i<7;i++){
    const day=plusDays(start,i),d=fromDay(day);
    const b=button('', 'task-day',()=>{selected=day;filter='all';render()});
    b.setAttribute('aria-label',trDate(day,{weekday:'long',day:'numeric',month:'long'})); b.setAttribute('aria-pressed',String(day===selected));
    b.classList.toggle('is-selected',day===selected);b.classList.toggle('is-today',day===today);
    const text=document.createElement('span');text.textContent=shortNames[d.getDay()];
    const num=document.createElement('strong');num.textContent=String(d.getDate());
    b.append(text,num);
    if(items.some(t=>t.day===day)){const mark=document.createElement('b');mark.setAttribute('aria-hidden','true');b.appendChild(mark)}
    week.appendChild(b);
  }
}
function showEmpty(target,msg,title){
  target.replaceChildren();const wrap=document.createElement('div');wrap.className='task-empty';
  const icon=document.createElement('div');icon.className='task-empty-symbol';icon.textContent='✳';
  const h=document.createElement('h3');h.textContent=title;
  const p=document.createElement('p');p.textContent=msg;wrap.append(icon,h,p);target.appendChild(wrap);
}
function renderList(){
  const todayItems=items.filter(t=>t.day===selected);
  const done=todayItems.filter(t=>t.done).length;
  const percent=todayItems.length?Math.round(done/todayItems.length*100):0;
  $('#selectedDateLabel').textContent=trDate(selected,{day:'numeric',month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR');
  $('#selectedDayTitle').textContent=selected===today?'Bugünün görevleri':dayNames[fromDay(selected).getDay()]+' planı';
  $('#taskCountLabel').textContent=todayItems.length?todayItems.length+' görev planlandı':'Henüz görev eklemedin';
  $('#progressPercent').textContent=percent+'%';
  $('#progressFraction').textContent=done+' / '+todayItems.length+' tamamlandı';
  $('#progressFill').style.width=percent+'%';
  $('#progressMessage').textContent=todayItems.length?(done===todayItems.length?'Tebrikler, bugünkü tüm görevleri tamamladın!':done?'Güzel gidiyorsun, devam et.':'Bir görevle başla, gerisi gelecektir.'):'Bir görev ekleyerek başla.';
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  const matching=todayItems.filter(t=>filter==='all'||(filter==='done'?!!t.done:!t.done));
  const list=$('#taskList');list.replaceChildren();
  if(!matching.length){
    showEmpty(list,filter==='done'?'Tamamladığın görevler burada görünecek.':filter==='open'?'Yapılacak yeni bir görev bulunmuyor.':'Bugünün ilk görevini ekle ve planını oluşturmaya başla.',filter==='done'?'Henüz tamamlanan yok':filter==='open'?'Her şey tamam!':'Günün seni bekliyor');
    return;
  }
  for(const task of matching){
    const row=document.createElement('div');row.className='task-item';row.classList.toggle('is-done',!!task.done);row.style.setProperty('--priority-color',PRIORITY[task.priority].color);
    const check=button(task.done?'✓':'','task-check',()=>{task.done=!task.done;if(!save())task.done=!task.done;render()});
    check.setAttribute('aria-label',task.done?'Tamamlandı, yapılacak olarak işaretle':'Görevi tamamla');check.setAttribute('aria-pressed',String(!!task.done));
    const content=document.createElement('div');content.className='task-text';
    const label=document.createElement('strong');label.textContent=task.title;
    const meta=document.createElement('small');meta.textContent=PRIORITY[task.priority].label;
    content.append(label,meta);
    const actions=document.createElement('div');actions.className='task-actions';
    const edit=button('✎','',()=>openModal(task));edit.setAttribute('aria-label','Görevi düzenle: '+task.title);
    const remove=button('×','delete',()=>{if(!confirm('Bu görevi silmek istiyor musun?'))return;const previous=items;items=items.filter(x=>x.id!==task.id);if(!save())items=previous;render()});remove.setAttribute('aria-label','Görevi sil: '+task.title);
    actions.append(edit,remove);row.append(check,content,actions);list.appendChild(row);
  }
}
function render(){renderWeek();renderList()}
const overlay=$('#taskDialog'),form=$('#taskForm'),title=$('#taskTitle'),date=$('#taskDate');
function openModal(task){
  editing=task?.id||null;form.reset();
  title.value=task?.title||'';date.value=task?.day||selected;
  form.querySelector('input[name="priority"][value="'+(task?.priority||'medium')+'"]').checked=true;
  $('#dialogTitle').textContent=task?'Görevi düzenle':'Yeni görev';
  $('#saveTaskBtn').textContent=task?'Değişiklikleri kaydet':'Görevi ekle ↗';
  $('#dialogError').textContent='';
  overlay.hidden=false;document.body.classList.add('modal-lock');
  setTimeout(()=>title.focus(),50);
}
function closeModal(){overlay.hidden=true;document.body.classList.remove('modal-lock');editing=null;}
['addTaskBtn','addTaskSecondary','addTaskBottom'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>openModal(null)));
$('#closeDialog').addEventListener('click',closeModal);
$('#cancelDialog').addEventListener('click',closeModal);
overlay.addEventListener('mousedown',e=>{if(e.target===overlay)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeModal()});
form.addEventListener('submit',e=>{
  e.preventDefault();const text=title.value.trim(),day=date.value,priority=form.querySelector('input[name="priority"]:checked')?.value;
  if(!text||text.length>160||!/^\d{4}-\d{2}-\d{2}$/.test(day)||!PRIORITY[priority]){$('#dialogError').textContent='Görev, tarih ve öncelik alanlarını kontrol et.';return}
  const before=JSON.stringify(items);
  if(editing){const current=items.find(x=>x.id===editing);if(current){current.title=text;current.priority=priority;current.day=day;}}
  else items.push({id:typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'task-'+Date.now()+'-'+Math.random().toString(36).slice(2),title:text,day,priority,done:false});
  if(!save()){items=JSON.parse(before);return}
  selected=day;filter='all';closeModal();render();
});
$('#prevWeek').addEventListener('click',()=>{selected=plusDays(selected,-7);filter='all';render()});
$('#nextWeek').addEventListener('click',()=>{selected=plusDays(selected,7);filter='all';render()});
$('#todayBtn').addEventListener('click',()=>{selected=today;filter='all';render()});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderList()}));
render();
})();