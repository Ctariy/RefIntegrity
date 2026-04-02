// i18n-es.js — ES translations for RefIntegrity
i18n.addLang("es", {
    lang: "es", langName: "Espa\u00f1ol", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 Verificador de referencias retractadas gratis",
      description: "Herramienta gratuita para verificar si las referencias de un art\u00edculo cient\u00edfico han sido retractadas. Comprueba DOIs al instante con datos de OpenAlex y Crossref.",
      ogTitle: "RefIntegrity \u2014 Detecta referencias retractadas en art\u00edculos cient\u00edficos",
      ogDescription: "Verifica gratis si las referencias de tu paper citan art\u00edculos retractados. Resultados instant\u00e1neos con OpenAlex y Crossref.",
      twitterDescription: "Verifica si las referencias de un art\u00edculo cient\u00edfico han sido retractadas. Gratis e instant\u00e1neo."
    },
    nav: { howItWorks: "C\u00f3mo funciona", api: "API", source: "C\u00f3digo fuente" },
    hero: {
      h1: "No dejes que las citas retractadas socaven tu art\u00edculo",
      subtitle: "Herramienta gratuita que comprueba autom\u00e1ticamente si las referencias de un art\u00edculo cient\u00edfico han sido retractadas, retiradas o tienen expresiones de preocupaci\u00f3n. Ingresa un t\u00edtulo del art\u00edculo, DOI o PMID y obt\u00e9n resultados en segundos."
    },
    search: {
      placeholder: "T\u00edtulo del art\u00edculo, DOI, PMID o arXiv ID",
      checkBtn: "Verificar",
      tryLabel: "Prueba:",
      checkMultiple: "Verificar m\u00faltiples art\u00edculos",
      uploadBibRis: "Subir archivo BibTeX/RIS",
      bulkPlaceholder: "DOIs, PMIDs o arXiv IDs (uno por l\u00ednea) o contenido BibTeX/RIS",
      checkAll: "Verificar todos",
      selectPaper: "Selecciona el art\u00edculo que deseas verificar:",
      citedBy: "citado por {count}"
    },
    history: { recent: "Recientes:" },
    loading: {
      lookingUp: "Buscando art\u00edculo\u2026", searching: "Buscando\u2026",
      checkingNofM: "Verificando {current} de {total}\u2026"
    },
    errors: {
      enterDoi: "Ingresa un DOI para verificar.",
      invalidDoi: "El formato del DOI no es v\u00e1lido. Ejemplo: 10.1038/s41577-020-0311-8",
      pasteDois: "Pega uno o m\u00e1s DOIs para verificar.",
      noValidDois: "No se encontraron DOIs v\u00e1lidos en el texto ingresado.",
      fileTooLarge: "El archivo es demasiado grande (m\u00e1x. 1 MB).",
      unexpectedResponse: "Respuesta inesperada del servidor. Intenta de nuevo.",
      genericError: "Ocurri\u00f3 un error.",
      networkError: "Error de conexi\u00f3n. Verifica tu conexi\u00f3n a internet e intenta de nuevo.",
      noSearchResults: "No se encontraron art\u00edculos. Prueba con un t\u00edtulo m\u00e1s espec\u00edfico o un DOI."
    },
    results: {
      allClear: "Sin problemas \u2014 las {total} referencias verificadas est\u00e1n limpias.",
      flaggedCount: "{flagged} de {total} referencias tienen alertas.",
      flaggedCountSingular: "{flagged} de {total} referencias tiene una alerta.",
      noIndexedRefs: "No se encontraron referencias indexadas para este art\u00edculo.",
      arxivNoRefsHint: "Los preprints de arXiv suelen carecer de datos de referencias. Prueba con el DOI de la versi\u00f3n publicada.",
      selfRetractedWarning: "<strong>Nota:</strong> Este art\u00edculo ha sido retractado.",
      titleUnavailable: "T\u00edtulo no disponible",
      resultsHeading: "Resultados",
      copyResults: "Copiar resultados",
      downloadCsv: "Descargar CSV",
      copiedToClipboard: "Copiado al portapapeles",
      papers: "art\u00edculos",
      references: "referencias",
      flagged: "con alertas",
      errorsLabel: "errores",
      disclaimer: "Se verificaron {total} referencias contra los registros de retracci\u00f3n de",
      coverageNote: "Se verificaron {checked} de {total} referencias ({pct}% de cobertura). Algunas referencias no pudieron resolverse.",
      clean: "Sin problemas"
    },
    statuses: {
      retracted: "Retractado",
      expressionOfConcern: "Expresi\u00f3n de preocupaci\u00f3n",
      withdrawn: "Retirado",
      removed: "Eliminado"
    },
    footer: {
      openSource: "RefIntegrity es software libre y de c\u00f3digo abierto ({github}). Datos de {openalex} y {crossref}.",
      support: "\u00bfTe resulta \u00fatil? Apoya el proyecto en {kofi} o {sponsors}",
      updated: "Actualizado {date}",
      monthYear: "abril de 2026"
    },
    noscript: "RefIntegrity requiere JavaScript para funcionar.",
    howItWorksPanel: {
      step1: "<strong>Ingresa un t\u00edtulo o identificador</strong> \u2014 o sube un archivo BibTeX/RIS.",
      step2: "<strong>Verificaci\u00f3n autom\u00e1tica</strong> \u2014 todas las referencias se comprueban contra Retraction Watch v\u00eda OpenAlex.",
      step3: "<strong>Resultados instant\u00e1neos</strong> \u2014 las referencias marcadas se muestran con estado, fecha y enlace al aviso de retracci\u00f3n.",
      note: "A diferencia de la verificaci\u00f3n manual, RefIntegrity comprueba toda la lista de referencias en segundos."
    },
    faq: [
      { q: "\u00bfC\u00f3mo verifico si las referencias de un art\u00edculo han sido retractadas?", a: "Pega el DOI del art\u00edculo en RefIntegrity. La herramienta analizar\u00e1 autom\u00e1ticamente todas las referencias y te mostrar\u00e1 cu\u00e1les han sido retractadas, retiradas o tienen expresiones de preocupaci\u00f3n." },
      { q: "\u00bfRefIntegrity es gratuito?", a: "S\u00ed, RefIntegrity es completamente gratuito y de c\u00f3digo abierto. No requiere registro ni suscripci\u00f3n." },
      { q: "\u00bfQu\u00e9 bases de datos utiliza RefIntegrity?", a: "RefIntegrity consulta OpenAlex para obtener las referencias y detectar retractaciones, y Crossref para obtener detalles adicionales como el tipo de alerta, la fecha y el aviso de retractaci\u00f3n." },
      { q: "\u00bfQu\u00e9 tipos de problemas detecta RefIntegrity?", a: "RefIntegrity detecta cuatro tipos de alertas: retractaciones, expresiones de preocupaci\u00f3n, retiros y eliminaciones de art\u00edculos citados en las referencias." },
      { q: "\u00bfC\u00f3mo se compara RefIntegrity con verificar manualmente en Retraction Watch?", a: "Retraction Watch permite buscar art\u00edculos uno por uno. RefIntegrity automatiza el proceso: verifica todas las referencias de un art\u00edculo en segundos." },
      { q: "\u00bfPuedo verificar varios art\u00edculos a la vez?", a: "S\u00ed. Haz clic en \u00abVerificar m\u00faltiples art\u00edculos\u00bb, pega varios DOIs o sube un archivo BibTeX/RIS, y RefIntegrity los verificar\u00e1 todos de una vez." },
      { q: "\u00bfCu\u00e1l es la diferencia entre una retractaci\u00f3n y una expresi\u00f3n de preocupaci\u00f3n?", a: "Una retractaci\u00f3n significa que el art\u00edculo ha sido invalidado por la revista. Una expresi\u00f3n de preocupaci\u00f3n indica que la revista ha identificado posibles problemas pero a\u00fan no ha tomado una decisi\u00f3n definitiva." },
      { q: "\u00bfRefIntegrity funciona con preprints o solo con art\u00edculos publicados?", a: "RefIntegrity funciona con cualquier art\u00edculo que tenga un DOI y est\u00e9 indexado en OpenAlex. Algunos preprints con DOI tambi\u00e9n pueden funcionar." }
    ]
  });
