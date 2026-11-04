/* TravelGo shared UI: icons, header/footer, storage, auth, cards, toasts */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2M6 6V5a2 2 0 0 1 2-2h9"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  heart: '<path d="M12 20s-7.5-4.6-9-9.4C2 7.2 4.3 4 7.6 4c2 0 3.4 1.1 4.4 2.6C13 5.1 14.4 4 16.4 4 19.7 4 22 7.2 21 10.6 19.5 15.4 12 20 12 20z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  sparkles: '<path d="m12 3 1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="m19 15 .8 2.2 2.2.8-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  waves: '<path d="M2 8c2 0 2-1.5 4-1.5S8 8 10 8s2-1.5 4-1.5S16 8 18 8s2-1.5 4-1.5M2 13c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 18c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
  leaf: '<path d="M5 19c0-9 5-14 15-15-1 10-6 15-15 15z"/><path d="m5 19 8-8"/>',
  dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
  utensils: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M17 21V3c-2 1-3 4-3 7s1 4 3 4"/>',
  glass: '<path d="M6 3h12l-6 8zM12 11v9M8 21h8"/>',
  car: '<path d="M5 16v-5l2-5h10l2 5v5M3 16h18v3H3zM5 11h14"/>',
  coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2"/>',
  chef: '<path d="M6 14a4 4 0 0 1-.6-7.9A5 5 0 0 1 12 3a5 5 0 0 1 6.6 3.1A4 4 0 0 1 18 14v6H6zM6 17h12"/>',
  mountain: '<path d="m3 20 6.5-11 4 6 2.5-4L21 20z"/>',
  building: '<rect x="4" y="3" width="10" height="18" rx="1"/><path d="M14 9h6v12h-6M8 7h2M8 11h2M8 15h2"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11v2M14 15v2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2v.1h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  bed: '<path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.5"/>',
  size: '<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
};

const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const LOGO = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
  <defs><linearGradient id="lg-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6C63FF"/><stop offset="1" stop-color="#27D9C3"/></linearGradient></defs>
  <rect x="1" y="1" width="38" height="38" rx="12" fill="#121A2B" stroke="url(#lg-g)" stroke-width="1.5"/>
  <path d="M29 14.5A10 10 0 1 0 30 21H20.5" fill="none" stroke="url(#lg-g)" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="20.5" cy="21" r="2.6" fill="#27D9C3"/>
</svg>`;

/* ---------- storage ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem('tg_' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('tg_' + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

const getUser = () => store.get('user', null);
const favs = () => store.get('favs', { dest: [], hotel: [], exp: [] });
const isFav = (kind, id) => favs()[kind].includes(id);
function toggleFav(kind, id) {
  const f = favs();
  const on = f[kind].includes(id);
  f[kind] = on ? f[kind].filter((x) => x !== id) : [...f[kind], id];
  store.set('favs', f);
  toast(on ? 'Removed from saved' : 'Saved to your account');
  return !on;
}

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const qs = (k) => new URLSearchParams(location.search).get(k);
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const fmtCoord = (lat, lng) => `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const media = (photo, alt, w = 900, cls = '', eager = false) =>
  `<div class="media ${cls}"><img src="${U(photo, w)}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'} onerror="this.parentNode.classList.add('is-broken')"></div>`;

function stars(n) { return `<span class="stars" aria-label="${n} stars">${icon('star').repeat(n)}</span>`; }

/* ---------- cards ---------- */
function destCard(d) {
  return `<article class="card">
    <button class="icon-btn fav ${isFav('dest', d.id) ? 'is-on' : ''}" data-fav="dest:${d.id}" aria-label="Save ${d.name}" aria-pressed="${isFav('dest', d.id)}">${icon('heart')}</button>
    <span class="badge badge-glass">${icon('pin', 'icon-sm')}${d.continent}</span>
    ${media(d.img, `${d.name}, ${d.country}`, 700)}
    <div class="card-body">
      <span class="coord">${fmtCoord(d.lat, d.lng)}</span>
      <h3 class="card-title">${d.name}</h3>
      <p class="card-sub">${d.country}</p>
      <p class="card-text">${d.short}</p>
      <div class="card-foot">
        <span class="price">from ${money(d.budget)} <small>/ 7 days</small></span>
        <a class="btn btn-primary btn-sm" href="destination.html?id=${d.id}">Explore</a>
      </div>
    </div>
  </article>`;
}

function hotelCard(h) {
  return `<article class="card">
    <button class="icon-btn fav ${isFav('hotel', h.id) ? 'is-on' : ''}" data-fav="hotel:${h.id}" aria-label="Save ${h.name}" aria-pressed="${isFav('hotel', h.id)}">${icon('heart')}</button>
    <span class="badge badge-glass">${h.type}</span>
    ${media(h.img, h.name, 700)}
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">${stars(h.stars)}<span class="rating">${icon('star')}${h.rating.toFixed(1)} <span class="muted" style="font-weight:400;font-family:var(--f-body);font-size:13px">(${h.reviews.toLocaleString('en-US')})</span></span></div>
      <h3 class="card-title">${h.name}</h3>
      <p class="card-sub">${icon('pin', 'icon-sm')}${h.city}, ${h.country}</p>
      <p class="card-text">${h.desc}</p>
      <div class="card-foot">
        <span class="price">${money(h.price)} <small>/ night</small></span>
        <a class="btn btn-primary btn-sm" href="hotel.html?id=${h.id}">View Hotel</a>
      </div>
    </div>
  </article>`;
}

function expCard(e) {
  const cat = EXP_CATS.find((c) => c.id === e.cat);
  return `<article class="card exp-card">
    <button class="icon-btn fav ${isFav('exp', e.id) ? 'is-on' : ''}" data-fav="exp:${e.id}" aria-label="Save ${e.title}" aria-pressed="${isFav('exp', e.id)}">${icon('heart')}</button>
    <span class="badge badge-glass">${icon(cat.icon, 'icon-sm')}${cat.label}</span>
    ${media(e.img, e.title, 700)}
    <div class="card-body">
      <p class="card-sub">${icon('pin', 'icon-sm')}${e.city}</p>
      <h3 class="card-title" style="font-size:19px">${e.title}</h3>
      <div class="meta-row"><span>${icon('clock', 'icon-sm')}${e.hours} h</span><span>${icon('users', 'icon-sm')}up to ${e.group}</span><span class="rating">${icon('star')}${e.rating.toFixed(1)}</span></div>
      <div class="card-foot">
        <span class="price">${money(e.price)} <small>/ person</small></span>
        <a class="btn btn-primary btn-sm" href="experience.html?id=${e.id}">See details</a>
      </div>
    </div>
  </article>`;
}

/* ---------- toast ---------- */
function toast(msg, ic = 'check') {
  let zone = $('.toast-zone');
  if (!zone) { zone = document.createElement('div'); zone.className = 'toast-zone'; zone.setAttribute('role', 'status'); document.body.appendChild(zone); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = icon(ic) + `<span>${esc(msg)}</span>`;
  zone.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

/* ---------- modal ---------- */
function openModal(html, wide = false) {
  closeModal();
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div class="modal-box ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">
    <button class="icon-btn x" data-close aria-label="Close">${icon('x')}</button>${html}</div>`;
  document.body.appendChild(m);
  requestAnimationFrame(() => m.classList.add('is-open'));
  m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
  const first = m.querySelector('input, button:not(.x)');
  setTimeout(() => (first || m.querySelector('.x')).focus(), 60);
  return m;
}
function openLightbox(photos, start, name) {
  let i = start;
  const m = openModal(`<div class="media lightbox-img"><img alt=""></div>
    <div class="lightbox-nav"><button class="icon-btn" data-prev aria-label="Previous photo">${icon('left')}</button>
    <span data-count></span><button class="icon-btn" data-next aria-label="Next photo">${icon('right')}</button></div>`, true);
  const show = () => {
    const img = $('img', m);
    img.src = U(photos[i], 1600); img.alt = `${name} photo ${i + 1}`;
    $('[data-count]', m).textContent = `${i + 1} / ${photos.length}`;
  };
  $('[data-prev]', m).onclick = () => { i = (i - 1 + photos.length) % photos.length; show(); };
  $('[data-next]', m).onclick = () => { i = (i + 1) % photos.length; show(); };
  m.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') $('[data-prev]', m).click(); if (e.key === 'ArrowRight') $('[data-next]', m).click(); });
  show();
}
function closeModal() { const m = $('.modal'); if (m) m.remove(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeDrawer(); } });

function openAuth(mode = 'signin') {
  const up = mode === 'signup';
  const m = openModal(`
    <h2>${up ? 'Create your account' : 'Sign in to TravelGo'}</h2>
    <p>${up ? 'Save destinations, keep your trips and book faster.' : 'Pick up your saved trips and bookings.'}</p>
    <form class="modal-form" novalidate>
      ${up ? '<label class="field"><span>Full name</span><input class="input" name="name" autocomplete="name" required></label>' : ''}
      <label class="field"><span>Email</span><input class="input" type="email" name="email" autocomplete="email" required></label>
      <label class="field"><span>Password</span><input class="input" type="password" name="pw" autocomplete="${up ? 'new-password' : 'current-password'}" minlength="6" required></label>
      <p class="form-err" style="color:var(--danger);font-size:14px;min-height:20px" aria-live="polite"></p>
      <button class="btn btn-primary btn-block" type="submit">${up ? 'Create account' : 'Sign in'}</button>
    </form>
    <p class="modal-switch">${up ? 'Already have an account?' : 'New to TravelGo?'} <button type="button" data-switch>${up ? 'Sign in' : 'Create an account'}</button></p>
    <p class="muted" style="font-size:12.5px;text-align:center;margin-top:10px">Demo mode: your details stay in this browser.</p>`);
  $('[data-switch]', m).onclick = () => openAuth(up ? 'signin' : 'signup');
  $('form', m).onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const email = String(f.get('email') || '').trim();
    const err = $('.form-err', m);
    if (up && !String(f.get('name') || '').trim()) { err.textContent = 'Enter your name.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Enter a valid email, like name@example.com.'; return; }
    if (String(f.get('pw') || '').length < 6) { err.textContent = 'Password needs at least 6 characters.'; return; }
    const name = up ? String(f.get('name')).trim() : (getUser()?.name || email.split('@')[0].replace(/^\w/, (c) => c.toUpperCase()));
    store.set('user', { name, email, since: new Date().toISOString().slice(0, 10) });
    closeModal();
    renderHeader();
    toast(up ? `Welcome, ${name}` : `Signed in as ${name}`);
    document.dispatchEvent(new CustomEvent('auth-change'));
  };
}

/* ---------- header / footer ---------- */
const NAV = [
  ['discover.html', 'Discover'],
  ['destinations.html', 'Destinations'],
  ['hotels.html', 'Hotels'],
  ['experiences.html', 'Experiences'],
  ['planner.html', 'AI Planner', true],
];
const page = () => document.body.dataset.page;
const navMatch = (href) => {
  const p = page();
  const map = { 'destination': 'destinations.html', 'hotel': 'hotels.html', 'experience': 'experiences.html', 'builder': 'planner.html' };
  return href === (map[p] || p + '.html');
};

function renderHeader() {
  const u = getUser();
  const links = NAV.map(([h, l, ai]) => `<a href="${h}" class="${ai ? 'nav-ai' : ''}" ${navMatch(h) ? 'aria-current="page"' : ''}>${ai ? icon('sparkles') : ''}${l}</a>`).join('');
  const actions = u
    ? `<a class="user-chip hide-m" href="account.html"><span class="avatar">${esc(u.name[0])}</span>${esc(u.name.split(' ')[0])}</a>`
    : `<button class="btn btn-text hide-m" data-auth="signin">Sign In</button><button class="btn btn-primary hide-m" data-auth="signup">Get Started</button>`;
  let h = $('.site-header');
  if (!h) { h = document.createElement('header'); h.className = 'site-header'; document.body.prepend(h); }
  h.innerHTML = `<div class="wrap">
    <a href="index.html" class="logo" aria-label="TravelGo home">${LOGO}<span>Travel<b>Go</b></span></a>
    <nav class="nav" aria-label="Main">${links}</nav>
    <div class="header-actions">${actions}<button class="icon-btn menu-btn" aria-label="Open menu" aria-expanded="false">${icon('menu')}</button></div>
  </div>`;

  let d = $('.drawer');
  if (!d) { d = document.createElement('div'); d.className = 'drawer'; document.body.appendChild(d); }
  d.innerHTML = `<div class="drawer-panel" role="dialog" aria-label="Menu">
    <button class="icon-btn" data-close-drawer aria-label="Close menu">${icon('x')}</button>
    ${NAV.map(([hh, l]) => `<a class="dl" href="${hh}" ${navMatch(hh) ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
    <a class="dl" href="builder.html" ${page() === 'builder' ? 'aria-current="page"' : ''}>Trip Builder</a>
    ${u ? `<a class="dl" href="account.html">My account</a>` : `<button class="btn btn-ghost" data-auth="signin">Sign In</button><button class="btn btn-primary" data-auth="signup">Get Started</button>`}
  </div>`;
}
function closeDrawer() { const d = $('.drawer'); if (d) d.classList.remove('is-open'); const b = $('.menu-btn'); if (b) b.setAttribute('aria-expanded', 'false'); }

function renderFooter() {
  const f = document.createElement('footer');
  f.className = 'site-footer';
  f.innerHTML = `<div class="wrap">
    <div class="foot-grid">
      <div><a href="index.html" class="logo">${LOGO}<span>Travel<b>Go</b></span></a>
        <p>Find places, compare hotels and plan every day of your trip in one place.</p></div>
      <div><h4>Explore</h4><ul><li><a href="discover.html">World map</a></li><li><a href="destinations.html">Destinations</a></li><li><a href="hotels.html">Hotels</a></li><li><a href="experiences.html">Experiences</a></li></ul></div>
      <div><h4>Plan</h4><ul><li><a href="planner.html">AI Planner</a></li><li><a href="builder.html">Trip Builder</a></li><li><a href="account.html">My trips</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Help centre</a></li><li><a href="#">Privacy</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© 2026 TravelGo. Demo project.</span><span class="coord">${fmtCoord(59.94, 30.31)}</span></div>
  </div>`;
  document.body.appendChild(f);
}

/* ---------- global events ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-auth]');
  if (a) { closeDrawer(); openAuth(a.dataset.auth); return; }
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    e.preventDefault();
    const [kind, id] = fav.dataset.fav.split(':');
    const on = toggleFav(kind, id);
    fav.classList.toggle('is-on', on);
    fav.setAttribute('aria-pressed', on);
    document.dispatchEvent(new CustomEvent('fav-change'));
    return;
  }
  if (e.target.closest('.menu-btn')) { $('.drawer').classList.add('is-open'); e.target.closest('.menu-btn').setAttribute('aria-expanded', 'true'); return; }
  if (e.target.closest('[data-close-drawer]') || e.target.classList.contains('drawer')) closeDrawer();
});

/* <span data-ic="name"> placeholders in static HTML: keep the element if it has a class */
function hydrateIcons(root = document) {
  $$('[data-ic]', root).forEach((el) => {
    if (el.className) { el.innerHTML = icon(el.dataset.ic); el.removeAttribute('data-ic'); } else el.outerHTML = icon(el.dataset.ic);
  });
}

renderHeader();
renderFooter();
hydrateIcons();

/* ---------- shared Leaflet map ---------- */
function makeMap(el, opts = {}) {
  const map = L.map(el, { zoomControl: true, worldCopyJump: true, minZoom: 2, scrollWheelZoom: opts.scroll ?? false, attributionControl: true })
    .setView(opts.center || [30, 40], opts.zoom || 2);
  map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
  const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  L.tileLayer(esri + 'World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri', maxZoom: 16 }).addTo(map);
  L.tileLayer(esri + 'World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, opacity: .7 }).addTo(map);
  return map;
}
function pinIcon(active) {
  return L.divIcon({ className: '', html: `<div class="pin ${active ? 'is-active' : ''}"><i></i></div>`, iconSize: [22, 22], iconAnchor: [11, 11] });
}
/* great-circle-ish arc between two points for flight paths */
function arc(a, b, n = 40) {
  const pts = [];
  const dx = b[1] - a[1], dy = b[0] - a[0];
  const dist = Math.hypot(dx, dy);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const lift = Math.sin(Math.PI * t) * dist * 0.18;
    pts.push([a[0] + dy * t + lift, a[1] + dx * t]);
  }
  return pts;
}
