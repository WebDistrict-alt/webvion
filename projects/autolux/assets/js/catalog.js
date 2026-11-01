/* AutoLux — каталог: фильтры, сортировка, синхронизация с URL */
(function () {
  const AL = window.AL;
  const { B, L } = AL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MLN = 1e6;
  const BODY_KEYS = Object.keys(AL.BODIES);

  const prices = AL.CARS.map((c) => c.price / MLN);
  const P_MIN = Math.floor(Math.min(...prices));
  const P_MAX = Math.ceil(Math.max(...prices) / 10) * 10;
  const years = AL.CARS.map((c) => c.year);
  const Y_MIN = Math.min(...years), Y_MAX = Math.max(...years);
  // Нелинейная шкала цены: в начале диапазона точнее, гиперкары — в хвосте
  const STEPS = 200;
  const toPrice = (s) => Math.round(P_MIN + (P_MAX - P_MIN) * Math.pow(s / STEPS, 3));
  const toStep = (p) => Math.round(STEPS * Math.cbrt((p - P_MIN) / (P_MAX - P_MIN)));

  const state = { brands: [], bodies: [], pMin: P_MIN, pMax: P_MAX, yFrom: Y_MIN, yTo: Y_MAX, sort: 'popular' };

  // --- чтение URL ---
  const q = new URLSearchParams(location.search);
  if (q.get('brand')) state.brands = q.get('brand').split(',').filter((b) => AL.BRANDS.includes(b));
  if (q.get('body')) state.bodies = q.get('body').split(',').filter((b) => BODY_KEYS.includes(b));
  if (q.get('pmin')) state.pMin = Math.max(P_MIN, +q.get('pmin') || P_MIN);
  if (q.get('pmax')) state.pMax = Math.min(P_MAX, +q.get('pmax') || P_MAX);
  if (q.get('yfrom')) state.yFrom = +q.get('yfrom') || Y_MIN;
  if (q.get('yto')) state.yTo = +q.get('yto') || Y_MAX;
  if (q.get('sort')) state.sort = q.get('sort');

  // --- контролы ---
  const count = (key, val) => AL.CARS.filter((c) => c[key] === val).length;
  $('#f-brand').innerHTML = AL.BRANDS.map((b) => `<button type="button" class="chip" data-brand="${b}" aria-pressed="false">${b} <sup>${count('brand', b)}</sup></button>`).join('');
  $('#f-body').innerHTML = BODY_KEYS.map((k) => `<button type="button" class="chip" data-body="${k}" aria-pressed="false">${L(AL.BODIES[k])} <sup>${count('body', k)}</sup></button>`).join('');
  const yFrom = $('#f-year-from'), yTo = $('#f-year-to'), sort = $('#f-sort');
  const rMin = $('#f-price [data-min]'), rMax = $('#f-price [data-max]');
  [rMin, rMax].forEach((r) => { r.min = 0; r.max = STEPS; r.step = 1; });

  const yearOptions = (sel, pre, disabled) => Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => Y_MIN + i)
    .map((y) => `<option value="${y}"${y === sel ? ' selected' : ''}${disabled(y) ? ' disabled' : ''} data-text-ru="${pre[0]} ${y}" data-text-en="${pre[1]} ${y}">${AL.tx(pre[0], pre[1])} ${y}</option>`).join('');

  function syncControls() {
    $$('#f-brand .chip').forEach((c) => c.setAttribute('aria-pressed', state.brands.includes(c.dataset.brand)));
    $$('#f-body .chip').forEach((c) => c.setAttribute('aria-pressed', state.bodies.includes(c.dataset.body)));
    yFrom.innerHTML = yearOptions(state.yFrom, ['от', 'from'], (y) => y > state.yTo);
    yTo.innerHTML = yearOptions(state.yTo, ['до', 'to'], (y) => y < state.yFrom);
    sort.value = state.sort;
    rMin.value = toStep(state.pMin); rMax.value = toStep(state.pMax);
    paintRange();
  }

  function paintRange() {
    const a = (+rMin.value / STEPS) * 100, b = (+rMax.value / STEPS) * 100;
    const fill = $('#f-price .range__fill');
    fill.style.left = a + '%'; fill.style.width = b - a + '%';
    $('#price-min').innerHTML = B('от ', 'from ') + toPrice(+rMin.value) + B(' млн', 'M');
    $('#price-max').innerHTML = B('до ', 'to ') + toPrice(+rMax.value) + B(' млн', 'M');
  }

  // --- фильтрация ---
  const SORTS = {
    popular: (a, b) => AL.CARS.indexOf(a) - AL.CARS.indexOf(b),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    new: (a, b) => b.year - a.year || a.mileage - b.mileage,
    power: (a, b) => b.power - a.power,
    mileage: (a, b) => a.mileage - b.mileage
  };

  function apply(writeUrl = true) {
    const list = AL.CARS.filter((c) =>
      (!state.brands.length || state.brands.includes(c.brand)) &&
      (!state.bodies.length || state.bodies.includes(c.body)) &&
      c.price / MLN >= state.pMin && c.price / MLN <= state.pMax &&
      c.year >= state.yFrom && c.year <= state.yTo
    ).sort(SORTS[state.sort] || SORTS.popular);

    $('#grid').innerHTML = list.map((c, i) => AL.cardHTML(c, i)).join('');
    $('#empty').hidden = list.length > 0;
    $('#count').textContent = list.length;
    $('[data-count-btn]').textContent = `(${list.length})`;

    const tags = [
      ...state.brands.map((b) => ['brand', b, b]),
      ...state.bodies.map((b) => ['body', b, L(AL.BODIES[b])]),
      ...(state.pMin > P_MIN || state.pMax < P_MAX ? [['price', '', `${state.pMin}–${state.pMax} ${B('млн ₽', 'M ₽')}`]] : []),
      ...(state.yFrom > Y_MIN || state.yTo < Y_MAX ? [['year', '', `${state.yFrom}–${state.yTo}`]] : [])
    ];
    $('#active').innerHTML = tags.map(([k, v, t]) => `<button type="button" data-remove="${k}" data-val="${v}">${t} <span aria-hidden="true">✕</span></button>`).join('');

    if (writeUrl) {
      const p = new URLSearchParams();
      if (state.brands.length) p.set('brand', state.brands.join(','));
      if (state.bodies.length) p.set('body', state.bodies.join(','));
      if (state.pMin > P_MIN) p.set('pmin', state.pMin);
      if (state.pMax < P_MAX) p.set('pmax', state.pMax);
      if (state.yFrom > Y_MIN) p.set('yfrom', state.yFrom);
      if (state.yTo < Y_MAX) p.set('yto', state.yTo);
      if (state.sort !== 'popular') p.set('sort', state.sort);
      history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
    }
  }

  const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  // --- события ---
  $('#f-brand').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; state.brands = toggleIn(state.brands, c.dataset.brand); syncControls(); apply(); });
  $('#f-body').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; state.bodies = toggleIn(state.bodies, c.dataset.body); syncControls(); apply(); });
  [rMin, rMax].forEach((r) => r.addEventListener('input', (e) => {
    if (+rMin.value > +rMax.value - 4) { if (e.target === rMin) rMin.value = +rMax.value - 4; else rMax.value = +rMin.value + 4; }
    paintRange();
    state.pMin = toPrice(+rMin.value); state.pMax = toPrice(+rMax.value);
    apply();
  }));
  yFrom.addEventListener('change', () => { state.yFrom = +yFrom.value; syncControls(); apply(); });
  yTo.addEventListener('change', () => { state.yTo = +yTo.value; syncControls(); apply(); });
  sort.addEventListener('change', () => { state.sort = sort.value; apply(); });

  const reset = () => {
    Object.assign(state, { brands: [], bodies: [], pMin: P_MIN, pMax: P_MAX, yFrom: Y_MIN, yTo: Y_MAX });
    syncControls(); apply();
  };
  $$('[data-reset]').forEach((b) => b.addEventListener('click', reset));
  $('#active').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]'); if (!b) return;
    const k = b.dataset.remove, v = b.dataset.val;
    if (k === 'brand') state.brands = state.brands.filter((x) => x !== v);
    if (k === 'body') state.bodies = state.bodies.filter((x) => x !== v);
    if (k === 'price') { state.pMin = P_MIN; state.pMax = P_MAX; }
    if (k === 'year') { state.yFrom = Y_MIN; state.yTo = Y_MAX; }
    syncControls(); apply();
  });

  // Мобильная панель фильтров
  const panel = $('#filters'), scrim = $('.filters-scrim');
  const openPanel = (open) => { panel.classList.toggle('is-open', open); scrim.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
  $('[data-filters-open]').addEventListener('click', () => openPanel(true));
  $$('[data-filters-close]').forEach((b) => b.addEventListener('click', () => openPanel(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') openPanel(false); });

  syncControls();
  apply(false);
})();
