/* DedPay — content (RU). Exposed on window for JSX scripts. */
window.DEDPAY = {
  tg: "https://t.me/dedpayrobot",

  nav: [
    { label: "Каталог", href: "catalog.html" },
    { label: "Как работает", href: "#how" },
    { label: "FAQ", href: "#faq" },
    { label: "Контакты", href: "contacts.html" },
  ],

  // marquee of recognizable service names (text only, no brand logos)
  services: [
    { name: "Spotify Premium", icon: "music" },
    { name: "Apple Music", icon: "music-2" },
    { name: "Steam", icon: "gamepad-2" },
    { name: "PlayStation Network", icon: "gamepad" },
    { name: "App Store", icon: "smartphone" },
    { name: "YouTube Premium", icon: "play" },
    { name: "Discord Nitro", icon: "message-circle" },
    { name: "SoundCloud", icon: "audio-lines" },
    { name: "iCloud+", icon: "cloud" },
    { name: "Подарочные карты", icon: "gift" },
  ],

  categories: [
    {
      id: "music",
      icon: "music",
      title: "Музыкальные подписки",
      desc: "Доступ к стриминговым сервисам и продление подписок.",
      examples: ["Spotify Premium", "Apple Music", "SoundCloud"],
    },
    {
      id: "games",
      icon: "gamepad-2",
      title: "Игровые балансы",
      desc: "Пополнение кошельков и игровых балансов в популярных платформах.",
      examples: ["Steam", "PSN", "Xbox", "Roblox"],
    },
    {
      id: "apple",
      icon: "smartphone",
      title: "Apple",
      desc: "Оплата подписок и пополнение баланса в экосистеме Apple.",
      examples: ["App Store", "Apple Music", "iCloud+", "Apple One"],
    },
    {
      id: "video",
      icon: "play",
      title: "Видео",
      desc: "Подписки на видеосервисы и развлекательные платформы.",
      examples: ["YouTube Premium", "Discord Nitro", "Twitch"],
    },
    {
      id: "cards",
      icon: "gift",
      title: "Подарочные карты",
      desc: "Цифровые подарочные карты для зарубежных сервисов и магазинов.",
      examples: ["App Store", "Steam", "Google Play", "PSN"],
    },
    {
      id: "other",
      icon: "layers",
      title: "Другие цифровые сервисы",
      desc: "Не нашли нужное? Напишите нам — поможем с большинством сервисов.",
      examples: ["По запросу", "Подписки", "Пополнения"],
    },
  ],

  steps: [
    { title: "Переходите в каталог", desc: "Открывайте каталог DedPay в один клик — без регистраций на сайте." },
    { title: "Добавляете в корзину", desc: "Указываете тариф или номинал и добавляете услугу в корзину." },
    { title: "Оформляете заказ", desc: "Заполняете данные, необходимые для оформления доступа или пополнения." },
    { title: "Оплачиваете на сайте", desc: "Оплачиваете заказ онлайн через подключённую кассу — прямо на сайте." },
    { title: "Готово!", desc: "Вы получаете подписку или пополнение баланса в сервисе." },
  ],

  advantages: [
    { icon: "zap", title: "Удобный каталог на сайте", desc: "Всё оформление проходит на сайте — не нужно регистрировать аккаунт." },
    { icon: "headphones", title: "Поддержка перед оплатой", desc: "Поможем выбрать сервис и ответим на вопросы до того, как вы заплатите." },
    { icon: "file-check", title: "Понятные условия", desc: "Прозрачные сроки, стоимость и порядок оформления — без скрытых нюансов." },
    { icon: "globe", title: "Популярные зарубежные сервисы", desc: "Музыка, игры, видео, Apple-сервисы и подарочные карты в одном месте." },
    { icon: "scroll-text", title: "Документы и публичная оферта", desc: "Работаем по публичной оферте, политике конфиденциальности и условиям возврата." },
    { icon: "badge-check", title: "Быстрая оплата", desc: "От оплаты до получения подписки или пополнения — несколько минут." },
  ],

  // brands DedPay is NOT an official representative of (generic category icons, not logos)
  brands: [
    { name: "Spotify", icon: "music" },
    { name: "Apple", icon: "apple" },
    { name: "Sony", icon: "gamepad-2" },
    { name: "Valve", icon: "joystick" },
    { name: "Google", icon: "chrome" },
    { name: "Discord", icon: "message-circle" },
  ],

  faq: [
    {
      q: "DedPay — это официальный представитель сервисов?",
      a: "Нет. DedPay оказывает услуги по содействию в оплате и оформлении доступа к цифровым сервисам. Мы не являемся официальным представителем Spotify, Apple, Sony, Valve, Google, Discord и других правообладателей. Все товарные знаки принадлежат их владельцам.",
    },
    {
      q: "Какие данные нужны для оформления?",
      a: "Состав данных зависит от конкретной услуги: для одних сервисов нужен логин или ссылка на профиль, для других — данные для пополнения баланса. На странице услуги и при оформлении указано, что именно потребуется, до оплаты.",
    },
    {
      q: "Сколько занимает выполнение заказа?",
      a: "Большинство заказов оформляется в короткий срок после оплаты. Точное время выполнения по конкретной услуге всегда можно уточнить в описании услуги или у поддержки до оплаты.",
    },
    {
      q: "Можно ли вернуть деньги?",
      a: "Да, в рамках условий возврата. Если услугу не удалось оказать, мы вернём оплату согласно опубликованным условиям возврата. С полным текстом можно ознакомиться в разделе документов.",
    },
    {
      q: "Что делать, если нужного сервиса нет в списке?",
      a: "Напишите в поддержку — мы помогаем с большинством зарубежных цифровых сервисов, даже если они не указаны в каталоге явно.",
    },
    {
      q: "Где получить поддержку?",
      a: "Техподдержка доступна в Telegram. Можно задать вопрос до оформления заказа, во время оплаты и после получения результата.",
    },
    {
      q: "Как происходит оформление заказа?",
      a: "Вы выбираете услугу в каталоге на сайте, добавляете её в корзину, указываете необходимые данные и оплачиваете заказ на сайте через подключённую кассу. После оплаты мы оформляем доступ или пополнение и сопровождаем вас до результата.",
    },
  ],

  footer: {
    cols: [
      {
        title: "Сервис",
        links: [
          { label: "Каталог услуг", href: "catalog.html" },
          { label: "Как это работает", href: "index.html#how" },
          { label: "Преимущества", href: "index.html#advantages" },
          { label: "Корзина", href: "cart.html" },
        ],
      },
      {
        title: "Документы",
        links: [
          { label: "Публичная оферта", href: "offer.html" },
          { label: "Политика конфиденциальности", href: "privacy.html" },
          { label: "Условия возврата", href: "refund.html" },
          { label: "Контакты", href: "contacts.html" },
        ],
      },
      {
        title: "Связь",
        links: [
          { label: "Поддержка в Telegram", href: "https://t.me/dedpayrobot" },
          { label: "dedpaynet@ya.ru", href: "mailto:dedpaynet@ya.ru" },
          { label: "dedpay.net", href: "https://dedpay.net" },
        ],
      },
    ],
    legal: {
      name: "Мальков Виктор Юрьевич",
      inn: "781448772259",
      status: "Самозанятый, плательщик налога на профессиональный доход",
      email: "dedpaynet@ya.ru",
      phone: "+7 911 278-90-20",
    },
    disclaimer: "DedPay оказывает услуги по содействию в оплате и оформлении доступа к цифровым сервисам. DedPay не является официальным представителем правообладателей сторонних цифровых сервисов. Все товарные знаки принадлежат их владельцам.",
  },
};
