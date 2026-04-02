import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const OPENALEX_BASE = "https://api.openalex.org";
const CROSSREF_BASE = "https://api.crossref.org";
const BATCH_SIZE = 50;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "refintegrity@example.com";
const FLAGGED_TYPES = ["retraction", "expression-of-concern", "withdrawal", "removal"];

// Retraction Watch reasons lookup (DOI → "Reason1;Reason2;...")
let rwReasons = {};
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  rwReasons = JSON.parse(readFileSync(resolve(__dirname, "rw-reasons.json"), "utf8"));
} catch { /* function works without reasons */ }

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function cleanDoi(input) {
  let doi = input.trim();
  doi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  doi = doi.replace(/^doi:\s*/i, "");
  doi = doi.replace(/[.,;)\]]+$/, "");
  return doi;
}

function isValidDoi(doi) {
  return doi.length <= 256 && /^10\.\d{4,9}\/[^\s]+$/i.test(doi);
}

async function fetchCrossrefDetails(doi) {
  try {
    const url = `${CROSSREF_BASE}/works/${encodeURIComponent(doi)}?mailto=${CONTACT_EMAIL}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const work = data.message;

    let status = "retracted";
    let update_date = null;
    let update_label = null;
    let notice_doi = null;

    if (work["updated-by"] && work["updated-by"].length > 0) {
      // Prioritize: retraction > expression-of-concern > withdrawal > removal > any
      const update =
        work["updated-by"].find((u) => u.type === "retraction") ||
        work["updated-by"].find((u) => FLAGGED_TYPES.includes(u.type)) ||
        work["updated-by"][0];

      if (update) {
        status = update.type || "retracted";
        notice_doi = update.DOI || null;
        update_label = update.label || null;
        if (update.updated && update.updated["date-parts"] && update.updated["date-parts"][0]) {
          update_date = update.updated["date-parts"][0].join("-");
        }
      }
    }

    return { status, update_date, update_label, notice_doi };
  } catch {
    return null;
  }
}

async function fetchCrossrefReferences(doi) {
  try {
    const url = `${CROSSREF_BASE}/works/${encodeURIComponent(doi)}?mailto=${CONTACT_EMAIL}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const refs = data.message.reference || [];
    return refs.filter((r) => r.DOI).map((r) => r.DOI);
  } catch {
    return [];
  }
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  let doi;
  let pmid;
  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }
    doi = body.doi;
    pmid = body.pmid;
  } else {
    const url = new URL(req.url);
    doi = url.searchParams.get("doi");
    pmid = url.searchParams.get("pmid");
  }

  if (!doi && !pmid) {
    return jsonResponse({ error: "Missing doi or pmid parameter" }, 400);
  }

  // PMID: validate and use directly (no DOI conversion needed)
  if (pmid && !doi) {
    pmid = pmid.trim().replace(/^PMID:\s*/i, "");
    if (!/^\d{1,9}$/.test(pmid)) {
      return jsonResponse({ error: "Invalid PMID format" }, 400);
    }
  } else {
    doi = cleanDoi(doi);
    if (!isValidDoi(doi)) {
      return jsonResponse({ error: "Invalid DOI format" }, 400);
    }
  }

  const apiKey = process.env.OPENALEX_API_KEY;
  const keyParam = apiKey ? `&api_key=${apiKey}` : "";

  try {
    // Step 1: Fetch the paper by DOI or PMID
    const lookupId = pmid ? `pmid:${pmid}` : `doi:${encodeURIComponent(doi)}`;
    const workUrl = `${OPENALEX_BASE}/works/${lookupId}?select=id,doi,title,is_retracted,referenced_works,referenced_works_count${keyParam}`;
    const workRes = await fetch(workUrl);

    if (workRes.status === 404) {
      return jsonResponse({
        error: "This DOI was not found in OpenAlex. It may be too recent or from a source not indexed.",
      }, 404);
    }
    if (workRes.status === 429) {
      return jsonResponse({
        error: "Too many requests. Please wait 30 seconds and try again.",
      }, 429);
    }
    if (!workRes.ok) {
      return jsonResponse({ error: "OpenAlex API error" }, 502);
    }

    const work = await workRes.json();
    // Resolve identifiers: prefer OpenAlex DOI, fall back to input
    const resolvedDoi = work.doi ? work.doi.replace("https://doi.org/", "") : doi;
    let refs = work.referenced_works || [];

    // If OpenAlex has no references, try Crossref as fallback (only if we have a DOI)
    if (refs.length === 0 && resolvedDoi) {
      const crossrefDois = await fetchCrossrefReferences(resolvedDoi);
      if (crossrefDois.length > 0) {
        const resolvedRefs = [];
        for (let i = 0; i < crossrefDois.length; i += BATCH_SIZE) {
          const batch = crossrefDois.slice(i, i + BATCH_SIZE);
          const doiFilter = batch.map((d) => encodeURIComponent(d)).join("|");
          const resolveUrl = `${OPENALEX_BASE}/works?filter=doi:${doiFilter}&select=id&per_page=200${keyParam}`;
          try {
            const resolveRes = await fetch(resolveUrl);
            if (resolveRes.ok) {
              const resolveData = await resolveRes.json();
              resolvedRefs.push(...(resolveData.results || []).map((r) => r.id));
            }
          } catch { /* skip */ }
        }
        refs = resolvedRefs;
      }
    }

    // Total reference count from metadata (may be higher than resolved refs)
    const metadataRefCount = work.referenced_works_count || 0;

    if (refs.length === 0) {
      return jsonResponse({
        doi: resolvedDoi,
        pmid: pmid || undefined,
        title: work.title,
        is_retracted: work.is_retracted || false,
        referenced_works_count: metadataRefCount,
        checked_count: 0,
        flagged_references: [],
        flagged_count: 0,
      });
    }

    // Step 2: Batch query for retracted references via OpenAlex
    const shortIds = refs.map((uri) => uri.replace("https://openalex.org/", ""));
    const retracted = [];

    for (let i = 0; i < shortIds.length; i += BATCH_SIZE) {
      const batch = shortIds.slice(i, i + BATCH_SIZE);
      const idsFilter = batch.join("|");
      const batchUrl = `${OPENALEX_BASE}/works?filter=openalex:${idsFilter},is_retracted:true&select=id,doi,display_name,is_retracted,publication_year&per_page=200${keyParam}`;
      try {
        const batchRes = await fetch(batchUrl);
        if (batchRes.ok) {
          const batchData = await batchRes.json();
          retracted.push(...(batchData.results || []));
        }
      } catch { /* skip failed batches */ }
    }

    // Step 3: Enrich with Crossref (get actual status type + details)
    const enriched = await Promise.all(
      retracted.map(async (r) => {
        const rawDoi = r.doi ? r.doi.replace("https://doi.org/", "") : null;
        let crossref = null;
        if (rawDoi) {
          crossref = await fetchCrossrefDetails(rawDoi);
        }
        // Look up retraction reasons from Retraction Watch data
        const reasonStr = rawDoi ? rwReasons[rawDoi.toLowerCase()] || null : null;
        const reasons = reasonStr
          ? reasonStr.split(";").map((r) => r.trim()).filter(Boolean)
          : null;

        return {
          openalex_id: r.id,
          doi: r.doi,
          title: r.display_name,
          publication_year: r.publication_year,
          status: crossref?.status || "retracted",
          update_date: crossref?.update_date || null,
          update_label: crossref?.update_label || null,
          notice_doi: crossref?.notice_doi || null,
          reasons,
        };
      })
    );

    return jsonResponse({
      doi: resolvedDoi,
      pmid: pmid || undefined,
      title: work.title,
      is_retracted: work.is_retracted || false,
      referenced_works_count: metadataRefCount > refs.length ? metadataRefCount : refs.length,
      checked_count: refs.length,
      flagged_references: enriched,
      flagged_count: enriched.length,
    });
  } catch (error) {
    return jsonResponse({ error: "Network error contacting OpenAlex" }, 502);
  }
};

export const config = { path: "/api/check-doi" };
