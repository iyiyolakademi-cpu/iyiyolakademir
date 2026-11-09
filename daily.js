/* İyi Yol Akademi – günlük söz ve tavsiye. Aynı gün tüm kullanıcılara aynı içerik gösterilir. */
(()=>{
"use strict";
const quotes=[
"Her yeni gün, dünün bıraktığı yerden daha bilinçli başlamak için bir fırsattır.",
"İlerlemek için bütün yolu görmen gerekmez; bir sonraki adımı bilmen yeter.",
"Disiplin, motivasyonun sustuğu günlerde de kendine verdiğin sözü hatırlamaktır.",
"Kendi yolunu bulmak, başkalarının hızına yetişmekten daha değerlidir.",
"Bir şeyi değiştirmek istiyorsan önce onu dürüstçe fark etmeyi dene.",
"Küçük bir başlangıç, ertelenen büyük bir plandan daha güçlüdür.",
"Başarı bazen daha fazlasını yapmak değil, önemli olana yer açmaktır.",
"Kendini başkalarıyla değil, dün olduğun hâlinle karşılaştır.",
"Zorlandığın anlar, öğrenmeye en çok ihtiyaç duyduğun anlardır.",
"İyi bir gün, mükemmel bir gün olmak zorunda değildir.",
"İlerlemenin sesi bazen çok sessizdir; yine de ilerlemedir.",
"Bir alışkanlığı değiştirmek, kendine anlatacağın yeni bir hikâyedir.",
"Her sorunun hemen cevabını bulmak zorunda değilsin.",
"Zamanını nasıl kullandığın, neye değer verdiğini yavaşça gösterir.",
"Başlamak için hazır hissetmeyi beklediğinde, fırsatlar beklemek zorunda kalır.",
"Bir gün değil, bugün attığın adım değişimi başlatır.",
"Dikkatini verdiğin şey, hayatında daha fazla yer kaplamaya başlar.",
"Güçlü olmak, gerektiğinde yardım isteyebilmeyi de içerir.",
"Öğrenmek, bildiklerinden vazgeçme cesaretini bazen gerektirir.",
"Kendine ayırdığın zaman, başkalarından eksilttiğin zaman değildir.",
"Uzun yollar, küçük ama tekrar edilen adımlarla şekillenir.",
"Ne kadar hızlı gittiğin kadar, neden gittiğin de önemlidir.",
"Bir hata, kim olduğunun tamamını anlatmaz.",
"Sınır koymak, değer verdiğin şeylere alan açmaktır.",
"Bugün gösterdiğin özen, yarınki alışkanlığının temelidir.",
"Başkalarını anlamaya çalışırken kendini duymayı unutma.",
"Özgüven, hiç korkmamak değil; korkuya rağmen denemektir.",
"Bir hedefi anlamlı yapan yalnızca sonucu değil, seni dönüştüren süreçtir.",
"İyi sorular, bazen hızlı cevaplardan daha değerlidir.",
"Gelişim, küçük farkındalıkların bir araya gelmesiyle büyür.",
"Kendine verdiğin sözleri küçümseme; güven burada başlar."
];
const advice=[
"Bugün aklındaki üç işi yaz. En önemlisini seç ve yalnızca onun ilk adımıyla başla.",
"Telefonunu 20 dakika uzağa koy ve tamamlanmasını istediğin tek işe odaklan.",
"Uzun süredir ertelediğin bir konuyu beş dakikalık küçük bir göreve böl.",
"Günün sonunda kendine iyi giden bir şeyi ve geliştirebileceğin bir şeyi sor.",
"Bugün yeni bir bilgi öğrendiğinde onu bir cümleyle kendi kelimelerinle anlat.",
"Bir görüş ayrılığında cevap vermeden önce karşı tarafı gerçekten anlamaya çalış.",
"Yarın için üç önceliğini bu akşam belirle. Sabah karar vermeye daha az zaman harcarsın.",
"Çalışırken 25 dakika odaklanıp 5 dakika mola vermeyi dene.",
"Bir alışkanlık edinmek istiyorsan onu zaten yaptığın günlük bir rutine bağla.",
"Bugün harcamalarını gözden geçir; gerçekten ihtiyaç olmayan tek bir kalemi fark et.",
"Bir blog yazısında öğrendiğin tek fikri bugün somut bir davranışa dönüştür.",
"Kendinle ilgili sert bir düşünce geldiğinde aynı cümleyi bir arkadaşına söyleyip söylemeyeceğini düşün.",
"Birine içten bir teşekkür gönder. Küçük bir mesaj da bağ kurmayı kolaylaştırır.",
"Bugün kendine 10 dakikalık plansız bir yürüyüş veya sessiz mola ayır.",
"Yarım kalan bir görevden yalnızca bir parçayı bitir. Tamamlanma hissini fark et.",
"Önemli kararlar öncesinde iki sütun aç: bildiklerin ve varsaydıkların.",
"Bir hedefinin neden önemli olduğunu üç ayrı cümleyle açıkla.",
"Bugün sosyal medyada geçirdiğin süreden 15 dakikayı okumaya ayır.",
"Günün en yoğun saatine değil, odaklanabildiğin en iyi saatine önemli işini yerleştir.",
"Bir arkadaşını dinlerken tavsiye vermeden önce neye ihtiyacı olduğunu sor.",
"Bir işi yapmadan önce gereken tüm araçları hazırla; başlama eşiğini düşür.",
"Yapılacaklar listendeki gereksiz veya artık önemli olmayan bir görevi kaldır.",
"Bugün bir konuyu araştırırken ilk bulduğun cevabın kaynağını kontrol et.",
"Zorlandığın konuda küçük ilerlemelerini not al. Bir haftanın sonunda birlikte değerlendir.",
"Bugün dinlenme zamanını da planına ekle; dinlenmek planın dışında kalmasın.",
"Başarısız olduğunu düşündüğün bir deneyimden öğrendiğin iki şeyi yaz.",
"Birine sınır koyman gerekiyorsa kısa, açık ve saygılı bir cümle hazırla.",
"Bugün aynı anda birçok şey yapmak yerine işleri sırayla bitirmeyi dene.",
"Bir sonraki büyük hedefin için ölçülebilir, gerçekçi bir ilk hafta planı hazırla.",
"Yatmadan önce yarın sabahını kolaylaştıracak küçük bir hazırlık yap.",
"Bugün kendine 'Neyi daha az, neyi daha çok yapmak istiyorum?' diye sor."
];
const datefmt=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'long',year:'numeric',weekday:'long'});
const partsfmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'});
function dayKey(){
 const parts=Object.fromEntries(partsfmt.formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day))/86400000;
}
let shownKey=null;
function showDaily(){
 const k=dayKey();if(shownKey===k)return;shownKey=k;
 const quote=quotes[((k%quotes.length)+quotes.length)%quotes.length];
 const tip=advice[((k%advice.length)+advice.length)%advice.length];
 for(const node of document.querySelectorAll('[data-daily-quote]'))node.textContent=quote;
 for(const node of document.querySelectorAll('[data-daily-advice]'))node.textContent=tip;
 for(const node of document.querySelectorAll('[data-daily-date]'))node.textContent=datefmt.format(new Date());
 const counter=document.querySelector('[data-daily-count]');if(counter)counter.textContent='Her gün yeni bir söz ve küçük bir adım';
 const copy=document.querySelector('[data-copy-daily]');
 if(copy)copy.onclick=async ()=>{
  const copyText='Günün sözü: '+quote+'\nGünün tavsiyesi: '+tip+'\n— İyi Yol Akademi';
  try {await navigator.clipboard.writeText(copyText);copy.textContent='Kopyalandı ✓';setTimeout(()=>copy.textContent='Sözü ve tavsiyeyi kopyala',2000)}
  catch (_){copy.textContent='Kopyalanamadı';setTimeout(()=>copy.textContent='Sözü ve tavsiyeyi kopyala',2000)}
 };
}
showDaily();setInterval(showDaily,60000);
})();