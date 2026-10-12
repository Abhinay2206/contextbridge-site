export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
/** Version of the ContextBridge tool this site documents (keep equal to the tool's pyproject version). */
export const TOOL_VERSION = "0.3.3";
export const REPO_URL = "https://github.com/Abhinay2206/ContextBridge";
export const PYPI_URL = "https://pypi.org/project/contextbridge-cli/";
export const SITE_NAME = "ContextBridge";
export const TAGLINE = "Context outlives the session.";
export const DESCRIPTION =
  "ContextBridge is an open-source resume safety gate for AI coding sessions. It checkpoints the real state of your repository, records the tests you actually ran, and tells the next session or account whether it is safe to edit code: READY, REVIEW_REQUIRED or BLOCKED. Local-first, zero dependencies, MIT licensed.";
/** JSON for <script type="application/ld+json">; "<" is escaped so the data cannot close the tag. */
export const ld = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");
