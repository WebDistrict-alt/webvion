/* AutoLux — демонстрационный склад автомобилей (RU / EN) */
(function () {
  const IMG = (id, w = 1200, fp) => {
    let u = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
    if (fp) u += `&crop=focalpoint&fp-x=${fp[0]}&fp-y=${fp[1]}&fp-z=${fp[2]}`;
    return u;
  };

  // Галерея: общий план + три детальных ракурса (кадрирование по фокусной точке)
  const gallery = (id, extra = []) => [
    { id }, ...extra.map((e) => ({ id: e })),
    { id, fp: [0.32, 0.6, 1.9] },
    { id, fp: [0.68, 0.58, 1.9] },
    { id, fp: [0.5, 0.55, 1.45] }
  ];

  const CARS = [
    {
      id: 'lamborghini-huracan-evo', brand: 'Lamborghini', model: 'Huracán EVO', trim: 'Arancio Borealis',
      year: 2023, mileage: 4200, power: 640, price: 32900000, body: 'coupe', photo: '1612825173281-9a193378527e',
      engine: { ru: 'V10 5.2 л, атмосферный', en: '5.2 L naturally aspirated V10' }, torque: 600, accel: 2.9, top: 325, drive: 'awd',
      gearbox: { ru: 'Робот LDF, 7 ст.', en: '7-speed LDF dual-clutch' }, color: 'Arancio Borealis',
      interior: { ru: 'Alcantara Nero / Arancio', en: 'Alcantara Nero / Arancio' }, owners: 1, status: 'stock', badge: { ru: 'Хит', en: 'Hot' },
      desc: {
        ru: 'Huracán EVO — квинтэссенция атмосферного V10. Система LDVI предугадывает намерения водителя и распределяет тягу между осями быстрее, чем вы успеваете повернуть руль. Обслуживался только у официального дилера, сохранена заводская плёнка PPF и полный пакет документов.',
        en: 'The Huracán EVO is the purest expression of a naturally aspirated V10. Its LDVI system predicts what the driver wants and shifts torque between the axles before you finish turning the wheel. Dealer-serviced from day one, factory PPF intact, full paperwork.'
      },
      features: {
        ru: ['Карбон-керамические тормоза', 'Подъём передней оси', 'Аудиосистема Sensonum', 'Пакет Carbon Exterior', 'Камера заднего вида', 'Плёнка PPF по кузову'],
        en: ['Carbon-ceramic brakes', 'Front axle lift', 'Sensonum sound system', 'Carbon Exterior package', 'Rear-view camera', 'Full-body PPF']
      }
    },
    {
      id: 'lamborghini-aventador-s', brand: 'Lamborghini', model: 'Aventador S', trim: 'LP 740-4',
      year: 2021, mileage: 9800, power: 740, price: 45500000, body: 'coupe', photo: '1525609004556-c46c7d6cf023', extra: ['1571607388263-1044f9ea01dd'],
      engine: { ru: 'V12 6.5 л, атмосферный', en: '6.5 L naturally aspirated V12' }, torque: 690, accel: 2.9, top: 350, drive: 'awd',
      gearbox: { ru: 'Робот ISR, 7 ст.', en: '7-speed ISR automated' }, color: 'Arancio Atlas',
      interior: { ru: 'Nero Ade, стежка Q-Citura', en: 'Nero Ade, Q-Citura stitching' }, owners: 1, status: 'stock', badge: { ru: 'V12', en: 'V12' },
      desc: {
        ru: 'Последнее поколение флагманского V12 без гибридизации. Подруливающая задняя ось и активная аэродинамика делают Aventador S неожиданно послушным и на трассе, и в городе. Двери-ножницы и силуэт, который узнают с любого расстояния.',
        en: 'The last of the flagship V12s without hybrid assistance. Rear-wheel steering and active aero make the Aventador S surprisingly friendly on track and in town. Scissor doors and a silhouette you can recognise from a mile away.'
      },
      features: {
        ru: ['Подруливающая задняя ось', 'Магнитные амортизаторы', 'Система Lift', 'Карбоновый моторный отсек', 'Кожа Q-Citura', 'Apple CarPlay'],
        en: ['Rear-wheel steering', 'Magnetic dampers', 'Lift system', 'Carbon engine bay', 'Q-Citura leather', 'Apple CarPlay']
      }
    },
    {
      id: 'porsche-911-gt3-rs', brand: 'Porsche', model: '911 GT3 RS', trim: '992 Weissach',
      year: 2023, mileage: 6100, power: 525, price: 36500000, body: 'coupe', photo: '1580274455191-1c62238fa333',
      engine: { ru: 'Оппозитный 6 цил. 4.0 л, атмосферный', en: '4.0 L naturally aspirated flat-six' }, torque: 465, accel: 3.2, top: 296, drive: 'rwd',
      gearbox: { ru: 'PDK, 7 ст.', en: '7-speed PDK' }, color: 'Jet Black Metallic',
      interior: { ru: 'Race-Tex Black / Guards Red', en: 'Race-Tex Black / Guards Red' }, owners: 1, status: 'stock', badge: { ru: 'Новинка', en: 'New in' },
      desc: {
        ru: 'Самый радикальный атмосферный 911 в истории. Активное антикрыло с DRS, 860 кг прижимной силы на 285 км/ч и настройка подвески прямо с руля. Пакет Weissach с карбоном и магниевыми дисками — почти гоночная машина с номерами.',
        en: 'The most extreme naturally aspirated 911 ever made. An active DRS rear wing, 860 kg of downforce at 285 km/h and damper adjustment right on the steering wheel. The Weissach package adds carbon and magnesium wheels: a race car with number plates.'
      },
      features: {
        ru: ['Пакет Weissach', 'Магниевые диски', 'Тормоза PCCB', 'Система DRS', 'Каркас безопасности', 'Подъём передней оси'],
        en: ['Weissach package', 'Magnesium wheels', 'PCCB brakes', 'DRS system', 'Roll cage', 'Front axle lift']
      }
    },
    {
      id: 'porsche-911-gt3', brand: 'Porsche', model: '911 GT3', trim: 'Touring',
      year: 2022, mileage: 11300, power: 510, price: 24900000, body: 'coupe', photo: '1614162692292-7ac56d7f7f1e',
      engine: { ru: 'Оппозитный 6 цил. 4.0 л, атмосферный', en: '4.0 L naturally aspirated flat-six' }, torque: 470, accel: 3.4, top: 320, drive: 'rwd',
      gearbox: { ru: 'PDK, 7 ст.', en: '7-speed PDK' }, color: 'GT Silver Metallic',
      interior: { ru: 'Кожа / Race-Tex Black', en: 'Leather / Race-Tex Black' }, owners: 2, status: 'stock', badge: null,
      desc: {
        ru: 'Мотор, раскручивающийся до 9 000 об/мин, и двухрычажная передняя подвеска из гоночной программы. Версия Touring — без большого антикрыла, для тех, кто ценит сдержанную элегантность и чистую механику.',
        en: 'An engine that revs to 9,000 rpm and double-wishbone front suspension straight from the race programme. The Touring version drops the big wing for those who prefer quiet elegance and pure mechanics.'
      },
      features: {
        ru: ['Ковшеобразные кресла', 'Пакет Clubsport', 'Подъём передней оси', 'LED Matrix', 'Chrono с Track Screen', 'Облегчённый аккумулятор'],
        en: ['Bucket seats', 'Clubsport package', 'Front axle lift', 'LED Matrix', 'Chrono with Track Screen', 'Lightweight battery']
      }
    },
    {
      id: 'ferrari-f8-tributo', brand: 'Ferrari', model: 'F8 Tributo', trim: 'Rosso Corsa',
      year: 2021, mileage: 7400, power: 720, price: 34800000, body: 'coupe', photo: '1592198084033-aade902d1aae',
      engine: { ru: 'V8 3.9 л, битурбо', en: '3.9 L twin-turbo V8' }, torque: 770, accel: 2.9, top: 340, drive: 'rwd',
      gearbox: { ru: 'Робот F1 DCT, 7 ст.', en: '7-speed F1 DCT' }, color: 'Rosso Corsa',
      interior: { ru: 'Кожа Nero, красная строчка', en: 'Nero leather, red stitching' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Дань самому титулованному V8 в истории Маранелло. F8 Tributo на 40 кг легче предшественника, а Side Slip Control 6.1 позволяет контролируемо скользить даже не самым опытным пилотам. Полная сервисная история.',
        en: 'A tribute to the most decorated V8 in Maranello history. The F8 Tributo is 40 kg lighter than its predecessor, and Side Slip Control 6.1 lets even less experienced drivers slide with confidence. Full service history.'
      },
      features: {
        ru: ['Карбоновый руль с LED', 'Дисплей пассажира', 'Подъём передней оси', 'Пакет Carbon Interior', 'JBL Professional', 'Камеры 360°'],
        en: ['Carbon LED steering wheel', 'Passenger display', 'Front axle lift', 'Carbon Interior package', 'JBL Professional', '360° cameras']
      }
    },
    {
      id: 'ferrari-laferrari', brand: 'Ferrari', model: 'LaFerrari', trim: 'Collector',
      year: 2015, mileage: 2900, power: 963, price: 485000000, body: 'hyper', photo: '1583121274602-3e2820c69888',
      engine: { ru: 'V12 6.3 л + электромотор HY-KERS', en: '6.3 L V12 + HY-KERS electric motor' }, torque: 900, accel: 2.4, top: 350, drive: 'rwd',
      gearbox: { ru: 'Робот F1, 7 ст.', en: '7-speed F1 dual-clutch' }, color: 'Rosso Corsa',
      interior: { ru: 'Alcantara Nero', en: 'Alcantara Nero' }, owners: 2, status: 'request', badge: { ru: 'Коллекция', en: 'Collector' },
      desc: {
        ru: 'Один из 499 экземпляров первого гибридного гиперкара Ferrari. Сертификат Ferrari Classiche, полная история владения, хранение в климатическом боксе. Показ проводится конфиденциально, по предварительной записи.',
        en: 'One of 499 examples of Ferrari’s first hybrid hypercar. Ferrari Classiche certified, complete ownership history, kept in a climate-controlled garage. Viewings are private and by appointment only.'
      },
      features: {
        ru: ['Сертификат Classiche', 'Монокок из углепластика', 'Активная аэродинамика', 'Система HY-KERS', 'Хранение в климат-боксе', 'Оригинальный комплект чемоданов'],
        en: ['Classiche certificate', 'Carbon-fibre monocoque', 'Active aerodynamics', 'HY-KERS system', 'Climate-controlled storage', 'Original luggage set']
      }
    },
    {
      id: 'mclaren-720s', brand: 'McLaren', model: '720S', trim: 'Performance',
      year: 2022, mileage: 5600, power: 720, price: 31200000, body: 'coupe', photo: '1542362567-b07e54358753',
      engine: { ru: 'V8 4.0 л, битурбо', en: '4.0 L twin-turbo V8' }, torque: 770, accel: 2.9, top: 341, drive: 'rwd',
      gearbox: { ru: 'Робот SSG, 7 ст.', en: '7-speed SSG' }, color: 'Silica White',
      interior: { ru: 'Alcantara Carbon Black', en: 'Alcantara Carbon Black' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Углепластиковый монокок Monocage II и гидравлическая подвеска Proactive Chassis Control II — инженерная мысль Уокинга в чистом виде. Версия Performance с открытым карбоном и вентилируемыми панелями.',
        en: 'A Monocage II carbon tub and Proactive Chassis Control II hydraulic suspension: Woking engineering at its purest. Performance spec with exposed carbon and vented body panels.'
      },
      features: {
        ru: ['Monocage II', 'Variable Drift Control', 'Bowers & Wilkins', 'Пакет Carbon Exterior', 'Телеметрия Track', 'Подъём передней оси'],
        en: ['Monocage II', 'Variable Drift Control', 'Bowers & Wilkins', 'Carbon Exterior package', 'Track telemetry', 'Front axle lift']
      }
    },
    {
      id: 'mclaren-gt', brand: 'McLaren', model: 'GT', trim: 'Luxe',
      year: 2022, mileage: 8900, power: 620, price: 22900000, body: 'coupe', photo: '1503736334956-4c8f8e92946d',
      engine: { ru: 'V8 4.0 л, битурбо', en: '4.0 L twin-turbo V8' }, torque: 630, accel: 3.2, top: 326, drive: 'rwd',
      gearbox: { ru: 'Робот SSG, 7 ст.', en: '7-speed SSG' }, color: 'Papaya Spark',
      interior: { ru: 'Кожа Nappa Porcelain', en: 'Nappa leather, Porcelain' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Гран-туризмо с характером суперкара: 570 литров багажа, мягкая подвеска для дальних маршрутов и V8, готовый в любой момент выстрелить к горизонту. Комплектация Luxe с электрохромной панорамной крышей.',
        en: 'A grand tourer with a supercar soul: 570 litres of luggage space, supple suspension for long trips and a V8 ready to launch you at the horizon. Luxe spec with an electrochromic panoramic roof.'
      },
      features: {
        ru: ['Электрохромная крыша', 'Подогрев сидений', 'Багажник 570 л', 'Bowers & Wilkins', 'Камера 360°', 'Доводчики дверей'],
        en: ['Electrochromic roof', 'Heated seats', '570 L luggage space', 'Bowers & Wilkins', '360° camera', 'Soft-close doors']
      }
    },
    {
      id: 'bugatti-chiron-sport', brand: 'Bugatti', model: 'Chiron Sport', trim: '110 ans',
      year: 2020, mileage: 3100, power: 1500, price: 395000000, body: 'hyper', photo: '1544636331-e26879cd4d9b', extra: ['1600712242805-5f78671b24da'],
      engine: { ru: 'W16 8.0 л, 4 турбины', en: '8.0 L quad-turbo W16' }, torque: 1600, accel: 2.4, top: 420, drive: 'awd',
      gearbox: { ru: 'DSG, 7 ст.', en: '7-speed DSG' }, color: 'Glacier White / Carbon',
      interior: { ru: 'Кожа Beluga Black', en: 'Beluga Black leather' }, owners: 1, status: 'request', badge: { ru: 'Гиперкар', en: 'Hypercar' },
      desc: {
        ru: 'Шестнадцать цилиндров, четыре турбины и 1 500 лошадиных сил — Chiron остаётся вершиной автомобильной инженерии. Полное обслуживание в Molsheim, плановая замена шин и сертификат подлинности.',
        en: 'Sixteen cylinders, four turbos and 1,500 horsepower: the Chiron is still the summit of automotive engineering. Fully serviced in Molsheim, scheduled tyre change done, certificate of authenticity included.'
      },
      features: {
        ru: ['Обслуживание в Molsheim', 'Ключ Top Speed', 'Карбоновый кузов', 'Аудиосистема Accuton', 'Сертификат подлинности', 'Индивидуальный чехол'],
        en: ['Serviced in Molsheim', 'Top Speed key', 'Carbon body', 'Accuton sound system', 'Certificate of authenticity', 'Tailored car cover']
      }
    },
    {
      id: 'rolls-royce-wraith', brand: 'Rolls-Royce', model: 'Wraith', trim: 'Black Badge',
      year: 2022, mileage: 7200, power: 632, price: 41900000, body: 'coupe', photo: '1631295868223-63265b40d9e4',
      engine: { ru: 'V12 6.6 л, битурбо', en: '6.6 L twin-turbo V12' }, torque: 870, accel: 4.4, top: 250, drive: 'rwd',
      gearbox: { ru: 'Автомат ZF, 8 ст.', en: '8-speed ZF automatic' }, color: 'Arctic White',
      interior: { ru: 'Кожа Mandarin / Black', en: 'Mandarin / Black leather' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Самый дерзкий Rolls-Royce. Звёздное небо Starlight из 1 340 оптоволоконных нитей, двери против хода и тишина, в которой слышно, как тикают аналоговые часы. Black Badge — тёмная сторона Spirit of Ecstasy.',
        en: 'The boldest Rolls-Royce. A Starlight headliner with 1,340 fibre-optic stars, coach doors and a silence so deep you can hear the analogue clock tick. Black Badge is the dark side of the Spirit of Ecstasy.'
      },
      features: {
        ru: ['Starlight Headliner', 'Двери-«кареты»', 'Bespoke Audio', 'Отделка Technical Fibre', 'Ночное видение', 'Зонты в дверях'],
        en: ['Starlight headliner', 'Coach doors', 'Bespoke Audio', 'Technical Fibre trim', 'Night vision', 'Door umbrellas']
      }
    },
    {
      id: 'mercedes-amg-gt-r', brand: 'Mercedes-AMG', model: 'GT R', trim: 'Pro',
      year: 2021, mileage: 12400, power: 585, price: 19800000, body: 'coupe', photo: '1618843479313-40f8afb4b4d8',
      engine: { ru: 'V8 4.0 л, битурбо', en: '4.0 L twin-turbo V8' }, torque: 700, accel: 3.6, top: 318, drive: 'rwd',
      gearbox: { ru: 'Робот AMG Speedshift, 7 ст.', en: '7-speed AMG Speedshift' }, color: 'Iridium Silver',
      interior: { ru: 'Кожа Nappa / Dinamica', en: 'Nappa leather / Dinamica' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Нюрбургринг стал для GT R домашней трассой. Версия Pro получила регулируемые койловеры, карбоновую аэродинамику и тот самый «бисквит» на крышке багажника. Без ДТП, весь завод.',
        en: 'The Nürburgring is the GT R’s home track. The Pro version adds adjustable coilovers, carbon aero and that famous rear-deck spoiler. Accident-free, all original paint.'
      },
      features: {
        ru: ['Регулируемые койловеры', 'Карбоновый пакет', 'Керамические тормоза', 'AMG Track Pace', 'Burmester', 'Ковшеобразные кресла'],
        en: ['Adjustable coilovers', 'Carbon package', 'Ceramic brakes', 'AMG Track Pace', 'Burmester', 'Bucket seats']
      }
    },
    {
      id: 'mercedes-amg-g63', brand: 'Mercedes-AMG', model: 'G 63', trim: 'Grand Edition',
      year: 2024, mileage: 1800, power: 585, price: 28400000, body: 'suv', photo: '1520031441872-265e4ff70366',
      engine: { ru: 'V8 4.0 л, битурбо', en: '4.0 L twin-turbo V8' }, torque: 850, accel: 4.5, top: 240, drive: 'awd',
      gearbox: { ru: 'Автомат AMG Speedshift, 9 ст.', en: '9-speed AMG Speedshift' }, color: 'Kalahari Gold Magno',
      interior: { ru: 'Кожа Nappa Black', en: 'Black Nappa leather' }, owners: 0, status: 'stock', badge: { ru: 'Новый', en: 'Brand new' },
      desc: {
        ru: 'Икона, которая не нуждается в представлении. Три блокировки дифференциалов, рамная конструкция и интерьер уровня S-класса. Серия Grand Edition с золотыми акцентами — всего 1 000 экземпляров в мире.',
        en: 'An icon that needs no introduction. Three locking differentials, a ladder frame and an S-Class-level cabin. The Grand Edition with gold accents is limited to 1,000 cars worldwide.'
      },
      features: {
        ru: ['Три блокировки', 'Пакет AMG Night', 'Burmester Surround', 'Массаж сидений', 'Камеры 360°', 'Карбоновые вставки'],
        en: ['Three diff locks', 'AMG Night package', 'Burmester Surround', 'Massage seats', '360° cameras', 'Carbon trim']
      }
    },
    {
      id: 'range-rover-sv', brand: 'Range Rover', model: 'SV', trim: 'LWB Serenity',
      year: 2024, mileage: 2300, power: 615, price: 33600000, body: 'suv', photo: '1563720223185-11003d516935',
      engine: { ru: 'V8 4.4 л, битурбо', en: '4.4 L twin-turbo V8' }, torque: 750, accel: 4.6, top: 250, drive: 'awd',
      gearbox: { ru: 'Автомат ZF, 8 ст.', en: '8-speed ZF automatic' }, color: 'Carpathian Grey',
      interior: { ru: 'Кожа Semi-Aniline Perlino', en: 'Semi-aniline leather, Perlino' }, owners: 0, status: 'order', badge: null,
      desc: {
        ru: 'Флагман флагманов: удлинённая база, задние кресла с функцией «оттоманки», холодильник и складные столики. Range Rover SV создан для тех, кто предпочитает задний ряд, но не готов отказаться от проходимости.',
        en: 'The flagship of flagships: long wheelbase, ottoman-style rear seats, a fridge and fold-out tables. The Range Rover SV is for those who prefer the back seat but won’t give up on going off-road.'
      },
      features: {
        ru: ['Кресла Executive Class', 'Холодильник', 'Meridian Signature', 'Пневмоподвеска', 'Подруливающая задняя ось', 'Керамические регуляторы'],
        en: ['Executive Class seats', 'Fridge', 'Meridian Signature', 'Air suspension', 'Rear-wheel steering', 'Ceramic controls']
      }
    },
    {
      id: 'audi-rs7-performance', brand: 'Audi', model: 'RS 7 Sportback', trim: 'performance',
      year: 2023, mileage: 9500, power: 630, price: 17400000, body: 'sedan', photo: '1616422285623-13ff0162193c',
      engine: { ru: 'V8 4.0 TFSI, битурбо', en: '4.0 TFSI twin-turbo V8' }, torque: 850, accel: 3.4, top: 305, drive: 'awd',
      gearbox: { ru: 'Автомат Tiptronic, 8 ст.', en: '8-speed Tiptronic' }, color: 'Nardo Grey',
      interior: { ru: 'Кожа Valcona, сота', en: 'Valcona leather, honeycomb' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Пять дверей, четыре места и 630 сил — RS 7 performance умеет всё: отвезти детей в школу и проехать круг быстрее большинства купе. Керамические тормоза, Dynamic Package Plus и 305 км/ч максимальной скорости.',
        en: 'Five doors, four seats and 630 hp: the RS 7 performance does it all, from the school run to a lap faster than most coupés. Ceramic brakes, Dynamic Package Plus and a 305 km/h top speed.'
      },
      features: {
        ru: ['Керамические тормоза', 'Dynamic Package Plus', 'Bang & Olufsen 3D', 'Матричные HD-фары', 'Пневмоподвеска', 'Head-Up дисплей'],
        en: ['Ceramic brakes', 'Dynamic Package Plus', 'Bang & Olufsen 3D', 'HD Matrix headlights', 'Air suspension', 'Head-up display']
      }
    },
    {
      id: 'bmw-m5-competition', brand: 'BMW', model: 'M5 Competition', trim: 'F90 LCI',
      year: 2023, mileage: 14800, power: 625, price: 15900000, body: 'sedan', photo: '1555215695-3004980ad54e',
      engine: { ru: 'V8 4.4 л, битурбо', en: '4.4 L twin-turbo V8' }, torque: 750, accel: 3.3, top: 305, drive: 'awd',
      gearbox: { ru: 'Автомат M Steptronic, 8 ст.', en: '8-speed M Steptronic' }, color: 'Alpine White',
      interior: { ru: 'Кожа Merino Silverstone', en: 'Merino leather, Silverstone' }, owners: 1, status: 'stock', badge: null,
      desc: {
        ru: 'Бизнес-седан, который умеет отключать передний привод и устраивать шоу на любой площадке. Комплектация Competition с жёсткими опорами двигателя, кресла M Carbon и пакет M Driver’s Package.',
        en: 'A business saloon that can switch to rear-wheel drive and put on a show anywhere. Competition spec with stiffer engine mounts, M Carbon seats and the M Driver’s Package.'
      },
      features: {
        ru: ['Кресла M Carbon', 'M Driver’s Package', 'Bowers & Wilkins', 'Laserlight', 'Head-Up дисплей', 'Доводчики дверей'],
        en: ['M Carbon seats', 'M Driver’s Package', 'Bowers & Wilkins', 'Laserlight', 'Head-up display', 'Soft-close doors']
      }
    },
    {
      id: 'lamborghini-huracan-sto', brand: 'Lamborghini', model: 'Huracán STO', trim: 'Blu Laufey',
      year: 2022, mileage: 3700, power: 640, price: 43200000, body: 'coupe', photo: '1621135802920-133df287f89c',
      engine: { ru: 'V10 5.2 л, атмосферный', en: '5.2 L naturally aspirated V10' }, torque: 565, accel: 3.0, top: 310, drive: 'rwd',
      gearbox: { ru: 'Робот LDF, 7 ст.', en: '7-speed LDF dual-clutch' }, color: 'Blu Laufey',
      interior: { ru: 'Alcantara / карбон', en: 'Alcantara / carbon' }, owners: 1, status: 'stock', badge: { ru: 'Трек', en: 'Track' },
      desc: {
        ru: 'Super Trofeo Omologata — гоночный Huracán, получивший номера. Капот-«кофанго» из единой карбоновой детали, акулий плавник и 420 кг прижимной силы на 280 км/ч. Для тех, кто ездит на трек своим ходом.',
        en: 'Super Trofeo Omologata: a race-bred Huracán with number plates. A one-piece carbon “cofango” front, a shark fin and 420 kg of downforce at 280 km/h. For people who drive to the track and back.'
      },
      features: {
        ru: ['Кофанго из карбона', 'Тормоза CCM-R', 'Каркас безопасности', 'Телеметрия LDVI', 'Шины Bridgestone Potenza', 'Четырёхточечные ремни'],
        en: ['One-piece carbon cofango', 'CCM-R brakes', 'Roll cage', 'LDVI telemetry', 'Bridgestone Potenza tyres', 'Four-point harnesses']
      }
    }
  ];

  CARS.forEach((c) => (c.gallery = gallery(c.photo, c.extra || [])));

  const BRANDS = [...new Set(CARS.map((c) => c.brand))].sort();
  const BODIES = {
    coupe: { ru: 'Купе', en: 'Coupé' },
    sedan: { ru: 'Седан', en: 'Saloon' },
    suv: { ru: 'Внедорожник', en: 'SUV' },
    hyper: { ru: 'Гиперкар', en: 'Hypercar' }
  };
  const DRIVES = { awd: { ru: 'Полный (AWD)', en: 'All-wheel drive' }, rwd: { ru: 'Задний (RWD)', en: 'Rear-wheel drive' } };
  const STATUS = { stock: { ru: 'В наличии', en: 'In stock' }, request: { ru: 'По запросу', en: 'On request' }, order: { ru: 'Под заказ', en: 'To order' } };

  const fmtNum = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ');
  const fmtPrice = (n) => fmtNum(n) + ' ₽';

  window.AL = Object.assign(window.AL || {}, { CARS, BRANDS, BODIES, DRIVES, STATUS, IMG, fmtPrice, fmtNum });
})();
