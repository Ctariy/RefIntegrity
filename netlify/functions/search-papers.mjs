const OPENALEX_BASE = "https://api.openalex.org";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (!q || q.length < 3) {
    return jsonResponse({ error: "Query too short (min 3 characters)" }, 400);
  }

  const apiKey = process.env.OPENALEX_API_KEY;
  const keyParam = apiKey ? `&api_key=${apiKey}` : "";

  try {
    const searchUrl = `${OPENALEX_BASE}/works?search=${encodeURIComponent(q)}&select=id,doi,title,authorships,publication_year,referenced_works_count,cited_by_count,is_retracted&per_page=5${keyParam}`;
    const res = await fetch(searchUrl);
    if (!res.ok) {
      return jsonResponse({ error: "OpenAlex search failed" }, 502);
    }
    const data = await res.json();
    const results = (data.results || []).map((w) => ({
      doi: w.doi ? w.doi.replace("https://doi.org/", "") : null,
      title: w.title,
      authors: (w.authorships || []).slice(0, 3).map((a) => a.author?.display_name).filter(Boolean).join(", "),
      year: w.publication_year,
      refs: w.referenced_works_count || 0,
      cited_by: w.cited_by_count || 0,
      is_retracted: w.is_retracted || false,
    }));
    return jsonResponse({ results });
  } catch {
    return jsonResponse({ error: "Network error" }, 502);
  }
};

export const config = { path: "/api/search-papers" };
