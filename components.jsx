/* DedPay — shared UI primitives. Exports to window. */
const { useRef, useEffect, useState } = React;

/* Lucide icon — React owns a <span>, lucide fills it with an <svg>.
   This keeps React from ever managing the generated svg node. */
function Icon({ name, size = 20, stroke = 2, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = "";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    el.appendChild(i);
    try {
      window.lucide.createIcons({
        attrs: { width: size, height: size, "stroke-width": stroke },
        nameAttr: "data-lucide",
      });
    } catch (e) {}
  }, [name, size, stroke]);
  return <span ref={ref} className={"lic " + className} aria-hidden="true" style={{ display: "inline-flex" }}></span>;
}

/* Telegram paper-plane glyph (simple geometric, inline) */
function TgGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.3 2.9 11.6c-1.1.4-1.1 1.5-.2 1.8l4.8 1.5 1.8 5.8c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8l3.3-15.5c.3-1.3-.5-1.9-1.5-1.5Z" />
    </svg>
  );
}

function Logo({ size = "md", onClick }) {
  const markSize = size === "lg" ? 42 : 36;
  const word = size === "lg" ? 22 : 19;
  return (
    <a href="#top" className="logo" onClick={onClick}>
      <span className="logo-mark img" style={{ width: markSize, height: markSize }}>
        <img src="assets/dedpay-mark.png" alt="DedPay" />
      </span>
      <span className="logo-word" style={{ fontSize: word }}>Ded<b>Pay</b></span>
    </a>
  );
}

function Button({ variant = "primary", size, telegram, href, children, onClick, className = "" }) {
  const cls = `btn btn-${variant} ${size ? "btn-" + size : ""} ${className}`.trim();
  const inner = (
    <>
      {telegram && <span className="tg-ico"><TgGlyph size={size === "lg" ? 20 : 18} /></span>}
      {children}
    </>
  );
  if (href) {
    const ext = href.startsWith("http");
    return (
      <a className={cls} href={href} onClick={onClick} {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
        {inner}
      </a>
    );
  }
  return <button className={cls} onClick={onClick}>{inner}</button>;
}

function Eyebrow({ children, center }) {
  return <span className={"eyebrow" + (center ? " center" : "")}>{children}</span>;
}

function SectionHead({ eyebrow, title, sub, center }) {
  return (
    <div className={"section-head" + (center ? " center" : "")}>
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

/* Reveal-on-scroll wrapper — inline styles from React state (no class/specificity games) */
function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true); setDone(true);
      return;
    }
    let timer, dtimer;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            timer = setTimeout(() => setShown(true), delay);
            dtimer = setTimeout(() => setDone(true), delay + 850);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); clearTimeout(dtimer); };
  }, [delay]);
  const Tag = as;
  // Once the entrance finishes, drop inline opacity/transform so CSS (e.g. :hover) takes over.
  const revStyle = done
    ? style
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(20px)",
        transition: "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)",
        ...style,
      };
  return <Tag ref={ref} className={className} style={revStyle} {...rest}>{children}</Tag>;
}

Object.assign(window, { Icon, TgGlyph, Logo, Button, Eyebrow, SectionHead, Reveal });
