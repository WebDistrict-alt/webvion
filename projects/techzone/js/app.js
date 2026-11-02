/* TECHZONE — app shell: router, header, search, drawer, global actions */
(function () {
  const { CATEGORIES, PRODUCTS } = window.TZ_DATA;
  const Store = window.TZ_STORE;
  const UI = window.TZ_UI;
  const Pages = window.TZ_PAGES;
  const { icon, esc, money, toast } = UI;

  const view = document.getElementById('main');
  const header = document.getElementById('header');

  /* ---------- Router ---------- */
  function parse() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));
    return { path: path.replace(/\/+$/, '') || '/', query };
  }

  function resolve({ path, query }) {
    const seg = path.split('/').filter(Boolean);
    switch (seg[0]) {
      case undefined: return Pages.home();
      case 'catalog': return Pages.catalog(query);
      case 'category': return UI.catBySlug(seg[1]) ? Pages.catalog(query, { cat: seg[1] }) : Pages.notFound();
      case 'new': return Pages.catalog(query, { only: 'new' });
      case 'sale': return Pages.catalog(query, { only: 'sale' });
      case 'product': return Pages.product(seg[1]);
      case 'cart': return Pages.cart();
      case 'checkout': return Pages.checkout();
      case 'order': return Pages.orderSuccess(seg[1]);
      case 'favorites': return Pages.favorites();
      case 'account': return Pages.account(seg[1]);
      case 'about': return Pages.about();
      case 'delivery': return Pages.delivery();
      case 'warranty': return Pages.warranty();
      case 'reviews': return Pages.reviews();
      case 'contacts': return Pages.contacts();
      case 'faq': return Pages.faq();
      default: return Pages.notFound();
    }
  }

  let cleanup = null;
  let token = 0;
  let first = true;

  function render() {
    const route = parse();
    const page = resolve(route);
    if (page.redirect) { history.replaceState(null, '', '#' + page.redirect); return render(); }
    const my = ++token;

    const swap = () => {
      if (my !== token) return;
      if (typeof cleanup === 'function') cleanup();
      cleanup = null;
      view.classList.remove('leaving');
      view.innerHTML = page.html;
      document.title = page.title;
      window.scrollTo(0, 0);
      if (page.mount) cleanup = page.mount(view) || null;
      UI.observeReveal(view);
      setActiveNav(page.nav || route.path.split('/')[1] || 'home');
      if (!first) {
        view.classList.remove('entering');
        void view.offsetWidth;
        view.classList.add('entering');
        view.focus({ preventScroll: true });
      }
      first = false;
    };

    closeDrawer();
    closeSearch();
    if (first || UI.reduceMotion()) swap();
    else { view.classList.add('leaving'); setTimeout(swap, 170); }
  }

  function setActiveNav(key) {
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === key));
    document.querySelectorAll('#drawerNav a').forEach(a => a.classList.toggle('active', a.dataset.key === key));
  }

  /* ---------- Header: counts, scroll state, mega menu, footer ---------- */
  function paintCounts() {
    const set = (type, n) => {
      const el = document.querySelector(`[data-count="${type}"]`);
      el.textContent = n > 99 ? '99+' : n;
      el.hidden = n === 0;
    };
    set('cart', Store.cartCount());
    set('fav', Store.state.favorites.length);
    document.getElementById('cartLink').setAttribute('aria-label', `Корзина: ${Store.cartCount()} товаров`);
    document.getElementById('favLink').setAttribute('aria-label', `Избранное: ${Store.state.favorites.length} товаров`);
  }
  Store.subscribe(paintCounts);

  const count = slug => PRODUCTS.filter(p => p.cat === slug).length;
  document.getElementById('mega').innerHTML = CATEGORIES.map(c => `<a href="#/category/${c.slug}"><span class="mega__icon">${icon(c.icon)}</span><span><strong>${c.name}</strong><small>${count(c.slug)} моделей · ${c.desc.toLowerCase()}</small></span></a>`).join('');
  document.getElementById('footerCats').innerHTML = CATEGORIES.map(c => `<li><a href="#/category/${c.slug}">${c.name}</a></li>`).join('');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Close mega menu after choosing a category (hover state would otherwise keep it open)
  document.getElementById('mega').addEventListener('click', () => {
    const m = document.getElementById('mega');
    m.style.visibility = 'hidden';
    setTimeout(() => { m.style.visibility = ''; }, 400);
    document.activeElement && document.activeElement.blur();
  });

  /* ---------- Mobile drawer ---------- */
  const drawer = document.getElementById('drawer');
  const burger = document.getElementById('burger');
  const drawerLinks = [
    ['home', '#/', 'home', 'Главная'], ['catalog', '#/catalog', 'grid', 'Каталог'], ['new', '#/new', 'sparkle', 'Новинки'], ['sale', '#/sale', 'tag', 'Акции'], ['about', '#/about', 'info', 'О магазине']
  ];
  document.getElementById('drawerNav').innerHTML =
    drawerLinks.map(([k, h, ic, l]) => `<a href="${h}" data-key="${k}">${icon(ic)}${l}</a>`).join('') +
    `<div class="drawer__label">Категории</div>` +
    CATEGORIES.map(c => `<a href="#/category/${c.slug}">${icon(c.icon)}${c.name}</a>`).join('') +
    `<div class="drawer__label">Аккаунт</div>` +
    [['account', '#/account', 'user', 'Личный кабинет'], ['favorites', '#/favorites', 'heart', 'Избранное'], ['cart', '#/cart', 'cart', 'Корзина'], ['delivery', '#/delivery', 'truck', 'Доставка и оплата'], ['contacts', '#/contacts', 'call', 'Контакты']]
      .map(([k, h, ic, l]) => `<a href="${h}" data-key="${k}">${icon(ic)}${l}</a>`).join('');
  document.querySelectorAll('#drawerNav a').forEach((a, i) => { a.style.transitionDelay = `${Math.min(i, 14) * 25}ms`; });

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(() => drawer.querySelector('[data-close-drawer].icon-btn').focus(), 50);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  burger.addEventListener('click', openDrawer);
  drawer.addEventListener('click', e => { if (e.target.closest('[data-close-drawer]')) closeDrawer(); });

  /* ---------- Search overlay ---------- */
  const search = document.getElementById('search');
  const sInput = document.getElementById('searchInput');
  const sResults = document.getElementById('searchResults');
  const popular = ['iPhone 17', 'MacBook', 'AirPods', 'PlayStation', 'Galaxy', 'Apple Watch'];

  function drawSearch() {
    const q = sInput.value.trim();
    if (!q) {
      sResults.innerHTML = `<p class="search__hint">Популярные запросы</p><div class="search__tags">${popular.map(t => `<button class="chip" data-q="${esc(t)}">${icon('search')}${esc(t)}</button>`).join('')}</div>
        <p class="search__hint" style="margin-top:22px">Категории</p><div class="search__tags">${CATEGORIES.map(c => `<a class="chip" href="#/category/${c.slug}">${icon(c.icon)}${c.name}</a>`).join('')}</div>`;
      return;
    }
    const found = PRODUCTS.filter(p => Pages.matches(p, q)).sort((a, b) => b.pop - a.pop);
    sResults.innerHTML = found.length
      ? `<p class="search__hint">Найдено: ${found.length}</p><div class="search__list">${found.slice(0, 6).map(p => `<a class="search__item" href="#/product/${p.id}" data-id="${p.id}"><img src="${p.thumb}" alt=""><div><strong>${esc(p.name)}</strong><span>${money(p.price)} · ${esc(UI.catBySlug(p.cat).name)}</span></div></a>`).join('')}</div>
         <a class="btn btn--ghost search__all" href="#/catalog?q=${encodeURIComponent(q)}">Все результаты (${found.length}) ${icon('arrow')}</a>`
      : `<p class="search__hint">По запросу «${esc(q)}» ничего не найдено. Попробуйте изменить запрос.</p>`;
  }

  function openSearch() {
    search.classList.add('open');
    search.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    drawSearch();
    setTimeout(() => sInput.focus(), 80);
  }
  function closeSearch() {
    if (!search.classList.contains('open')) return;
    search.classList.remove('open');
    search.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
  document.getElementById('searchOpen').addEventListener('click', openSearch);
  search.addEventListener('click', e => {
    if (e.target.closest('[data-close-search]')) closeSearch();
    const tag = e.target.closest('[data-q]');
    if (tag) { sInput.value = tag.dataset.q; drawSearch(); sInput.focus(); }
  });
  sInput.addEventListener('input', drawSearch);
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const q = sInput.value.trim();
    location.hash = '/catalog' + (q ? '?q=' + encodeURIComponent(q) : '');
    closeSearch();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSearch(); closeDrawer(); }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* ---------- Global actions: add to cart, favorites ---------- */
  function addToCart(id, opts, imgEl) {
    const p = Store.byId(id);
    if (!p) return;
    if (p.stock <= 0) { toast({ title: 'Нет в наличии', text: p.name, iconName: 'info', tone: 'red' }); return; }
    Store.addToCart(id, opts);
    UI.flyToCart(imgEl);
    setTimeout(() => UI.bumpCount('cart'), UI.reduceMotion() ? 0 : 750);
    const opt = opts && (opts.config || opts.color) ? [opts.color, p.configs.length > 1 ? opts.config : null].filter(Boolean).join(' · ') : money(p.price);
    toast({ title: 'Добавлено в корзину', text: `${p.name} — ${opt}`, image: p.thumb, link: { href: '#/cart', label: 'Корзина' } });
  }

  function toggleFav(id) {
    const on = Store.toggleFav(id);
    const p = Store.byId(id);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'Убрать из избранного' : 'Добавить в избранное');
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
    if (on) UI.bumpCount('fav');
    toast({ title: on ? 'Добавлено в избранное' : 'Удалено из избранного', text: p.name, iconName: 'heart', tone: on ? '' : 'red', link: on ? { href: '#/favorites', label: 'Открыть' } : null });
  }

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const cardEl = add.closest('.card');
      addToCart(add.dataset.add, null, cardEl && cardEl.querySelector('.card__media img'));
      const label = add.querySelector('span');
      if (label) {
        add.classList.add('added');
        add.querySelector('svg').outerHTML = icon('check');
        label.textContent = 'Добавлено';
        clearTimeout(add._t);
        add._t = setTimeout(() => { add.classList.remove('added'); add.querySelector('svg').outerHTML = icon('cart'); label.textContent = 'В корзину'; }, 1500);
      }
      return;
    }
    const fav = e.target.closest('[data-fav]');
    if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }
  });

  // Skip link without breaking the hash router
  document.querySelector('.skip-link').addEventListener('click', e => { e.preventDefault(); view.focus(); });

  /* ---------- Newsletter ---------- */
  document.getElementById('subscribeForm').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.getElementById('subEmail');
    const hint = document.getElementById('subHint');
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { hint.textContent = 'Введите корректный email'; hint.className = 'subscribe__hint bad'; input.focus(); return; }
    Store.setSubscribed(email);
    input.value = '';
    hint.textContent = `Готово! Подписка оформлена на ${email}`;
    hint.className = 'subscribe__hint ok';
    toast({ title: 'Вы подписались на рассылку', text: email, iconName: 'mail' });
  });
  if (Store.state.subscribed) document.getElementById('subHint').textContent = `Вы подписаны: ${Store.state.subscribed}`;

  // Keep the cart count in sync with other tabs
  window.addEventListener('storage', e => { if (e.key === 'techzone:v1') location.reload(); });

  window.TZ_APP = { addToCart, toggleFav, render };
  window.addEventListener('hashchange', render);
  paintCounts();
  render();
})();
