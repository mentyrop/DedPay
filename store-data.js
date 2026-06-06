/* DedPay — store catalog data (RU). Exposed on window.DEDPAY_STORE.
   DedPay оказывает услуги цифрового содействия: оформление доступа,
   продление подписок, пополнение балансов. Не является официальным
   представителем правообладателей. */
(function () {
  var TG = "https://t.me/dedpayrobot";

  /* legal disclaimer reused on every service page */
  var DISCLAIMER =
    "DedPay оказывает услугу цифрового содействия в оплате и оформлении доступа к стороннему сервису. " +
    "DedPay не является официальным представителем правообладателя этого сервиса. " +
    "Все товарные знаки принадлежат их владельцам.";

  /* content templates by service type */
  var SUB = {
    badge: "Услуга оформления",
    includes: [
      "Оформление доступа к подписке на выбранный срок",
      "Активация на ваш аккаунт или оформление нового доступа",
      "Сопровождение поддержкой до подтверждения результата",
      "Инструкция по использованию после оформления",
    ],
    needs: [
      "Email или логин аккаунта сервиса",
      "Регион аккаунта, если требуется",
      "Выбранный тариф или срок подписки",
      "Email или телефон для связи",
    ],
    conditions: [
      "Срок выполнения отсчитывается с момента подтверждения оплаты.",
      "Для активации может потребоваться вход в аккаунт или подтверждение по коду.",
      "Возврат — в соответствии с опубликованными условиями возврата.",
    ],
  };
  var TOP = {
    badge: "Пополнение",
    includes: [
      "Пополнение баланса сервиса на выбранный номинал",
      "Зачисление средств на ваш аккаунт или выдача кода",
      "Сопровождение поддержкой до зачисления",
      "Подтверждение выполнения заказа",
    ],
    needs: [
      "Логин, ID или ссылка на профиль в сервисе",
      "Регион аккаунта, если требуется",
      "Выбранный номинал пополнения",
      "Email или телефон для связи",
    ],
    conditions: [
      "Зачисление выполняется после подтверждения оплаты.",
      "Номинал и регион должны соответствовать аккаунту получателя.",
      "Возврат — в соответствии с опубликованными условиями возврата.",
    ],
  };

  function mk(p) {
    var tpl = p.kind === "top" ? TOP : SUB;
    var prices = (p.tiers || []).map(function (t) { return t.price; }).filter(function (x) { return x != null; });
    return {
      id: p.id,
      slug: p.id,
      category: p.category,
      categoryLabel: p.categoryLabel,
      name: p.name,
      icon: p.icon,
      type: tpl.badge,
      tierLabel: p.tierLabel || (p.kind === "top" ? "Номинал" : "Срок подписки"),
      tagline: p.tagline,
      desc: p.desc,
      term: p.term,
      tiers: p.tiers || null,
      custom: p.custom || null,
      fromPrice: p.custom ? p.custom.min : (prices.length ? Math.min.apply(null, prices) : null),
      includes: p.includes || tpl.includes,
      needs: p.needs || tpl.needs,
      conditions: p.conditions || tpl.conditions,
      disclaimer: DISCLAIMER,
    };
  }

  var categories = [
    { id: "music", icon: "music", title: "Музыкальные подписки", desc: "Стриминговые сервисы, оформление и продление." },
    { id: "games", icon: "gamepad-2", title: "Игровые балансы", desc: "Пополнение кошельков и игровых платформ." },
    { id: "apple", icon: "smartphone", title: "Apple-сервисы", desc: "Подписки и пополнение в экосистеме Apple." },
    { id: "video", icon: "play", title: "Видео и entertainment", desc: "Видеосервисы и развлекательные платформы." },
    { id: "cards", icon: "gift", title: "Подарочные карты", desc: "Цифровые карты для зарубежных сервисов." },
    { id: "other", icon: "layers", title: "Другие цифровые сервисы", desc: "Не нашли нужное — оформим по запросу." },
  ];
  var catLabel = {};
  categories.forEach(function (c) { catLabel[c.id] = c.title; });

  var raw = [
    /* ---- music ---- */
    { id: "spotify-premium", category: "music", name: "Оформление доступа Spotify Premium", icon: "music", kind: "sub",
      tagline: "Музыка без рекламы и офлайн", desc: "Оформление доступа к Spotify Premium на выбранный срок.", term: "15–90 минут",
      tiers: [{ label: "1 месяц", price: 349 }, { label: "3 месяца", price: 899 }, { label: "6 месяцев", price: 1599 }, { label: "12 месяцев", price: 2790 }] },
    { id: "apple-music", category: "music", name: "Оформление Apple Music", icon: "music-2", kind: "sub",
      tagline: "Каталог Apple Music", desc: "Оформление доступа к подписке Apple Music.", term: "15–90 минут",
      tiers: [{ label: "1 месяц", price: 299 }, { label: "3 месяца", price: 799 }, { label: "6 месяцев", price: 1490 }, { label: "12 месяцев", price: 2590 }] },
    { id: "soundcloud-go", category: "music", name: "Оформление SoundCloud Go+", icon: "audio-lines", kind: "sub",
      tagline: "Полный доступ к трекам", desc: "Оформление подписки SoundCloud Go+.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 349 }, { label: "3 месяца", price: 899 }, { label: "12 месяцев", price: 2890 }] },
    { id: "tidal-hifi", category: "music", name: "Оформление Tidal HiFi", icon: "music-2", kind: "sub",
      tagline: "Lossless-качество звука", desc: "Оформление доступа к подписке Tidal HiFi.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 449 }, { label: "3 месяца", price: 1190 }, { label: "12 месяцев", price: 3990 }] },
    { id: "deezer-premium", category: "music", name: "Оформление Deezer Premium", icon: "music", kind: "sub",
      tagline: "Музыка без ограничений", desc: "Оформление доступа к подписке Deezer Premium.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 349 }, { label: "3 месяца", price: 899 }, { label: "12 месяцев", price: 2890 }] },

    /* ---- games ---- */
    { id: "steam-topup", category: "games", name: "Пополнение Steam", icon: "gamepad-2", kind: "top",
      tagline: "Баланс кошелька Steam", desc: "Пополнение кошелька Steam на любую сумму от 1 ₽.", term: "15–60 минут",
      tierLabel: "Сумма пополнения",
      custom: { min: 1, feePct: 12, presets: [500, 1000, 2000, 5000], default: 1000 } },
    { id: "psn-topup", category: "games", name: "Пополнение баланса PSN", icon: "gamepad", kind: "top",
      tagline: "PlayStation Network", desc: "Пополнение баланса аккаунта PlayStation Network.", term: "15–90 минут",
      tiers: [{ label: "500 ₽", price: 620 }, { label: "1000 ₽", price: 1180 }, { label: "2500 ₽", price: 2790 }, { label: "5000 ₽", price: 5590 }] },
    { id: "roblox-robux", category: "games", name: "Пополнение Roblox (Robux)", icon: "dices", kind: "top",
      tagline: "Robux на ваш аккаунт", desc: "Пополнение игрового баланса Roblox в Robux.", term: "до 2 часов",
      tiers: [{ label: "400 Robux", price: 449 }, { label: "800 Robux", price: 849 }, { label: "1700 Robux", price: 1690 }] },
    { id: "xbox-gamepass", category: "games", name: "Оформление Xbox Game Pass", icon: "joystick", kind: "sub",
      tagline: "Game Pass Ultimate", desc: "Оформление доступа к подписке Xbox Game Pass.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 599 }, { label: "3 месяца", price: 1690 }] },
    { id: "fortnite-vbucks", category: "games", name: "Пополнение Fortnite (V-Bucks)", icon: "gamepad-2", kind: "top",
      tagline: "V-Bucks на аккаунт", desc: "Пополнение внутриигрового баланса Fortnite в V-Bucks.", term: "до 2 часов",
      tiers: [{ label: "1000 V-Bucks", price: 749 }, { label: "2800 V-Bucks", price: 1890 }, { label: "5000 V-Bucks", price: 3290 }] },
    { id: "genshin-crystals", category: "games", name: "Пополнение Genshin Impact", icon: "sparkles", kind: "top",
      tagline: "Genesis Crystals", desc: "Пополнение баланса Genshin Impact в Genesis Crystals.", term: "до 2 часов",
      tiers: [{ label: "980 кристаллов", price: 1090 }, { label: "1980 кристаллов", price: 1990 }, { label: "3280 кристаллов", price: 3190 }] },
    { id: "nintendo-eshop", category: "games", name: "Пополнение Nintendo eShop", icon: "gamepad", kind: "top",
      tagline: "Баланс Nintendo eShop", desc: "Пополнение баланса аккаунта Nintendo eShop.", term: "до 3 часов",
      tiers: [{ label: "1000 ₽", price: 1190 }, { label: "2000 ₽", price: 2290 }, { label: "5000 ₽", price: 5590 }] },

    /* ---- apple ---- */
    { id: "appstore-topup", category: "apple", name: "Пополнение App Store", icon: "smartphone", kind: "top",
      tagline: "Баланс Apple ID", desc: "Пополнение баланса App Store / Apple ID на выбранный номинал.", term: "15–60 минут",
      tiers: [{ label: "500 ₽", price: 590 }, { label: "1000 ₽", price: 1140 }, { label: "2000 ₽", price: 2240 }, { label: "5000 ₽", price: 5490 }] },
    { id: "apple-one", category: "apple", name: "Оформление Apple One", icon: "boxes", kind: "sub",
      tagline: "Музыка, iCloud, аркада", desc: "Оформление комплексной подписки Apple One.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 799 }, { label: "3 месяца", price: 2290 }] },
    { id: "icloud-plus", category: "apple", name: "Оформление iCloud+", icon: "cloud", kind: "sub",
      tagline: "Облачное хранилище", desc: "Оформление подписки iCloud+ на нужный объём.", term: "до 3 часов",
      tierLabel: "Объём",
      tiers: [{ label: "50 ГБ", price: 199 }, { label: "200 ГБ", price: 399 }, { label: "2 ТБ", price: 1290 }] },
    { id: "apple-tv-plus", category: "apple", name: "Оформление Apple TV+", icon: "tv", kind: "sub",
      tagline: "Оригинальные сериалы", desc: "Оформление доступа к подписке Apple TV+.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 299 }, { label: "3 месяца", price: 799 }] },
    { id: "apple-arcade", category: "apple", name: "Оформление Apple Arcade", icon: "joystick", kind: "sub",
      tagline: "Игры без рекламы", desc: "Оформление доступа к подписке Apple Arcade.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 299 }, { label: "3 месяца", price: 799 }] },

    /* ---- video ---- */
    { id: "youtube-premium", category: "video", name: "Оформление YouTube Premium", icon: "play", kind: "sub",
      tagline: "Без рекламы + Music", desc: "Оформление доступа к YouTube Premium.", term: "15–90 минут",
      tiers: [{ label: "1 месяц", price: 399 }, { label: "3 месяца", price: 1090 }, { label: "6 месяцев", price: 1990 }, { label: "12 месяцев", price: 3490 }] },
    { id: "discord-nitro", category: "video", name: "Оформление Discord Nitro", icon: "message-circle", kind: "sub",
      tagline: "Nitro со всеми бонусами", desc: "Оформление доступа к подписке Discord Nitro.", term: "15–90 минут",
      tiers: [{ label: "1 месяц", price: 449 }, { label: "12 месяцев", price: 3990 }] },
    { id: "twitch-turbo", category: "video", name: "Оформление Twitch Turbo", icon: "tv", kind: "sub",
      tagline: "Без рекламы на Twitch", desc: "Оформление доступа к подписке Twitch Turbo.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 499 }, { label: "3 месяца", price: 1390 }] },
    { id: "telegram-premium", category: "video", name: "Оформление Telegram Premium", icon: "send", kind: "sub",
      tagline: "Расширенные возможности", desc: "Оформление доступа к подписке Telegram Premium.", term: "15–90 минут",
      tiers: [{ label: "1 месяц", price: 399 }, { label: "3 месяца", price: 1090 }, { label: "12 месяцев", price: 3490 }] },
    { id: "crunchyroll", category: "video", name: "Оформление Crunchyroll Mega Fan", icon: "play", kind: "sub",
      tagline: "Аниме без рекламы", desc: "Оформление доступа к подписке Crunchyroll Mega Fan.", term: "до 3 часов",
      tiers: [{ label: "1 месяц", price: 449 }, { label: "3 месяца", price: 1290 }] },

    /* ---- cards ---- */
    { id: "card-appstore", category: "cards", name: "Подарочная карта App Store", icon: "gift", kind: "top",
      tagline: "Цифровой код App Store", desc: "Оформление подарочной карты App Store нужного номинала.", term: "15–60 минут",
      tiers: [{ label: "1000 ₽", price: 1140 }, { label: "2000 ₽", price: 2240 }, { label: "5000 ₽", price: 5490 }] },
    { id: "card-steam", category: "cards", name: "Подарочная карта Steam", icon: "gift", kind: "top",
      tagline: "Цифровой код Steam", desc: "Оформление подарочной карты Steam нужного номинала.", term: "15–60 минут",
      tiers: [{ label: "1000 ₽", price: 1140 }, { label: "2000 ₽", price: 2240 }, { label: "5000 ₽", price: 5490 }] },
    { id: "card-googleplay", category: "cards", name: "Подарочная карта Google Play", icon: "gift", kind: "top",
      tagline: "Цифровой код Google Play", desc: "Оформление подарочной карты Google Play нужного номинала.", term: "15–90 минут",
      tiers: [{ label: "1000 ₽", price: 1140 }, { label: "2000 ₽", price: 2240 }, { label: "5000 ₽", price: 5490 }] },
    { id: "card-psn", category: "cards", name: "Подарочная карта PlayStation Store", icon: "gift", kind: "top",
      tagline: "Цифровой код PSN", desc: "Оформление подарочной карты PlayStation Store нужного номинала.", term: "15–90 минут",
      tiers: [{ label: "1000 ₽", price: 1180 }, { label: "2000 ₽", price: 2290 }, { label: "5000 ₽", price: 5590 }] },
    { id: "card-xbox", category: "cards", name: "Подарочная карта Xbox", icon: "gift", kind: "top",
      tagline: "Цифровой код Xbox", desc: "Оформление подарочной карты Xbox нужного номинала.", term: "15–90 минут",
      tiers: [{ label: "1000 ₽", price: 1140 }, { label: "2000 ₽", price: 2240 }, { label: "5000 ₽", price: 5490 }] },

    /* ---- other ---- */
    { id: "custom-request", category: "other", name: "Цифровой сервис по запросу", icon: "layers", kind: "sub",
      tagline: "Нет в каталоге — оформим", desc: "Оформление доступа или пополнение для сервиса, которого нет в каталоге. Стоимость рассчитывается индивидуально.", term: "по согласованию",
      tierLabel: "Формат", tiers: [{ label: "Уточнить стоимость", price: null }],
      needs: ["Название и ссылка на сервис", "Что нужно: оформление доступа или пополнение", "Регион аккаунта, если требуется", "Email или телефон для связи"] },
  ];

  raw.forEach(function (p) { p.categoryLabel = catLabel[p.category]; });
  var products = raw.map(mk);
  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });

  window.DEDPAY_STORE = {
    tg: TG,
    disclaimer: DISCLAIMER,
    categories: categories,
    products: products,
    byId: byId,
    get: function (id) { return byId[id] || null; },
    byCategory: function (cat) {
      return cat === "all" || !cat ? products : products.filter(function (p) { return p.category === cat; });
    },
  };
})();
