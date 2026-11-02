/* TECHZONE — demo catalog data */
(function () {
  const img = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

  const CATEGORIES = [
    { slug: 'smartphones', name: 'Смартфоны', icon: 'phone', desc: 'Флагманы и бестселлеры', cover: '1511707171634-5f897ff02aa9' },
    { slug: 'laptops', name: 'Ноутбуки', icon: 'laptop', desc: 'Для работы, учёбы и игр', cover: '1517336714731-489689fd1ca8' },
    { slug: 'tablets', name: 'Планшеты', icon: 'tablet', desc: 'Творчество без границ', cover: '1544244015-0df4b3ffc6b0' },
    { slug: 'headphones', name: 'Наушники', icon: 'headphones', desc: 'Звук студийного уровня', cover: '1505740420928-5e560c06d30e' },
    { slug: 'watches', name: 'Смарт-часы', icon: 'watch', desc: 'Здоровье и спорт', cover: '1546868871-7041f2a55e12' },
    { slug: 'consoles', name: 'Игровые консоли', icon: 'gamepad', desc: 'Новое поколение игр', cover: '1606144042614-b2417e99c4e3' },
    { slug: 'computers', name: 'Компьютерная техника', icon: 'monitor', desc: 'ПК, мониторы, комплектующие', cover: '1593640408182-31c70c8268f5' },
    { slug: 'accessories', name: 'Аксессуары', icon: 'plug', desc: 'Зарядки, мыши, клавиатуры', cover: '1587829741301-dc798b83add3' }
  ];

  // Extra gallery shots per category (used after the product's own photos)
  const POOL = {
    smartphones: ['1592899677977-9c10ca588bbd', '1510557880182-3d4d3cba35a5', '1598327105666-5b89351aff97', '1511707171634-5f897ff02aa9'],
    laptops: ['1496181133206-80ce9b88a853', '1541807084-5c52b6b3adef', '1525547719571-a2d4ac8945e2', '1517336714731-489689fd1ca8'],
    tablets: ['1561154464-82e9adf32764', '1585790050230-5dd28404ccb9', '1544244015-0df4b3ffc6b0'],
    headphones: ['1484704849700-f032a568e944', '1583394838336-acd977736f90', '1618366712010-f4ae9c647dcb', '1505740420928-5e560c06d30e'],
    watches: ['1579586337278-3befd40fd17a', '1523275335684-37898b6baf30', '1508685096489-7aacd43bd3b1', '1546868871-7041f2a55e12'],
    consoles: ['1486401899868-0e435ed85128', '1606144042614-b2417e99c4e3', '1612287230202-1ff1d85d1bdf'],
    computers: ['1587202372775-e229f172b9d7', '1527443224154-c4a3942d3acf', '1593640408182-31c70c8268f5'],
    accessories: ['1527864550417-7fd91fc51a46', '1587829741301-dc798b83add3', '1615526675159-e248c3021d3f']
  };

  const C = {
    black: { name: 'Чёрный', hex: '#1d1d1f' },
    white: { name: 'Белый', hex: '#f5f5f0' },
    silver: { name: 'Серебристый', hex: '#d9dadc' },
    gray: { name: 'Серый космос', hex: '#55565a' },
    blue: { name: 'Синий', hex: '#2b4a7e' },
    deepblue: { name: 'Глубокий синий', hex: '#1f2f4d' },
    titan: { name: 'Натуральный титан', hex: '#b8b0a3' },
    orange: { name: 'Космический оранжевый', hex: '#d9752f' },
    green: { name: 'Шалфей', hex: '#a8b5a0' },
    pink: { name: 'Розовый', hex: '#f2c6c8' },
    lavender: { name: 'Лавандовый', hex: '#c9c2e6' },
    midnight: { name: 'Тёмная ночь', hex: '#2c3440' },
    starlight: { name: 'Сияющая звезда', hex: '#efe6d8' },
    red: { name: 'Красный', hex: '#b5262b' }
  };

  let seq = 0;
  function P(o) {
    seq += 1;
    const own = (o.img || []).map(i => img(i));
    const extra = POOL[o.cat].filter(id => !(o.img || []).includes(id)).map(i => img(i));
    return Object.assign({
      id: o.slug,
      oldPrice: null,
      badge: null,
      colors: [C.black],
      configs: [{ name: 'Стандарт', delta: 0 }],
      stock: 12,
      features: []
    }, o, {
      order: seq,
      images: own.concat(extra).slice(0, 4),
      thumb: img((o.img && o.img[0]) || POOL[o.cat][0], 600)
    });
  }

  const PRODUCTS = [
    /* ---------- Смартфоны ---------- */
    P({
      slug: 'iphone-17-pro-max', cat: 'smartphones', brand: 'Apple', name: 'iPhone 17 Pro Max', model: 'A3257',
      price: 149990, rating: 4.9, reviews: 1284, badge: 'new', pop: 99, date: '2026-09-19', stock: 18,
      img: ['1592899677977-9c10ca588bbd'],
      short: ['6,9" ProMotion OLED 120 Гц', 'A19 Pro, 12 ГБ ОЗУ', 'Тройная камера 48 Мп, зум 8×'],
      colors: [C.orange, C.deepblue, C.silver],
      configs: [{ name: '256 ГБ', delta: 0 }, { name: '512 ГБ', delta: 25000 }, { name: '1 ТБ', delta: 50000 }, { name: '2 ТБ', delta: 85000 }],
      desc: 'iPhone 17 Pro Max — самый мощный iPhone в истории. Алюминиевый унибоди-корпус с системой парового охлаждения, чип A19 Pro и самый большой дисплей Super Retina XDR с яркостью до 3000 нит.',
      features: ['Камера Pro Fusion: три модуля по 48 Мп', 'Оптический зум 8× студийного качества', 'До 39 часов воспроизведения видео', 'Ceramic Shield 2 спереди и сзади'],
      specs: { 'Экран': { 'Диагональ': '6,9"', 'Тип': 'Super Retina XDR OLED, ProMotion', 'Разрешение': '2868 × 1320', 'Яркость': 'до 3000 нит' }, 'Производительность': { 'Процессор': 'Apple A19 Pro', 'ОЗУ': '12 ГБ' }, 'Камера': { 'Основная': '48 Мп, ƒ/1.78', 'Сверхширокоугольная': '48 Мп', 'Телефото': '48 Мп, 8× оптическое качество', 'Фронтальная': '18 Мп Center Stage' }, 'Прочее': { 'Аккумулятор': 'до 39 ч видео', 'Защита': 'IP68', 'Разъём': 'USB-C (USB 3)', 'Вес': '233 г' } }
    }),
    P({
      slug: 'iphone-17-pro', cat: 'smartphones', brand: 'Apple', name: 'iPhone 17 Pro', model: 'A3256',
      price: 129990, rating: 4.9, reviews: 962, badge: 'hit', pop: 97, date: '2026-09-19', stock: 24,
      img: ['1510557880182-3d4d3cba35a5'],
      short: ['6,3" ProMotion OLED 120 Гц', 'A19 Pro, 12 ГБ ОЗУ', 'Камера Pro Fusion 48 Мп'],
      colors: [C.deepblue, C.orange, C.silver],
      configs: [{ name: '256 ГБ', delta: 0 }, { name: '512 ГБ', delta: 25000 }, { name: '1 ТБ', delta: 50000 }],
      desc: 'Компактный Pro с той же производительностью, что и старшая модель. Новый дизайн «плато» для камер, увеличенная батарея и профессиональная запись видео ProRes RAW.',
      features: ['Запись ProRes RAW и Genlock', 'Яркость до 3000 нит', 'Быстрая зарядка 50% за 20 минут', 'Wi-Fi 7 и Bluetooth 6'],
      specs: { 'Экран': { 'Диагональ': '6,3"', 'Тип': 'Super Retina XDR OLED', 'Разрешение': '2622 × 1206' }, 'Производительность': { 'Процессор': 'Apple A19 Pro', 'ОЗУ': '12 ГБ' }, 'Камера': { 'Основная': '48 Мп', 'Телефото': '48 Мп, 4×', 'Фронтальная': '18 Мп' }, 'Прочее': { 'Аккумулятор': 'до 33 ч видео', 'Защита': 'IP68', 'Вес': '204 г' } }
    }),
    P({
      slug: 'iphone-17', cat: 'smartphones', brand: 'Apple', name: 'iPhone 17', model: 'A3258',
      price: 89990, rating: 4.8, reviews: 1530, badge: 'hit', pop: 95, date: '2026-09-19', stock: 40,
      img: ['1511707171634-5f897ff02aa9'],
      short: ['6,3" ProMotion 120 Гц', 'A19, 8 ГБ ОЗУ', 'Двойная камера 48 Мп'],
      colors: [C.lavender, C.green, C.black, C.white],
      configs: [{ name: '256 ГБ', delta: 0 }, { name: '512 ГБ', delta: 22000 }],
      desc: 'Базовый iPhone впервые получил ProMotion и Always-On дисплей. Двойная система камер 48 Мп и фронтальная камера Center Stage делают каждый кадр лучше.',
      features: ['ProMotion и Always-On впервые в базовой модели', 'Камера Center Stage 18 Мп', 'Ceramic Shield 2', 'Базовый объём 256 ГБ'],
      specs: { 'Экран': { 'Диагональ': '6,3"', 'Тип': 'Super Retina XDR OLED, 120 Гц' }, 'Производительность': { 'Процессор': 'Apple A19', 'ОЗУ': '8 ГБ' }, 'Камера': { 'Основная': '48 Мп Fusion', 'Сверхширокоугольная': '48 Мп' }, 'Прочее': { 'Аккумулятор': 'до 30 ч видео', 'Вес': '177 г' } }
    }),
    P({
      slug: 'galaxy-s26-ultra', cat: 'smartphones', brand: 'Samsung', name: 'Galaxy S26 Ultra', model: 'SM-S948B',
      price: 139990, oldPrice: 159990, rating: 4.8, reviews: 744, badge: 'sale', pop: 92, date: '2026-02-25', stock: 9,
      img: ['1598327105666-5b89351aff97'],
      short: ['6,9" Dynamic AMOLED 2X', 'Snapdragon 8 Elite Gen 5', 'Камера 200 Мп, S Pen'],
      colors: [C.titan, C.black, C.blue],
      configs: [{ name: '256 ГБ', delta: 0 }, { name: '512 ГБ', delta: 18000 }, { name: '1 ТБ', delta: 42000 }],
      desc: 'Galaxy S26 Ultra — флагман с Galaxy AI, встроенным пером S Pen и камерой 200 Мп. Титановая рама, антибликовое стекло Gorilla Armor 2 и 7 лет обновлений.',
      features: ['Galaxy AI: перевод звонков и редактирование фото', 'Антибликовое стекло Gorilla Armor 2', 'Зум до 100× Space Zoom', '7 лет обновлений ОС'],
      specs: { 'Экран': { 'Диагональ': '6,9"', 'Тип': 'Dynamic AMOLED 2X, 1–120 Гц', 'Разрешение': '3120 × 1440' }, 'Производительность': { 'Процессор': 'Snapdragon 8 Elite Gen 5 for Galaxy', 'ОЗУ': '12 ГБ' }, 'Камера': { 'Основная': '200 Мп', 'Телефото': '50 Мп 5× + 10 Мп 3×', 'Сверхширокоугольная': '50 Мп' }, 'Прочее': { 'Аккумулятор': '5000 мА·ч', 'Зарядка': '60 Вт', 'Вес': '214 г' } }
    }),
    P({
      slug: 'pixel-10-pro', cat: 'smartphones', brand: 'Google', name: 'Pixel 10 Pro', model: 'GP4BC',
      price: 99990, oldPrice: 114990, rating: 4.7, reviews: 318, badge: 'sale', pop: 80, date: '2026-08-28', stock: 6,
      img: ['1580910051074-3eb694886505'],
      short: ['6,3" Super Actua OLED', 'Google Tensor G5', 'Камера 50 Мп, зум 5×'],
      colors: [C.black, C.silver, C.green],
      configs: [{ name: '128 ГБ', delta: 0 }, { name: '256 ГБ', delta: 10000 }, { name: '512 ГБ', delta: 24000 }],
      desc: 'Pixel 10 Pro с чипом Tensor G5 и Gemini на устройстве. Лучшая в классе вычислительная фотография и чистый Android с 7 годами обновлений.',
      features: ['Gemini Nano прямо на устройстве', 'Pro Res Zoom до 100×', 'Магнитная зарядка Pixelsnap', 'Чистый Android'],
      specs: { 'Экран': { 'Диагональ': '6,3"', 'Тип': 'Super Actua LTPO OLED' }, 'Производительность': { 'Процессор': 'Google Tensor G5', 'ОЗУ': '16 ГБ' }, 'Камера': { 'Основная': '50 Мп', 'Телефото': '48 Мп 5×' }, 'Прочее': { 'Аккумулятор': '4870 мА·ч', 'Вес': '207 г' } }
    }),
    P({
      slug: 'xiaomi-15t-pro', cat: 'smartphones', brand: 'Xiaomi', name: 'Xiaomi 15T Pro', model: '2506APT9BG',
      price: 64990, rating: 4.6, reviews: 412, badge: 'new', pop: 78, date: '2026-09-25', stock: 30,
      img: ['1601784551446-20c9e07cdbdb'],
      short: ['6,83" AMOLED 144 Гц', 'Dimensity 9400+', 'Оптика Leica, 90 Вт'],
      colors: [C.black, C.gray, C.titan],
      configs: [{ name: '256 ГБ', delta: 0 }, { name: '512 ГБ', delta: 8000 }, { name: '1 ТБ', delta: 18000 }],
      desc: 'Флагман-убийца с оптикой Leica и перископом 5×. Батарея 5500 мА·ч заряжается за 35 минут, а экран 144 Гц радует плавностью.',
      features: ['Оптика Leica Summilux', 'Зарядка HyperCharge 90 Вт', 'Беспроводная зарядка 50 Вт', 'IP68'],
      specs: { 'Экран': { 'Диагональ': '6,83"', 'Тип': 'AMOLED, 144 Гц' }, 'Производительность': { 'Процессор': 'MediaTek Dimensity 9400+', 'ОЗУ': '12 ГБ' }, 'Камера': { 'Основная': '50 Мп Light Fusion 900', 'Телефото': '50 Мп 5×' }, 'Прочее': { 'Аккумулятор': '5500 мА·ч', 'Вес': '210 г' } }
    }),

    /* ---------- Ноутбуки ---------- */
    P({
      slug: 'macbook-pro-14-m5', cat: 'laptops', brand: 'Apple', name: 'MacBook Pro 14" M5', model: 'MDE04',
      price: 199990, rating: 4.9, reviews: 284, badge: 'new', pop: 96, date: '2026-10-22', stock: 11,
      img: ['1517336714731-489689fd1ca8'],
      short: ['14,2" Liquid Retina XDR', 'Apple M5, 10 ядер CPU', '16 ГБ / до 24 ч работы'],
      colors: [C.gray, C.silver],
      configs: [{ name: '16 ГБ · 512 ГБ', delta: 0 }, { name: '16 ГБ · 1 ТБ', delta: 25000 }, { name: '24 ГБ · 1 ТБ', delta: 50000 }, { name: '32 ГБ · 2 ТБ', delta: 105000 }],
      desc: 'MacBook Pro с чипом M5 — до 3,5 раза быстрее в задачах ИИ, чем M4. Нейроускорители в каждом ядре GPU, дисплей Liquid Retina XDR с нано-текстурой на выбор и до 24 часов автономности.',
      features: ['Нейроускорители в каждом ядре GPU', 'Дисплей XDR до 1600 нит в HDR', 'Три порта Thunderbolt 4, HDMI, SDXC', 'Камера Center Stage 12 Мп'],
      specs: { 'Экран': { 'Диагональ': '14,2"', 'Тип': 'Liquid Retina XDR, mini-LED, 120 Гц', 'Разрешение': '3024 × 1964' }, 'Производительность': { 'Процессор': 'Apple M5 (10 CPU / 10 GPU)', 'Оперативная память': '16 ГБ', 'Накопитель': '512 ГБ SSD' }, 'Прочее': { 'Автономность': 'до 24 ч', 'Порты': '3× Thunderbolt 4, HDMI, SDXC, MagSafe 3', 'Вес': '1,55 кг' } }
    }),
    P({
      slug: 'macbook-air-13-m4', cat: 'laptops', brand: 'Apple', name: 'MacBook Air 13" M4', model: 'MW123',
      price: 109990, oldPrice: 124990, rating: 4.9, reviews: 1176, badge: 'hit', pop: 98, date: '2026-03-12', stock: 35,
      img: ['1611186871348-b1ce696e52c9'],
      short: ['13,6" Liquid Retina', 'Apple M4, 10 ядер', '16 ГБ / 256 ГБ'],
      colors: [C.midnight, C.starlight, C.silver, { name: 'Небесно-голубой', hex: '#a9c1d9' }],
      configs: [{ name: '16 ГБ · 256 ГБ', delta: 0 }, { name: '16 ГБ · 512 ГБ', delta: 20000 }, { name: '24 ГБ · 512 ГБ', delta: 40000 }],
      desc: 'Самый популярный ноутбук в мире стал ещё быстрее. Бесшумный M4, 16 ГБ памяти в базе, поддержка двух внешних мониторов и до 18 часов работы.',
      features: ['Бесшумный — без вентилятора', 'Толщина всего 11,3 мм', 'Два внешних монитора', 'Apple Intelligence'],
      specs: { 'Экран': { 'Диагональ': '13,6"', 'Тип': 'Liquid Retina', 'Разрешение': '2560 × 1664' }, 'Производительность': { 'Процессор': 'Apple M4 (10 CPU / 8 GPU)', 'Оперативная память': '16 ГБ', 'Накопитель': '256 ГБ SSD' }, 'Прочее': { 'Автономность': 'до 18 ч', 'Вес': '1,24 кг' } }
    }),
    P({
      slug: 'rog-zephyrus-g16', cat: 'laptops', brand: 'ASUS', name: 'ROG Zephyrus G16 (2026)', model: 'GU605CX',
      price: 289990, oldPrice: 329990, rating: 4.8, reviews: 156, badge: 'sale', pop: 84, date: '2026-04-02', stock: 4,
      img: ['1603302576837-37561b2e2302'],
      short: ['16" OLED 2.5K 240 Гц', 'Core Ultra 9 285H', 'GeForce RTX 5080, 32 ГБ'],
      colors: [C.gray, C.white],
      configs: [{ name: 'RTX 5070 Ti · 1 ТБ', delta: -40000 }, { name: 'RTX 5080 · 2 ТБ', delta: 0 }, { name: 'RTX 5090 · 2 ТБ', delta: 70000 }],
      desc: 'Игровой ноутбук в алюминиевом корпусе толщиной 1,49 см. OLED-дисплей ROG Nebula с откликом 0,2 мс и видеокарта RTX 50-й серии с DLSS 4.',
      features: ['OLED ROG Nebula 240 Гц', 'DLSS 4 Multi Frame Generation', 'Подсветка Slash Lighting', 'Корпус из алюминия CNC'],
      specs: { 'Экран': { 'Диагональ': '16"', 'Тип': 'OLED, 240 Гц, 0,2 мс', 'Разрешение': '2560 × 1600' }, 'Производительность': { 'Процессор': 'Intel Core Ultra 9 285H', 'Видеокарта': 'NVIDIA GeForce RTX 5080 16 ГБ', 'Оперативная память': '32 ГБ LPDDR5X', 'Накопитель': '2 ТБ SSD' }, 'Прочее': { 'Аккумулятор': '90 Вт·ч', 'Вес': '1,95 кг' } }
    }),
    P({
      slug: 'thinkpad-x1-carbon-g13', cat: 'laptops', brand: 'Lenovo', name: 'ThinkPad X1 Carbon Gen 13', model: '21NS',
      price: 214990, rating: 4.7, reviews: 89, pop: 70, date: '2026-01-15', stock: 7,
      img: ['1588872657578-7efd1f1555ed'],
      short: ['14" 2.8K OLED', 'Core Ultra 7 268V', '32 ГБ / 1 ТБ, 986 г'],
      colors: [C.black],
      configs: [{ name: '32 ГБ · 1 ТБ', delta: 0 }, { name: '32 ГБ · 2 ТБ', delta: 22000 }],
      desc: 'Легендарный бизнес-ноутбук весом менее килограмма. Корпус из углеволокна, лучшая в классе клавиатура и защита корпоративного уровня.',
      features: ['Вес 986 граммов', 'Корпус из углеродного волокна', 'Copilot+ PC', 'Сертификация MIL-STD-810H'],
      specs: { 'Экран': { 'Диагональ': '14"', 'Тип': 'OLED, 120 Гц', 'Разрешение': '2880 × 1800' }, 'Производительность': { 'Процессор': 'Intel Core Ultra 7 268V', 'Оперативная память': '32 ГБ', 'Накопитель': '1 ТБ SSD' }, 'Прочее': { 'Автономность': 'до 20 ч', 'Вес': '0,99 кг' } }
    }),
    P({
      slug: 'dell-xps-14', cat: 'laptops', brand: 'Dell', name: 'XPS 14', model: '9440',
      price: 179990, rating: 4.6, reviews: 132, pop: 68, date: '2025-11-20', stock: 10,
      img: ['1496181133206-80ce9b88a853'],
      short: ['14,5" 3.2K OLED сенсорный', 'Core Ultra 7 155H', 'RTX 4050, 32 ГБ'],
      colors: [C.gray, C.silver],
      configs: [{ name: '32 ГБ · 1 ТБ', delta: 0 }, { name: '64 ГБ · 2 ТБ', delta: 45000 }],
      desc: 'Безрамочный дизайн, стеклянный тачпад без границ и сенсорный OLED-экран. Для креативных профессионалов, которым важна мобильность.',
      features: ['Стеклянный бесшовный тачпад', 'OLED InfinityEdge', 'Сенсорный ряд функций', 'Thunderbolt 4'],
      specs: { 'Экран': { 'Диагональ': '14,5"', 'Тип': 'OLED, сенсорный', 'Разрешение': '3200 × 2000' }, 'Производительность': { 'Процессор': 'Intel Core Ultra 7 155H', 'Видеокарта': 'GeForce RTX 4050', 'Оперативная память': '32 ГБ' }, 'Прочее': { 'Вес': '1,68 кг' } }
    }),

    /* ---------- Планшеты ---------- */
    P({
      slug: 'ipad-pro-13-m5', cat: 'tablets', brand: 'Apple', name: 'iPad Pro 13" M5', model: 'MDA14',
      price: 154990, rating: 4.9, reviews: 211, badge: 'new', pop: 90, date: '2026-10-22', stock: 14,
      img: ['1544244015-0df4b3ffc6b0'],
      short: ['13" Ultra Retina XDR Tandem OLED', 'Apple M5', 'Толщина 5,1 мм'],
      colors: [C.gray, C.silver],
      configs: [{ name: '256 ГБ · Wi-Fi', delta: 0 }, { name: '512 ГБ · Wi-Fi', delta: 25000 }, { name: '1 ТБ · Wi-Fi + Cellular', delta: 80000 }],
      desc: 'Самое тонкое устройство Apple с чипом M5 и двухслойным OLED-экраном. Поддержка Apple Pencil Pro и Magic Keyboard превращает iPad в полноценную рабочую станцию.',
      features: ['Tandem OLED до 1600 нит HDR', 'Apple Pencil Pro', 'Быстрая зарядка 50% за 30 мин', 'Wi-Fi 7 (чип N1)'],
      specs: { 'Экран': { 'Диагональ': '13"', 'Тип': 'Ultra Retina XDR, Tandem OLED, 120 Гц' }, 'Производительность': { 'Процессор': 'Apple M5', 'ОЗУ': '12 ГБ' }, 'Прочее': { 'Толщина': '5,1 мм', 'Вес': '579 г', 'Разъём': 'Thunderbolt / USB 4' } }
    }),
    P({
      slug: 'ipad-air-11-m3', cat: 'tablets', brand: 'Apple', name: 'iPad Air 11" M3', model: 'MC9X4',
      price: 64990, oldPrice: 72990, rating: 4.8, reviews: 640, badge: 'hit', pop: 91, date: '2026-03-12', stock: 22,
      img: ['1561154464-82e9adf32764'],
      short: ['11" Liquid Retina', 'Apple M3', 'Поддержка Apple Pencil Pro'],
      colors: [{ name: 'Голубой', hex: '#a5bfd6' }, C.lavender, C.starlight, C.gray],
      configs: [{ name: '128 ГБ', delta: 0 }, { name: '256 ГБ', delta: 12000 }, { name: '512 ГБ', delta: 30000 }],
      desc: 'Сила M3 в лёгком и тонком корпусе. Идеален для учёбы, рисования и творчества — с новой клавиатурой Magic Keyboard для iPad Air.',
      features: ['Чип M3 с аппаратной трассировкой лучей', 'Apple Intelligence', 'Камера Landscape 12 Мп', 'Touch ID'],
      specs: { 'Экран': { 'Диагональ': '11"', 'Тип': 'Liquid Retina IPS' }, 'Производительность': { 'Процессор': 'Apple M3', 'ОЗУ': '8 ГБ' }, 'Прочее': { 'Вес': '460 г', 'Автономность': 'до 10 ч' } }
    }),
    P({
      slug: 'galaxy-tab-s11-ultra', cat: 'tablets', brand: 'Samsung', name: 'Galaxy Tab S11 Ultra', model: 'SM-X930',
      price: 119990, rating: 4.7, reviews: 97, badge: 'new', pop: 75, date: '2026-09-04', stock: 8,
      img: ['1585790050230-5dd28404ccb9'],
      short: ['14,6" Dynamic AMOLED 2X', 'Dimensity 9400+', 'S Pen в комплекте'],
      colors: [C.gray, C.silver],
      configs: [{ name: '12 ГБ · 256 ГБ', delta: 0 }, { name: '12 ГБ · 512 ГБ', delta: 14000 }, { name: '16 ГБ · 1 ТБ', delta: 38000 }],
      desc: 'Огромный 14,6-дюймовый AMOLED в корпусе толщиной 5,1 мм. Перо S Pen в комплекте, режим DeX и Galaxy AI для работы и творчества.',
      features: ['S Pen в комплекте', 'Режим Samsung DeX', 'Защита IP68', 'Четыре динамика AKG'],
      specs: { 'Экран': { 'Диагональ': '14,6"', 'Тип': 'Dynamic AMOLED 2X, 120 Гц' }, 'Производительность': { 'Процессор': 'MediaTek Dimensity 9400+', 'ОЗУ': '12 ГБ' }, 'Прочее': { 'Аккумулятор': '11600 мА·ч', 'Вес': '692 г' } }
    }),
    P({
      slug: 'xiaomi-pad-7-pro', cat: 'tablets', brand: 'Xiaomi', name: 'Xiaomi Pad 7 Pro', model: '2410CRP4CG',
      price: 44990, oldPrice: 52990, rating: 4.6, reviews: 205, badge: 'sale', pop: 72, date: '2026-01-10', stock: 25,
      img: ['1527698266440-12104e498b76'],
      short: ['11,2" 3.2K 144 Гц', 'Snapdragon 8s Gen 3', '8 ГБ / 256 ГБ'],
      colors: [C.gray, C.green, C.blue],
      configs: [{ name: '8 ГБ · 256 ГБ', delta: 0 }, { name: '12 ГБ · 512 ГБ', delta: 9000 }],
      desc: 'Мощный Android-планшет с экраном 3.2K и частотой 144 Гц. Отличный выбор для игр, кино и учёбы.',
      features: ['Экран 3.2K 144 Гц', 'Зарядка 67 Вт', 'HyperOS 2', 'Четыре динамика Dolby Atmos'],
      specs: { 'Экран': { 'Диагональ': '11,2"', 'Тип': 'LCD 144 Гц' }, 'Производительность': { 'Процессор': 'Snapdragon 8s Gen 3', 'ОЗУ': '8 ГБ' }, 'Прочее': { 'Аккумулятор': '8850 мА·ч', 'Вес': '500 г' } }
    }),
    P({
      slug: 'ipad-mini-a17', cat: 'tablets', brand: 'Apple', name: 'iPad mini (A17 Pro)', model: 'MXN73',
      price: 54990, rating: 4.7, reviews: 388, pop: 74, date: '2025-10-23', stock: 16,
      img: ['1589739900243-4b52cd9b104e'],
      short: ['8,3" Liquid Retina', 'A17 Pro', 'Apple Pencil Pro'],
      colors: [C.gray, C.starlight, { name: 'Фиолетовый', hex: '#b9a7d6' }, { name: 'Голубой', hex: '#a5bfd6' }],
      configs: [{ name: '128 ГБ', delta: 0 }, { name: '256 ГБ', delta: 12000 }, { name: '512 ГБ', delta: 30000 }],
      desc: 'Целый мир в одной руке. Компактный iPad с чипом A17 Pro для Apple Intelligence и поддержкой Apple Pencil Pro.',
      features: ['Помещается в карман пальто', 'A17 Pro с поддержкой ИИ', 'USB-C до 10 Гбит/с', 'Touch ID'],
      specs: { 'Экран': { 'Диагональ': '8,3"', 'Тип': 'Liquid Retina' }, 'Производительность': { 'Процессор': 'Apple A17 Pro', 'ОЗУ': '8 ГБ' }, 'Прочее': { 'Вес': '293 г' } }
    }),

    /* ---------- Наушники ---------- */
    P({
      slug: 'airpods-pro-3', cat: 'headphones', brand: 'Apple', name: 'AirPods Pro 3', model: 'MFHP4',
      price: 27990, rating: 4.8, reviews: 2104, badge: 'new', pop: 99, date: '2026-09-19', stock: 60,
      img: ['1606220588913-b3aacb4d2f46'],
      short: ['Активное шумоподавление 2×', 'Датчик пульса', 'До 8 ч работы'],
      colors: [C.white],
      desc: 'AirPods Pro 3 с вдвое более эффективным шумоподавлением, датчиком пульса для тренировок и функцией живого перевода. Новые амбушюры из пены для идеальной посадки.',
      features: ['Шумоподавление вдвое лучше AirPods Pro 2', 'Пульсометр для фитнеса', 'Живой перевод разговора', 'Защита IP57'],
      specs: { 'Звук': { 'Шумоподавление': 'Активное, адаптивное', 'Пространственное аудио': 'Да, с отслеживанием головы' }, 'Автономность': { 'Наушники': 'до 8 ч (ANC)', 'С кейсом': 'до 24 ч' }, 'Прочее': { 'Чип': 'Apple H2', 'Защита': 'IP57', 'Зарядка': 'USB-C, MagSafe, Qi2' } }
    }),
    P({
      slug: 'sony-wh-1000xm6', cat: 'headphones', brand: 'Sony', name: 'WH-1000XM6', model: 'WH1000XM6',
      price: 39990, oldPrice: 46990, rating: 4.9, reviews: 812, badge: 'hit', pop: 94, date: '2026-05-15', stock: 19,
      img: ['1618366712010-f4ae9c647dcb'],
      short: ['Лучшее шумоподавление Sony', '12 микрофонов, QN3', 'До 30 ч работы'],
      colors: [C.black, C.silver, { name: 'Полуночно-синий', hex: '#2f3a4f' }],
      desc: 'Шестое поколение легендарных наушников. Процессор QN3 в 7 раз быстрее предшественника, 12 микрофонов и складная конструкция с магнитным кейсом.',
      features: ['Процессор шумоподавления QN3', 'Звук, настроенный с мастеринг-инженерами', 'Складная конструкция', 'Hi-Res Audio Wireless'],
      specs: { 'Звук': { 'Драйверы': '30 мм', 'Кодеки': 'LDAC, AAC, SBC, LC3' }, 'Автономность': { 'С ANC': 'до 30 ч', 'Быстрая зарядка': '3 мин = 3 ч' }, 'Прочее': { 'Вес': '254 г', 'Bluetooth': '5.3' } }
    }),
    P({
      slug: 'airpods-max-usb-c', cat: 'headphones', brand: 'Apple', name: 'AirPods Max', model: 'MWW43',
      price: 59990, rating: 4.7, reviews: 530, pop: 82, date: '2025-09-20', stock: 12,
      img: ['1484704849700-f032a568e944'],
      short: ['Hi-Fi звук, ANC', 'Lossless через USB-C', 'До 20 ч работы'],
      colors: [C.midnight, C.starlight, { name: 'Синий', hex: '#7b97c6' }, { name: 'Оранжевый', hex: '#f0a672' }, { name: 'Фиолетовый', hex: '#b7a6d8' }],
      desc: 'Полноразмерные наушники Apple с вычислительным звуком. Корпус из алюминия, амбушюры из пены с эффектом памяти и lossless-звук по проводу USB-C.',
      features: ['Lossless-аудио 24 бит / 48 кГц по USB-C', 'Персональное пространственное аудио', 'Цифровая коронка', 'Режим прозрачности'],
      specs: { 'Звук': { 'Драйверы': '40 мм, Apple', 'Шумоподавление': 'Активное' }, 'Автономность': { 'Работа': 'до 20 ч' }, 'Прочее': { 'Вес': '385 г', 'Разъём': 'USB-C' } }
    }),
    P({
      slug: 'bose-qc-ultra', cat: 'headphones', brand: 'Bose', name: 'QuietComfort Ultra Headphones', model: '880066',
      price: 37990, oldPrice: 44990, rating: 4.7, reviews: 344, badge: 'sale', pop: 77, date: '2025-12-01', stock: 5,
      img: ['1505740420928-5e560c06d30e'],
      short: ['Иммерсивный звук Bose', 'Технология CustomTune', 'До 24 ч работы'],
      colors: [C.black, { name: 'Белый дым', hex: '#e8e4dc' }, { name: 'Лунный камень', hex: '#8a96a8' }],
      desc: 'Флагман Bose с иммерсивным звуком и шумоподавлением мирового класса. Премиальные материалы и удобство на весь день.',
      features: ['Bose Immersive Audio', 'CustomTune — подстройка под уши', 'Режим Aware', 'Мультиподключение'],
      specs: { 'Звук': { 'Шумоподавление': 'Активное, CustomTune', 'Кодеки': 'aptX Adaptive, AAC, SBC' }, 'Автономность': { 'Работа': 'до 24 ч' }, 'Прочее': { 'Вес': '250 г' } }
    }),
    P({
      slug: 'galaxy-buds-3-pro', cat: 'headphones', brand: 'Samsung', name: 'Galaxy Buds3 Pro', model: 'SM-R630',
      price: 19990, rating: 4.5, reviews: 690, pop: 73, date: '2025-07-24', stock: 33,
      img: ['1600294037681-c80b4cb5b434'],
      short: ['Двухполосные динамики', 'Адаптивный ANC', 'Galaxy AI перевод'],
      colors: [C.silver, C.white],
      desc: 'TWS-наушники с двухполосными динамиками и светящейся «лезвийной» подсветкой. Galaxy AI переводит разговор в реальном времени.',
      features: ['Двухполосная акустика', 'Адаптивный шумодав', 'Звук 24 бит Hi-Fi', 'IP57'],
      specs: { 'Звук': { 'Динамики': '10,5 мм + планарный твитер', 'Шумоподавление': 'Адаптивное' }, 'Автономность': { 'Наушники': 'до 6 ч', 'С кейсом': 'до 26 ч' }, 'Прочее': { 'Защита': 'IP57' } }
    }),

    /* ---------- Смарт-часы ---------- */
    P({
      slug: 'apple-watch-series-11', cat: 'watches', brand: 'Apple', name: 'Apple Watch Series 11', model: 'MEU34',
      price: 44990, rating: 4.8, reviews: 702, badge: 'new', pop: 93, date: '2026-09-19', stock: 27,
      img: ['1579586337278-3befd40fd17a'],
      short: ['Always-On Retina, Ion-X', 'Уведомления о гипертонии', 'До 24 ч работы'],
      colors: [C.midnight, C.silver, { name: 'Розовое золото', hex: '#e7c2b0' }],
      configs: [{ name: '42 мм', delta: 0 }, { name: '46 мм', delta: 3000 }, { name: '46 мм · LTE', delta: 12000 }],
      desc: 'Самые тонкие Apple Watch с уведомлениями о гипертонии, оценкой сна и 5G. Прочное стекло Ion-X стало вдвое устойчивее к царапинам.',
      features: ['Уведомления о гипертонии', 'Оценка качества сна', 'Стекло в 2 раза прочнее', '24 часа автономности'],
      specs: { 'Экран': { 'Тип': 'Always-On LTPO3 OLED', 'Яркость': 'до 2000 нит' }, 'Здоровье': { 'Датчики': 'ЭКГ, SpO₂, температура, пульс' }, 'Прочее': { 'Защита': 'WR50, IP6X', 'Автономность': 'до 24 ч' } }
    }),
    P({
      slug: 'apple-watch-ultra-3', cat: 'watches', brand: 'Apple', name: 'Apple Watch Ultra 3', model: 'MF0T4',
      price: 89990, rating: 4.9, reviews: 288, badge: 'hit', pop: 88, date: '2026-09-19', stock: 9,
      img: ['1546868871-7041f2a55e12'],
      short: ['49 мм титан', 'Спутниковая связь SOS', 'До 42 ч работы'],
      colors: [C.titan, C.black],
      configs: [{ name: 'Ремешок Trail', delta: 0 }, { name: 'Ремешок Ocean', delta: 0 }, { name: 'Титановый браслет', delta: 18000 }],
      desc: 'Самые выносливые Apple Watch с самым большим экраном, экстренной спутниковой связью и двухчастотным GPS. Созданы для приключений.',
      features: ['Экстренные сообщения через спутник', 'Двухчастотный GPS L1 + L5', 'До 72 ч в режиме энергосбережения', 'Сирена 86 дБ'],
      specs: { 'Экран': { 'Размер': '49 мм', 'Тип': 'LTPO3 OLED широкоугольный', 'Яркость': 'до 3000 нит' }, 'Корпус': { 'Материал': 'Титан', 'Защита': 'WR100, EN13319' }, 'Прочее': { 'Автономность': 'до 42 ч' } }
    }),
    P({
      slug: 'galaxy-watch-8-classic', cat: 'watches', brand: 'Samsung', name: 'Galaxy Watch8 Classic', model: 'SM-L500',
      price: 34990, oldPrice: 39990, rating: 4.6, reviews: 245, badge: 'sale', pop: 76, date: '2026-07-25', stock: 15,
      img: ['1508685096489-7aacd43bd3b1'],
      short: ['Вращающийся безель', 'Индекс антиоксидантов', 'Wear OS + Gemini'],
      colors: [C.black, C.white],
      configs: [{ name: '46 мм', delta: 0 }, { name: '46 мм · LTE', delta: 5000 }],
      desc: 'Классический дизайн с физическим вращающимся безелем и новыми функциями здоровья: индексом антиоксидантов и тренером сна.',
      features: ['Вращающийся безель', 'Gemini на запястье', 'Тренер по бегу', 'Сапфировое стекло'],
      specs: { 'Экран': { 'Диагональ': '1,5"', 'Тип': 'Super AMOLED' }, 'Здоровье': { 'Датчики': 'BioActive: пульс, ЭКГ, BIA' }, 'Прочее': { 'Аккумулятор': '445 мА·ч', 'Защита': '5ATM, IP68' } }
    }),
    P({
      slug: 'garmin-fenix-8', cat: 'watches', brand: 'Garmin', name: 'fēnix 8 AMOLED', model: '010-02904',
      price: 99990, rating: 4.8, reviews: 166, pop: 71, date: '2025-09-01', stock: 6,
      img: ['1523275335684-37898b6baf30'],
      short: ['AMOLED 1,4", сапфир', 'Карты TopoActive', 'До 16 дней работы'],
      colors: [{ name: 'Сланцевый титан', hex: '#4f5258' }, C.titan],
      configs: [{ name: '47 мм', delta: 0 }, { name: '51 мм', delta: 10000 }],
      desc: 'Премиальные мультиспортивные часы для экстремальных условий. Встроенный динамик и микрофон, фонарик и подробные топокарты.',
      features: ['Встроенный фонарик', 'Голосовые команды и звонки', 'Дайверский режим до 40 м', 'Сапфировое стекло'],
      specs: { 'Экран': { 'Тип': 'AMOLED 1,4"', 'Стекло': 'Sapphire' }, 'Навигация': { 'GPS': 'Мультичастотный', 'Карты': 'TopoActive' }, 'Прочее': { 'Автономность': 'до 16 дней', 'Защита': '10 ATM' } }
    }),
    P({
      slug: 'huawei-watch-gt-5-pro', cat: 'watches', brand: 'Huawei', name: 'WATCH GT 5 Pro', model: 'VLI-B19',
      price: 29990, oldPrice: 34990, rating: 4.6, reviews: 412, badge: 'sale', pop: 74, date: '2025-10-10', stock: 20,
      img: ['1434493789847-2f02dc6ca35d'],
      short: ['Титан и сапфир', 'TruSense', 'До 14 дней работы'],
      colors: [C.titan, C.black],
      configs: [{ name: '46 мм', delta: 0 }, { name: '42 мм керамика', delta: 6000 }],
      desc: 'Элегантные часы с титановым корпусом и двумя неделями автономности. Новая система TruSense точнее отслеживает пульс и тренировки.',
      features: ['Корпус из авиационного титана', 'Режим гольфа и дайвинга', 'Две недели без подзарядки', 'Работа с iOS и Android'],
      specs: { 'Экран': { 'Диагональ': '1,43"', 'Тип': 'AMOLED' }, 'Корпус': { 'Материал': 'Титан, сапфир' }, 'Прочее': { 'Автономность': 'до 14 дней', 'Защита': '5ATM' } }
    }),

    /* ---------- Игровые консоли ---------- */
    P({
      slug: 'playstation-5-pro', cat: 'consoles', brand: 'Sony', name: 'PlayStation 5 Pro', model: 'CFI-7021',
      price: 74990, rating: 4.8, reviews: 1460, badge: 'hit', pop: 97, date: '2025-11-07', stock: 21,
      img: ['1606144042614-b2417e99c4e3'],
      short: ['PSSR апскейлинг ИИ', 'SSD 2 ТБ', 'Wi-Fi 7, 8K'],
      colors: [C.white],
      configs: [{ name: 'Цифровое издание', delta: 0 }, { name: 'С дисководом', delta: 9990 }],
      desc: 'Самая мощная PlayStation. GPU на 45% быстрее, улучшенная трассировка лучей и технология PlayStation Spectral Super Resolution для чёткой картинки при 60 FPS.',
      features: ['Ускоренная трассировка лучей', 'Апскейлинг PSSR на базе ИИ', 'SSD 2 ТБ', 'Обратная совместимость с PS4'],
      specs: { 'Производительность': { 'GPU': 'AMD RDNA, 16,7 TFLOPS', 'Видео': 'до 8K, 120 FPS' }, 'Память': { 'SSD': '2 ТБ' }, 'Прочее': { 'Сеть': 'Wi-Fi 7, Ethernet', 'В комплекте': 'DualSense' } }
    }),
    P({
      slug: 'nintendo-switch-2', cat: 'consoles', brand: 'Nintendo', name: 'Nintendo Switch 2', model: 'BEE-001',
      price: 49990, rating: 4.8, reviews: 920, badge: 'new', pop: 96, date: '2026-06-05', stock: 13,
      img: ['1578303512597-81e6cc155b3e'],
      short: ['7,9" экран 1080p 120 Гц', '4K на телевизоре', 'Магнитные Joy-Con 2'],
      colors: [C.black],
      configs: [{ name: 'Стандарт', delta: 0 }, { name: 'Комплект Mario Kart World', delta: 5000 }],
      desc: 'Новое поколение гибридной консоли: больше экран, магнитные контроллеры Joy-Con 2 с функцией мыши и поддержка 4K HDR на телевизоре.',
      features: ['Экран 7,9" 1080p HDR', 'Joy-Con 2 работают как мышь', 'GameChat с камерой', 'Совместимость с играми Switch'],
      specs: { 'Экран': { 'Диагональ': '7,9"', 'Разрешение': '1920 × 1080, 120 Гц' }, 'Производительность': { 'Процессор': 'NVIDIA custom', 'Видео (док)': 'до 4K 60 FPS' }, 'Память': { 'Встроенная': '256 ГБ', 'Расширение': 'microSD Express' } }
    }),
    P({
      slug: 'xbox-series-x', cat: 'consoles', brand: 'Microsoft', name: 'Xbox Series X 2 ТБ', model: 'RRT-00030',
      price: 64990, oldPrice: 72990, rating: 4.7, reviews: 690, badge: 'sale', pop: 81, date: '2025-10-15', stock: 7,
      img: ['1621259182978-fbf93132d53d'],
      short: ['12 TFLOPS, 4K 120 FPS', 'SSD 2 ТБ', 'Game Pass Ultimate'],
      colors: [{ name: 'Galaxy Black', hex: '#1a1a1d' }, C.white],
      desc: 'Самый мощный Xbox в специальной версии с накопителем 2 ТБ. Quick Resume, 4K при 120 FPS и тысячи игр в библиотеке Game Pass.',
      features: ['Quick Resume — несколько игр сразу', 'Трассировка лучей', 'SSD 2 ТБ', 'Обратная совместимость'],
      specs: { 'Производительность': { 'GPU': '12 TFLOPS, RDNA 2', 'Видео': '4K 120 FPS / 8K' }, 'Память': { 'SSD': '2 ТБ' }, 'Прочее': { 'Привод': 'Нет (цифровая)' } }
    }),
    P({
      slug: 'steam-deck-oled', cat: 'consoles', brand: 'Valve', name: 'Steam Deck OLED', model: '1010',
      price: 69990, rating: 4.8, reviews: 506, pop: 85, date: '2025-11-16', stock: 10,
      img: ['1600861194942-f883de0dfe96'],
      short: ['7,4" HDR OLED 90 Гц', 'AMD APU 6 нм', 'До 12 ч работы'],
      colors: [C.black],
      configs: [{ name: '512 ГБ', delta: 0 }, { name: '1 ТБ', delta: 12000 }],
      desc: 'Ваша библиотека Steam в портативном формате. HDR OLED-экран, увеличенная батарея и Wi-Fi 6E.',
      features: ['HDR OLED до 1000 нит', 'Wi-Fi 6E', 'Steam OS', 'Батарея 50 Вт·ч'],
      specs: { 'Экран': { 'Диагональ': '7,4"', 'Тип': 'HDR OLED, 90 Гц' }, 'Производительность': { 'APU': 'AMD Zen 2 + RDNA 2', 'ОЗУ': '16 ГБ LPDDR5' }, 'Прочее': { 'Вес': '640 г' } }
    }),
    P({
      slug: 'dualsense-edge', cat: 'consoles', brand: 'Sony', name: 'DualSense Edge', model: 'CFI-ZCP1',
      price: 21990, oldPrice: 24990, rating: 4.6, reviews: 388, badge: 'sale', pop: 69, date: '2025-08-10', stock: 28,
      img: ['1592840496694-26d035b52b48'],
      short: ['Сменные стики', 'Задние кнопки', 'Профили настроек'],
      colors: [C.white],
      desc: 'Профессиональный беспроводной контроллер для PS5 с заменяемыми модулями стиков, задними кнопками и настраиваемыми триггерами.',
      features: ['Сменные модули стиков', 'Регулируемый ход триггеров', 'Кейс для переноски', 'Плетёный кабель USB-C'],
      specs: { 'Подключение': { 'Тип': 'Bluetooth, USB-C' }, 'Особенности': { 'Отклик': 'Haptic, адаптивные триггеры' }, 'Прочее': { 'Вес': '325 г' } }
    }),

    /* ---------- Компьютерная техника ---------- */
    P({
      slug: 'mac-mini-m4', cat: 'computers', brand: 'Apple', name: 'Mac mini M4', model: 'MU9D3',
      price: 69990, rating: 4.9, reviews: 588, badge: 'hit', pop: 90, date: '2025-11-08', stock: 18,
      img: ['1547082299-de196ea013d6'],
      short: ['Apple M4, 10 ядер', '16 ГБ / 256 ГБ', '12,7 × 12,7 см'],
      colors: [C.silver],
      configs: [{ name: 'M4 · 16 ГБ · 256 ГБ', delta: 0 }, { name: 'M4 · 24 ГБ · 512 ГБ', delta: 40000 }, { name: 'M4 Pro · 24 ГБ · 512 ГБ', delta: 70000 }],
      desc: 'Целый Mac размером с ладонь. Mac mini с чипом M4 поддерживает до трёх мониторов и имеет порты спереди для удобства.',
      features: ['Размер 12,7 × 12,7 см', 'Порты USB-C спереди', 'До трёх дисплеев', 'Тихий и холодный'],
      specs: { 'Производительность': { 'Процессор': 'Apple M4 (10 CPU / 10 GPU)', 'ОЗУ': '16 ГБ', 'Накопитель': '256 ГБ SSD' }, 'Порты': { 'Сзади': '3× Thunderbolt 4, HDMI, Ethernet', 'Спереди': '2× USB-C, 3,5 мм' }, 'Прочее': { 'Вес': '0,67 кг' } }
    }),
    P({
      slug: 'imac-24-m4', cat: 'computers', brand: 'Apple', name: 'iMac 24" M4', model: 'MWUU3',
      price: 149990, rating: 4.8, reviews: 214, pop: 79, date: '2025-11-08', stock: 6,
      img: ['1527443224154-c4a3942d3acf'],
      short: ['24" 4.5K Retina', 'Apple M4, 16 ГБ', 'Камера Center Stage 12 Мп'],
      colors: [C.blue, C.green, C.pink, C.silver],
      configs: [{ name: '16 ГБ · 256 ГБ', delta: 0 }, { name: '16 ГБ · 512 ГБ', delta: 20000 }, { name: '24 ГБ · 1 ТБ', delta: 60000 }],
      desc: 'Яркий моноблок толщиной 11,5 мм с дисплеем 4.5K Retina. Цветные клавиатура и мышь в комплекте.',
      features: ['Дисплей с нанотекстурой на выбор', 'Шесть динамиков', 'Touch ID на клавиатуре', 'Thunderbolt 4'],
      specs: { 'Экран': { 'Диагональ': '24"', 'Разрешение': '4480 × 2520' }, 'Производительность': { 'Процессор': 'Apple M4', 'ОЗУ': '16 ГБ' }, 'Прочее': { 'Толщина': '11,5 мм', 'Вес': '4,4 кг' } }
    }),
    P({
      slug: 'rog-strix-g16ch', cat: 'computers', brand: 'ASUS', name: 'ROG Strix G16CH Gaming PC', model: 'G16CHR',
      price: 249990, oldPrice: 279990, rating: 4.7, reviews: 72, badge: 'sale', pop: 66, date: '2026-05-20', stock: 3,
      img: ['1587202372775-e229f172b9d7'],
      short: ['Core Ultra 9 285K', 'RTX 5080 16 ГБ', '32 ГБ DDR5 / 2 ТБ'],
      colors: [C.black],
      configs: [{ name: 'RTX 5070 Ti', delta: -45000 }, { name: 'RTX 5080', delta: 0 }, { name: 'RTX 5090', delta: 120000 }],
      desc: 'Готовый игровой компьютер для 4K-гейминга. Эффективное охлаждение, RGB-подсветка Aura Sync и простой доступ к комплектующим без инструментов.',
      features: ['Обслуживание без инструментов', 'RGB Aura Sync', 'Wi-Fi 7', 'Блок питания 1000 Вт 80+ Gold'],
      specs: { 'Производительность': { 'Процессор': 'Intel Core Ultra 9 285K', 'Видеокарта': 'NVIDIA GeForce RTX 5080 16 ГБ', 'ОЗУ': '32 ГБ DDR5-6000', 'Накопитель': '2 ТБ NVMe' }, 'Прочее': { 'ОС': 'Windows 11 Pro', 'Блок питания': '1000 Вт' } }
    }),
    P({
      slug: 'odyssey-oled-g8', cat: 'computers', brand: 'Samsung', name: 'Odyssey OLED G8 32"', model: 'LS32FG810',
      price: 109990, rating: 4.7, reviews: 133, badge: 'new', pop: 72, date: '2026-08-15', stock: 9,
      img: ['1593640408182-31c70c8268f5'],
      short: ['32" QD-OLED 4K', '240 Гц, 0,03 мс', 'HDR True Black 400'],
      colors: [C.silver],
      desc: 'Игровой монитор 4K QD-OLED с частотой 240 Гц. Антибликовое покрытие Glare Free и защита от выгорания.',
      features: ['QD-OLED 4K 240 Гц', 'Glare Free покрытие', 'AMD FreeSync Premium Pro', 'DisplayPort 2.1'],
      specs: { 'Экран': { 'Диагональ': '31,5"', 'Матрица': 'QD-OLED', 'Разрешение': '3840 × 2160', 'Частота': '240 Гц' }, 'Подключение': { 'Порты': 'DP 2.1, 2× HDMI 2.1, USB-C 98 Вт' } }
    }),
    P({
      slug: 'rtx-5080-founders', cat: 'computers', brand: 'NVIDIA', name: 'GeForce RTX 5080 Founders Edition', model: '900-1G144',
      price: 129990, rating: 4.8, reviews: 211, badge: 'hit', pop: 83, date: '2026-01-30', stock: 2,
      img: ['1591488320449-011701bb6704'],
      short: ['16 ГБ GDDR7', 'DLSS 4', '360 Вт'],
      colors: [C.black],
      desc: 'Видеокарта на архитектуре Blackwell с поддержкой DLSS 4 Multi Frame Generation. Двухслотовый дизайн Founders Edition с продувным охлаждением.',
      features: ['Архитектура Blackwell', 'DLSS 4 Multi Frame Generation', 'Ядра RT 4-го поколения', 'Двухслотовый корпус'],
      specs: { 'Производительность': { 'Ядра CUDA': '10 752', 'Память': '16 ГБ GDDR7, 256 бит' }, 'Прочее': { 'Энергопотребление': '360 Вт', 'Выходы': '3× DP 2.1b, HDMI 2.1b' } }
    }),

    /* ---------- Аксессуары ---------- */
    P({
      slug: 'mx-master-3s', cat: 'accessories', brand: 'Logitech', name: 'MX Master 3S', model: '910-006559',
      price: 9990, oldPrice: 11990, rating: 4.9, reviews: 3120, badge: 'hit', pop: 95, date: '2025-06-01', stock: 80,
      img: ['1527864550417-7fd91fc51a46'],
      short: ['8000 DPI', 'Тихие клики', 'MagSpeed колесо'],
      colors: [C.gray, { name: 'Бледно-серый', hex: '#d9d8d4' }, C.black],
      desc: 'Культовая мышь для работы. Сенсор 8000 DPI работает даже на стекле, тихие клики и сверхбыстрое электромагнитное колесо MagSpeed.',
      features: ['Работает на стекле', 'На 90% тише кликов', 'До 3 устройств', 'Зарядка USB-C: 70 дней'],
      specs: { 'Сенсор': { 'Разрешение': '200–8000 DPI' }, 'Подключение': { 'Тип': 'Bluetooth, Logi Bolt' }, 'Прочее': { 'Автономность': 'до 70 дней', 'Вес': '141 г' } }
    }),
    P({
      slug: 'mx-keys-s', cat: 'accessories', brand: 'Logitech', name: 'MX Keys S', model: '920-011406',
      price: 12990, rating: 4.8, reviews: 1290, pop: 82, date: '2025-05-10', stock: 44,
      img: ['1587829741301-dc798b83add3'],
      short: ['Умная подсветка', 'Сферические клавиши', 'До 3 устройств'],
      colors: [C.gray, { name: 'Бледно-серый', hex: '#d9d8d4' }],
      desc: 'Беспроводная клавиатура с тихим и точным ходом клавиш и умной подсветкой, которая включается при приближении рук.',
      features: ['Подсветка с датчиком приближения', 'Smart Actions', 'Переключение Easy-Switch', 'USB-C'],
      specs: { 'Клавиши': { 'Тип': 'Ножничный механизм, сферические' }, 'Подключение': { 'Тип': 'Bluetooth, Logi Bolt' }, 'Прочее': { 'Автономность': 'до 10 дней с подсветкой' } }
    }),
    P({
      slug: 'anker-prime-powerbank', cat: 'accessories', brand: 'Anker', name: 'Prime Power Bank 26 250', model: 'A1340',
      price: 14990, oldPrice: 17990, rating: 4.7, reviews: 540, badge: 'sale', pop: 70, date: '2026-02-14', stock: 26,
      img: ['1583863788434-e58a36330cf0'],
      short: ['26 250 мА·ч', '300 Вт суммарно', 'Smart-дисплей'],
      colors: [C.black],
      desc: 'Мощный аккумулятор, способный зарядить ноутбук. Два порта USB-C по 140 Вт и цифровой дисплей с подробной статистикой.',
      features: ['Заряжает MacBook Pro', 'Два USB-C по 140 Вт', 'Управление через приложение', 'Можно в самолёт'],
      specs: { 'Ёмкость': { 'Номинальная': '26 250 мА·ч / 99,75 Вт·ч' }, 'Выходы': { 'Порты': '2× USB-C, 1× USB-A', 'Мощность': 'до 300 Вт' }, 'Прочее': { 'Вес': '574 г' } }
    }),
    P({
      slug: 'magsafe-charger-25w', cat: 'accessories', brand: 'Apple', name: 'Зарядное устройство MagSafe 25 Вт', model: 'MX6X3',
      price: 5990, rating: 4.6, reviews: 860, badge: 'new', pop: 79, date: '2026-09-19', stock: 70,
      img: ['1615526675159-e248c3021d3f'],
      short: ['До 25 Вт с Qi2.2', 'Кабель 1 или 2 м', 'USB-C'],
      colors: [C.white],
      configs: [{ name: '1 м', delta: 0 }, { name: '2 м', delta: 1000 }],
      desc: 'Новое поколение MagSafe: заряжает iPhone 17 до 50% всего за 30 минут при использовании адаптера мощностью от 30 Вт.',
      features: ['Быстрая зарядка 25 Вт', 'Совместим с Qi2', 'Заряжает AirPods', 'Плетёный кабель'],
      specs: { 'Зарядка': { 'Мощность': 'до 25 Вт', 'Стандарт': 'MagSafe, Qi2.2' }, 'Прочее': { 'Разъём': 'USB-C' } }
    }),
    P({
      slug: 'samsung-t9-ssd', cat: 'accessories', brand: 'Samsung', name: 'Portable SSD T9', model: 'MU-PG2T0B',
      price: 18990, oldPrice: 22990, rating: 4.8, reviews: 410, badge: 'sale', pop: 67, date: '2025-09-12', stock: 31,
      img: ['1531492746076-161ca9bcad58'],
      short: ['До 2000 МБ/с', 'USB 3.2 Gen 2×2', 'Защита от падений 3 м'],
      colors: [C.black],
      configs: [{ name: '1 ТБ', delta: -6000 }, { name: '2 ТБ', delta: 0 }, { name: '4 ТБ', delta: 16000 }],
      desc: 'Внешний SSD для профессионалов: скорость до 2000 МБ/с, прочный резиновый корпус и стабильная работа при длительных нагрузках.',
      features: ['Скорость до 2000 МБ/с', 'Ударопрочный корпус', 'Совместим с iPhone 17 Pro', '5 лет гарантии'],
      specs: { 'Производительность': { 'Чтение': 'до 2000 МБ/с', 'Запись': 'до 1950 МБ/с' }, 'Прочее': { 'Интерфейс': 'USB 3.2 Gen 2×2', 'Вес': '122 г' } }
    })
  ];

  const REVIEWS = [
    { name: 'Анна Воронцова', city: 'Москва', rating: 5, product: 'MacBook Air 13" M4', text: 'Заказала вечером, утром курьер уже был у двери. Ноутбук запечатан, чек и гарантия на месте. Консультант помог выбрать конфигурацию — очень довольна.' },
    { name: 'Дмитрий Лебедев', city: 'Санкт-Петербург', rating: 5, product: 'PlayStation 5 Pro', text: 'Лучшая цена в городе и бонусная скидка при оформлении онлайн. Упаковано идеально, отследить заказ можно в личном кабинете в реальном времени.' },
    { name: 'Мария Ким', city: 'Казань', rating: 5, product: 'AirPods Pro 3', text: 'Взяла по trade-in старые наушники — зачли хорошую сумму. Магазин выглядит и работает как официальный бутик, приятно покупать.' },
    { name: 'Игорь Савельев', city: 'Екатеринбург', rating: 4, product: 'ROG Zephyrus G16', text: 'Ноутбук пришёл за 2 дня. Немного задержался звонок менеджера, но в остальном всё отлично — помогли перенести данные со старого ноутбука.' },
    { name: 'Екатерина Орлова', city: 'Новосибирск', rating: 5, product: 'iPhone 17 Pro', text: 'Оформила рассрочку прямо на сайте за пару минут. Телефон пришёл с защитным стеклом в подарок. Буду заказывать ещё!' },
    { name: 'Алексей Мороз', city: 'Краснодар', rating: 5, product: 'Sony WH-1000XM6', text: 'Удобные фильтры, нашёл нужные наушники за минуту. Доставка бесплатная, а при получении можно было проверить товар. Рекомендую.' }
  ];

  const FAQ = [
    { cat: 'Заказ', q: 'Как оформить заказ?', a: 'Добавьте товары в корзину, нажмите «Оформить заказ», заполните контактные данные и выберите способ доставки. Менеджер подтвердит заказ в течение 15 минут в рабочее время.' },
    { cat: 'Заказ', q: 'Можно ли изменить или отменить заказ?', a: 'Да, до момента передачи в доставку. Позвоните на горячую линию 8 800 555-35-35 или напишите в чат — мы всё изменим бесплатно.' },
    { cat: 'Доставка', q: 'Сколько стоит доставка?', a: 'Курьерская доставка по Москве и Санкт-Петербургу — 490 ₽, бесплатно при заказе от 50 000 ₽. Самовывоз из магазинов TECHZONE всегда бесплатный.' },
    { cat: 'Доставка', q: 'Как быстро привезут заказ?', a: 'В Москве и Санкт-Петербурге — в день заказа или на следующий день. В другие города России — от 2 до 7 рабочих дней в зависимости от региона.' },
    { cat: 'Оплата', q: 'Какие способы оплаты доступны?', a: 'Банковская карта при получении, наличные курьеру, оплата через СБП, а также рассрочка 0% на 6 или 12 месяцев от банков-партнёров.' },
    { cat: 'Оплата', q: 'Есть ли рассрочка?', a: 'Да, рассрочка без переплаты на 6–12 месяцев для заказов от 10 000 ₽. Решение банка — за 2 минуты, без визита в отделение.' },
    { cat: 'Гарантия', q: 'Какая гарантия на технику?', a: 'Вся техника официальная, с гарантией производителя от 12 месяцев. Дополнительно можно оформить расширенную гарантию TECHZONE Care+ до 3 лет.' },
    { cat: 'Гарантия', q: 'Как вернуть товар?', a: 'Вы можете вернуть товар надлежащего качества в течение 14 дней, если сохранены упаковка и товарный вид. Возврат денег — в течение 3 рабочих дней.' },
    { cat: 'Гарантия', q: 'Работает ли trade-in?', a: 'Да. Принимаем смартфоны, планшеты, ноутбуки и часы в любом состоянии. Оценка онлайн за 1 минуту, сумма засчитывается как скидка на новую покупку.' }
  ];

  const STORES = [
    { name: 'TECHZONE Тверская', addr: 'Москва, ул. Тверская, 15', hours: 'Ежедневно 10:00–22:00', phone: '+7 495 123-45-67', metro: 'м. Пушкинская' },
    { name: 'TECHZONE Невский', addr: 'Санкт-Петербург, Невский пр., 48', hours: 'Ежедневно 10:00–22:00', phone: '+7 812 765-43-21', metro: 'м. Гостиный двор' },
    { name: 'TECHZONE Сити', addr: 'Москва, Пресненская наб., 2, ТЦ «Афимолл»', hours: 'Ежедневно 10:00–23:00', phone: '+7 495 222-33-44', metro: 'м. Выставочная' }
  ];

  const PROMO_CODES = { TECH10: { type: 'pct', value: 10, label: 'Скидка 10%' }, WELCOME: { type: 'fix', value: 3000, label: 'Скидка 3 000 ₽' } };

  window.TZ_DATA = { CATEGORIES, PRODUCTS, REVIEWS, FAQ, STORES, PROMO_CODES, img };
})();
