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

## Geliştirme planı

Bloglar ✅ → Yapılacaklar listesi ✅ → Pratik hesaplama araçları ✅ → Pomodoro → Kitap özetleri → diğer akademi özellikleri.

Bu ilk sürümde henüz hazır olmayan bölümler yalnızca "Yakında" olarak gösterilir ve çalışmayan butonlara bağlanmaz.

## Görev verileri hakkında

Şu anda görevler cihazın kendi `localStorage` alanında tutulur. Oturum açma/hesap bağlantısı henüz olmadığı için farklı cihazlar arasında eşitlenmez. Kişisel görevleri herkese açık Supabase tablolarında saklamayın; senkronizasyon için kullanıcı oturumu ve kullanıcıya ait RLS gereklidir.
