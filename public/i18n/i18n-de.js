// i18n-de.js — DE translations for RefIntegrity
i18n.addLang("de", {
    lang: "de", langName: "Deutsch", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 Referenzen auf Retraktionen pr\u00fcfen | Kostenlos",
      description: "Pr\u00fcfen Sie mit RefIntegrity, ob die Referenzen Ihrer wissenschaftlichen Publikation zur\u00fcckgezogen wurden. Kostenlos, schnell und zuverl\u00e4ssig \u2014 basierend auf OpenAlex und Crossref.",
      ogTitle: "RefIntegrity \u2014 Zur\u00fcckgezogene Referenzen in Fachartikeln erkennen",
      ogDescription: "Kostenloses Tool zur \u00dcberpr\u00fcfung wissenschaftlicher Literaturverzeichnisse auf Retraktionen.",
      twitterDescription: "Kostenlos pr\u00fcfen, ob Referenzen in wissenschaftlichen Artikeln zur\u00fcckgezogen wurden."
    },
    nav: { howItWorks: "So funktioniert's", api: "API", source: "Quellcode" },
    hero: {
      h1: "Referenzen auf Retraktionen pr\u00fcfen",
      subtitle: "F\u00fcgen Sie einen DOI ein und pr\u00fcfen Sie in Sekunden, ob zitierte Arbeiten zur\u00fcckgezogen wurden. Kostenlos, ohne Registrierung."
    },
    search: {
      placeholder: "DOI eingeben \u2014 z.\u00a0B. 10.1038/s41577-020-0311-8",
      checkBtn: "Pr\u00fcfen",
      tryLabel: "Beispiel:",
      checkMultiple: "Mehrere Artikel pr\u00fcfen",
      uploadBibRis: "BibTeX/RIS hochladen",
      bulkPlaceholder: "Einen DOI pro Zeile eingeben",
      checkAll: "Alle pr\u00fcfen"
    },
    history: { recent: "Letzte:" },
    loading: {
      lookingUp: "Artikel wird abgerufen\u2026",
      checkingNofM: "Pr\u00fcfe {current} von {total}\u2026"
    },
    errors: {
      enterDoi: "Bitte geben Sie einen DOI ein.",
      invalidDoi: "Ung\u00fcltiges DOI-Format. Beispiel: 10.1038/s41577-020-0311-8",
      pasteDois: "Bitte f\u00fcgen Sie mindestens einen DOI ein.",
      noValidDois: "Es wurden keine g\u00fcltigen DOIs gefunden.",
      fileTooLarge: "Datei zu gro\u00df (max. 1\u00a0MB).",
      unexpectedResponse: "Unerwartete Antwort vom Server. Bitte versuchen Sie es erneut.",
      genericError: "Ein Fehler ist aufgetreten.",
      networkError: "Netzwerkfehler. Bitte \u00fcberpr\u00fcfen Sie Ihre Internetverbindung."
    },
    results: {
      allClear: "Alles in Ordnung \u2014 keine der {total} gepr\u00fcften Referenzen wurde zur\u00fcckgezogen.",
      flaggedCount: "{flagged} von {total} Referenzen wurden als problematisch markiert.",
      flaggedCountSingular: "{flagged} von {total} Referenzen wurde als problematisch markiert.",
      noIndexedRefs: "F\u00fcr diesen Artikel sind keine indexierten Referenzen verf\u00fcgbar.",
      selfRetractedWarning: "<strong>Achtung:</strong> Dieser Artikel selbst wurde zur\u00fcckgezogen.",
      titleUnavailable: "Titel nicht verf\u00fcgbar",
      resultsHeading: "Ergebnisse",
      copyResults: "Ergebnisse kopieren",
      downloadCsv: "CSV herunterladen",
      copiedToClipboard: "In die Zwischenablage kopiert",
      papers: "Artikel",
      references: "Referenzen",
      flagged: "markiert",
      errorsLabel: "Fehler",
      clean: "Unbedenklich"
    },
    statuses: {
      retracted: "Zur\u00fcckgezogen",
      expressionOfConcern: "Ausdruck der Besorgnis",
      withdrawn: "Zur\u00fcckgenommen",
      removed: "Entfernt"
    },
    footer: {
      openSource: "RefIntegrity ist freie Open-Source-Software ({github}). Daten von {openalex} und {crossref}.",
      support: "N\u00fctzlich? Unterst\u00fctzen Sie das Projekt \u00fcber {kofi} oder {sponsors}",
      updated: "Aktualisiert {date}",
      monthYear: "M\u00e4rz 2026"
    },
    noscript: "F\u00fcr RefIntegrity muss JavaScript aktiviert sein.",
    howItWorksPanel: {
      step1: "<strong>DOI eingeben</strong> \u2014 oder BibTeX/RIS-Datei hochladen.",
      step2: "<strong>Automatische Pr\u00fcfung</strong> \u2014 alle Referenzen werden gegen Retraktionsdatenbanken abgeglichen.",
      step3: "<strong>Sofortige Ergebnisse</strong> \u2014 problematische Referenzen werden mit Status, Datum und Hinweis-DOI angezeigt.",
      note: "Im Gegensatz zur manuellen Pr\u00fcfung analysiert RefIntegrity das gesamte Literaturverzeichnis in Sekunden."
    },
    faq: [
      { q: "Wie pr\u00fcfe ich, ob die Referenzen eines Artikels zur\u00fcckgezogen wurden?", a: "Geben Sie den DOI ein und klicken Sie auf \u201ePr\u00fcfen\u201c. RefIntegrity ruft alle Referenzen ab und pr\u00fcft jede auf Retraktionen und Expressions of Concern." },
      { q: "Ist RefIntegrity kostenlos?", a: "Ja, vollst\u00e4ndig kostenlos und ohne Registrierung." },
      { q: "Welche Datenbanken nutzt RefIntegrity?", a: "OpenAlex f\u00fcr Referenzlisten und Retraktionsstatus, Crossref f\u00fcr Retraktionshinweise." },
      { q: "Welche Arten von Problemen erkennt RefIntegrity?", a: "Retraktionen, Expressions of Concern, Withdrawals und Entfernungen." },
      { q: "Wie unterscheidet sich RefIntegrity von Retraction Watch?", a: "RefIntegrity pr\u00fcft automatisch alle Referenzen in Sekunden, statt jeden Artikel einzeln nachzuschlagen." },
      { q: "Kann RefIntegrity mehrere Artikel pr\u00fcfen?", a: "Ja. Geben Sie mehrere DOIs ein oder laden Sie BibTeX/RIS-Dateien hoch." },
      { q: "Was ist der Unterschied zwischen Retraktion und Expression of Concern?", a: "Eine Retraktion zieht den Artikel vollst\u00e4ndig zur\u00fcck. Eine Expression of Concern signalisiert Bedenken, w\u00e4hrend die Untersuchung noch l\u00e4uft." },
      { q: "Funktioniert RefIntegrity mit Preprints?", a: "Ja, f\u00fcr alle Dokumente mit DOI, die in OpenAlex indexiert sind." }
    ]
  });
