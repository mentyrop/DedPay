/* DedPay — How it works, Advantages, Trust, FAQ, CTA, Footer, MobileDrawer */
const { useState: useStateB } = React;

/* ---------------- How it works ---------------- */
function HowItWorks({ data }) {
  return (
    <section className="section" id="how">
      <div className="container">
        <SectionHead
          eyebrow="Как это работает"
          title="Пять шагов до результата"
          sub="Весь путь проходит на сайте — от выбора услуги до оплаты, без технической возни." />
        
        <div className="steps">
          {data.steps.map((s, i) =>
          <Reveal as="div" delay={i * 60} key={i} className="step">
              <div className="step-n">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="bar"></span>
              </div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------------- Advantages ---------------- */
function Advantages({ data }) {
  return (
    <section className="section" id="advantages">
      <div className="container">
        <SectionHead
          eyebrow="Преимущества"
          title="Почему с DedPay спокойно"
          sub="Сервис цифрового сопровождения, который ведёт вас от выбора до результата." />
        
        <div className="adv-grid">
          {data.advantages.map((a, i) =>
          <Reveal as="div" delay={i % 3 * 70} key={i} className="card adv">
              <span className="icon-tile"><Icon name={a.icon} /></span>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------------- Trust / legal ---------------- */
function Trust({ data }) {
  return (
    <section className="section-tight" id="trust">
      <div className="container">
        <Reveal as="div" className="trust">
          <div className="trust-grid">
            <div>
              <Eyebrow>Прозрачность</Eyebrow>
              <h2>Помогаем оплачивать подписки и пополнять балансы в сервисах</h2>
              <p>
                DedPay оказывает услуги по содействию в оплате и оформлении доступа к цифровым
                сервисам. Мы не являемся официальным представителем Spotify, Apple, Sony, Valve,
                Google, Discord и других правообладателей. Все товарные знаки принадлежат их владельцам.
              </p>
              <span className="seal"><Icon name="shield-check" size={16} />Работаем по публичной оферте</span>
            </div>
            <div>
              <div className="brand-grid">
                {data.brands.map((b) =>
                <span className="brand-pill" key={b.name}>
                    <span className="g"><Icon name={b.icon} size={16} /></span>{b.name}
                  </span>
                )}
              </div>
              <p className="brand-note">// не являемся официальным представителем перечисленных брендов</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ---------------- FAQ accordion ---------------- */
function Faq({ data }) {
  const [open, setOpen] = useStateB(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHead
          eyebrow="FAQ"
          title="Частые вопросы"
          sub="Коротко о том, что обычно спрашивают перед оформлением заказа." />
        
        <div className="faq-list">
          {data.faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={"faq-item" + (isOpen ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="qmark">{String(i + 1).padStart(2, "0")}</span>
                  {f.q}
                  <span className="faq-plus" aria-hidden="true"></span>
                </button>
                <div className="faq-a">
                  <div className="faq-a-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </section>);

}

/* ---------------- CTA band ---------------- */
function CtaBand({ data }) {
  return (
    <section className="section-tight">
      <div className="container">
        <Reveal as="div" className="cta-band">
          <span className="cta-mark"><img src="assets/dedpay-mark.png" alt="DedPay" /></span>
          <Eyebrow center>Готовы начать</Eyebrow>
          <h2>Откройте каталог<br />и оформите заказ</h2>
          <p>Выберите услугу в каталоге, добавьте в корзину и оплатите онлайн прямо на сайте. Поддержка — на каждом шаге.</p>
          <div className="hero-cta">
            <Button variant="primary" size="lg" href="catalog.html"><Icon name="layout-grid" size={20} />Перейти в каталог</Button>
            <Button variant="ghost" size="lg" telegram href={data.tg}>Задать вопрос в поддержку</Button>
          </div>
        </Reveal>
      </div>
    </section>);

}

/* ---------------- Footer ---------------- */
function Footer({ data }) {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>Сервис помощи в оплате зарубежных подписок, пополнений и игровых балансов.</p>
          </div>
          {data.footer.cols.map((col) =>
          <div className="footer-col" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => {
              const ext = l.href.startsWith("http");
              return (
                <a key={l.label} href={l.href} {...ext ? { target: "_blank", rel: "noopener" } : {}}>{l.label}</a>);

            })}
            </div>
          )}
        </div>
        <div className="footer-legal">
          <p className="small">
            © DedPay, 2026 · {data.footer.legal.name} · ИНН {data.footer.legal.inn}
          </p>
          <p className="small dim">
            <a href={"mailto:" + data.footer.legal.email}>{data.footer.legal.email}</a> · <a href={"tel:" + data.footer.legal.phone.replace(/[^+\d]/g, "")}>{data.footer.legal.phone}</a>
          </p>
        </div>
        <div className="footer-bottom">
          <p className="small">
            <b>DedPay · dedpay.net</b> — {data.footer.disclaimer}
          </p>
          <Button variant="ghost" telegram href={data.tg}>Поддержка в Telegram</Button>
        </div>
      </div>
    </footer>);

}

/* ---------------- Mobile drawer ---------------- */
function MobileDrawer({ data, open, onClose }) {
  return (
    <div className={"mobile-drawer" + (open ? " open" : "")}>
      <div className="md-top">
        <Logo onClick={onClose} />
        <button className="md-close" onClick={onClose} aria-label="Закрыть"><Icon name="x" /></button>
      </div>
      <nav className="md-nav">
        {data.nav.map((n) =>
        <a key={n.href} href={n.href} onClick={onClose}>{n.label}</a>
        )}
      </nav>
      <div className="md-foot">
        <Button variant="primary" size="lg" href="catalog.html" className="btn-block"><Icon name="layout-grid" size={18} />Перейти в каталог</Button>
        <Button variant="ghost" telegram href={data.tg} className="btn-block" onClick={onClose}>Задать вопрос в поддержку</Button>
      </div>
    </div>);

}

Object.assign(window, { HowItWorks, Advantages, Trust, Faq, CtaBand, Footer, MobileDrawer });