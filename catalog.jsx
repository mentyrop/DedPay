/* DedPay — catalog page */
const { useState: useStateCat, useEffect: useEffectCat } = React;

const CAT_ACCENTS = {
  duo:    { a: "oklch(0.64 0.18 262)", b: "oklch(0.64 0.18 298)", sw: ["#3b74ff", "#9a6bff"] },
  blue:   { a: "oklch(0.62 0.17 250)", b: "oklch(0.68 0.15 232)", sw: ["#2f6bff", "#22a7ff"] },
  violet: { a: "oklch(0.62 0.19 300)", b: "oklch(0.60 0.19 322)", sw: ["#8b5cf6", "#c050d6"] },
  mint:   { a: "oklch(0.72 0.13 178)", b: "oklch(0.70 0.14 200)", sw: ["#13d6a4", "#0fc1d6"] },
};
const CAT_FONTS = {
  "Space Grotesk": "'Space Grotesk', system-ui, sans-serif",
  "Sora": "'Sora', system-ui, sans-serif",
  "Manrope": "'Manrope', system-ui, sans-serif",
};

const CATALOG_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "cardVariant": "a",
  "accent": "duo",
  "headFont": "Space Grotesk"
}/*EDITMODE-END*/;

function ruPlural(n, forms) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}

function getInitialCat() {
  const p = new URLSearchParams(location.search).get("cat");
  if (p && STORE.categories.some((c) => c.id === p)) return p;
  return "all";
}

function CatalogApp() {
  const [t, setTweak] = useTweaks(CATALOG_TWEAK_DEFAULTS);
  const [cat, setCat] = useStateCat(getInitialCat());
  const [menu, setMenu] = useStateCat(false);

  useEffectCat(() => {
    const acc = CAT_ACCENTS[t.accent] || CAT_ACCENTS.duo;
    document.documentElement.style.setProperty("--acc", acc.a);
    document.documentElement.style.setProperty("--acc-2", acc.b);
  }, [t.accent]);
  useEffectCat(() => {
    document.documentElement.style.setProperty("--font-display", CAT_FONTS[t.headFont] || CAT_FONTS["Space Grotesk"]);
  }, [t.headFont]);
  useEffectCat(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);
  useEffectCat(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });

  const products = STORE.byCategory(cat);
  const counts = {};
  STORE.products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });

  function pickCat(id) {
    setCat(id);
    const url = new URL(location.href);
    if (id === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", id);
    history.replaceState(null, "", url);
  }

  const activeCat = STORE.categories.find((c) => c.id === cat);

  return (
    <div className="page">
      <StoreHeader current="catalog" onMenu={() => setMenu(true)} />
      <main>
        <section className="container page-head">
          <div className="crumb">
            <a href="index.html">Главная</a>
            <span className="sep">/</span>
            <span className="cur">Каталог</span>
          </div>
          <h1>Каталог услуг</h1>
          <p className="lead">
            Оформление доступа к подпискам, продление и пополнение цифровых сервисов.
            Выберите услугу, укажите данные и оформите заявку — оплата подключается через онлайн-кассу.
          </p>
        </section>

        <div className="container">
          {/* mobile category chips */}
          <div className="cat-chips">
            <button className={"cat-chip" + (cat === "all" ? " active" : "")} onClick={() => pickCat("all")}>Все</button>
            {STORE.categories.map((c) => (
              <button key={c.id} className={"cat-chip" + (cat === c.id ? " active" : "")} onClick={() => pickCat(c.id)}>
                <Icon name={c.icon} size={15} />{c.title}
              </button>
            ))}
          </div>

          <div className="catalog-wrap">
            <aside className="cat-side">
              <h6>Категории</h6>
              <div className="cat-side-list">
                <button className={"cat-side-item" + (cat === "all" ? " active" : "")} onClick={() => pickCat("all")}>
                  <Icon name="layout-grid" size={17} />
                  <span>Все направления</span>
                  <span className="n">{STORE.products.length}</span>
                </button>
                {STORE.categories.map((c) => (
                  <button key={c.id} className={"cat-side-item" + (cat === c.id ? " active" : "")} onClick={() => pickCat(c.id)}>
                    <Icon name={c.icon} size={17} />
                    <span>{c.title}</span>
                    <span className="n">{counts[c.id] || 0}</span>
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <div className="catalog-toolbar">
                <span className="count">
                  <b>{products.length}</b> {ruPlural(products.length, ["услуга", "услуги", "услуг"])}
                  {activeCat ? " · " + activeCat.title : " во всех категориях"}
                </span>
                {cat !== "all" && (
                  <button className="btn btn-quiet btn-sm" onClick={() => pickCat("all")} style={{ padding: "6px 10px" }}>
                    <Icon name="x" size={15} />Сбросить
                  </button>
                )}
              </div>

              <div className="svc-grid">
                {products.map((p) => (
                  <ServiceCard key={p.id} p={p} variant={t.cardVariant} />
                ))}
                {products.length === 0 && (
                  <div className="empty-cat">
                    <Icon name="search-x" />
                    <p>В этой категории пока нет услуг. Напишите в поддержку — поможем подобрать.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreDrawer open={menu} onClose={() => setMenu(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Карточка услуги" />
        <TweakRadio
          label="Вариант"
          value={t.cardVariant}
          options={[{ value: "a", label: "A · подробная" }, { value: "b", label: "B · компактная" }]}
          onChange={(v) => setTweak("cardVariant", v)}
        />
        <TweakSection label="Акцент" />
        <TweakColor
          label="Палитра"
          value={CAT_ACCENTS[t.accent].sw}
          options={Object.keys(CAT_ACCENTS).map((k) => CAT_ACCENTS[k].sw)}
          onChange={(v) => {
            const key = Object.keys(CAT_ACCENTS).find((k) => CAT_ACCENTS[k].sw.join() === v.join());
            if (key) setTweak("accent", key);
          }}
        />
        <TweakSection label="Типографика" />
        <TweakSelect
          label="Шрифт заголовков"
          value={t.headFont}
          options={Object.keys(CAT_FONTS)}
          onChange={(v) => setTweak("headFont", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CatalogApp />);
