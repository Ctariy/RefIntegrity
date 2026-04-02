# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

RefIntegrity — free web tool that checks if a scientific paper's references have been retracted. Vanilla JS frontend + Netlify serverless function. Zero runtime dependencies.

Live at: https://refintegrity.com

## Git Workflow

All work happens on `dev` branch. Never push directly to `main`.

```
dev → PR → Deploy Preview (check on preview URL) → merge to main → prod
```

- `main` = production (https://refintegrity.com)
- `dev` = development (deploy previews on PRs)
- Always commit to `dev`, create PR to `main`

## Commands

```bash
npm run dev          # Local dev server (port 8888, requires .env with OPENALEX_API_KEY)
npm run build        # Download RW data + pre-render i18n pages (runs on Netlify build)
npm test             # Playwright E2E tests against production site
npx playwright test --headed   # Watch tests in browser
```

## Architecture

```
public/              Static frontend (no build step, served directly)
  index.html         Page structure, SEO meta, JSON-LD schema
  app.js             All frontend logic: DOI extraction, API calls, rendering, export
  style.css          Styling (PubMed/Scholar aesthetic, CSS variables)
  i18n.js            Translation system (11 languages, lazy-loaded)
  i18n/              Language files (i18n-es.js, i18n-fr.js, etc.)

netlify/functions/
  check-doi.mjs      Main API: /api/check-doi (OpenAlex + Crossref + RW reasons)
  search-papers.mjs  Title search: /api/search-papers
  mcp-server.mjs     MCP JSON-RPC server: /mcp
  update-rw-data.mjs Scheduled daily: checks GitLab for new RW data, triggers rebuild

scripts/
  build-rw-data.mjs      Downloads RW CSV → creates rw-reasons.json (runs at build)
  build-i18n-pages.mjs   Pre-renders /xx/index.html per language (SEO canonicals)

tests/
  refintegrity.spec.js   Playwright E2E tests against live site
```

## How the check works

1. User submits DOI(s) — frontend `extractDois()` parses raw DOI, doi.org URLs, BibTeX `doi={}` fields, RIS `DO -` lines
2. Frontend calls `GET /api/check-doi?doi=...`
3. Function fetches paper from OpenAlex API (`/works/doi:{doi}`)
4. Extracts `referenced_works[]` (falls back to Crossref if OpenAlex has none)
5. Batch-queries OpenAlex for retracted refs: `filter=openalex:{ids},is_retracted:true` (batches of 50)
6. Enriches each flagged ref via Crossref `updated-by` field → gets status type (retraction/expression-of-concern/withdrawal/removal), date, notice DOI
7. Looks up retraction reasons from Retraction Watch data (pre-built JSON from Crossref Labs CSV)
8. Returns JSON with `flagged_references[]` array

Multiple DOIs → frontend loops and renders bulk results table.

## API response shape

```json
{
  "doi": "...",
  "title": "...",
  "is_retracted": false,
  "referenced_works_count": 138,
  "flagged_count": 1,
  "flagged_references": [{
    "openalex_id": "...",
    "doi": "...",
    "title": "...",
    "publication_year": 2020,
    "status": "retraction",
    "update_date": "2024-12-16",
    "update_label": "Retraction",
    "notice_doi": "10.1016/...",
    "reasons": ["Concerns/Issues about Data", "Investigation by Journal/Publisher"]
  }]
}
```

## Key DOIs for testing

- `10.1038/s41577-020-0311-8` — has 1 retracted reference (hydroxychloroquine paper)
- `10.1038/s41586-020-2649-2` — clean (0 retracted)
- `10.1016/j.ijantimicag.2020.105949` — paper itself is retracted (`is_retracted: true`)

## Environment variables

- `OPENALEX_API_KEY` — required (free at openalex.org/settings/api, 100K credits/day)
- `CONTACT_EMAIL` — optional, used for Crossref polite pool
- `NETLIFY_BUILD_HOOK` — URL for auto-rebuild when RW data updates (set in Netlify dashboard)

Set in Netlify dashboard or `.env` for local dev.

## Research

Competitive analysis, user needs, and naming research are in `RESEARCH/`:
- `01_competitive_analysis.md` — 10 competitors, feature matrix, unique position
- `02_user_pain_and_needs.md` — pain points, personas, strategic priorities
- `03_naming_research.md` — naming conflicts, domain availability, decision
- `07_product_market_fit.md` — PMF analysis with hard numbers
- `11_deep_competitive_comparison.md` — 23+ tools, full comparison matrix
- `12_retraction_problem_evidence.md` — academic evidence for the problem

## Naming

Renamed from RetractCheck to RefIntegrity (retractcheck.org and retractioncheck.com already exist). GitHub repo folder is still `RetractCheck` locally. Netlify site: `refintegrity`.
