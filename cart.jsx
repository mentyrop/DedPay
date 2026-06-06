/* DedPay — cart page */
const { useState: useStateCart, useEffect: useEffectCart } = React;

function CartLine({ item }) {
  const [removing, setRemoving] = useStateCart(false);
  const key = window.DedCart.lineKey(item);
  const prod = STORE.get(item.id);
  const icon = prod ? prod.icon : "package";

  function setQty(n) { window.DedCart.setQty(key, n); }
  function remove() {
    setRemoving(true);
    setTimeout(() => window.DedCart.remove(key), 240);
  }

  return (
    <div className={"cart-line" + (removing ? " removing" : "")}>
      <span className="cl-ico"><Icon name={icon} /></span>
      <div className="cl-info">
        <div className="cl-cat">{item.category}</div>
        <h3 className="cl-name"><a href={"service.html?id=" + item.id}>{item.name}</a></h3>
        <span className="cl-tier">
          <Badge type={item.type} />
          {item.tier ? <span>· {item.tier}</span> : null}
        </span>
      </div>
      <div className="cl-right">
        <span className="cl-price">{fmt(item.price * item.qty)}</span>
        <div className="cl-controls">
          <span className="qty">
            <button onClick={() => setQty(item.qty - 1)} disabled={item.qty <= 1} aria-label="Меньше">−</button>
            <span className="qv">{item.qty}</span>
            <button onClick={() => setQty(item.qty + 1)} aria-label="Больше">+</button>
          </span>
          <button className="cl-remove" onClick={remove} aria-label="Удалить"><Icon name="trash-2" size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function CartApp() {
  const [menu, setMenu] = useStateCart(false);
  const { items, count, total } = useCart();

  useEffectCart(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffectCart(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });

  const empty = items.length === 0;

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
            <span className="cur">Корзина</span>
          </div>
          {!empty && <h1>Корзина</h1>}
        </section>

        <div className="container">
          {empty ? (
            <div className="cart-empty">
              <div className="ce-mark"><img src="assets/dedpay-mark.png" alt="DedPay" /></div>
              <h2>В корзине пока пусто</h2>
              <p>Выберите услугу в каталоге — оформление доступа, продление подписки или пополнение баланса.</p>
              <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={18} />Перейти в каталог</Button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-lines">
                {items.map((it) => (
                  <CartLine key={window.DedCart.lineKey(it)} item={it} />
                ))}
                <a href="catalog.html" className="btn btn-quiet" style={{ alignSelf: "flex-start", marginTop: 4 }}>
                  <Icon name="arrow-left" size={16} />Продолжить выбор услуг
                </a>
              </div>

              <aside className="summary">
                <h3>Ваш заказ</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span className="sr-name"><b>Услуг в заказе</b></span>
                    <span className="sr-val">{count}</span>
                  </div>
                  <div className="summary-row">
                    <span className="sr-name"><b>Позиций</b></span>
                    <span className="sr-val">{items.length}</span>
                  </div>
                </div>
                <div className="summary-div"></div>
                <div className="summary-total">
                  <span className="tl">Итого</span>
                  <span className="tv">{fmt(total)}</span>
                </div>
                <a className="btn btn-primary btn-lg" href="checkout.html"><Icon name="arrow-right" size={18} />Перейти к оформлению</a>
                <p className="undertext">Оформление заявки — без оплаты на этом шаге. Способ оплаты появится после подключения онлайн-кассы.</p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
      <StoreDrawer open={menu} onClose={() => setMenu(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CartApp />);
