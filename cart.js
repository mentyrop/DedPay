/* DedPay — cart store (vanilla, localStorage + pub/sub).
   Shared across catalog / service / cart / checkout pages.
   Item shape: { id, slug, name, category, type, tier, price, qty } */
(function () {
  var KEY = "dedpay_cart_v1";

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function write(arr) {
    try {
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) {}
    emit();
  }

  function emit() {
    try {
      window.dispatchEvent(new CustomEvent("dedcart:change", { detail: { items: read() } }));
    } catch (e) {}
  }

  function lineKey(item) {
    return String(item.id) + "::" + String(item.tier || "");
  }

  var Cart = {
    KEY: KEY,
    items: read,

    add: function (item, qty) {
      qty = qty || 1;
      var arr = read();
      var k = lineKey(item);
      var existing = arr.find(function (x) { return lineKey(x) === k; });
      if (existing) {
        existing.qty += qty;
      } else {
        arr.push({
          id: item.id,
          slug: item.slug,
          name: item.name,
          category: item.category,
          type: item.type,
          tier: item.tier || "",
          price: item.price,
          qty: qty,
        });
      }
      write(arr);
      return arr;
    },

    setQty: function (key, qty) {
      var arr = read();
      var line = arr.find(function (x) { return lineKey(x) === key; });
      if (line) {
        line.qty = Math.max(1, qty | 0);
        write(arr);
      }
      return arr;
    },

    remove: function (key) {
      var arr = read().filter(function (x) { return lineKey(x) !== key; });
      write(arr);
      return arr;
    },

    clear: function () {
      write([]);
    },

    count: function () {
      return read().reduce(function (n, x) { return n + (x.qty || 0); }, 0);
    },

    total: function () {
      return read().reduce(function (s, x) { return s + (x.price || 0) * (x.qty || 0); }, 0);
    },

    lineKey: lineKey,

    /* subscribe to changes (same tab via custom event, cross-tab via storage) */
    subscribe: function (fn) {
      var handler = function () { fn(read()); };
      window.addEventListener("dedcart:change", handler);
      window.addEventListener("storage", function (e) {
        if (e.key === KEY) handler();
      });
      return function () { window.removeEventListener("dedcart:change", handler); };
    },
  };

  window.DedCart = Cart;
})();

/* Format helper — RU rubles, no decimals */
window.fmtPrice = function (n) {
  if (n == null) return "Цена по запросу";
  return new Intl.NumberFormat("ru-RU").format(Math.round(n)) + "\u00A0₽";
};
