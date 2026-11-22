/* İyi Yol Akademi - calculator discovery experience, preserving original calculations */
(function(){
'use strict';
const categories={komisyon:'finans',indirim:'finans',uyku:'yasam',maas:'finans',tytayt:'egitim',tarih:'yasam',bmi:'saglik',kalori:'saglik',su:'saglik',yag:'saglik',hisse:'finans'};
const descriptions={komisyon:'Satış gelirinden kesintiyi ve eline geçecek tutarı gör.',indirim:'İndirimli fiyatı ve toplam tasarrufu öğren.',uyku:'Uyku ve uyanma saatlerini yaklaşık planla.',maas:'Aylık kazancını saatlik ücrete dönüştür.',tytayt:'Doğru ve yanlışlarına göre sınav netini hesapla.',tarih:'İki tarih arasında geçen süreyi bul.',bmi:'Boy ve kilona göre yaklaşık beden kitle indeksini gör.',kalori:'Günlük enerji ihtiyacını yaklaşık hesapla.',su:'Günlük su ihtiyacına dair genel bir tahmin al.',yag:'Vücut ölçülerinden tahmini yağ oranını hesapla.',hisse:'Alış, satış ve komisyonla net kâr/zararı bul.'};
const titles={all:'Tüm hesaplama araçları',finans:'Finans hesaplamaları',egitim:'Eğitim hesaplamaları',yasam:'Günlük yaşam hesaplamaları',saglik:'Sağlık hesaplamaları'};
const list=document.getElementById('pa-menu-list'),search=document.getElementById('pa-search');
if(!list||!search)return;
const items=[...list.querySelectorAll('.pa-menu-item')];
let category='all';
for(const item of items){const onclick=item.getAttribute('onclick')||'';const match=onclick.match(/paOpen\('([^']+)'\)/);if(!match)continue;const key=match[1];item.dataset.category=categories[key]||'all';item.dataset.description=descriptions[key]||'';item.setAttribute('aria-label',(item.querySelector('.pa-menu-text')?.textContent||key).replace(/Yeni\s*⭐/g,'').trim()+'. '+(descriptions[key]||''));item.querySelector('.pa-icon')?.removeAttribute('style')}
const normalize=x=>String(x||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function filter(){const q=normalize(search.value.trim());let visible=0;for(const item of items){const text=normalize(item.dataset.name+' '+item.textContent+' '+item.dataset.description);const show=(category==='all'||item.dataset.category===category)&&text.includes(q);item.style.display=show?'flex':'none';if(show)visible++}document.getElementById('pa-empty').style.display=visible?'none':'block';document.getElementById('calc-visible-count').textContent=visible+' araç';document.getElementById('calc-filter-title').textContent=titles[category]||titles.all}
window.paSearchTools=filter;
search.addEventListener('input',filter);
document.querySelectorAll('.calc-filter').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;document.querySelectorAll('.calc-filter').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});filter()}));
const originalOpen=window.paOpen,originalHome=window.paHome;
if(typeof originalOpen==='function')window.paOpen=function(name){originalOpen(name);history.replaceState(null,'','#'+encodeURIComponent(name));document.querySelector('.calc-hero')?.setAttribute('hidden','');document.querySelector('.calc-section-heading')?.setAttribute('hidden','');document.querySelector('.calc-help')?.setAttribute('hidden','');window.scrollTo({top:0,behavior:'instant'})};
if(typeof originalHome==='function')window.paHome=function(){originalHome();history.replaceState(null,'',location.pathname);document.querySelector('.calc-hero')?.removeAttribute('hidden');document.querySelector('.calc-section-heading')?.removeAttribute('hidden');document.querySelector('.calc-help')?.removeAttribute('hidden');filter()};
const current=new URLSearchParams(location.search).get('tool')||decodeURIComponent(location.hash.slice(1));if(categories[current]&&typeof window.paOpen==='function')window.paOpen(current);
filter();
})();
