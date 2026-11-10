// Before the first paint: theme, language and direction, the visitor's own
// address, the words and the first picture of the page, and taps kept until
// the app takes over. A file, not an inline script: the page policy allows
// scripts from this site only (script-src 'self'). test/theme-script.test.mjs
(function () {
  var root = document.documentElement;
  var CODES = /^(en|ar|de|fr|es|ru|zh)$/;
  var read = function (key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  };

  // dark is the default; light only when the visitor chose it here
  root.dataset.theme = read("zrzur-site-theme") === "light" ? "light" : "dark";

  var match = location.pathname.match(/^\/(ar|de|fr|es|ru|zh)(\/|$)/);
  if (!match) {
    // an English address: a visitor of another language goes to their own
    // address now, before this page is drawn (src/i18n.ts detectLanguage:
    // the saved choice, then the browser's languages; Chinese only in its
    // simplified script)
    var wanted = null;
    var saved = read("zrzur-site-language");
    if (saved && CODES.test(saved)) wanted = saved;
    else {
      var tags = (navigator.languages || []).slice();
      for (var i = 0; i < tags.length && !wanted; i++) {
        var parts = String(tags[i]).toLowerCase().split(/[-_]/);
        if (parts[0] === "zh") {
          if (parts.indexOf("hant") < 0 && parts.indexOf("tw") < 0 && parts.indexOf("hk") < 0 && parts.indexOf("mo") < 0) wanted = "zh";
        } else if (CODES.test(parts[0])) wanted = parts[0];
      }
    }
    if (wanted && wanted !== "en") {
      var path = location.pathname === "/" ? "/" : location.pathname;
      location.replace("/" + wanted + (path === "/" ? "/" : path) + location.search + location.hash);
      return;
    }
  }
  var language = match ? match[1] : "en";
  root.lang = language === "zh" ? "zh-Hans" : language;
  root.dir = language === "ar" ? "rtl" : "ltr";

  var link = function (attributes) {
    var node = document.createElement("link");
    for (var name in attributes) if (attributes[name] != null) node.setAttribute(name, attributes[name]);
    document.head.appendChild(node);
  };
  // the headline's font: Arabic and Russian headlines need their own
  // letters; Chinese uses the system's font
  link({
    rel: "preload",
    as: "font",
    type: "font/woff2",
    crossorigin: "",
    href:
      language === "ar"
        ? "/assets/plex-arabic-700.woff2"
        : language === "ru"
          ? "/assets/plex-cyrillic-wght.woff2"
          : "/assets/plex-latin-wght.woff2",
  });
  // the first picture of the page, in the shade the page shows: the build
  // writes its addresses (scripts/prerender.mjs); the other shade never loads
  var hero = document.querySelector('meta[name="zrzur-hero"]');
  if (hero)
    try {
      var shown = JSON.parse(hero.content)[root.dataset.theme] || [];
      for (var j = 0; j < shown.length; j++)
        link({
          rel: "preload",
          as: "image",
          fetchpriority: "high",
          type: shown[j].type,
          media: shown[j].media,
          href: shown[j].href,
          imagesrcset: shown[j].srcset,
          imagesizes: shown[j].sizes,
        });
    } catch (e) {}
  // the words of the page's language, after the stylesheet: the page shows
  // itself without them (the build writes where each language's chunk is)
  var words = document.querySelector('meta[name="zrzur-words"]');
  var chunk = words && words.content.match(new RegExp("(?:^|,)" + language + "=([^,]+)"));
  if (chunk) link({ rel: "modulepreload", crossorigin: "", fetchpriority: "low", href: chunk[1] });

  // taps before the app takes over: kept for it, it replays them (what
  // Solid's inline hydration script does, as a file)
  (function (hy) {
    var keyed = function (node) {
      return node && node.hasAttribute && (node.hasAttribute("data-hk") ? node : keyed(node.host && node.host.nodeType ? node.host : node.parentNode));
    };
    ["click", "input"].forEach(function (type) {
      document.addEventListener(type, function (event) {
        if (!hy.events) return;
        var path = event.composedPath ? event.composedPath() : null;
        var target = keyed((path && path[0]) || event.target);
        if (target && !hy.completed.has(target)) {
          // a finished event forgets its path; the replay walks that path
          if (path) event.composedPath = function () { return path; };
          hy.events.push([target, event]);
        }
      });
    });
  })(window._$HY || (window._$HY = { events: [], completed: new WeakSet(), r: {}, fe: function () {} }));
})();
