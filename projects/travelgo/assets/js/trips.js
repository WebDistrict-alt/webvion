/* Demo trip generator shared by AI Planner and Trip Builder */

const INTERESTS = {
  food: { label: 'Food', icon: 'utensils', items: [['Local market breakfast', 'Taste what locals eat before work', 1.5, 18], ['Cooking class with a local chef', 'Hands-on, three dishes, recipes to take home', 3, 70], ['Street-food night walk', 'Six stops with a local guide', 2.5, 45], ['Dinner at a top-rated local spot', 'Book a day ahead', 2, 55]] },
  culture: { label: 'Culture', icon: 'ticket', items: [['National history museum', 'Start with the permanent collection', 2.5, 20], ['Old town walking tour', 'Free tour, tip the guide', 2, 10], ['Evening performance', 'Traditional music or theatre', 2, 40]] },
  nature: { label: 'Nature', icon: 'leaf', items: [['Sunrise viewpoint hike', 'Bring a headlamp and a layer', 3, 0], ['City park and gardens', 'Slow afternoon with a picnic', 2, 5], ['Scenic day trip outside the city', 'Train or tour, back by dinner', 7, 85]] },
  nightlife: { label: 'Nightlife', icon: 'glass', items: [['Rooftop bar at sunset', 'Arrive 30 min before sunset', 2, 35], ['Live music venue', 'Check the listings that week', 2.5, 30]] },
  shopping: { label: 'Shopping', icon: 'bookmark', items: [['Design district and concept stores', 'Independent brands and cafés', 2.5, 0], ['Night market', 'Cash is easier at smaller stalls', 2, 20]] },
  adventure: { label: 'Adventure', icon: 'mountain', items: [['Guided outdoor activity', 'Small group, gear included', 4, 90], ['Bike tour of the highlights', 'Easy pace, 15 km', 3, 45]] },
  photo: { label: 'Photography', icon: 'compass', items: [['Golden-hour photo walk', 'The best light is the hour before sunset', 1.5, 0]] },
  wellness: { label: 'Wellness', icon: 'leaf', items: [['Spa or thermal baths', 'Book a slot, bring a swimsuit', 2.5, 60], ['Morning yoga session', 'Drop-in class, mats provided', 1.5, 20]] },
};

const DEST_TIPS = {
  tokyo: ['Get a Suica card on arrival; it works on every train, bus and convenience store.', 'Most restaurants close their last order around 21:30. Eat early or head to an izakaya.'],
  bali: ['Traffic between Ubud and the coast can take 2 hours. Group your days by area.', 'Carry a sarong for temple visits; many sites lend one for a small donation.'],
  iceland: ['Check road.is and vedur.is every morning. Weather decides the route.', 'Fuel up whenever you can outside Reykjavík; stations are far apart.'],
  switzerland: ['A Swiss Travel Pass covers trains, boats, buses and museums and pays off after 3 days.', 'Mountain weather changes fast. Check the summit webcams before going up.'],
  newyork: ['Use OMNY tap-to-pay on the subway; it caps at 12 rides a week.', 'Book Top of the Rock or Summit One for sunset at least a week ahead.'],
  seoul: ['Get a T-money card and install Naver Map; Google Maps is limited in Korea.', 'Many palaces are free if you wear a hanbok.'],
  norway: ['Alcohol is sold only in Vinmonopolet shops; supermarkets stop selling beer at 20:00.', 'Ferries are part of the road network. Check the timetable on Entur.'],
  barcelona: ['Book Sagrada Família and Park Güell tickets online; they sell out days ahead.', 'Lunch menu del día is the best-value meal, usually €14–18.'],
  maldives: ['Seaplane transfers only fly in daylight. Late arrivals may need a night in Malé.', 'Bring reef-safe sunscreen; many resorts ask for it.'],
};

const TIER = { budget: { k: .7, stay: .6, label: 'Budget' }, mid: { k: 1, stay: 1, label: 'Comfort' }, luxury: { k: 1.6, stay: 2.4, label: 'Luxury' } };
const PACE = { relaxed: { n: 2, label: 'Relaxed' }, balanced: { n: 3, label: 'Balanced' }, packed: { n: 4, label: 'Packed' } };
const SLOTS = ['09:00', '12:30', '15:30', '19:00'];

function rng(seed) {
  let s = 0;
  for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const shuffle = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sightCost = (name) => { let s = 0; for (const c of name) s += c.charCodeAt(0); return [0, 15, 20, 25, 30, 40][s % 6]; };
const parseH = (t) => (/day/.test(t) ? 8 : parseFloat(t));

function generateTrip({ dest, days, travelers, tier, pace, interests, variant = 0 }) {
  const d = byId(DESTINATIONS, dest);
  const r = rng(`${dest}-${days}-${tier}-${pace}-${interests.join()}-${variant}`);
  const T = TIER[tier];
  const sights = shuffle(d.sights.map((s) => ({ name: s.n, note: s.d, hours: parseH(s.t), cost: sightCost(s.n), kind: 'sight' })), r);
  const exps = shuffle(EXPERIENCES.filter((e) => e.dest === d.id).map((e) => ({ name: e.title, note: e.desc.split('.')[0], hours: e.hours, cost: e.price, kind: 'experience', id: e.id })), r);
  const picks = (interests.length ? interests : ['culture', 'food']).flatMap((k) => INTERESTS[k].items.map(([name, note, hours, cost]) => ({ name, note, hours, cost, kind: k })));
  const generic = shuffle(picks, r);

  const pool = [];
  // interleave so sights come first, then experiences, then interest picks
  while (sights.length || exps.length || generic.length) {
    if (sights.length) pool.push(sights.shift());
    if (generic.length) pool.push(generic.shift());
    if (exps.length && r() > .3) pool.push(exps.shift());
    if (generic.length && r() > .5) pool.push(generic.shift());
  }

  const perDay = PACE[pace].n;
  const plan = [];
  let used = 0;
  for (let i = 0; i < days; i++) {
    const n = i === 0 || i === days - 1 ? Math.max(1, perDay - 1) : perDay;
    const items = [];
    for (let j = 0; j < n; j++) {
      const src = pool[used % pool.length]; used++;
      items.push({ ...src, time: SLOTS[i === 0 ? j + 1 : j] || SLOTS[3], cost: Math.round(src.cost * T.k) });
    }
    const main = items.find((x) => x.kind === 'sight' || x.kind === 'experience') || items[0];
    const title = i === 0 ? `Arrival and ${main.name}` : i === days - 1 ? `${main.name} and departure` : main.name;
    plan.push({ day: i + 1, title, items });
  }

  const stay = Math.round(d.costs.stay * T.stay) * (days - 1) * Math.ceil(travelers / 2);
  const food = Math.round(d.costs.food * T.k) * days * travelers;
  const transport = Math.round(d.costs.transport * T.k) * days * travelers;
  const activities = plan.reduce((s, p) => s + p.items.reduce((a, x) => a + x.cost, 0), 0) * travelers;
  const costs = { Stay: stay, Food: food, Transport: transport, Activities: activities };
  const total = Object.values(costs).reduce((a, b) => a + b, 0);
  const hours = plan.reduce((s, p) => s + p.items.reduce((a, x) => a + x.hours, 0), 0);

  const tips = [...DEST_TIPS[d.id],
    tier === 'budget' ? 'Eat your main meal at lunch, when set menus are cheapest.' : tier === 'luxury' ? 'Ask your hotel concierge to book restaurants; they often get tables that are sold out online.' : 'Book the two most popular sights online before you go to skip the queues.',
    pace === 'packed' ? 'Leave one evening free. A packed plan always runs late.' : 'Keep one afternoon open for whatever you discover on the way.'];

  return { id: 'trip-' + Date.now().toString(36), dest: d.id, name: `${days} days in ${d.name}`, days, travelers, tier, pace, interests, plan, costs, total, hours, tips, created: new Date().toISOString() };
}
