#!/usr/bin/env node
// Downloads Retraction Watch CSV from Crossref Labs and creates a compact
// DOI → reasons JSON lookup for the check-doi serverless function.
//
// Output: netlify/functions/rw-reasons.json
// Format: { "10.1234/example": "Reason1;Reason2" }

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "netlify", "functions", "rw-reasons.json");
const CSV_URL = "https://api.labs.crossref.org/data/retractionwatch?mailto=refintegrity@refintegrity.com";

async function main() {
  console.log("Downloading Retraction Watch data from Crossref Labs...");

  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const text = await res.text();
  const lines = text.split("\n");

  // Parse CSV header to find column indices
  const header = parseCSVLine(lines[0]);
  const doiCol = header.findIndex((h) => h.trim().toLowerCase() === "originalpaperdoi");
  const reasonCol = header.findIndex((h) => h.trim().toLowerCase() === "reason");

  if (doiCol === -1 || reasonCol === -1) {
    console.error("Header:", header);
    throw new Error(`Required columns not found. DOI col: ${doiCol}, Reason col: ${reasonCol}`);
  }

  console.log(`Parsing ${lines.length - 1} rows (DOI col=${doiCol}, Reason col=${reasonCol})...`);

  const map = {};
  let matched = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCSVLine(lines[i]);
    const doi = (cols[doiCol] || "").trim().toLowerCase();
    const reason = (cols[reasonCol] || "").trim();

    if (doi && reason) {
      // Normalize DOI: remove URL prefix if present
      const cleanDoi = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
      if (cleanDoi) {
        map[cleanDoi] = reason;
        matched++;
      }
    }
  }

  writeFileSync(OUTPUT, JSON.stringify(map));

  // Save timestamp for the scheduled update checker
  const gitlabRes = await fetch("https://gitlab.com/api/v4/projects/crossref%2Fretraction-watch-data/repository/commits?per_page=1");
  if (gitlabRes.ok) {
    const [commit] = await gitlabRes.json();
    const tsPath = join(__dirname, "..", "netlify", "functions", "rw-timestamp.txt");
    writeFileSync(tsPath, commit.committed_date);
    console.log(`RW data commit: ${commit.committed_date}`);
  }

  const sizeMB = (Buffer.byteLength(JSON.stringify(map)) / 1024 / 1024).toFixed(1);
  console.log(`Done: ${matched} entries with reasons, ${sizeMB} MB → ${OUTPUT}`);
}

// Simple CSV parser that handles quoted fields with commas and newlines
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

main().catch((err) => {
  console.error("Failed to build RW data:", err.message);
  // Non-fatal: function works without reasons
  writeFileSync(OUTPUT, "{}");
  console.log("Created empty fallback at", OUTPUT);
});
