// DOM
const doiInput = document.getElementById("doi-input");
const checkBtn = document.getElementById("check-btn");
const inputSingle = document.getElementById("input-single");
const inputBulk = document.getElementById("input-bulk");
const bulkInput = document.getElementById("bulk-input");
const bulkCheckBtn = document.getElementById("bulk-check-btn");
const modeToggle = document.getElementById("mode-toggle");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
var isBulkMode = false;
const loadingSection = document.getElementById("loading");
const loadingText = document.getElementById("loading-text");
const errorSection = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const resultsSection = document.getElementById("results");
const resultHero = document.getElementById("result-hero");
const paperTitle = document.getElementById("paper-title");
const flaggedList = document.getElementById("flagged-list");
const selfRetractedWarning = document.getElementById("self-retracted-warning");
const exportActions = document.getElementById("export-actions");
const copyBtn = document.getElementById("copy-btn");
const csvBtn = document.getElementById("csv-btn");
const bulkResults = document.getElementById("bulk-results");
const bulkSummary = document.getElementById("bulk-summary");
const bulkTableWrapper = document.getElementById("bulk-table-wrapper");
const bulkCsvBtn = document.getElementById("bulk-csv-btn");
const historySection = document.getElementById("history-section");
const historyList = document.getElementById("history-list");
const searchResultsSection = document.getElementById("search-results");
const searchList = document.getElementById("search-list");

let lastResult = null;
let bulkResultsData = [];
let currentController = null;

// --- DOI extraction ---

function arxivToDoi(id) {
  return "10.48550/arXiv." + id.replace(/v\d+$/i, "");
}

function extractDois(text) {
  const dois = new Set();
  for (const m of text.matchAll(/doi\s*=\s*[{"]\s*(10\.\d{4,9}\/[^\s}"]+)/gi))
    dois.add(m[1].replace(/[.,;]+$/, ""));
  for (const m of text.matchAll(/^DO\s+-\s+(10\.\d{4,9}\/\S+)/gm))
    dois.add(m[1].replace(/[.,;]+$/, ""));
  for (const m of text.matchAll(/(?:https?:\/\/(?:dx\.)?doi\.org\/)?(10\.\d{4,9}\/[^\s,;)"'}\]>]+)/g))
    dois.add(m[1].replace(/[.,;]+$/, ""));
  for (const m of text.matchAll(/(?:https?:\/\/arxiv\.org\/abs\/|arXiv:)([\w.-]+\/?\d+(?:v\d+)?)/gi))
    dois.add(arxivToDoi(m[1]));
  // PMID URLs and PMID: prefixes → store as pmid:N for later handling
  for (const m of text.matchAll(/(?:https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/|PMID:\s*)(\d{1,9})/gi))
    dois.add("pmid:" + m[1]);
  return [...dois];
}

function cleanDoi(input) {
  let doi = input.trim();
  // arXiv URL or prefix → convert to DOI
  var arxiv = doi.match(/^(?:https?:\/\/arxiv\.org\/abs\/|arXiv:)([\w.-]+\/?\d+(?:v\d+)?)\s*$/i);
  if (arxiv) return arxivToDoi(arxiv[1]);
  doi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  doi = doi.replace(/^doi:\s*/i, "");
  return doi;
}

function isValidDoi(doi) {
  return /^10\.\d{4,9}\/[^\s]+$/i.test(doi);
}

function parsePmid(input) {
  var s = input.trim();
  // Only treat as PMID if explicitly prefixed or PubMed URL
  if (!/^PMID:/i.test(s) && !/pubmed\.ncbi\.nlm\.nih\.gov/i.test(s)) return null;
  s = s.replace(/^PMID:\s*/i, "").replace(/^https?:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)\/?.*$/i, "$1");
  return /^\d{4,9}$/.test(s) ? s : null;
}

// --- Utilities ---

function showSection(section) {
  [loadingSection, errorSection, resultsSection, bulkResults, searchResultsSection].forEach(
    (s) => (s.hidden = true)
  );
  selfRetractedWarning.hidden = true;
  if (section) section.hidden = false;
}

function showError(msg) {
  errorMessage.textContent = msg;
  showSection(errorSection);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function getStatusConfig(status) {
  const map = {
    retraction: { labelKey: "statuses.retracted", cssClass: "badge-retracted", cardClass: "retracted" },
    "expression-of-concern": { labelKey: "statuses.expressionOfConcern", cssClass: "badge-eoc", cardClass: "eoc" },
    withdrawal: { labelKey: "statuses.withdrawn", cssClass: "badge-withdrawn", cardClass: "withdrawn" },
    removal: { labelKey: "statuses.removed", cssClass: "badge-withdrawn", cardClass: "withdrawn" },
    retracted: { labelKey: "statuses.retracted", cssClass: "badge-retracted", cardClass: "retracted" },
  };
  const cfg = map[status] || map.retracted;
  return { label: i18n.t(cfg.labelKey), cssClass: cfg.cssClass, cardClass: cfg.cardClass };
}

// --- Loading steps ---

function setLoadingStep(text) {
  loadingText.textContent = text;
}

// --- History ---

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("refintegrity_history") || "[]");
  } catch { return []; }
}

function addToHistory(doi, title, count) {
  const history = getHistory().filter((h) => h.doi !== doi);
  history.unshift({ doi, title: title || doi, count, date: Date.now() });
  if (history.length > 10) history.pop();
  try { localStorage.setItem("refintegrity_history", JSON.stringify(history)); } catch { /* storage full or disabled */ }
  renderHistory();
}

var HISTORY_COMPACT_COUNT = 3;

function renderHistory() {
  const history = getHistory();
  var tryLink = document.getElementById("try-link");
  if (history.length === 0) {
    historySection.hidden = true;
    if (tryLink) tryLink.hidden = false;
    return;
  }
  historySection.hidden = false;
  // Hide "Try" example when user already has history
  if (tryLink) tryLink.hidden = true;
  var expanded = historySection.classList.contains("expanded");
  var visible = expanded ? history : history.slice(0, HISTORY_COMPACT_COUNT);
  var html = visible
    .map((h) => `<button class="history-item" data-doi="${escapeHtml(h.doi)}" title="${escapeHtml(h.title)}">${escapeHtml(h.doi)}</button>`)
    .join("");
  if (!expanded && history.length > HISTORY_COMPACT_COUNT) {
    var more = history.length - HISTORY_COMPACT_COUNT;
    html += `<button class="history-toggle" id="history-toggle-btn">+${more}</button>`;
  } else if (expanded && history.length > HISTORY_COMPACT_COUNT) {
    html += `<button class="history-toggle" id="history-toggle-btn">&minus;</button>`;
  }
  historyList.innerHTML = html;
}

// --- Single check ---

async function checkSingle(doi, pmid) {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  showSection(loadingSection);
  setLoadingStep(i18n.t("loading.lookingUp"));
  checkBtn.disabled = true;

  try {
    const param = pmid ? `pmid=${encodeURIComponent(pmid)}` : `doi=${encodeURIComponent(doi)}`;
    const res = await fetch(`/api/check-doi?${param}`, { signal: currentController.signal });
    let data;
    try { data = await res.json(); } catch {
      showError(i18n.t("errors.unexpectedResponse")); return;
    }
    if (!res.ok) { showError(data.error || i18n.t("errors.genericError")); return; }

    lastResult = data;
    const historyId = data.doi || (pmid ? "PMID:" + pmid : doi);
    addToHistory(historyId, data.title, data.flagged_count);
    renderSingleResults(data);
  } catch (err) {
    if (err.name === "AbortError") return;
    showError(i18n.t("errors.networkError"));
  } finally {
    checkBtn.disabled = false;
    currentController = null;
  }
}

function renderSingleResults(data) {
  showSection(resultsSection);

  if (data.is_retracted) selfRetractedWarning.hidden = false;

  // Title first — the user wants to confirm they checked the right paper
  if (data.title) {
    paperTitle.innerHTML = `<h2>${escapeHtml(data.title)}</h2>`;
  } else {
    paperTitle.innerHTML = "";
  }

  // Summary line — calm, informative
  const total = data.referenced_works_count;
  const checked = data.checked_count != null ? data.checked_count : total;
  const flagged = data.flagged_count;

  if (flagged === 0 && checked > 0) {
    resultHero.className = "result-hero result-hero-ok";
    resultHero.innerHTML = `<strong>${i18n.t("results.allClear", { total: checked })}</strong>`;
  } else if (flagged > 0) {
    resultHero.className = "result-hero result-hero-warn";
    const key = flagged === 1 ? "results.flaggedCountSingular" : "results.flaggedCount";
    resultHero.innerHTML = `<strong>${i18n.t(key, { flagged, total: checked })}</strong>`;
  } else {
    resultHero.className = "result-hero result-hero-neutral";
    var msg = i18n.t("results.noIndexedRefs");
    if (data.doi && /^10\.48550\/arXiv\./i.test(data.doi)) {
      var hint = i18n.t("results.arxivNoRefsHint");
      if (hint !== "results.arxivNoRefsHint") msg += " " + hint;
    }
    resultHero.innerHTML = msg;
  }

  // Coverage note when not all references could be resolved
  if (checked > 0 && total > checked) {
    var pct = Math.round((checked / total) * 100);
    var coverageHtml = `<div class="coverage-note">${i18n.t("results.coverageNote", { checked, total, pct })}</div>`;
    resultHero.innerHTML += coverageHtml;
  }

  // Export
  exportActions.hidden = flagged === 0 && total === 0;

  // Flagged cards
  if (data.flagged_references && data.flagged_references.length > 0) {
    flaggedList.innerHTML = data.flagged_references.map((ref) => {
      const cfg = getStatusConfig(ref.status);
      // Clean DOI for display (strip URL prefix)
      const shortDoi = ref.doi ? ref.doi.replace(/^https?:\/\/doi\.org\//i, "") : null;
      const doiUrl = shortDoi ? `https://doi.org/${shortDoi}` : null;

      // Strip redundant "RETRACTED: " prefix since badge shows status
      let title = ref.title || i18n.t("results.titleUnavailable");
      title = title.replace(/^(RETRACTED|WITHDRAWN|REMOVED):\s*/i, "");

      // Compact meta: DOI · year · notice link
      const metaParts = [];
      if (doiUrl) metaParts.push(`<a href="${escapeHtml(doiUrl)}" target="_blank" rel="noopener">${escapeHtml(shortDoi)}</a>`);
      if (ref.publication_year) metaParts.push(`<span>${ref.publication_year}</span>`);
      if (ref.notice_doi) {
        const u = `https://doi.org/${escapeHtml(ref.notice_doi)}`;
        metaParts.push(`<a href="${u}" target="_blank" rel="noopener">retraction notice</a>`);
      }

      // Reasons — collapsed by default if more than 2
      let reasonsHtml = "";
      if (ref.reasons && ref.reasons.length > 0) {
        const tags = ref.reasons.map((r) => `<span class="reason-tag">${escapeHtml(r)}</span>`).join("");
        reasonsHtml = `<details class="ref-reasons-details"><summary class="ref-reasons-toggle">Reasons (${ref.reasons.length})</summary><div class="ref-reasons">${tags}</div></details>`;
      }

      return `
      <div class="ref-card ${cfg.cardClass}">
        <span class="badge ${cfg.cssClass}">${cfg.label}</span>
        <h3>${escapeHtml(title)}</h3>
        <div class="ref-meta">${metaParts.join('<span class="meta-dot"> · </span>')}</div>
        ${reasonsHtml}
      </div>`;
    }).join("");
  } else {
    flaggedList.innerHTML = "";
  }

  // Disclaimer with coverage metric
  var disclaimer = document.getElementById("result-disclaimer");
  if (disclaimer && checked > 0) {
    disclaimer.hidden = false;
    disclaimer.innerHTML = i18n.t("results.disclaimer", { total: checked }) +
      ' <a href="https://openalex.org" target="_blank" rel="noopener">OpenAlex</a> &amp; <a href="https://www.crossref.org" target="_blank" rel="noopener">Crossref</a>.';
  } else if (disclaimer) {
    disclaimer.hidden = true;
  }
}

// --- Bulk check ---

async function checkBulk(dois) {
  if (currentController) currentController.abort();
  currentController = new AbortController();
  checkBtn.disabled = true;
  bulkCheckBtn.disabled = true;
  bulkResultsData = [];
  showSection(loadingSection);

  for (let i = 0; i < dois.length; i++) {
    setLoadingStep(i18n.t("loading.checkingNofM", { current: i + 1, total: dois.length }));
    const id = dois[i];
    const isPmid = /^pmid:\d+$/i.test(id);
    const param = isPmid ? `pmid=${encodeURIComponent(id.replace(/^pmid:/i, ""))}` : `doi=${encodeURIComponent(id)}`;
    try {
      const res = await fetch(`/api/check-doi?${param}`, { signal: currentController.signal });
      let data;
      try { data = await res.json(); } catch {
        bulkResultsData.push({ doi: id, title: null, flagged_count: 0, referenced_works_count: 0, error: i18n.t("errors.unexpectedResponse") });
        continue;
      }
      if (res.ok) {
        bulkResultsData.push({ doi: data.doi || id, ...data, error: null });
      } else {
        bulkResultsData.push({ doi: dois[i], title: null, flagged_count: 0, referenced_works_count: 0, error: data.error });
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      bulkResultsData.push({ doi: dois[i], title: null, flagged_count: 0, referenced_works_count: 0, error: i18n.t("errors.networkError") });
    }
  }

  checkBtn.disabled = false;
  bulkCheckBtn.disabled = false;
  currentController = null;
  renderBulkResults();
}

function renderBulkResults() {
  showSection(bulkResults);
  const totalRefs = bulkResultsData.reduce((s, r) => s + (r.referenced_works_count || 0), 0);
  const totalFlagged = bulkResultsData.reduce((s, r) => s + (r.flagged_count || 0), 0);
  const errors = bulkResultsData.filter((r) => r.error).length;

  bulkSummary.innerHTML = [
    `<span class="stat">${bulkResultsData.length} ${i18n.t("results.papers")}</span>`,
    `<span class="stat">${totalRefs} ${i18n.t("results.references")}</span>`,
    `<span class="stat flagged">${totalFlagged} ${i18n.t("results.flagged")}</span>`,
    errors > 0 ? `<span class="stat">${errors} ${i18n.t("results.errorsLabel")}</span>` : "",
  ].filter(Boolean).join('<span class="stat-sep">&middot;</span>');

  let html = `<table class="bulk-table"><thead><tr><th>DOI</th><th>Title</th><th>Refs</th><th>Status</th></tr></thead><tbody>`;
  bulkResultsData.forEach((r) => {
    const cls = r.error ? "status-err" : r.flagged_count > 0 ? "status-warn" : "status-ok";
    const txt = r.error || (r.flagged_count > 0 ? `${r.flagged_count} ${i18n.t("results.flagged")}` : i18n.t("results.clean"));
    html += `<tr><td class="doi-cell">${escapeHtml(r.doi)}</td><td>${escapeHtml(r.title || "\u2014")}</td><td>${r.error ? "\u2014" : r.referenced_works_count}</td><td class="${cls}">${escapeHtml(txt)}</td></tr>`;
  });
  html += `</tbody></table>`;
  bulkTableWrapper.innerHTML = html;
}

// --- Export ---

function formatResultsText(data) {
  let text = `RefIntegrity ${i18n.t("results.resultsHeading")}\nPaper: ${data.title || data.doi}\nDOI: ${data.doi}\n${i18n.t("results.references")}: ${data.referenced_works_count}, ${i18n.t("results.flagged")}: ${data.flagged_count}\n\n`;
  if (data.flagged_references && data.flagged_references.length > 0) {
    text += `${i18n.t("results.flagged")}:\n`;
    data.flagged_references.forEach((ref, i) => {
      const cfg = getStatusConfig(ref.status);
      text += `${i + 1}. [${cfg.label}] ${ref.title || i18n.t("results.titleUnavailable")}\n`;
      if (ref.doi) text += `   DOI: ${ref.doi}\n`;
      if (ref.update_date) text += `   Date: ${ref.update_date}\n`;
      if (ref.reasons && ref.reasons.length) text += `   Reasons: ${ref.reasons.join("; ")}\n`;
    });
  } else {
    text += `${i18n.t("results.clean")}.\n`;
  }
  return text;
}

function generateCsv(data) {
  const rows = [["Title", "DOI", "Year", "Status", "Date", "Type", "Notice DOI", "Reasons"]];
  (data.flagged_references || []).forEach((ref) => {
    const cfg = getStatusConfig(ref.status);
    rows.push([ref.title || "", ref.doi || "", ref.publication_year || "", cfg.label, ref.update_date || "", ref.update_label || "", ref.notice_doi || "", (ref.reasons || []).join("; ")]);
  });
  return rows.map((r) => r.map((c) => csvSafe(c)).join(",")).join("\n");
}

function generateBulkCsv() {
  const rows = [["DOI", "Title", "References", "Flagged", "Error"]];
  bulkResultsData.forEach((r) => {
    rows.push([r.doi, r.title || "", r.referenced_works_count || 0, r.flagged_count || 0, r.error || ""]);
  });
  return rows.map((r) => r.map((c) => csvSafe(c)).join(",")).join("\n");
}

function csvSafe(value) {
  let s = String(value).replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s}"`;
}

function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// --- Main handler ---

function handlePrimaryCheck() {
  const raw = doiInput.value.trim();
  if (!raw) { showError(i18n.t("errors.enterDoi")); return; }
  // Try PMID first (PMID:12345678, pubmed URL, or bare digits after cleaning)
  const pmid = parsePmid(raw);
  if (pmid) { checkSingle(null, pmid); return; }
  const doi = cleanDoi(raw);
  if (isValidDoi(doi)) { checkSingle(doi); return; }
  // Not a DOI/PMID/arXiv — treat as title search
  // Extract query from Google Scholar URL if applicable
  var query = raw;
  var scholarMatch = raw.match(/scholar\.google\.[^/]+\/scholar\?.*q=([^&]+)/i);
  if (scholarMatch) query = decodeURIComponent(scholarMatch[1].replace(/\+/g, " "));
  if (query.length < 3) { showError(i18n.t("errors.invalidDoi")); return; }
  searchByTitle(query);
}

async function searchByTitle(query) {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  showSection(loadingSection);
  setLoadingStep(i18n.t("loading.searching"));
  checkBtn.disabled = true;

  try {
    const res = await fetch(`/api/search-papers?q=${encodeURIComponent(query)}`, { signal: currentController.signal });
    let data;
    try { data = await res.json(); } catch {
      showError(i18n.t("errors.unexpectedResponse")); return;
    }
    if (!res.ok) { showError(data.error || i18n.t("errors.genericError")); return; }
    if (!data.results || data.results.length === 0) {
      showError(i18n.t("errors.noSearchResults")); return;
    }
    // If only 1 result with DOI, go directly to check
    if (data.results.length === 1 && data.results[0].doi) {
      checkSingle(data.results[0].doi);
      return;
    }
    renderSearchResults(data.results);
  } catch (err) {
    if (err.name === "AbortError") return;
    showError(i18n.t("errors.networkError"));
  } finally {
    checkBtn.disabled = false;
    currentController = null;
  }
}

function renderSearchResults(results) {
  showSection(searchResultsSection);
  searchList.innerHTML = results.map((r) => {
    var retractedBadge = r.is_retracted ? ` <span class="badge badge-retracted">${i18n.t("statuses.retracted")}</span>` : "";
    return `
    <button class="search-item" data-doi="${escapeHtml(r.doi || "")}" type="button">
      <span class="search-title">${escapeHtml(r.title || i18n.t("results.titleUnavailable"))}${retractedBadge}</span>
      <span class="search-meta">${escapeHtml(r.authors || "")}${r.year ? " (" + r.year + ")" : ""} &middot; ${r.refs} ${i18n.t("results.references")}${r.cited_by ? " &middot; " + i18n.t("search.citedBy", { count: r.cited_by }) : ""}</span>
    </button>`;
  }).join("");
}


function handleBulkCheck() {
  const text = bulkInput.value.trim();
  if (!text) { showError(i18n.t("errors.pasteDois")); return; }
  const dois = extractDois(text);
  if (dois.length === 0) { showError(i18n.t("errors.noValidDois")); return; }
  if (dois.length === 1) { doiInput.value = dois[0]; checkSingle(dois[0]); return; }
  checkBulk(dois);
}

// --- Events ---

checkBtn.addEventListener("click", handlePrimaryCheck);
doiInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handlePrimaryCheck(); });

function setBulkMode(on) {
  // Transfer content between inputs
  if (on && !isBulkMode) {
    if (doiInput.value.trim() && !bulkInput.value.trim()) bulkInput.value = doiInput.value;
  } else if (!on && isBulkMode) {
    var lines = bulkInput.value.trim().split("\n").filter(Boolean);
    if (lines.length <= 1 && !doiInput.value.trim()) doiInput.value = lines[0] || "";
  }
  isBulkMode = on;
  inputSingle.hidden = on;
  inputBulk.hidden = !on;
  modeToggle.textContent = i18n.t(on ? "search.switchSingle" : "search.switchBulk");
  if (on) bulkInput.focus();
  else doiInput.focus();
}

modeToggle.addEventListener("click", () => setBulkMode(!isBulkMode));
bulkCheckBtn.addEventListener("click", handleBulkCheck);

// Try link
document.querySelectorAll("[data-doi]").forEach((btn) => {
  btn.addEventListener("click", () => {
    doiInput.value = btn.dataset.doi;
    handlePrimaryCheck();
  });
});

// Search result click
searchList.addEventListener("click", (e) => {
  var item = e.target.closest(".search-item");
  if (!item) return;
  var doi = item.dataset.doi;
  if (doi) { doiInput.value = doi; checkSingle(doi); }
});

// File upload — auto-switch to bulk mode
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) { showError(i18n.t("errors.fileTooLarge")); return; }
  fileNameEl.textContent = file.name;
  fileNameEl.hidden = false;
  setBulkMode(true);
  const reader = new FileReader();
  reader.onload = (ev) => { bulkInput.value = ev.target.result; };
  reader.readAsText(file);
});

// Copy / CSV
copyBtn.addEventListener("click", () => {
  if (!lastResult) return;
  navigator.clipboard.writeText(formatResultsText(lastResult)).then(() => showToast(i18n.t("results.copiedToClipboard")));
});

csvBtn.addEventListener("click", () => {
  if (!lastResult) return;
  var csvId = lastResult.doi ? lastResult.doi.replace(/\//g, "-") : (lastResult.pmid ? "pmid-" + lastResult.pmid : "result");
  downloadCsv(generateCsv(lastResult), `refintegrity-${csvId}.csv`);
});

bulkCsvBtn.addEventListener("click", () => {
  if (bulkResultsData.length === 0) return;
  downloadCsv(generateBulkCsv(), "refintegrity-bulk.csv");
});

// History
historyList.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-item")) {
    doiInput.value = e.target.dataset.doi;
    handlePrimaryCheck();
  }
  if (e.target.classList.contains("history-toggle")) {
    historySection.classList.toggle("expanded");
    renderHistory();
  }
});

renderHistory();

// --- Info toggle sections (How it works + FAQ) ---
document.querySelectorAll(".info-toggle-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.closest(".info-toggle-section").classList.toggle("expanded");
  });
});

// --- Header panel toggles ---
document.querySelectorAll(".nav-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.panel;
    const panel = document.getElementById(id);
    if (!panel) return;
    const isOpen = panel.classList.contains("open");
    // close all panels
    document.querySelectorAll(".header-panel").forEach((p) => {
      p.classList.remove("open");
      p.hidden = true;
    });
    document.querySelectorAll(".nav-toggle").forEach((b) => b.classList.remove("active"));
    if (!isOpen) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("open"));
      btn.classList.add("active");
    }
  });
});
