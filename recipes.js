/* İyi Yol Akademi | 200 özgün tarif – arama, kategori, favori, porsiyon ve pişirme modu */
(() => {
"use strict";
const $ = (s) => document.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const icon = (r) => typeof r.icon === 'string' && r.icon.trim() ? r.icon : '🍽️';
const key = 'iyi-yol-akademi-recipes-favorites-v1';
const tr = (x) => String(x || '').toLocaleLowerCase('tr-TR');
const state = {recipes:[], filtered:[], category:'', query:'',difficulty:'any',maxTime:'any', favoritesOnly:false, limit:24, selected:null, baseServing:4, servings:4, step:0};
let favorites = new Set();
try {favorites = new Set(JSON.parse(localStorage.getItem(key) || '[]').map(Number));} catch (_) {}
const setFavorites = () => {try {localStorage.setItem(key,JSON.stringify([...favorites]));} catch (_) {}};
const categoriesOrder=['Ana Yemek','Kahvaltı','Çorba','Makarna','Tatlı','Salata','Fit','Pilav','Izgara','Balık','Dünya Mutfağı','Meze','Ara Sıcak','Hamur İşi','Zeytinyağlı','İçecek'];
const categoryCount = (cat) => state.recipes.filter(r=>r.category===cat).length;
function el(tag, cls, text) {const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function appendText(container, tag, cls, val){container.appendChild(el(tag,cls,val));}
function renderCategories(){
 const box=$('#recipeCategories');box.replaceChildren();
 const choices=[{name:'Tüm tarifler',value:'',count:state.recipes.length}].concat(categoriesOrder.filter(c=>categoryCount(c)).map(c=>({name:c,value:c,count:categoryCount(c)})));
 for(const choice of choices){
   const btn=el('button','recipe-category-button'+(state.category===choice.value?' is-active':''),choice.name);
   btn.type='button';
   btn.setAttribute('aria-pressed',String(state.category===choice.value));
   const count=el('span','',String(choice.count));btn.append(count);
   btn.addEventListener('click',()=>{state.category=choice.value;state.limit=24;renderCategories();applyFilters();});
   box.appendChild(btn);
 }
}
function getDuration(recipe) {
 const numeric=Number(recipe.totalMinutes);
 if(Number.isFinite(numeric)&&numeric>=0)return numeric;
 const all=String(recipe.totalTime||'').match(/\d+/);
 return all?Number(all[0]):NaN;
}
function applyFilters(){
 const q=tr(state.query.trim());
 state.filtered=state.recipes.filter((r)=>{
  if(state.category&&r.category!==state.category)return false;
  if(state.favoritesOnly&&!favorites.has(Number(r.id)))return false;
  if(state.difficulty!=='any'&&r.difficulty!==state.difficulty)return false;
  if(state.maxTime!=='any'&&(!(getDuration(r)<=Number(state.maxTime))))return false;
  if(q&&!tr([r.name,r.category,r.desc,...(r.ingredients||[])].join(' ')).includes(q))return false;
  return true;
 });
 $('#recipeResultsTitle').textContent=state.category|| (state.favoritesOnly?'Favori tariflerin':'Bütün tarifler');
 $('#recipeCount').textContent=state.filtered.length+' tarif bulundu';
 renderCards();
}
function recipeCard(recipe){
 const card=el('button','recipe-card');card.type='button';
 card.setAttribute('aria-label',recipe.name+' tarifini aç');
 const visual=el('div','recipe-card-visual');
 const cat=el('span','recipe-card-cat',recipe.category);
 const emoji=el('span','recipe-card-emoji',icon(recipe));
 visual.append(cat,emoji);
 const body=el('div','recipe-card-body');
 appendText(body,'h3','',recipe.name);
 appendText(body,'p','',recipe.desc||'');
 const foot=el('div','recipe-card-footer');
 const duration=recipe.totalTime||(Number.isFinite(getDuration(recipe))?getDuration(recipe)+' dk':recipe.prep||'Hazırlanış');
 appendText(foot,'span','',duration);
 appendText(foot,'span','',favorites.has(Number(recipe.id))?'♥ Kaydedildi':'Tarifi incele ↗');
 body.appendChild(foot);card.append(visual,body);
 card.addEventListener('click',()=>openRecipe(recipe.id));
 return card;
}
function renderCards(){
 const grid=$('#recipeGrid');const list=state.filtered.slice(0,state.limit);
 grid.replaceChildren(...list.map(recipeCard));
 if(!state.filtered.length){const msg=el('div','empty-state','Bu filtrelerle eşleşen tarif bulunamadı. Filtreleri temizleyip tekrar deneyebilirsin.');grid.appendChild(msg);}
 const more=$('#recipeLoadMore');more.hidden=state.filtered.length<=state.limit;
 if(!more.hidden)more.textContent='Daha fazla tarif göster ('+(state.filtered.length-state.limit)+' kaldı)';
}
function parseServing(recipe) {
 const m=String(recipe.portion||'').match(/(\d+)/);
 return m?Math.max(1,Math.min(30,Number(m[1]))):4;
}
function ingredientText(raw) {
 const source=String(raw);
 if(state.servings===state.baseServing)return source;
 const factor=state.servings/state.baseServing;
 const match=source.match(/^\s*(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+(?:[.,]\d+)?))?(?!\d)/);
 if(!match)return source;
 let n=Number(match[1].replace(',','.'));
 if(match[2])n/=Number(match[2].replace(',','.'));
 if(!Number.isFinite(n))return source;
 const amount=Math.round(n*factor*4)/4;
 return String(amount).replace('.',',')+source.slice(match[0].length);
}
function renderIngredients() {
 const box=$('#detailIngredients');box.replaceChildren();
 for(const i of state.selected.ingredients||[]){
  const item=el('li','');const input=el('input');input.type='checkbox';input.setAttribute('aria-label',i+' hazır');
  const text=el('span','',ingredientText(i));item.append(input,text);box.appendChild(item);
 }
 $('#servingsCount').textContent=state.servings+' kişi';
 $('#detailServingsLabel').textContent=state.baseServing===state.servings?(state.selected.portion||'Önerilen porsiyon'):'Malzeme miktarları yaklaşık ölçeklenmiştir';
}
function renderDetail(){
 const r=state.selected;if(!r)return;
 $('#detailCategory').textContent=r.category||'Tarif';
 $('#detailTitle').textContent=r.name;
 $('#detailDesc').textContent=r.desc||'';
 $('#detailIcon').textContent=icon(r);
 document.title=r.name+' | Yemek Tarifleri | İyi Yol Akademi';
 const meta=$('#detailMeta');meta.replaceChildren();
 for(const value of [r.totalTime||'Toplam süre belirtilmedi',r.prep?'Hazırlık: '+r.prep:'',r.cook?'Pişirme: '+r.cook:'',r.portion||'',r.difficulty?'Zorluk: '+r.difficulty:''])if(value)meta.appendChild(el('span','',value));
 state.baseServing=parseServing(r);state.servings=state.baseServing;
 renderIngredients();
 const steps=$('#detailSteps');steps.replaceChildren();
 for(const text of r.steps||[])steps.appendChild(el('li','',text));
 const extras=$('#detailExtras');extras.replaceChildren();
 if(r.nutritionData&&typeof r.nutritionData==='object'){
  const main=el('div','recipe-nutrition-grid');
  const info=[['kcal','Kalori','kcal'],['protein','Protein','g'],['carbs','Karbonhidrat','g'],['fat','Yağ','g']];
  for(const [field,label,unit] of info) if(r.nutritionData[field]!=null){
   const cell=el('div','');appendText(cell,'strong','',r.nutritionData[field]+' '+unit);appendText(cell,'span','',label);main.append(cell);
  }
  extras.appendChild(main);
 }
 if(r.tips){const tips=el('div','recipe-extra-card');appendText(tips,'h4','','Şefin notu');appendText(tips,'p','',typeof r.tips==='string'?r.tips:Array.isArray(r.tips)?r.tips.join(' '):'');extras.append(tips);}
 const fav=$('#detailFavorite');fav.textContent=favorites.has(Number(r.id))?'♥ Favorilerden çıkar':'♡ Favorilere ekle';
 $('#recipeListView').hidden=true;$('#recipeDetailView').hidden=false;
 window.scrollTo({top:0,behavior:'instant'});
}
function openRecipe(id,replace=false){
 const r=state.recipes.find(x=>Number(x.id)===Number(id));if(!r)return;
 state.selected=r;
 const url=new URL(location.href);url.searchParams.set('id',String(r.id));
 if(replace)history.replaceState(null,'',url.pathname+url.search);else history.pushState(null,'',url.pathname+url.search);
 renderDetail();
}
function goBack(replace=false) {
 $('#recipeDetailView').hidden=true;$('#recipeListView').hidden=false;state.selected=null;
 document.title='Yemek Tarifleri | İyi Yol Akademi';
 const url=new URL(location.href);url.searchParams.delete('id');
 if(replace)history.replaceState(null,'',url.pathname+url.search);else history.pushState(null,'',url.pathname+url.search);
 window.scrollTo({top:0,behavior:'instant'});
}
function randomRecipe(){
 const pool=state.filtered.length?state.filtered:state.recipes;
 if(!pool.length)return;openRecipe(pool[Math.floor(Math.random()*pool.length)].id);
}
function renderCook(){
 const r=state.selected;if(!r)return;
 const total=(r.steps||[]).length;
 $('#cookTitle').textContent=r.name;$('#cookStepCounter').textContent='Adım '+(state.step+1)+' / '+total;
 $('#cookStepText').textContent=r.steps[state.step]||'';
 $('#cookProgressFill').style.width=(100*(state.step+1)/Math.max(1,total))+'%';
 $('#cookPrev').disabled=state.step===0;$('#cookNext').textContent=state.step===total-1?'Pişirmeyi bitir ✓':'Sonraki adım →';
}
function openCook(){
 if(!state.selected||!state.selected.steps?.length)return;
 state.step=0;renderCook();$('#cookOverlay').hidden=false;document.body.style.overflow='hidden';
}
function closeCook(){$('#cookOverlay').hidden=true;document.body.style.overflow='';}
async function init(){
 $('#recipeSearch').addEventListener('input',e=>{state.query=e.target.value;state.limit=24;applyFilters()});
 $('#recipeDifficultyFilter').addEventListener('change',e=>{state.difficulty=e.target.value;state.limit=24;applyFilters()});
 $('#recipeTimeFilter').addEventListener('change',e=>{state.maxTime=e.target.value;state.limit=24;applyFilters()});
 $('#recipeLoadMore').addEventListener('click',()=>{state.limit+=24;renderCards()});
 $('#recipeRandom').addEventListener('click',randomRecipe);
 $('#detailRandom').addEventListener('click',randomRecipe);
 $('#recipeFavFilter').addEventListener('click',()=>{state.favoritesOnly=!state.favoritesOnly;const b=$('#recipeFavFilter');b.classList.toggle('is-active',state.favoritesOnly);b.setAttribute('aria-pressed',String(state.favoritesOnly));state.limit=24;applyFilters()});
 $('#detailFavorite').addEventListener('click',()=>{const id=Number(state.selected.id);if(favorites.has(id))favorites.delete(id);else favorites.add(id);setFavorites();renderDetail();applyFilters()});
 $('#recipeBack').addEventListener('click',()=>goBack());
 $('#servingDown').addEventListener('click',()=>{state.servings=Math.max(1,state.servings-1);renderIngredients()});
 $('#servingUp').addEventListener('click',()=>{state.servings=Math.min(30,state.servings+1);renderIngredients()});
 $('#startCookMode').addEventListener('click',openCook);
 $('#closeCook').addEventListener('click',closeCook);
 $('#cookPrev').addEventListener('click',()=>{state.step=Math.max(0,state.step-1);renderCook()});
 $('#cookNext').addEventListener('click',()=>{if(state.step===state.selected.steps.length-1)closeCook();else {state.step++;renderCook()}});
 $('#cookOverlay').addEventListener('click',e=>{if(e.target.id==='cookOverlay')closeCook()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#cookOverlay').hidden)closeCook()});
 window.addEventListener('popstate',()=>{
  const id=new URLSearchParams(location.search).get('id');if(id&&state.recipes.some(r=>String(r.id)===id))openRecipe(id,true);else {$('#recipeDetailView').hidden=true;$('#recipeListView').hidden=false;state.selected=null;}
 });
 try {
  const response=await fetch('recipes-data.json',{cache:'no-store'});
  if(!response.ok)throw Error('Tarifler yüklenemedi: '+response.status);
  const data=await response.json();
  if(!Array.isArray(data)||!data.length)throw Error('Tarif listesi boş');
  state.recipes=data.filter(r=>r&&Number.isInteger(r.id)&&r.name&&Array.isArray(r.ingredients)&&Array.isArray(r.steps));
  renderCategories();applyFilters();
  const id=new URLSearchParams(location.search).get('id');
  if(id)openRecipe(id,true);
 } catch (err) {
  console.error(err);
  $('#recipeCount').textContent='Tarifler yüklenemedi';
  $('#recipeGrid').replaceChildren(el('div','error-state','Tarif listesi şu anda yüklenemiyor. Lütfen sayfayı yenile.'));
 }
}
init();
})();