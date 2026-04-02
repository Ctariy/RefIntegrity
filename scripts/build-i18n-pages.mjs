#!/usr/bin/env node
// Pre-renders language-specific index.html files so that SEO-critical tags
// (canonical, og:url, lang, meta description, title) are in raw HTML.
// JS i18n still handles the rest of the page content at runtime.

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const BASE_URL = "https://refintegrity.com";

// Languages to pre-render (everything except "en" which is the source)
const LANGS = ["es", "fr", "de", "ru", "zh", "ja", "pt", "ko", "ar", "it"];

function main() {
  const template = readFileSync(join(PUBLIC, "index.html"), "utf8");

  for (const lang of LANGS) {
    // Load translation file to extract meta data
    const i18nPath = join(PUBLIC, "i18n", `i18n-${lang}.js`);
    let i18nContent;
    try {
      i18nContent = readFileSync(i18nPath, "utf8");
    } catch {
      console.warn(`Skipping ${lang}: no i18n file found`);
      continue;
    }

    // Extract meta fields from i18n JS file
    const meta = extractMeta(i18nContent);
    const dir = extractField(i18nContent, "dir") || "ltr";
    const langUrl = `${BASE_URL}/${lang}/`;

    let html = template;

    // 1. <html lang="en"> → <html lang="xx">
    html = html.replace(/<html lang="en"/, `<html lang="${lang}"`);

    // 2. Add dir attribute for RTL languages
    if (dir === "rtl") {
      html = html.replace(/<html lang="[^"]*"/, `$& dir="rtl"`);
    }

    // 3. <link rel="canonical" href="...">
    html = html.replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="${langUrl}">`
    );

    // 4. <meta property="og:url" content="...">
    html = html.replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="${langUrl}">`
    );

    // 5. <title>
    if (meta.title) {
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    }

    // 6. <meta name="description">
    if (meta.description) {
      html = html.replace(
        /<meta name="description" content="[^"]*">/,
        `<meta name="description" content="${escapeAttr(meta.description)}">`
      );
    }

    // 7. <meta property="og:title">
    if (meta.ogTitle) {
      html = html.replace(
        /<meta property="og:title" content="[^"]*">/,
        `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}">`
      );
    }

    // 8. <meta property="og:description">
    if (meta.ogDescription) {
      html = html.replace(
        /<meta property="og:description" content="[^"]*">/,
        `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}">`
      );
    }

    // 9. Twitter meta
    if (meta.ogTitle) {
      html = html.replace(
        /<meta name="twitter:title" content="[^"]*">/,
        `<meta name="twitter:title" content="${escapeAttr(meta.ogTitle)}">`
      );
    }
    if (meta.twitterDescription) {
      html = html.replace(
        /<meta name="twitter:description" content="[^"]*">/,
        `<meta name="twitter:description" content="${escapeAttr(meta.twitterDescription)}">`
      );
    }

    // Write to public/<lang>/index.html
    const outDir = join(PUBLIC, lang);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html);
    console.log(`  ${lang}/ → canonical=${langUrl}, title="${(meta.title || "").substring(0, 40)}..."`);
  }

  console.log(`Pre-rendered ${LANGS.length} language pages.`);
}

// Extract meta object fields from i18n JS source
function extractMeta(src) {
  const fields = {};
  for (const key of ["title", "description", "ogTitle", "ogDescription", "twitterDescription"]) {
    const m = src.match(new RegExp(`${key}:\\s*"([^"]*)"`, "s"));
    if (m) fields[key] = unescapeUnicode(m[1]);
  }
  return fields;
}

function extractField(src, field) {
  const m = src.match(new RegExp(`${field}:\\s*"([^"]*)"`));
  return m ? m[1] : null;
}

function unescapeUnicode(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

main();
