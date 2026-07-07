// Domain 1 Flashcards
export const d1Flashcards = [
  { q: "In the agentic loop, which stop_reason value means 'execute tools and continue', and which means 'terminate'?", a: "tool_use (continue) · end_turn (terminate)" },
  { q: "After a tool executes, its results must be appended back to the conversation under which message role?", a: "user (user-role message)" },
  { q: "Do subagents inherit the coordinator's context?", a: "No. Subagents start with a blank, isolated context. Pass everything they need explicitly in the prompt." },
  { q: "How do you spawn subagents in parallel?", a: "Emit multiple Task tool calls in a single coordinator response — not across separate turns." },
  { q: "Shared memory, Global state, Inherited conversation — what is the ONLY channel for passing context to a subagent?", a: "The prompt" },
  { q: "How do you handle an outgoing tool call to block it or enforce compliance BEFORE it runs (e.g. block a refund over $500)?", a: "Use PreToolUse hook" },
  { q: "How do you transform tool results — such as normalizing timestamps to ISO-8601 — before the model ever sees them?", a: "Use PostToolUse hook" },
  { q: "Which session feature branches independently from a shared baseline so you can explore divergent approaches without cross-pollution?", a: "fork_session" },
];

// Domain 2 Flashcards
export const d2Flashcards = [
  { q: "What is the PRIMARY mechanism for tool selection?", a: "The tool description. Include input formats, example queries, edge cases, and 'use this vs. that' boundaries." },
  { q: "tool_choice: auto vs. any vs. forced?", a: "auto = text or tool; any = must call some tool; {type:tool,name} = specific tool must run first." },
  { q: "Grep vs. Glob?", a: "Grep = content search (inside files). Glob = file-path pattern matching (**/*.test.tsx)." },
  { q: "Access failure vs. valid empty result?", a: "Access failure = isError:true (couldn't check). Empty = isError:false, results:[] (checked, found none). Never collapse failure into empty." },
  { q: "Optimal number of tools per agent?", a: "4–5. Selection accuracy degrades rapidly past that; distribute the rest across specialized subagents." },
  { q: "MCP resources vs. tools?", a: "Tools = actions the model calls. Resources = content catalogs for visibility that reduce exploratory calls." },
  { q: "When is Bash the wrong tool?", a: "Whenever a built-in exists: Read not cat, Grep not grep -r, Glob not find. Bash only for things with no built-in." },
  { q: "Edit vs Write on existing files?", a: "Write replaces the ENTIRE file (content lost). Edit makes targeted changes preserving the rest." },
];

// Domain 3 Flashcards
export const d3Flashcards = [
  { q: "Teammate not getting your Claude Code instructions?", a: "They're in user scope (~/.claude/), not shared. Move to project scope (.claude/CLAUDE.md, committed)." },
  { q: "Convention for files scattered across directories?", a: ".claude/rules/ with YAML paths: globs. Directory CLAUDE.md can't follow scattered files." },
  { q: "What does context: fork do in SKILL.md?", a: "Runs the skill in an isolated sub-agent context so verbose output doesn't pollute the main conversation." },
  { q: "How to run Claude Code in CI without hanging?", a: "-p/--print (non-interactive) + --output-format json + --json-schema." },
  { q: "Simple prompt template in main session. Complex tasks with forked sessions and restricted tools. When to use - Command / Skill?", a: "Command = simple prompt template in main session. Skill = Complex tasks with forked sessions and restricted tools." },
  { q: "CLAUDE.md precedence when layers conflict?", a: "NO strict precedence — all files concatenated. Conflicts resolve arbitrarily. Use settings.json or hooks for enforcement." },
  { q: "Why does self-review fail in CI?", a: "Reviewer retains generator's reasoning → confirmation bias. Use a separate fresh session." },
  { q: "For multi-file, complex architecture OR Simple, well-scoped, obvious fixes - Plan mode vs. Direct execution?", a: "Plan mode for multi-file, complex architecture. Direct execution for simple, well-scoped, obvious fixes." },
];

// Domain 4 Flashcards
export const d4Flashcards = [
  { q: "What does a JSON schema guarantee — and not?", a: "Guarantees valid syntax/shape. Does NOT guarantee semantics (correct values). Pair with validation." },
  { q: "How to stop model fabricating absent values?", a: "Make fields nullable so it returns null instead of inventing. Retries don't fix absent info." },
  { q: "Key limits of Message Batches API?", a: "~50% cheaper, up to 24h, no SLA, no multi-turn tool calling. Correlate by custom_id (order not guaranteed)." },
  { q: "Independent review vs. self-review?", a: "Model keeps its generation reasoning → confirms its own decisions. Fresh instance evaluates cleanly." },
  { q: "How many few-shot examples?", a: "2–4 sweet spot. The 0→2 jump dominates. Beyond 4 returns diminish while cost grows." },
  { q: "What is 'alert fatigue'?", a: "Over-flagging → devs ignore ALL flags. Fix with measurable categorical criteria, not 'be thorough.'" },
  { q: "What must a retry message contain?", a: "Original prompt + failed output + SPECIFIC validation error with expected format. Not generic 'try again.'" },
  { q: "When is Batch API appropriate?", a: "Overnight reports, bulk extraction, non-urgent. NOT for blocking pre-merge checks or real-time tasks." },
];

// Domain 5 Flashcards
export const d5Flashcards = [
  { q: "Where do facts get lost?", a: "In progressive summarization and the middle of long inputs. Keep persistent case-facts block at start/end." },
  { q: "Conflicting stats from two sources?", a: "Annotate the conflict with attribution and dates — never arbitrarily pick one. Temporal difference ≠ contradiction." },
  { q: "What is 'lost in the middle' effect?", a: "Models recall beginning and end far better than the middle. Put key facts at start/end; section-header the middle." },
  { q: "How to fight context degradation?", a: "Scratchpad files, /compact, subagent delegation, crash-recovery manifests, position-aware ordering." },
  { q: "Why can 97% accuracy be unsafe?", a: "Masks weak segments (e.g. 70% on one doc type). Track stratified per-document-type metrics." },
  { q: "How to resolve conflicting subagent data?", a: "By provenance: verified > extracted > inferred > estimated. Log the conflict. Never average or pick arbitrarily." },
  { q: "Valid escalation triggers?", a: "Explicit human request, policy gap, capability limit, business threshold. NEVER sentiment or self-confidence." },
  { q: "Three error-propagation anti-patterns?", a: "Generic statuses, silently suppressing errors (empty-as-success), terminating whole workflow on one failure." },
];
