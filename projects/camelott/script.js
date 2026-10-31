/* CAMELOTT — interactions */
(() => {
  "use strict";

  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const img = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

  /* ---------- Data ---------- */
  const MENU = [
    { id: "starters", label: "Starters", items: [
      { name: "Lady of the Lake", desc: "Cured trout, beetroot, horseradish cream, lake-cress oil", price: 24, img: "1467003909585-2f8a72700288" },
      { name: "Merlin's Garden", desc: "Heirloom vegetables, whipped goat curd, honey from the Abbey", price: 19, img: "1512621776951-a57141f2eefd", tags: ["Vegetarian"] },
      { name: "Avalon Crudo", desc: "Raw Highland salmon, yuzu, cultured cream, oscietra caviar", price: 28, img: "1599084993091-1cb5c0721cc6" },
      { name: "Harvest Velouté", desc: "Roasted pumpkin and saffron, toasted seeds, sage brown butter", price: 21, img: "1547592166-23ac45744acd" },
    ]},
    { id: "mains", label: "Main Courses", items: [
      { name: "Knight's Ribeye", desc: "Dry-aged 45 days, bone marrow crust, smoked shallot jus", price: 62, img: "1600891964092-4316c288032e" },
      { name: "Lancelot's Ribs", desc: "Beef short rib smoked over oak for 14 hours, bone-marrow glaze, pickled shallot", price: 54, img: "1544025162-d76694265947" },
      { name: "The Fisher King", desc: "Wild salmon fillet, crushed herb potatoes, lemon beurre blanc", price: 48, img: "1519708227418-c8fd9a32b7a2" },
      { name: "Pendragon Pork", desc: "Heritage pork chop, caramelised apples, sage, cider jus", price: 46, img: "1432139555190-58524dae6a55" },
    ]},
    { id: "signature", label: "Signature Dishes", items: [
      { name: "Excalibur Tenderloin", desc: "Dry-aged beef fillet, bone-marrow crust, Madeira and truffle — carved tableside", price: 89, img: "1529692236671-f1f6cf9683ba", tags: ["Crown", "For two"] },
      { name: "The Round Table Feast", desc: "A shared banquet of roasts, breads and garden dishes, brought to the centre of the table", price: 145, img: "1424847651672-bf20a4b0982b", tags: ["Crown", "For four"] },
      { name: "Grail of the Sea", desc: "Grilled tiger prawns and langoustines, champagne butter, sea herbs", price: 98, img: "1559737558-2f5a35f4523b", tags: ["Crown"] },
      { name: "Morgana's Cod", desc: "Miso-glazed black cod, wilted greens, smoked dashi", price: 58, img: "1580959375944-abd7e991f971" },
    ]},
    { id: "desserts", label: "Desserts", items: [
      { name: "Guinevere's Rose", desc: "Rose-water panna cotta, macerated strawberries, white chocolate", price: 18, img: "1488477181946-6428a0291777" },
      { name: "The Golden Apple", desc: "Spiced apple cake, butter crumble, calvados cream, gold leaf", price: 17, img: "1568571780765-9276ac8b75a2" },
      { name: "Black Knight", desc: "70% chocolate fondant cake, smoked salt, morello cherry", price: 16, img: "1606313564200-e75d5e30476c" },
      { name: "Tart of Avalon", desc: "Wild berry lattice tart, honey from the Abbey, clotted cream", price: 15, img: "1464305795204-6f5bbfc7fb81" },
    ]},
    { id: "drinks", label: "Drinks", items: [
      { name: "Excalibur", desc: "Aged gin, elderflower, lemon, edible gold dust", price: 19, img: "1514362545857-3bc16c4c7d1b", tags: ["Signature"] },
      { name: "Elixir of Merlin", desc: "Gin, cucumber, basil, elderflower tonic, a breath of lime", price: 21, img: "1551538827-9c037cb4f32a" },
      { name: "The Holy Grail", desc: "Single malt aged 18 years, poured tableside over a hand-carved ice sphere", price: 26, img: "1470337458703-46ad1756a187" },
      { name: "Cellar Selection", desc: "Sommelier's choice from 1,200 labels — by the glass or bottle", price: 16, img: "1510812431401-41d2bd2722f3", tags: ["From"] },
    ]},
  ];

  const SPECIALS = [
    { num: "I", short: "Excalibur", name: "Excalibur Tenderloin",
      desc: "Prime beef fillet dry-aged for forty days, seared over oak embers and drawn from the fire like a blade from the stone. Carved tableside by the chef and finished with Madeira and black truffle.",
      img: "1529692236671-f1f6cf9683ba", price: "€89", serves: "Two guests", time: "45 min" },
    { num: "II", short: "The Grail", name: "Grail of the Sea",
      desc: "Tiger prawns and langoustines grilled over vine cuttings, crowned with champagne butter and caviar, served over smoking seaweed — an offering from the lake.",
      img: "1559737558-2f5a35f4523b", price: "€98", serves: "One guest", time: "30 min" },
    { num: "III", short: "The Feast", name: "The Round Table Feast",
      desc: "A banquet for the whole table: applewood roasts, hearth-baked bread, garden dishes and four sauces of the realm, shared as the knights once did — no head, no foot, only fellowship.",
      img: "1424847651672-bf20a4b0982b", price: "€145", serves: "Four guests", time: "Pre-order" },
  ];

  /* ---------- Language (EN / RU) ---------- */
  const I18N = window.CAMELOTT_I18N;
  let lang = "";
  try { lang = localStorage.getItem("camelott_lang") || ""; } catch (_) { /* storage unavailable */ }
  if (lang !== "en" && lang !== "ru") lang = (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en";
  const t = (key) => I18N.ui[lang][key];
  const dishText = (d) => (lang === "ru" && I18N.menu.dishes[d.name]) || [d.name, d.desc];
  const special = (i) => (lang === "ru" ? { ...SPECIALS[i], ...I18N.specials[i] } : SPECIALS[i]);
  const langListeners = [];

  // Static text: remember every text node / attribute that has a Russian version
  const norm = (v) => v.replace(/\s+/g, " ").trim();
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    const key = norm(n.nodeValue);
    if (!I18N.text[key]) continue;
    const lead = n.nodeValue.match(/^\s*/)[0];
    const trail = n.nodeValue.match(/\s*$/)[0];
    textNodes.push({ n, en: n.nodeValue, ru: lead + I18N.text[key] + trail });
  }
  const attrNodes = [];
  document.querySelectorAll("[aria-label], [placeholder], [alt], meta[name='description']").forEach((el) => {
    ["aria-label", "placeholder", "alt", "content"].forEach((a) => {
      const v = el.getAttribute(a);
      if (v && I18N.attrs[v]) attrNodes.push({ el, a, en: v, ru: I18N.attrs[v] });
    });
  });

  const langBtn = document.getElementById("langToggle");
  const applyLang = (next) => {
    lang = next;
    document.documentElement.lang = lang;
    document.title = I18N.title[lang];
    textNodes.forEach((x) => { x.n.nodeValue = x[lang]; });
    attrNodes.forEach((x) => x.el.setAttribute(x.a, x[lang]));
    langBtn.setAttribute("aria-label", t("switchTo"));
    try { localStorage.setItem("camelott_lang", lang); } catch (_) { /* storage unavailable */ }
    langListeners.forEach((fn) => fn());
  };
  langBtn.addEventListener("click", () => applyLang(lang === "en" ? "ru" : "en"));

  /* ---------- Preloader ---------- */
  const done = () => document.body.classList.add("is-loaded");
  window.addEventListener("load", () => setTimeout(done, reduceMotion ? 0 : 900));
  setTimeout(done, 3500);

  /* ---------- Hero letters ---------- */
  const letters = document.querySelector(".hero__letters");
  if (letters) {
    const word = letters.textContent;
    letters.textContent = "";
    [...word].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.animationDelay = `${1.1 + i * 0.08}s`;
      letters.appendChild(s);
    });
  }

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const burger = document.querySelector(".nav__burger");
  const mobileMenu = document.getElementById("mobileMenu");
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const menuOpen = mobileMenu.classList.contains("is-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > 500 && y > lastY);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "closeMenu" : "openMenu"));
    document.body.classList.toggle("is-locked", open);
  };
  burger.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  const labelBurger = () => burger.setAttribute("aria-label", t(mobileMenu.classList.contains("is-open") ? "closeMenu" : "openMenu"));
  labelBurger();
  langListeners.push(labelBurger);

  // Active section highlight
  const navLinks = [...document.querySelectorAll(".nav__links a")];
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => sectionObs.observe(s));

  /* ---------- Hero parallax ---------- */
  const heroImg = document.querySelector(".hero__media img");
  const heroContent = document.querySelector(".hero__content");
  if (!reduceMotion && heroImg) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.translate = `0 ${y * 0.25}px`;
        heroContent.style.transform = `translateY(${y * 0.15}px)`;
        heroContent.style.opacity = String(1 - y / (window.innerHeight * 0.85));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  const observeReveal = (root = document) => root.querySelectorAll(".reveal:not(.is-in)").forEach((el, i) => {
    el.style.transitionDelay = el.closest(".gallery, .contacts__grid, .pillars") ? `${(i % 4) * 0.1}s` : "";
    revealObs.observe(el);
  });
  observeReveal();

  /* ---------- Menu ---------- */
  const tabs = document.querySelector(".menu__tabs");
  const indicator = tabs.querySelector(".menu__indicator");
  const panel = document.getElementById("menuPanel");

  const renderDishes = (cat) => {
    const tagLabel = (tag) => t("tags")[tag] || tag;
    panel.innerHTML = cat.items.map((d, i) => {
      const [name, desc] = dishText(d);
      const tags = (d.tags || []).filter((tag) => tag !== "From");
      return `
      <article class="dish" style="animation-delay:${i * 0.08}s">
        <figure class="arch dish__img"><img src="${img(d.img, 320)}" alt="${name}" loading="lazy" /></figure>
        <div class="dish__body">
          <div class="dish__head">
            <h3 class="dish__name">${name}</h3>
            <span class="dish__dots" aria-hidden="true"></span>
            <span class="dish__price">${d.tags && d.tags.includes("From") ? t("from") : ""}€${d.price}</span>
          </div>
          <p class="dish__desc">${desc}</p>
          ${tags.length ? `<div class="dish__tags">${tags.map((tag) => `<span class="tag ${tag === "Crown" ? "tag--crown" : ""}">${tagLabel(tag)}</span>`).join("")}</div>` : ""}
        </div>
      </article>`;
    }).join("");
    panel.setAttribute("aria-labelledby", `tab-${cat.id}`);
  };

  const moveIndicator = (btn) => {
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
  };

  MENU.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "menu__tab";
    b.type = "button";
    b.id = `tab-${cat.id}`;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "menuPanel");
    b.setAttribute("aria-selected", i === 0 ? "true" : "false");
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener("click", () => selectTab(i));
    tabs.appendChild(b);
  });
  const tabBtns = [...tabs.querySelectorAll(".menu__tab")];
  const currentTab = () => tabBtns.findIndex((b) => b.getAttribute("aria-selected") === "true");
  const labelTabs = () => tabBtns.forEach((b, i) => { b.textContent = lang === "ru" ? I18N.menu.categories[MENU[i].id] : MENU[i].label; });
  labelTabs();
  langListeners.push(() => {
    labelTabs();
    renderDishes(MENU[currentTab()]);
    moveIndicator(tabBtns[currentTab()]);
    document.fonts && document.fonts.ready.then(() => moveIndicator(tabBtns[currentTab()]));
  });

  function selectTab(i, focus = false) {
    tabBtns.forEach((b, j) => { b.setAttribute("aria-selected", String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    moveIndicator(tabBtns[i]);
    tabBtns[i].scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
    if (focus) tabBtns[i].focus();
    renderDishes(MENU[i]);
  }
  tabs.addEventListener("keydown", (e) => {
    const cur = tabBtns.findIndex((b) => b.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight") selectTab((cur + 1) % tabBtns.length, true);
    if (e.key === "ArrowLeft") selectTab((cur - 1 + tabBtns.length) % tabBtns.length, true);
  });
  renderDishes(MENU[0]);
  requestAnimationFrame(() => moveIndicator(tabBtns[0]));
  window.addEventListener("resize", () => moveIndicator(tabBtns.find((b) => b.getAttribute("aria-selected") === "true")));
  document.fonts && document.fonts.ready.then(() => moveIndicator(tabBtns.find((b) => b.getAttribute("aria-selected") === "true")));

  /* ---------- Chef's special ---------- */
  const chefList = document.querySelector(".chef__list");
  const chefImg = document.getElementById("chefImg");
  const chefNum = document.getElementById("chefNum");
  const chefDetail = document.getElementById("chefDetail");
  let chefIdx = 0, chefTimer;

  SPECIALS.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chef__pick";
    b.setAttribute("role", "tab");
    b.addEventListener("click", () => { showSpecial(i); restartChef(); });
    chefList.appendChild(b);
  });
  const chefBtns = [...chefList.children];
  const labelChef = () => chefBtns.forEach((b, i) => { b.innerHTML = `<b>${SPECIALS[i].num}</b>${special(i).short}`; });
  labelChef();

  const renderChefDetail = () => {
    const s = special(chefIdx);
    chefImg.alt = s.name;
    chefDetail.innerHTML = `
      <p class="eyebrow">${t("signature")} · ${s.num}</p>
      <h3 class="chef__name">${s.name}</h3>
      <p>${s.desc}</p>
      <div class="chef__meta">
        <div><span>${t("price")}</span><strong>${s.price}</strong></div>
        <div><span>${t("serves")}</span><strong>${s.serves}</strong></div>
        <div><span>${t("prep")}</span><strong>${s.time}</strong></div>
      </div>`;
  };
  langListeners.push(labelChef, renderChefDetail);

  function showSpecial(i, initial = false) {
    chefIdx = i;
    const s = SPECIALS[i];
    chefBtns.forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
    const apply = () => {
      const reveal = () => chefImg.classList.remove("is-swap");
      chefImg.onload = reveal;
      chefImg.onerror = reveal;
      chefImg.src = img(s.img, 1000);
      chefImg.alt = special(chefIdx).name;
      chefNum.textContent = s.num;
      if (chefImg.complete) reveal();
    };
    if (initial) apply(); else { chefImg.classList.add("is-swap"); setTimeout(apply, 350); }
    renderChefDetail();
  }
  const restartChef = () => {
    clearInterval(chefTimer);
    if (!reduceMotion) chefTimer = setInterval(() => showSpecial((chefIdx + 1) % SPECIALS.length), 7000);
  };
  showSpecial(0, true);
  restartChef();
  document.getElementById("chef").addEventListener("mouseenter", () => clearInterval(chefTimer));
  document.getElementById("chef").addEventListener("mouseleave", restartChef);

  /* ---------- Gallery lightbox ---------- */
  const items = [...document.querySelectorAll(".gallery .g")];
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  let lbIdx = 0, lastFocus;

  const showLb = (i) => {
    lbIdx = (i + items.length) % items.length;
    const src = items[lbIdx].querySelector("img");
    lbImg.src = src.src.replace(/w=\d+/, "w=1800");
    lbImg.alt = src.alt;
    lbCap.textContent = items[lbIdx].querySelector(".g__cap").textContent;
  };
  const openLb = (i) => {
    lastFocus = document.activeElement;
    showLb(i);
    lb.hidden = false;
    document.body.classList.add("is-locked");
    lb.querySelector(".lightbox__close").focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.classList.remove("is-locked");
    lastFocus && lastFocus.focus();
  };
  items.forEach((el, i) => el.addEventListener("click", () => openLb(i)));
  lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
  lb.querySelector(".lightbox__prev").addEventListener("click", () => showLb(lbIdx - 1));
  lb.querySelector(".lightbox__next").addEventListener("click", () => showLb(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) setMenu(false);
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
  });

  /* ---------- Reservation form ---------- */
  const form = document.getElementById("reserveForm");
  const dateIn = document.getElementById("f-date");
  const timeIn = document.getElementById("f-time");
  const guestsOut = document.getElementById("guestsOut");
  const guestsIn = document.getElementById("f-guests");
  const guestsHint = document.getElementById("guestsHint");
  const success = document.getElementById("reserveSuccess");
  const btn = document.getElementById("reserveBtn");

  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date();
  const maxDate = new Date(); maxDate.setDate(today.getDate() + 60);
  dateIn.min = toISO(today);
  dateIn.max = toISO(maxDate);

  const SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];
  const fillTimes = () => {
    const keep = timeIn.value;
    const isToday = dateIn.value === toISO(new Date());
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes() + 60;
    const day = dateIn.value ? new Date(dateIn.value + "T12:00").getDay() : null;
    timeIn.innerHTML = `<option value="">${t(day === 1 ? "closedMon" : "selectTime")}</option>`;
    if (day === 1) return;
    SLOTS.forEach((t) => {
      const [h, m] = t.split(":").map(Number);
      if (isToday && h * 60 + m < nowMin) return;
      if (day === 0 && h >= 21) return; // Sunday closes earlier
      const o = document.createElement("option");
      o.value = o.textContent = t;
      timeIn.appendChild(o);
    });
    if ([...timeIn.options].some((o) => o.value === keep)) timeIn.value = keep;
  };
  dateIn.addEventListener("change", () => { fillTimes(); validateField(dateIn); });
  fillTimes();

  let guests = 2;
  const setGuests = (n) => {
    guests = Math.max(1, Math.min(12, n));
    guestsOut.textContent = guests;
    guestsIn.value = guests;
    guestsHint.textContent = t("guests")(guests);
    form.querySelector('[data-step="-1"]').disabled = guests === 1;
    form.querySelector('[data-step="1"]').disabled = guests === 12;
  };
  form.querySelectorAll(".stepper__btn").forEach((b) => b.addEventListener("click", () => setGuests(guests + Number(b.dataset.step))));
  setGuests(2);

  const rules = {
    name: (v) => v.trim().length >= 2 || t("errName"),
    date: (v) => {
      if (!v) return t("errDate");
      if (v < dateIn.min || v > dateIn.max) return t("errRange");
      if (new Date(v + "T12:00").getDay() === 1) return t("errMonday");
      return true;
    },
    time: (v) => !!v || t("errTime"),
    phone: (v) => /^[+()\d\s-]{7,20}$/.test(v.trim()) || t("errPhone"),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || t("errEmail"),
  };
  function validateField(el) {
    const rule = rules[el.name];
    if (!rule) return true;
    const res = rule(el.value);
    const field = el.closest(".field");
    const err = field.querySelector(".field__err");
    const ok = res === true;
    field.classList.toggle("is-invalid", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    err.textContent = ok ? "" : res;
    return ok;
  }
  form.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("blur", () => el.value && validateField(el));
    el.addEventListener("input", () => el.closest(".field").classList.contains("is-invalid") && validateField(el));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll("input[name], select[name]")].filter((el) => rules[el.name]);
    const results = fields.map(validateField);
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }

    btn.classList.add("is-loading");
    btn.querySelector(".btn__label").textContent = t("sealing");
    const data = Object.fromEntries(new FormData(form));
    const code = "CMT-" + Math.random().toString(36).slice(2, 6).toUpperCase();

    setTimeout(() => {
      try {
        const all = JSON.parse(localStorage.getItem("camelott_reservations") || "[]");
        all.push({ ...data, code, createdAt: new Date().toISOString() });
        localStorage.setItem("camelott_reservations", JSON.stringify(all));
      } catch (_) { /* storage unavailable */ }

      booking = data;
      renderSuccess();
      document.getElementById("successCode").textContent = code;
      form.hidden = true;
      success.hidden = false;
      btn.classList.remove("is-loading");
      btn.querySelector(".btn__label").textContent = t("confirm");
    }, 1400);
  });

  let booking = null;
  const renderSuccess = () => {
    if (!booking) return;
    const d = new Date(booking.date + "T12:00").toLocaleDateString(t("locale"), { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("successText").textContent = t("success")(booking.name.trim().split(" ")[0], Number(booking.guests), d, booking.time);
  };
  langListeners.push(() => {
    fillTimes();
    setGuests(guests);
    if (!btn.classList.contains("is-loading")) btn.querySelector(".btn__label").textContent = t("confirm");
    form.querySelectorAll(".field.is-invalid input, .field.is-invalid select").forEach(validateField);
    renderSuccess();
    document.querySelector(".newsletter__msg").textContent = "";
  });
  document.getElementById("reserveAgain").addEventListener("click", () => {
    form.reset(); setGuests(2); fillTimes(); booking = null;
    success.hidden = true; form.hidden = false;
    form.querySelector("input").focus();
  });

  /* ---------- Newsletter ---------- */
  const nl = document.getElementById("newsletter");
  nl.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = nl.querySelector("input");
    const msg = nl.querySelector(".newsletter__msg");
    if (rules.email(input.value) !== true) { msg.textContent = t("nlErr"); return; }
    msg.textContent = t("nlOk");
    input.value = "";
  });

  /* ---------- Cursor ---------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cursor.classList.add("is-on"); });
    document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));
    document.addEventListener("mouseover", (e) => {
      cursor.classList.toggle("is-hover", !!e.target.closest("a, button, .g, input, select, textarea"));
    });
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Image fallback ---------- */
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t.tagName === "IMG" && !t.dataset.fallback) {
      t.dataset.fallback = "1";
      t.style.opacity = "0";
    }
  }, true);

  // Apply the saved/browser language once every component has registered its listener
  applyLang(lang);
})();
