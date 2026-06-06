/* DedPay — order success page */
const { useState: useStateOk, useEffect: useEffectOk } = React;

function getOrder() {
  const ref = new URLSearchParams(location.search).get("ref");
  let order = null;
  try { order = JSON.parse(localStorage.getItem("dedpay_last_order") || "null"); } catch (e) {}
  if (order && ref && order.ref !== ref) {
    // ref in URL but stored order differs — still show URL ref
    order = { ...order, ref: ref };
  }
  if (!order && ref) order = { ref: ref, items: [], total: null, contact: null };
  return order;
}

function SuccessApp() {
  const [menu, setMenu] = useStateOk(false);
  const order = getOrder();

  useEffectOk(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffectOk(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });

  const hasOrder = !!order;
  const hasItems = order && order.items && order.items.length > 0;

  return (
    <div className="page">
      <StoreHeader current={null} onMenu={() => setMenu(true)} />
      <main>
        <div className="container">
          <div className="success-wrap">
            <div className="success-mark">
              <img src="assets/dedpay-mark.png" alt="DedPay" />
              <span className="success-check"><Icon name="check" size={24} /></span>
            </div>

            <span className="eyebrow center">Заявка оформлена</span>
            <h1>Заявка создана</h1>
            <p className="s-lead">
              Сейчас онлайн-оплата на сайте находится в процессе подключения через кассу.
              Мы свяжемся с вами, подтвердим детали и сопроводим заявку до результата.
            </p>

            {hasOrder && order.ref && (
              <div className="order-ref">
                <Icon name="hash" size={15} />Номер заявки: <b>{order.ref}</b>
              </div>
            )}

            {hasItems && (
              <aside className="summary" style={{ position: "static", textAlign: "left", marginTop: 32 }}>
                <h3>Состав заявки</h3>
                <div className="summary-rows">
                  {order.items.map((it, i) => (
                    <div className="summary-row" key={i}>
                      <span className="sr-name">
                        <b>{it.name}</b>
                        <span>{it.tier ? it.tier + " · " : ""}{it.qty} × {fmt(it.price)}</span>
                      </span>
                      <span className="sr-val">{fmt(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
                {order.total != null && (
                  <>
                    <div className="summary-div"></div>
                    <div className="summary-total">
                      <span className="tl">Итого</span>
                      <span className="tv">{fmt(order.total)}</span>
                    </div>
                  </>
                )}
              </aside>
            )}

            <div className="success-steps">
              <div className="success-step done">
                <span className="ss-n"><Icon name="check" size={15} /></span>
                <span className="ss-t">Заявка создана<span>Мы зафиксировали выбранные услуги</span></span>
              </div>
              <div className="success-step">
                <span className="ss-n">2</span>
                <span className="ss-t">Подтверждение заявки<span>Мы свяжемся с вами и подтвердим детали оформления</span></span>
              </div>
              <div className="success-step">
                <span className="ss-n">3</span>
                <span className="ss-t">Оплата на сайте и результат<span>Оплачиваете заказ онлайн через кассу — после подключения</span></span>
              </div>
            </div>

            <div className="success-cta">
              <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={18} />Вернуться в каталог</Button>
              <Button variant="ghost" size="lg" telegram href={STORE.tg}>Задать вопрос в поддержку</Button>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreDrawer open={menu} onClose={() => setMenu(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SuccessApp />);
