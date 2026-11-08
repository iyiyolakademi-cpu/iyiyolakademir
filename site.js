/* İyi Yol Akademi — GitHub Pages + Supabase (yalnızca herkese açık okuma erişimi). */
(() => {
  'use strict';
  const API_URL = 'https://jcnokkpduzdgymwvxuoh.supabase.co/rest/v1';
  // Supabase publishable anahtarı genel istemci kullanımı içindir; secret/service-role anahtarı değildir.
  const PUBLIC_KEY = 'sb_publishable_C2NPcTXgB4-GNZGyvgfuMw__vJpIaSm';
  const page = document.body.dataset.page;

  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const normalize = (str) => String(str || '').toLocaleLowerCase('tr-TR');

  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  const closeMenu = () => {
    mainNav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Menüyü aç');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
  });
  $$('a', mainNav || document).forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  async function getData(resource, parameters) {
    const query = new URLSearchParams(parameters).toString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(`${API_URL}/${resource}?${query}`, {
        method: 'GET', headers: { apikey: PUBLIC_KEY, Accept: 'application/json' },
        signal: controller.signal, cache: 'no-store'
      });
      if (!response.ok) throw new Error(`İçerik okunamadı (${response.status})`);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  const postsQuery = (limit) => getData('blog_posts', {
    select: 'slug,title,excerpt,author,read_minutes,published_at,cover_url,blog_categories(name,slug)',
    status: 'eq.published',
    published_at: `lte.${new Date().toISOString()}`,
    order: 'published_at.desc', limit: String(limit)
  });

  function displayDate(date) {
    if (!date) return '';
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function makePostCard(post, index) {
    const card = document.createElement('article'); card.className = 'post-card';
    const visual = document.createElement('div'); visual.className = 'post-visual';
    const glyph = document.createElement('span'); glyph.className = 'visual-glyph';
    glyph.setAttribute('aria-hidden', 'true'); glyph.textContent = ['✳', '◌', '✶'][index % 3];
    visual.appendChild(glyph);
    if (post.cover_url && /^https:\/\//i.test(post.cover_url)) {
      const img = document.createElement('img');
      img.src = post.cover_url; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      img.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;object-fit:cover;';
      visual.appendChild(img);
    }
    const visualTag = document.createElement('span'); visualTag.className = 'visual-tag';
    visualTag.textContent = post.blog_categories?.name || 'Blog'; visual.appendChild(visualTag);
    const content = document.createElement('div'); content.className = 'post-content';
    const heading = document.createElement('h3');
    const link = document.createElement('a'); link.href = `post.html?slug=${encodeURIComponent(post.slug)}`;
    link.textContent = post.title; heading.appendChild(link);
    const excerpt = document.createElement('p'); excerpt.textContent = post.excerpt || '';
    const meta = document.createElement('div'); meta.className = 'post-meta';
    const date = document.createElement('span');
    date.textContent = [displayDate(post.published_at), post.read_minutes ? `${post.read_minutes} dk okuma` : ''].filter(Boolean).join(' · ');
    const arrow = document.createElement('span'); arrow.className = 'arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden','true');
    meta.append(date, arrow); content.append(heading, excerpt, meta);
    card.append(visual, content);
    return card;
  }

  function showStatus(container, text, type = 'empty-state') {
    if (!container) return;
    container.replaceChildren();
    const message = document.createElement('div'); message.className = type; message.textContent = text;
    container.appendChild(message);
  }

  function renderList(container, posts) {
    container.replaceChildren(...posts.map(makePostCard));
  }

  async function initHome() {
    const container = $('#latestPosts');
    try {
      const posts = await postsQuery(3);
      if (posts.length) renderList(container, posts);
      else showStatus(container, 'Henüz yayınlanmış yazı bulunmuyor. Çok yakında yeni içerikler burada olacak.');
    } catch (error) {
      console.error('Blog fetch error', error);
      showStatus(container, 'Yazılar şu anda görüntülenemiyor. Lütfen sayfayı yenileyerek tekrar deneyin.', 'error-state');
    }
  }

  async function initBlog() {
    const container = $('#blogPosts');
    const tabs = $('#categoryTabs');
    const search = $('#postSearch');
    const resultsHeading = $('#resultsHeading');
    const count = $('#postCount');
    const params = new URLSearchParams(location.search);
    let selected = params.get('category') || 'all';
    let posts = [];
    let categories = [];

    function drawTabs() {
      tabs.replaceChildren();
      const items = [{ slug: 'all', name: 'Tüm Yazılar' }, ...categories];
      for (const category of items) {
        const btn = document.createElement('button'); btn.type = 'button';
        btn.className = 'filter-btn'; btn.dataset.category = category.slug; btn.textContent = category.name;
        btn.classList.toggle('active', selected === category.slug);
        btn.setAttribute('aria-pressed', String(selected === category.slug));
        btn.addEventListener('click', () => {
          selected = category.slug;
          const url = new URL(location.href);
          if (selected === 'all') url.searchParams.delete('category');
          else url.searchParams.set('category', selected);
          history.replaceState(null, '', url.pathname + url.search);
          drawTabs(); filterPosts();
        });
        tabs.append(btn);
      }
    }
    function filterPosts() {
      const keyword = normalize(search?.value.trim());
      const filtered = posts.filter((post) => {
        const categoryMatch = selected === 'all' || post.blog_categories?.slug === selected;
        const textMatch = !keyword || normalize(`${post.title} ${post.excerpt} ${post.blog_categories?.name || ''}`).includes(keyword);
        return categoryMatch && textMatch;
      });
      const chosenCategory = categories.find((category) => category.slug === selected);
      resultsHeading.textContent = chosenCategory ? chosenCategory.name : 'Tüm blog yazıları';
      count.textContent = `${filtered.length} yazı`;
      if (filtered.length) renderList(container, filtered);
      else showStatus(container, 'Aradığın ölçütlere uygun bir yazı bulunamadı. Başka bir arama deneyebilirsin.');
    }
    search?.addEventListener('input', filterPosts);
    try {
      const [results, categoryList] = await Promise.all([
        postsQuery(100),
        getData('blog_categories', { select: 'slug,name,description,display_order', order: 'display_order.asc' })
      ]);
      posts = results;
      categories = categoryList;
      if (selected !== 'all' && !categories.some((cat) => cat.slug === selected)) selected = 'all';
      drawTabs(); filterPosts();
    } catch (error) {
      console.error('Blog list fetch error', error);
      showStatus(container, 'Blog yazıları şu anda yüklenemiyor. Lütfen internet bağlantını kontrol edip tekrar dene.', 'error-state');
      count.textContent = '';
    }
  }

  // Yalnızca metin içerikleri ve güvenli biçimlendirme etiketlerini içeri aktarır.
  // Kaynak HTML'nin yazı metnini korur; script/iframe/form/event-handler çalıştırmaz.
  const PERMITTED = new Set(['P','SPAN','B','STRONG','I','EM','H1','H2','H3','H4','BLOCKQUOTE','BR','UL','OL','LI','A','IMG','HR','CODE','PRE','DIV']);
  const IGNORE_WITH_CONTENT = new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','INPUT','BUTTON','SVG','MATH','TEMPLATE']);
  function safeArticleMarkup(raw) {
    const parsed = new DOMParser().parseFromString(`<main>${raw}</main>`, 'text/html');
    const root = document.createDocumentFragment();
    const walk = (node, destination) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) { destination.appendChild(document.createTextNode(child.textContent)); continue; }
        if (child.nodeType !== Node.ELEMENT_NODE || IGNORE_WITH_CONTENT.has(child.tagName)) continue;
        if (!PERMITTED.has(child.tagName)) { walk(child, destination); continue; }
        const el = document.createElement(child.tagName.toLowerCase());
        if (child.tagName === 'A') {
          const target = child.getAttribute('href') || '';
          if (/^(https?:\/\/|mailto:)/i.test(target)) { el.setAttribute('href', target); el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener noreferrer'); }
        }
        if (child.tagName === 'IMG') {
          const source = child.getAttribute('src') || '';
          if (!/^https:\/\//i.test(source)) continue;
          el.setAttribute('src', source); el.setAttribute('alt', child.getAttribute('alt') || ''); el.setAttribute('loading', 'lazy');
          el.style.maxWidth = '100%'; el.style.height = 'auto';
        }
        if (/^(P|DIV|SPAN|H[1-4])$/.test(child.tagName)) {
          const align = child.style?.textAlign;
          if (['center','left','right','justify'].includes(align)) el.style.textAlign = align;
        }
        walk(child, el); destination.appendChild(el);
      }
    };
    walk(parsed.body, root);
    return root;
  }

  async function initPost() {
    const body = $('#articleBody');
    const meta = $('#readerMeta');
    const reader = $('#reader');
    const slug = new URLSearchParams(location.search).get('slug') || '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      showStatus(body, 'Yazı adresi geçerli değil. Bloglar sayfasına dönerek bir yazı seçebilirsin.', 'error-state');
      return;
    }
    try {
      const rows = await getData('blog_posts', {
        select: 'slug,title,excerpt,author,read_minutes,published_at,body_html,blog_categories(name,slug)',
        slug: `eq.${slug}`, status: 'eq.published', limit: '1'
      });
      if (!rows?.length) { showStatus(body, 'Aradığın yazı bulunamadı. Yayınlanmamış veya kaldırılmış olabilir.', 'error-state'); return; }
      const post = rows[0];
      body.replaceChildren(safeArticleMarkup(post.body_html || ''));
      document.title = `${post.title} | İyi Yol Akademi`;
      const description = document.createElement('meta');
      description.name = 'description'; description.content = post.excerpt || post.title;
      document.head.appendChild(description);
      meta.textContent = [post.blog_categories?.name || 'Blog', post.read_minutes ? `${post.read_minutes} dk okuma` : '', displayDate(post.published_at)].filter(Boolean).join(' · ');
    } catch (error) {
      console.error('Article fetch error', error);
      showStatus(body, 'Bu yazı şu anda görüntülenemiyor. Lütfen biraz sonra tekrar dene.', 'error-state');
      meta.textContent = 'Bağlantı hatası';
    }
    const THEMES = ['light', 'sepia', 'dark'];
    let theme = 'light'; let size = 16;
    $('#decreaseFont')?.addEventListener('click', () => { size = Math.max(14, size - 1); reader.style.setProperty('--read-size', `${size}px`); });
    $('#increaseFont')?.addEventListener('click', () => { size = Math.min(23, size + 1); reader.style.setProperty('--read-size', `${size}px`); });
    $('#switchTheme')?.addEventListener('click', () => {
      theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
      reader.dataset.theme = theme;
      $('#switchTheme').setAttribute('aria-label', `Okuma teması: ${theme}`);
    });
  }

  if (page === 'home') initHome();
  if (page === 'blog') initBlog();
  if (page === 'post') initPost();
})();
