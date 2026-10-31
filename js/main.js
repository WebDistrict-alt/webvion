/* ==========================================================================
   WEBVION STUDIO — interactions
   ========================================================================== */

const CONFIG = {
  email: "timofejtitov484@gmail.com",
  // Paste a Formspree / Getform endpoint here to receive messages directly,
  // e.g. "https://formspree.io/f/xxxxxxx". Empty = opens the visitor's mail app.
  formEndpoint: "",
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
// Re-assigned below when the custom cursor is enabled
let bindCursorTargets = () => {};

/* --------------------------------------------------------------------------
   Reveal on scroll
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
const observeReveal = (el) => revealObserver.observe(el);
$$(".reveal").forEach(observeReveal);

/* --------------------------------------------------------------------------
   Portfolio — rendering & filtering
   -------------------------------------------------------------------------- */
const projects = window.PROJECTS || [];
const grid = $("#projects-grid");
const filtersEl = $("#filters");
let activeFilter = "All";

const ARROW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const escapeHTML = (str = "") =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Editorial rhythm: wide+narrow, narrow+wide, full — repeats every 5 cards.
// A card that would end up alone in its row is stretched to full width.
function layoutFor(count) {
  const pattern = ["wide", "narrow", "narrow", "wide", "full"];
  const sizes = Array.from({ length: count }, (_, i) => pattern[i % 5]);
  const rest = count % 5;
  if (rest === 1 || rest === 3) sizes[count - 1] = "full";
  return sizes;
}

function cardHTML(p, index, size) {
  const num = String(index + 1).padStart(2, "0");
  const tags = (p.tags || []).map((t) => `<span>${escapeHTML(t)}</span>`).join("");
  const offset = size === "narrow" && index % 5 === 1 ? " data-offset" : "";
  return `
    <article class="card" data-size="${size}"${offset}>
      <a class="card__media" href="${escapeHTML(p.url)}" target="_blank" rel="noopener"
         aria-label="Open ${escapeHTML(p.title)} live website" data-cursor="view">
        <div class="card__bar" aria-hidden="true">
          <span class="card__dots"><i></i><i></i><i></i></span>
          <span class="card__url">${escapeHTML(p.domain || p.url)}</span>
        </div>
        <img class="card__img" src="${escapeHTML(p.image)}" alt="Homepage of ${escapeHTML(p.title)} website"
             loading="${index < 2 ? "eager" : "lazy"}" decoding="async" width="1440" height="1000">
        <span class="card__shade" aria-hidden="true"></span>
        <span class="card__view" aria-hidden="true">View<br>project</span>
        <span class="card__tags" aria-hidden="true">${tags}</span>
      </a>
      <div class="card__body">
        <span class="card__index">${num}</span>
        <div class="card__head">
          <p class="card__meta">
            <span class="card__cat">${escapeHTML(p.category)}</span><i></i><span>${escapeHTML(p.year || "")}</span>
          </p>
          <h3 class="card__title">${escapeHTML(p.title)}</h3>
        </div>
        <a class="card__link" href="${escapeHTML(p.url)}" target="_blank" rel="noopener">
          View project ${ARROW_SVG}
        </a>
        <p class="card__desc">${escapeHTML(p.description)}</p>
      </div>
    </article>`;
}

function renderProjects() {
  const list = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const sizes = layoutFor(list.length);

  grid.innerHTML = list.length
    ? list.map((p, i) => cardHTML(p, i, sizes[i])).join("")
    : '<p class="grid__empty">No projects in this category yet.</p>';

  const cards = $$(".card", grid);
  cards.forEach((card, i) => {
    if (prefersReducedMotion) return card.classList.add("is-in");
    card.style.transitionDelay = `${Math.min(i, 4) * 90}ms`;
    cardObserver.observe(card);
  });
  bindCursorTargets(grid);
}

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      // Clear the stagger so hover transitions aren't delayed later.
      setTimeout(() => (entry.target.style.transitionDelay = ""), 900);
      cardObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.08 }
);

function renderFilters() {
  const counts = projects.reduce((acc, p) => ((acc[p.category] = (acc[p.category] || 0) + 1), acc), {});
  const categories = ["All", ...Object.keys(counts)];
  filtersEl.innerHTML = categories
    .map((cat) => {
      const n = cat === "All" ? projects.length : counts[cat];
      const active = cat === activeFilter;
      return `<button class="filter${active ? " is-active" : ""}" role="tab" aria-selected="${active}"
                data-filter="${escapeHTML(cat)}">${escapeHTML(cat)}<sup>${n}</sup></button>`;
    })
    .join("");
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn || btn.dataset.filter === activeFilter) return;
  activeFilter = btn.dataset.filter;

  $$(".filter", filtersEl).forEach((b) => {
    const on = b === btn;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on);
  });

  if (prefersReducedMotion) return renderProjects();
  $$(".card", grid).forEach((c) => c.classList.add("is-out"));
  setTimeout(renderProjects, 300);
});

const pad = (n) => String(n).padStart(2, "0");
$("#project-count").textContent = `(${pad(projects.length)})`;
$("#stat-projects").textContent = pad(projects.length);
renderFilters();
renderProjects();

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
const nav = $("#nav");
const burger = $("#burger");
const mobileMenu = $("#mobile-menu");
let lastY = window.scrollY;

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const menuOpen = document.body.classList.contains("menu-open");
    nav.classList.toggle("is-hidden", !menuOpen && y > lastY && y > 400);
    lastY = y;
  },
  { passive: true }
);

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.setAttribute("aria-hidden", !open);
}
burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$$("a", mobileMenu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Highlight the nav link of the section in view
const navLinks = $$(".nav__links a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

/* --------------------------------------------------------------------------
   Services → prefill the contact form
   -------------------------------------------------------------------------- */
$$(".service").forEach((link) => {
  link.addEventListener("click", () => {
    const details = $("#f-details");
    if (!details.value.trim()) {
      details.value = `Hi! I'm interested in: ${link.dataset.service}.\n\nAbout my project: `;
    }
    setTimeout(() => details.focus({ preventScroll: true }), 700);
  });
});

/* --------------------------------------------------------------------------
   Contact form
   -------------------------------------------------------------------------- */
const form = $("#contact-form");
const statusEl = $("#form-status");
const submitBtn = $("#f-submit");

const validators = {
  name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email."),
  details: (v) => (v.trim().length >= 10 ? "" : "Tell me a little more (at least 10 characters)."),
};

function validateField(input) {
  const message = validators[input.name](input.value);
  input.closest(".field").classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", Boolean(message));
  $(`#${input.id}-err`).textContent = message;
  return !message;
}

$$("input, textarea", form).forEach((input) => {
  input.addEventListener("blur", () => input.value && validateField(input));
  input.addEventListener("input", () => input.closest(".field").classList.contains("is-invalid") && validateField(input));
});

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = `form__status${type ? ` is-${type}` : ""}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputs = $$("input, textarea", form);
  const valid = inputs.map(validateField).every(Boolean);
  if (!valid) {
    inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const btnText = $(".btn__text", submitBtn);
  submitBtn.disabled = true;
  btnText.textContent = "Sending…";

  try {
    if (CONFIG.formEndpoint) {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("Thank you! Your message is on its way — I'll reply within 24 hours.", "success");
    } else {
      const subject = encodeURIComponent(`New project inquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.details}\n\n— ${data.name}\n${data.email}`);
      window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
      setStatus("Your mail app is opening with the message ready to send.", "success");
    }
    form.reset();
  } catch (err) {
    setStatus(`Something went wrong. Please email me directly at ${CONFIG.email}.`, "error");
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "Send message";
  }
});

/* --------------------------------------------------------------------------
   Custom cursor & magnetic buttons (fine pointers only)
   -------------------------------------------------------------------------- */
const cursor = $(".cursor");

if (finePointer && !prefersReducedMotion) {
  document.documentElement.classList.add("has-cursor");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;

  window.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => cursor.classList.remove("is-hidden"));

  (function loop() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();

  bindCursorTargets = (root = document) => {
    $$("[data-cursor='view']", root).forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-view"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-view"));
    });
    $$("a:not([data-cursor]), button", root).forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-link"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-link"));
    });
  };
  bindCursorTargets();

  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.25;
      const dy = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = ""));
  });
}

/* --------------------------------------------------------------------------
   Hero — 3D particle sphere (canvas 2D, no libraries)
   -------------------------------------------------------------------------- */
(function heroSphere() {
  const canvas = $("#hero-canvas");
  const ctx = canvas.getContext("2d");
  const COUNT = innerWidth < 700 ? 900 : 1800;
  const points = [];
  let w, h, dpr, radius, centerX, centerY;
  let rotX = 0.4, rotY = 0, targetMX = 0, targetMY = 0, mx = 0, my = 0;
  let running = true, t = 0;

  // Even distribution on a sphere (Fibonacci lattice)
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const yy = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - yy * yy);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * r, y: yy, z: Math.sin(theta) * r, seed: Math.random() * Math.PI * 2 });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mobile = w < 860;
    radius = Math.min(w, h) * (mobile ? 0.42 : 0.36);
    centerX = mobile ? w * 0.6 : w * 0.72;
    centerY = mobile ? h * 0.3 : h * 0.42;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    mx += (targetMX - mx) * 0.04;
    my += (targetMY - my) * 0.04;
    rotY += 0.0022;
    const ay = rotY + mx * 0.6;
    const ax = rotX + my * 0.4;
    const cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
    const fov = 2.6;

    for (const p of points) {
      // Organic "breathing" deformation along the normal
      const wave = 1 + 0.14 * Math.sin(p.y * 4 + t * 1.4 + p.seed * 0.15) * Math.cos(p.x * 3 - t);
      let x = p.x * wave, y = p.y * wave, z = p.z * wave;

      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = fov / (fov + z2);
      const sx = centerX + x1 * radius * scale;
      const sy = centerY + y1 * radius * scale;
      const depth = (1 - z2) / 2; // 0 = back, 1 = front
      const size = 0.6 + depth * 1.6;

      // Front-most points glow in the accent colour
      if (depth > 0.86) ctx.fillStyle = `rgba(198, 255, 61, ${0.35 + depth * 0.6})`;
      else ctx.fillStyle = `rgba(244, 244, 242, ${0.06 + depth * 0.5})`;
      ctx.fillRect(sx, sy, size, size);
    }
    t += 0.012;
  }

  function loop() {
    if (running) draw();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "pointermove",
    (e) => {
      targetMX = (e.clientX / innerWidth - 0.5) * 2;
      targetMY = (e.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  if (prefersReducedMotion) {
    draw();
    return;
  }
  // Pause rendering when the hero is off-screen
  new IntersectionObserver(([entry]) => (running = entry.isIntersecting)).observe(canvas);
  loop();
})();

/* --------------------------------------------------------------------------
   Misc
   -------------------------------------------------------------------------- */
$("#year").textContent = new Date().getFullYear();

const timeEl = $("#local-time");
const updateTime = () => {
  timeEl.textContent = `Local time — ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
};
updateTime();
setInterval(updateTime, 30000);

// Kick off the hero headline reveal once fonts are ready (avoids a reflow mid-animation)
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() =>
  requestAnimationFrame(() => document.body.classList.add("is-loaded"))
);
