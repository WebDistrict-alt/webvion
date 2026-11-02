/* TECHZONE — page renderers. Each page returns { title, html, mount(root) -> cleanup? } */
(function () {
  const { CATEGORIES, PRODUCTS, REVIEWS, FAQ, STORES, img } = window.TZ_DATA;
  const Store = window.TZ_STORE;
  const { icon, money, plural, esc, nf, card, stars, ratingHtml, badgesHtml, toast, catBySlug, dateRu, observeReveal } = window.TZ_UI;

  const navigate = href => { location.hash = href.replace(/^#/, ''); };
  const crumbs = items => `<nav class="crumbs" aria-label="Хлебные крошки"><a href="#/">Главная</a>${items.map(([label, href]) => `${icon('right')}${href ? `<a href="${href}">${esc(label)}</a>` : `<span aria-current="page">${esc(label)}</span>`}`).join('')}</nav>`;
  const countIn = slug => PRODUCTS.filter(p => p.cat === slug).length;
  const top = (list, n) => list.slice(0, n);
  const byPop = (a, b) => b.pop - a.pop;
  const byDate = (a, b) => b.date.localeCompare(a.date);

  /* =====================================================
     Search & filtering
     ===================================================== */
  function matches(p, q) {
    if (!q) return true;
    const cat = catBySlug(p.cat);
    const hay = [p.name, p.brand, p.model, cat && cat.name, p.short.join(' ')].join(' ').toLowerCase().replace(/ё/g, 'е');
    return q.toLowerCase().replace(/ё/g, 'е').split(/\s+/).filter(Boolean).every(t => hay.includes(t));
  }

  const SORTS = [
    ['popular', 'По популярности'],
    ['new', 'По новизне'],
    ['price-asc', 'Сначала дешевле'],
    ['price-desc', 'Сначала дороже'],
    ['rating', 'По рейтингу'],
    ['discount', 'По размеру скидки']
  ];
  function sortList(list, sort) {
    const l = list.slice();
    switch (sort) {
      case 'new': return l.sort(byDate);
      case 'price-asc': return l.sort((a, b) => a.price - b.price);
      case 'price-desc': return l.sort((a, b) => b.price - a.price);
      case 'rating': return l.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case 'discount': return l.sort((a, b) => ((b.oldPrice ? 1 - b.price / b.oldPrice : 0) - (a.oldPrice ? 1 - a.price / a.oldPrice : 0)) || byPop(a, b));
      default: return l.sort(byPop);
    }
  }
  function applyFilters(base, f) {
    return sortList(base.filter(p =>
      matches(p, f.q) &&
      (!f.cats.length || f.cats.includes(p.cat)) &&
      (!f.brands.length || f.brands.includes(p.brand)) &&
      (f.min == null || p.price >= f.min) &&
      (f.max == null || p.price <= f.max) &&
      (!f.only.length || f.only.some(o => (o === 'sale' ? !!p.oldPrice : p.badge === o))) &&
      (!f.stock || p.stock > 0)
    ), f.sort);
  }

  /* =====================================================
     HOME
     ===================================================== */
  function home() {
    const hits = top(PRODUCTS.filter(p => p.badge === 'hit').sort(byPop), 8);
    const fresh = top(PRODUCTS.slice().sort(byDate), 8);
    const deals = top(PRODUCTS.filter(p => p.oldPrice).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)), 4);
    const brands = [...new Set(PRODUCTS.map(p => p.brand))];
    const heroProduct = Store.byId('macbook-pro-14-m5');
    const reviews = REVIEWS.slice(0, 3);

    const catTiles = CATEGORIES.map((c, i) => `
      <a class="cat reveal${i === 0 || i === 7 ? ' cat--wide' : ''}" href="#/category/${c.slug}">
        <img src="${img(c.cover, i === 0 || i === 7 ? 1200 : 700)}" alt="" loading="lazy" data-icon="${c.icon}">
        <span class="cat__count">${countIn(c.slug)} ${plural(countIn(c.slug), 'товар', 'товара', 'товаров')}</span>
        <div><h3>${c.name}</h3><p>${c.desc}</p></div>
        <span class="cat__arrow">${icon('arrow')}</span>
      </a>`).join('');

    const html = `
    <section class="hero">
      <div class="container hero__inner">
        <div>
          <a class="hero__badge fade-up" style="--d:.05s" href="#/product/${heroProduct.id}"><b>NEW</b> MacBook Pro M5 уже в продаже ${icon('right', 'i-sm')}</a>
          <h1 class="hero__title"><span><i>TECHNOLOGY.</i></span><span><i class="grad">REDEFINED.</i></span></h1>
          <p class="hero__sub fade-up" style="--d:.45s">Технологии, которые меняют каждый день. Официальная техника ведущих брендов с доставкой от одного дня.</p>
          <div class="hero__ctas fade-up" style="--d:.6s">
            <a class="btn btn--primary btn--lg" href="#/catalog">Смотреть каталог ${icon('arrow')}</a>
            <a class="btn btn--ghost btn--lg" href="#/new">Наши новинки</a>
          </div>
          <div class="hero__stats fade-up" style="--d:.75s">
            <div><strong>12 лет</strong><span>на рынке техники</span></div>
            <div><strong>1,2 млн</strong><span>довольных клиентов</span></div>
            <div><strong>4.9 / 5</strong><span>средняя оценка</span></div>
          </div>
        </div>
        <div class="hero__visual">
          <div class="hero__glow"></div>
          <a class="hero__img" href="#/product/${heroProduct.id}" aria-label="${esc(heroProduct.name)}">
            <img src="${img('1517336714731-489689fd1ca8', 1400)}" alt="Новый MacBook Pro на рабочем столе" fetchpriority="high" data-icon="laptop">
          </a>
          <a class="hero__card hero__card--b" href="#/product/${heroProduct.id}">
            <span class="ic ic--dark">${icon('laptop')}</span>
            <div><strong>${esc(heroProduct.name)}</strong><span>от ${money(heroProduct.price)}</span></div>
          </a>
          <a class="hero__card hero__card--a" href="#/delivery">
            <span class="ic">${icon('truck')}</span>
            <div><strong>Доставка за 2 часа</strong><span>бесплатно от 50 000 ₽</span></div>
          </a>
        </div>
      </div>
    </section>

    <div class="brands" aria-label="Бренды">
      <div class="brands__track">
        ${[...brands, ...brands].map((b, i) => `<a href="#/catalog?brand=${encodeURIComponent(b)}"${i >= brands.length ? ' aria-hidden="true" tabindex="-1"' : ''}>${esc(b)}</a>`).join('')}
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Категории</span><h2 class="h2">Популярные категории</h2></div>
          <a class="link" href="#/catalog">Весь каталог ${icon('arrow')}</a>
        </div>
        <div class="cats">${catTiles}</div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Бестселлеры</span><h2 class="h2">Хиты продаж</h2><p class="lead">То, что выбирают чаще всего — проверено тысячами покупателей.</p></div>
          <a class="link" href="#/catalog?only=hit">Все хиты ${icon('arrow')}</a>
        </div>
        <div class="grid">${hits.map(card).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Только что поступили</span><h2 class="h2">Новинки техники</h2></div>
          <div class="tabs" role="tablist" aria-label="Категории новинок" id="newTabs">
            <button class="active" role="tab" aria-selected="true" data-cat="">Все</button>
            <button role="tab" aria-selected="false" data-cat="smartphones">Смартфоны</button>
            <button role="tab" aria-selected="false" data-cat="laptops">Ноутбуки</button>
            <button role="tab" aria-selected="false" data-cat="headphones">Аудио</button>
          </div>
        </div>
        <div class="grid" id="newGrid">${fresh.map(card).join('')}</div>
        <div style="text-align:center;margin-top:40px" class="reveal"><a class="btn btn--ghost" href="#/new">Все новинки ${icon('arrow')}</a></div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Акции</span><h2 class="h2">Специальные предложения</h2></div>
          <a class="link" href="#/sale">Все акции ${icon('arrow')}</a>
        </div>
        <div class="promo-grid">
          <a class="promo reveal" href="#/sale">
            <img src="${img('1606144042614-b2417e99c4e3', 1400)}" alt="" loading="lazy" data-icon="gamepad">
            <span class="promo__tag">До −20%</span>
            <h3>Осенняя распродажа</h3>
            <p>Скидки на ноутбуки, консоли и аудио. Предложение действует до конца месяца.</p>
            <div class="countdown" id="countdown" aria-label="До конца акции"></div>
            <span class="btn btn--white">Смотреть акции ${icon('arrow')}</span>
          </a>
          <div class="promo__stack">
            <a class="promo promo--blue reveal" href="#/delivery">
              <img src="${img('1556656793-08538906a9f8', 900)}" alt="" loading="lazy">
              <h3>Trade-in до 40 000 ₽</h3>
              <p>Сдайте старое устройство и получите скидку на новое.</p>
            </a>
            <a class="promo reveal" href="#/cart">
              <img src="${img('1583394838336-acd977736f90', 900)}" alt="" loading="lazy" data-icon="headphones">
              <h3>Промокод TECH10</h3>
              <p>Скидка 10% на первый заказ — введите код в корзине.</p>
            </a>
          </div>
        </div>
        <div class="grid" style="margin-top:20px">${deals.map(card).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Почему TECHZONE</span><h2 class="h2">Преимущества магазина</h2></div>
          <a class="link" href="#/about">О магазине ${icon('arrow')}</a>
        </div>
        ${featuresHtml()}
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <div class="section__head reveal">
          <div><span class="eyebrow">Отзывы</span><h2 class="h2">Нам доверяют</h2></div>
          <a class="link" href="#/reviews">Все отзывы ${icon('arrow')}</a>
        </div>
        <div class="reviews">${reviews.map(reviewHtml).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="band reveal">
          <div><h2 class="h2">Нужна помощь с выбором?</h2><p>Эксперты TECHZONE подберут технику под ваши задачи и бюджет. Бесплатно и без навязчивых продаж.</p></div>
          <div class="band__actions">
            <a class="btn btn--white btn--lg" href="tel:+78005553535">${icon('call')} 8 800 555-35-35</a>
            <a class="btn btn--light-ghost btn--lg" href="#/contacts">Написать нам</a>
          </div>
        </div>
      </div>
    </section>`;

    function mount(root) {
      // New arrivals tabs
      const tabs = root.querySelector('#newTabs');
      const grid = root.querySelector('#newGrid');
      tabs.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        tabs.querySelectorAll('button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-selected', x === b); });
        const cat = b.dataset.cat;
        const list = top(PRODUCTS.filter(p => !cat || p.cat === cat).sort(byDate), 8);
        grid.innerHTML = list.map(card).join('');
        observeReveal(grid);
      });
      // Countdown to end of month
      const cd = root.querySelector('#countdown');
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const tick = () => {
        let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
        const d = Math.floor(s / 86400); s -= d * 86400;
        const h = Math.floor(s / 3600); s -= h * 3600;
        const m = Math.floor(s / 60); s -= m * 60;
        const pad = n => String(n).padStart(2, '0');
        cd.innerHTML = [[d, 'дн'], [h, 'час'], [m, 'мин'], [s, 'сек']].map(([v, l]) => `<div><b>${pad(v)}</b><small>${l}</small></div>`).join('');
      };
      tick();
      const t = setInterval(tick, 1000);
      return () => clearInterval(t);
    }

    return { title: 'TECHZONE — магазин электроники и техники', html, mount };
  }

  function featuresHtml() {
    const items = [
      ['shield', 'Официальная гарантия', 'Только сертифицированная техника с гарантией производителя от 12 месяцев.'],
      ['truck', 'Быстрая доставка', 'За 2 часа по Москве и Петербургу, от 1 дня — по всей России.'],
      ['card', 'Рассрочка 0%', 'До 12 месяцев без переплат. Решение банка за 2 минуты.'],
      ['refresh', 'Trade-in', 'Обменяйте старое устройство на скидку до 40 000 ₽.'],
      ['support', 'Эксперты 24/7', 'Консультации по подбору и настройке техники в любое время.'],
      ['box', 'Возврат 14 дней', 'Не подошло — вернём деньги без лишних вопросов.'],
      ['store', '30 магазинов', 'Самовывоз бесплатно в день заказа в крупнейших городах.'],
      ['gift', 'Бонусная программа', 'До 5% баллами с каждой покупки на следующие заказы.']
    ];
    return `<div class="features">${items.map(([ic, h, p]) => `<div class="feature reveal"><div class="feature__ic">${icon(ic)}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`;
  }

  function reviewHtml(r) {
    const initials = r.name.split(' ').map(w => w[0]).slice(0, 2).join('');
    return `<article class="review reveal">
      <span class="stars" aria-label="Оценка ${r.rating} из 5">${stars(r.rating).replace(/^<span class="stars" aria-hidden="true">|<\/span>$/g, '')}</span>
      <p>${esc(r.text)}</p>
      ${r.product ? `<span class="review__product">${esc(r.product)}</span>` : ''}
      <div class="review__author"><span class="avatar" aria-hidden="true">${esc(initials)}</span><div><strong>${esc(r.name)}</strong><span>${esc(r.city || 'Покупатель')}${r.date ? ' · ' + dateRu(r.date) : ''}</span></div></div>
    </article>`;
  }

  /* =====================================================
     CATALOG (all / category / new / sale)
     ===================================================== */
  function catalog(query, preset = {}) {
    const cat = preset.cat ? catBySlug(preset.cat) : null;
    const base = PRODUCTS.filter(p => (!cat || p.cat === cat.slug) && (!preset.only || (preset.only === 'sale' ? p.oldPrice : p.badge === preset.only)));
    const prices = base.map(p => p.price);
    const PMIN = Math.floor(Math.min(...prices) / 1000) * 1000;
    const PMAX = Math.ceil(Math.max(...prices) / 1000) * 1000;
    const brands = [...new Set(base.map(p => p.brand))].sort();
    const list = s => (s ? s.split(',').filter(Boolean) : []);
    const num = v => (v === undefined || v === '' || isNaN(+v) ? null : +v);

    const f = {
      q: query.q || '',
      cats: cat ? [] : list(query.cat),
      brands: list(query.brand),
      min: num(query.min),
      max: num(query.max),
      only: preset.only ? [] : list(query.only),
      stock: query.stock === '1',
      sort: query.sort || (preset.only === 'new' ? 'new' : preset.only === 'sale' ? 'discount' : 'popular')
    };

    let title, sub, headImg, path;
    if (cat) { title = cat.name; sub = `${cat.desc}. ${countIn(cat.slug)} ${plural(countIn(cat.slug), 'модель', 'модели', 'моделей')} в наличии с официальной гарантией.`; headImg = cat.cover; path = `/category/${cat.slug}`; }
    else if (preset.only === 'new') { title = 'Новинки'; sub = 'Самые свежие поступления: устройства, которые только вышли на рынок.'; headImg = '1592899677977-9c10ca588bbd'; path = '/new'; }
    else if (preset.only === 'sale') { title = 'Акции и скидки'; sub = 'Лучшие цены сезона. Скидки до 20% на популярную технику — пока товар в наличии.'; headImg = '1606144042614-b2417e99c4e3'; path = '/sale'; }
    else { title = f.q ? `Поиск: «${f.q}»` : 'Каталог'; sub = 'Вся техника TECHZONE: фильтруйте по категории, бренду и цене.'; path = '/catalog'; }

    const head = headImg
      ? `<header class="page-head page-head--hero"><img src="${img(headImg, 1600)}" alt=""><div class="container">${crumbs(cat ? [['Каталог', '#/catalog'], [cat.name]] : [[title]])}<h1>${esc(title)}</h1><p>${esc(sub)}</p></div></header>`
      : `<header class="page-head"><div class="container">${crumbs([['Каталог']])}<h1>${esc(title)}</h1><p>${esc(sub)}</p></div></header>`;

    const checkbox = (name, value, label, checked, count) => `<label class="check"><input type="checkbox" name="${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span class="check__box"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>${esc(label)}${count != null ? `<small>${count}</small>` : ''}</label>`;

    const html = `${head}
    <div class="container">
      <div class="catalog">
        <div class="filters-backdrop" id="fBackdrop"></div>
        <aside class="filters" id="filters" aria-label="Фильтры">
          <div class="filters__head"><h2>Фильтры</h2><button class="icon-btn" id="fClose" aria-label="Закрыть фильтры">${icon('x')}</button></div>
          <form id="filterForm" onsubmit="return false">
            <div class="fgroup">
              <h3>Поиск</h3>
              <div class="fsearch">${icon('search')}<label class="sr-only" for="fQ">Поиск по названию</label><input class="input" id="fQ" name="q" type="search" placeholder="Название или модель" value="${esc(f.q)}"></div>
            </div>
            ${cat ? '' : `<div class="fgroup"><h3>Категория</h3>${CATEGORIES.map(c => checkbox('cat', c.slug, c.name, f.cats.includes(c.slug), base.filter(p => p.cat === c.slug).length)).join('')}</div>`}
            <div class="fgroup">
              <h3>Цена, ₽</h3>
              <div class="price-inputs">
                <div><label for="fMin">от</label><input class="input" id="fMin" name="min" type="number" inputmode="numeric" min="${PMIN}" max="${PMAX}" step="1000" placeholder="${nf.format(PMIN)}" value="${f.min ?? ''}"></div>
                <div><label for="fMax">до</label><input class="input" id="fMax" name="max" type="number" inputmode="numeric" min="${PMIN}" max="${PMAX}" step="1000" placeholder="${nf.format(PMAX)}" value="${f.max ?? ''}"></div>
              </div>
              <div class="range"><div class="range__track"></div><div class="range__fill" id="rFill"></div>
                <input type="range" id="rMin" min="${PMIN}" max="${PMAX}" step="1000" value="${f.min ?? PMIN}" aria-label="Минимальная цена">
                <input type="range" id="rMax" min="${PMIN}" max="${PMAX}" step="1000" value="${f.max ?? PMAX}" aria-label="Максимальная цена">
              </div>
            </div>
            <div class="fgroup"><h3>Бренд</h3>${brands.map(b => checkbox('brand', b, b, f.brands.includes(b), base.filter(p => p.brand === b).length)).join('')}</div>
            ${preset.only ? '' : `<div class="fgroup"><h3>Предложения</h3>${checkbox('only', 'new', 'Новинки', f.only.includes('new'))}${checkbox('only', 'hit', 'Хиты продаж', f.only.includes('hit'))}${checkbox('only', 'sale', 'Со скидкой', f.only.includes('sale'))}</div>`}
            <div class="fgroup">${checkbox('stock', '1', 'Только в наличии', f.stock)}</div>
            <div class="fgroup" style="border:0"><button type="button" class="btn btn--ghost btn--block" id="fReset">Сбросить фильтры</button></div>
          </form>
          <button class="btn btn--primary filters__apply" id="fApply">Показать</button>
        </aside>

        <div>
          ${cat ? `<div class="cat-chips">${CATEGORIES.map(c => `<a class="chip${c.slug === cat.slug ? ' active' : ''}" href="#/category/${c.slug}">${icon(c.icon)}${c.name}</a>`).join('')}</div>` : ''}
          <div class="toolbar">
            <p class="toolbar__count" id="count" aria-live="polite"></p>
            <div class="toolbar__right">
              <button class="btn btn--ghost btn--sm filters-toggle" id="fOpen">${icon('filter')} Фильтры</button>
              <label class="sr-only" for="sort">Сортировка</label>
              <select class="select select--sm" id="sort">${SORTS.map(([v, l]) => `<option value="${v}"${v === f.sort ? ' selected' : ''}>${l}</option>`).join('')}</select>
            </div>
          </div>
          <div class="active-filters" id="activeFilters"></div>
          <div class="grid grid--3" id="results"></div>
        </div>
      </div>
    </div>`;

    function mount(root) {
      const form = root.querySelector('#filterForm');
      const results = root.querySelector('#results');
      const count = root.querySelector('#count');
      const active = root.querySelector('#activeFilters');
      const panel = root.querySelector('#filters');
      const backdrop = root.querySelector('#fBackdrop');
      const rMin = root.querySelector('#rMin'), rMax = root.querySelector('#rMax');
      const fMin = root.querySelector('#fMin'), fMax = root.querySelector('#fMax');
      const rFill = root.querySelector('#rFill');

      function paintRange() {
        const lo = +rMin.value, hi = +rMax.value;
        const pct = v => ((v - PMIN) / (PMAX - PMIN || 1)) * 100;
        rFill.style.left = pct(lo) + '%';
        rFill.style.width = pct(hi) - pct(lo) + '%';
      }

      function read() {
        const fd = new FormData(form);
        f.q = (fd.get('q') || '').trim();
        if (!cat) f.cats = fd.getAll('cat');
        f.brands = fd.getAll('brand');
        f.min = num(fd.get('min'));
        f.max = num(fd.get('max'));
        if (f.min != null && f.max != null && f.min > f.max) [f.min, f.max] = [f.max, f.min];
        if (!preset.only) f.only = fd.getAll('only');
        f.stock = fd.get('stock') === '1';
        f.sort = root.querySelector('#sort').value;
      }

      function syncUrl() {
        const params = new URLSearchParams();
        if (f.q) params.set('q', f.q);
        if (f.cats.length) params.set('cat', f.cats.join(','));
        if (f.brands.length) params.set('brand', f.brands.join(','));
        if (f.min != null) params.set('min', f.min);
        if (f.max != null) params.set('max', f.max);
        if (f.only.length) params.set('only', f.only.join(','));
        if (f.stock) params.set('stock', '1');
        if (f.sort && f.sort !== 'popular') params.set('sort', f.sort);
        const qs = params.toString();
        history.replaceState(null, '', '#' + path + (qs ? '?' + qs : ''));
      }

      function renderActive() {
        const chips = [];
        if (f.q) chips.push(['q', '', `«${f.q}»`]);
        f.cats.forEach(c => chips.push(['cat', c, catBySlug(c).name]));
        f.brands.forEach(b => chips.push(['brand', b, b]));
        if (f.min != null || f.max != null) chips.push(['price', '', `${f.min != null ? 'от ' + money(f.min) : ''} ${f.max != null ? 'до ' + money(f.max) : ''}`.trim()]);
        const labels = { new: 'Новинки', hit: 'Хиты', sale: 'Со скидкой' };
        f.only.forEach(o => chips.push(['only', o, labels[o]]));
        if (f.stock) chips.push(['stock', '1', 'В наличии']);
        active.innerHTML = chips.map(([k, v, l]) => `<button class="chip active" data-rm="${k}" data-v="${esc(v)}" aria-label="Убрать фильтр ${esc(l)}">${esc(l)} ${icon('x')}</button>`).join('');
      }

      function render() {
        const out = applyFilters(base, f);
        count.innerHTML = `Найдено <b>${out.length}</b> ${plural(out.length, 'товар', 'товара', 'товаров')}`;
        root.querySelector('#fApply').textContent = `Показать ${out.length} ${plural(out.length, 'товар', 'товара', 'товаров')}`;
        results.innerHTML = out.length ? out.map(card).join('') : `<div class="empty" style="grid-column:1/-1"><div class="empty__ic">${icon('search', 'i-lg')}</div><h2>Ничего не найдено</h2><p>Попробуйте изменить параметры поиска или сбросить фильтры.</p><button class="btn btn--primary" data-reset>Сбросить фильтры</button></div>`;
        renderActive();
        observeReveal(results);
      }

      function update() { read(); syncUrl(); render(); }

      let deb;
      form.addEventListener('input', e => {
        if (e.target === fMin || e.target === fMax) {
          rMin.value = fMin.value || PMIN;
          rMax.value = fMax.value || PMAX;
          paintRange();
        }
        clearTimeout(deb);
        deb = setTimeout(update, e.target.type === 'search' || e.target.type === 'number' ? 250 : 0);
      });
      form.addEventListener('change', e => { if (e.target.type === 'checkbox') { clearTimeout(deb); update(); } });
      [rMin, rMax].forEach(r => r.addEventListener('input', () => {
        if (+rMin.value > +rMax.value - 1000) { if (r === rMin) rMin.value = +rMax.value - 1000; else rMax.value = +rMin.value + 1000; }
        fMin.value = +rMin.value === PMIN ? '' : rMin.value;
        fMax.value = +rMax.value === PMAX ? '' : rMax.value;
        paintRange();
        clearTimeout(deb);
        deb = setTimeout(update, 120);
      }));
      root.querySelector('#sort').addEventListener('change', update);

      const reset = () => {
        form.reset();
        form.querySelectorAll('input[type=checkbox]').forEach(i => { i.checked = false; });
        form.querySelectorAll('input[type=search], input[type=number]').forEach(i => { i.value = ''; });
        rMin.value = PMIN; rMax.value = PMAX; paintRange();
        update();
      };
      root.querySelector('#fReset').addEventListener('click', reset);
      results.addEventListener('click', e => { if (e.target.closest('[data-reset]')) reset(); });

      active.addEventListener('click', e => {
        const b = e.target.closest('[data-rm]');
        if (!b) return;
        const k = b.dataset.rm, v = b.dataset.v;
        if (k === 'q') form.q.value = '';
        else if (k === 'price') { fMin.value = ''; fMax.value = ''; rMin.value = PMIN; rMax.value = PMAX; paintRange(); }
        else form.querySelectorAll(`input[name="${k}"]`).forEach(i => { if (i.value === v) i.checked = false; });
        update();
      });

      const openPanel = on => {
        panel.classList.toggle('open', on);
        backdrop.classList.toggle('open', on);
        document.body.classList.toggle('no-scroll', on);
      };
      root.querySelector('#fOpen').addEventListener('click', () => openPanel(true));
      root.querySelector('#fClose').addEventListener('click', () => openPanel(false));
      root.querySelector('#fApply').addEventListener('click', () => { openPanel(false); window.scrollTo({ top: root.querySelector('.toolbar').getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' }); });
      backdrop.addEventListener('click', () => openPanel(false));

      paintRange();
      render();
      return () => document.body.classList.remove('no-scroll');
    }

    return { title: `${title} — TECHZONE`, html, mount, nav: cat ? 'catalog' : preset.only === 'new' ? 'new' : preset.only === 'sale' ? 'sale' : 'catalog' };
  }

  /* =====================================================
     PRODUCT
     ===================================================== */
  function product(id) {
    const p = Store.byId(id);
    if (!p) return notFound();
    const cat = catBySlug(p.cat);
    const similar = top(PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).sort(byPop), 4);
    const st = { color: p.colors[0].name, config: p.configs[0].name, qty: 1, idx: 0 };
    const fav = Store.isFav(p.id);
    const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

    let stockCls = '', stockText;
    if (p.stock <= 0) { stockCls = 'stock--out'; stockText = '<strong>Нет в наличии</strong> <span>— сообщим о поступлении</span>'; }
    else if (p.stock <= 5) { stockCls = 'stock--low'; stockText = `<strong>Осталось мало: ${p.stock} шт.</strong> <span>· доставка ${tomorrow}</span>`; }
    else stockText = `<strong>В наличии</strong> <span>· ${p.stock} шт. на складе · доставка ${tomorrow}</span>`;

    const specRows = Object.entries(p.specs).map(([group, rows]) => `<tr><th colspan="2" class="specs-group">${esc(group)}</th></tr>` + Object.entries(rows).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')).join('');

    const html = `
    <div class="container">
      <div style="padding-top:24px">${crumbs([['Каталог', '#/catalog'], [cat.name, `#/category/${cat.slug}`], [p.name]])}</div>
      <div class="pdp" data-id="${p.id}">
        <div class="gallery">
          <div class="gallery__thumbs" role="tablist" aria-label="Фотографии товара">
            ${p.images.map((src, i) => `<button class="${i === 0 ? 'active' : ''}" data-idx="${i}" role="tab" aria-selected="${i === 0}" aria-label="Фото ${i + 1}"><img src="${src.replace('w=900', 'w=200')}" alt="" loading="lazy"></button>`).join('')}
          </div>
          <div class="gallery__main" id="gMain">
            ${badgesHtml(p)}
            <img id="gImg" src="${p.images[0].replace('w=900', 'w=1400')}" alt="${esc(p.name)}">
            <span class="gallery__hint">${icon('zoom')} Наведите для увеличения</span>
            <div class="gallery__nav">
              <button id="gPrev" aria-label="Предыдущее фото">${icon('left')}</button>
              <button id="gNext" aria-label="Следующее фото">${icon('right')}</button>
            </div>
          </div>
        </div>

        <div class="pdp__info">
          <a class="pdp__brand" href="#/catalog?brand=${encodeURIComponent(p.brand)}">${esc(p.brand)}</a>
          <h1>${esc(p.name)}</h1>
          <div class="pdp__meta">${ratingHtml(p)}<span>Модель: ${esc(p.model)}</span><span>Код: ${String(1000 + p.order * 37).padStart(6, '0')}</span></div>
          <div class="pdp__price" id="pdpPrice"></div>
          <p class="pdp__credit" id="pdpCredit"></p>

          ${p.colors.length ? `<div class="opt-group"><h3>Цвет: <span id="colorName">${esc(st.color)}</span></h3><div class="swatches" role="radiogroup" aria-label="Цвет">${p.colors.map((c, i) => `<button class="swatch${i === 0 ? ' active' : ''}" role="radio" aria-checked="${i === 0}" data-color="${esc(c.name)}" aria-label="${esc(c.name)}" title="${esc(c.name)}"><span style="background:${c.hex}"></span></button>`).join('')}</div></div>` : ''}

          ${p.configs.length > 1 ? `<div class="opt-group"><h3>Комплектация</h3><div class="configs" role="radiogroup" aria-label="Комплектация">${p.configs.map((c, i) => `<button class="config${i === 0 ? ' active' : ''}" role="radio" aria-checked="${i === 0}" data-config="${esc(c.name)}"><strong>${esc(c.name)}</strong><span>${money(p.price + c.delta)}</span></button>`).join('')}</div></div>` : ''}

          <div class="stock ${stockCls}"><span class="stock__dot"></span><div>${stockText}</div></div>

          <div class="buy-row">
            <div class="qty" aria-label="Количество">
              <button id="qMinus" aria-label="Уменьшить количество">${icon('minus')}</button>
              <output id="qVal" aria-live="polite">1</output>
              <button id="qPlus" aria-label="Увеличить количество">${icon('plus')}</button>
            </div>
            <button class="btn btn--primary btn--lg" id="addBtn"${p.stock <= 0 ? ' disabled' : ''}>${icon('cart')} Добавить в корзину</button>
            <button class="fav-lg${fav ? ' active' : ''}" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Убрать из избранного' : 'Добавить в избранное'}">${icon('heart')}</button>
          </div>

          <div class="perks">
            <div class="perk">${icon('truck')}<div><strong>Доставка ${tomorrow}</strong><span>${p.price >= Store.FREE_SHIP_FROM ? 'бесплатно' : 'от 490 ₽'}</span></div></div>
            <div class="perk">${icon('store')}<div><strong>Самовывоз сегодня</strong><span>в 3 магазинах, бесплатно</span></div></div>
            <div class="perk">${icon('shield')}<div><strong>Гарантия 1 год</strong><span>официальная от производителя</span></div></div>
            <div class="perk">${icon('refresh')}<div><strong>Возврат 14 дней</strong><span>без объяснения причин</span></div></div>
          </div>
        </div>
      </div>

      <section style="padding-bottom:80px">
        <div class="pdp-tabs" role="tablist">
          <button class="active" role="tab" aria-selected="true" data-tab="desc">Описание</button>
          <button role="tab" aria-selected="false" data-tab="specs">Характеристики</button>
          <button role="tab" aria-selected="false" data-tab="reviews">Отзывы (${nf.format(p.reviews)})</button>
        </div>
        <div id="tabDesc" class="tab-panel desc" role="tabpanel">
          <div><h2 style="font-size:28px;margin-bottom:18px">О товаре</h2><p>${esc(p.desc)}</p><p>В комплекте: устройство, документация${p.cat === 'smartphones' || p.cat === 'tablets' ? ', кабель USB-C' : ''}. Товар сертифицирован для продажи в России.</p></div>
          <div><h2 style="font-size:20px;margin-bottom:18px">Ключевые особенности</h2><ul>${p.features.map(x => `<li>${icon('check')}<span>${esc(x)}</span></li>`).join('')}</ul></div>
        </div>
        <div id="tabSpecs" class="tab-panel" role="tabpanel" hidden><table class="specs"><tbody>${specRows}<tr><th colspan="2" class="specs-group">Гарантия</th></tr><tr><th scope="row">Гарантия производителя</th><td>12 месяцев</td></tr><tr><th scope="row">Бренд</th><td>${esc(p.brand)}</td></tr></tbody></table></div>
        <div id="tabReviews" class="tab-panel" role="tabpanel" hidden>
          <div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-bottom:28px"><strong style="font-size:56px;letter-spacing:-.04em;line-height:1">${p.rating.toFixed(1)}</strong><div>${stars(p.rating)}<p style="color:var(--muted);margin-top:6px">на основе ${nf.format(p.reviews)} ${plural(p.reviews, 'отзыва', 'отзывов', 'отзывов')}</p></div></div>
          <div class="reviews">${REVIEWS.slice(0, 3).map(r => reviewHtml(Object.assign({}, r, { product: p.name }))).join('')}</div>
        </div>
      </section>

      ${similar.length ? `<section style="padding-bottom:96px"><div class="section__head"><div><span class="eyebrow">${esc(cat.name)}</span><h2 class="h2">Похожие товары</h2></div><a class="link" href="#/category/${cat.slug}">Все ${esc(cat.name.toLowerCase())} ${icon('arrow')}</a></div><div class="grid">${similar.map(card).join('')}</div></section>` : ''}
    </div>`;

    function mount(root) {
      const priceBox = root.querySelector('#pdpPrice');
      const credit = root.querySelector('#pdpCredit');
      const gMain = root.querySelector('#gMain');
      const gImg = root.querySelector('#gImg');
      const thumbs = [...root.querySelectorAll('.gallery__thumbs button')];

      function paintPrice() {
        const cfg = p.configs.find(c => c.name === st.config) || p.configs[0];
        const now = (p.price + cfg.delta) * st.qty;
        const old = p.oldPrice ? (p.oldPrice + cfg.delta) * st.qty : null;
        priceBox.innerHTML = `<span class="price__now${old ? ' is-sale' : ''}">${money(now)}</span>${old ? `<span class="price__old">${money(old)}</span><span class="save-tag">Экономия ${money(old - now)}</span>` : ''}`;
        credit.textContent = `или от ${money(Math.ceil(now / 12))} / мес. в рассрочку 0% на 12 месяцев`;
        root.querySelector('#qVal').textContent = st.qty;
        root.querySelector('#qMinus').disabled = st.qty <= 1;
        root.querySelector('#qPlus').disabled = st.qty >= Math.min(10, Math.max(1, p.stock));
      }

      function show(i) {
        st.idx = (i + p.images.length) % p.images.length;
        thumbs.forEach((t, k) => { t.classList.toggle('active', k === st.idx); t.setAttribute('aria-selected', k === st.idx); });
        gImg.classList.add('swap');
        setTimeout(() => { gImg.src = p.images[st.idx].replace('w=900', 'w=1400'); gImg.classList.remove('swap'); }, 160);
      }
      thumbs.forEach(t => t.addEventListener('click', () => show(+t.dataset.idx)));
      root.querySelector('#gPrev').addEventListener('click', e => { e.stopPropagation(); show(st.idx - 1); });
      root.querySelector('#gNext').addEventListener('click', e => { e.stopPropagation(); show(st.idx + 1); });

      // Hover zoom (mouse) / tap zoom (touch)
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const setOrigin = e => {
        const r = gMain.getBoundingClientRect();
        gImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      };
      if (fine) {
        gMain.addEventListener('mouseenter', e => { setOrigin(e); gMain.classList.add('zoom'); });
        gMain.addEventListener('mousemove', setOrigin);
        gMain.addEventListener('mouseleave', () => gMain.classList.remove('zoom'));
      } else {
        root.querySelector('.gallery__hint').lastChild.textContent = ' Нажмите для увеличения';
        gMain.addEventListener('click', e => { if (e.target.closest('.gallery__nav')) return; setOrigin(e); gMain.classList.toggle('zoom'); });
      }

      root.querySelectorAll('.swatch').forEach(b => b.addEventListener('click', () => {
        st.color = b.dataset.color;
        root.querySelectorAll('.swatch').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-checked', x === b); });
        root.querySelector('#colorName').textContent = st.color;
      }));
      root.querySelectorAll('.config').forEach(b => b.addEventListener('click', () => {
        st.config = b.dataset.config;
        root.querySelectorAll('.config').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-checked', x === b); });
        paintPrice();
      }));
      root.querySelector('#qMinus').addEventListener('click', () => { st.qty = Math.max(1, st.qty - 1); paintPrice(); });
      root.querySelector('#qPlus').addEventListener('click', () => { st.qty = Math.min(10, p.stock, st.qty + 1); paintPrice(); });
      root.querySelector('#addBtn').addEventListener('click', () => {
        window.TZ_APP.addToCart(p.id, { color: st.color, config: st.config, qty: st.qty }, gImg);
      });

      const tabs = root.querySelectorAll('.pdp-tabs button');
      const panels = { desc: root.querySelector('#tabDesc'), specs: root.querySelector('#tabSpecs'), reviews: root.querySelector('#tabReviews') };
      tabs.forEach(t => t.addEventListener('click', () => {
        tabs.forEach(x => { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', x === t); });
        Object.entries(panels).forEach(([k, el]) => { el.hidden = k !== t.dataset.tab; });
        observeReveal(root);
      }));

      paintPrice();
    }

    return { title: `${p.name} — купить в TECHZONE`, html, mount, nav: 'catalog' };
  }

  /* =====================================================
     CART
     ===================================================== */
  function cart() {
    const html = `<header class="page-head"><div class="container">${crumbs([['Корзина']])}<h1>Корзина</h1></div></header><div class="container" id="cartRoot"></div>`;

    function mount(root) {
      const box = root.querySelector('#cartRoot');
      const draw = () => {
        const lines = Store.cartLines();
        if (!lines.length) {
          box.innerHTML = `<div style="padding:48px 0 96px"><div class="empty"><div class="empty__ic">${icon('cart', 'i-lg')}</div><h2>Корзина пуста</h2><p>Загляните в каталог — там много интересного. Или посмотрите, что вы добавили в избранное.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn--primary" href="#/catalog">Перейти в каталог</a><a class="btn btn--ghost" href="#/favorites">Избранное</a></div></div></div>`;
          return;
        }
        const t = Store.totals();
        const left = Math.max(0, Store.FREE_SHIP_FROM - t.subtotal);
        box.innerHTML = `<div class="cart">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:12px;flex-wrap:wrap">
              <p style="color:var(--muted)">${t.count} ${plural(t.count, 'товар', 'товара', 'товаров')} на сумму ${money(t.subtotal)}</p>
              <button class="text-btn text-btn--danger" id="clearCart">${icon('trash')} Очистить корзину</button>
            </div>
            <div class="cart__list">${lines.map(l => `
              <div class="line" data-key="${esc(l.key)}" data-id="${l.id}">
                <a class="line__img" href="#/product/${l.id}"><img src="${l.product.thumb}" alt="${esc(l.product.name)}" loading="lazy"></a>
                <div>
                  <a class="line__title" href="#/product/${l.id}">${esc(l.product.name)}</a>
                  <p class="line__opts">${esc(l.color)}${l.product.configs.length > 1 ? ' · ' + esc(l.config) : ''}</p>
                  <div class="line__actions">
                    <div class="qty qty--sm" aria-label="Количество">
                      <button data-q="-1" aria-label="Уменьшить"${l.qty <= 1 ? ' disabled' : ''}>${icon('minus', 'i-sm')}</button>
                      <output>${l.qty}</output>
                      <button data-q="1" aria-label="Увеличить"${l.qty >= 10 ? ' disabled' : ''}>${icon('plus', 'i-sm')}</button>
                    </div>
                    <button class="text-btn" data-favline="${l.id}">${icon('heart')} ${Store.isFav(l.id) ? 'В избранном' : 'В избранное'}</button>
                    <button class="text-btn text-btn--danger" data-remove>${icon('trash')} Удалить</button>
                  </div>
                </div>
                <div class="line__right">
                  <span class="price__now${l.oldUnit ? ' is-sale' : ''}">${money(l.total)}</span>
                  ${l.oldUnit ? `<span class="price__old">${money(l.oldUnit * l.qty)}</span>` : ''}
                  ${l.qty > 1 ? `<span class="line__unit">${money(l.unit)} × ${l.qty}</span>` : ''}
                </div>
              </div>`).join('')}
            </div>
          </div>
          <aside class="summary">
            <h2>Ваш заказ</h2>
            <div class="free-ship">${left > 0 ? `До бесплатной доставки: <b>${money(left)}</b>` : `${icon('check', 'i-sm')} <b>Бесплатная доставка</b> активирована`}<div class="free-ship__bar"><i style="width:${Math.min(100, (t.subtotal / Store.FREE_SHIP_FROM) * 100)}%"></i></div></div>
            <div class="summary__row"><span>Товары (${t.count})</span><span>${money(t.subtotal + t.saved)}</span></div>
            ${t.saved ? `<div class="summary__row summary__row--discount"><span>Скидка на товары</span><span>−${money(t.saved)}</span></div>` : ''}
            ${t.discount ? `<div class="summary__row summary__row--discount"><span>Промокод ${esc(Store.state.promo)}</span><span>−${money(t.discount)}</span></div>` : ''}
            <div class="summary__row"><span>Доставка</span><span>${left > 0 ? 'рассчитывается при оформлении' : 'бесплатно'}</span></div>
            <form class="promo-code" id="promoForm">
              <label class="sr-only" for="promoInput">Промокод</label>
              <input class="input" id="promoInput" placeholder="Промокод" value="${esc(Store.state.promo || '')}" autocomplete="off">
              ${Store.state.promo ? `<button type="button" class="btn btn--ghost btn--sm" id="promoRemove">Убрать</button>` : `<button class="btn btn--sm">Применить</button>`}
            </form>
            <p class="promo-hint${t.promo ? ' ok' : ''}" id="promoHint">${t.promo ? `${t.promo.label} применена` : 'Попробуйте TECH10 или WELCOME'}</p>
            <div class="summary__total"><span>Итого</span><strong>${money(t.total)}</strong></div>
            <a class="btn btn--primary btn--lg btn--block" href="#/checkout">Оформить заказ ${icon('arrow')}</a>
            <p class="summary__note">или ${money(Math.ceil(t.total / 12))} / мес. в рассрочку 0%</p>
          </aside>
        </div>`;
        observeReveal(box);
      };

      box.addEventListener('click', e => {
        const line = e.target.closest('.line');
        const q = e.target.closest('[data-q]');
        if (q && line) {
          const l = Store.state.cart.find(x => x.key === line.dataset.key);
          if (l) Store.setQty(l.key, l.qty + +q.dataset.q);
          return;
        }
        if (e.target.closest('[data-remove]') && line) {
          line.classList.add('removing');
          const p = Store.byId(line.dataset.id);
          setTimeout(() => { Store.removeLine(line.dataset.key); toast({ title: 'Товар удалён', text: p.name, iconName: 'trash', tone: 'red' }); }, 300);
          return;
        }
        const fl = e.target.closest('[data-favline]');
        if (fl) { const on = Store.toggleFav(fl.dataset.favline); toast({ title: on ? 'Добавлено в избранное' : 'Удалено из избранного', iconName: 'heart' }); return; }
        if (e.target.closest('#clearCart')) {
          if (confirm('Удалить все товары из корзины?')) { Store.clearCart(); toast({ title: 'Корзина очищена', iconName: 'trash', tone: 'red' }); }
          return;
        }
        if (e.target.closest('#promoRemove')) Store.removePromo();
      });
      box.addEventListener('submit', e => {
        if (e.target.id !== 'promoForm') return;
        e.preventDefault();
        const code = box.querySelector('#promoInput').value;
        const res = Store.applyPromo(code);
        if (res) toast({ title: 'Промокод применён', text: res.label, iconName: 'tag' });
        else { const h = box.querySelector('#promoHint'); h.textContent = 'Промокод не найден или истёк'; h.className = 'promo-hint bad'; }
      });

      draw();
      return Store.subscribe(draw);
    }
    return { title: 'Корзина — TECHZONE', html, mount };
  }

  /* =====================================================
     CHECKOUT
     ===================================================== */
  const DELIVERY = [
    { id: 'courier', name: 'Курьером', note: 'Завтра, с 9:00 до 22:00', price: t => (t >= Store.FREE_SHIP_FROM ? 0 : 490) },
    { id: 'express', name: 'Экспресс за 2 часа', note: 'Москва и Санкт-Петербург', price: () => 990 },
    { id: 'pickup', name: 'Самовывоз из магазина', note: 'Сегодня, через 1 час после подтверждения', price: () => 0 },
    { id: 'post', name: 'Почта России / СДЭК', note: 'От 2 до 7 рабочих дней', price: t => (t >= Store.FREE_SHIP_FROM ? 0 : 390) }
  ];
  const PAYMENT = [
    { id: 'card', name: 'Картой при получении', note: 'Курьеру или в магазине' },
    { id: 'sbp', name: 'СБП', note: 'Ссылка на оплату придёт после подтверждения' },
    { id: 'cash', name: 'Наличными', note: 'При получении заказа' },
    { id: 'credit', name: 'Рассрочка 0%', note: 'На 6 или 12 месяцев, оформление онлайн' }
  ];

  function checkout() {
    if (!Store.cartLines().length) return { redirect: '/cart' };
    const pr = Store.state.profile;
    const opt = (name, o, checked, priceText) => `<label class="option"><input type="radio" name="${name}" value="${o.id}"${checked ? ' checked' : ''}><span class="option__radio"></span><span class="option__body"><strong>${o.name}</strong><span>${o.note}</span></span>${priceText != null ? `<span class="option__price" data-dprice="${o.id}">${priceText}</span>` : ''}</label>`;
    const field = (id, label, attrs = '', value = '', err = '', full = false) => `<div class="field${full ? ' full' : ''}"><label for="${id}">${label}</label><input class="input" id="${id}" name="${id}" ${attrs} value="${esc(value)}"><span class="err">${err}</span></div>`;

    const html = `<header class="page-head"><div class="container">${crumbs([['Корзина', '#/cart'], ['Оформление заказа']])}<h1>Оформление заказа</h1></div></header>
    <div class="container">
      <form class="checkout" id="coForm" novalidate>
        <div>
          <section class="panel">
            <h2><span class="step-n">1</span>Контактные данные</h2>
            <div class="form-grid">
              ${field('name', 'Имя и фамилия', 'autocomplete="name" required', pr.name, 'Укажите имя', true)}
              ${field('phone', 'Телефон', 'type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" required', pr.phone, 'Введите номер телефона полностью')}
              ${field('email', 'Email', 'type="email" autocomplete="email" placeholder="name@mail.ru" required', pr.email, 'Введите корректный email')}
            </div>
          </section>
          <section class="panel">
            <h2><span class="step-n">2</span>Способ доставки</h2>
            <div class="options" id="dOpts">${DELIVERY.map((d, i) => opt('delivery', d, i === 0, '')).join('')}</div>
            <div class="addr" id="addrBox">
              <div class="form-grid">
                ${field('city', 'Город', 'autocomplete="address-level2" required', pr.city, 'Укажите город')}
                ${field('street', 'Улица, дом', 'autocomplete="address-line1" required', pr.address, 'Укажите адрес доставки')}
                ${field('apt', 'Квартира / офис', 'autocomplete="address-line2"')}
                ${field('date', 'Желаемая дата', `type="date" min="${new Date(Date.now() + 86400000).toISOString().slice(0, 10)}"`)}
              </div>
            </div>
            <div class="addr" id="pickupBox" hidden>
              <div class="field"><label for="store">Магазин</label><select class="select" id="store" name="store">${STORES.map(s => `<option>${esc(s.name)} — ${esc(s.addr)}</option>`).join('')}</select></div>
            </div>
          </section>
          <section class="panel">
            <h2><span class="step-n">3</span>Способ оплаты</h2>
            <div class="options">${PAYMENT.map((p, i) => opt('payment', p, i === 0)).join('')}</div>
            <div class="field" style="margin-top:20px"><label for="comment">Комментарий к заказу</label><textarea class="textarea" id="comment" name="comment" placeholder="Например: позвонить за час до доставки"></textarea></div>
          </section>
        </div>
        <aside class="summary" id="coSummary"></aside>
      </form>
    </div>`;

    function mount(root) {
      const form = root.querySelector('#coForm');
      const sum = root.querySelector('#coSummary');
      const phone = form.querySelector('#phone');

      const formatPhone = v => {
        let d = v.replace(/\D/g, '');
        if (!d) return '';
        if (d[0] === '8') d = '7' + d.slice(1);
        if (d[0] !== '7') d = '7' + d;
        d = d.slice(0, 11);
        let out = '+7';
        if (d.length > 1) out += ' (' + d.slice(1, 4);
        if (d.length >= 4) out += ')';
        if (d.length > 4) out += ' ' + d.slice(4, 7);
        if (d.length > 7) out += '-' + d.slice(7, 9);
        if (d.length > 9) out += '-' + d.slice(9, 11);
        return out;
      };
      phone.value = formatPhone(phone.value);
      phone.addEventListener('input', () => { phone.value = formatPhone(phone.value); });

      const deliveryId = () => form.querySelector('input[name=delivery]:checked').value;
      const shipCost = () => DELIVERY.find(d => d.id === deliveryId()).price(Store.totals().subtotal);

      function paint() {
        const sub = Store.totals().subtotal;
        DELIVERY.forEach(d => { const c = d.price(sub); form.querySelector(`[data-dprice="${d.id}"]`).textContent = c ? money(c) : 'Бесплатно'; });
        const pick = deliveryId() === 'pickup';
        root.querySelector('#addrBox').hidden = pick;
        root.querySelector('#pickupBox').hidden = !pick;
        const t = Store.totals(shipCost());
        const lines = Store.cartLines();
        sum.innerHTML = `<h2>Ваш заказ</h2>
          <div class="mini-lines">${lines.map(l => `<div class="mini-line" data-id="${l.id}"><img src="${l.product.thumb}" alt=""><div><strong>${esc(l.product.name)}</strong><span>${l.qty} × ${money(l.unit)}</span></div><b>${money(l.total)}</b></div>`).join('')}</div>
          <div class="summary__row"><span>Товары (${t.count})</span><span>${money(t.subtotal + t.saved)}</span></div>
          ${t.saved ? `<div class="summary__row summary__row--discount"><span>Скидка</span><span>−${money(t.saved)}</span></div>` : ''}
          ${t.discount ? `<div class="summary__row summary__row--discount"><span>Промокод</span><span>−${money(t.discount)}</span></div>` : ''}
          <div class="summary__row"><span>Доставка</span><span>${t.shipping ? money(t.shipping) : 'Бесплатно'}</span></div>
          <div class="summary__total"><span>К оплате</span><strong>${money(t.total)}</strong></div>
          <button class="btn btn--primary btn--lg btn--block" type="submit" id="placeBtn">Подтвердить заказ</button>
          <p class="summary__note">Нажимая кнопку, вы соглашаетесь с условиями продажи и обработки данных</p>`;
      }

      form.addEventListener('change', e => { if (e.target.name === 'delivery') paint(); });

      const rules = {
        name: v => v.trim().length >= 2,
        phone: v => v.replace(/\D/g, '').length === 11,
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
        city: v => deliveryId() === 'pickup' || v.trim().length >= 2,
        street: v => deliveryId() === 'pickup' || v.trim().length >= 3
      };
      const check = name => {
        const el = form.elements[name];
        const ok = rules[name](el.value);
        el.closest('.field').classList.toggle('invalid', !ok);
        el.setAttribute('aria-invalid', !ok);
        return ok;
      };
      Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => { if (form.elements[n].value) check(n); }));
      Object.keys(rules).forEach(n => form.elements[n].addEventListener('input', () => { if (form.elements[n].closest('.field').classList.contains('invalid')) check(n); }));

      form.addEventListener('submit', e => {
        e.preventDefault();
        const bad = Object.keys(rules).filter(n => !check(n));
        if (bad.length) {
          form.elements[bad[0]].focus();
          toast({ title: 'Проверьте данные', text: 'Некоторые поля заполнены неверно', iconName: 'info', tone: 'red' });
          return;
        }
        const btn = root.querySelector('#placeBtn');
        btn.disabled = true;
        btn.textContent = 'Оформляем…';
        const d = DELIVERY.find(x => x.id === deliveryId());
        const v = n => form.elements[n].value.trim();
        setTimeout(() => {
          const order = Store.placeOrder({
            name: v('name'), phone: v('phone'), email: v('email'),
            delivery: d.name, shippingCost: shipCost(),
            address: d.id === 'pickup' ? form.elements.store.value : [v('city'), v('street'), v('apt')].filter(Boolean).join(', ') + (v('date') ? ` (на ${new Date(v('date')).toLocaleDateString('ru-RU')})` : ''),
            payment: PAYMENT.find(p => p.id === form.querySelector('input[name=payment]:checked').value).name,
            comment: v('comment')
          });
          navigate('/order/' + order.id);
        }, 900);
      });

      paint();
    }
    return { title: 'Оформление заказа — TECHZONE', html, mount };
  }

  function orderSuccess(id) {
    const o = Store.order(id);
    if (!o) return notFound();
    const html = `<div class="container"><div class="success">
      <div class="success__ic">${icon('check')}</div>
      <h1>Спасибо за заказ!</h1>
      <p>Заказ <b>${esc(o.id)}</b> принят. Менеджер позвонит вам в течение 15 минут для подтверждения.</p>
      <div class="success__box">
        <div class="summary__row"><span>Получатель</span><span>${esc(o.customer.name)}</span></div>
        <div class="summary__row"><span>Телефон</span><span>${esc(o.customer.phone)}</span></div>
        <div class="summary__row"><span>Доставка</span><span>${esc(o.delivery)}</span></div>
        <div class="summary__row"><span>Адрес</span><span style="text-align:right">${esc(o.address)}</span></div>
        <div class="summary__row"><span>Оплата</span><span>${esc(o.payment)}</span></div>
        <div class="summary__total"><span>Итого</span><strong>${money(o.totals.total)}</strong></div>
      </div>
      <div class="success__actions"><a class="btn btn--primary" href="#/account/orders">Мои заказы</a><a class="btn btn--ghost" href="#/catalog">Продолжить покупки</a></div>
    </div></div>`;
    return { title: 'Заказ оформлен — TECHZONE', html };
  }

  /* =====================================================
     FAVORITES
     ===================================================== */
  function favorites() {
    const html = `<header class="page-head"><div class="container">${crumbs([['Избранное']])}<h1>Избранное</h1><p id="favSub"></p></div></header><div class="container" style="padding:40px 0 96px" id="favRoot"></div>`;
    function mount(root) {
      const box = root.querySelector('#favRoot');
      const draw = () => {
        const list = Store.favProducts();
        root.querySelector('#favSub').textContent = list.length ? `${list.length} ${plural(list.length, 'товар', 'товара', 'товаров')} сохранено` : 'Сохраняйте понравившиеся товары, чтобы вернуться к ним позже.';
        box.innerHTML = list.length
          ? `<div style="display:flex;justify-content:flex-end;margin-bottom:20px"><button class="btn btn--ghost btn--sm" id="favAll">${icon('cart')} Добавить все в корзину</button></div><div class="grid">${list.map(card).join('')}</div>`
          : `<div class="empty"><div class="empty__ic">${icon('heart', 'i-lg')}</div><h2>Здесь пока пусто</h2><p>Нажмите на сердечко на карточке товара, чтобы добавить его в избранное.</p><a class="btn btn--primary" href="#/catalog">Перейти в каталог</a></div>`;
        observeReveal(box);
      };
      box.addEventListener('click', e => {
        if (!e.target.closest('#favAll')) return;
        const list = Store.favProducts().filter(p => p.stock > 0);
        list.forEach(p => Store.addToCart(p.id));
        window.TZ_UI.bumpCount('cart');
        toast({ title: 'Добавлено в корзину', text: `${list.length} ${plural(list.length, 'товар', 'товара', 'товаров')}`, iconName: 'cart', link: { href: '#/cart', label: 'Корзина' } });
      });
      draw();
      // re-render only when the favorites list itself changes
      let last = Store.state.favorites.join();
      return Store.subscribe(s => { const now = s.favorites.join(); if (now !== last) { last = now; draw(); } });
    }
    return { title: 'Избранное — TECHZONE', html, mount };
  }

  /* =====================================================
     ACCOUNT
     ===================================================== */
  function orderStatus(o) {
    const age = Date.now() - new Date(o.date).getTime();
    if (age > 2 * 86400000) return ['Доставлен', 'order__status--done'];
    if (age > 10 * 60000) return ['Передан в доставку', ''];
    return ['Принят, ожидает подтверждения', ''];
  }

  function orderHtml(o) {
    const [st, cls] = orderStatus(o);
    const count = o.items.reduce((s, i) => s + i.qty, 0);
    return `<article class="order">
      <div class="order__head">
        <div><span>Заказ</span><b>${esc(o.id)}</b></div>
        <div><span>Дата</span><b>${dateRu(o.date)}</b></div>
        <div><span>Сумма</span><b>${money(o.totals.total)}</b></div>
        <span class="order__status ${cls}">${st}</span>
      </div>
      <div class="order__items">${o.items.slice(0, 5).map(i => `<a href="#/product/${i.id}" title="${esc(i.name)}"><img src="${i.thumb}" alt="${esc(i.name)}" loading="lazy"></a>`).join('')}<p>${count} ${plural(count, 'товар', 'товара', 'товаров')} · ${esc(o.delivery)}</p></div>
      <div class="order__foot"><button class="btn btn--ghost btn--sm" data-repeat="${esc(o.id)}">${icon('refresh')} Повторить заказ</button><a class="btn btn--ghost btn--sm" href="#/order/${esc(o.id)}">Подробнее</a></div>
    </article>`;
  }

  function account(tab = 'overview') {
    const tabs = [['overview', 'Обзор', 'home', '#/account'], ['orders', 'Мои заказы', 'box', '#/account/orders'], ['favorites', 'Избранное', 'heart', '#/favorites'], ['settings', 'Настройки профиля', 'settings', '#/account/settings']];
    if (!tabs.some(t => t[0] === tab)) tab = 'overview';

    const html = `<header class="page-head"><div class="container">${crumbs([['Личный кабинет']])}<h1>Личный кабинет</h1></div></header>
    <div class="container"><div class="account">
      <aside class="acc-nav" id="accNav"></aside>
      <div id="accBody"></div>
    </div></div>`;

    function mount(root) {
      const nav = root.querySelector('#accNav');
      const body = root.querySelector('#accBody');

      function drawNav() {
        const pr = Store.state.profile;
        const name = pr.name || 'Гость TECHZONE';
        const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        const counts = { orders: Store.state.orders.length, favorites: Store.state.favorites.length };
        nav.innerHTML = `<div class="acc-user"><span class="avatar">${esc(initials)}</span><div><strong>${esc(name)}</strong><span>${esc(pr.email || 'Заполните профиль')}</span></div></div>
          <nav>${tabs.map(([k, l, ic, href]) => `<a href="${href}" class="${k === tab ? 'active' : ''}">${icon(ic)} ${l}${counts[k] != null ? `<small>${counts[k]}</small>` : ''}</a>`).join('')}</nav>`;
      }

      function drawBody() {
        const s = Store.state;
        if (tab === 'orders') {
          body.innerHTML = `<h2 style="font-size:28px;margin-bottom:24px">История заказов</h2>${s.orders.length ? s.orders.map(orderHtml).join('') : `<div class="empty"><div class="empty__ic">${icon('box', 'i-lg')}</div><h2>Заказов пока нет</h2><p>Здесь появится история ваших покупок и статусы доставки.</p><a class="btn btn--primary" href="#/catalog">Перейти в каталог</a></div>`}`;
        } else if (tab === 'settings') {
          const pr = s.profile;
          const tg = (n, t, sub) => `<label class="toggle"><span><strong>${t}</strong><span class="sub">${sub}</span></span><input type="checkbox" name="${n}"${pr[n] ? ' checked' : ''}><span class="toggle__ui"></span></label>`;
          body.innerHTML = `<form class="panel" id="profileForm" novalidate>
              <h2>Личные данные</h2>
              <div class="form-grid">
                <div class="field full"><label for="pName">Имя и фамилия</label><input class="input" id="pName" name="name" autocomplete="name" value="${esc(pr.name)}"></div>
                <div class="field"><label for="pEmail">Email</label><input class="input" id="pEmail" name="email" type="email" autocomplete="email" value="${esc(pr.email)}"><span class="err">Введите корректный email</span></div>
                <div class="field"><label for="pPhone">Телефон</label><input class="input" id="pPhone" name="phone" type="tel" autocomplete="tel" value="${esc(pr.phone)}"></div>
                <div class="field"><label for="pCity">Город</label><input class="input" id="pCity" name="city" autocomplete="address-level2" value="${esc(pr.city)}"></div>
                <div class="field"><label for="pAddr">Адрес доставки по умолчанию</label><input class="input" id="pAddr" name="address" autocomplete="street-address" value="${esc(pr.address)}"></div>
              </div>
              <h2 style="margin-top:36px;margin-bottom:8px">Уведомления</h2>
              ${tg('notifyEmail', 'Email-рассылка', 'Новинки, акции и персональные предложения')}
              ${tg('notifySms', 'SMS о статусе заказа', 'Сообщим, когда заказ будет в пути')}
              ${tg('notifyPush', 'Снижение цены', 'Сообщим, когда подешевеет товар из избранного')}
              <div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap"><button class="btn btn--primary" type="submit">Сохранить изменения</button><button class="btn btn--ghost" type="button" id="resetData">Сбросить демо-данные</button></div>
            </form>`;
        } else {
          const spent = s.orders.reduce((sum, o) => sum + o.totals.total, 0);
          const pr = s.profile;
          body.innerHTML = `<h2 style="font-size:28px;margin-bottom:24px">Здравствуйте${pr.name ? ', ' + esc(pr.name.split(' ')[0]) : ''}!</h2>
            <div class="stats">
              <div class="stat"><span>Заказов</span><strong>${s.orders.length}</strong></div>
              <div class="stat"><span>Потрачено</span><strong>${money(spent)}</strong></div>
              <div class="stat"><span>Бонусные баллы</span><strong>${nf.format(Math.round(spent * 0.03))}</strong></div>
            </div>
            ${!pr.name || !pr.email ? `<div class="panel" style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:28px;background:var(--blue-50);border-color:transparent"><div><strong>Заполните профиль</strong><p style="color:var(--muted)">Так оформлять заказы будет быстрее.</p></div><a class="btn btn--primary btn--sm" href="#/account/settings">Заполнить</a></div>` : ''}
            <div class="section__head" style="margin-bottom:20px"><h3 style="font-size:20px">Последний заказ</h3>${s.orders.length ? `<a class="link" href="#/account/orders">Все заказы ${icon('arrow')}</a>` : ''}</div>
            ${s.orders.length ? orderHtml(s.orders[0]) : `<div class="empty" style="padding:40px 24px"><p style="margin:0 auto 20px">Вы ещё ничего не заказывали.</p><a class="btn btn--primary btn--sm" href="#/catalog">Начать покупки</a></div>`}
            ${s.favorites.length ? `<div class="section__head" style="margin:40px 0 20px"><h3 style="font-size:20px">Из избранного</h3><a class="link" href="#/favorites">Всё избранное ${icon('arrow')}</a></div><div class="grid grid--3">${Store.favProducts().slice(0, 3).map(card).join('')}</div>` : ''}`;
        }
        observeReveal(body);
      }

      body.addEventListener('click', e => {
        const rep = e.target.closest('[data-repeat]');
        if (rep) {
          const o = Store.order(rep.dataset.repeat);
          o.items.forEach(i => Store.addToCart(i.id, { color: i.color, config: i.config, qty: i.qty }));
          window.TZ_UI.bumpCount('cart');
          toast({ title: 'Товары добавлены в корзину', text: `Заказ ${o.id}`, iconName: 'cart', link: { href: '#/cart', label: 'Корзина' } });
        }
        if (e.target.closest('#resetData') && confirm('Удалить корзину, избранное, заказы и данные профиля из этого браузера?')) {
          Store.resetAll();
          toast({ title: 'Данные сброшены', iconName: 'refresh' });
          drawNav(); drawBody();
        }
      });
      body.addEventListener('submit', e => {
        if (e.target.id !== 'profileForm') return;
        e.preventDefault();
        const f = e.target;
        const email = f.email.value.trim();
        const ok = !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        f.email.closest('.field').classList.toggle('invalid', !ok);
        if (!ok) { f.email.focus(); return; }
        Store.updateProfile({
          name: f.name.value.trim(), email, phone: f.phone.value.trim(), city: f.city.value.trim(), address: f.address.value.trim(),
          notifyEmail: f.notifyEmail.checked, notifySms: f.notifySms.checked, notifyPush: f.notifyPush.checked
        });
        drawNav();
        toast({ title: 'Профиль сохранён', iconName: 'check' });
      });

      drawNav();
      drawBody();
    }
    return { title: 'Личный кабинет — TECHZONE', html, mount, nav: 'account' };
  }

  /* =====================================================
     INFO PAGES
     ===================================================== */
  const infoHead = (title, sub, crumb) => `<header class="page-head"><div class="container">${crumbs([[crumb || title]])}<h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></header>`;

  function storesHtml() {
    return `<div class="store-list">${STORES.map(s => `<div class="store reveal"><h3>${esc(s.name)}</h3><p>${icon('pin')}${esc(s.addr)}, ${esc(s.metro)}</p><p>${icon('clock')}${esc(s.hours)}</p><p>${icon('call')}<a href="tel:${s.phone.replace(/[^\d+]/g, '')}">${esc(s.phone)}</a></p></div>`).join('')}</div>`;
  }

  function about() {
    const html = `${infoHead('О магазине', 'TECHZONE — крупный ритейлер электроники, где технологии встречаются с безупречным сервисом.')}
    <section class="section"><div class="container about-hero">
      <div class="reveal"><span class="eyebrow">С 2014 года</span><h2 class="h2">Мы делаем технологии ближе</h2><p class="lead">Мы начинали с небольшого салона на Тверской, а сегодня TECHZONE — это 30 магазинов, собственная служба доставки и сервисные центры по всей России. Мы продаём только оригинальную технику от официальных поставщиков.</p><div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn--primary" href="#/catalog">В каталог</a><a class="btn btn--ghost" href="#/contacts">Контакты</a></div></div>
      <img class="reveal" src="${img('1531297484001-80022131f5a1', 1200)}" alt="Рабочее место с ноутбуком и техникой" loading="lazy" data-icon="laptop">
    </div></section>
    <section class="section--tight"><div class="container"><div class="numbers">
      <div class="reveal"><strong>12</strong><span>лет на рынке</span></div>
      <div class="reveal"><strong>30</strong><span>магазинов в 14 городах</span></div>
      <div class="reveal"><strong>1,2 млн</strong><span>довольных клиентов</span></div>
      <div class="reveal"><strong>98%</strong><span>заказов доставлены вовремя</span></div>
    </div></div></section>
    <section class="section"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">Наши преимущества</span><h2 class="h2">Почему выбирают нас</h2></div></div>
      ${featuresHtml()}
    </div></section>
    <section class="section section--soft"><div class="container">
      <div class="section__head reveal"><div><span class="eyebrow">История</span><h2 class="h2">Путь TECHZONE</h2></div></div>
      <ol class="timeline">
        <li class="reveal"><h3>2014</h3><p>Открыт первый магазин в центре Москвы.</p></li>
        <li class="reveal"><h3>2017</h3><p>Запуск интернет-магазина и собственной доставки.</p></li>
        <li class="reveal"><h3>2021</h3><p>Статус авторизованного реселлера ведущих брендов.</p></li>
        <li class="reveal"><h3>2026</h3><p>30 магазинов и доставка за 2 часа в двух столицах.</p></li>
      </ol>
    </div></section>
    <section class="section"><div class="container contacts">
      <div class="reveal"><span class="eyebrow">Магазины</span><h2 class="h2">Приходите в гости</h2><p class="lead">Попробуйте технику вживую, получите консультацию эксперта и заберите заказ в удобное время.</p></div>
      ${storesHtml()}
    </div></section>`;
    return { title: 'О магазине — TECHZONE', html, nav: 'about' };
  }

  function delivery() {
    const html = `${infoHead('Доставка и оплата', 'Привезём заказ в удобное время или подготовим к самовывозу за час.')}
    <section class="section"><div class="container">
      <div class="info-grid">
        <div class="info-card reveal"><div class="feature__ic">${icon('truck')}</div><h3>Курьером</h3><p>На следующий день с 9:00 до 22:00, интервал — 3 часа.</p><span class="big">490 ₽</span><p>бесплатно от 50 000 ₽</p></div>
        <div class="info-card reveal"><div class="feature__ic">${icon('clock')}</div><h3>Экспресс за 2 часа</h3><p>В пределах МКАД и КАД при заказе до 20:00.</p><span class="big">990 ₽</span><p>для любых заказов</p></div>
        <div class="info-card reveal"><div class="feature__ic">${icon('store')}</div><h3>Самовывоз</h3><p>Из 30 магазинов TECHZONE через час после подтверждения.</p><span class="big">0 ₽</span><p>всегда бесплатно</p></div>
      </div>
      <h2 class="h2 reveal" style="margin:80px 0 28px">Доставка по России</h2>
      <div class="tbl-wrap reveal"><table class="tbl"><thead><tr><th>Регион</th><th>Срок</th><th>Стоимость</th></tr></thead><tbody>
        <tr><td>Москва и Санкт-Петербург</td><td>от 2 часов</td><td>от 490 ₽</td></tr>
        <tr><td>Московская и Ленинградская области</td><td>1–2 дня</td><td>от 590 ₽</td></tr>
        <tr><td>Города-миллионники</td><td>2–3 дня</td><td>от 390 ₽</td></tr>
        <tr><td>Другие населённые пункты</td><td>3–7 дней</td><td>от 390 ₽</td></tr>
      </tbody></table></div>
      <h2 class="h2 reveal" style="margin:80px 0 28px">Способы оплаты</h2>
      <div class="features">${PAYMENT.map((p, i) => `<div class="feature reveal"><div class="feature__ic">${icon(['card', 'sparkle', 'gift', 'tag'][i])}</div><h3>${p.name}</h3><p>${p.note}</p></div>`).join('')}</div>
    </div></section>`;
    return { title: 'Доставка и оплата — TECHZONE', html };
  }

  function warranty() {
    const html = `${infoHead('Гарантия на товары', 'Вся техника TECHZONE — официальная, с гарантией производителя и поддержкой нашего сервиса.')}
    <section class="section"><div class="container">
      <div class="info-grid">
        <div class="info-card reveal"><div class="feature__ic">${icon('shield')}</div><h3>Гарантия производителя</h3><p>От 12 месяцев на всю технику. Обслуживание в авторизованных сервисных центрах.</p></div>
        <div class="info-card reveal"><div class="feature__ic">${icon('sparkle')}</div><h3>TECHZONE Care+</h3><p>Расширенная гарантия до 3 лет, включая случайные повреждения и попадание жидкости.</p></div>
        <div class="info-card reveal"><div class="feature__ic">${icon('refresh')}</div><h3>Возврат 14 дней</h3><p>Вернём деньги за товар надлежащего качества, если сохранены упаковка и комплектация.</p></div>
      </div>
      <h2 class="h2 reveal" style="margin:80px 0 28px">Как обратиться по гарантии</h2>
      <ol class="timeline">
        <li class="reveal"><h3>Заявка</h3><p>Оставьте заявку по телефону, в чате или в любом магазине.</p></li>
        <li class="reveal"><h3>Диагностика</h3><p>Бесплатно проверим устройство за 1–3 дня.</p></li>
        <li class="reveal"><h3>Ремонт или замена</h3><p>Отремонтируем или заменим устройство на новое.</p></li>
        <li class="reveal"><h3>Возврат</h3><p>Привезём устройство вам домой бесплатно.</p></li>
      </ol>
      <div class="band reveal" style="margin-top:80px"><div><h2 class="h2">Остались вопросы по гарантии?</h2><p>Специалисты сервиса ответят ежедневно с 9:00 до 22:00.</p></div><div class="band__actions"><a class="btn btn--white btn--lg" href="tel:+78005553535">${icon('call')} Позвонить</a><a class="btn btn--light-ghost btn--lg" href="#/faq">FAQ</a></div></div>
    </div></section>`;
    return { title: 'Гарантия — TECHZONE', html };
  }

  function reviews() {
    const html = `${infoHead('Отзывы покупателей', 'Более 48 000 отзывов со средней оценкой 4,9 из 5.')}
    <section class="section"><div class="container">
      <div class="contacts" style="margin-bottom:56px;align-items:start">
        <div class="reveal"><div style="display:flex;align-items:center;gap:20px"><strong style="font-size:80px;letter-spacing:-.05em;line-height:1">4.9</strong><div>${stars(4.9)}<p style="color:var(--muted);margin-top:6px">48 216 отзывов</p></div></div>
          ${[[5, 88], [4, 9], [3, 2], [2, 1], [1, 0]].map(([s, pct]) => `<div style="display:flex;align-items:center;gap:12px;margin-top:10px;font-size:14px"><span style="width:12px">${s}</span><div class="free-ship__bar" style="flex:1;margin:0"><i style="width:${pct}%"></i></div><span style="width:36px;color:var(--muted)">${pct}%</span></div>`).join('')}
        </div>
        <form class="panel reveal" id="reviewForm" novalidate>
          <h2>Оставить отзыв</h2>
          <div class="form-grid">
            <div class="field"><label for="rName">Ваше имя</label><input class="input" id="rName" name="name" required autocomplete="given-name"><span class="err">Укажите имя</span></div>
            <div class="field"><label for="rRating">Оценка</label><select class="select" id="rRating" name="rating"><option value="5">5 — Отлично</option><option value="4">4 — Хорошо</option><option value="3">3 — Нормально</option><option value="2">2 — Плохо</option><option value="1">1 — Ужасно</option></select></div>
            <div class="field full"><label for="rText">Отзыв</label><textarea class="textarea" id="rText" name="text" required placeholder="Расскажите о покупке"></textarea><span class="err">Напишите хотя бы пару предложений (от 10 символов)</span></div>
          </div>
          <button class="btn btn--primary" style="margin-top:20px">Опубликовать</button>
        </form>
      </div>
      <div class="reviews" id="reviewList"></div>
    </div></section>`;
    function mount(root) {
      const list = root.querySelector('#reviewList');
      const draw = () => { list.innerHTML = Store.state.userReviews.concat(REVIEWS).map(reviewHtml).join(''); observeReveal(list); };
      root.querySelector('#reviewForm').addEventListener('submit', e => {
        e.preventDefault();
        const f = e.target;
        const okName = f.name.value.trim().length >= 2;
        const okText = f.text.value.trim().length >= 10;
        f.name.closest('.field').classList.toggle('invalid', !okName);
        f.text.closest('.field').classList.toggle('invalid', !okText);
        if (!okName || !okText) return;
        Store.addReview({ name: f.name.value.trim(), rating: +f.rating.value, text: f.text.value.trim(), city: 'Покупатель TECHZONE' });
        f.reset();
        draw();
        toast({ title: 'Спасибо за отзыв!', text: 'Он уже опубликован', iconName: 'star' });
      });
      draw();
    }
    return { title: 'Отзывы — TECHZONE', html, mount };
  }

  function contacts() {
    const html = `${infoHead('Контакты', 'Мы на связи ежедневно с 9:00 до 22:00.')}
    <section class="section"><div class="container">
      <div class="contact-cards">
        <a class="contact-card reveal" href="tel:+78005553535">${icon('call')}<span>Горячая линия</span><strong>8 800 555-35-35</strong></a>
        <a class="contact-card reveal" href="mailto:hello@techzone.example">${icon('mail')}<span>Email</span><strong>hello@techzone.example</strong></a>
        <a class="contact-card reveal" href="#/faq">${icon('help')}<span>Частые вопросы</span><strong>Ответы за 1 минуту</strong></a>
      </div>
      <div class="contacts">
        <div><h2 class="h2 reveal" style="margin-bottom:24px">Наши магазины</h2>${storesHtml()}</div>
        <form class="panel reveal" id="contactForm" novalidate>
          <h2>Напишите нам</h2>
          <div class="form-grid">
            <div class="field"><label for="cName">Имя</label><input class="input" id="cName" name="name" autocomplete="name"><span class="err">Укажите имя</span></div>
            <div class="field"><label for="cEmail">Email</label><input class="input" id="cEmail" name="email" type="email" autocomplete="email"><span class="err">Введите корректный email</span></div>
            <div class="field full"><label for="cTopic">Тема</label><select class="select" id="cTopic" name="topic"><option>Вопрос о товаре</option><option>Статус заказа</option><option>Гарантия и ремонт</option><option>Сотрудничество</option></select></div>
            <div class="field full"><label for="cMsg">Сообщение</label><textarea class="textarea" id="cMsg" name="msg"></textarea><span class="err">Напишите сообщение</span></div>
          </div>
          <button class="btn btn--primary" style="margin-top:20px">Отправить сообщение</button>
        </form>
      </div>
    </div></section>`;
    function mount(root) {
      root.querySelector('#contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const f = e.target;
        const checks = { name: f.name.value.trim().length >= 2, email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()), msg: f.msg.value.trim().length >= 5 };
        Object.entries(checks).forEach(([k, ok]) => f[k].closest('.field').classList.toggle('invalid', !ok));
        const bad = Object.keys(checks).find(k => !checks[k]);
        if (bad) { f[bad].focus(); return; }
        Store.addMessage({ name: f.name.value.trim(), email: f.email.value.trim(), topic: f.topic.value, msg: f.msg.value.trim() });
        f.reset();
        toast({ title: 'Сообщение отправлено', text: 'Ответим в течение часа', iconName: 'mail' });
      });
    }
    return { title: 'Контакты — TECHZONE', html, mount };
  }

  function faq() {
    const cats = ['Все', ...new Set(FAQ.map(f => f.cat))];
    const html = `${infoHead('Вопросы и ответы', 'Собрали ответы на самые популярные вопросы покупателей.', 'FAQ')}
    <section class="section"><div class="container faq">
      <div class="fsearch reveal" style="margin-bottom:20px">${icon('search')}<label class="sr-only" for="faqQ">Поиск по вопросам</label><input class="input" id="faqQ" type="search" placeholder="Поиск по вопросам"></div>
      <div class="faq-cats reveal" id="faqCats">${cats.map((c, i) => `<button class="chip${i === 0 ? ' active' : ''}" data-c="${c}">${c}</button>`).join('')}</div>
      <div id="faqList"></div>
      <div class="band reveal" style="margin-top:64px"><div><h2 class="h2">Не нашли ответ?</h2><p>Напишите нам — ответим в течение часа.</p></div><div class="band__actions"><a class="btn btn--white btn--lg" href="#/contacts">Связаться</a></div></div>
    </div></section>`;
    function mount(root) {
      let cat = 'Все';
      const list = root.querySelector('#faqList');
      const q = root.querySelector('#faqQ');
      const draw = () => {
        const term = q.value.trim().toLowerCase();
        const items = FAQ.filter(f => (cat === 'Все' || f.cat === cat) && (!term || (f.q + f.a).toLowerCase().includes(term)));
        list.innerHTML = items.length ? items.map((f, i) => `<div class="qa"><button aria-expanded="false" aria-controls="qa${i}">${esc(f.q)}<span class="qa__ic">${icon('plus', 'i-sm')}</span></button><div class="qa__body" id="qa${i}"><div><p>${esc(f.a)}</p></div></div></div>`).join('') : `<p style="color:var(--muted);padding:24px 0">Ничего не найдено. Попробуйте другой запрос.</p>`;
      };
      list.addEventListener('click', e => {
        const b = e.target.closest('.qa button');
        if (!b) return;
        const qa = b.parentElement;
        const open = !qa.classList.contains('open');
        qa.classList.toggle('open', open);
        b.setAttribute('aria-expanded', open);
      });
      root.querySelector('#faqCats').addEventListener('click', e => {
        const b = e.target.closest('[data-c]');
        if (!b) return;
        cat = b.dataset.c;
        root.querySelectorAll('#faqCats .chip').forEach(x => x.classList.toggle('active', x === b));
        draw();
      });
      q.addEventListener('input', draw);
      draw();
    }
    return { title: 'FAQ — TECHZONE', html, mount };
  }

  function notFound() {
    return {
      title: 'Страница не найдена — TECHZONE',
      html: `<div class="container"><div class="success"><div class="empty__ic" style="width:96px;height:96px">${icon('search', 'i-lg')}</div><h1>Страница не найдена</h1><p>Возможно, она была перемещена или вы ошиблись адресом.</p><div class="success__actions" style="margin-top:28px"><a class="btn btn--primary" href="#/">На главную</a><a class="btn btn--ghost" href="#/catalog">В каталог</a></div></div></div>`
    };
  }

  window.TZ_PAGES = { home, catalog, product, cart, checkout, orderSuccess, favorites, account, about, delivery, warranty, reviews, contacts, faq, notFound, matches };
})();
