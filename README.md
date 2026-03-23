# RefIntegrity

[![Netlify Status](https://api.netlify.com/api/v1/badges/refintegrity/deploy-status)](https://app.netlify.com/sites/refintegrity/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Free, open-source tool that checks if a scientific paper's references have been retracted.**

Paste a DOI and RefIntegrity will cross-check the entire reference list against the [Retraction Watch](https://retractionwatch.com/) database in seconds. No login, no paywall.

**Live at: [refintegrity.netlify.app](https://refintegrity.netlify.app)**

---

## Features

- **Single or bulk DOI check** -- paste one DOI or many at once
- **BibTeX / RIS file upload** -- drag-and-drop your bibliography file
- **Detects retractions, expressions of concern, withdrawals, and removals**
- **Retraction notice links** -- direct links to the official retraction notice
- **CSV export** -- download results for your records
- **Multi-language support** -- EN, ES, FR, DE, RU, ZH, JA, PT, KO, AR, IT
- **MCP server** -- integrates with Claude Desktop, Claude Code, and Cursor
- **REST API** -- open, no authentication required

## How It Works

1. You submit a DOI (or multiple DOIs / a .bib file)
2. RefIntegrity fetches the paper's reference list from [OpenAlex](https://openalex.org)
3. All references are batch-checked for retraction status (falls back to [Crossref](https://www.crossref.org) if OpenAlex has no references)
4. Flagged references are enriched with retraction details (type, date, notice DOI) from Crossref
5. Results are displayed instantly with links to retraction notices

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS -- no build step, no framework
- **Backend:** Single Netlify serverless function (ES module)
- **Data sources:** OpenAlex API + Crossref API
- **Testing:** Playwright E2E tests
- **Hosting:** Netlify (static site + functions)
- **Zero runtime dependencies**

## Local Development

### Prerequisites

- Node.js 18+
- An OpenAlex API key (free at [openalex.org/settings/api](https://openalex.org/settings/api))

### Setup

```bash
git clone https://github.com/Ctariy/RefIntegrity.git
cd RefIntegrity
npm install
```

Create a `.env` file in the project root:

```
OPENALEX_API_KEY=your_key_here
CONTACT_EMAIL=your@email.com   # optional, for Crossref polite pool
```

Start the local dev server:

```bash
npm run dev
# Opens at http://localhost:8888
```

### Testing

```bash
npm test                          # Run E2E tests
npx playwright test --headed      # Watch tests in browser
```

## API

### `GET /api/check-doi?doi={doi}`

Open endpoint, no authentication. CORS enabled.

**Parameters:**

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `doi`     | string | A DOI (raw, URL form, or `doi:` prefixed) |

Also accepts `POST` with JSON body: `{ "doi": "10.1234/..." }`.

**Response:**

```json
{
  "doi": "10.1038/s41577-020-0311-8",
  "title": "The COVID-19 pandemic...",
  "is_retracted": false,
  "referenced_works_count": 138,
  "flagged_count": 1,
  "flagged_references": [
    {
      "openalex_id": "https://openalex.org/W...",
      "doi": "https://doi.org/10.1016/...",
      "title": "...",
      "publication_year": 2020,
      "status": "retraction",
      "update_date": "2024-12-16",
      "update_label": "Retraction",
      "notice_doi": "10.1016/..."
    }
  ]
}
```

**Error codes:** `400` (missing/invalid DOI), `404` (DOI not in OpenAlex), `429` (rate limited), `502` (upstream API error).

### MCP Server

```
https://refintegrity.netlify.app/mcp
```

Works with Claude Desktop, Claude Code, and Cursor. See the [live site](https://refintegrity.netlify.app) for setup instructions.

## Project Structure

```
public/                Static frontend (served directly)
  index.html           Page structure, SEO meta, JSON-LD schema
  app.js               Frontend logic: DOI extraction, API calls, rendering, export
  style.css            Styling
  i18n.js              Internationalization

netlify/functions/
  check-doi.mjs        Serverless API endpoint

tests/
  refintegrity.spec.js Playwright E2E tests
```

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Make your changes and add tests if applicable
4. Submit a pull request

## License

[MIT](LICENSE)

## Credits

- [OpenAlex](https://openalex.org) -- open scholarly metadata (250M+ works)
- [Crossref](https://www.crossref.org) -- retraction notice details and DOI resolution
- [Retraction Watch](https://retractionwatch.com/) -- the retraction database powering OpenAlex retraction data
