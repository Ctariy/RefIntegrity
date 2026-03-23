import { test, expect } from "@playwright/test";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const DOI_WITH_RETRACTION = "10.1038/s41577-020-0311-8";
const DOI_CLEAN = "10.1038/s41586-020-2649-2";
const DOI_SELF_RETRACTED = "10.1016/j.ijantimicag.2020.105949";

// ─── 1. Page load & SEO ─────────────────────────────────────

test.describe("Page load & SEO", () => {
  test("page loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/RefIntegrity/i);
  });

  test("logo visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".logo")).toBeVisible();
    await expect(page.locator(".logo")).toContainText("RefIntegrity");
  });

  test("footer links visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator('footer a[href*="github.com"]').first()).toBeVisible();
    await expect(page.locator('footer a[href*="openalex.org"]')).toBeVisible();
  });

  test("JSON-LD present", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    const content = await jsonLd.textContent();
    const data = JSON.parse(content);
    expect(data.name).toBe("RefIntegrity");
  });

  test("meta description present", async ({ page }) => {
    await page.goto("/");
    const content = await page.locator('meta[name="description"]').getAttribute("content");
    expect(content).toContain("retract");
  });
});

// ─── 2. Input area ───────────────────────────────────────────

test.describe("Input area", () => {
  test("input field with placeholder", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#doi-input");
    await expect(input).toBeVisible();
    const ph = await input.getAttribute("placeholder");
    expect(ph).toContain("DOI");
  });

  test("check button visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#check-btn")).toBeVisible();
  });

  test("try link visible and works", async ({ page }) => {
    await page.goto("/");
    const tryBtn = page.locator("[data-doi]").first();
    await expect(tryBtn).toBeVisible();
    await tryBtn.click();
    await expect(page.locator("#results")).toBeVisible();
  });

  test("bulk expand link visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#show-bulk")).toBeVisible();
    await page.locator("#show-bulk").click();
    await expect(page.locator("#bulk-section")).toBeVisible();
  });

  test("file upload label visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".file-label")).toBeVisible();
  });
});

// ─── 3. Single DOI — retracted reference ────────────────────

test.describe("Single DOI with retracted reference", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("loading indicator appears", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator("#loading")).toBeVisible();
  });

  test("result hero shows flagged count", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator(".result-hero-warn")).toBeVisible();
    await expect(page.locator(".result-hero-warn")).toContainText("1 of");
    await expect(page.locator(".result-hero-warn")).toContainText("flagged");
  });

  test("paper title shown", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator("#paper-title h2")).toContainText("trinity");
  });

  test("flagged card with retracted badge", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    const card = page.locator(".ref-card").first();
    await expect(card).toBeVisible();
    await expect(card.locator(".badge")).toContainText(/retracted/i);
  });

  test("flagged card has hydroxychloroquine", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator(".ref-card h3").first()).toContainText(/hydroxychloroquine/i);
  });

  test("flagged card has DOI link", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    const href = await page.locator(".ref-card .ref-meta a").first().getAttribute("href");
    expect(href).toContain("doi.org");
  });

  test("Crossref details present", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator(".ref-detail")).toBeVisible();
  });

  test("export buttons visible", async ({ page }) => {
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator("#copy-btn")).toBeVisible();
    await expect(page.locator("#csv-btn")).toBeVisible();
  });
});

// ─── 4. Clean paper ─────────────────────────────────────────

test.describe("Clean paper", () => {
  test("all-clear hero message", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill(DOI_CLEAN);
    await page.locator("#check-btn").click();
    await expect(page.locator(".result-hero-ok")).toBeVisible();
    await expect(page.locator(".result-hero-ok")).toContainText("All clear");
  });
});

// ─── 5. Self-retracted paper ────────────────────────────────

test.describe("Self-retracted paper", () => {
  test("warning banner visible", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill(DOI_SELF_RETRACTED);
    await page.locator("#check-btn").click();
    await expect(page.locator("#self-retracted-warning")).toBeVisible();
  });
});

// ─── 6. Error handling ──────────────────────────────────────

test.describe("Error handling", () => {
  test("empty input", async ({ page }) => {
    await page.goto("/");
    await page.locator("#check-btn").click();
    await expect(page.locator("#error")).toBeVisible();
  });

  test("invalid DOI", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill("not-a-doi");
    await page.locator("#check-btn").click();
    await expect(page.locator("#error")).toBeVisible();
  });

  test("non-existent DOI", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill("10.9999/nonexistent-xyz");
    await page.locator("#check-btn").click();
    await expect(page.locator("#error")).toBeVisible();
  });
});

// ─── 7. DOI format flexibility ──────────────────────────────

test.describe("DOI format flexibility", () => {
  test("accepts doi.org URL", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill(`https://doi.org/${DOI_WITH_RETRACTION}`);
    await page.locator("#check-btn").click();
    await expect(page.locator("#paper-title h2")).toContainText("trinity");
  });

  test("accepts doi: prefix", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill(`doi:${DOI_WITH_RETRACTION}`);
    await page.locator("#check-btn").click();
    await expect(page.locator("#paper-title h2")).toContainText("trinity");
  });
});

// ─── 8. Bulk check ──────────────────────────────────────────

test.describe("Bulk DOI check", () => {
  test("two DOIs produce bulk table", async ({ page }) => {
    await page.goto("/");
    await page.locator("#show-bulk").click();
    await page.locator("#bulk-input").fill(`${DOI_WITH_RETRACTION}\n${DOI_CLEAN}`);
    await page.locator("#bulk-check-btn").click();
    await expect(page.locator("#bulk-results")).toBeVisible();
    await expect(page.locator("#bulk-summary")).toContainText("2 papers");
    await expect(page.locator(".bulk-table tbody tr")).toHaveCount(2);
  });
});

// ─── 9. BibTeX parsing ──────────────────────────────────────

test.describe("BibTeX parsing", () => {
  test("extracts DOI from BibTeX", async ({ page }) => {
    await page.goto("/");
    await page.locator("#show-bulk").click();
    await page.locator("#bulk-input").fill(`@article{test, doi = {${DOI_WITH_RETRACTION}}}`);
    await page.locator("#bulk-check-btn").click();
    // Single DOI from bulk → redirects to single check
    await expect(page.locator("#results")).toBeVisible();
    await expect(page.locator("#paper-title h2")).toContainText("trinity");
  });

  test("multiple DOIs from BibTeX", async ({ page }) => {
    await page.goto("/");
    await page.locator("#show-bulk").click();
    await page.locator("#bulk-input").fill(`@article{a, doi={${DOI_WITH_RETRACTION}}}\n@article{b, doi={${DOI_CLEAN}}}`);
    await page.locator("#bulk-check-btn").click();
    await expect(page.locator("#bulk-results")).toBeVisible();
    await expect(page.locator("#bulk-summary")).toContainText("2 papers");
  });
});

// ─── 10. File upload ────────────────────────────────────────

test.describe("File upload", () => {
  test("uploading .bib populates bulk textarea", async ({ page }) => {
    await page.goto("/");
    const bibContent = `@article{test, doi = {${DOI_WITH_RETRACTION}}}`;
    const tmpPath = join(process.cwd(), "tests", "test-upload.bib");
    writeFileSync(tmpPath, bibContent);
    try {
      await page.locator("#file-input").setInputFiles(tmpPath);
      await expect(page.locator("#file-name")).toBeVisible();
      await expect(page.locator("#bulk-section")).toBeVisible();
      await expect(page.locator("#bulk-input")).toHaveValue(new RegExp(DOI_WITH_RETRACTION.replace(/\//g, "\\/")));
    } finally {
      unlinkSync(tmpPath);
    }
  });
});

// ─── 11. History ────────────────────────────────────────────

test.describe("History", () => {
  test("appears after check", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.locator("#doi-input").fill(DOI_CLEAN);
    await page.locator("#check-btn").click();
    await expect(page.locator("#results")).toBeVisible();
    await expect(page.locator("#history-section")).toBeVisible();
  });

  test("click re-triggers check", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.locator("#doi-input").fill(DOI_CLEAN);
    await page.locator("#check-btn").click();
    await expect(page.locator("#results")).toBeVisible();
    await page.locator("#doi-input").fill("");
    await page.locator(".history-item").first().click();
    await expect(page.locator("#results")).toBeVisible();
  });
});

// ─── 12. CSV export ─────────────────────────────────────────

test.describe("CSV export", () => {
  test("download triggers", async ({ page }) => {
    await page.goto("/");
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator("#csv-btn")).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#csv-btn").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("refintegrity");
    expect(download.suggestedFilename()).toContain(".csv");
  });
});

// ─── 13. Copy results ───────────────────────────────────────

test.describe("Copy results", () => {
  test("toast appears", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("#doi-input").fill(DOI_WITH_RETRACTION);
    await page.locator("#check-btn").click();
    await expect(page.locator("#copy-btn")).toBeVisible();
    await page.locator("#copy-btn").click();
    await expect(page.locator(".toast")).toContainText("Copied");
  });
});

// ─── 14. AI Agent Optimization ─────────────────────────────

const BASE_URL = "https://refintegrity.netlify.app";

test.describe("AI Agent Optimization", () => {
  test("robots.txt accessible and allows AI bots", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/robots.txt`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("GPTBot");
    expect(text).toContain("ClaudeBot");
  });

  test("sitemap.xml accessible", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("refintegrity.netlify.app");
  });

  test("llms.txt accessible and follows spec", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/llms.txt`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/^# RefIntegrity/);
  });

  test("openapi.json valid", async ({ request }) => {
    const res = await request.get(`${BASE_URL}/openapi.json`);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.openapi).toBe("3.0.0");
    expect(data.paths).toHaveProperty("/api/check-doi");
  });

  test("FAQPage JSON-LD present", async ({ page }) => {
    await page.goto("/");
    const faqLd = page.locator('script[type="application/ld+json"]').nth(1);
    const content = await faqLd.textContent();
    const data = JSON.parse(content);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity.length).toBeGreaterThanOrEqual(3);
  });

  test("answer block visible", async ({ page }) => {
    await page.goto("/");
    const block = page.locator(".answer-block");
    await expect(block).toBeVisible();
    await expect(block).toContainText("Retraction Watch");
  });

  test("last updated visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".last-updated")).toBeVisible();
  });

  test("MCP server responds to initialize", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/mcp`, {
      data: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test", version: "1.0" },
        },
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.result.protocolVersion).toBe("2024-11-05");
    expect(data.result.serverInfo.name).toBe("refintegrity");
  });

  test("MCP server lists check_doi tool", async ({ request }) => {
    const res = await request.post(`${BASE_URL}/mcp`, {
      data: { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.result.tools).toHaveLength(1);
    expect(data.result.tools[0].name).toBe("check_doi");
  });
});
