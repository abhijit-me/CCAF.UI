export const slides = [
  // ===== SLIDE 0: TITLE =====
  { type: "title" },

  // ===== SLIDE 1: EXAM INFO =====
  { type: "exam-info" },

  // ===== SLIDE 2: TABLE OF CONTENTS =====
  { type: "toc" },

  // ===== DOMAIN 1: Agentic Architecture =====
  {
    type: "domain-title",
    domain: 1,
    color: "var(--d1)",
    title: "Agentic Architecture & Orchestration",
    weight: "27% — the single heaviest domain · 7 task statements",
    desc: "Tests whether you can design, implement, and debug agentic systems. The two execution models: Messages API (you own the loop) and Claude Agent SDK (the SDK owns the loop)."
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.1",
    title: "Agentic Loops for Autonomous Task Execution",
    bullets: [
      "<strong>Send</strong> the request with full history + the tools array",
      "Inspect <strong>stop_reason</strong> — the authoritative signal: \"tool_use\" → continue; \"end_turn\" → terminate",
      "If tool_use: <strong>execute</strong> the tool(s), append assistant message, then append tool results as a <strong>user-role message</strong>",
      "Tool results must be appended to conversation, or Claude reasons from <strong>stale state</strong>",
      "This is <strong>model-driven decision-making</strong> — Claude decides the next tool, not a hard-coded tree"
    ],
    code: `while True:
    response = client.messages.create(
        model="claude-opus-4-8", tools=[weather_tool], messages=messages
    )
    if response.stop_reason == "end_turn":
        break
    if response.stop_reason == "tool_use":
        messages.append({"role": "assistant", "content": response.content})
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_tool(block.name, block.input)
                tool_results.append({"type":"tool_result", "tool_use_id": block.id, "content": output})
        messages.append({"role": "user", "content": tool_results})`,
    callout: { type: "warn", text: "Three anti-patterns as distractors: (1) parsing text for termination; (2) iteration cap as primary stop; (3) checking for text as completion. If it reads words instead of stop_reason, it's wrong." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.2",
    title: "Multi-Agent Orchestration (Coordinator–Subagent)",
    bullets: [
      "A central <strong>coordinator</strong> manages all inter-subagent communication, error handling, and routing",
      "Subagents are spokes — they talk <strong>through</strong> the coordinator, never peer-to-peer",
      "Subagents operate with <strong>isolated context</strong> — they do NOT inherit the coordinator's conversation history",
      "Coordinator responsibilities: task decomposition, delegation, result aggregation, dynamic subagent selection",
      "<strong>Classic failure:</strong> overly narrow decomposition — subagents succeed but coverage has gaps"
    ],
    code: `options = ClaudeAgentOptions(
    allowed_tools=["Read", "WebSearch", "Agent"],
    agents={
        "web-researcher": AgentDefinition(
            description=..., prompt=..., tools=["WebSearch", "WebFetch"]
        ),
        "synthesizer": AgentDefinition(
            description=..., prompt=..., tools=[]
        ),
    },
)`,
    callout: { type: "key", text: "Most-tested fact: subagents operate with isolated context. They do NOT inherit the coordinator's history. Each starts with a fresh, blank context window." },
    example: { title: "Hub-and-Spoke Pattern", text: "Coordinator receives 'Research AI in healthcare'. Spawns web-researcher with specific prompt. Synthesizer receives ONLY what coordinator explicitly passes — it has zero knowledge of the original query." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.3",
    title: "Subagent Invocation, Context Passing & Spawning",
    bullets: [
      "Subagent context must be <strong>explicitly provided in the prompt</strong> — the only channel",
      "Include <strong>complete prior findings</strong> in the subagent's prompt",
      "Use <strong>structured data formats</strong> to separate content from metadata for attribution",
      "<strong>Parallel spawning</strong> = multiple Task tool calls in a single coordinator response (not across turns)",
      "Write coordinator prompts specifying <strong>goals and quality criteria</strong>, not step-by-step procedures"
    ],
    callout: { type: "key", text: "The prompt is the ONLY way to pass context. No shared memory, no global state, no inherited conversation. If you don't put it in the prompt, the subagent doesn't know it." },
    example: { title: "Parallel Research", text: "Coordinator issues 3 Task calls in ONE response: pricing trends, adoption rates, regulatory changes. All run simultaneously. Each gets ONLY its specific query. Results fan back in for synthesis." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.4",
    title: "Multi-Step Workflows — Enforcement & Handoff",
    bullets: [
      "When <strong>deterministic compliance</strong> is required, prompt instructions have a non-zero failure rate",
      "Enforce in code: <strong>hooks / prerequisite gates</strong>",
      "<strong>Block downstream tool calls</strong> until prerequisites complete",
      "Structured <strong>handoff protocols</strong> for escalation: include customer details, root-cause, recommendations"
    ],
    code: `async def enforce_verification_before_refund(input_data, tool_use_id, context):
    if input_data["tool_name"] == "process_refund" and not state["verified_customer_id"]:
        return {"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": "get_customer must verify identity first."
        }}
    return {}  # allow`,
    callout: { type: "key", text: "Programmatic enforcement vs. prompt guidance: money, identity, compliance → hooks/gates (deterministic). Prompts are probabilistic." },
    example: { title: "Refund Safety Gate", text: "Without enforcement, 12% of the time agent skips verification. With PreToolUse hook, process_refund CANNOT execute until get_customer returns verified_customer_id. It's code — can't be talked around." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.5",
    title: "Agent SDK Hooks — Interception & Normalization",
    bullets: [
      "Hooks are <strong>deterministic callbacks</strong> the SDK invokes at fixed lifecycle points — called by SDK, not by Claude",
      "Events: <strong>PreToolUse, PostToolUse, Stop, SessionStart, SessionEnd, UserPromptSubmit</strong>",
      "<strong>PostToolUse</strong> — transform tool results before model sees them (normalize timestamps)",
      "<strong>PreToolUse</strong> — intercept outgoing calls to enforce compliance (block refund > $500)",
      "Return {} to allow, or hookSpecificOutput with permissionDecision: 'deny' to block"
    ],
    callout: { type: "key", text: "Governing principle: hooks for deterministic guarantees; prompts only for probabilistic preferences." },
    example: { title: "Normalizing API Responses", text: "3 MCP tools return timestamps in different formats. PostToolUse hook normalizes all to ISO-8601 before Claude sees them — consistent data without extra prompt instructions." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.6",
    title: "Task Decomposition Strategies",
    bullets: [
      "<strong>Prompt chaining</strong> — predictable sequence, each step feeds the next. Known structure up front",
      "<strong>Dynamic/adaptive</strong> — generate subtasks from what you discover. Open-ended investigation",
      "Patterns: prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer",
      "<strong>Orchestrator-workers</strong> (subtasks decided at runtime) vs. <strong>parallelization</strong> (pre-defined)",
      "Split big code reviews into <strong>per-file passes + cross-file integration pass</strong>"
    ],
    callout: { type: "tip", text: "Decision rule: 'independent subtasks' → Parallel. 'each step needs prior result' → Sequential. 'unknown complexity' → Dynamic adaptive. 'coordinator + specialists' → Hub-and-spoke." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "1.7",
    title: "Session State, Resumption & Forking",
    bullets: [
      "<strong>--resume &lt;name&gt;</strong> continues a prior conversation with full context",
      "<strong>fork_session</strong> — independent branch from shared baseline for divergent approaches",
      "Resuming after file changes: agent does <strong>NOT auto-detect</strong> filesystem changes — tell it explicitly",
      "Resume when prior context is valid; <strong>start fresh with structured summary</strong> when data is stale"
    ],
    callout: { type: "warn", text: "Common trap: assuming resume detects changed files. It won't. You must tell it explicitly, or it reasons from stale tool results." },
    example: { title: "Fork for Exploration", text: "Analyze a legacy module → fork twice: Fork A = microservice extraction, Fork B = in-place refactor with adapter. Both start from same baseline, explore independently without polluting each other." }
  },
  {
    type: "content",
    domain: 1,
    color: "var(--d1)",
    task: "Principles",
    title: "Domain 1 Patterns & Principles",
    table: {
      headers: ["Pattern", "Use When", "Key Property"],
      rows: [
        ["Sequential", "Each step needs previous output", "A → B → C; each receives prior result"],
        ["Parallel", "Subtasks are independent", "Fan-out/fan-in; no shared state"],
        ["Pipeline", "Stages have different specializations", "Assembly line; output feeds next stage"],
        ["Dynamic Adaptive", "Complexity unknown at design time", "Model decides decomposition at runtime"],
        ["Hub-and-Spoke", "One coordinator, multiple specialists", "Central agent delegates; all comms via hub"]
      ]
    },
    principles: [
      "<strong>01:</strong> Simplest effective fix wins — distractors are over-engineered",
      "<strong>02:</strong> Deterministic > probabilistic — money/identity/compliance → hooks",
      "<strong>03:</strong> stop_reason is the only loop signal — never text-parse",
      "<strong>04:</strong> Subagents are blank slates — pass context explicitly",
      "<strong>05:</strong> Attribute failures to the right layer — coordinator vs subagent vs tool",
      "<strong>06:</strong> Structured everything — errors, handoffs, claim-source mappings"
    ]
  },

  // ===== DOMAIN 1 FLASHCARDS =====
  { type: "flashcard", domain: 1, color: "var(--d1)", title: "Domain 1 Flashcards", dataKey: "d1Flashcards" },

  // ===== DOMAIN 2: Tool Design & MCP =====
  {
    type: "domain-title",
    domain: 2,
    color: "var(--d2)",
    title: "Tool Design & MCP Integration",
    weight: "18% of scored content · 5 task statements",
    desc: "The tool description and the tool boundary drive reliable model behavior — not extra orchestration code. Tool use is a contract: you define operations and I/O shapes; Claude decides when and how to call them."
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "2.1",
    title: "Effective Tool Interfaces",
    bullets: [
      "Tool descriptions are the <strong>PRIMARY mechanism</strong> the LLM uses for tool selection",
      "Good descriptions include <strong>input formats, example queries, edge cases, and boundaries</strong>",
      "Fixes: rename + re-describe to remove overlap; split generic tools into purpose-specific ones",
      "Review system prompts for keyword-sensitive instructions that <strong>fight</strong> your tool descriptions"
    ],
    code: `{
  "name": "get_customer",
  "description": "Look up a CUSTOMER by verified customer ID or email. "
    "Use FIRST to establish identity before any order/refund action. "
    "Do NOT use for order numbers — use lookup_order for those.",
  "input_examples": [{"customer_id": "CUST-10293"}, {"customer_id": "jane@example.com"}]
}`,
    callout: { type: "key", text: "Fix sequence for misrouting: (1) Expand descriptions — always first. (2) Add 2-4 few-shot examples. (3) Routing classifier — only after 1+2 genuinely fail." },
    example: { title: "Fixing Tool Confusion", text: "Agent has get_customer and lookup_order with one-line descriptions. 'Check order #12345' calls get_customer. Fix: add 'Do NOT use for order numbers' to get_customer, 'Use for order IDs like #12345' to lookup_order. No code change needed." }
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "2.2",
    title: "Structured Error Responses for MCP Tools",
    bullets: [
      "MCP <strong>isError flag</strong> signals failure back to the agent",
      "Distinguish: <strong>transient</strong> (timeouts), <strong>validation</strong> (bad input), <strong>business</strong> (policy), <strong>permission</strong>",
      "<strong>Generic errors ('Operation failed')</strong> are an anti-pattern — strip recovery context",
      "Return errorCategory + isRetryable + human-readable message",
      "<strong>Never collapse access failure into empty result</strong> — agent thinks 'no data' when truth is 'couldn't check'"
    ],
    code: `if amount > policy_limit():
    return {"isError": True, "errorCategory": "business", "isRetryable": False,
            "message": "Refund exceeds $500 auto-approval limit. Escalate."}

# Full structured error shape:
{"errorCategory": "authentication"|"not_found"|"rate_limit"|"validation"|"internal",
 "isRetryable": true, "retryAfterMs": 5000,
 "partialResult": {...}, "suggestion": "Check API key permissions"}`,
    callout: { type: "warn", text: "Most-tested trap: tool silently returns [] on network failure → agent thinks 'no data exists' when truth is 'couldn't even check.' Catastrophic silent bug." },
    example: { title: "Empty vs Failure", text: "Search for patents in Liechtenstein returns []: VALID EMPTY (isError:false). But 401 from the API? ACCESS FAILURE (isError:true, errorCategory:'authentication'). Returning [] for both = the agent lies to the user." }
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "2.3",
    title: "Tool Distribution & tool_choice",
    bullets: [
      "<strong>Too many tools degrades selection</strong> — 4-5 well-scoped tools beat 18",
      "Scoped access + narrow cross-role tool for proven high-frequency needs",
      "Replace generic tools with <strong>constrained</strong> ones (fetch_url → load_document)"
    ],
    table: {
      headers: ["tool_choice", "Behavior", "Use When"],
      rows: [
        ["\"auto\"", "May answer in text OR call a tool", "Default conversational agent"],
        ["\"any\"", "MUST call some tool (no plain text)", "Guarantee structured output"],
        ["{type:\"tool\",name:...}", "Specific tool must run first", "Force extract_metadata before enrichment"]
      ]
    },
    callout: { type: "tip", text: "Schema design: descriptive param names, required only when mandatory, enum for constrained choices, keep schemas flat, description on every property." }
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "2.4",
    title: "Integrate MCP Servers",
    bullets: [
      "<strong>Project .mcp.json</strong> (shared, version-controlled) vs. <strong>~/.claude.json</strong> (personal)",
      "<strong>Env-var expansion</strong> (${'{'}GITHUB_TOKEN{'}'}) keeps secrets out of source control",
      "All configured servers' tools <strong>discovered at connection time</strong>",
      "<strong>MCP resources</strong> expose content catalogs — tools for actions, resources for visibility",
      "<strong>Prefer community MCP servers</strong> over custom builds for standard integrations"
    ],
    callout: { type: "key", text: "MCP three-layer model: Client (connects, routes calls) → Host (manages lifecycle) → Server (exposes tools/resources/prompts). Transport: JSON-RPC 2.0 over stdio or HTTP+SSE." },
    example: { title: "Team MCP Setup", text: "Need GitHub + Slack integration? Don't build custom MCP servers. Check community registry. Configure in .mcp.json with ${'{'}GITHUB_TOKEN{'}'} expansion. Team gets it on git pull." }
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "2.5",
    title: "Built-in Tools — Read, Write, Edit, Bash, Grep, Glob",
    table: {
      headers: ["Task", "Correct Tool", "Wrong (Bash)"],
      rows: [
        ["Read a config file", "Read(\"config.json\")", "Bash(\"cat config.json\")"],
        ["Find function usages", "Grep(\"getUserById\")", "Bash(\"grep -r ...\")"],
        ["Find all test files", "Glob(\"**/*.test.ts\")", "Bash(\"find . -name ...\")"],
        ["Fix a bug on one line", "Edit(file, old, new)", "Write(file, whole_file)"],
        ["Run the test suite", "Bash(\"npm test\")", "✓ correct — no built-in"]
      ]
    },
    bullets: [
      "<strong>Never use Bash when a dedicated tool exists</strong> — heavily-tested anti-pattern",
      "<strong>Write</strong> replaces ENTIRE file. <strong>Edit</strong> for targeted changes on existing files",
      "<strong>Grep</strong> = content search inside files. <strong>Glob</strong> = file-path pattern matching",
      "Explore incrementally: Grep → Read → Grep callers. <strong>Never read all files upfront</strong>"
    ],
    callout: { type: "key", text: "Never Bash when a built-in exists. Grep for content, Glob for paths, Read for known files, Edit for changes, Bash only for npm test / installs." }
  },
  {
    type: "content",
    domain: 2,
    color: "var(--d2)",
    task: "Principles",
    title: "Domain 2 Principles",
    principles: [
      "<strong>01: Fix the description before adding machinery</strong> — routing layers are over-engineering when the problem is thin descriptions",
      "<strong>02: Structured > generic errors</strong> — always carry category + retryability + reason; never 'Operation failed'",
      "<strong>03: Least privilege on tools</strong> — 4-5 scoped tools beat 18; narrow cross-role only for proven needs",
      "<strong>04: Resources for visibility, tools for actions</strong> — expose catalogs as MCP resources. Secrets via env-var expansion"
    ]
  },

  // ===== DOMAIN 2 FLASHCARDS =====
  { type: "flashcard", domain: 2, color: "var(--d2)", title: "Domain 2 Flashcards", dataKey: "d2Flashcards" },

  // ===== DOMAIN 3: Claude Code Configuration =====
  {
    type: "domain-title",
    domain: 3,
    color: "var(--d3)",
    title: "Claude Code Configuration & Workflows",
    weight: "20% of scored content · tied 2nd · 6 task statements",
    desc: "Questions are highly specific about which file goes where and which scope applies. The governing rule: scope by sharing need — project (committed) for the team, user (~/.claude/) for personal-only."
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "3.1",
    title: "CLAUDE.md Hierarchy & Modular Organization",
    bullets: [
      "<strong>User:</strong> ~/.claude/CLAUDE.md — personal only, not version-controlled",
      "<strong>Project:</strong> .claude/CLAUDE.md or root CLAUDE.md — shared via repo",
      "<strong>Directory:</strong> CLAUDE.md in subdirectory — applies within that subtree",
      "<strong>@./path imports</strong> inline referenced files at load time (no @import keyword)",
      "<strong>CLAUDE.local.md</strong> — sits next to CLAUDE.md, gitignored, personal tweaks",
      "<strong>.claude/rules/</strong> holds topic-specific rule files vs. one monolith"
    ],
    callout: { type: "key", text: "CLAUDE.md is NOT strict-precedence: all applicable files are concatenated into context; none 'overrides' another. It's delivered as a user message, not system prompt — guidance the model usually follows, not guaranteed enforcement." },
    example: { title: "Team Config Trap", text: "Priya puts conventions in ~/.claude/CLAUDE.md. New hire Rohan clones the repo — gets nothing. Why? It's user scope. Team-shared rules must live in project-level .claude/CLAUDE.md (committed)." }
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "3.2",
    title: "Custom Slash Commands & Skills",
    bullets: [
      "<strong>Commands:</strong> .claude/commands/ (shared) vs. ~/.claude/commands/ (personal)",
      "<strong>Skills:</strong> .claude/skills/SKILL.md with frontmatter — context: fork, allowed-tools, argument-hint",
      "<strong>Command</strong> = prompt template with /prefix, accepts $ARGUMENTS, runs in current session",
      "<strong>Skill</strong> = reusable capability module with tool restrictions and context isolation",
      "Need isolation or tool limits? → <strong>Skill</strong>. Simple prompt with params? → <strong>Command</strong>"
    ],
    code: `# .claude/skills/security-review/SKILL.md
---
name: security-review
context: fork                    # isolate verbose output
allowed-tools: [Read, Grep, Glob]  # read-only
argument-hint: "<path-or-glob to review>"
---`,
    callout: { type: "tip", text: "Commands run in current session (can pollute). Skills with context: fork run in isolated sub-agent. Need a reusable workflow that must NOT touch main-session state → skill." }
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "3.3",
    title: "Path-Specific Rules",
    bullets: [
      "<strong>.claude/rules/</strong> files use <strong>YAML frontmatter paths:</strong> with glob patterns",
      "Path-scoped rules load <strong>only when editing matching files</strong>",
      "Glob rules beat directory CLAUDE.md when conventions <strong>span scattered files</strong>"
    ],
    code: `# .claude/rules/testing.md
---
paths: ["**/*.test.tsx", "**/*.test.ts"]
---
- Use React Testing Library, not Enzyme
- Test behavior, not implementation details

# .claude/rules/api-auth.md
---
paths: ["src/api/**", "src/middleware/**"]
---
- All endpoints require authentication middleware`,
    callout: { type: "key", text: "Without YAML paths: field, a .claude/rules/ file loads for ALL operations. Add paths: globs to scope it. This is the answer for conventions spanning scattered files." },
    example: { title: "Testing Rules Everywhere", text: "Test files like Button.test.tsx live next to Button.tsx throughout the tree. Can't put CLAUDE.md in every folder. .claude/rules/testing.md with paths: ['**/*.test.tsx'] applies automatically anywhere." }
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "3.4–3.5",
    title: "Plan Mode, Direct Execution & Iterative Refinement",
    bullets: [
      "<strong>Plan mode</strong> — complex: multi-file, multiple approaches, architectural decisions",
      "<strong>Direct execution</strong> — simple, well-scoped, clear stack trace",
      "<strong>Concrete I/O examples</strong> are the most effective way to pin down transformations",
      "<strong>TDD iteration:</strong> write failing test → implement → run tests → refine",
      "<strong>Interview pattern:</strong> have Claude ask questions to surface missed considerations",
      "<strong>Explore subagent</strong> isolates verbose discovery, preserves main-conversation context"
    ],
    callout: { type: "tip", text: "The cue: is complexity already stated or hypothetical? Dozens of files / service boundaries → plan mode. Simple bug with clear trace → direct execution." }
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "3.6",
    title: "Claude Code in CI/CD",
    bullets: [
      "<strong>-p / --print</strong> runs non-interactive — processes prompt, prints to stdout, exits",
      "<strong>--output-format json + --json-schema</strong> enforce machine-parseable output",
      "<strong>CLAUDE.md</strong> supplies project context to CI-invoked Claude Code",
      "Same session that generated code is <strong>less effective at reviewing</strong> its own changes",
      "On re-runs: include prior findings, report only <strong>new/unaddressed</strong> issues"
    ],
    code: `# Headless, JSON for machine parsing:
claude -p "Analyze this PR for security issues. Report only NEW issues." \\
  --output-format json --json-schema ./review-schema.json > findings.json`,
    callout: { type: "key", text: "Three CI/CD facts: (1) -p for non-interactive, (2) NEVER self-review in same session, (3) --output-format json for parsing. Independent review beats self-review." }
  },
  {
    type: "content",
    domain: 3,
    color: "var(--d3)",
    task: "Principles",
    title: "Domain 3 Principles",
    principles: [
      "<strong>01: Scope by sharing need</strong> — project for team; user for personal. Most 'teammate isn't getting this' = user scope",
      "<strong>02: Automatic-by-path → rules globs</strong> — directory CLAUDE.md can't follow scattered files",
      "<strong>03: Skills vs. CLAUDE.md</strong> — skills = on-demand + isolatable; CLAUDE.md = always-loaded standards",
      "<strong>04: CI = -p + structured output</strong> — independent review instance beats self-review"
    ]
  },

  // ===== DOMAIN 3 FLASHCARDS =====
  { type: "flashcard", domain: 3, color: "var(--d3)", title: "Domain 3 Flashcards", dataKey: "d3Flashcards" },

  // ===== DOMAIN 4: Prompt Engineering =====
  {
    type: "domain-title",
    domain: 4,
    color: "var(--d4)",
    title: "Prompt Engineering & Structured Output",
    weight: "20% of scored content · tied 2nd · 6 task statements",
    desc: "Specific, example-driven prompts and schema enforcement beat vague instructions and confidence-based filtering."
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "4.1",
    title: "Explicit Criteria to Reduce False Positives",
    bullets: [
      "<strong>Explicit categorical criteria</strong> beat vague instructions — 'flag when claimed behavior contradicts code' works",
      "'Be conservative' / 'only high-confidence' do <strong>NOT improve precision</strong>",
      "<strong>False positives erode trust</strong> in accurate categories too",
      "Define severity with <strong>concrete code examples per level</strong>",
      "<strong>Measurable criteria:</strong> 'flag functions > 50 lines' beats 'flag long functions'"
    ],
    callout: { type: "warn", text: "Alert fatigue: over-flagging → devs ignore ALL flags including real bugs. 'Be thorough' or 'find all issues' is the trap; measurable categorical criteria are the fix." },
    example: { title: "Code Review Fix", text: "BAD: 'Thoroughly review and report all issues' → 50-80 flags per PR. GOOD: 'CRITICAL = injection/auth bypass. MEDIUM = logic causing data loss. MINOR = style only if affects readability. Report CRITICAL and MEDIUM only.' → 3-8 trusted, actionable issues." }
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "4.2",
    title: "Few-Shot Prompting",
    bullets: [
      "Few-shot is the <strong>workhorse</strong> for consistent, formatted output when instructions alone fall short",
      "Use <strong>2-4 targeted examples</strong> that show the reasoning, not just the answer",
      "Demonstrate ambiguous-case handling; enables <strong>generalization to novel patterns</strong>",
      "<strong>Diminishing returns:</strong> 0→2 jump has biggest impact; beyond ~4-6 quality plateaus",
      "Put examples in <strong>system prompt</strong> for prompt-cache reuse; include reasoning"
    ],
    callout: { type: "key", text: "Sweet spot is 2-4 examples. The 0→2 jump dominates. Beyond 4-6, gains plateau while cost grows. '10+ examples for best results' is a distractor — reject it." },
    example: { title: "Invoice Classification", text: "'Annual subscription - $1,200' → recurring, annual → subscription. 'Emergency plumbing' → one-time service → services. 'MacBook Pro' → tangible product → goods. Three examples with reasoning enable correct handling of novel inputs." }
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "4.3",
    title: "Structured Output via Tool Use + JSON Schemas",
    bullets: [
      "<strong>Tool use + JSON schema</strong> is most reliable for schema-compliant output",
      "Eliminates JSON <strong>syntax</strong> errors but NOT <strong>semantic</strong> errors",
      "<strong>Nullable fields prevent fabrication</strong> — model returns null instead of inventing",
      "Add <strong>enum with 'other'</strong> + detail-string for extensible categories",
      "Force with: tool_choice: {type:'tool', name:'extract_record'}"
    ],
    code: `// Nullable prevents fabrication:
"due_date": {"type": ["string", "null"], "description": "ISO-8601, or null if absent"}
"category": {"type": "string", "enum": ["goods","services","subscription","other"]}

// Force every call: tool_choice: {"type":"tool", "name":"extract_record"}`,
    callout: { type: "key", text: "Tool use guarantees STRUCTURE (valid JSON shape) but NOT SEMANTICS (correct values). Pair with validation. Required fields force fabrication when source data is missing." }
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "4.4",
    title: "Validation, Retry & Feedback Loops",
    bullets: [
      "<strong>Retry-with-error-feedback:</strong> append the specific error to guide correction",
      "Retries fix <strong>format/structure, NOT missing information</strong>",
      "Semantic checks: calculated_total vs stated_total, conflict_detected fields"
    ],
    code: `# Effective retry:
except ValidationError as e:
    messages.append({"role":"user",
        "content": f"Validation failed: field 'total' must be numeric, got '{result.total}'. "
                   f"Re-extract correcting ONLY this issue."})

# BAD retry:
messages.append({"role":"user", "content": "There were errors. Please try again."})
# ^ No signal about WHAT failed`,
    callout: { type: "key", text: "Retry must include: (1) original prompt, (2) failed output, (3) SPECIFIC validation error with expected format. Generic 'try again' has no signal." },
    example: { title: "Contract Extraction", text: "Extracts contract_value as '$1.2M' (string). Needs number. BAD: 'There were errors.' GOOD: 'Field contract_value must be numeric (cents), got \"$1.2M\". Expected: 1200000.' Model knows exactly what to fix." }
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "4.5",
    title: "Batch Processing & Multi-Instance Review",
    bullets: [
      "<strong>Message Batches API:</strong> ~50% cost savings, up to 24-hour window, no latency SLA",
      "No multi-turn tool calling within a single batch request",
      "<strong>Appropriate:</strong> overnight reports, nightly test gen (latency-tolerant)",
      "<strong>Inappropriate:</strong> blocking pre-merge checks developers wait on",
      "<strong>Self-review limitation:</strong> model retains generation reasoning → confirms own decisions",
      "<strong>Independent review instances</strong> catch issues better — no prior reasoning context"
    ],
    callout: { type: "key", text: "Batch = COST tool, not speed tool. 50% cheaper, up to 24h, no SLA. Never for blocking work. Self-review fails because the model keeps its reasoning — use a fresh instance." }
  },
  {
    type: "content",
    domain: 4,
    color: "var(--d4)",
    task: "Principles",
    title: "Domain 4 Principles",
    principles: [
      "<strong>01: Specific criteria > vague</strong> — 'be conservative' doesn't help; categorical rules with examples do",
      "<strong>02: Schema = syntax, not semantics</strong> — tool_use + schema guarantees shape, not correctness. Pair with validation",
      "<strong>03: Nullable prevents fabrication</strong> — let model return null. Retries fix format, not absent info",
      "<strong>04: Match API to latency</strong> — sync for blocking, batch for tolerant. Independent review beats self-review"
    ]
  },

  // ===== DOMAIN 4 FLASHCARDS =====
  { type: "flashcard", domain: 4, color: "var(--d4)", title: "Domain 4 Flashcards", dataKey: "d4Flashcards" },

  // ===== DOMAIN 5: Context Management =====
  {
    type: "domain-title",
    domain: 5,
    color: "var(--d5)",
    title: "Context Management & Reliability",
    weight: "15% of scored content · 6 task statements",
    desc: "Structured, position-aware, attribution-preserving context beats raw accumulation and vague summarization."
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "5.1",
    title: "Preserve Critical Information Across Long Interactions",
    bullets: [
      "<strong>Progressive summarization risk:</strong> condensing numbers/dates/expectations loses critical facts",
      "<strong>'Lost in the middle':</strong> models use beginning and end reliably, may omit middle",
      "Extract transactional facts into a <strong>persistent 'case facts' block</strong> at prompt start",
      "<strong>Trim verbose tool outputs</strong> to relevant fields (5 matter, not 40+)"
    ],
    code: `def build_prompt(case_facts, history_summary, user_msg):
    return (f"CASE FACTS (authoritative, do not summarize):\\n{case_facts}\\n\\n"
            f"Conversation summary:\\n{history_summary}\\n\\nUser: {user_msg}")

# case_facts: Customer ID, account tier, order number, amounts, commitments
# These are NEVER summarized — copied verbatim into every prompt`,
    callout: { type: "key", text: "Persistent fact blocks are copied character-for-character into every prompt, never summarized. Position at the START for highest recall. Progressive summarization = data loss." },
    example: { title: "Billing Dispute Agent", text: "35-turn conversation. By turn 30, agent uses wrong IDs and misquotes amounts. Fix: extract immutable facts (CUST-10293, $847.50, ORD-88421) into persistent block at top of every prompt. Never summarized, persists indefinitely." }
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "5.2",
    title: "Escalation & Ambiguity Resolution",
    bullets: [
      "<strong>Escalation triggers:</strong> customer asks for human (immediately); policy gap; inability to progress",
      "<strong>Sentiment-based escalation is unreliable</strong> — angry ≠ complex",
      "Multiple customer matches → <strong>ask for another identifier</strong>, not heuristic guess",
      "Fix calibration with <strong>explicit criteria + few-shot examples</strong> (escalate vs. resolve)"
    ],
    callout: { type: "key", text: "Escalation must be OBJECTIVE: explicit request, policy gap, capability limit, threshold exceeded. Never: sentiment, self-confidence, or 'complex-sounding' language." },
    example: { title: "Over-Escalation Fix", text: "Agent at 55% resolution (target 80%): escalates simple password resets but tries policy exceptions. Cause: using sentiment. Fix: escalate only when (1) customer asks, (2) policy exception needed, (3) no tool to resolve, (4) threshold exceeded." }
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "5.3",
    title: "Error Propagation Across Multi-Agent Systems",
    bullets: [
      "<strong>Structured error context</strong> enables intelligent coordinator recovery",
      "<strong>Access failures ≠ valid empty results</strong> (timeout → retry; zero-match → success)",
      "<strong>Three anti-patterns:</strong> generic statuses, silently suppressing errors, terminating whole workflow",
      "Annotate synthesis with <strong>coverage</strong>: well-supported vs. areas with gaps"
    ],
    callout: { type: "warn", text: "Three error-propagation anti-patterns: (1) generic 'search unavailable', (2) empty-as-success (silent suppression), (3) kill entire workflow on one failure. Each robs coordinator of recovery ability." },
    example: { title: "Research Agent Timeout", text: "Web-search subagent times out. BAD: 'search unavailable' / return [] / kill workflow. GOOD: {isError:true, errorCategory:'transient', attemptedQuery:'...', partialResults:[...], suggestion:'retry narrower'}. Coordinator can recover." }
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "5.4",
    title: "Context in Large Codebase Exploration",
    bullets: [
      "<strong>Context degradation:</strong> model references 'typical patterns' instead of specific classes found earlier",
      "<strong>Scratchpad files</strong> persist findings across context boundaries and session resets",
      "<strong>Subagent delegation</strong> isolates verbose exploration; main agent keeps coordination",
      "<strong>Crash recovery:</strong> export state to known location; load manifest on resume",
      "Use <strong>/compact</strong> when context fills with discovery output"
    ],
    callout: { type: "key", text: "Conversation history is ephemeral — lost on reset. Scratchpad files are external persistence surviving any number of resets. Write findings as discovered so no progress is lost." },
    example: { title: "40-File Investigation", text: "Agent explores 40+ files over 60 turns. Context fills, session resets — all lost. Fix: write each finding to FINDINGS.md on disk as discovered. On restart, Read('FINDINGS.md') to restore. Combine with /compact to free space." }
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "5.5–5.6",
    title: "Human Review, Confidence & Provenance",
    bullets: [
      "<strong>Aggregate accuracy masks</strong> poor performance on specific types (97% overall hides 70% segment)",
      "<strong>Stratified validation</strong> per document type surfaces hidden failures",
      "<strong>Source attribution lost during summarization</strong> — preserve claim-source mappings",
      "<strong>Conflicting sources → annotate with attribution</strong>, don't pick one value",
      "<strong>Temporal data:</strong> require publication dates — time differences ≠ contradictions",
      "<strong>Provenance per claim:</strong> source, confidence, timestamp, agent_id"
    ],
    callout: { type: "key", text: "Resolve conflicts by provenance: verified > extracted > inferred > estimated. Never average or arbitrarily pick. Annotate with full attribution and let the consumer decide." },
    example: { title: "GDP Conflict", text: "Government reports 3.2% (March 2025), academic DB shows 2.7% (Jan 2025). BAD: pick government / average to 2.95%. GOOD: present both with full provenance, note 2-month data gap. Consumer decides." }
  },
  {
    type: "content",
    domain: 5,
    color: "var(--d5)",
    task: "Principles",
    title: "Domain 5 Principles",
    principles: [
      "<strong>01: Structured facts beat vague summaries</strong> — persistent case-facts block; position at start/end",
      "<strong>02: Escalate on the right signals</strong> — explicit request, policy gap, no progress. Not sentiment",
      "<strong>03: Structured errors enable recovery</strong> — generic, silent suppression, and full termination are anti-patterns",
      "<strong>04: Preserve provenance end-to-end</strong> — claim-source mappings, dated findings, conflict annotation"
    ]
  },

  // ===== DOMAIN 5 FLASHCARDS =====
  { type: "flashcard", domain: 5, color: "var(--d5)", title: "Domain 5 Flashcards", dataKey: "d5Flashcards" },

  // ===== THANK YOU =====
  { type: "thankyou" }
];
