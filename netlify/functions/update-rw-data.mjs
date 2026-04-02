// Scheduled function: checks daily if Retraction Watch data has been updated.
// If newer commit found on GitLab, triggers a Netlify rebuild via Build Hook.

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const GITLAB_API = "https://gitlab.com/api/v4/projects/crossref%2Fretraction-watch-data/repository/commits?per_page=1";
const BUILD_HOOK = process.env.NETLIFY_BUILD_HOOK;

export default async () => {
  if (!BUILD_HOOK) {
    console.log("NETLIFY_BUILD_HOOK not set, skipping.");
    return;
  }

  try {
    // Get latest commit date from GitLab
    const res = await fetch(GITLAB_API);
    if (!res.ok) {
      console.log(`GitLab API returned ${res.status}, skipping.`);
      return;
    }
    const [commit] = await res.json();
    const latestCommit = commit.committed_date;
    console.log(`Latest RW commit: ${latestCommit}`);

    // Compare with our last build timestamp
    let lastBuild = null;
    try {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      lastBuild = readFileSync(resolve(__dirname, "rw-timestamp.txt"), "utf8").trim();
    } catch { /* no timestamp file = first run */ }

    if (lastBuild && new Date(latestCommit) <= new Date(lastBuild)) {
      console.log(`No update needed. Our data: ${lastBuild}`);
      return;
    }

    // Trigger rebuild
    console.log(`New data available! Triggering rebuild...`);
    const hookRes = await fetch(BUILD_HOOK, { method: "POST" });
    console.log(`Build hook response: ${hookRes.status}`);
  } catch (err) {
    console.error("Update check failed:", err.message);
  }
};

export const config = {
  schedule: "@daily",
};
