// i18n-it.js — IT translations for RefIntegrity
i18n.addLang("it", {
    lang: "it", langName: "Italiano", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 Verifica riferimenti ritrattati nelle pubblicazioni",
      description: "Strumento gratuito per verificare se i riferimenti bibliografici di un articolo scientifico sono stati ritrattati. Controlla i DOI con OpenAlex e Crossref in pochi secondi.",
      ogTitle: "RefIntegrity \u2014 Controlla i riferimenti ritrattati nei tuoi articoli",
      ogDescription: "Verifica gratuita e istantanea dei riferimenti bibliografici ritrattati.",
      twitterDescription: "Verifica gratis se i riferimenti di un articolo scientifico sono stati ritrattati."
    },
    nav: { howItWorks: "Come funziona", api: "API", source: "Codice sorgente" },
    hero: {
      h1: "Verifica i riferimenti ritrattati nei tuoi articoli scientifici",
      subtitle: "Inserisci un titolo dell'articolo, DOI o PMID per controllare istantaneamente se i riferimenti bibliografici sono stati ritrattati, ritirati o segnalati con espressione di preoccupazione."
    },
    search: {
      placeholder: "Titolo dell'articolo, DOI, PMID o arXiv ID",
      checkBtn: "Verifica",
      tryLabel: "Prova:",
      checkMultiple: "Verifica pi\u00f9 articoli",
      uploadBibRis: "Carica BibTeX/RIS",
      bulkPlaceholder: "DOI, PMID o arXiv ID (uno per riga) o contenuto BibTeX/RIS",
      checkAll: "Verifica tutti",
      selectPaper: "Seleziona l'articolo da verificare:", citedBy: "citato da {count}"
    },
    history: { recent: "Recenti:" },
    loading: {
      lookingUp: "Ricerca in corso\u2026", searching: "Ricerca in corso\u2026",
      checkingNofM: "Verifica {current} di {total}\u2026"
    },
    errors: {
      enterDoi: "Inserisci un DOI per continuare.",
      invalidDoi: "Il DOI inserito non \u00e8 valido. Esempio: 10.1038/s41577-020-0311-8",
      pasteDois: "Incolla uno o pi\u00f9 DOI.",
      noValidDois: "Nessun DOI valido trovato.",
      fileTooLarge: "Il file \u00e8 troppo grande (max. 1 MB).",
      unexpectedResponse: "Risposta imprevista dal server.",
      genericError: "Si \u00e8 verificato un errore.",
      networkError: "Errore di connessione. Verifica la tua connessione a Internet.",
      noSearchResults: "Nessun articolo trovato. Prova un titolo pi\u00f9 specifico o inserisci un DOI."
    },
    results: {
      allClear: "Nessun problema rilevato \u2014 tutti i {total} riferimenti verificati risultano integri.",
      flaggedCount: "{flagged} riferimenti segnalati su {total} verificati.",
      flaggedCountSingular: "{flagged} riferimento segnalato su {total} verificati.",
      noIndexedRefs: "Nessun riferimento indicizzato trovato per questo articolo.",
      arxivNoRefsHint: "I preprint arXiv spesso non hanno riferimenti indicizzati. Prova il DOI della versione pubblicata.",
      selfRetractedWarning: "<strong>Attenzione:</strong> Questo articolo \u00e8 stato ritrattato.",
      titleUnavailable: "Titolo non disponibile",
      resultsHeading: "Risultati",
      copyResults: "Copia risultati",
      downloadCsv: "Scarica CSV",
      copiedToClipboard: "Copiato negli appunti!",
      papers: "articoli",
      references: "riferimenti",
      flagged: "segnalati",
      errorsLabel: "errori",
      disclaimer: "{total} riferimenti verificati nei registri di ritrattazione di",
      clean: "Integro"
    },
    statuses: {
      retracted: "Ritrattato",
      expressionOfConcern: "Espressione di preoccupazione",
      withdrawn: "Ritirato",
      removed: "Rimosso"
    },
    footer: {
      openSource: "RefIntegrity \u00e8 un software libero e open source ({github}). Dati da {openalex} e {crossref}.",
      support: "Ti \u00e8 utile? Sostieni il progetto su {kofi} o {sponsors}",
      updated: "Aggiornato {date}",
      monthYear: "marzo 2026"
    },
    noscript: "Per utilizzare RefIntegrity \u00e8 necessario abilitare JavaScript.",
    howItWorksPanel: {
      step1: "<strong>Inserisci un titolo o un identificatore</strong> \u2014 o carica un file BibTeX/RIS.",
      step2: "<strong>Verifica automatica</strong> \u2014 tutti i riferimenti vengono controllati via OpenAlex.",
      step3: "<strong>Risultati istantanei</strong> \u2014 i riferimenti ritrattati vengono mostrati con stato, data e link.",
      note: "A differenza del controllo manuale, RefIntegrity verifica l'intera lista in pochi secondi."
    },
    faq: [
      { q: "Come posso verificare se i riferimenti di un articolo sono stati ritrattati?", a: "Incolla il DOI in RefIntegrity. Lo strumento analizza automaticamente tutti i riferimenti bibliografici." },
      { q: "RefIntegrity \u00e8 gratuito?", a: "S\u00ec, completamente gratuito e senza registrazione." },
      { q: "Quali database utilizza RefIntegrity?", a: "OpenAlex e Crossref." },
      { q: "Quali tipi di problemi rileva RefIntegrity?", a: "Ritrattazioni, expression of concern, ritiri e rimozioni." },
      { q: "Come si confronta RefIntegrity con il controllo manuale?", a: "RefIntegrity verifica tutti i riferimenti automaticamente in pochi secondi." },
      { q: "RefIntegrity pu\u00f2 verificare pi\u00f9 articoli contemporaneamente?", a: "S\u00ec, incolla pi\u00f9 DOI o carica un file BibTeX/RIS." },
      { q: "Qual \u00e8 la differenza tra una ritrattazione e un'expression of concern?", a: "Una ritrattazione invalida l'articolo. Un'expression of concern segnala possibili problemi senza ancora ritirare l'articolo." },
      { q: "RefIntegrity funziona con i preprint?", a: "S\u00ec, con qualsiasi pubblicazione indicizzata in OpenAlex." }
    ]
  });
