/* İyi Yol Akademi – özgün, tanı koymayan keşif testleri.
 * Bu maddeler standartlaştırılmış / klinik olarak doğrulanmış ölçekler değildir.
 * Üçüncü taraf ücretli testlerin orijinal soruları içermez. */
(function(){
"use strict";
const categories=[
 ["all","Tümü"],
 ["personality","Kişilik"],
 ["career","Kariyer"],
 ["relationship","İlişkiler"],
 ["growth","Gelişim"]
];
const tests=[];
function add(id,title,category,icon,mode,description,dimensions,questions,tips){
 const dims=dimensions.map(([key,label,low,high])=>({key,label,low,high}));
 let items=questions.map(row=>{
   const s=row.split("|");
   if(mode==="duo")return {a:s[0],b:s[1],dim:s[2]};
   if(mode==="logic")return {text:s[0],options:s[1].split("~"),correct:Number(s[2])};
   return {text:s[0],dim:s[1]||"main",reverse:s[2]==="r"};
 });
 tests.push({id,title,category,icon,mode,description,dims,questions:items,tips});
}
add("big-five","Beş Boyutlu Kişilik Keşfi","personality","◈","scale",
"Kişiliğinin beş geniş özelliğine dair kendi yanıtlarına dayalı bir keşif haritası.",
[
 ["open","Deneyime açıklık","Somut ve alışılmış seçenekleri tercih etme eğilimindesin.","Yeni fikirlere ve farklı deneyimlere daha yakınsın."],
 ["order","Düzenlilik","Esnek hareket etmeyi ve anlık kararları tercih edebilirsin.","Planlama ve işleri tamamlama senin için daha belirgin."],
 ["social","Sosyallik","Sakin ve bireysel ortamlarda enerji bulabilirsin.","Sosyal etkileşimler sana daha çok enerji verebilir."],
 ["kind","Uyumluluk","Düşüncelerini doğrudan savunmaya daha yatkın olabilirsin.","İş birliği ve başkalarının ihtiyaçlarını gözetme öne çıkıyor."],
 ["calm","Duygusal denge","Zor durumlarda duygularını daha yoğun hissedebilirsin.","Baskı altında sakinliğini korumaya daha yatkın olabilirsin."]
],[
"Farklı bir görüş duyduğunda onu anlamak için sorular sorarım.|open",
"Yeni bir beceri denemek beni heyecanlandırır.|open",
"Alışık olmadığım yöntemleri hemen reddederim.|open|r",
"Sanat veya düşünce üreten içeriklerle ilgilenmeyi severim.|open",
"Günün önemli işlerini önceden planlarım.|order",
"Başladığım işi bitirmek için düzenli çaba gösteririm.|order",
"Yapmam gereken işleri sık sık son ana bırakırım.|order|r",
"Küçük ayrıntıları kontrol etmek için zaman ayırırım.|order",
"Kalabalık bir ortamda sohbet başlatmak bana kolay gelir.|social",
"Yeni insanlarla tanışma fırsatlarını severim.|social",
"Uzun sosyal etkinliklerden sonra genellikle yalnız kalmak isterim.|social|r",
"Bir grubun önünde konuşmak benim için doğal gelir.|social",
"Bir anlaşmazlıkta karşı tarafın ihtiyacını da düşünürüm.|kind",
"Ortak bir karara varmak için taviz vermeyi değerlendirebilirim.|kind",
"Birinin hatasına karşı hemen sertleşirim.|kind|r",
"Bir başkasının başarısını içtenlikle kutlayabilirim.|kind",
"Beklenmedik aksilikler karşısında toparlanabilirim.|calm",
"Eleştiri aldığımda sakin kalmam zaman alır.|calm|r",
"Baskı altında önce ne yapabileceğime odaklanırım.|calm",
"Küçük sorunlar bile zihnimi uzun süre meşgul eder.|calm|r"
],["Puanların kim olduğunu kesin biçimde tarif etmez; zaman ve koşullara göre değişebilir.","En belirgin iki özelliğini günlük hayatta nerede kullandığını bir hafta gözlemle.","Daha düşük puanlı alanları eksiklik değil, farklı çalışma biçimleri olarak değerlendir."]);
add("types","Dört Eksenli Kişilik Profili","personality","◇","scale",
"Sosyal enerji, bilgi, karar ve planlama tercihlerinin dengesi.",
[
 ["social","Sosyal enerji","İçe dönük ve sakin ortamlara yakın bir tercih görülüyor.","Dışa dönük ve sosyal etkileşime yakın bir tercih görülüyor."],
 ["ideas","Bilgiyi işleme","Somut deneyimlere ve ayrıntılara yöneliyorsun.","Olasılıklara ve geniş resme yöneliyorsun."],
 ["decide","Karar verme","İnsan ilişkileri ve değerler kararlarında öne çıkıyor.","Ölçütler ve tutarlılık kararlarında öne çıkıyor."],
 ["planning","Planlama","Esnek ve açık uçlu ilerlemeyi tercih edebilirsin.","Önceden yapılandırılmış ilerlemeyi tercih edebilirsin."]
],[
"Yeni bir grupta konuşmayı başlatırım.|social",
"Önemli bir günün sonunda yalnız kaldığımda daha kolay dinlenirim.|social|r",
"Fikirlerimi yüksek sesle konuşarak netleştiririm.|social",
"Kalabalık ortamlarda uzun kalmak benim için yorucu olur.|social|r",
"Gelecekte ortaya çıkabilecek olasılıkları düşünmeyi severim.|ideas",
"Bir konuyu önce elle tutulur örneklerle anlamayı tercih ederim.|ideas|r",
"Bir fikrin genel anlamını ayrıntılarından önce fark ederim.|ideas",
"Denemeden önce net adımları görmek isterim.|ideas|r",
"Karar verirken aynı ölçütleri herkese uygulamaya çalışırım.|decide",
"Bir kararın insanlarda oluşturacağı duyguyu ilk sıraya koyarım.|decide|r",
"Anlaşmazlıkta mantıksal tutarlılık benim için çok önemlidir.|decide",
"Herkes mutlu olacaksa kuralları esnetmeyi tercih ederim.|decide|r",
"Haftalık planımı baştan belirlemek bana rahatlık verir.|planning",
"Bir günün akışını son dakikada şekillendirmekten hoşlanırım.|planning|r",
"Bir işi tamamlamadan yenisine geçmemeyi severim.|planning",
"Kesin programlar beni gereğinden fazla sınırlar.|planning|r"
],["Hiçbir kişilik tipi diğerinden üstün değildir.","Çalışma ve iletişim ortamlarını tercihlerinle uyumlu küçük değişikliklerle düzenle.","Bu profil MBTI veya başka bir markalı kişilik testi sonucu değildir."]);
add("nine-patterns","Dokuz Eğilimli Motivasyon Haritası","personality","✦","scale",
"Hayata yaklaşımındaki dokuz farklı eğilimi inceleyen özgün öz değerlendirme.",
[
 ["ideal","İlkelere bağlılık","Kuralları duruma göre yorumlamaya daha yatkınsın.","İlkeler ve doğru yapma isteği daha çok öne çıkıyor."],
 ["help","Destek olma","Kendi sınırlarına ve bireysel hedeflere öncelik verebilirsin.","Başkalarına destek verme motivasyonun belirgin."],
 ["achieve","Başarı yönelimi","Süreç ve deneyim senin için sonuç kadar önemli olabilir.","Somut başarı ve hedeflere ulaşma isteğin belirgin."],
 ["unique","Özgünlük","Aidiyet ve ortak yönler senin için daha önemli olabilir.","Kendine özgü yönlerini ifade etmek isteyebilirsin."],
 ["learn","Anlama ihtiyacı","Hızla uygulamaya geçmeyi tercih edebilirsin.","Önce araştırıp derinlemesine anlamak istersin."],
 ["secure","Güvence arayışı","Belirsizlikte deneme yapmaya yatkınsın.","Önceden riskleri görüp güvence aramaya yatkınsın."],
 ["novel","Yenilik isteği","Tanıdık düzenin sana güven verebilir.","Çeşitlilik ve yeni deneyimler arayabilirsin."],
 ["direct","Kararlılık","Uzlaşmaya ve yumuşak yönetime yakınsın.","Bağımsız ve doğrudan hareket etmeye yatkınsın."],
 ["peace","Uyum arayışı","Gerginlikte açık tartışmayı tercih edebilirsin.","Huzurlu ve çatışmasız ortamları tercih edebilirsin."]
],[
"İyi yapılmamış bir işi düzeltmek benim için önemlidir.|ideal",
"Kendime yüksek standartlar koyarım.|ideal",
"Birinin ihtiyacını kolayca fark ederim.|help",
"Destek olabilmek beni motive eder.|help",
"Kendi hedeflerime ulaşmak için net ölçüler belirlerim.|achieve",
"Başarılı hissetmek benim için güçlü bir motivasyondur.|achieve",
"Kalabalık içinde kendime özgü yanlarımı korumak isterim.|unique",
"Duygularımı farklı biçimlerde ifade etmeyi severim.|unique",
"Bir şeyin nedenini anlamadan harekete geçmek istemem.|learn",
"Bir konu ilgimi çekince derin araştırma yaparım.|learn",
"Bir karardan önce olası sorunları hesaplarım.|secure",
"Belirsiz durumlarda güvenilir bilgi ararım.|secure",
"Yeni deneyimler için planlarımı değiştirebilirim.|novel",
"Birbirinden farklı alanlarla ilgilenmek hoşuma gider.|novel",
"Karar almam gerektiğinde sorumluluğu üstlenirim.|direct",
"Fikrimi güçlü biçimde savunmaktan çekinmem.|direct",
"Bir tartışmayı yumuşatmak için araya girebilirim.|peace",
"İnsanlar arasında huzur olmasını önemserim.|peace"
],["En yüksek eğilimler aynı anda sende bulunabilir; tek bir tipe sıkışmak zorunda değilsin.","Gün içinde seni harekete geçiren motivasyonları gözlemle.","Bu test resmî Enneagram veya klinik kişilik ölçeği değildir."]);
add("strengths","Güçlü Yön Tercihleri","personality","✳","duo",
"İki olumlu yaklaşım arasında seçerek doğal tercihlerine bak.",
[
 ["structure","Planlama / spontane ilerleme","Hazırlık ve düzen daha yakın.","Deneyerek ve esnek ilerleme daha yakın."],
 ["people","Analiz / iş birliği","Bağımsız çözümlemeye daha yakın.","İnsanlarla birlikte çözmeye daha yakın."],
 ["speed","Derinlik / hız","Derinleşerek ilerleme daha yakın.","Hızlı başlama ve ilerleme daha yakın."],
 ["create","İyileştirme / yenilik","Var olanı güçlendirme daha yakın.","Yeni fikir başlatma daha yakın."]
],[
"Bir işe başlamadan önce ayrıntılı plan yaparım.|Önce dener, ilerledikçe şekillendiririm.|structure",
"Zamanımı takvime göre düzenlerim.|Günün akışına göre önceliklerimi değiştiririm.|structure",
"Belirsizliği azaltacak hazırlıklar yaparım.|Değişen koşullarda doğaçlama çözerim.|structure",
"Bir sorunu tek başıma çözümlemek isterim.|Farklı kişilerle konuşarak çözümlerim.|people",
"Önce kendi notlarımı incelerim.|Önce ekibin görüşlerini dinlerim.|people",
"Zor bir görevi bireysel üstlenirim.|Görevleri paylaşarak ilerlerim.|people",
"Bir konuyu iyice öğrenmeden bitirmem.|Temel bilgiyi alıp hızla uygularım.|speed",
"Az işi ayrıntılı yapmayı tercih ederim.|Çok sayıda denemeyle ilerlerim.|speed",
"Uzun süre odaklanıp tamamlamak isterim.|Kısa döngülerle sonuca yaklaşırım.|speed",
"İşleyen bir sistemi adım adım geliştiririm.|Yeni bir sistem tasarlamak isterim.|create",
"Mevcut fikri daha kullanışlı yapmayı severim.|Sıfırdan farklı bir fikir üretmek isterim.|create",
"Kanıtlanmış yöntemi iyileştiririm.|Alışılmadık yöntemleri araştırırım.|create"
],["İki iyi seçenek arasında kalman normal; burada doğru cevap yok.","Baskın tercihlerini öğrenci projelerinde ve takım çalışmalarında dene.","Güçlü yönler bir yetenek testiyle kesin olarak ölçülmüş sayılmaz."]);
add("career-interests","Mesleki İlgi Haritası","career","▣","interest",
"Altı ilgi alanını karşılaştıran, faaliyet odaklı bir kariyer keşfi.",
[
 ["practical","Uygulamalı işler","Somut ve teknik işlere daha sınırlı ilgi duyuyor olabilirsin.","Üretme, onarma ve uygulamalı işlerle ilgileniyorsun."],
 ["research","Araştırma","Araştırma etkinlikleri önceliğin olmayabilir.","Analiz ve yeni bilgi bulmak sana çekici geliyor."],
 ["creative","Yaratıcılık","Yaratıcı etkinliklere daha az yöneliyor olabilirsin.","Tasarlama ve özgün ifade etme ilgisi öne çıkıyor."],
 ["help","İnsanlarla çalışma","Bireysel görevleri daha çok sevebilirsin.","Öğretme, dinleme ve destek işleri ilgini çekiyor."],
 ["lead","Girişimcilik","Rekabet ve ikna gerektiren roller önceliğin olmayabilir.","Fikirleri hayata geçirme ve yönlendirme ilgisi öne çıkıyor."],
 ["organize","Düzen ve veri","Daha serbest işleri tercih ediyor olabilirsin.","Bilgileri ve süreçleri düzenlemek ilgini çekiyor."]
],[
"Basit bir elektronik cihazı söküp nasıl çalıştığını incelemek.|practical",
"Bir nesne veya ekipman tasarlamak ve üretmek.|practical",
"Bir atölyede uygulamalı projeler yapmak.|practical",
"Bilimsel bir sorunun yanıtını araştırmak.|research",
"Bir veri tablosunda örüntü aramak.|research",
"Yeni bir teknolojinin çalışma mantığını öğrenmek.|research",
"Bir poster veya arayüz tasarlamak.|creative",
"Bir hikâye veya senaryo yazmak.|creative",
"Kendi özgün projemin görsel dilini oluşturmak.|creative",
"Bir arkadaşına zorlandığı konuyu anlatmak.|help",
"Yeni katılan birine rehberlik etmek.|help",
"Bir sorunu dinleyip birlikte çözüm aramak.|help",
"Bir fikri insanlara sunup destek toplamak.|lead",
"Küçük bir girişim için satış stratejisi oluşturmak.|lead",
"Bir ekipte hedef belirlemek ve yönlendirmek.|lead",
"Belgeleri düzenli bir sisteme aktarmak.|organize",
"Etkinlik bütçesinin hesabını takip etmek.|organize",
"Bir projenin takvimini ve görev listesini düzenlemek.|organize"
],["En yüksek iki ilgi alanınla ilgili gerçek mesleklerin günlük işlerini araştır.","Sevdiğin faaliyetleri okul projelerinde veya kısa deneyimlerde dene.","Meslek seçimi yalnızca ilgi değil, yetenek, imkânlar ve değerlerle birlikte düşünülmeli."]);
add("work-style","Çalışma Ortamın Nasıl Olmalı?","career","⌘","scale",
"Odaklanma, esneklik ve iş birliği ihtiyaçlarını tanı.",
[
 ["focus","Derin odak","Kısa ve değişken görevler senin için uygun olabilir.","Uzun, kesintisiz çalışma blokları seni destekleyebilir."],
 ["team","Takım çalışması","Bireysel sorumluluk ve bağımsızlık sana iyi gelebilir.","Ekip içinde düzenli iletişim seni destekleyebilir."],
 ["flex","Esneklik","Düzenli saat ve net kurallar sana iyi gelebilir.","Zaman ve yöntem özgürlüğü seni destekleyebilir."]
],[
"Bir işe uzun süre bölünmeden odaklanabilirim.|focus",
"Sık kesintiler performansımı düşürür.|focus",
"Kısa ve farklı işler arasında geçiş yapmayı severim.|focus|r",
"Tek bir görevi bitirmek bana daha iyi gelir.|focus",
"Fikirleri başkalarıyla tartışınca daha iyi geliştiririm.|team",
"Ekip olarak üretilen işten keyif alırım.|team",
"İşimin büyük bölümünü tek başıma yapmak isterim.|team|r",
"Düzenli geri bildirim almak beni geliştirir.|team",
"Çalışma saatlerimi belirleyebilmek önemlidir.|flex",
"Yeni bir yöntem denemek için özgürlük isterim.|flex",
"Kesin kurallar beni rahatlatır.|flex|r",
"Planım değiştiğinde kolayca uyum sağlarım.|flex"
],["Öğrenme alanını odak tercihlerine göre düzenle.","Tek bir ideal çalışma ortamı yoktur; görev değiştikçe ihtiyaçların da değişebilir.","Bu tercihlerini staj veya proje deneyimlerinle karşılaştır."]);
add("emotions","Duygusal Farkındalık","relationship","♡","scale",
"Duygularını tanıma, ifade etme ve düzenleme eğilimlerini gözlemle.",
[
 ["notice","Fark etme","Duygularını ayırt etmek için biraz daha zamana ihtiyaç duyabilirsin.","Duygularını erken fark etmeye daha yatkın görünüyorsun."],
 ["express","İfade etme","Duygularını paylaşırken daha temkinli olabilirsin.","Duygularını anlaşılır biçimde ifade edebiliyorsun."],
 ["regulate","Düzenleme","Yoğun duygularda sakinleşme yöntemlerini geliştirebilirsin.","Zor duygularla baş etmek için yöntemler kullanıyorsun."]
],[
"Bir duygu yaşadığımda onu adlandırabilirim.|notice",
"Bedenimdeki gerginliğin ne zaman arttığını fark ederim.|notice",
"Üzüldüğümde nedenini anlamakta zorlanırım.|notice|r",
"Farklı duyguları birbirinden ayırabiliyorum.|notice",
"Duygumu anlatmak için uygun sözcükleri bulurum.|express",
"Kırıldığımda bunu suçlamadan anlatabilirim.|express",
"Önemli duygularımı genelde içime atarım.|express|r",
"Ne hissettiğimi güvendiğim biriyle paylaşabilirim.|express",
"Zorlandığımda bana iyi gelen sakinleşme yöntemleri bilirim.|regulate",
"Kızdığımda cevap vermeden önce bekleyebilirim.|regulate",
"Gerginlik yaşarken başka hiçbir şeye odaklanamam.|regulate|r",
"Rahatsız edici bir duygu zamanla hafifleyene kadar kendime alan açabilirim.|regulate"
],["Günlükte duygunu, bedenindeki etkisini ve ihtiyacını ayrı ayrı yaz.","İfade etmekte zorlandığında kısa ve açık 'Ben ... hissediyorum' cümlelerini dene.","Bu test psikiyatrik tanı veya tedavi aracı değildir."]);
add("attachment","Yakın İlişkide Bağlanma Eğilimleri","relationship","◌","scale",
"Yakınlık, güven ve bağımsızlık tercihlerini keşfet.",
[
 ["trust","Güven ve yakınlık","Yakınlık kurarken daha fazla zamana ihtiyaç duyabilirsin.","Güvenli yakınlık kurmaya daha açık görünüyorsun."],
 ["worry","İlişki kaygısı","Belirsizliği daha kolay tolere edebiliyor olabilirsin.","Belirsizlikte güvence arama eğilimin daha yüksek olabilir."],
 ["distance","Mesafe ihtiyacı","Yakın temas ve paylaşımı daha çok sevebilirsin.","Kendi alanını koruma ihtiyacın daha yüksek olabilir."]
],[
"Güvendiğim biriyle zorlandığım konuları paylaşabilirim.|trust",
"Yakın birinin desteğini kabul etmek bana kolay gelir.|trust",
"İnsanlara güvenmekte her zaman zorlanırım.|trust|r",
"Bir ilişkide karşılıklı açıklığı değerli bulurum.|trust",
"Mesaja geç cevap geldiğinde kötü ihtimaller düşünürüm.|worry",
"Birinin benden uzaklaştığını hissettiğimde çok kaygılanırım.|worry",
"İlgisizlikten emin olmadan endişem büyür.|worry",
"Yakınlarımdan sık sık güvence alma ihtiyacı duyarım.|worry",
"Zor dönemlerde yalnız kalmak isterim.|distance",
"Çok sık iletişim beklentisi beni yorabilir.|distance",
"Başkalarına bağımlı olmaktan kaçınırım.|distance",
"Yakın ilişkim olsa bile geniş kişisel alan isterim.|distance"
],["İhtiyaçlarını 'yakınlık', 'güvence' ve 'alan' başlıklarında ayrı düşün.","Sonuçlar değişmez bağlanma etiketleri değildir; ilişkiye ve döneme göre farklılaşabilir.","Belirsizlik olduğunda varsaymak yerine açık ve saygılı iletişimi dene."]);
add("relationship-fit","İlişkilerde Önceliklerin","relationship","❥","duo",
"Bir ilişkide hangi olumlu yaklaşımın sana daha yakın olduğunu gör.",
[
 ["talk","Paylaşım / alan","Yoğun paylaşım sana yakın.","Kişisel alanı koruma sana yakın."],
 ["plan","Plan / spontane","Önceden plan yapmak sana yakın.","Birlikte spontane kararlar sana yakın."],
 ["calm","Sakinlik / heyecan","Sakin ve tanıdık düzen sana yakın.","Yenilik ve macera sana yakın."]
],[
"Gün içinde sık sık konuşmak isterim.|Birbirimize kişisel alan bırakmayı isterim.|talk",
"Hislerimizi düzenli paylaşmayı tercih ederim.|Konuşmadan da kendimize zaman ayırmayı tercih ederim.|talk",
"Birlikte çok vakit geçirmek hoşuma gider.|Ayrı ilgi alanlarımızın olmasını önemserim.|talk",
"Özel günleri önceden planlarım.|Birlikte anlık fikirlerle hareket ederim.|plan",
"Tatil programı hazır olunca rahatlarım.|Tatilin akışını gittiğimiz yerde belirlerim.|plan",
"Buluşma saatini netleştirmeyi severim.|Esnek buluşma planlarını severim.|plan",
"Tanıdık mekânlarda buluşmak hoşuma gider.|Yeni yerler keşfetmek hoşuma gider.|calm",
"Huzurlu bir akşam benim için idealdir.|Hareketli bir etkinlik benim için idealdir.|calm",
"Birlikte kurduğumuz rutinleri severim.|Birlikte sürpriz deneyimler yaşamayı severim.|calm",
"Uzun sohbetleri tercih ederim.|Kısa ama yoğun etkinlikleri tercih ederim.|talk",
"Ortak takvimi kullanmak isterim.|Planı koşullara göre değiştirmeyi severim.|plan",
"Sakin bir gezi seçerim.|Macera dolu bir gezi seçerim.|calm"
],["İki insanın farklı tercihleri olması uyumsuz oldukları anlamına gelmez.","Önceliklerini karşı tarafla örnekler üzerinden açıkça paylaş.","Bu test iki kişilik bilimsel uyumluluk ölçümü değildir."]);
add("communication","İletişim Tarzı","relationship","↗","duo",
"Farklı iletişim biçimleri arasındaki kişisel tercihlerini fark et.",
[
 ["direct","Düşünerek / doğrudan","Düşünerek ve zaman alarak ifade etme yakın.","Doğrudan ve hızlı ifade etme yakın."],
 ["detail","Ayrıntı / öz","Ayrıntılı anlatım sana yakın.","Kısa ve öz anlatım sana yakın."],
 ["listen","Dinleme / yönlendirme","Daha çok dinleyerek ilerlemek sana yakın.","Çözüm ve yönlendirmeye geçmek sana yakın."]
],[
"Konuşmadan önce cümlemi düşünürüm.|Düşüncemi anında ifade ederim.|direct",
"Zor konuşmaya hazırlanırım.|Konuyu bekletmeden açarım.|direct",
"Yanıtlamadan önce duraksarım.|Hızla karşılık veririm.|direct",
"Bir durumu tüm ayrıntılarıyla anlatırım.|En önemli noktayı söylerim.|detail",
"Yazışırken uzun açıklamalar yazarım.|Kısa ve net mesajlar yazarım.|detail",
"Örneklere bolca yer veririm.|Sonucu doğrudan belirtirim.|detail",
"Birini uzun süre dinlerim.|Ona çözüm seçeneklerini hemen sunarım.|listen",
"Soru sorarak anlamaya çalışırım.|Yol göstererek yardımcı olmaya çalışırım.|listen",
"Önce duygusunu anlamaya çalışırım.|Önce yapılacakları konuşurum.|listen",
"Duygusal bir mesajı sakinleşince yanıtlarım.|Bekletmeden yanıtlamayı tercih ederim.|direct",
"Konuşmaya arka planı anlatarak başlarım.|Giriş yapmadan konuya gelirim.|detail",
"Birinin kendi çözümünü bulmasını beklerim.|Alternatif fikirler öneririm.|listen"
],["İletişimde niyet ile karşı taraftaki etkiyi ayrı değerlendir.","Zor bir konuşmada 'Senden ne bekliyorum?' sorusunu önceden düşün.","Farklı üslup tercihleri iyi dinleme becerisiyle dengelenebilir."]);
add("leadership","Liderlik Eğilimleri","career","♧","scale",
"İnisiyatif, iş birliği ve planlı yürütme eğilimlerini tanı.",
[
 ["initiative","İnisiyatif","Görünür liderlik yerine destek rollerine yakın olabilirsin.","Yeni işlerde sorumluluk almaya yakınsın."],
 ["include","Katılım","Bağımsız karar almayı daha fazla tercih edebilirsin.","Farklı görüşleri karara katmaya yaklaşıyorsun."],
 ["execute","Uygulama","Fikir üretme kısmında daha güçlü hissediyor olabilirsin.","Planı hayata geçirme konusunda istekli görünüyorsun."]
],[
"Ortada lider yoksa görevi üstlenebilirim.|initiative",
"Yeni bir projenin ilk adımını atabilirim.|initiative",
"Karar verme sorumluluğundan kaçınırım.|initiative|r",
"Belirsizlikte ekibe seçenek sunabilirim.|initiative",
"Bir karardan önce herkesin fikrini duymak isterim.|include",
"Sessiz kalan kişinin de konuşmasına alan açarım.|include",
"Farklı önerileri dinlemek beni gereksiz yavaşlatır.|include|r",
"Anlaşmazlıkta ortak zemini ararım.|include",
"Hedefi küçük görevlere ayırabilirim.|execute",
"Süreçte ilerlemeyi düzenli izlerim.|execute",
"Plan yaparım ama tamamlamayı başkasına bırakırım.|execute|r",
"Verdiğim sözü zamanında yerine getirmeye özen gösteririm.|execute"
],["Liderlik yalnızca öne çıkmak değil, başkalarının gelişimine alan açmaktır.","Küçük bir ekip görevinde farklı roller deneyerek gözlem yap.","Önerilen gelişim alanları kişisel tercihlerinle birlikte düşünülmeli."]);
add("self-worth","Öz Değer ve Öz Güven","growth","✳","scale",
"Kendinle kurduğun ilişkinin gündelik örüntülerini fark et.",
[
 ["accept","Kendini kabul","Kendine karşı daha eleştirel davranıyor olabilirsin.","Hatalarınla birlikte kendini kabul etmeye yakınsın."],
 ["assert","Kendini ifade","İhtiyaçlarını söylemekte zorlanıyor olabilirsin.","İhtiyaçlarını açıkça ifade etme eğilimin güçlü."],
 ["recover","Yeniden deneme","Bir başarısızlıktan sonra toparlanmak zaman alabilir.","Zorluklardan sonra yeniden denemeye yatkınsın."]
],[
"Hata yaptığımda kendime anlayış gösterebilirim.|accept",
"Başkalarının başarısı kendi değerimi azaltmaz.|accept",
"Küçük eksiklerimi büyütme eğilimindeyim.|accept|r",
"Bir işte zorlanmam değersiz olduğum anlamına gelmez.|accept",
"İhtiyaç duyduğumda yardım isteyebilirim.|assert",
"Fikrimi saygılı biçimde söyleyebilirim.|assert",
"Başkaları üzülmesin diye sürekli kendimden vazgeçerim.|assert|r",
"İstemediğim bir şeye hayır demeyi deneyebilirim.|assert",
"Bir hedefte zorlanınca alternatif yol ararım.|recover",
"Olumsuz geri bildirimden ders çıkarabilirim.|recover",
"Tek bir başarısızlık denemekten vazgeçmeme neden olur.|recover|r",
"İlerlemeyi küçük adımlarla sürdürebilirim.|recover"
],["Kendi değerini tek bir sonuç veya başkasının onayıyla ölçmemeye çalış.","Bir hafta boyunca çabanla ilgili üç somut not al.","Bu bir klinik öz saygı ölçeği ya da ruh sağlığı taraması değildir."]);
add("stress","Zorluklarla Başa Çıkma","growth","≈","scale",
"Stresli anlarda hangi baş etme alışkanlıklarını kullandığını fark et.",
[
 ["plan","Problem çözme","Sorunun çevresinde düşünme eğilimi artıyor olabilir.","Somut adımlarla ilerleme eğilimin belirgin."],
 ["support","Destek arama","Güçlükleri kendi başına çözmeye çalışabilirsin.","Güvendiğin kişilerden destek almaya açıksın."],
 ["rest","Dinlenme ve sınırlar","Mola ve dinlenme ihtiyacını erteleyebilirsin.","Dinlenmeyi ve sınır koymayı önemseyebiliyorsun."]
],[
"Zor bir durumda kontrol edebildiğim kısmı belirlerim.|plan",
"Büyük problemi küçük adımlara bölerim.|plan",
"Tek bir sorun yüzünden her şeyin kötüye gittiğini düşünürüm.|plan|r",
"Bir sonraki somut adımı not ederim.|plan",
"İhtiyacım olduğunda güvendiğim birinden yardım isterim.|support",
"Bir konuyu paylaşınca daha net düşünebilirim.|support",
"Her zorluğu tek başıma atlatmalıyım diye düşünürüm.|support|r",
"Destek aramayı güçlü bir davranış olarak görürüm.|support",
"Zihnim yorulduğunda kısa mola verebilirim.|rest",
"Uykumu ve beslenmemi zor dönemlerde de önemserim.|rest",
"Dinlenirsem geri kalacağımı düşünürüm.|rest|r",
"Gerektiğinde bir işi erteleyip dinlenebilirim.|rest"
],["Kendine iyi gelen üç gerçekçi baş etme yöntemini yaz.","Yüksek stres uzun sürüyorsa güvendiğin bir yetişkin veya uzmanla görüş.","Bu sonuç tıbbi veya psikolojik tanı anlamına gelmez."]);
add("social","Sosyal Etkileşim Tarzı","relationship","☼","scale",
"Yeni insanlarla tanışma, dinleme ve sınır koyma alışkanlıklarını tanı.",
[
 ["approach","Sohbet başlatma","Yeni ortamlarda ısınmak için zamana ihtiyaç duyabilirsin.","Yeni ortamlarda daha kolay iletişim başlatabiliyorsun."],
 ["listen","Dinleme","Daha çok kendi düşünceni ifade etme eğilimin olabilir.","Başkalarının söylediklerini anlamaya zaman ayırıyorsun."],
 ["bound","Sınırlar","Başkalarının beklentilerine bazen fazla uyum sağlayabilirsin.","Kendi zamanını ve sınırlarını koruyabiliyorsun."]
],[
"Yeni bir gruba katıldığımda selam verip sohbet başlatırım.|approach",
"Ortak ilgi alanı bulmak için soru sorarım.|approach",
"Tanımadığım insanlarla konuşmaktan daima kaçınırım.|approach|r",
"Yeni ortamlara katılma fırsatlarını değerlendirebilirim.|approach",
"Biri konuşurken sözünü bitirmesini beklerim.|listen",
"Birini anladığımdan emin olmak için sorarım.|listen",
"Karşımdakini dinlerken aklımda sürekli vereceğim cevap vardır.|listen|r",
"Farklı görüşe sahip birini de dikkatle dinleyebilirim.|listen",
"İstemediğim daveti kibarca geri çevirebilirim.|bound",
"Yalnız kalmaya ihtiyaç duyduğumda bunu söylerim.|bound",
"Kendi işimi bırakıp sürekli başkalarına yetişmeye çalışırım.|bound|r",
"İlişkilerde karşılıklı saygı ve kişisel alanı önemserim.|bound"
],["Sosyal başarı herkesle konuşmak değil, sana uygun bağlar kurmaktır.","Küçük bir sohbet başlatma hedefini güvenli bir ortamda dene.","Sınır koymak ilişkilerden uzaklaşmak anlamına gelmez."]);
add("procrastination","Erteleme Alışkanlığı","growth","◷","scale",
"Bir işi başlatma, sürdürme ve tamamlama alışkanlıklarını incele.",
[
 ["start","Başlama","Başlangıç için daha fazla hazırlığa ihtiyaç duyabiliyorsun.","Görevlere zamanında başlama eğilimin güçlü."],
 ["focus","Devam ettirme","Dikkat dağıtıcılar ilerlemeyi zorlaştırabiliyor olabilir.","Bir işe devam etmek için yöntemler kullanıyorsun."],
 ["finish","Tamamlama","Son kontroller ve bitirme aşaması zorlayıcı olabilir.","Başladığın işleri tamamlamaya yatkınsın."]
],[
"Yapmam gereken işe belirlediğim zamanda başlarım.|start",
"Zor işe başlamadan önce küçük ilk adımı atarım.|start",
"İşim olsa da sürekli daha uygun bir an beklerim.|start|r",
"Günün önemli görevine öncelik veririm.|start",
"Çalışırken bildirimleri kapatabilirim.|focus",
"Kısa çalışma aralıkları planlayabilirim.|focus",
"En küçük kesintide uzun süre geri dönemem.|focus|r",
"Dikkatim dağıldığında görevime geri dönerim.|focus",
"Bir işi teslim etmeden önce kontrol ederim.|finish",
"Tamamladıklarımı listede işaretlemek beni destekler.|finish",
"Bitirmeye yaklaşınca işi bırakırım.|finish|r",
"Son teslim tarihinden önce işimi bitirmeye çalışırım.|finish"
],["Bugün ertelediğin iş için iki dakikalık bir başlangıç seç.","Pomodoro bölümündeki kısa odak seanslarını kullan.","Erteleme bazen yorgunluk veya koşullarla da ilişkilidir; yalnızca irade meselesi değildir."]);
add("decisions","Karar Verme Yaklaşımın","growth","⇄","duo",
"Seçim yaparken öne çıkan dört farklı yaklaşımı karşılaştır.",
[
 ["speed","Düşünme / hız","Seçenekleri tartarak ilerlemek sana yakın.","Hızla karar alıp uygulamak sana yakın."],
 ["source","İçgörü / veri","Kişisel sezgilerine güvenmek sana yakın.","Ölçülebilir bilgi aramak sana yakın."],
 ["view","Bağımsızlık / görüş alma","Kararı kendi değerlendirmene dayandırmak yakın.","Birden fazla görüşe danışmak yakın."]
],[
"Bir seçim için zaman ayırırım.|İlk iyi seçeneği uygulamaya geçerim.|speed",
"Seçenekleri uzun uzun karşılaştırırım.|Hızlı karar vermeyi severim.|speed",
"Hataları azaltmak için beklerim.|Deneyip gerekirse düzeltirim.|speed",
"Sezgilerimle karar vermek beni rahatlatır.|Karar öncesi veri toplamak isterim.|source",
"Bir seçeneğin bana hissettirdiği önemlidir.|Ölçülebilir sonuçları önemserim.|source",
"İlk izlenimime güvenirim.|Karşılaştırma tablosu hazırlarım.|source",
"Kararı önce kendi içimde netleştiririm.|Yakınlarımdan fikir alırım.|view",
"Bağımsız seçim yapmak isterim.|Farklı deneyimleri duymak isterim.|view",
"İçgüdülerimi önce kendim sorgularım.|Çevremle fikir alışverişi yaparım.|view",
"Karar vermek için bolca zaman isterim.|Fırsat geçmeden harekete geçerim.|speed",
"Kendime yakın gelen seçeneği seçerim.|Kanıtları önce değerlendiririm.|source",
"Son kararı sessizce veririm.|Birlikte düşünerek karar veririm.|view"
],["Hızlı karar ile doğru karar her zaman aynı değildir.","Önemli seçimlerde hem veriyi hem kişisel değerlerini değerlendirmeye çalış.","Karar öncesi 'Geri dönüşü mümkün mü?' sorusunu sor."]);
add("study","Çalışma ve Öğrenme Alışkanlıkları","growth","▤","scale",
"Çalışma rutini, geri çağırma ve takip alışkanlıklarını gözlemle.",
[
 ["plan","Planlı çalışma","Çalışma saatlerin dalgalanıyor olabilir.","Düzenli bir çalışma rutinin var."],
 ["active","Aktif öğrenme","Daha çok okumaya ve izlemeye dayanıyor olabilirsin.","Kendini sınama ve uygulama yöntemlerini kullanıyorsun."],
 ["review","Tekrar ve takip","Tekrarları planlamakta zorlanıyor olabilirsin.","Öğrendiklerini düzenli gözden geçiriyorsun."]
],[
"Haftanın çalışma saatlerini kabaca belirlerim.|plan",
"Çalışma için uygun ve sakin ortam oluştururum.|plan",
"Ne çalışacağıma son anda karar veririm.|plan|r",
"Çalışma hedefimi küçük parçalara ayırırım.|plan",
"Bir konudan sonra kendime soru sorarım.|active",
"Yeni öğrendiklerimi kendi cümlelerimle anlatırım.|active",
"Yalnızca notlara bakarak öğrenmenin yeterli olduğunu düşünürüm.|active|r",
"Bilgiyi farklı örneklerde uygulamaya çalışırım.|active",
"Önceki konuları belli aralıklarla tekrar ederim.|review",
"Yanlış yaptığım soruları gözden geçiririm.|review",
"Bir konuyu bir kez bitirince asla dönmem.|review|r",
"İlerlemeni takip etmek için basit kayıt tutarım.|review"
],["Aktif hatırlama ve aralıklı tekrar yöntemlerini küçük görevlerle dene.","Sana uyan bir çalışma planı oluşturmak için Akademi'nin planlayıcısını kullan.","Bir gün aksattığında planı tamamen bırakmak yerine sonraki gün devam et."]);
add("motivation","Motivasyon Kaynakların","growth","✧","scale",
"Başlama isteğinin hangi kaynaklardan beslendiğini keşfet.",
[
 ["meaning","Anlam ve merak","Dış hedefler ve sonuçlar daha belirleyici olabilir.","Merak ve kişisel anlam senin için öne çıkıyor."],
 ["goal","Başarma isteği","Süreci sürdürmek sonuçtan önemli olabilir.","Net hedefler ve ilerleme isteği seni harekete geçiriyor."],
 ["community","Birlikte üretme","Bireysel ilerleme sana daha çekici gelebilir.","Başkalarıyla gelişmek sana enerji veriyor."]
],[
"Yeni şeyler öğrenmenin kendisi beni mutlu eder.|meaning",
"Yaptığım işin bana ne kattığını düşünürüm.|meaning",
"Bir ödül yoksa öğrenmeye istek duymam.|meaning|r",
"Merak ettiğim konuda zamanın nasıl geçtiğini anlamam.|meaning",
"Bir hedef belirlemek beni harekete geçirir.|goal",
"İlerlemenin ölçülebilir olmasını severim.|goal",
"Hedeflerim olmasa daima aynı çabayı gösteririm.|goal|r",
"Tamamladığım adımları görmek motive eder.|goal",
"Birlikte çalışan insanlarla daha istekli olurum.|community",
"Bir grubun parçası olmak beni cesaretlendirir.|community",
"Başkalarının desteği benim için hiç önemli değildir.|community|r",
"Ortak başarıları kutlamaktan hoşlanırım.|community"
],["Tek bir motivasyon kaynağına güvenmek yerine farklı kaynakları birleştir.","Yaptığın işin senin için neden değerli olduğunu bir cümleyle yaz.","Motivasyonun değişmesi normaldir; küçük rutinler sürekliliğe yardımcı olabilir."]);
add("logic","Mantıksal Akıl Yürütme Alıştırması","growth","⌗","logic",
"Sayı, sözcük ve örüntü sorularıyla mantıksal düşünme pratiği. IQ testi değildir.",
[],[
"2, 4, 8, 16, ?|24~30~32~36|2",
"Bir sınıfta 5 sıra var, her sırada 4 sandalye. Toplam kaç sandalye var?|16~18~20~24|2",
"1, 4, 9, 16, ?|20~24~25~36|2",
"Bütün kediler memelidir. Bazı memeliler suda yaşar. Kesin doğru olan nedir?|Bütün kediler suda yaşar~Bazı kediler suda yaşar~Bütün kediler memelidir~Hiçbir kedi suda yaşamaz|2",
"3, 6, 11, 18, ?|24~25~27~29|2",
"Kuzeye bakan biri sağa dönüp sonra tekrar sağa dönerse hangi yöne bakar?|Kuzey~Güney~Doğu~Batı|1",
"Bir toplantı 14.20'de başlıyor ve 45 dakika sürüyor. Kaçta biter?|14.55~15.00~15.05~15.15|2",
"AZ, BY, CX, ?|DV~DW~EX~EW|1",
"12'nin yarısı ile 18'in üçte birinin toplamı kaçtır?|10~11~12~14|2",
"Üç kardeşin yaşları 4, 7 ve 10. Beş yıl sonra yaşları toplamı kaç olur?|26~31~36~41|2"
],["Soruları sadece düşünme alıştırması olarak değerlendir.","Yanlış yaptığın soru türlerini farklı örneklerle yeniden dene.","Bu sonuç IQ, zeka düzeyi veya klinik bilişsel ölçüm değildir."]);
add("self-awareness","Kendini Tanıma Yolculuğu","growth","◉","scale",
"İhtiyaç, değer ve gelişim hedeflerini düşünmene yardımcı bir öz değerlendirme.",
[
 ["values","Değerlerini tanıma","Önceliklerini netleştirmek için zamana ihtiyaç duyabilirsin.","Senin için önemli olan değerleri daha iyi tanımlıyorsun."],
 ["needs","İhtiyaçlarını anlama","Kendine neyin iyi geldiğini araştırma aşamasında olabilirsin.","İhtiyaçlarını ve sınırlarını ayırt edebiliyorsun."],
 ["reflect","Öz değerlendirme","Geçmiş deneyimlerden öğrenmeye daha çok alan açabilirsin.","Deneyimlerini gözden geçirip yeni adımlar bulabiliyorsun."]
],[
"Benim için önemli olan üç değeri sayabilirim.|values",
"Kararlarımın değerlerimle ne kadar uyumlu olduğunu düşünürüm.|values",
"Bir şeyi neden istediğimi açıklamakta zorlanırım.|values|r",
"Benim için başarılı bir günün ne olduğunu bilirim.|values",
"Yorulduğumda neye ihtiyacım olduğunu fark edebilirim.|needs",
"Bir olayda hangi sınırımın aşıldığını anlatabilirim.|needs",
"Kendimi iyi hissetmek için ne yapacağımı hiç bilmem.|needs|r",
"Dinlenmek ve bağlantı kurmak arasındaki ihtiyacımı ayırabilirim.|needs",
"Bir deneyimden sonra ne öğrendiğimi düşünürüm.|reflect",
"Bir hatadan sonra farklı bir yol bulabilirim.|reflect",
"Geçmiş kararlarımdan hiçbir ders çıkarmam.|reflect|r",
"Kendimle ilgili görüşlerimi yeni bilgilerle değiştirebilirim.|reflect"
],["Bugün seni mutlu eden ve zorlayan birer anı not al.","Bir hedefi neden istediğini anlamak için 'neden?' sorusunu birkaç kez sor.","Kendini tanıma tek bir skorla tamamlanan bir süreç değildir."]);
window.PT_LIBRARY={categories,tests};
})();