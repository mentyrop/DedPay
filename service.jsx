/* DedPay — service detail page */
const { useState: useStateSvc, useEffect: useEffectSvc } = React;

function getServiceId() {
  return new URLSearchParams(location.search).get("id");
}

function NotFound() {
  return (
    <div className="container" style={{ padding: "80px 0 120px", textAlign: "center" }}>
      <div className="cart-empty">
        <div className="ce-mark"><img src="assets/dedpay-mark.png" alt="DedPay" /></div>
        <h2>Услуга не найдена</h2>
        <p>Возможно, ссылка устарела. Посмотрите доступные услуги в каталоге.</p>
        <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={18} />В каталог</Button>
      </div>
    </div>
  );
}

function ServiceApp() {
  const [menu, setMenu] = useStateSvc(false);
  const p = STORE.get(getServiceId());

  const [tierIdx, setTierIdx] = useStateSvc(0);
  const [qty, setQty] = useStateSvc(1);
  const [added, setAdded] = useStateSvc(false);
  const isCustom = !!(p && p.custom);
  const [amount, setAmount] = useStateSvc(isCustom ? (p.custom.default || p.custom.min) : 0);

  useEffectSvc(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffectSvc(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });
  useEffectSvc(() => { if (p) document.title = p.name + " — DedPay"; }, []);

  if (!p) {
    return (
      <div className="page">
        <StoreHeader current="catalog" onMenu={() => setMenu(true)} />
        <NotFound />
        <StoreFooter />
        <StoreDrawer open={menu} onClose={() => setMenu(false)} />
      </div>
    );
  }

  const tiers = p.tiers || [];
  const tier = tiers[tierIdx] || null;
  const customNominal = isCustom ? Math.floor(Number(amount) || 0) : 0;
  const customValid = isCustom && customNominal >= p.custom.min;
  const unit = isCustom
    ? (customValid ? Math.ceil(customNominal * (100 + p.custom.feePct) / 100) : null)
    : (tier ? tier.price : p.fromPrice);
  const hasPrice = unit != null;
  const lineTotal = hasPrice ? unit * qty : null;
  const isTop = p.type === "Пополнение";

  const related = STORE.byCategory(p.category).filter((x) => x.id !== p.id).slice(0, 3);

  function addToCart() {
    if (!hasPrice || !window.DedCart) return;
    window.DedCart.add({
      id: p.id, slug: p.slug, name: p.name, category: p.categoryLabel,
      type: p.type, tier: isCustom ? fmt(customNominal) : (tier ? tier.label : ""), price: unit,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  }

  return (
    <div className="page">
      <StoreHeader current="catalog" onMenu={() => setMenu(true)} />
      <main>
        <section className="container page-head">
          <div className="crumb">
            <a href="index.html">Главная</a>
            <span className="sep">/</span>
            <a href={"catalog.html?cat=" + p.category}>{p.categoryLabel}</a>
            <span className="sep">/</span>
            <span className="cur">{p.name}</span>
          </div>
        </section>

        <div className="container">
          <div className="svc-detail">
            {/* ---- main ---- */}
            <div className="sd-main">
              <div className="sd-headcard">
                <span className="sd-ico"><Icon name={p.icon} /></span>
                <div>
                  <span className="sd-cat">{p.categoryLabel}</span>
                  <h1>{p.name}</h1>
                </div>
              </div>

              <div className="sd-block">
                <p className="sd-lead">{p.desc} {p.tagline ? "— " + p.tagline.toLowerCase() + "." : ""}</p>
              </div>

              <div className="sd-block">
                <h2><Icon name="package-check" size={18} />Что входит в услугу</h2>
                <ul className="sd-list">
                  {p.includes.map((x, i) => (
                    <li key={i}><Icon name="check" size={18} />{x}</li>
                  ))}
                </ul>
              </div>

              <div className="sd-block">
                <h2><Icon name="clipboard-list" size={18} />Что нужно от клиента</h2>
                <div className="sd-card accent">
                  <ul className="sd-list dots">
                    {p.needs.map((x, i) => (<li key={i}>{x}</li>))}
                  </ul>
                </div>
              </div>

              <div className="sd-block">
                <h2><Icon name="info" size={18} />Важные условия</h2>
                <ul className="sd-list dots">
                  {p.conditions.map((x, i) => (<li key={i}>{x}</li>))}
                </ul>
              </div>

              <div className="sd-block">
                <div className="sd-disclaimer">
                  <Icon name="shield" size={19} />
                  <span>{p.disclaimer}</span>
                </div>
              </div>

              {related.length > 0 && (
                <div className="sd-block">
                  <h2><Icon name="layers" size={18} />Другие услуги в категории</h2>
                  <div className="svc-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                    {related.map((r) => (
                      <a key={r.id} href={"service.html?id=" + r.slug} className="card" style={{ padding: 18, display: "flex", gap: 12, alignItems: "center" }}>
                        <span className="svc-ico sm" style={{ width: 40, height: 40, borderRadius: 11 }}><Icon name={r.icon} size={18} /></span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5, letterSpacing: "-0.01em", color: "var(--text)", lineHeight: 1.25 }}>{r.name}</span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>{r.fromPrice != null ? "от " + fmt(r.fromPrice) : "по запросу"}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ---- purchase panel ---- */}
            <aside className="sd-buy">
              <Badge type={p.type} />
              <div className="price-row">
                <span className="price-now">{hasPrice ? fmt(lineTotal) : "По запросу"}</span>
              </div>
              <div className="price-cap">
                {isCustom
                  ? (customValid
                      ? ("Пополнение на " + fmt(customNominal) + (qty > 1 ? " × " + qty : "") + " · включая сервисный сбор")
                      : ("Введите сумму от " + fmt(p.custom.min)))
                  : (hasPrice
                      ? (qty > 1 ? fmt(unit) + " × " + qty : "за выбранный вариант")
                      : "Стоимость рассчитывается индивидуально")}
              </div>

              {isCustom ? (
                <div className="amount-block">
                  <p className="tier-label">{p.tierLabel}</p>
                  <div className="amount-field">
                    <input
                      type="number" min={p.custom.min} step="1" inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={String(p.custom.min)}
                      aria-label="Сумма пополнения в рублях"
                    />
                    <span className="cur">₽</span>
                  </div>
                  <div className="amount-presets">
                    {p.custom.presets.map((v) => (
                      <button
                        key={v} type="button"
                        className={"amount-preset" + (customNominal === v ? " active" : "")}
                        onClick={() => setAmount(v)}
                      >{fmt(v)}</button>
                    ))}
                  </div>
                  <p className="amount-hint">Любая сумма от {fmt(p.custom.min)}. Цена включает сервисный сбор.</p>
                </div>
              ) : (tiers.length > 0 && hasPrice && (
                <>
                  <p className="tier-label">{p.tierLabel}</p>
                  <div className="tier-opts">
                    {tiers.map((tr, i) => (
                      <button
                        key={i}
                        className={"tier-opt" + (i === tierIdx ? " active" : "")}
                        onClick={() => setTierIdx(i)}
                      >
                        <span className="tl">{tr.label}</span>
                        <span className="tp">{tr.price != null ? fmt(tr.price) : "по запросу"}</span>
                      </button>
                    ))}
                  </div>
                </>
              ))}

              {hasPrice && (
                <div className="qty-row">
                  <span className="ql">Количество</span>
                  <span className="qty">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label="Меньше">−</button>
                    <span className="qv">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} aria-label="Больше">+</button>
                  </span>
                </div>
              )}

              <div className="sd-buy-actions">
                {(hasPrice || isCustom) ? (
                  <>
                    <button className={"btn btn-primary btn-lg" + (added ? " added" : "")} onClick={addToCart} disabled={!hasPrice}>
                      {added ? <><Icon name="check" size={19} />Добавлено в корзину</> : <><Icon name="shopping-cart" size={19} />Добавить в корзину</>}
                    </button>
                    {added && (
                      <a className="btn btn-ghost" href="cart.html"><Icon name="arrow-right" size={17} />Перейти в корзину</a>
                    )}
                    <Button variant="ghost" telegram href={STORE.tg}>Задать вопрос в поддержку</Button>
                  </>
                ) : (
                  <Button variant="primary" size="lg" telegram href={STORE.tg}>Связаться с поддержкой</Button>
                )}
              </div>

              <div className="reassure">
                <span className="r"><Icon name="clock" size={15} />Срок выполнения: {p.term}</span>
                <span className="r"><Icon name="headphones" size={15} />Поддержка перед оплатой и после</span>
                <span className="r"><Icon name="scroll-text" size={15} />Работаем по публичной оферте</span>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreDrawer open={menu} onClose={() => setMenu(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ServiceApp />);
