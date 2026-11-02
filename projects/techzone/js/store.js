/* TECHZONE — persistent state (cart, favorites, orders, profile) */
(function () {
  const { PRODUCTS, PROMO_CODES } = window.TZ_DATA;
  const KEY = 'techzone:v1';
  const FREE_SHIP_FROM = 50000;

  const defaults = () => ({
    cart: [],
    favorites: [],
    orders: [],
    promo: null,
    profile: { name: '', email: '', phone: '', city: 'Москва', address: '', notifyEmail: true, notifySms: false, notifyPush: true },
    subscribed: false,
    userReviews: [],
    messages: []
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const data = JSON.parse(raw);
      return Object.assign(defaults(), data, { profile: Object.assign(defaults().profile, data.profile) });
    } catch (e) {
      return defaults();
    }
  }

  let state = load();
  const listeners = new Set();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
    listeners.forEach(fn => fn(state));
  }

  const byId = id => PRODUCTS.find(p => p.id === id);
  const lineKey = (id, color, config) => `${id}|${color}|${config}`;

  function unitPrice(product, configName) {
    const cfg = product.configs.find(c => c.name === configName) || product.configs[0];
    return product.price + (cfg ? cfg.delta : 0);
  }

  const Store = {
    FREE_SHIP_FROM,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get state() { return state; },
    byId,
    unitPrice,

    /* ----- Cart ----- */
    addToCart(id, opts = {}) {
      const p = byId(id);
      if (!p) return null;
      const color = opts.color || p.colors[0].name;
      const config = opts.config || p.configs[0].name;
      const qty = Math.max(1, opts.qty || 1);
      const key = lineKey(id, color, config);
      const line = state.cart.find(l => l.key === key);
      if (line) line.qty = Math.min(line.qty + qty, 10);
      else state.cart.push({ key, id, color, config, qty: Math.min(qty, 10) });
      save();
      return p;
    },
    setQty(key, qty) {
      const line = state.cart.find(l => l.key === key);
      if (!line) return;
      if (qty <= 0) return Store.removeLine(key);
      line.qty = Math.min(qty, 10);
      save();
    },
    removeLine(key) {
      state.cart = state.cart.filter(l => l.key !== key);
      save();
    },
    clearCart() { state.cart = []; state.promo = null; save(); },
    cartCount() { return state.cart.reduce((s, l) => s + l.qty, 0); },
    cartLines() {
      return state.cart.map(l => {
        const p = byId(l.id);
        if (!p) return null;
        const unit = unitPrice(p, l.config);
        const cfg = p.configs.find(c => c.name === l.config);
        const oldUnit = p.oldPrice ? p.oldPrice + (cfg ? cfg.delta : 0) : null;
        return Object.assign({}, l, { product: p, unit, oldUnit, total: unit * l.qty });
      }).filter(Boolean);
    },
    totals(shippingCost) {
      const lines = Store.cartLines();
      const subtotal = lines.reduce((s, l) => s + l.total, 0);
      const saved = lines.reduce((s, l) => s + (l.oldUnit ? (l.oldUnit - l.unit) * l.qty : 0), 0);
      let discount = 0;
      const promo = state.promo && PROMO_CODES[state.promo];
      if (promo && subtotal > 0) discount = promo.type === 'pct' ? Math.round(subtotal * promo.value / 100) : Math.min(promo.value, subtotal);
      const shipping = typeof shippingCost === 'number' ? shippingCost : 0;
      return { subtotal, saved, discount, shipping, total: Math.max(0, subtotal - discount + shipping), count: Store.cartCount(), promo };
    },
    applyPromo(code) {
      const c = String(code || '').trim().toUpperCase();
      if (!PROMO_CODES[c]) return false;
      state.promo = c;
      save();
      return PROMO_CODES[c];
    },
    removePromo() { state.promo = null; save(); },

    /* ----- Favorites ----- */
    isFav(id) { return state.favorites.includes(id); },
    toggleFav(id) {
      const on = !state.favorites.includes(id);
      state.favorites = on ? [id].concat(state.favorites) : state.favorites.filter(f => f !== id);
      save();
      return on;
    },
    favProducts() { return state.favorites.map(byId).filter(Boolean); },

    /* ----- Orders ----- */
    placeOrder(details) {
      const t = Store.totals(details.shippingCost);
      const order = {
        id: 'TZ-' + String(Date.now()).slice(-7),
        date: new Date().toISOString(),
        status: 'Принят',
        items: Store.cartLines().map(l => ({ id: l.id, name: l.product.name, color: l.color, config: l.config, qty: l.qty, unit: l.unit, thumb: l.product.thumb })),
        totals: t,
        customer: { name: details.name, phone: details.phone, email: details.email },
        delivery: details.delivery,
        address: details.address,
        payment: details.payment,
        comment: details.comment
      };
      state.orders.unshift(order);
      state.cart = [];
      state.promo = null;
      // remember contact data for next time
      state.profile = Object.assign(state.profile, {
        name: state.profile.name || details.name,
        phone: state.profile.phone || details.phone,
        email: state.profile.email || details.email
      });
      save();
      return order;
    },
    order(id) { return state.orders.find(o => o.id === id); },

    /* ----- Profile ----- */
    updateProfile(patch) { state.profile = Object.assign({}, state.profile, patch); save(); },
    setSubscribed(email) { state.subscribed = email; save(); },
    addReview(r) { state.userReviews.unshift(Object.assign({ date: new Date().toISOString() }, r)); save(); },
    addMessage(m) { state.messages.unshift(Object.assign({ date: new Date().toISOString() }, m)); save(); },

    resetAll() { state = defaults(); save(); }
  };

  window.TZ_STORE = Store;
})();
