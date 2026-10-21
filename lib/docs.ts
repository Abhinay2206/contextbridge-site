/**
 * Documentation content. Every statement here was checked against ContextBridge 0.3.3
 * (source, `--help` output and a real run). Inline markup: `code`, **bold**, [text](href).
 */
export type Block =
  | { t: "p"; x: string }
  | { t: "h2"; x: string }
  | { t: "h3"; x: string }
  | { t: "ul"; x: string[] }
  | { t: "ol"; x: string[] }
  | { t: "code"; x: string; lang?: string }
  | { t: "note"; k: "note" | "warn"; x: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "steps"; items: { title: string; body: Block[] }[] };

export type Doc = { slug: string; group: string; title: string; lead: string; blocks: Block[] };

export const GROUPS = ["Introduction", "Guides", "Reference"] as const;

const REPO = "https://github.com/Abhinay2206/ContextBridge";

export const DOCS: Doc[] = [
  {
    slug: "quick-start",
    group: "Introduction",
    title: "Quick Start",
    lead: "Install the CLI, save a checkpoint of a git repository, and check it from a fresh session.",
    blocks: [
      { t: "note", k: "note", x: "ContextBridge needs **Python 3.9+** and **git**. It has no third-party Python dependencies. Run every command below from inside a git repository." },
      {
        t: "steps",
        items: [
          {
            title: "Install",
            body: [
              { t: "code", lang: "bash", x: "pip install contextbridge-cli\ncontextbridge --help" },
              { t: "p", x: "The package is `contextbridge-cli` on [PyPI](https://pypi.org/project/contextbridge-cli/); the command it installs is `contextbridge`." },
            ],
          },
          {
            title: "Initialize the repository",
            body: [
              { t: "code", lang: "bash", x: "cd your-repo\ncontextbridge init" },
              { t: "p", x: "This creates a `contextbridge/` folder (`state.json`, `graph.json`, `sessions.json`, `HANDOFF.md`) and, if it is missing, a `.contextbridgeignore` file." },
              { t: "note", k: "note", x: "Every write shows a diff first. In a terminal it asks before applying. Without a terminal and without `--yes` (`-y`), it prints the diff, writes nothing and exits with code 3." },
            ],
          },
          {
            title: "Run your tests through ContextBridge",
            body: [
              { t: "code", lang: "bash", x: "contextbridge run -- python3 -m unittest" },
              { t: "p", x: "The command runs normally. ContextBridge records its exit code, duration, the last lines of output (secrets redacted) and the workspace state it ran against." },
              { t: "code", lang: "text", x: "E1 `python3 -c print('ok')` -> PASSED (exit 0, 0.06s)" },
            ],
          },
          {
            title: "Save a checkpoint",
            body: [
              { t: "code", lang: "bash", x: 'contextbridge save --objective "Add login" --next "Write the logout handler"' },
              { t: "p", x: "A checkpoint stores the branch, the HEAD commit, every uncommitted file with its SHA-256, and a fingerprint of the whole workspace. It also rewrites `HANDOFF.md`." },
            ],
          },
          {
            title: "Check it from a fresh session",
            body: [
              { t: "code", lang: "bash", x: "contextbridge resume --check" },
              { t: "code", lang: "text", x: "## Resume safety gate: READY\nNo conflicts detected. Proceed with the Next action and keep verifying with tests.\n\nNo drift: workspace matches the checkpoint.\n[exit 0]" },
              { t: "p", x: "Edit a file and run it again. The verdict changes, and the exit code with it:" },
              { t: "code", lang: "text", x: "## Resume safety gate: REVIEW_REQUIRED\nDo not edit yet. Inspect each item below, reconcile it with the code or the user, then proceed.\n\n[WARN ] app.py: new uncommitted change since checkpoint\n[WARN ] no passing test run matches the current workspace state; re-run tests before trusting 'done'\n[exit 1]" },
              { t: "p", x: "`contextbridge resume` (without `--check`) prints the same gate result followed by the full handoff, ready to paste into a new session." },
            ],
          },
        ],
      },
      { t: "h2", x: "Where to go next" },
      {
        t: "ul",
        x: [
          "[What ContextBridge is](/docs/what-is-contextbridge) and what it does not do.",
          "[The resume gate](/docs/resume-gate): every verdict and finding explained.",
          "[Use it with Claude](/docs/claude-integration) as a Claude Code plugin or a Claude skill.",
          "[CLI reference](/docs/cli-reference) for every command and option.",
        ],
      },
    ],
  },
  {
    slug: "what-is-contextbridge",
    group: "Introduction",
    title: "What is ContextBridge",
    lead: "Verified, portable, private project memory for AI coding sessions.",
    blocks: [
      { t: "p", x: "When an AI coding session ends (usage limit, new account, new chat), the next session has to guess what happened. ContextBridge writes a checkpoint of the **real state of your repository** into the repository itself, and checks that checkpoint against the repository before the next session is allowed to edit code." },
      { t: "h2", x: "What it does" },
      {
        t: "ul",
        x: [
          "**Checkpoints** the git state: branch, HEAD, uncommitted files with hashes, and a workspace fingerprint.",
          "**Records test runs** you execute with `contextbridge run`, instead of trusting a written claim that tests passed.",
          "**Gates the resume**: `contextbridge resume --check` returns READY, REVIEW_REQUIRED or BLOCKED and a matching exit code.",
          "**Tracks provenance**: items are marked *observed* (measured by the tool) or *claimed* (written by a person or agent).",
          "**Keeps a decision graph** linking requirements, decisions, code and tests.",
          "**Lists parallel sessions** and warns when their claimed files overlap (advisory only).",
          "**Scans for secrets** before anything is written or exported.",
        ],
      },
      { t: "h2", x: "What it does not do" },
      {
        t: "ul",
        x: [
          "It does not copy chat history, account memory or usage allowance.",
          "A passing test run proves that a command succeeded, not that the software is correct.",
          "It makes no network calls, so a remote you have not fetched is invisible to it.",
          "The secret scanner is best-effort pattern matching, not a guarantee.",
          "It cannot force an AI assistant to obey the gate. The gate reports; the agent or you decide.",
        ],
      },
      { t: "h2", x: "Ways to use it" },
      {
        t: "table",
        head: ["Form", "What you get"],
        rows: [
          ["CLI", "`pip install contextbridge-cli`, then the `contextbridge` command."],
          ["Claude Code plugin", "Slash commands `/contextbridge:init`, `:checkpoint`, `:resume`, `:status`."],
          ["Claude skill", "A `SKILL.md` skill that guides Claude to write and resume context files."],
        ],
      },
      { t: "p", x: "It is open source under the MIT license. Source: [GitHub](" + REPO + ")." },
    ],
  },
  {
    slug: "install",
    group: "Introduction",
    title: "Install",
    lead: "Three ways to get ContextBridge. The CLI is the full tool; the plugin and skill guide Claude.",
    blocks: [
      { t: "h2", x: "CLI" },
      { t: "code", lang: "bash", x: "pip install contextbridge-cli\ncontextbridge --version" },
      { t: "p", x: "Requires Python 3.9 or newer and git. The package has no runtime dependencies." },
      { t: "h2", x: "Claude Code plugin" },
      { t: "code", lang: "text", x: "/plugin marketplace add Abhinay2206/ContextBridge\n/plugin install contextbridge@abhinay-contextbridge" },
      { t: "p", x: "This adds four slash commands: `/contextbridge:init`, `/contextbridge:checkpoint`, `/contextbridge:resume` and `/contextbridge:status`." },
      { t: "h2", x: "Claude skill" },
      { t: "p", x: "The repository ships the skill as `skills/contextbridge/SKILL.md` and as a ready-made upload, `dist/contextbridge-skill.zip`, in the [GitHub repository](" + REPO + "). The skill is written for a coding environment with repository file access; in browser chat it only works with files you provide." },
      { t: "note", k: "note", x: "The plugin and skill give Claude instructions. The gate verdicts and exit codes come from the CLI, so install the CLI to use them." },
    ],
  },
  {
    slug: "save-and-resume",
    group: "Guides",
    title: "Save and resume",
    lead: "Capture a checkpoint at the end of a session and pick it up in the next one.",
    blocks: [
      { t: "h2", x: "Record what happened" },
      { t: "code", lang: "bash", x: 'contextbridge work add "Added login form" --status completed --path src/login.py\ncontextbridge work add "Token refresh" --status attempted\ncontextbridge work add "Logout handler" --status planned\ncontextbridge work set W2 completed --evidence E1' },
      { t: "p", x: "Work items have one of three statuses: `completed`, `attempted` or `planned`. Link a test run with `--evidence E1`; a completed item with no linked run is reported as an unverified claim." },
      { t: "h2", x: "Record tests and assumptions" },
      { t: "code", lang: "bash", x: 'contextbridge run -- python3 -m unittest\ncontextbridge assume "Config lives in settings.py" --file settings.py --contains DEBUG' },
      { t: "p", x: "`run` executes the command and records the result as observed evidence; it exits 0 if the command passed, 1 otherwise. `--timeout` sets a time limit. An assumption with `--file` (and optionally `--contains`) is re-checked on every resume; if it is no longer true the gate reports it as STALE." },
      { t: "h2", x: "Save" },
      { t: "code", lang: "bash", x: 'contextbridge save --objective "Finish auth" --next "Add the logout handler" --next-path src/logout.py --note "Refresh tokens expire after 1h"' },
      { t: "p", x: "`checkpoint` is an alias of `save`. Progress at any time: `contextbridge status` prints the objective, work counts, test-run totals and current drift." },
      { t: "h2", x: "Resume" },
      { t: "code", lang: "bash", x: "contextbridge resume --check   # verdict and exit code only\ncontextbridge resume           # verdict plus the handoff to paste into the new session\ncontextbridge resume --json    # machine-readable" },
      { t: "p", x: "See [The resume gate](/docs/resume-gate) for what each verdict means." },
      { t: "note", k: "warn", x: "The `contextbridge/` folder is untracked until you commit it. `git stash -u` or `git clean -fd` would delete it. Commit it, or run `contextbridge init --local-only` to add it to `.git/info/exclude`. `save` prints this tip when it applies." },
    ],
  },
  {
    slug: "resume-gate",
    group: "Guides",
    title: "The resume gate",
    lead: "Compares the saved checkpoint with the repository as it is now and returns one of three verdicts.",
    blocks: [
      { t: "h2", x: "Verdicts" },
      {
        t: "table",
        head: ["Verdict", "Exit code", "Meaning"],
        rows: [
          ["READY", "0", "No conflicts. Proceed with the next action and keep verifying."],
          ["REVIEW_REQUIRED", "1", "Something changed. Inspect each item before editing."],
          ["BLOCKED", "2", "The checkpoint cannot be trusted here. No resume prompt is produced."],
        ],
      },
      { t: "h2", x: "Finding levels" },
      {
        t: "table",
        head: ["Level", "Effect on verdict"],
        rows: [
          ["BLOCK", "BLOCKED"],
          ["STALE", "REVIEW_REQUIRED"],
          ["WARN", "REVIEW_REQUIRED"],
          ["INFO", "None; shown for awareness"],
        ],
      },
      { t: "h2", x: "What it checks" },
      {
        t: "ul",
        x: [
          "**BLOCK**: the branch changed; the checkpoint commit is not an ancestor of HEAD; git is unavailable; there is no checkpoint, the schema is unsupported, or the notes are malformed.",
          "**WARN**: commits since the checkpoint; files changed or new since the checkpoint; work items whose files changed; a test run that never finished; no passing run matching the current workspace state.",
          "**STALE**: an assumption whose file is gone or no longer contains the text; the last test run failed.",
          "**INFO**: completed items that are only claims, with no linked test run.",
          "**Sessions** (advisory): overlapping claims between active sessions are reported as INFO, or as a WARN when both claims cover modified files.",
        ],
      },
      { t: "h2", x: "Output limits" },
      { t: "p", x: "Output stays bounded on large projects: at most 5 findings per kind are listed and the rest are summarized, and the handoff keeps the newest 25 items per section and notes how many older ones are in `state.json`." },
      { t: "h2", x: "Use it in scripts" },
      { t: "code", lang: "bash", x: "contextbridge resume --check || echo \"do not edit yet (exit $?)\"" },
      { t: "p", x: "`contextbridge drift` prints only the findings (add `--json` for JSON) and exits 1 if any finding is above INFO." },
      { t: "note", k: "note", x: "The gate reports; it cannot stop an assistant from editing. Its value is that a check against the real repository replaces trusting a written summary." },
    ],
  },
  {
    slug: "switch-accounts",
    group: "Guides",
    title: "Switch accounts or agents",
    lead: "Move work to a new session, account or agent through files, not chat history.",
    blocks: [
      { t: "steps", items: [
        { title: "Save in the old session", body: [{ t: "code", lang: "bash", x: "contextbridge save --next \"Write the logout handler\"" }] },
        { title: "Get the repository to the new place", body: [{ t: "p", x: "Commit `contextbridge/` (or copy the repository), then clone or open it in the new account or tool." }] },
        { title: "Gate, then paste", body: [{ t: "code", lang: "bash", x: "contextbridge resume" }, { t: "p", x: "Paste the output into the new session. The handoff is agent-neutral and marks every item as observed or claimed." }] },
      ] },
      { t: "h2", x: "Name the agent" },
      { t: "p", x: "Set `CONTEXTBRIDGE_AGENT` so that work items and assumptions record who wrote them; otherwise they are recorded as `unknown`." },
      { t: "code", lang: "bash", x: "export CONTEXTBRIDGE_AGENT=claude-code" },
      { t: "h2", x: "Single-file bundle" },
      { t: "code", lang: "bash", x: "contextbridge export -o handoff.json\ncontextbridge import handoff.json\ncontextbridge drift" },
      { t: "p", x: "A bundle holds the state, graph and sessions. Export scans it and refuses if it finds a possible secret, unless you pass `--redact`. Imported notes are treated as untrusted: import shows a diff, and you should run `contextbridge drift` before relying on them." },
    ],
  },
  {
    slug: "decisions-and-sessions",
    group: "Guides",
    title: "Decisions and sessions",
    lead: "Record why code is the way it is, and see when parallel sessions overlap.",
    blocks: [
      { t: "h2", x: "Decision graph" },
      { t: "code", lang: "bash", x: 'contextbridge decision add "Use SQLite" \\\n  --why "No server to run" \\\n  --rejected "Postgres: needs a service" \\\n  --requirement "Runs offline" \\\n  --code src/db.py:connect \\\n  --test tests/test_db.py \\\n  --consequence "Single writer"' },
      { t: "p", x: "A decision can link to a requirement, code (`PATH` or `PATH:SYMBOL`), tests and other decisions (`--depends`). Adding one also re-renders `DECISIONS.md`." },
      {
        t: "table",
        head: ["Command", "Does"],
        rows: [
          ["`graph show`", "List every node."],
          ["`graph query TERM`", "Find nodes containing the term, with their neighbours."],
          ["`graph trace ID`", "Walk from one node to everything connected to it, grouped as requirements, decisions, code and tests."],
          ["`graph check`", "Report linked files that no longer exist (STALE), decisions with no linked test or requirement (INFO)."],
          ["`graph render`", "Regenerate `DECISIONS.md` from `graph.json`."],
        ],
      },
      { t: "h2", x: "Sessions" },
      { t: "code", lang: "bash", x: 'contextbridge session start auth --task "Login flow" --agent claude --claim "src/auth/*"\ncontextbridge session list\ncontextbridge session finish auth' },
      { t: "p", x: "Sessions record who claimed which paths. `session list` reports overlapping claims between active sessions (a warning when both claims cover modified files) and sessions that depend on one still active. This is **advisory only**: it cannot prevent conflicts across clones or machines." },
    ],
  },
  {
    slug: "privacy-and-security",
    group: "Guides",
    title: "Privacy and security",
    lead: "What stays local, what is excluded, and how the secret scanner works.",
    blocks: [
      { t: "ul", x: [
        "**Local-first.** Notes are plain files in your repository. ContextBridge makes no network calls.",
        "**Excluded files.** Files matching `.env`, `.env.*`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa*`, `id_ed25519*`, `secrets.*` and `credentials*.json` are never recorded; add your own patterns in `.contextbridgeignore`. The checkpoint reports how many files were excluded.",
        "**Reviewed writes.** Every change to your notes is shown as a diff before it is written.",
        "**Secret scanner.** Content is scanned before it is written, exported or captured from a test run. It refuses by default; `--redact` replaces matches instead.",
        "**Concurrent writes.** Commands that write take a lock in the git directory, so parallel writers do not clobber each other.",
      ] },
      { t: "h2", x: "What the scanner recognises" },
      { t: "p", x: "Private key blocks, and keys or tokens for AWS, GitHub, GitLab, Slack, Google, Stripe, SendGrid, npm, PyPI, Hugging Face, DigitalOcean, Shopify, Mailchimp, Telegram, Twilio, Azure, `sk-` style API keys, JWTs, passwords inside URLs, and generic `secret = \"...\"` style assignments." },
      { t: "code", lang: "bash", x: "contextbridge scan notes.md config.txt   # exit 2 if anything is found" },
      { t: "note", k: "warn", x: "The scanner is best-effort pattern matching. It will miss secrets that do not look like these patterns. Treat it as a safety net, not a guarantee." },
    ],
  },
  {
    slug: "claude-integration",
    group: "Guides",
    title: "Use it with Claude",
    lead: "The Claude Code plugin and the Claude skill guide the assistant; the CLI does the checking.",
    blocks: [
      { t: "h2", x: "Claude Code plugin" },
      { t: "code", lang: "text", x: "/plugin marketplace add Abhinay2206/ContextBridge\n/plugin install contextbridge@abhinay-contextbridge" },
      {
        t: "table",
        head: ["Command", "Purpose"],
        rows: [
          ["`/contextbridge:init`", "Initialize project context files in the current repository."],
          ["`/contextbridge:checkpoint`", "Save a portable checkpoint for another Claude session or account."],
          ["`/contextbridge:resume`", "Resume work from a checkpoint in a fresh session."],
          ["`/contextbridge:status`", "Summarize progress and how fresh the notes are."],
        ],
      },
      { t: "h2", x: "Claude skill" },
      { t: "p", x: "The skill is named `contextbridge`. It teaches Claude to create, update, validate and resume project context for checkpoints before a usage limit, account switches and fresh chats. It works best where Claude has repository file access." },
      { t: "note", k: "note", x: "Instructions are not enforcement. For a result you can script against, run `contextbridge resume --check` and use its exit code." },
    ],
  },
  {
    slug: "cli-reference",
    group: "Reference",
    title: "CLI reference",
    lead: "Every command and option in ContextBridge 0.3.3.",
    blocks: [
      { t: "h2", x: "Options on every command" },
      {
        t: "table",
        head: ["Option", "Meaning"],
        rows: [
          ["`--root ROOT`", "Repository root. Default: auto-detect."],
          ["`-y`, `--yes`", "Apply the reviewed diff without prompting."],
          ["`--redact`", "Redact detected secrets instead of refusing."],
        ],
      },
      { t: "h2", x: "Commands" },
      {
        t: "table",
        head: ["Command", "Description"],
        rows: [
          ["`init [--local-only]`", "Create the notes. `--local-only` adds `contextbridge/` to `.git/info/exclude`."],
          ["`save` / `checkpoint`", "Save a checkpoint. Options: `--objective`, `--next`, `--next-path`, `--note`."],
          ["`work add TEXT`", "Add a work item. `--status completed|attempted|planned`, `--path` (repeatable), `--evidence E1` (repeatable)."],
          ["`work set ID STATUS`", "Change a work item's status. `--evidence` links runs."],
          ["`run [--timeout N] -- CMD`", "Run a command and record it as test evidence."],
          ["`assume TEXT`", "Record an assumption. `--file`, `--contains` make it re-checkable."],
          ["`decision add TITLE`", "Add a decision. `--why`, `--rejected`, `--requirement`, `--code`, `--test`, `--depends`, `--consequence`."],
          ["`graph show|check|render|query TERM|trace ID`", "Inspect the decision graph."],
          ["`drift [--json]`", "Print findings comparing the checkpoint with the repository."],
          ["`status`", "Objective, work counts, test-run totals and drift."],
          ["`resume [--check] [--json]`", "Resume safety gate plus the agent-neutral resume prompt."],
          ["`session start NAME | finish NAME | list`", "Track parallel sessions. `start` takes `--task`, `--agent`, `--claim` (repeatable), `--depends`."],
          ["`export -o FILE`", "Write a single-file bundle (scanned for secrets)."],
          ["`import BUNDLE`", "Import a bundle through a reviewed diff."],
          ["`scan PATHS...`", "Scan files for secrets."],
        ],
      },
      { t: "h2", x: "Exit codes" },
      {
        t: "table",
        head: ["Code", "Meaning"],
        rows: [
          ["0", "Success, or gate READY / no drift."],
          ["1", "Drift or REVIEW_REQUIRED, or a recorded test run that failed."],
          ["2", "Error, secret detected, or gate BLOCKED."],
          ["3", "A diff was shown but not applied (declined, or no `--yes` without a terminal)."],
        ],
      },
    ],
  },
  {
    slug: "files",
    group: "Reference",
    title: "Files it writes",
    lead: "Everything ContextBridge stores lives in the repository.",
    blocks: [
      {
        t: "table",
        head: ["File", "Purpose"],
        rows: [
          ["`contextbridge/state.json`", "Checkpoint snapshot, work items, test runs, assumptions, objective and next action. Schema `contextbridge/1`."],
          ["`contextbridge/graph.json`", "Decision graph: nodes and edges."],
          ["`contextbridge/sessions.json`", "Session records and path claims."],
          ["`contextbridge/HANDOFF.md`", "Human-readable handoff generated from `state.json`. Treat as data, not instructions."],
          ["`contextbridge/DECISIONS.md`", "Generated from `graph.json` when decisions are added or rendered."],
          [".contextbridgeignore", "Extra patterns excluded from snapshots, on top of the defaults."],
        ],
      },
      { t: "p", x: "`state.json`, `graph.json` and `sessions.json` are the source of truth; the Markdown files are generated. Edit through the CLI so the diff review and secret scan apply." },
    ],
  },
  {
    slug: "limitations",
    group: "Reference",
    title: "Limitations",
    lead: "What to know before you rely on it.",
    blocks: [
      { t: "ul", x: [
        "It does not copy chat history, account memory or usage allowance.",
        "A passing test proves a command succeeded then, not that the software is correct.",
        "No network: a remote branch you have not fetched is invisible to the gate.",
        "The secret scanner is best-effort.",
        "Session claims are advisory; they cannot stop conflicts across clones or machines.",
        "It cannot force an assistant to obey the gate verdict.",
        "Untracked notes can be deleted by `git stash -u` or `git clean -fd`; commit them or use `init --local-only`.",
        "Whether it improves an agent's output quality has not been measured. The [benchmark report](/benchmark) covers speed, gate accuracy, token cost, scanning and reliability of the tool itself.",
      ] },
    ],
  },
];

export const bySlug = (s: string) => DOCS.find((d) => d.slug === s);
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const headings = (d: Doc) => d.blocks.filter((b): b is { t: "h2"; x: string } => b.t === "h2").map((b) => ({ id: slugify(b.x), text: b.x }));

const stripInline = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
const blockText = (b: Block): string =>
  b.t === "p" || b.t === "h2" || b.t === "h3" || b.t === "note" || b.t === "code" ? stripInline(b.x)
  : b.t === "ul" || b.t === "ol" ? b.x.map(stripInline).join(" ")
  : b.t === "table" ? [...b.head, ...b.rows.flat()].map(stripInline).join(" ")
  : b.items.map((i) => i.title + " " + i.body.map(blockText).join(" ")).join(" ");

/** Flat search index: one entry per page and per h2 section. */
export const SEARCH = DOCS.flatMap((d) => {
  const out = [{ slug: d.slug, id: "", title: d.title, section: d.group, text: d.lead }];
  let cur = { id: "", title: d.title, text: [] as string[] };
  const flush = () => { if (cur.id) out.push({ slug: d.slug, id: cur.id, title: cur.title, section: d.title, text: cur.text.join(" ") }); };
  for (const b of d.blocks) {
    if (b.t === "h2") { flush(); cur = { id: slugify(b.x), title: stripInline(b.x), text: [] }; }
    else if (cur.id) cur.text.push(blockText(b));
    else out[0].text += " " + blockText(b);
  }
  flush();
  return out;
});

const md = (b: Block): string =>
  b.t === "p" ? b.x
  : b.t === "h2" ? `## ${b.x}`
  : b.t === "h3" ? `### ${b.x}`
  : b.t === "ul" ? b.x.map((i) => `- ${i}`).join("\n")
  : b.t === "ol" ? b.x.map((i, n) => `${n + 1}. ${i}`).join("\n")
  : b.t === "code" ? "```" + (b.lang || "") + "\n" + b.x + "\n```"
  : b.t === "note" ? `> **${b.k === "warn" ? "Warning" : "Note"}:** ${b.x}`
  : b.t === "table" ? [`| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n")
  : b.items.map((i, n) => `### ${n + 1}. ${i.title}\n\n${i.body.map(md).join("\n\n")}`).join("\n\n");

export const toMarkdown = (d: Doc) => `# ${d.title}\n\n${d.lead}\n\n${d.blocks.map(md).join("\n\n")}\n`;
