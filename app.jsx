/* DedPay — App root + Tweaks */
const { useEffect: useEffectA } = React;

const ACCENTS = {
  duo:    { a: "oklch(0.64 0.18 262)", b: "oklch(0.64 0.18 298)", sw: ["#3b74ff", "#9a6bff"] },
  blue:   { a: "oklch(0.62 0.17 250)", b: "oklch(0.68 0.15 232)", sw: ["#2f6bff", "#22a7ff"] },
  violet: { a: "oklch(0.62 0.19 300)", b: "oklch(0.60 0.19 322)", sw: ["#8b5cf6", "#c050d6"] },
  mint:   { a: "oklch(0.72 0.13 178)", b: "oklch(0.70 0.14 200)", sw: ["#13d6a4", "#0fc1d6"] },
};

const HEAD_FONTS = {
  "Space Grotesk": "'Space Grotesk', system-ui, sans-serif",
  "Sora": "'Sora', system-ui, sans-serif",
  "Manrope": "'Manrope', system-ui, sans-serif",
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "aurora",
  "accent": "duo",
  "headFont": "Space Grotesk",
  "viewport": "auto"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [menu, setMenu] = React.useState(false);
  const data = window.DEDPAY;

  // apply accent
  useEffectA(() => {
    const acc = ACCENTS[t.accent] || ACCENTS.duo;
    const r = document.documentElement.style;
    r.setProperty("--acc", acc.a);
    r.setProperty("--acc-2", acc.b);
  }, [t.accent]);

  // apply heading font
  useEffectA(() => {
    document.documentElement.style.setProperty("--font-display", HEAD_FONTS[t.headFont] || HEAD_FONTS["Space Grotesk"]);
  }, [t.headFont]);

  // lock scroll when drawer open
  useEffectA(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  // re-render lucide on direction change (new icons mount)
  useEffectA(() => {
    if (window.lucide) try { window.lucide.createIcons({ nameAttr: "data-lucide" }); } catch (e) {}
  });

  return (
    <div className={"app-shell vp-" + t.viewport}>
      <div className="page">
        <Header data={data} onMenu={() => setMenu(true)} />
        <main>
          <Hero data={data} direction={t.direction} />
          <Categories data={data} />
          <HowItWorks data={data} />
          <Advantages data={data} />
          <Faq data={data} />
          <CtaBand data={data} />
        </main>
        <Footer data={data} />
        <MobileDrawer data={data} open={menu} onClose={() => setMenu(false)} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero / стиль" />
        <TweakRadio
          label="Направление"
          value={t.direction}
          options={["aurora", "console", "spotlight"]}
          onChange={(v) => setTweak("direction", v)}
        />
        <TweakSection label="Акцент" />
        <TweakColor
          label="Палитра"
          value={ACCENTS[t.accent].sw}
          options={Object.keys(ACCENTS).map((k) => ACCENTS[k].sw)}
          onChange={(v) => {
            const key = Object.keys(ACCENTS).find((k) => ACCENTS[k].sw.join() === v.join());
            if (key) setTweak("accent", key);
          }}
        />
        <TweakSection label="Типографика" />
        <TweakSelect
          label="Шрифт заголовков"
          value={t.headFont}
          options={Object.keys(HEAD_FONTS)}
          onChange={(v) => setTweak("headFont", v)}
        />
        <TweakSection label="Просмотр" />
        <TweakRadio
          label="Viewport"
          value={t.viewport}
          options={["auto", "mobile"]}
          onChange={(v) => setTweak("viewport", v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
