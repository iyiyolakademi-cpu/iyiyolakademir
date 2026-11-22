(()=>{'use strict';
const data=window.IYA_FILMS||[],details=window.IYA_FILM_DETAILS||{},$=s=>document.querySelector(s);
let category='Tümü',query='';
const mood={'Dram':'Duygusal, karakter odaklı ve düşündürücü.','Bilim Kurgu':'Hayal gücü, bilim ve gelecek üzerine fikirler.','Gerilim':'Merak uyandıran, gergin ve sürükleyici.','Komedi':'Eğlenceli, hafif veya yer yer hicivli.','Romantik':'İlişkiler, duygular ve yakınlık üzerine.','Korku':'Ürkütücü, tekinsiz ve gerilimli.','Aksiyon':'Hızlı tempolu, mücadele ve macera dolu.','Animasyon':'Çizim ve animasyonla anlatılan yaratıcı bir hikâye.','Suç ve Gizem':'Suç, sırlar ve araştırma odaklı.','Macera ve Fantastik':'Keşif, olağanüstü dünyalar ve yolculuklar.','Türk Sineması':'Türkiye sinemasından bir seçki; atmosferi filme göre değişir.','Belgesel ve Biyografi':'Gerçek olaylardan veya kişilerin yaşamlarından beslenen bir anlatı.'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cats=['Tümü',...new Set(data.map(x=>x.category))];
function render(){
 const filtered=data.filter(x=>(category==='Tümü'||x.category===category)&&String(x.title+' '+x.year+' '+x.category).toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')));
 $('#categories').innerHTML=cats.map(x=>'<button type="button" data-category="'+esc(x)+'" class="'+(x===category?'active':'')+'">'+esc(x)+'</button>').join('');
 $('#heading').textContent=category==='Tümü'?'Tüm filmler':category;
 $('#count').textContent=filtered.length+' film';
 $('#movies').innerHTML=filtered.map(x=>'<button type="button" class="movie" data-title="'+esc(x.title)+'"><span class="info"><strong>'+esc(x.title)+'</strong><small>'+x.year+' · '+esc(x.category)+'</small><span class="film-preview">'+esc(details[x.title]||mood[x.category]||'Film önerisini incele.')+'</span><span class="film-more">Film detayları <span aria-hidden="true">›</span></span></span></button>').join('')||'<p>Aramana uygun film bulunamadı.</p>';
}
$('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;render()});
$('#search').addEventListener('input',e=>{query=e.target.value;render()});
$('#movies').addEventListener('click',e=>{const b=e.target.closest('[data-title]');if(!b)return;const x=data.find(f=>f.title===b.dataset.title);if(!x)return;
 $('#movie-title').textContent=x.title;
 $('#movie-meta').textContent=x.year+' · '+x.category;
 $('#movie-summary').textContent=details[x.title]||'Bu film '+x.category.toLocaleLowerCase('tr-TR')+' kategorisinde yer alıyor. Filme özgü konu özeti henüz hazırlanmadı.';
 $('#movie-mood').textContent=mood[x.category]||'Farklı bir sinema deneyimi.';
 $('#copy').textContent='Film adını kopyala';
 $('#details').showModal();
});
$('#close').onclick=()=>$('#details').close();
$('#details').addEventListener('click',e=>{if(e.target===$('#details'))$('#details').close()});
$('#copy').onclick=()=>{if(navigator.clipboard?.writeText)navigator.clipboard.writeText($('#movie-title').textContent).then(()=>{$('#copy').textContent='Kopyalandı'}).catch(()=>{$('#copy').textContent='Kopyalanamadı'})};
render();
})();