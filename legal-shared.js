/* DedPay — shared script for legal pages.
   Builds the footer from window.DEDPAY, wires sticky header + TOC scroll-spy,
   and initialises lucide icons. */
(function () {
  var D = window.DEDPAY || {};
  var HOME = "index.html";
  var f = D.footer || {};
  var legal = f.legal || {};

  function esc(s) { return String(s == null ? "" : s); }
  function telHref(p) { return "tel:" + String(p).replace(/[^+\d]/g, ""); }

  /* ---- Footer ---- */
  function buildFooter() {
    var mount = document.getElementById("footer-mount");
    if (!mount) return;

    var cols = (f.cols || []).map(function (col) {
      var links = (col.links || []).map(function (l) {
        var ext = /^https?:/.test(l.href);
        var attrs = ext ? ' target="_blank" rel="noopener"' : "";
        return '<a href="' + esc(l.href) + '"' + attrs + '>' + esc(l.label) + "</a>";
      }).join("");
      return '<div class="footer-col"><h5>' + esc(col.title) + "</h5>" + links + "</div>";
    }).join("");

    mount.innerHTML =
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer-top">' +
            '<div class="footer-brand">' +
              '<a class="logo" href="' + HOME + '"><span class="logo-mark img"><img src="assets/dedpay-mark.png" alt="DedPay" /></span>' +
              '<span class="logo-word">Ded<b>Pay</b></span></a>' +
              "<p>Сервис помощи в оплате зарубежных подписок, пополнений и игровых балансов.</p>" +
            "</div>" + cols +
          "</div>" +
          '<div class="footer-legal">' +
            '<p class="small">© DedPay, 2026 · ' + esc(legal.name) + " · ИНН " + esc(legal.inn) + "</p>" +
            '<p class="small dim">' +
              '<a href="mailto:' + esc(legal.email) + '">' + esc(legal.email) + "</a>" +
              ' · <a href="' + telHref(legal.phone) + '">' + esc(legal.phone) + "</a></p>" +
          "</div>" +
          '<div class="footer-bottom">' +
            '<p class="small"><b>DedPay · dedpay.net</b> — ' + esc(f.disclaimer) + "</p>" +
            '<a class="btn btn-ghost" href="' + esc(D.tg || "https://t.me/dedpayrobot") + '" target="_blank" rel="noopener">' +
              '<i data-lucide="send"></i>Поддержка в Telegram</a>' +
          "</div>" +
        "</div>" +
      "</footer>";
  }

  /* ---- Sticky header state ---- */
  function wireHeader() {
    var h = document.getElementById("lheader");
    if (!h) return;
    var onScroll = function () { h.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- TOC scroll-spy (offer page) ---- */
  function wireToc() {
    var toc = document.getElementById("toc");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); });
    if (!("IntersectionObserver" in window) || !sections.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var a = map[e.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  function init() {
    buildFooter();
    wireHeader();
    wireToc();
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
