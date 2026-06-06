/* DedPay — checkout page */
const { useState: useStateCk, useEffect: useEffectCk } = React;

function genRef() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, "0");
  return "DP-" + t + r;
}

function CheckoutApp() {
  const [menu, setMenu] = useStateCk(false);
  const { items, count, total } = useCart();

  const [form, setForm] = useStateCk({ name: "", email: "", phone: "", comment: "" });
  const [agree, setAgree] = useStateCk({ offer: false, privacy: false });
  const [submitted, setSubmitted] = useStateCk(false);

  useEffectCk(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffectCk(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const errors = {
    name: !form.name.trim() ? "Укажите имя или псевдоним" : "",
    email: !form.email.trim() ? "Укажите email" : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "Проверьте формат email" : ""),
    offer: !agree.offer ? "Необходимо согласие" : "",
    privacy: !agree.privacy ? "Необходимо согласие" : "",
  };
  const valid = !errors.name && !errors.email && !errors.offer && !errors.privacy;
  const show = (k) => submitted && errors[k];

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (!valid || items.length === 0) return;
    const ref = genRef();
    const order = {
      ref: ref,
      createdAt: Date.now(),
      total: total,
      count: count,
      items: items.map((x) => ({ name: x.name, tier: x.tier, type: x.type, price: x.price, qty: x.qty })),
      contact: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), comment: form.comment.trim() },
    };
    try { localStorage.setItem("dedpay_last_order", JSON.stringify(order)); } catch (e2) {}
    if (window.DedCart) window.DedCart.clear();
    location.href = "order-success.html?ref=" + encodeURIComponent(ref);
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <StoreHeader current="cart" onMenu={() => setMenu(true)} />
        <main>
          <div className="container">
            <div className="cart-empty">
              <div className="ce-mark"><img src="assets/dedpay-mark.png" alt="DedPay" /></div>
              <h2>Нечего оформлять</h2>
              <p>Сначала добавьте услуги в корзину, затем переходите к оформлению заявки.</p>
              <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={18} />Перейти в каталог</Button>
            </div>
          </div>
        </main>
        <StoreFooter />
        <StoreDrawer open={menu} onClose={() => setMenu(false)} />
      </div>
    );
  }

  return (
    <div className="page">
      <StoreHeader current="cart" onMenu={() => setMenu(true)} />
      <main>
        <section className="container page-head">
          <div className="crumb">
            <a href="index.html">Главная</a>
            <span className="sep">/</span>
            <a href="catalog.html">Каталог</a>
            <span className="sep">/</span>
            <a href="cart.html">Корзина</a>
            <span className="sep">/</span>
            <span className="cur">Оформление</span>
          </div>
          <h1>Оформление заказа</h1>
          <p className="lead">Заполните контактные данные — мы свяжемся с вами и сопроводим заявку до результата.</p>
        </section>

        <div className="container">
          <form className="checkout-layout" onSubmit={submit} noValidate>
            <div>
              <div className="form-card">
                <h2><span className="step-dot">1</span>Контактные данные</h2>
                <p className="fc-sub">Как к вам обращаться и куда написать по заявке.</p>
                <div className="form-grid">
                  <div className={"field" + (show("name") ? " invalid" : "")}>
                    <label>Имя или псевдоним <span className="req">*</span></label>
                    <input type="text" placeholder="Например, Виктор" value={form.name} onChange={set("name")} />
                    {show("name") && <span className="err">{errors.name}</span>}
                  </div>
                  <div className={"field" + (show("email") ? " invalid" : "")}>
                    <label>Email <span className="req">*</span></label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                    {show("email") && <span className="err">{errors.email}</span>}
                  </div>
                  <div className="field">
                    <label>Телефон <span className="opt">необязательно</span></label>
                    <input type="tel" placeholder="+7 900 000-00-00" value={form.phone} onChange={set("phone")} />
                  </div>
                  <div className="field col-2">
                    <label>Комментарий к заказу <span className="opt">необязательно</span></label>
                    <textarea placeholder="Логин аккаунта, регион, выбранный тариф или другие детали для оформления" value={form.comment} onChange={set("comment")}></textarea>
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h2><span className="step-dot">2</span>Согласия</h2>
                <p className="fc-sub">Перед созданием заявки подтвердите согласие с документами.</p>
                <div className="consents">
                  <label className={"consent" + (show("offer") ? " invalid" : "")}>
                    <input type="checkbox" checked={agree.offer} onChange={(e) => setAgree({ ...agree, offer: e.target.checked })} />
                    <span className="box"><Icon name="check" size={14} /></span>
                    <span>Я принимаю условия <a href="offer.html" target="_blank" rel="noopener">публичной оферты</a> и подтверждаю, что услуга носит характер цифрового содействия.</span>
                  </label>
                  <label className={"consent" + (show("privacy") ? " invalid" : "")}>
                    <input type="checkbox" checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })} />
                    <span className="box"><Icon name="check" size={14} /></span>
                    <span>Я согласен с <a href="privacy.html" target="_blank" rel="noopener">политикой конфиденциальности</a> и обработкой персональных данных.</span>
                  </label>
                </div>
              </div>
            </div>

            <aside className="summary">
              <h3>Ваш заказ</h3>
              <div className="summary-rows">
                {items.map((it) => (
                  <div className="summary-row" key={window.DedCart.lineKey(it)}>
                    <span className="sr-name">
                      <b>{it.name}</b>
                      <span>{it.tier ? it.tier + " · " : ""}{it.qty} × {fmt(it.price)}</span>
                    </span>
                    <span className="sr-val">{fmt(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-div"></div>
              <div className="summary-total">
                <span className="tl">Итого к оплате</span>
                <span className="tv">{fmt(total)}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg"><Icon name="check-circle-2" size={18} />Оформить заявку</button>
              {submitted && items.length > 0 && !valid && (
                <p className="undertext" style={{ color: "oklch(0.72 0.16 18)" }}>Проверьте отмеченные поля и согласия выше.</p>
              )}
              <p className="undertext">Нажимая «Оформить заявку», вы создаёте заявку без списания средств.</p>
            </aside>
          </form>
        </div>
      </main>

      <StoreFooter />
      <StoreDrawer open={menu} onClose={() => setMenu(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CheckoutApp />);
