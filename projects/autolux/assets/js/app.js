/* AutoLux — общая логика: язык, навигация, переходы, анимации, формы, карточки */
(function () {
  const AL = window.AL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Язык ---------- */
  // Тексты на обоих языках лежат в разметке (<span class="ru">/<span class="en">), CSS показывает нужный.
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ru');
  const B = (ru, en) => `<span class="ru">${ru}</span><span class="en">${en ?? ru}</span>`;
  const L = (o) => (o && typeof o === 'object' ? B(o.ru, o.en) : o ?? '');
  const tx = (ru, en) => (lang() === 'en' ? en : ru);
  // Атрибуты (placeholder, aria-label, alt) переключаются через data-<attr>-ru / data-<attr>-en
  const A = (attr, ru, en) => `${attr}="${tx(ru, en)}" data-${attr}-ru="${ru}" data-${attr}-en="${en}"`;
  const ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];

  function applyLang(root = document) {
    const l = lang();
    ATTRS.forEach((a) => $$(`[data-${a}-${l}]`, root).forEach((el) => el.setAttribute(a, el.getAttribute(`data-${a}-${l}`))));
    $$('[data-text-ru]', root).forEach((el) => (el.textContent = el.getAttribute(`data-text-${l}`)));
    const t = document.body.dataset[l === 'en' ? 'titleEn' : 'titleRu'];
    if (t) document.title = t;
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === l));
  }
  function setLang(l) {
    document.documentElement.lang = l;
    try { localStorage.setItem('autolux-lang', l); } catch (_) {}
    applyLang();
  }
  Object.assign(AL, { lang, B, L, tx, A, applyLang });

  const CONTACT = {
    phone: '+7 (495) 120-77-77', phoneHref: '+74951207777', email: 'concierge@autolux.ru',
    address: { ru: 'Москва, Пресненская наб., 12', en: '12 Presnenskaya Emb., Moscow' },
    hours: { ru: 'Ежедневно 10:00 — 21:00', en: 'Daily 10:00 — 21:00' }
  };
  AL.CONTACT = CONTACT;

  /* ---------- Иконки ---------- */
  const ic = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    arrow: '<svg class="arrow" viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 5h17M13 1l4 4-4 4"/></svg>',
    left: ic('<path d="M15 18l-6-6 6-6"/>'),
    right: ic('<path d="M9 18l6-6-6-6"/>'),
    close: ic('<path d="M18 6L6 18M6 6l12 12"/>'),
    check: ic('<path d="M20 6L9 17l-5-5"/>'),
    ok: ic('<circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.7 2.7L16.5 9.5"/>'),
    filter: ic('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.3 15.6c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.9 13.4l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20.6 2.7c.9-.3 1.7.2 1.3 1.6z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 01-2.4-1.5 9 9 0 01-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1 2.5 6 6 0 001.2 3.1 13.4 13.4 0 005.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.1-.3-.2-.6-.3zM12 21.8a9.9 9.9 0 01-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1112 21.8zM20.5 3.5A11.8 11.8 0 001.7 17.7L0 24l6.4-1.7A11.8 11.8 0 0024 12a11.7 11.7 0 00-3.5-8.5z"/></svg>',
    instagram: ic('<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>'
  };
  const LOGO_MARK = `<svg class="logo__mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M20 1.5L38.5 20 20 38.5 1.5 20z" stroke-width="1"/><path d="M12.5 27L20 11l7.5 16M15.3 21.5h9.4" stroke-width="1.4"/></svg>`;
  AL.ICONS = ICONS;

  /* ---------- Шапка, меню, подвал ---------- */
  const NAV = [
    ['index.html', 'Главная', 'Home', 'home'],
    ['catalog.html', 'Каталог', 'Inventory', 'catalog'],
    ['about.html', 'О компании', 'About', 'about'],
    ['contacts.html', 'Контакты', 'Contact', 'contacts']
  ];
  const current = page === 'car' ? 'catalog' : page;
  const navLinks = () => NAV.map(([h, ru, en, k]) => `<li><a href="${h}"${k === current ? ' aria-current="page"' : ''}>${B(ru, en)}</a></li>`).join('');

  function renderChrome() {
    const header = document.createElement('header');
    header.className = 'nav' + (document.body.dataset.solidNav ? ' is-solid' : '');
    header.innerHTML = `
      <div class="container nav__inner">
        <a href="index.html" class="logo" ${A('aria-label', 'AutoLux — на главную', 'AutoLux — home')}>${LOGO_MARK}<span class="logo__word">AUTO<b>LUX</b></span></a>
        <nav ${A('aria-label', 'Основная навигация', 'Main navigation')}><ul class="nav__links">${navLinks()}</ul></nav>
        <div class="nav__right">
          <div class="lang" role="group" ${A('aria-label', 'Язык сайта', 'Site language')}>
            <button type="button" data-lang="ru" aria-pressed="false" lang="ru">RU</button><span></span><button type="button" data-lang="en" aria-pressed="false" lang="en">EN</button>
          </div>
          <button class="btn btn--sm" data-open-lead>${B('Связаться', 'Contact us')}</button>
          <button class="burger" ${A('aria-label', 'Открыть меню', 'Open menu')} aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
        </div>
      </div>`;
    document.body.prepend(header);

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobile-menu';
    menu.innerHTML = `
      <ol>${NAV.map(([h, ru, en]) => `<li><a href="${h}">${B(ru, en)}</a></li>`).join('')}</ol>
      <div class="mobile-menu__foot">
        <a class="phone" href="tel:${CONTACT.phoneHref}">${CONTACT.phone}</a>
        <span>${L(CONTACT.address)}</span>
        <button class="btn btn--gold" data-open-lead>${B('Связаться', 'Contact us')} ${ICONS.arrow}</button>
      </div>`;
    header.after(menu);

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__about">
            <a href="index.html" class="logo" aria-label="AutoLux">${LOGO_MARK}<span class="logo__word">AUTO<b>LUX</b></span></a>
            <p>${B('Дилерский центр автомобилей премиум-класса. Подбор, проверка, доставка и сервис — с 2009 года.', 'A premium car dealership. Sourcing, inspection, delivery and service since 2009.')}</p>
            <div class="socials">
              <a href="#" aria-label="Telegram">${ICONS.telegram}</a>
              <a href="#" aria-label="WhatsApp">${ICONS.whatsapp}</a>
              <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="#" aria-label="YouTube">${ICONS.youtube}</a>
            </div>
          </div>
          <div><h4>${B('Навигация', 'Navigation')}</h4><ul>${NAV.map(([h, ru, en]) => `<li><a href="${h}">${B(ru, en)}</a></li>`).join('')}</ul></div>
          <div><h4>${B('Марки', 'Brands')}</h4><ul>${['Lamborghini', 'Porsche', 'Ferrari', 'Rolls-Royce', 'McLaren'].map((b) => `<li><a href="catalog.html?brand=${encodeURIComponent(b)}">${b}</a></li>`).join('')}</ul></div>
          <div><h4>${B('Контакты', 'Contact')}</h4><ul>
            <li><a href="tel:${CONTACT.phoneHref}">${CONTACT.phone}</a></li>
            <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
            <li><a href="contacts.html">${L(CONTACT.address)}</a></li>
            <li class="muted" style="font-size:14.5px">${L(CONTACT.hours)}</li>
          </ul></div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} AutoLux</span>
          <span>${B('Информация на сайте не является публичной офертой', 'Information on this site is not a public offer')}</span>
        </div>
      </div>`;
    document.body.append(footer);

    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.addEventListener('animationend', () => { if (!curtain.classList.contains('is-leaving')) curtain.style.display = 'none'; });
    document.body.append(curtain);
    AL.curtain = curtain;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);

    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal" id="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title" aria-hidden="true">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__dialog">
          <button class="modal__close" data-close ${A('aria-label', 'Закрыть', 'Close')}>${ICONS.close}</button>
          <span class="eyebrow">${B('Персональный менеджер', 'Personal manager')}</span>
          <h2 class="h2" id="lead-title">${B('Оставить заявку', 'Make an enquiry')}</h2>
          <p class="lead">${B('Ответим в течение 15 минут и подберём время для просмотра и тест-драйва.', 'We reply within 15 minutes and arrange a viewing and test drive.')}</p>
          <div class="modal-car" hidden></div>
          ${formHTML('lead')}
        </div>
      </div>`);
  }

  /* ---------- Формы ---------- */
  function formHTML(id) {
    const topics = [['Покупка автомобиля', 'Buying a car'], ['Тест-драйв', 'Test drive'], ['Trade-in', 'Trade-in'], ['Подбор под заказ', 'Sourcing to order'], ['Лизинг и кредит', 'Leasing & finance']];
    return `
      <form class="form" data-form="${id}" novalidate>
        <div class="field"><label for="${id}-name">${B('Имя', 'Name')}</label><input id="${id}-name" name="name" autocomplete="name" ${A('placeholder', 'Как к вам обращаться', 'Your name')}><span class="err">${B('Укажите имя', 'Please enter your name')}</span></div>
        <div class="field"><label for="${id}-phone">${B('Телефон', 'Phone')}</label><input id="${id}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__"><span class="err">${B('Введите корректный номер', 'Please enter a valid number')}</span></div>
        <div class="field field--full"><label for="${id}-topic">${B('Интересует', 'Topic')}</label>
          <select id="${id}-topic" name="topic">${topics.map(([ru, en]) => `<option value="${en}" data-text-ru="${ru}" data-text-en="${en}">${tx(ru, en)}</option>`).join('')}</select></div>
        <div class="field field--full"><label for="${id}-msg">${B('Комментарий', 'Message')}</label><textarea id="${id}-msg" name="message" rows="3" ${A('placeholder', 'Модель, бюджет, удобное время для звонка', 'Model, budget, best time to call')}></textarea></div>
        <label class="check field--full"><input type="checkbox" name="agree" checked> <span>${B('Согласен на обработку персональных данных', 'I agree to the processing of my personal data')}</span></label>
        <div class="field--full"><button class="btn btn--gold btn--block" type="submit">${B('Отправить заявку', 'Send enquiry')} ${ICONS.arrow}<span class="spinner" aria-hidden="true"></span></button></div>
        <div class="form__success" role="status">
          <div class="ok">${ICONS.ok}</div>
          <h3 class="h3">${B('Заявка принята', 'Thank you')}</h3>
          <p class="muted">${B('Персональный менеджер свяжется с вами в течение 15 минут.', 'Your personal manager will contact you within 15 minutes.')}</p>
          <button type="button" class="link-arrow" data-reset-form><span>${B('Отправить ещё одну', 'Send another')}</span></button>
        </div>
      </form>`;
  }

  function maskPhone(input) {
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (!d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
      let out = '+7';
      if (p[0]) out += ' (' + p[0];
      if (p[0].length === 3) out += ')';
      if (p[1]) out += ' ' + p[1];
      if (p[2]) out += '-' + p[2];
      if (p[3]) out += '-' + p[3];
      input.value = d.length > 1 ? out : '';
    });
  }

  function bindForm(form) {
    $$('input[type=tel]', form).forEach(maskPhone);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const { name, phone, agree } = form.elements;
      const setErr = (el, bad) => { (el.closest('.field') || el.closest('.check')).classList.toggle('has-error', bad); if (bad) ok = false; };
      setErr(name, name.value.trim().length < 2);
      setErr(phone, phone.value.replace(/\D/g, '').length !== 11);
      setErr(agree, !agree.checked);
      if (!ok) { $('.has-error input, .has-error textarea', form)?.focus(); return; }
      const btn = $('button[type=submit]', form);
      btn.classList.add('is-loading'); btn.disabled = true;
      const lead = Object.fromEntries(new FormData(form));
      lead.car = form.dataset.car || null; lead.lang = lang(); lead.at = new Date().toISOString();
      try { const all = JSON.parse(localStorage.getItem('autolux-leads') || '[]'); all.push(lead); localStorage.setItem('autolux-leads', JSON.stringify(all)); } catch (_) {}
      setTimeout(() => {
        btn.classList.remove('is-loading'); btn.disabled = false;
        form.classList.add('is-sent');
        const first = lead.name.trim().split(' ')[0];
        toast(tx(`Спасибо, ${first}! Заявка отправлена.`, `Thank you, ${first}. Your enquiry has been sent.`));
      }, 1000);
    });
    form.addEventListener('input', (e) => (e.target.closest('.field') || e.target.closest('.check'))?.classList.remove('has-error'));
    form.addEventListener('click', (e) => { if (e.target.closest('[data-reset-form]')) { form.reset(); form.classList.remove('is-sent'); } });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('.toast');
    t.innerHTML = ICONS.check + `<span>${msg}</span>`;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 3800);
  }

  /* ---------- Модальное окно заявки ---------- */
  let lastFocus;
  function openLead(carId) {
    const modal = $('#lead-modal'), form = $('form', modal), box = $('.modal-car', modal);
    form.classList.remove('is-sent');
    const car = carId && AL.CARS.find((c) => c.id === carId);
    if (car) {
      box.hidden = false;
      box.innerHTML = `<img src="${AL.IMG(car.photo, 300)}" alt=""><div><strong>${car.brand} ${car.model}</strong><span>${AL.fmtPrice(car.price)}</span></div>`;
      form.dataset.car = car.id;
      form.elements.message.value = tx(`Интересует ${car.brand} ${car.model} ${car.year} г.`, `I'm interested in the ${car.year} ${car.brand} ${car.model}.`);
    } else { box.hidden = true; delete form.dataset.car; }
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => form.elements.name.focus(), 350);
  }
  function closeLead() {
    const modal = $('#lead-modal');
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  }

  /* ---------- Карточка автомобиля ---------- */
  AL.cardHTML = (c, i = 0) => `
    <article class="car-card" style="--d:${Math.min(i, 8) * 0.06}s">
      <div class="car-card__media">
        <span class="car-card__tag">${c.year}</span>
        <img src="${AL.IMG(c.photo, 800)}" srcset="${AL.IMG(c.photo, 600)} 600w, ${AL.IMG(c.photo, 900)} 900w, ${AL.IMG(c.photo, 1200)} 1200w" sizes="(max-width:720px) 100vw, (max-width:1080px) 50vw, 30vw" ${A('alt', `${c.brand} ${c.model}, ${c.color}`, `${c.brand} ${c.model}, ${c.color}`)} loading="lazy">
      </div>
      <div class="car-card__body">
        <span class="car-card__brand">${c.brand}</span>
        <h3 class="car-card__title"><a class="stretched" href="car.html?id=${c.id}">${c.model}</a></h3>
        <span class="car-card__trim">${c.trim} · ${L(AL.BODIES[c.body])}</span>
        <dl class="car-card__specs">
          <div><dt>${B('Год', 'Year')}</dt><dd>${c.year}</dd></div>
          <div><dt>${B('Пробег', 'Mileage')}</dt><dd>${AL.fmtNum(c.mileage)} ${B('км', 'km')}</dd></div>
          <div><dt>${B('Мощность', 'Power')}</dt><dd>${c.power} ${B('л.с.', 'hp')}</dd></div>
        </dl>
        <div class="car-card__foot">
          <span class="car-card__price">${AL.fmtPrice(c.price)}</span>
          <a class="btn btn--sm" href="car.html?id=${c.id}" tabindex="-1">${B('Подробнее', 'Details')} ${ICONS.arrow}</a>
        </div>
      </div>
    </article>`;

  /* ---------- Поведение ---------- */
  function bindNav() {
    const nav = $('.nav');
    const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    const burger = $('.burger'), menu = $('#mobile-menu');
    const toggle = (open) => {
      burger.setAttribute('aria-expanded', open);
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a,button')) toggle(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { toggle(false); closeLead(); } });
    $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  }

  function bindGlobalClicks() {
    document.addEventListener('click', (e) => {
      const lead = e.target.closest('[data-open-lead]');
      if (lead) { e.preventDefault(); openLead(lead.dataset.car); return; }
      if (e.target.closest('#lead-modal [data-close]')) { closeLead(); return; }

      // Плавный переход между страницами
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (url.pathname === location.pathname && url.search === location.search) { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (reduce) return;
      e.preventDefault();
      const c = AL.curtain;
      c.style.display = 'block';
      c.classList.add('is-leaving');
      setTimeout(() => (location.href = url.href), 380);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { AL.curtain.classList.remove('is-leaving'); AL.curtain.style.display = 'none'; } });
  }

  function observeReveal(root = document) {
    const els = $$('.reveal', root).filter((el) => !el.classList.contains('is-in'));
    if (!('IntersectionObserver' in window) || reduce) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }
  AL.observeReveal = observeReveal;

  function counters() {
    const els = $$('[data-count]');
    const fmt = (el, v) => (el.textContent = AL.fmtNum(v) + (el.dataset.suffix || ''));
    if (reduce || !('IntersectionObserver' in window)) { els.forEach((el) => fmt(el, +el.dataset.count)); return; }
    const run = (el) => {
      const end = +el.dataset.count, t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1800);
        fmt(el, Math.round(end * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  function slider() {
    const root = $('[data-slider]');
    if (!root) return;
    const slides = $$('.slide', root), cur = $('[data-cur]', root);
    let i = 0, timer;
    const go = (n) => {
      slides[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      cur.textContent = String(i + 1).padStart(2, '0');
      clearTimeout(timer);
      if (!reduce) timer = setTimeout(() => go(i + 1), 8000);
    };
    $('[data-prev]', root).addEventListener('click', () => go(i - 1));
    $('[data-next]', root).addEventListener('click', () => go(i + 1));
    go(0);
  }

  /* ---------- Главная ---------- */
  function home() {
    const host = $('#popular');
    if (host) host.innerHTML = ['lamborghini-aventador-s', 'porsche-911-gt3-rs', 'rolls-royce-wraith']
      .map((id, i) => AL.cardHTML(AL.CARS.find((c) => c.id === id), i)).join('');
  }

  /* ---------- Старт ---------- */
  renderChrome();
  $$('[data-form-slot]').forEach((el) => (el.innerHTML = formHTML(el.dataset.formSlot)));
  $$('[data-icon]').forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ''));
  if (page === 'home') home();
  applyLang();
  bindNav();
  bindGlobalClicks();
  $$('form[data-form]').forEach(bindForm);
  observeReveal();
  counters();
  slider();
})();
