// Theme and language before the first paint: no flash, right direction.
// A file, not an inline script: the page policy allows scripts from this
// site only (script-src 'self').
(function () {
  var root = document.documentElement;
  // dark is the default; light only when the visitor chose it here
  var theme = "dark";
  try {
    if (localStorage.getItem("zrzur-site-theme") === "light") theme = "light";
  } catch (e) {}
  root.dataset.theme = theme;
  var match = location.pathname.match(/^\/(ar|de|fr|es|ru|zh)(\/|$)/);
  var language = match ? match[1] : "en";
  root.lang = language === "zh" ? "zh-Hans" : language;
  root.dir = language === "ar" ? "rtl" : "ltr";
  // the headline's font, before the first paint: Arabic and Russian
  // headlines need their own letters; Chinese uses the system's font
  var font = document.createElement("link");
  font.rel = "preload";
  font.as = "font";
  font.type = "font/woff2";
  font.crossOrigin = "";
  font.href =
    language === "ar"
      ? "/assets/plex-arabic-700.woff2"
      : language === "ru"
        ? "/assets/plex-cyrillic-wght.woff2"
        : "/assets/plex-latin-wght.woff2";
  document.head.appendChild(font);
})();
