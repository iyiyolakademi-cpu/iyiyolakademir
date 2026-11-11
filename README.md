# İyi Yol Akademi — Web Sitesi

İyi Yol Akademi için bağımsız, mobil ve masaüstü uyumlu statik web sitesi.

## Sayfalar

- `index.html`: Ana sayfa, kategoriler ve son 3 blog yazısı.
- `blog.html`: Kategori filtreleme ve başlık/açıklama araması.
- `post.html?slug=<slug>`: Yazarın metnini bozmadan makale okuma ekranı; metin boyutu ve okuma teması.
- `site.js`: Supabase API'ye **yalnızca okuma** erişimi; HTML güvenli biçimlendirme süzgeci.

## Supabase

Proje: `iyi-yol-akademi-web` (OynaBak'tan bağımsız)

- İçerik tabloları: `blog_categories`, `blog_posts`.
- Yalnızca `published` olan ve yayın tarihi geçmiş yazılar anonim olarak okunabilir.
- Yazılar Supabase'e tek tek eklenir; içerikler veritabanında tutulduğu için her yazı için GitHub güncellemesi gerekmez.
- Frontend sadece publishable key kullanır. **Secret / service_role** anahtarlarını HTML/JS'e koymayın.
- RLS herkese açık SELECT ile sınırlıdır; ziyaretçi yayınlayamaz veya silemez.

## Yayınlama — GitHub Pages

1. GitHub'da `iyiyolakademir` isimli **yeni bir public repo** oluşturun.
2. Bu paketin içindeki **tüm dosyaları ve `site.css`, `site.js` ve `favicon.svg` dosyalarını** repo köküne ekleyin.
3. Repo **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)** seçin.
4. Yayın işlemi tamamlandıktan sonra sitenin adresi:
   `https://iyiyolakademi-cpu.github.io/iyiyolakademir/`

Not: Yukarıdaki URL ancak depo oluşturulup Pages etkinleştirildikten sonra çalışır. Projenin ayrı bir alan adına bağlanması için GitHub Pages CNAME ve DNS ayarları gerekir.

## Yerel kontrol

Statik siteyi dosyaya çift tıklayarak değil, yerel HTTP sunucusu üzerinden açın:

```sh
python -m http.server 8000
```

Adres: `http://localhost:8000`

## Eklenen yeni web bölümleri

- `tarifler.html`: Beyaz temalı, mobil ve PC uyumlu yemek tarifleri merkezi. 200 tarif ve 16 kategori.
- `recipes-data.json`: Verdiğin HTML'den metinleri değiştirmeden alınan 200 tarif, malzemeler, pişirme adımları ve beslenme bilgileri.
- `recipes.js`, `recipes.css`: Tarif arama, kategori filtresi, zorluk/süre filtresi, favoriler, rastgele tarif, porsiyon ayarlama ve pişirme modu.
- `hesaplama.html`, `calculator-full.js`, `calculator-full.css`: Gönderilen Pratik Hesaplama Araçları HTML kaynağındaki 11 hesaplama aracı ve özgün görünümü.
- `yapilacaklar.html`, `tasks.js`, `tasks.css`: Mobil ve masaüstü görev planlayıcı, renkli öncelikler, düzenleme, silme ve günlük/haftalık takip.
- `brand-full.svg`: Verilen tam İyi Yol Akademi logosu; üst menü ve alt bilgiye kırpılmadan yerleştirilmiştir. Sekme simgesi ayrı `brand-mark.svg` dosyasını kullanır.

**Görevler ve favori tarifler:** Bu sürümde kendi tarayıcının yerel depolamasında saklanır. Farklı cihazlar arasında otomatik eşitlenmez.

## Geliştirme planı

Bloglar ✅ → Yapılacaklar listesi ✅ → Pratik hesaplama araçları (11 araç) ✅ → Yemek tarifleri (200 tarif) ✅ → Pomodoro → Kitap özetleri → diğer akademi özellikleri.

Bu ilk sürümde henüz hazır olmayan bölümler yalnızca "Yakında" olarak gösterilir ve çalışmayan butonlara bağlanmaz.

## Görev verileri hakkında

Şu anda görevler cihazın kendi `localStorage` alanında tutulur. Oturum açma/hesap bağlantısı henüz olmadığı için farklı cihazlar arasında eşitlenmez. Kişisel görevleri herkese açık Supabase tablolarında saklamayın; senkronizasyon için kullanıcı oturumu ve kullanıcıya ait RLS gereklidir.

## Günün sözü / tavsiyesi ve kişilik testleri

- `gunun-sozu.html`, `daily.js`: Her gün Türkiye saat dilimine göre otomatik değişen özgün söz ve uygulanabilir tavsiye. Ana sayfada da gösterilir. Günlük içerik kümesi şu an 31 söz + 31 tavsiyeden oluşur; sunucu gerektirmez.
- `testler.html`: Site menüsü ve mobil/masaüstü uyumlu test sunumu.
- `testler-uygulama.html`: Kullanıcının gönderdiği siyah tema, 5 kategori, 100 test, 10 soru/test, sonuç hesaplama ve kayıt kodu eksiksiz korunur. Ana sitenin beyaz CSS'inden etkilenmemesi için aynı alan adında, izole bir iframe'de çalışır. Puanlar tarayıcının yerel depolamasındadır.
- `brand-full.svg`: Önceden verilen altın-beyaz logonun aynısı kullanılır. Harici siyah-beyaz tema dönüşümü, döndürme veya renk filtresi uygulanmaz. Tüm sayfaların üst/alt logosu ve sekme simgesi aynı dosyaya bağlıdır.

Testler yalnızca farkındalık ve eğlence amaçlıdır, klinik değerlendirme değildir.


## Profesyonel web sitesi güncellemesi — 10 Kasım 2026

Bu depo İyi Yol Akademi'nin tüm statik web sitesi kodlarını içerir. GitHub Pages için main dalı ve kök dizin kullanılır.

### Yeni özellikler
- arama.html: Blog yazıları, 200 yemek tarifi ve 100 kişilik testinde tek yerden arama
- kaydedilenler.html: Kaydedilmiş bloglar, favori tarifler, son okunan yazılar
- post.html: Kaydetme, bağlantı paylaşma, okuma ilerlemesi, içindekiler, ilgili bloglar
- site-features.js / site-features.css: Sade mobil hızlı menü, arama ve okuma araçlarının ortak kodları
- testler-index.json: Kullanıcının sağladığı 100 özgün teste ait arama dizini
- testler-uygulama.html: Test numarası ile doğrudan açılış desteği; sorular ve puanlama korunur
- gizlilik.html / yayin-ilkeleri.html: Şeffaf bilgi ve yayın ilkeleri
- robots.txt / sitemap.xml / 404.html: Statik SEO ve kayıp sayfa yönlendirmesi

### Veri depolama
Kaydedilmiş bloglar, son okunanlar, favori tarifler ve yapılacaklar listesi bu sürümde yalnızca kullanıcının tarayıcısındaki yerel depolamada tutulur. Kullanıcı hesabı veya farklı cihazlar arasında otomatik senkronizasyon henüz yoktur. Supabase yalnızca yayımlanmış blog içeriğini herkese açık okuma erişimiyle sunar.

### SEO sınırları
Bu sürümün site haritası statik sayfalara yöneliktir. Blogların post.html?slug= ve tariflerin tarifler.html?id= adresleri için ayrı statik SEO sayfaları üretmek ileride faydalı olabilir. Arama ve kişisel kaydedilenler ekranları noindex olarak işaretlenmiştir.

### Kontrol listesi
1. GitHub Pages ayarı: main / (root).
2. Mobil 320–430 px ve masaüstünde sayfalar, menüler ve dokunma alanlarını aç.
3. Blog kaydetme ve paylaşma, tarif favorileri, arama filtreleri ve test bağlantılarını dene.
4. Site dosyaları v=20261110-pro sürüm etiketini kullanır; gerekirse sayfayı yenile.
5. Orijinal İyi Yol Akademi logosu, 100 kişilik testi ve 200 yemek tarifi korunmuştur.

Tüm kaynak: https://github.com/iyiyolakademi-cpu/iyiyolakademir

## 10 Kasım 2026 — Sade sol menü ve Pomodoro

- Tüm HTML sayfalarında `refine.css` ve yeni `site-features.js` üzerinden soldan açılan tek menü vardır. Masaüstü ve telefon menüsünde bütün içerik ve araç sayfaları listelenir. Menü tıklanınca kendi sayfasını açar; ESC ile kapanır ve klavye odağı menü içinde tutulur.
- Ana sayfadaki bölüm seçimi altı sade doğrudan bağlantıya dönüştürüldü. Logo görseli değiştirilmeden yatay sunumda kullanılır.
- `pomodoro.html`, `pomodoro.js`, `pomodoro.css`: 15/25/50 dakikalık odaklanma, kısa/uzun mola, duraklatma, sıfırlama ve günlük tur takibi. Odaklanma verileri tarayıcıda `iya_pomodoro_v1` anahtarı altında tutulur.
- Hesaplama araçları açık renkli liste ve tek sütun mobil görünüm ile tasarlandı. Orijinal hesaplama fonksiyonları korunur.
- Günün sözü ve tavsiyesi ayrı sade beyaz içerik alanlarında gösterilir. Görev planlayıcının ekranı ve bilgi metinleri sadeleştirildi; görev verileri korunur.
- Güncel önbellek sürümü `v=20261110-nav2` şeklindedir. GitHub Pages: `main` / `(root)`.


## Kişisel Araçlar (Kasım 2026)

gelisim-araclari.html sayfasında dört özellik birlikte çalışır:

- Kitap Okuma Takipçisi: Kitap adı, yazarı, toplam ve okunan sayfalar; günlük sayfa kayıtları ve tamamlanma.
- Gelecekteki Kendime Mektup: Başlık, mektup, gelecekteki açılma tarihi; tarihi gelince ekranda açma ve takvime ekleme.
- Akıllı Çalışma Planlayıcısı: Ders, sınav tarihi, uygun günler, günlük süre ve başlangıç saati ile dengeli oturum dağıtımı; tamamlanma işaretleri ve takvim dışa aktarımı.
- Hatırlatmalar: Tek seferlik, günlük, hafta içi, haftalık, aylık veya yıllık tekrarlar; site açıkken tarayıcı bildirimleri ve .ics takvim dışa aktarımı.

tasks-simple.css, eski günlük görevlerin verisini koruyarak görev listesini görsel olarak sadeleştirir. growth.js içindeki hedef, alışkanlık, 7/21/30 günlük program, duygu günlüğü ve haftalık değerlendirmeler korunur.

### Teknik sınırlar ve veri koruma

Bu sürüm, kullanıcıya özel içerikleri tarayıcı localStorage alanında saklar. Farklı cihazlarla eşitleme yoktur. Mektuplar, günlükler ve JSON yedekleri şifrelenmiş değildir. Gelecek tarihli mektup kilidi yalnızca arayüzdedir. Sayfa kapalıyken site tek başına bildirim gönderemez: .ics dosyaları takvim uygulamasına içe aktarılmalı ve cihazda takvim alarm izinleri etkin olmalıdır. Tarayıcı bildirimleri yalnızca sayfa açıkken çalışır; haricî takvimle oluşturulan hatırlatmalar, takvim uygulamasının şartlarına bağlıdır.
