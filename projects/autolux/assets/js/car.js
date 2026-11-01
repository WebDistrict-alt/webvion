/* AutoLux — страница автомобиля: галерея, лайтбокс, характеристики */
(function () {
  const AL = window.AL;
  const { B, L, ICONS: I } = AL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = $('#car-root');
  const id = new URLSearchParams(location.search).get('id');
  const car = AL.CARS.find((c) => c.id === id);

  const finish = () => { AL.applyLang(); AL.observeReveal(root); };

  if (!car) {
    document.body.dataset.titleRu = 'Автомобиль не найден — AutoLux';
    document.body.dataset.titleEn = 'Car not found — AutoLux';
    root.innerHTML = `
      <section class="notfound"><div class="container">
        <span class="eyebrow">404</span>
        <h1 class="h1" style="margin:20px 0">${B('Автомобиль <span class="accent">не найден</span>', 'Car <span class="accent">not found</span>')}</h1>
        <p class="lead" style="margin:0 auto 34px">${B('Возможно, он уже нашёл своего владельца.', 'It may have already found its owner.')}</p>
        <a class="btn btn--gold" href="catalog.html">${B('В каталог', 'View inventory')} ${I.arrow}</a>
      </div></section>`;
    finish();
    return;
  }

  document.body.dataset.titleRu = `${car.brand} ${car.model} ${car.year} — AutoLux`;
  document.body.dataset.titleEn = `${car.year} ${car.brand} ${car.model} — AutoLux`;
  const src = (g, w) => AL.IMG(g.id, w, g.fp);
  const G = car.gallery;
  const pad = (n) => String(n).padStart(2, '0');
  // Ориентировочный платёж: взнос 30%, 60 мес., 14.9% годовых
  const loan = car.price * 0.7, r = 0.149 / 12, n = 60;
  const monthly = Math.round((loan * r) / (1 - Math.pow(1 + r, -n)) / 1000) * 1000;

  const specs = [
    [B('Марка', 'Make'), car.brand], [B('Модель', 'Model'), `${car.model} ${car.trim}`], [B('Год выпуска', 'Year'), car.year],
    [B('Пробег', 'Mileage'), `${AL.fmtNum(car.mileage)} ${B('км', 'km')}`], [B('Тип кузова', 'Body style'), L(AL.BODIES[car.body])],
    [B('Двигатель', 'Engine'), L(car.engine)], [B('Мощность', 'Power'), `${car.power} ${B('л.с.', 'hp')}`],
    [B('Крутящий момент', 'Torque'), `${car.torque} ${B('Н·м', 'Nm')}`], [B('Разгон 0–100 км/ч', '0–100 km/h'), `${car.accel} ${B('с', 's')}`],
    [B('Максимальная скорость', 'Top speed'), `${car.top} ${B('км/ч', 'km/h')}`], [B('Привод', 'Drivetrain'), L(AL.DRIVES[car.drive])],
    [B('Коробка передач', 'Transmission'), L(car.gearbox)], [B('Цвет кузова', 'Exterior'), car.color], [B('Салон', 'Interior'), L(car.interior)],
    [B('Владельцев', 'Owners'), car.owners || B('Новый автомобиль', 'New')], [B('Статус', 'Status'), L(AL.STATUS[car.status])]
  ];

  const similar = AL.CARS.filter((c) => c.id !== car.id)
    .map((c) => ({ c, s: (c.brand === car.brand ? 3 : 0) + (c.body === car.body ? 2 : 0) - Math.abs(Math.log(c.price / car.price)) }))
    .sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.c);

  const alt = (i) => AL.A('alt', `${car.brand} ${car.model} — фото ${i + 1}`, `${car.brand} ${car.model} — photo ${i + 1}`);
  const aria = (ru, en) => AL.A('aria-label', ru, en);

  root.innerHTML = `
    <section class="car-top">
      <div class="container">
        <nav class="breadcrumbs fade-up" aria-label="Breadcrumbs"><a href="index.html">${B('Главная', 'Home')}</a><span aria-hidden="true">/</span><a href="catalog.html">${B('Каталог', 'Inventory')}</a><span aria-hidden="true">/</span><a href="catalog.html?brand=${encodeURIComponent(car.brand)}">${car.brand}</a><span aria-hidden="true">/</span><span>${car.model}</span></nav>
        <div class="car-layout">
          <div class="fade-up" style="--d:.1s">
            <div class="gallery__main" role="button" tabindex="0" ${aria('Открыть фото на весь экран', 'Open photo fullscreen')}>
              <img class="is-current" src="${src(G[0], 1600)}" ${alt(0)} fetchpriority="high">
              <span class="gallery__counter"><span data-gcur>01</span> / ${pad(G.length)}</span>
              <div class="gallery__nav">
                <button type="button" class="icon-btn" data-gprev ${aria('Предыдущее фото', 'Previous photo')}>${I.left}</button>
                <button type="button" class="icon-btn" data-gnext ${aria('Следующее фото', 'Next photo')}>${I.right}</button>
              </div>
            </div>
            <div class="gallery__thumbs">
              ${G.map((g, i) => `<button type="button" data-thumb="${i}" aria-label="${i + 1}" aria-current="${i === 0}"><img src="${src(g, 320)}" alt="" loading="lazy"></button>`).join('')}
            </div>
          </div>

          <aside class="car-info fade-up" style="--d:.2s">
            <span class="car-card__brand">${car.brand}</span>
            <h1>${car.model}</h1>
            <p class="car-info__trim">${car.trim} · ${car.year} · ${car.color}</p>
            <span class="car-info__status${car.status !== 'stock' ? ' is-request' : ''}">${L(AL.STATUS[car.status])}</span>
            <dl class="key-specs">
              <div><dt>${B('Мощность', 'Power')}</dt><dd>${car.power}<small>${B('л.с.', 'hp')}</small></dd></div>
              <div><dt>0–100</dt><dd>${car.accel}<small>${B('с', 's')}</small></dd></div>
              <div><dt>${B('Пробег', 'Mileage')}</dt><dd>${AL.fmtNum(car.mileage)}<small>${B('км', 'km')}</small></dd></div>
              <div><dt>${B('Год', 'Year')}</dt><dd>${car.year}</dd></div>
            </dl>
            <div class="price">
              <small>${B('Стоимость', 'Price')}</small>
              <strong>${AL.fmtPrice(car.price)}</strong>
              <div class="monthly">${B('В кредит от', 'Finance from')} <b>${AL.fmtPrice(monthly)}</b> ${B('/ мес.', '/ month')}</div>
              <div class="price__actions">
                <button class="btn btn--gold btn--block" data-open-lead data-car="${car.id}">${B('Оставить заявку', 'Make an enquiry')} ${I.arrow}</button>
                <a class="btn btn--block" href="tel:${AL.CONTACT.phoneHref}">${AL.CONTACT.phone}</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container car-details">
        <div>
          <span class="eyebrow reveal">${B('Описание', 'Overview')}</span>
          <h2 class="h2 reveal" style="--d:.1s">${car.brand} <span class="accent">${car.model}</span></h2>
          <p class="reveal" style="--d:.15s">${L(car.desc)}</p>
          <ul class="features reveal" style="--d:.2s">${car.features.ru.map((f, i) => `<li>${B(f, car.features.en[i])}</li>`).join('')}</ul>
        </div>
        <div class="reveal" style="--d:.1s">
          <table class="spec-table">
            <caption>${B('Характеристики', 'Specifications')}</caption>
            <tbody>${specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section section--graphite section--tight">
      <div class="container">
        <div class="section-head">
          <div><span class="eyebrow reveal">${B('Вам может понравиться', 'You may also like')}</span><h2 class="h2 reveal" style="--d:.1s">${B('Похожие автомобили', 'Similar cars')}</h2></div>
          <a class="link-arrow reveal" href="catalog.html"><span>${B('Весь каталог', 'Full inventory')}</span> ${I.arrow}</a>
        </div>
        <div class="cars-grid">${similar.map((c, i) => AL.cardHTML(c, i)).join('')}</div>
      </div>
    </section>

    <div class="lightbox" role="dialog" aria-modal="true" aria-label="${car.brand} ${car.model}" aria-hidden="true">
      <div class="lightbox__stage"><img src="" alt=""></div>
      <button class="icon-btn lightbox__close" type="button" data-lclose ${aria('Закрыть', 'Close')}>${I.close}</button>
      <button class="icon-btn lightbox__prev" type="button" data-lprev ${aria('Предыдущее фото', 'Previous photo')}>${I.left}</button>
      <button class="icon-btn lightbox__next" type="button" data-lnext ${aria('Следующее фото', 'Next photo')}>${I.right}</button>
      <span class="lightbox__count"></span>
    </div>`;
  finish();

  /* --- Галерея --- */
  let cur = 0;
  const main = $('.gallery__main');
  const lb = $('.lightbox'), stage = $('.lightbox__stage'), lbImg = $('.lightbox__stage img');

  function show(i) {
    i = (i + G.length) % G.length;
    const old = main.querySelector('img.is-current');
    const img = new Image();
    img.className = 'is-current';
    img.alt = old.alt;
    img.style.opacity = '0';
    img.src = src(G[i], 1600);
    old.after(img);
    const swap = () => {
      requestAnimationFrame(() => { img.style.opacity = ''; old.classList.remove('is-current'); old.classList.add('is-leaving'); });
      setTimeout(() => old.remove(), 750);
    };
    img.decode ? img.decode().then(swap, swap) : (img.onload = swap);
    cur = i;
    $('[data-gcur]').textContent = pad(i + 1);
    $$('[data-thumb]').forEach((t) => t.setAttribute('aria-current', +t.dataset.thumb === i));
    if (lb.classList.contains('is-open')) lbShow();
  }
  $('[data-gprev]').addEventListener('click', (e) => { e.stopPropagation(); show(cur - 1); });
  $('[data-gnext]').addEventListener('click', (e) => { e.stopPropagation(); show(cur + 1); });
  $$('[data-thumb]').forEach((t) => t.addEventListener('click', () => +t.dataset.thumb !== cur && show(+t.dataset.thumb)));

  let x0 = null;
  main.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  main.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  /* --- Лайтбокс --- */
  function lbShow() {
    stage.classList.remove('is-zoomed');
    lbImg.src = src(G[cur], 2400);
    lbImg.alt = `${car.brand} ${car.model} — ${cur + 1}`;
    $('.lightbox__count').textContent = `${cur + 1} / ${G.length}`;
  }
  const lbOpen = () => { lbShow(); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; $('[data-lclose]').focus(); };
  const lbClose = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; main.focus(); };
  main.addEventListener('click', (e) => { if (!e.target.closest('.gallery__nav')) lbOpen(); });
  main.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(); } });
  $('[data-lclose]').addEventListener('click', lbClose);
  $('[data-lprev]').addEventListener('click', () => show(cur - 1));
  $('[data-lnext]').addEventListener('click', () => show(cur + 1));
  stage.addEventListener('click', (e) => {
    if (e.target !== lbImg) { lbClose(); return; }
    const rc = lbImg.getBoundingClientRect();
    lbImg.style.transformOrigin = `${((e.clientX - rc.left) / rc.width) * 100}% ${((e.clientY - rc.top) / rc.height) * 100}%`;
    stage.classList.toggle('is-zoomed');
  });
  addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  G.forEach((g) => { const im = new Image(); im.src = src(g, 1600); });
})();
