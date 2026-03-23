// i18n-fr.js — FR translations for RefIntegrity
i18n.addLang("fr", {
    lang: "fr", langName: "Fran\u00e7ais", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 V\u00e9rifier les r\u00e9f\u00e9rences r\u00e9tract\u00e9es d'un article",
      description: "Outil gratuit pour v\u00e9rifier si les r\u00e9f\u00e9rences d'un article scientifique ont \u00e9t\u00e9 r\u00e9tract\u00e9es. Collez un DOI et obtenez un rapport instantan\u00e9 via OpenAlex et Crossref.",
      ogTitle: "RefIntegrity \u2014 D\u00e9tecteur de r\u00e9f\u00e9rences r\u00e9tract\u00e9es",
      ogDescription: "V\u00e9rifiez gratuitement si les r\u00e9f\u00e9rences cit\u00e9es dans un article scientifique ont fait l'objet d'une r\u00e9tractation.",
      twitterDescription: "V\u00e9rifiez si les r\u00e9f\u00e9rences d'un article scientifique ont \u00e9t\u00e9 r\u00e9tract\u00e9es. Gratuit et instantan\u00e9."
    },
    nav: { howItWorks: "Fonctionnement", api: "API", source: "Code source" },
    hero: {
      h1: "V\u00e9rifiez si les r\u00e9f\u00e9rences d'un article ont \u00e9t\u00e9 r\u00e9tract\u00e9es",
      subtitle: "Collez un DOI pour v\u00e9rifier instantan\u00e9ment si les r\u00e9f\u00e9rences cit\u00e9es ont \u00e9t\u00e9 r\u00e9tract\u00e9es, retir\u00e9es ou font l'objet d'un avertissement. Gratuit, open source, sans inscription."
    },
    search: {
      placeholder: "Titre de l'article, DOI, PMID ou arXiv ID",
      checkBtn: "V\u00e9rifier",
      tryLabel: "Essayez\u00a0:",
      checkMultiple: "V\u00e9rifier plusieurs articles",
      uploadBibRis: "Importer BibTeX/RIS",
      bulkPlaceholder: "Collez plusieurs DOI (un par ligne)",
      checkAll: "Tout v\u00e9rifier",
      selectPaper: "S\u00e9lectionnez l'article \u00e0 v\u00e9rifier\u00a0:", citedBy: "cit\u00e9 par {count}"
    },
    history: { recent: "R\u00e9centes\u00a0:" },
    loading: {
      lookingUp: "Recherche en cours\u2026", searching: "Recherche\u2026",
      checkingNofM: "V\u00e9rification {current} sur {total}\u2026"
    },
    errors: {
      enterDoi: "Veuillez saisir un DOI.",
      invalidDoi: "DOI invalide. V\u00e9rifiez le format (ex. 10.1038/s41577-020-0311-8).",
      pasteDois: "Collez un ou plusieurs DOI.",
      noValidDois: "Aucun DOI valide trouv\u00e9 dans le texte saisi.",
      fileTooLarge: "Fichier trop volumineux (max. 1 Mo).",
      unexpectedResponse: "R\u00e9ponse inattendue du serveur. Veuillez r\u00e9essayer.",
      genericError: "Une erreur est survenue.",
      networkError: "Erreur r\u00e9seau. V\u00e9rifiez votre connexion et r\u00e9essayez.",
      noSearchResults: "Aucun article trouv\u00e9. Essayez un titre plus pr\u00e9cis ou collez un DOI."
    },
    results: {
      allClear: "Aucune r\u00e9tractation d\u00e9tect\u00e9e parmi les {total} r\u00e9f\u00e9rences v\u00e9rifi\u00e9es.",
      flaggedCount: "{flagged} r\u00e9f\u00e9rences signal\u00e9es sur {total} v\u00e9rifi\u00e9es.",
      flaggedCountSingular: "{flagged} r\u00e9f\u00e9rence signal\u00e9e sur {total} v\u00e9rifi\u00e9es.",
      noIndexedRefs: "Aucune r\u00e9f\u00e9rence index\u00e9e trouv\u00e9e pour cet article.",
      arxivNoRefsHint: "Les preprints arXiv n'ont souvent pas de r\u00e9f\u00e9rences index\u00e9es. Essayez le DOI de la version publi\u00e9e.",
      selfRetractedWarning: "<strong>Attention\u00a0:</strong> Cet article a lui-m\u00eame \u00e9t\u00e9 r\u00e9tract\u00e9.",
      titleUnavailable: "Titre non disponible",
      resultsHeading: "R\u00e9sultats",
      copyResults: "Copier les r\u00e9sultats",
      downloadCsv: "T\u00e9l\u00e9charger CSV",
      copiedToClipboard: "Copi\u00e9 dans le presse-papiers",
      papers: "articles",
      references: "r\u00e9f\u00e9rences",
      flagged: "signal\u00e9es",
      errorsLabel: "erreurs",
      disclaimer: "{total} r\u00e9f\u00e9rences v\u00e9rifi\u00e9es dans les registres de r\u00e9tractation de",
      clean: "Conforme"
    },
    statuses: {
      retracted: "R\u00e9tract\u00e9",
      expressionOfConcern: "Expression de pr\u00e9occupation",
      withdrawn: "Retir\u00e9",
      removed: "Supprim\u00e9"
    },
    footer: {
      openSource: "RefIntegrity est un logiciel libre et open source ({github}). Donn\u00e9es fournies par {openalex} et {crossref}.",
      support: "Utile\u00a0? Soutenez le projet via {kofi} ou {sponsors}",
      updated: "Mis \u00e0 jour {date}",
      monthYear: "mars 2026"
    },
    noscript: "JavaScript est n\u00e9cessaire pour utiliser RefIntegrity.",
    howItWorksPanel: {
      step1: "<strong>Collez un DOI</strong> \u2014 ou importez un fichier BibTeX/RIS.",
      step2: "<strong>V\u00e9rification automatique</strong> \u2014 toutes les r\u00e9f\u00e9rences sont v\u00e9rifi\u00e9es via OpenAlex.",
      step3: "<strong>R\u00e9sultats instantan\u00e9s</strong> \u2014 les r\u00e9f\u00e9rences signal\u00e9es avec statut, date et lien vers l'avis.",
      note: "Contrairement \u00e0 la v\u00e9rification manuelle, RefIntegrity analyse toute la liste en quelques secondes."
    },
    faq: [
      { q: "Comment v\u00e9rifier si les r\u00e9f\u00e9rences d'un article ont \u00e9t\u00e9 r\u00e9tract\u00e9es\u00a0?", a: "Collez le DOI dans RefIntegrity. L'outil analyse automatiquement toutes les r\u00e9f\u00e9rences et signale celles qui ont \u00e9t\u00e9 r\u00e9tract\u00e9es ou font l'objet d'une expression de pr\u00e9occupation." },
      { q: "RefIntegrity est-il gratuit\u00a0?", a: "Oui, RefIntegrity est enti\u00e8rement gratuit et open source. Aucune inscription n\u00e9cessaire." },
      { q: "Quelles bases de donn\u00e9es RefIntegrity utilise-t-il\u00a0?", a: "RefIntegrity interroge OpenAlex pour les r\u00e9f\u00e9rences et le statut de r\u00e9tractation, puis Crossref pour les d\u00e9tails des avis." },
      { q: "Quels types de probl\u00e8mes RefIntegrity d\u00e9tecte-t-il\u00a0?", a: "R\u00e9tractations, expressions de pr\u00e9occupation, retraits et suppressions." },
      { q: "Comment RefIntegrity se compare-t-il \u00e0 Retraction Watch\u00a0?", a: "Retraction Watch v\u00e9rifie un article \u00e0 la fois. RefIntegrity automatise le processus pour toutes les r\u00e9f\u00e9rences en quelques secondes." },
      { q: "Peut-on v\u00e9rifier plusieurs articles \u00e0 la fois\u00a0?", a: "Oui. Collez plusieurs DOI ou importez un fichier BibTeX/RIS." },
      { q: "Quelle diff\u00e9rence entre r\u00e9tractation et expression de pr\u00e9occupation\u00a0?", a: "Une r\u00e9tractation invalide l'article. Une expression de pr\u00e9occupation signale des doutes mais l'article n'est pas encore r\u00e9tract\u00e9." },
      { q: "RefIntegrity fonctionne-t-il avec les preprints\u00a0?", a: "Oui, pour tout document disposant d'un DOI et index\u00e9 dans OpenAlex." }
    ]
  });
