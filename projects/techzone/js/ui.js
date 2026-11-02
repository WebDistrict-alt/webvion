/* TECHZONE — shared UI helpers: icons, formatting, product cards, toasts, animations */
(function () {
  const { CATEGORIES } = window.TZ_DATA;
  const Store = window.TZ_STORE;

  const PATHS = {
    phone: '<rect x="6.5" y="2" width="11" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
    laptop: '<rect x="4" y="4.5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20"/>',
    tablet: '<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    headphones: '<path d="M3.5 18v-5a8.5 8.5 0 0 1 17 0v5"/><rect x="2.5" y="13.5" width="4.5" height="7" rx="1.5"/><rect x="17" y="13.5" width="4.5" height="7" rx="1.5"/>',
    watch: '<rect x="6" y="6" width="12" height="12" rx="3.5"/><path d="M9 6 9.6 2.5h4.8L15 6M9 18l.6 3.5h4.8L15 18M12 9.5V12l1.5 1"/>',
    gamepad: '<path d="M7 8h10a5 5 0 0 1 4.8 6.4l-.9 3a2.5 2.5 0 0 1-4.3.9L14.5 16h-5l-2.1 2.3a2.5 2.5 0 0 1-4.3-.9l-.9-3A5 5 0 0 1 7 8Z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="15.5" cy="11.5" r=".6"/><circle cx="17.5" cy="13.5" r=".6"/>',
    monitor: '<rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M8.5 21h7M12 16.5V21"/>',
    plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0V7ZM12 17v5"/>',
    heart: '<path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6Z"/>',
    cart: '<path d="M6 7h15l-1.6 8.1a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.6L5 3H2"/><circle cx="9.5" cy="20.5" r="1.2"/><circle cx="17.5" cy="20.5" r="1.2"/>',
    bag: '<path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    star: '<path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 13h11l1-13M9 7V4h6v3"/>',
    truck: '<path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    shield: '<path d="M12 2.5 4.5 5.5v6c0 4.7 3.2 8.4 7.5 10 4.3-1.6 7.5-5.3 7.5-10v-6L12 2.5Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.6L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.3 4.6L20 15.5M20 20v-4.5h-4.5"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h3"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8S10.5 3.5 8 3.5a2.2 2.2 0 0 0 0 4.5h4ZM12 8s1.5-4.5 4-4.5a2.2 2.2 0 0 1 0 4.5h-4Z"/>',
    store: '<path d="M3.5 9.5 5 4h14l1.5 5.5M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0M5 12v8.5h14V12M10 20.5v-5h4v5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    box: '<path d="m12 2.5 8.5 4.5v10L12 21.5 3.5 17V7L12 2.5Z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v10"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 6.5 9 6.5 9-6.5"/>',
    pin: '<path d="M12 21.5s-7-6.1-7-12a7 7 0 0 1 14 0c0 5.9-7 12-7 12Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    call: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.9a16 16 0 0 0 4.7 4.7l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
    tag: '<path d="M3 12V3.5h8.5L21 13l-8 8-10-9Z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    support: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M19.5 19a3 3 0 0 1-3 2.5H13"/>',
    logout: '<path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15M10 16l-4-4 4-4M6 12h10"/>',
    home: '<path d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6h-6v6H4.5a1 1 0 0 1-1-1v-9.5Z"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.9M12 17v.2"/>',
    chat: '<path d="M20.5 12a8.5 8.5 0 0 1-12.2 7.6L3.5 21l1.4-4.8A8.5 8.5 0 1 1 20.5 12Z"/>'
  };

  const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || ''}</svg>`;

  const nf = new Intl.NumberFormat('ru-RU');
  const money = n => nf.format(Math.round(n)) + ' ₽';
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catBySlug = slug => CATEGORIES.find(c => c.slug === slug);
  const dateRu = iso => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  const BADGE = { new: ['Новинка', 'badge--new'], hit: ['Хит', 'badge--hit'], sale: ['Скидка', 'badge--sale'] };

  function stars(rating) {
    let out = '';
    for (let i = 1; i <= 5; i++) out += icon('star', rating >= i - .25 ? '' : 'off');
    return `<span class="stars" aria-hidden="true">${out}</span>`;
  }

  function ratingHtml(p) {
    return `<div class="rating" aria-label="Рейтинг ${p.rating} из 5, ${p.reviews} ${plural(p.reviews, 'отзыв', 'отзыва', 'отзывов')}">
      ${stars(p.rating)}<b>${p.rating.toFixed(1)}</b><span class="rating__full">· ${nf.format(p.reviews)} ${plural(p.reviews, 'отзыв', 'отзыва', 'отзывов')}</span><span class="rating__short">(${nf.format(p.reviews)})</span></div>`;
  }

  function badgesHtml(p) {
    const list = [];
    if (p.badge && BADGE[p.badge]) list.push(p.badge);
    if (p.oldPrice && p.badge !== 'sale') list.push('sale');
    if (!list.length) return '';
    return `<div class="badges">${list.map(b => {
      const [label, cls] = BADGE[b];
      const pct = b === 'sale' && p.oldPrice ? ` −${Math.round((1 - p.price / p.oldPrice) * 100)}%` : '';
      return `<span class="badge ${cls}">${label}${pct}</span>`;
    }).join('')}</div>`;
  }

  function card(p) {
    const fav = Store.isFav(p.id);
    const alt = p.images[1] ? `<img class="alt" src="${p.images[1].replace('w=900', 'w=600')}" alt="" loading="lazy">` : '';
    return `<article class="card reveal" data-id="${p.id}">
      <a class="card__media" href="#/product/${p.id}" tabindex="-1" aria-hidden="true">
        <img src="${p.thumb}" alt="${esc(p.name)}" loading="lazy">${alt}
      </a>
      ${badgesHtml(p)}
      <button class="fav-btn${fav ? ' active' : ''}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Убрать из избранного' : 'Добавить в избранное'}">${icon('heart')}</button>
      <div class="card__body">
        <span class="card__brand">${esc(p.brand)}</span>
        <h3 class="card__title"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <p class="card__specs">${p.short.map(esc).join(' · ')}</p>
        ${ratingHtml(p)}
        <div class="card__foot">
          <div class="price">
            ${p.oldPrice ? `<span class="price__old">${money(p.oldPrice)}</span>` : ''}
            <span class="price__now${p.oldPrice ? ' is-sale' : ''}">${money(p.price)}</span>
          </div>
          <button class="cart-btn" data-add="${p.id}" aria-label="Добавить ${esc(p.name)} в корзину">${icon('cart')}<span>В корзину</span></button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Toasts ---------- */
  function toast({ title, text = '', image, iconName = 'check', tone = '', link }) {
    const box = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `${image ? `<img src="${image}" alt="">` : `<span class="toast__ic ${tone ? 'toast__ic--' + tone : ''}">${icon(iconName)}</span>`}
      <div class="toast__body"><strong>${esc(title)}</strong>${text ? `<span>${esc(text)}</span>` : ''}</div>
      ${link ? `<a href="${link.href}">${esc(link.label)}</a>` : ''}`;
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 300); };
    const t = setTimeout(close, 3200);
    el.addEventListener('click', e => { if (e.target.closest('a')) { clearTimeout(t); close(); } });
  }

  /* ---------- Fly-to-cart animation ---------- */
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function flyToCart(fromImg) {
    const target = document.getElementById('cartLink');
    if (!fromImg || !target || reduceMotion()) return;
    const a = fromImg.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    if (!a.width) return;
    const clone = fromImg.cloneNode();
    clone.className = 'fly-img';
    clone.removeAttribute('loading');
    Object.assign(clone.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(clone);
    requestAnimationFrame(() => {
      const size = 28;
      const dx = b.left + b.width / 2 - (a.left + size / 2);
      const dy = b.top + b.height / 2 - (a.top + size / 2);
      clone.style.width = size + 'px';
      clone.style.height = size + 'px';
      clone.style.transform = `translate(${dx}px, ${dy}px) rotate(12deg)`;
      clone.style.opacity = '.2';
    });
    setTimeout(() => clone.remove(), 900);
  }

  function bumpCount(type) {
    const el = document.querySelector(`[data-count="${type}"]`);
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  /* ---------- Scroll reveal ---------- */
  let io;
  function observeReveal(root = document) {
    const items = root.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || reduceMotion()) { items.forEach(el => el.classList.add('in')); return; }
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    }
    // stagger siblings inside grids
    items.forEach(el => {
      const parent = el.parentElement;
      if (parent && !el.style.getPropertyValue('--d')) {
        const idx = Array.prototype.indexOf.call(parent.children, el);
        el.style.setProperty('--d', Math.min(idx % 8, 7) * 0.06 + 's');
      }
      io.observe(el);
    });
  }

  /* ---------- Image fallback (if a remote photo fails) ---------- */
  function fallbackSvg(name) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9a9aa5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name] || PATHS.box}</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  document.addEventListener('error', e => {
    const el = e.target;
    if (el.tagName !== 'IMG' || el.dataset.fallback) return;
    el.dataset.fallback = '1';
    const host = el.closest('[data-id]');
    const p = host && Store.byId(host.dataset.id);
    const cat = p ? catBySlug(p.cat) : null;
    el.src = fallbackSvg(cat ? cat.icon : (el.dataset.icon || 'box'));
    el.classList.add('img-fallback');
  }, true);

  window.TZ_UI = { icon, money, plural, esc, nf, card, stars, ratingHtml, badgesHtml, toast, flyToCart, bumpCount, observeReveal, catBySlug, dateRu, BADGE, reduceMotion };
})();
