/* DedPay — shared store UI (React). Loaded AFTER components.jsx.
   Reuses Icon / Button / Logo / TgGlyph from components.jsx.
   NOTE: components.jsx already declares useRef/useEffect/useState globally,
   so here we use distinct aliases. */
const { useState: useStateSC, useEffect: useEffectSC, useRef: useRefSC } = React;

const STORE = window.DEDPAY_STORE;
const fmt = window.fmtPrice;

/* ---- nav model (shared) ---- */
const STORE_NAV = [
  { label: "Главная", href: "index.html" },
  { label: "Каталог", href: "catalog.html", key: "catalog" },
  { label: "Как работает", href: "index.html#how" },
  { label: "FAQ", href: "index.html#faq" },
  { label: "Контакты", href: "contacts.html", key: "contacts" },
];

/* ---- live cart hook ---- */
function useCart() {
  const [items, setItems] = useStateSC(window.DedCart ? window.DedCart.items() : []);
  useEffectSC(() => {
    if (!window.DedCart) return;
    setItems(window.DedCart.items());
    return window.DedCart.subscribe(setItems);
  }, []);
  const count = items.reduce((n, x) => n + (x.qty || 0), 0);
  const total = items.reduce((s, x) => s + (x.price || 0) * (x.qty || 0), 0);
  return { items, count, total };
}

/* ---- type badge ---- */
function Badge({ type }) {
  const isTop = type === "Пополнение";
  return (
    <span className={"badge " + (isTop ? "type-top" : "type-sub")}>
      <span className="bdot"></span>{type}
    </span>
  );
}

/* ---- cart button with animated badge ---- */
function CartButton() {
  const { count } = useCart();
  const [pop, setPop] = useStateSC(false);
  const prev = useRefSC(count);
  useEffectSC(() => {
    if (count > prev.current) { setPop(true); const t = setTimeout(() => setPop(false), 420); return () => clearTimeout(t); }
    prev.current = count;
  }, [count]);
  useEffectSC(() => { prev.current = count; });
  return (
    <a className="cart-btn" href="cart.html" aria-label={"Корзина: " + count}>
      <Icon name="shopping-cart" />
      {count > 0 && <span className={"cart-badge" + (pop ? " pop" : "")}>{count}</span>}
    </a>
  );
}

/* ---- header ---- */
function StoreHeader({ current, onMenu }) {
  const [scrolled, setScrolled] = useStateSC(false);
  useEffectSC(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"sheader" + (scrolled ? " scrolled" : "")}>
      <div className="container sheader-inner">
        <Logo />
        <nav className="nav">
          {STORE_NAV.map((n) => (
            <a key={n.href} href={n.href} className={n.key && n.key === current ? "cur" : ""}>{n.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <CartButton />
          <button className="hamburger" onClick={onMenu} aria-label="Меню"><Icon name="menu" /></button>
        </div>
      </div>
    </header>
  );
}

/* ---- mobile drawer ---- */
function StoreDrawer({ open, onClose }) {
  const { count } = useCart();
  return (
    <div className={"mobile-drawer" + (open ? " open" : "")}>
      <div className="md-top">
        <Logo onClick={onClose} />
        <button className="md-close" onClick={onClose} aria-label="Закрыть"><Icon name="x" /></button>
      </div>
      <nav className="md-nav">
        {STORE_NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={onClose}>{n.label}</a>
        ))}
        <a href="cart.html" onClick={onClose}>Корзина{count > 0 ? " · " + count : ""}</a>
      </nav>
      <div className="md-foot">
        <Button variant="primary" size="lg" href="catalog.html" className="btn-block"><Icon name="layout-grid" size={18} />Перейти в каталог</Button>
        <Button variant="ghost" telegram href={STORE.tg} className="btn-block" onClick={onClose}>Задать вопрос в поддержку</Button>
      </div>
    </div>
  );
}

/* ---- footer (mirrors landing) ---- */
function StoreFooter() {
  const D = window.DEDPAY;
  const f = D.footer;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="logo" href="index.html">
              <span className="logo-mark img"><img src="assets/dedpay-mark.png" alt="DedPay" /></span>
              <span className="logo-word">Ded<b>Pay</b></span>
            </a>
            <p>Сервис цифрового содействия в оплате зарубежных подписок, пополнений и игровых балансов.</p>
          </div>
          {f.cols.map((col) => (
            <div className="footer-col" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => {
                const ext = l.href.startsWith("http");
                return <a key={l.label} href={l.href} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>{l.label}</a>;
              })}
            </div>
          ))}
        </div>
        <div className="footer-legal">
          <p className="small">© DedPay, 2026 · {f.legal.name} · ИНН {f.legal.inn}</p>
          {f.legal.address && <p className="small dim">{f.legal.address}</p>}
          <p className="small dim">
            <a href={"mailto:" + f.legal.email}>{f.legal.email}</a> · <a href={"tel:" + f.legal.phone.replace(/[^+\d]/g, "")}>{f.legal.phone}</a>
          </p>
        </div>
        <div className="footer-bottom">
          <p className="small"><b>DedPay · dedpay.net</b> — {f.disclaimer}</p>
          <Button variant="ghost" telegram href={STORE.tg}>Поддержка в Telegram</Button>
        </div>
      </div>
    </footer>
  );
}

/* ---- service card (2 variants: a / b) ---- */
function ServiceCard({ p, variant = "a" }) {
  const [added, setAdded] = useStateSC(false);
  const hasPrice = p.fromPrice != null;
  const canQuickAdd = hasPrice && !p.custom;
  const href = "service.html?id=" + p.slug;

  function add(e) {
    e.preventDefault();
    if (!hasPrice || !window.DedCart) return;
    const tier = p.tiers && p.tiers[0];
    window.DedCart.add({
      id: p.id, slug: p.slug, name: p.name, category: p.categoryLabel,
      type: p.type, tier: tier ? tier.label : "", price: p.fromPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  }

  const priceBlock = (
    <div className="svc-price">
      <span className="lab">Стоимость</span>
      <span className="val">
        {hasPrice && ((p.tiers && p.tiers.length > 1) || p.custom) && <span className="from">от</span>}
        {hasPrice ? fmt(p.fromPrice) : "по запросу"}
      </span>
    </div>
  );

  const meta = (
    <span className="svc-meta"><Icon name="clock" size={15} />Срок: {p.term}</span>
  );

  if (variant === "b") {
    return (
      <article className="svc-card v-b">
        <div className="vb-head">
          <span className="svc-ico sm"><Icon name={p.icon} /></span>
          <div className="vb-headmeta">
            <span className="svc-cat">{p.categoryLabel}</span>
            <Badge type={p.type} />
          </div>
        </div>
        <h3><a href={href}>{p.name}</a></h3>
        <p className="vb-tagline">{p.tagline}</p>
        <div className="vb-priceline">
          {priceBlock}
          {meta}
        </div>
        <div className="vb-actions">
          <a className="btn btn-ghost btn-sm" href={href}>Подробнее</a>
          {canQuickAdd ? (
            <button className={"btn btn-primary btn-sm vb-add" + (added ? " added" : "")} onClick={add}>
              {added ? <><Icon name="check" size={16} />Добавлено</> : <><Icon name="plus" size={16} />В корзину</>}
            </button>
          ) : (
            <a className="btn btn-primary btn-sm" href={href}><Icon name="arrow-right" size={15} />Уточнить</a>
          )}
        </div>
      </article>
    );
  }

  /* variant a (default) */
  return (
    <article className="svc-card">
      <div className="svc-card-top">
        <span className="svc-ico"><Icon name={p.icon} /></span>
        <Badge type={p.type} />
      </div>
      <div className="svc-cat">{p.categoryLabel}</div>
      <h3><a href={href} style={{ color: "inherit" }}>{p.name}</a></h3>
      <p className="svc-desc">{p.desc}</p>
      {meta}
      <div className="svc-foot">
        {priceBlock}
        <div className="svc-actions">
          <a className="btn btn-ghost btn-sm" href={href}>Подробнее</a>
          {canQuickAdd ? (
            <button className={"btn btn-primary btn-ico" + (added ? " added" : "")} onClick={add} aria-label="В корзину" title="В корзину">
              <Icon name={added ? "check" : "plus"} size={19} />
            </button>
          ) : (
            <a className="btn btn-primary btn-ico" href={href} aria-label="Подробнее"><Icon name="arrow-right" size={17} /></a>
          )}
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { useCart, Badge, CartButton, StoreHeader, StoreDrawer, StoreFooter, ServiceCard, STORE_NAV });
