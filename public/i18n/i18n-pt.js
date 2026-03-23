// i18n-pt.js — PT translations for RefIntegrity
i18n.addLang("pt", {
    lang: "pt", langName: "Portugu\u00eas", dir: "ltr",
    meta: {
      title: "RefIntegrity \u2014 Verifique Refer\u00eancias Retratadas em Artigos",
      description: "Ferramenta gratuita para verificar se as refer\u00eancias de um artigo cient\u00edfico foram retratadas. Cole o DOI e descubra retra\u00e7\u00f5es em segundos.",
      ogTitle: "RefIntegrity \u2014 Verificador de Refer\u00eancias Retratadas",
      ogDescription: "Verifique gratuitamente se as refer\u00eancias do seu artigo cient\u00edfico citam trabalhos retratados.",
      twitterDescription: "Verifique se seu artigo cita refer\u00eancias retratadas. Gratuito e instant\u00e2neo."
    },
    nav: { howItWorks: "Como funciona", api: "API", source: "C\u00f3digo-fonte" },
    hero: {
      h1: "Verifique se as refer\u00eancias do seu artigo foram retratadas",
      subtitle: "Cole um DOI e descubra instantaneamente se alguma refer\u00eancia citada foi retratada, recebeu express\u00e3o de preocupa\u00e7\u00e3o ou foi removida. Gratuito, sem cadastro."
    },
    search: {
      placeholder: "Cole um DOI ou arXiv ID \u2014 ex: 10.1038/s41577-020-0311-8",
      checkBtn: "Verificar",
      tryLabel: "Experimente:",
      checkMultiple: "Verificar v\u00e1rios artigos",
      uploadBibRis: "Enviar BibTeX/RIS",
      bulkPlaceholder: "Cole um DOI por linha",
      checkAll: "Verificar todos"
    },
    history: { recent: "Recentes:" },
    loading: {
      lookingUp: "Buscando artigo\u2026",
      checkingNofM: "Verificando {current} de {total}\u2026"
    },
    errors: {
      enterDoi: "Por favor, insira um DOI.",
      invalidDoi: "Formato de DOI inv\u00e1lido. Exemplo: 10.1038/s41577-020-0311-8",
      pasteDois: "Cole um ou mais DOIs para verificar.",
      noValidDois: "Nenhum DOI v\u00e1lido encontrado.",
      fileTooLarge: "Arquivo muito grande (m\u00e1x. 1 MB).",
      unexpectedResponse: "Resposta inesperada do servidor. Tente novamente.",
      genericError: "Ocorreu um erro.",
      networkError: "Erro de conex\u00e3o. Verifique sua internet e tente novamente."
    },
    results: {
      allClear: "Tudo certo \u2014 nenhuma das {total} refer\u00eancias foi retratada.",
      flaggedCount: "{flagged} de {total} refer\u00eancias foram sinalizadas.",
      flaggedCountSingular: "{flagged} de {total} refer\u00eancias foi sinalizada.",
      noIndexedRefs: "Nenhuma refer\u00eancia indexada encontrada para este artigo.",
      selfRetractedWarning: "<strong>Nota:</strong> Este artigo foi retratado.",
      titleUnavailable: "T\u00edtulo indispon\u00edvel",
      resultsHeading: "Resultados",
      copyResults: "Copiar resultados",
      downloadCsv: "Baixar CSV",
      copiedToClipboard: "Copiado!",
      papers: "artigos",
      references: "refer\u00eancias",
      flagged: "sinalizadas",
      errorsLabel: "erros",
      clean: "Sem problemas"
    },
    statuses: {
      retracted: "Retratado",
      expressionOfConcern: "Express\u00e3o de preocupa\u00e7\u00e3o",
      withdrawn: "Retirado",
      removed: "Removido"
    },
    footer: {
      openSource: "RefIntegrity \u00e9 um software livre e de c\u00f3digo aberto ({github}). Dados de {openalex} e {crossref}.",
      support: "\u00datil? Apoie o projeto no {kofi} ou {sponsors}",
      updated: "Atualizado {date}",
      monthYear: "mar\u00e7o de 2026"
    },
    noscript: "O RefIntegrity requer JavaScript para funcionar.",
    howItWorksPanel: {
      step1: "<strong>Cole um DOI</strong> \u2014 ou envie um arquivo BibTeX/RIS.",
      step2: "<strong>Verifica\u00e7\u00e3o autom\u00e1tica</strong> \u2014 todas as refer\u00eancias s\u00e3o verificadas via OpenAlex.",
      step3: "<strong>Resultados instant\u00e2neos</strong> \u2014 refer\u00eancias retratadas s\u00e3o exibidas com status, data e link.",
      note: "Ao contr\u00e1rio da verifica\u00e7\u00e3o manual, RefIntegrity analisa toda a lista em segundos."
    },
    faq: [
      { q: "Como verifico se as refer\u00eancias de um artigo foram retratadas?", a: "Cole o DOI no RefIntegrity. A ferramenta analisa automaticamente todas as refer\u00eancias citadas." },
      { q: "O RefIntegrity \u00e9 gratuito?", a: "Sim, totalmente gratuito. N\u00e3o exige cadastro." },
      { q: "Quais bases de dados o RefIntegrity utiliza?", a: "OpenAlex e Crossref." },
      { q: "Que tipos de problemas o RefIntegrity detecta?", a: "Retra\u00e7\u00f5es, express\u00f5es de preocupa\u00e7\u00e3o, retiradas e remo\u00e7\u00f5es." },
      { q: "Como o RefIntegrity se compara \u00e0 verifica\u00e7\u00e3o manual no Retraction Watch?", a: "RefIntegrity automatiza o processo \u2014 analisa todas as refer\u00eancias em segundos." },
      { q: "O RefIntegrity pode verificar v\u00e1rios artigos de uma vez?", a: "Sim. Cole m\u00faltiplos DOIs ou envie um arquivo BibTeX/RIS." },
      { q: "Qual a diferen\u00e7a entre retra\u00e7\u00e3o e express\u00e3o de preocupa\u00e7\u00e3o?", a: "Retra\u00e7\u00e3o invalida o artigo. Express\u00e3o de preocupa\u00e7\u00e3o \u00e9 um alerta enquanto a investiga\u00e7\u00e3o est\u00e1 em andamento." },
      { q: "O RefIntegrity funciona com preprints?", a: "Sim, com qualquer documento indexado no OpenAlex que tenha DOI." }
    ]
  });
