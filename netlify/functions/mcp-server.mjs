const SERVER_INFO = {
  name: "refintegrity",
  version: "1.0.0",
};

const PROTOCOL_VERSION = "2024-11-05";

const CHECK_DOI_TOOL = {
  name: "check_doi",
  description:
    "Check if a scientific paper's references include retracted, withdrawn, or flagged papers. Returns details about each problematic reference including retraction notice DOI and date.",
  inputSchema: {
    type: "object",
    properties: {
      doi: {
        type: "string",
        description:
          "DOI of the paper to check (e.g. 10.1038/s41577-020-0311-8)",
      },
    },
    required: ["doi"],
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonRpcResponse(id, result) {
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", id, result }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}

function jsonRpcError(id, code, message) {
  return new Response(
    JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}

async function handleToolCall(params, baseUrl) {
  if (params.name !== "check_doi") {
    return { content: [{ type: "text", text: "Unknown tool" }], isError: true };
  }

  const doi = params.arguments?.doi;
  if (!doi) {
    return { content: [{ type: "text", text: "Missing required argument: doi" }], isError: true };
  }

  const apiUrl = new URL("/api/check-doi", baseUrl);
  apiUrl.searchParams.set("doi", doi);

  const res = await fetch(apiUrl.href);
  const data = await res.json();

  if (!res.ok) {
    return { content: [{ type: "text", text: data.error || "API error" }], isError: true };
  }

  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error");
  }

  if (body.jsonrpc !== "2.0") {
    return jsonRpcError(body.id ?? null, -32600, "Invalid Request");
  }

  // Notifications have no id field — acknowledge without response body
  if (!("id" in body)) {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const { id, method, params } = body;

  switch (method) {
    case "initialize":
      return jsonRpcResponse(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "tools/list":
      return jsonRpcResponse(id, { tools: [CHECK_DOI_TOOL] });

    case "tools/call":
      try {
        const result = await handleToolCall(params, new URL(req.url).origin);
        return jsonRpcResponse(id, result);
      } catch {
        return jsonRpcResponse(id, {
          content: [{ type: "text", text: "Internal server error" }],
          isError: true,
        });
      }

    default:
      return jsonRpcError(id, -32601, "Method not found");
  }
};

export const config = { path: "/mcp" };
