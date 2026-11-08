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
