// Общие данные компании — меняются в одном месте для всех страниц
const COMPANY = {
  phone: '+7 (900) 000-00-00',
  phoneHref: 'tel:+79000000000',
  email: 'info@corestone.ru',
  address: 'г. Ваш город, ул. Примерная, 1',
  hours: 'Пн–Сб, 9:00–19:00',
};

const NAV = [
  ['about.html', 'О компании'],
  ['projects.html', 'Проекты'],
  ['process.html', 'Этапы и вопросы'],
  ['calculator.html', 'Стоимость'],
  ['contacts.html', 'Контакты'],
];

const page = document.body.dataset.page || '';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Header & footer ----------
const logo = '<svg viewBox="0 0 347 422"><use href="#logo"/></svg>';
document.body.insertAdjacentHTML('afterbegin', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="logo" viewBox="0 0 347 422">
    <path fill="currentColor" d="M0 110 205 0 347 75v28l-47 27-95-45-125 62v133l33 27v76L0 320z"/>
    <path fill="currentColor" d="M128 170 180 138l47 32v150l78-40 42 23v30L180 422l-52-29z"/>
  </symbol>
</svg>
<header id="header">
  <div class="container nav">
    <a href="index.html" class="brand">${logo}CORESTONE</a>
    <nav class="nav-links">
      ${NAV.map(([h, t]) => `<a href="${h}" class="${h.startsWith(page) && page ? 'active' : ''}">${t}</a>`).join('')}
    </nav>
    <a href="${COMPANY.phoneHref}" class="nav-phone">${COMPANY.phone}</a>
    <a href="calculator.html" class="btn btn-primary btn-sm">Рассчитать стоимость</a>
    <button class="burger" id="burger" aria-label="Меню"><span></span><span></span><span></span></button>
  </div>
</header>`);

document.body.insertAdjacentHTML('beforeend', `
<footer>
  <div class="container">
    <div class="foot">
      <div>
        <a href="index.html" class="brand">${logo}CORESTONE</a>
        <p class="about">Строим надёжные частные дома под ключ с гарантией 15 лет.</p>
      </div>
      <div>
        <h4>Навигация</h4>
        <a href="index.html">Главная</a>
        ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
      </div>
      <div>
        <h4>Контакты</h4>
        <a href="${COMPANY.phoneHref}">${COMPANY.phone}</a>
        <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>
        <li>${COMPANY.hours}</li>
      </div>
      <div>
        <h4>Офис</h4>
        <li>${COMPANY.address}</li>
      </div>
    </div>
    <div class="copy"><span>© ${new Date().getFullYear()} Corestone. Все права защищены.</span><span>Политика конфиденциальности</span></div>
  </div>
</footer>
<div class="snackbar" id="snackbar" role="status"></div>`);

const header = $('#header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
$('#burger').onclick = () => header.classList.toggle('open');
$$('.nav-links a').forEach(a => a.onclick = () => header.classList.remove('open'));

// ---------- Toast ----------
function toast(msg) {
  const s = $('#snackbar');
  s.textContent = msg;
  s.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => s.classList.remove('show'), 3500);
}

// ---------- Projects ----------
const img = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=75`;
const projects = [
  { name: 'Проект «Норд»',    area: 142, floors: 1, type: 'barn', price: 6.9,  img: img('1600585154340-be6161a56a0c') },
  { name: 'Проект «Сканди»',  area: 186, floors: 2, type: '2',    price: 8.4,  img: img('1613490493576-7fde63acd811') },
  { name: 'Проект «Лайт»',    area: 98,  floors: 1, type: '1',    price: 4.2,  img: img('1512917774080-9991f1c4c750') },
  { name: 'Проект «Терра»',   area: 224, floors: 2, type: '2',    price: 10.8, img: img('1600607687939-ce8a6c25118c') },
  { name: 'Проект «Форест»',  area: 120, floors: 1, type: 'barn', price: 5.6,  img: img('1564013799919-ab600027ffc6') },
  { name: 'Проект «Престиж»', area: 310, floors: 2, type: '2',    price: 14.9, img: img('1580587771525-78b9dba3b914') },
];
const projectCard = p => `
  <article class="project reveal" data-type="${p.type}" data-floors="${p.floors}">
    <div class="project-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()"></div>
    <div class="project-body">
      <h3>${p.name}</h3>
      <div class="tags">
        <span class="tag">${p.area} м²</span>
        <span class="tag">${p.floors} ${p.floors === 1 ? 'этаж' : 'этажа'}</span>
        ${p.type === 'barn' ? '<span class="tag">Барнхаус</span>' : ''}
      </div>
      <div class="project-foot">
        <div class="price"><small>под ключ от</small><b>${p.price.toLocaleString('ru-RU')} млн ₽</b></div>
        <a href="calculator.html" class="round-btn" aria-label="Рассчитать ${p.name}"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></a>
      </div>
    </div>
  </article>`;

const list = $('#projectList');
if (list) {
  list.innerHTML = projects.slice(0, +(list.dataset.limit || projects.length)).map(projectCard).join('');
  const filters = $('#filters');
  if (filters) filters.onclick = e => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    $$('.filter').forEach(b => b.classList.toggle('active', b === btn));
    const f = btn.dataset.f;
    $$('.project', list).forEach(el => {
      const show = f === 'all' || (f === 'barn' ? el.dataset.type === 'barn' : el.dataset.floors === f);
      el.classList.toggle('hidden', !show);
    });
  };
}

// ---------- Calculator ----------
const area = $('#area');
if (area) {
  const fmt = n => Math.round(n / 10000) * 10000;
  const val = name => +$(`.seg[data-name="${name}"] .active`).dataset.v;
  const calc = () => {
    const perM = val('material') * val('floors') * val('pack');
    $('#areaOut').textContent = area.value + ' м²';
    $('#total').textContent = fmt(perM * area.value).toLocaleString('ru-RU') + ' ₽';
    $('#perM').textContent = '≈ ' + (Math.round(perM / 100) * 100).toLocaleString('ru-RU') + ' ₽ / м²';
  };
  area.oninput = calc;
  $$('.seg').forEach(seg => seg.onclick = e => {
    const b = e.target.closest('button');
    if (!b) return;
    $$('button', seg).forEach(x => x.classList.toggle('active', x === b));
    calc();
  });
  calc();
}

// ---------- Forms (пока без сервера — только подтверждение) ----------
$$('form[data-lead]').forEach(form => form.onsubmit = e => {
  e.preventDefault();
  if (!form.name.value.trim() || form.phone.value.replace(/\D/g, '').length < 10) {
    toast('Укажите имя и корректный номер телефона');
    return;
  }
  form.reset();
  toast('Спасибо! Мы свяжемся с вами в ближайшее время');
});

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .1 });
$$('.reveal').forEach(el => io.observe(el));
