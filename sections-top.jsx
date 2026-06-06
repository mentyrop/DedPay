/* DedPay — Header, Hero (3 variants), Categories */
const { useState: useStateT, useEffect: useEffectT, useRef: useRefT } = React;

/* ---------------- Cart button (live badge) ---------------- */
function LandingCart() {
  const [count, setCount] = useStateT(window.DedCart ? window.DedCart.count() : 0);
  useEffectT(() => {
    if (!window.DedCart) return;
    setCount(window.DedCart.count());
    return window.DedCart.subscribe(function (items) {
      setCount(items.reduce(function (n, x) { return n + (x.qty || 0); }, 0));
    });
  }, []);
  return (
    <a className="cart-btn" href="cart.html" aria-label={"Корзина: " + count}>
      <Icon name="shopping-cart" />
      {count > 0 && <span className="cart-badge">{count}</span>}
    </a>);

}

/* ---------------- Header ---------------- */
function Header({ data, onMenu }) {
  const [scrolled, setScrolled] = useStateT(false);
  useEffectT(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"header" + (scrolled ? " scrolled" : "")} id="top">
      <div className="container header-inner">
        <Logo />
        <nav className="nav">
          {data.nav.map((n) =>
          <a key={n.href} href={n.href}>{n.label}</a>
          )}
        </nav>
        <div className="header-actions">
          <Button variant="primary" href="catalog.html"><Icon name="layout-grid" size={18} />Перейти в каталог</Button>
          <LandingCart />
          <button className="hamburger" onClick={onMenu} aria-label="Меню">
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </header>);

}

/* ---------------- Service marquee ---------------- */
function ServiceMarquee({ services }) {
  const row = [...services, ...services];
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {row.map((s, i) =>
        <span className="svc-pill" key={i}>
            <span className="glyph"><Icon name={s.icon} size={14} /></span>
            {s.name}
          </span>
        )}
      </div>
    </div>);

}

/* ---------------- Checkout / касса preview card ---------------- */
function OrderPreview() {
  const lines = [
    { icon: "music", name: "Spotify Premium", tier: "1 месяц", price: "349 ₽" },
    { icon: "gamepad-2", name: "Пополнение Steam", tier: "1000 ₽", price: "1 140 ₽" },
  ];
  return (
    <div className="tg-card">
      <div className="tg-top">
        <span className="tg-avatar"><img src="assets/dedpay-mark.png" alt="DedPay" /></span>
        <span className="meta">
          <b>Оформление заказа</b>
          <span>dedpay.net · корзина</span>
        </span>
        <span className="ico"><Icon name="shopping-cart" size={18} /><Icon name="shield-check" size={18} /></span>
      </div>
      <div className="order-preview">
        {lines.map((l, i) =>
        <div className="op-line" key={i}>
            <span className="op-ico"><Icon name={l.icon} size={17} /></span>
            <span className="op-info">
              <b>{l.name}</b>
              <span>{l.tier}</span>
            </span>
            <span className="op-price">{l.price}</span>
          </div>
        )}
        <div className="op-div"></div>
        <div className="op-total">
          <span>Итого к оплате</span>
          <b>1 489 ₽</b>
        </div>
        <button className="op-pay" type="button"><Icon name="lock" size={17} />Оплатить на сайте</button>
        <p className="op-note"><Icon name="shield-check" size={13} />Оплата через защищённую онлайн-кассу</p>
      </div>
    </div>);

}

/* ---------------- Hero ---------------- */
function Hero({ data, direction }) {
  const h1Aurora =
  <>Оплата зарубежных<br />цифровых сервисов <span className="accent">без лишней возни</span></>;

  const sub = "DedPay помогает оформить доступ к подпискам, цифровым пополнениям и игровым балансам: Spotify, Apple Music, Steam, PSN, App Store и другим сервисам.";

  const trustRow =
  <div className="hero-trust">
      <span className="item"><Icon name="shield-check" size={16} />Автоматическое оформление</span>
      <span className="item"><Icon name="headphones" size={16} />Поддержка перед оплатой</span>
    </div>;


  const ctas =
  <div className="hero-cta">
      <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={20} />Перейти в каталог</Button>
      <Button variant="ghost" size="lg" href="#how"><Icon name="route" size={20} />Как это работает</Button>
    </div>;


  if (direction === "console") {
    return (
      <section className="hero console">
        <div className="container">
          <div className="hero-grid">
            <Reveal>
              <span className="hero-badge"><span className="dot"></span>Цифровое содействие в оплате</span>
              <h1>{h1Aurora}</h1>
              <p className="hero-sub">{sub}</p>
              {ctas}
              {trustRow}
            </Reveal>
            <Reveal delay={120}><OrderPreview /></Reveal>
          </div>
        </div>
        <div className="container" style={{ marginTop: 56 }}>
          <ServiceMarquee services={data.services} />
        </div>
      </section>);

  }

  if (direction === "spotlight") {
    return (
      <section className="hero spotlight">
        <div className="container">
          <Reveal>
            <span className="hero-badge"><span className="dot"></span>DedPay · цифровое содействие</span>
            <h1>Зарубежные сервисы — <span className="accent">просто оплатить</span></h1>
            <p className="hero-sub">{sub}</p>
            {ctas}
            <div className="hero-foot">
              <span className="stat"><span className="n">10+</span><span className="l">направлений сервисов</span></span>
              <span className="stat"><span className="n">Касса</span><span className="l">оплата прямо на сайте</span></span>
              <span className="stat"><span className="n">Оферта</span><span className="l">работаем по документам</span></span>
            </div>
          </Reveal>
        </div>
        <div className="container" style={{ marginTop: 64 }}>
          <ServiceMarquee services={data.services} />
        </div>
      </section>);

  }

  // aurora (default)
  return (
    <section className="hero aurora">
      <div className="hero-orb"></div>
      <div className="container">
        <Reveal>
          <span className="hero-badge"><span className="dot"></span>Помощь с оплатой подписок</span>
          <h1>{h1Aurora}</h1>
          <p className="hero-sub">{sub}</p>
          {ctas}
          {trustRow}
        </Reveal>
        <Reveal delay={140} className="marquee-wrap-outer">
          <div className="marquee-wrap" style={{ marginTop: 56 }}>
            <div className="marquee">
              {[...data.services, ...data.services].map((s, i) =>
              <span className="svc-pill" key={i}>
                  <span className="glyph"><Icon name={s.icon} size={14} /></span>{s.name}
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ---------------- Categories ---------------- */
function Categories({ data }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="cat-head-row">
          <SectionHead
            eyebrow="Каталог услуг"
            title="Что можно оформить через DedPay"
            sub="Оформление доступа к подпискам, продление и пополнение цифровых сервисов — выберите направление и откройте каталог." />
          <a className="btn btn-ghost cat-head-link" href="catalog.html">Открыть весь каталог<Icon name="arrow-right" size={18} /></a>
        </div>

        <div className="cat-grid">
          {data.categories.map((c, i) =>
          <Reveal
            as="a"
            href={"catalog.html?cat=" + c.id}
            delay={i % 3 * 70}
            key={c.id}
            className="card cat-card cat-link">

              <span className="icon-tile"><Icon name={c.icon} /></span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="cat-examples">
                {c.examples.map((e) => <span key={e}>{e}</span>)}
              </div>
              <span className="cat-go"><Icon name="arrow-up-right" size={17} /></span>
            </Reveal>
          )}
        </div>

        <div className="cat-cta-row">
          <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={20} />Перейти в каталог услуг</Button>
        </div>
      </div>
    </section>);

}

Object.assign(window, { Header, Hero, Categories, ServiceMarquee, OrderPreview });