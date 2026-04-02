// i18n — lightweight translation system for RefIntegrity
// No dependencies. Language detected from URL path: /fr/, /de/, etc.
// Loads only the needed language file (~4 KB) instead of all languages.

(function () {
  "use strict";

  var SUPPORTED_LANGS = ["en", "es", "fr", "de", "ru", "zh", "ja", "pt", "ko", "ar", "it"];
  var LANG_NAMES = { en: "English", es: "Espa\u00f1ol", fr: "Fran\u00e7ais", de: "Deutsch", ru: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", zh: "\u4e2d\u6587", ja: "\u65e5\u672c\u8a9e", pt: "Portugu\u00eas", ko: "\ud55c\uad6d\uc5b4", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", it: "Italiano" };
  var DEFAULT_LANG = "en";

  function detectLang() {
    var match = window.location.pathname.match(/^\/([a-z]{2})\/?/);
    if (match && SUPPORTED_LANGS.indexOf(match[1]) !== -1) return match[1];
    return DEFAULT_LANG;
  }

  var currentLang = detectLang();
  var translations = {};

  // English translations (always available, no extra request)
  translations.en = {
    lang: "en", langName: "English", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 Free Reference Integrity Checker",
      description: "Free tool to check if a scientific paper's references have been retracted. Paste a DOI or upload a BibTeX file to find retractions instantly. Open-source, no login.",
      ogTitle: "RefIntegrity \u2014 Free Reference Integrity Checker",
      ogDescription: "Free tool to check if a scientific paper's references have been retracted. Paste a DOI or upload a BibTeX file to find retractions instantly.",
      twitterDescription: "Check if a paper's references have been retracted. Free and open-source."
    },
    nav: { howItWorks: "How it works", api: "API", source: "Source" },
    hero: {
      h1: "Don\u2019t let retracted citations undermine your paper",
      subtitle: "94% of citations to retracted papers go undetected. RefIntegrity scans your entire reference list in seconds against the Retraction Watch database. Paste a DOI or upload a BibTeX file \u2014 free, no login."
    },
    howSection: { heading: "How it works" },
    search: {
      placeholder: "Paper title, DOI, PMID, or arXiv ID",
      checkBtn: "Check", tryLabel: "Try:", checkMultiple: "Check multiple papers",
      uploadBibRis: "Upload .bib / .ris",
      bulkPlaceholder: "Paste DOIs, PMIDs, or arXiv IDs (one per line) or BibTeX/RIS content",
      checkAll: "Check all",
      switchBulk: "Bulk mode",
      switchSingle: "Single mode",
      bulkTagPlaceholder: "DOI, PMID, or arXiv ID — press Enter to add",
      selectPaper: "Select the paper you want to check:",
      citedBy: "cited by {count}"
    },
    history: { recent: "Recent:" },
    loading: { lookingUp: "Looking up paper\u2026", checkingNofM: "Checking {current} of {total}\u2026", searching: "Searching\u2026" },
    errors: {
      enterDoi: "Please enter a DOI.",
      invalidDoi: "Invalid DOI format. Example: 10.1038/s41577-020-0311-8",
      pasteDois: "Paste DOIs or BibTeX/RIS content.",
      noValidDois: "No valid DOIs found in the input.",
      fileTooLarge: "File too large (max 1 MB).",
      unexpectedResponse: "Server returned an unexpected response. Try again.",
      genericError: "An error occurred.",
      networkError: "Network error. Check your connection and try again.",
      noSearchResults: "No papers found. Try a more specific title or paste a DOI."
    },
    results: {
      allClear: "All clear \u2014 {total} references checked, none retracted.",
      flaggedCount: "{flagged} of {total} references have been flagged.",
      flaggedCountSingular: "{flagged} of {total} references has been flagged.",
      noIndexedRefs: "This paper has no indexed references.",
      arxivNoRefsHint: "arXiv preprints often lack indexed reference data. Try the published DOI if available.",
      selfRetractedWarning: "<strong>Note:</strong> This paper has itself been retracted.",
      titleUnavailable: "Title unavailable", resultsHeading: "Results",
      copyResults: "Copy results", downloadCsv: "Download CSV",
      copiedToClipboard: "Copied to clipboard",
      papers: "papers", references: "references", flagged: "flagged",
      errorsLabel: "errors", clean: "Clean",
      disclaimer: "Checked {total} references against retraction records from",
      coverageNote: "Checked {checked} of {total} references ({pct}% coverage). Some references could not be resolved."
    },
    statuses: { retracted: "Retracted", expressionOfConcern: "Expression of Concern", withdrawn: "Withdrawn", removed: "Removed" },
    footer: {
      openSource: "RefIntegrity is free, open-source software ({github}). Data from {openalex} and {crossref}.",
      support: "Support on {kofi} or {sponsors}",
      updated: "Updated {date}",
      monthYear: "April 2026"
    },
    noscript: "RefIntegrity requires JavaScript to run. Please enable it in your browser.",
    howItWorksPanel: {
      step1: "<strong>Enter a paper title or identifier</strong> \u2014 or upload a BibTeX/RIS file.",
      step2: "<strong>Automatic cross-check</strong> \u2014 all references checked against Retraction Watch via OpenAlex.",
      step3: "<strong>Instant results</strong> \u2014 flagged refs shown with status, date, and retraction notice link.",
      note: "Unlike manual lookups, RefIntegrity checks an entire reference list in seconds."
    },
    faq: [
      { q: "How do I check if a paper's references have been retracted?", a: "Paste a DOI into RefIntegrity. It fetches the paper's reference list and checks each one against the Retraction Watch database via OpenAlex. Results appear in seconds." },
      { q: "Is RefIntegrity free?", a: "Yes, RefIntegrity is completely free and open-source. No account or login required." },
      { q: "What databases does RefIntegrity use?", a: "RefIntegrity uses OpenAlex for scholarly metadata and retraction status (sourced from Retraction Watch), and Crossref for retraction notice details." },
      { q: "What types of issues does RefIntegrity detect?", a: "RefIntegrity detects retractions, expressions of concern, withdrawals, and removals in a paper's reference list." },
      { q: "How does RefIntegrity compare to manually checking Retraction Watch?", a: "Retraction Watch lets you look up individual papers one at a time. RefIntegrity automates this: paste a single DOI and it checks the entire reference list (often 30\u2013150 citations) against the Retraction Watch database via OpenAlex in seconds." },
      { q: "Can RefIntegrity check multiple papers at once?", a: "Yes. Use the bulk mode to paste multiple DOIs (one per line) or upload a BibTeX or RIS file. RefIntegrity checks all papers and shows a summary table with flagged counts." },
      { q: "What is the difference between a retraction and an expression of concern?", a: "A retraction means the paper has been formally withdrawn by the journal or authors due to errors or misconduct. An expression of concern is a notice that the journal has serious doubts about the paper but has not yet retracted it. RefIntegrity detects both types, plus withdrawals and removals." },
      { q: "Does RefIntegrity work with preprints or only published papers?", a: "RefIntegrity works with any paper indexed in OpenAlex, which covers over 250 million scholarly works including most published journal articles and conference papers. Preprints may not have structured reference lists available for checking." }
    ]
  };

  function t(key, params) {
    var keys = key.split(".");
    var val = translations[currentLang] || translations[DEFAULT_LANG];
    for (var i = 0; i < keys.length; i++) {
      if (val && typeof val === "object" && keys[i] in val) val = val[keys[i]];
      else { val = undefined; break; }
    }
    if (val === undefined) {
      val = translations[DEFAULT_LANG];
      for (var j = 0; j < keys.length; j++) {
        if (val && typeof val === "object" && keys[j] in val) val = val[keys[j]];
        else return key;
      }
    }
    if (typeof val !== "string") return key;
    if (params) {
      for (var pk in params) {
        if (params.hasOwnProperty(pk)) val = val.replace(new RegExp("\\{" + pk + "\\}", "g"), params[pk]);
      }
    }
    return val;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    var dir = (translations[currentLang] && translations[currentLang].dir) || "ltr";
    document.documentElement.dir = dir;
    if (dir === "rtl") document.body.classList.add("rtl");

    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute("data-i18n"); var v = t(k); if (v !== k) els[i].textContent = v; }
    els = document.querySelectorAll("[data-i18n-placeholder]");
    for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute("data-i18n-placeholder"); var v = t(k); if (v !== k) els[i].placeholder = v; }
    els = document.querySelectorAll("[data-i18n-html]");
    for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute("data-i18n-html"); var v = t(k); if (v !== k) els[i].innerHTML = v; }
    els = document.querySelectorAll("[data-i18n-aria]");
    for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute("data-i18n-aria"); var v = t(k); if (v !== k) els[i].setAttribute("aria-label", v); }

    var metaTitle = t("meta.title"); if (metaTitle !== "meta.title") document.title = metaTitle;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) { var d = t("meta.description"); if (d !== "meta.description") metaDesc.content = d; }
    var ogT = document.querySelector('meta[property="og:title"]');
    if (ogT) { var v = t("meta.ogTitle"); if (v !== "meta.ogTitle") ogT.content = v; }
    var ogD = document.querySelector('meta[property="og:description"]');
    if (ogD) { var v = t("meta.ogDescription"); if (v !== "meta.ogDescription") ogD.content = v; }
    var twT = document.querySelector('meta[name="twitter:title"]');
    if (twT) { var v = t("meta.ogTitle"); if (v !== "meta.ogTitle") twT.content = v; }
    var twD = document.querySelector('meta[name="twitter:description"]');
    if (twD) { var v = t("meta.twitterDescription"); if (v !== "meta.twitterDescription") twD.content = v; }

    // Update canonical and og:url for language pages
    var langUrl = currentLang === DEFAULT_LANG
      ? "https://refintegrity.com/"
      : "https://refintegrity.com/" + currentLang + "/";
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = langUrl;
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = langUrl;

    // Footer
    var footerLinks = {
      github: '<a href="https://github.com/Ctariy/RefIntegrity" target="_blank" rel="noopener">GitHub</a>',
      openalex: '<a href="https://openalex.org" target="_blank" rel="noopener">OpenAlex</a>',
      crossref: '<a href="https://www.crossref.org" target="_blank" rel="noopener">Crossref</a>',
      kofi: '<a href="https://ko-fi.com/ctariy" target="_blank" rel="noopener">Ko-fi</a>',
      sponsors: '<a href="https://github.com/sponsors/Ctariy" target="_blank" rel="noopener">GitHub Sponsors</a>'
    };
    var fp = document.querySelector(".footer-inner");
    if (fp) {
      var os = t("footer.openSource", footerLinks);
      var su = t("footer.support", footerLinks);
      var mo = t("footer.monthYear");
      var dateHtml = '<time datetime="2026-04-02">' + (mo !== "footer.monthYear" ? mo : "March 2026") + '</time>';
      var up = t("footer.updated", { date: dateHtml });
      if (os !== "footer.openSource") {
        fp.innerHTML = '<p>' + os + '</p>' +
          '<p>' + su + ' &middot; <span class="last-updated">' + up + '</span></p>';
      }
    }

    // FAQ JSON-LD schema + visible FAQ section
    var langData = translations[currentLang] || translations[DEFAULT_LANG];
    var faqSchema = document.getElementById("faq-schema");
    if (faqSchema && langData && langData.faq) {
      var entities = [];
      for (var fi = 0; fi < langData.faq.length; fi++) {
        entities.push({ "@type": "Question", "name": langData.faq[fi].q, "acceptedAnswer": { "@type": "Answer", "text": langData.faq[fi].a } });
      }
      faqSchema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": entities });
    }

    // Render visible FAQ
    var faqList = document.getElementById("faq-list");
    if (faqList && langData && langData.faq) {
      var html = "";
      for (var qi = 0; qi < langData.faq.length; qi++) {
        html += '<details class="faq-item"><summary>' + langData.faq[qi].q + '</summary><p>' + langData.faq[qi].a + '</p></details>';
      }
      faqList.innerHTML = html;
    }
  }

  function buildLangSwitcher() {
    var switcher = document.getElementById("lang-switcher");
    if (!switcher) return;
    var basePath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

    // Button showing current language
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-switcher-btn";
    btn.textContent = LANG_NAMES[currentLang] || currentLang.toUpperCase();
    switcher.appendChild(btn);

    // Dropdown with all languages
    var dropdown = document.createElement("div");
    dropdown.className = "lang-dropdown";
    for (var i = 0; i < SUPPORTED_LANGS.length; i++) {
      var lang = SUPPORTED_LANGS[i];
      var a = document.createElement("a");
      a.href = lang === DEFAULT_LANG ? basePath : "/" + lang + basePath;
      a.textContent = LANG_NAMES[lang] || lang.toUpperCase();
      a.className = "lang-option" + (lang === currentLang ? " lang-active" : "");
      a.setAttribute("hreflang", lang);
      dropdown.appendChild(a);
    }
    switcher.appendChild(dropdown);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", function () {
      dropdown.classList.remove("open");
    });
  }

  // Load language file dynamically, then apply
  function init() {
    buildLangSwitcher();
    if (currentLang === DEFAULT_LANG) {
      applyTranslations();
      return;
    }
    var script = document.createElement("script");
    script.src = "/i18n/i18n-" + currentLang + ".js";
    script.onload = function () { applyTranslations(); };
    script.onerror = function () { applyTranslations(); }; // fallback to English
    document.head.appendChild(script);
  }

  window.i18n = {
    t: t, lang: currentLang, defaultLang: DEFAULT_LANG,
    supported: SUPPORTED_LANGS, translations: translations,
    apply: applyTranslations, buildSwitcher: buildLangSwitcher,
    addLang: function (code, data) { translations[code] = data; },
    init: init
  };

  // Self-initialize (inline scripts blocked by CSP)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
