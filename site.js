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

  function makePostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    const href = 'post.html?slug=' + encodeURIComponent(post.slug);
    if (post.cover_url && /^https:\/\//i.test(post.cover_url)) {
      const visual = document.createElement('div');
      visual.className = 'post-visual post-visual-photo';
      const image = document.createElement('img');
      image.src = post.cover_url;
      image.alt = post.title || 'İyi Yol Akademi yazısı';
      image.loading = 'lazy';
      image.decoding = 'async';
      visual.appendChild(image);
      card.appendChild(visual);
    }
    const content = document.createElement('div');
    content.className = 'post-content';
    const labels = document.createElement('div');
    labels.className = 'post-type-row';
    const kind = document.createElement('span');
    kind.className = 'post-type-label';
    kind.textContent = 'BLOG YAZISI';
    const category = document.createElement('span');
    category.className = 'post-category-label';
    category.textContent = post.blog_categories?.name || 'Genel';
    labels.append(kind, category);
    const heading = document.createElement('h3');
    const link = document.createElement('a');
    link.href = href;
    link.textContent = post.title;
    heading.appendChild(link);
    const description = document.createElement('p');
    description.textContent = post.excerpt || '';
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    const details = document.createElement('span');
    details.textContent = [displayDate(post.published_at), post.read_minutes ? post.read_minutes + ' dk okuma' : ''].filter(Boolean).join(' · ');
    const readLink = document.createElement('a');
    readLink.className = 'post-read-link';
    readLink.href = href;
    readLink.textContent = 'Yazıyı oku →';
    meta.append(details, readLink);
    content.append(labels, heading, description, meta);
    card.appendChild(content);
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


  function getIsoWeekInfo(date = new Date()) {
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const isoDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    const dayNumber = isoDate.getUTCDay() || 7;
    isoDate.setUTCDate(isoDate.getUTCDate() + 4 - dayNumber);
    const isoYear = isoDate.getUTCFullYear();
    const yearStart = new Date(Date.UTC(isoYear, 0, 1));
    const week = Math.ceil((((isoDate - yearStart) / 86400000) + 1) / 7);
    const weekStart = new Date(localDate);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const startLabel = weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    const endLabel = weekEnd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    return { key: `${isoYear}-W${String(week).padStart(2, '0')}`, start: weekStart, label: `${startLabel} – ${endLabel}` };
  }

  function hashEditorialWeek(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function chooseWeeklyEditorialPost(posts, weekInfo) {
    if (!posts.length) return null;
    const beforeThisWeek = posts.filter((post) => {
      const published = Date.parse(post.published_at || '');
      return Number.isFinite(published) && published < weekInfo.start.getTime();
    });
    const base = beforeThisWeek.length ? beforeThisWeek : posts;
    const withCover = base.filter((post) => /^https:\/\//i.test(post.cover_url || ''));
    const candidates = (withCover.length ? withCover : base)
      .slice()
      .sort((a, b) => String(a.slug).localeCompare(String(b.slug), 'tr'));
    return candidates[hashEditorialWeek(weekInfo.key) % candidates.length] || null;
  }

  function makeEditorialNote(post) {
    const category = post.blog_categories?.name;
    if (category) return `Bu hafta ${category.toLocaleLowerCase('tr-TR')} üzerine düşünmek ve konuya yeni bir pencereden bakmak isteyenler için seçtik.`;
    return 'Bu hafta yeni bir bakış açısı kazanmak ve kendine biraz zaman ayırmak isteyenler için seçtik.';
  }

  function renderEditorChoice(container, post, weekInfo) {
    if (!container) return;
    container.replaceChildren();
    const link = 'post.html?slug=' + encodeURIComponent(post.slug);
    const card = document.createElement('div');
    card.className = 'ed-editor-choice-card';

    const media = document.createElement('a');
    media.className = 'ed-editor-choice-media';
    media.href = link;
    media.setAttribute('aria-label', post.title);
    if (/^https:\/\//i.test(post.cover_url || '')) {
      const image = document.createElement('img');
      image.src = post.cover_url;
      image.alt = post.title || 'Editörün seçimi';
      image.loading = 'eager';
      image.fetchPriority = 'high';
      image.decoding = 'async';
      media.appendChild(image);
    } else {
      const fallback = document.createElement('span');
      fallback.className = 'ed-editor-choice-fallback';
      fallback.textContent = 'iyi yol.';
      media.appendChild(fallback);
    }
    const stamp = document.createElement('span');
    stamp.className = 'ed-editor-choice-stamp';
    stamp.textContent = 'BU HAFTANIN SEÇİMİ';
    media.appendChild(stamp);

    const content = document.createElement('div');
    content.className = 'ed-editor-choice-content';
    const labels = document.createElement('div');
    labels.className = 'ed-editor-choice-labels';
    const category = document.createElement('span');
    category.textContent = post.blog_categories?.name || 'İYİ YOL AKADEMİ';
    const edition = document.createElement('span');
    edition.textContent = 'EDİTÖRÜN SEÇİMİ';
    labels.append(category, edition);

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = link;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);

    const note = document.createElement('div');
    note.className = 'ed-editor-note';
    const noteLabel = document.createElement('span');
    noteLabel.textContent = 'EDİTÖRÜN NOTU';
    const noteText = document.createElement('p');
    noteText.textContent = makeEditorialNote(post);
    note.append(noteLabel, noteText);

    const excerpt = document.createElement('p');
    excerpt.className = 'ed-editor-choice-excerpt';
    excerpt.textContent = post.excerpt || '';

    const meta = document.createElement('div');
    meta.className = 'ed-editor-choice-meta';
    const details = document.createElement('span');
    details.textContent = [post.author || '', post.read_minutes ? `${post.read_minutes} dk okuma` : '', displayDate(post.published_at)].filter(Boolean).join(' · ');
    const read = document.createElement('a');
    read.href = link;
    read.className = 'ed-editor-choice-read';
    read.textContent = 'Yazıyı oku ↗';
    meta.append(details, read);

    content.append(labels, title, note);
    if (excerpt.textContent) content.appendChild(excerpt);
    content.appendChild(meta);
    card.append(media, content);
    container.appendChild(card);
    const weekLabel = $('#editorChoiceWeek');
    if (weekLabel) weekLabel.textContent = weekInfo.label;
  }

  function renderFeaturedStories(container, posts) {
    if (!container) return;
    container.replaceChildren();
    if (!posts.length) {
      showStatus(container, 'Öne çıkan başka bir yazı bulunmuyor.');
      return;
    }
    posts.slice(0, 3).forEach((post, index) => {
      const href = 'post.html?slug=' + encodeURIComponent(post.slug);
      const item = document.createElement('article');
      item.className = 'ed-highlight-item';
      const imageLink = document.createElement('a');
      imageLink.className = 'ed-highlight-image';
      imageLink.href = href;
      imageLink.setAttribute('aria-label', post.title);
      if (/^https:\/\//i.test(post.cover_url || '')) {
        const image = document.createElement('img');
        image.src = post.cover_url;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        imageLink.appendChild(image);
      } else {
        imageLink.classList.add('ed-highlight-no-image');
        imageLink.textContent = 'İYİ YOL';
      }
      const copy = document.createElement('div');
      copy.className = 'ed-highlight-copy';
      const label = document.createElement('span');
      label.className = 'ed-highlight-category';
      label.textContent = post.blog_categories?.name || 'BLOG';
      const heading = document.createElement('h3');
      const titleLink = document.createElement('a');
      titleLink.href = href;
      titleLink.textContent = post.title;
      heading.appendChild(titleLink);
      const meta = document.createElement('span');
      meta.className = 'ed-highlight-meta';
      meta.textContent = [post.read_minutes ? `${post.read_minutes} dk okuma` : '', displayDate(post.published_at)].filter(Boolean).join(' · ');
      copy.append(label, heading, meta);
      const number = document.createElement('span');
      number.className = 'ed-highlight-number';
      number.textContent = String(index + 1).padStart(2, '0');
      item.append(number, imageLink, copy);
      container.appendChild(item);
    });
  }

  function renderEditorialCategories(container, categories, posts) {
    if (!container) return;
    container.replaceChildren();
    let available = categories;
    if (!available.length) {
      const seen = new Set();
      available = posts.reduce((items, post) => {
        const category = post.blog_categories;
        if (category?.slug && !seen.has(category.slug)) {
          seen.add(category.slug);
          items.push({ slug: category.slug, name: category.name || 'Diğer', description: '' });
        }
        return items;
      }, []);
    }
    let rendered = 0;
    available.forEach((category) => {
      const matching = posts.filter((post) => post.blog_categories?.slug === category.slug);
      if (!matching.length) return;
      const section = document.createElement('section');
      section.className = 'ed-editorial-category';
      const heading = document.createElement('div');
      heading.className = 'ed-editorial-category-heading';
      const kicker = document.createElement('span');
      kicker.className = 'ed-kicker';
      kicker.textContent = 'KATEGORİ';
      const title = document.createElement('h3');
      title.textContent = category.name;
      const description = document.createElement('p');
      description.textContent = category.description || `${category.name} alanındaki yazılar ve yeni bakış açıları.`;
      const all = document.createElement('a');
      all.className = 'ed-text-link';
      all.href = 'blog.html?category=' + encodeURIComponent(category.slug);
      all.textContent = 'Tüm yazılar ↗';
      heading.append(kicker, title, description, all);
      const grid = document.createElement('div');
      grid.className = 'ed-category-posts';
      renderList(grid, matching.slice(0, 3));
      section.append(heading, grid);
      container.appendChild(section);
      rendered += 1;
    });
    const outer = $('#editorialCategories');
    if (outer) outer.hidden = rendered === 0;
  }

  async function initHome() {
    const latestContainer = $('#latestPosts');
    const choiceContainer = $('#editorChoice');
    const highlightsContainer = $('#featuredStories');
    const categoryContainer = $('#categoryStreams');
    try {
      const [posts, categories] = await Promise.all([
        postsQuery(48),
        getData('blog_categories', { select: 'slug,name,description,display_order', order: 'display_order.asc' }).catch(() => [])
      ]);
      if (!posts.length) {
        showStatus(choiceContainer, 'Şu anda yayında olan bir yazı bulunmuyor.');
        showStatus(highlightsContainer, 'Yeni yazılar yayımlandığında burada öne çıkacak.');
        showStatus(latestContainer, 'Şu anda yayında olan bir yazı bulunmuyor.');
        const outer = $('#editorialCategories');
        if (outer) outer.hidden = true;
        return;
      }

      const weekInfo = getIsoWeekInfo();
      const weeklyPick = chooseWeeklyEditorialPost(posts, weekInfo);
      if (weeklyPick) renderEditorChoice(choiceContainer, weeklyPick, weekInfo);

      const highlights = posts.filter((post) => post.slug !== weeklyPick?.slug).slice(0, 3);
      renderFeaturedStories(highlightsContainer, highlights);

      if (latestContainer) {
        renderList(latestContainer, posts.slice(0, 6));
      }
      renderEditorialCategories(categoryContainer, categories, posts);
    } catch (error) {
      console.error('Homepage editorial content error', error);
      showStatus(choiceContainer, 'Editoryal seçki şu anda görüntülenemiyor. Lütfen biraz sonra tekrar deneyin.', 'error-state');
      showStatus(highlightsContainer, 'Öne çıkan yazılar şu anda görüntülenemiyor.', 'error-state');
      showStatus(latestContainer, 'Yazılar şu anda görüntülenemiyor. Lütfen sayfayı yenileyerek tekrar deneyin.', 'error-state');
      const outer = $('#editorialCategories');
      if (outer) outer.hidden = true;
    }
  }

  async function initBlog() {
    const container = $('#blogPosts');
    const tabs = $('#categoryTabs');
    const search = $('#postSearch');
    const sort = $('#phaseBlogSort');
    const resultsHeading = $('#resultsHeading');
    const count = $('#postCount');
    const params = new URLSearchParams(location.search);
    let selected = params.get('category') || 'all';
    if (search && params.get('q')) search.value = params.get('q').slice(0,100);
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
      const sorted = [...filtered];
      const mode = sort?.value || 'new';
      if (mode === 'old') sorted.sort((a,b) => new Date(a.published_at) - new Date(b.published_at));
      else if (mode === 'short') sorted.sort((a,b) => (Number(a.read_minutes)||999) - (Number(b.read_minutes)||999));
      else if (mode === 'long') sorted.sort((a,b) => (Number(b.read_minutes)||0) - (Number(a.read_minutes)||0));
      else if (mode === 'az') sorted.sort((a,b) => a.title.localeCompare(b.title,'tr'));
      else sorted.sort((a,b) => new Date(b.published_at) - new Date(a.published_at));
      const chosenCategory = categories.find((category) => category.slug === selected);
      resultsHeading.textContent = chosenCategory ? chosenCategory.name : 'Tüm blog yazıları';
      count.textContent = `${filtered.length} yazı`;
      if (sorted.length) renderList(container, sorted);
      else showStatus(container, 'Aradığın ölçütlere uygun bir yazı bulunamadı. Başka bir arama deneyebilirsin.');
    }
    search?.addEventListener('input', filterPosts);
    sort?.addEventListener('change', filterPosts);
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
    const PREF_KEY = 'iya_reader_prefs_v1';
    let preference = {};
    try { preference = JSON.parse(localStorage.getItem(PREF_KEY)) || {}; } catch (_) {}
    let theme = THEMES.includes(preference.theme) ? preference.theme : 'light';
    let size = Math.max(14,Math.min(23,Number(preference.size)||17));
    reader.dataset.theme = theme;
    reader.style.setProperty('--read-size', `${size}px`);
    const persist = () => { try { localStorage.setItem(PREF_KEY,JSON.stringify({theme,size})); } catch (_) {} };
    $('#decreaseFont')?.addEventListener('click', () => { size = Math.max(14, size - 1); reader.style.setProperty('--read-size', `${size}px`); persist(); });
    $('#increaseFont')?.addEventListener('click', () => { size = Math.min(23, size + 1); reader.style.setProperty('--read-size', `${size}px`); persist(); });
    $('#switchTheme')?.addEventListener('click', () => {
      theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
      reader.dataset.theme = theme;
      $('#switchTheme').setAttribute('aria-label', `Okuma teması: ${theme}`);
      persist();
    });
  }

  if (page === 'home') initHome();
  if (page === 'blog') initBlog();
  if (page === 'post') initPost();
})();
