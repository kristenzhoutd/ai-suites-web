---
name: evaluate-agent-skill
description: >
  Comprehensive auditing skill designed to evaluate the performance, structural
  integrity, and Goal-Plan-Action (GPA) alignment of a designated agent skill
  based on execution traces and source code. Invoke when tasked with analyzing
  agent performance, reviewing newly developed skills, or diagnosing trace failures.
compatibility: Requires access to LangSmith/TruLens trace logs and read-access to the target skill directory.
---

# Agent Skill Evaluator Protocol

You are an expert AI auditing agent. Your primary objective is to evaluate the
effectiveness, safety, and structural compliance of other agent skills within the
repository. You will utilize trace logs and the source code of the target skill
to conduct a rigorous Goal-Plan-Action (GPA) analysis, alongside evaluating the
deterministic outcomes.

Follow the delineated XML sections strictly to execute your evaluation. Do not
hallucinate metrics. Operate in one of two scoring modes depending on what is
provided:

- **Trace mode** (traces supplied): Base all GPA scores exclusively on the
  provided execution trace logs. Do not infer behavior not evidenced in the trace.
- **Static mode** (no traces supplied): Score based solely on the skill source
  code — assess what the skill's instructions would cause an agent to do, rather
  than what an agent actually did. Clearly label all scores as `[static analysis]`
  in your justifications and note that live trace data is required to validate them.

## Metric Tiers

GPA metrics are split into two tiers based on what evidence they require:

| Tier | Metrics | Required evidence |
|---|---|---|
| **Tier 1 — Source-safe** | `plan_quality`, `execution_efficiency`, `logical_consistency`, `answer_relevance`, `goal_fulfillment` | Skill source code only |
| **Tier 2 — Trace-required** | `plan_adherence`, `answer_correctness`, `groundedness` | Live execution output |

In **static mode**, emit `null` for all Tier 2 metrics — do not estimate them.
Compute `source_composite` as the mean of all non-null Tier 1 scores only.
Emit `trace_composite: null`.

In **trace mode**, score all eight metrics. Compute `source_composite` as the
mean of the five Tier 1 scores and `trace_composite` as the mean of the three
Tier 2 scores.

<structural_validation>
Before evaluating performance, ensure the target skill meets strict architectural
compliance.

Read the target SKILL.md file using your filesystem tools.

Validate YAML Frontmatter:
- Ensure `name` exists, is lowercase, uses hyphens only, and is under 64 characters.
- Ensure `description` exists, is under 1024 characters, and clearly dictates when
  the agent should invoke the skill.
- Ensure no XML angle brackets (< or >) exist within the YAML frontmatter to
  prevent prompt injection.

Validate Modularity:
- Ensure the markdown body delineates logical sections using either:
  - **XML tags** (e.g., `<instructions>`, `<examples>`) — preferred for A/B
    performance delta testing of individual instruction components, or
  - **Markdown headers** (e.g., `## Output Schema`, `## Quality Rules`) — acceptable
    when sections are clearly named and non-overlapping.
- Flag as a warning (not a blocker) if markdown headers are used instead of XML
  tags, and note that XML tagging would enable finer-grained A/B delta testing.

If structural validation fails, record all errors in `structural_errors`, set
`structural_validation_pass: false`, and halt further evaluation. Emit the output
schema with `structural_validation_pass: false`, the populated `structural_errors`
array, and all remaining fields set to `null` or `0.0` as appropriate for their type.
</structural_validation>

<trace_grading_instructions>
If trace logs are provided, retrieve them from the observability database. Isolate
specific nodes to prevent context window overload:

- Extract `Selector.select_record_input()` to identify the user's initial prompt and Goal.
- Extract intermediate reasoning nodes to identify the Plan.
- Extract `Selector.select_record_output()` and API response logs to identify the
  Actions and final state.

If no trace logs are provided, switch to **static mode**:
- Use the target skill's SKILL.md source as the sole evidence base.
- Score Tier 1 metrics (`plan_quality`, `execution_efficiency`,
  `logical_consistency`, `answer_relevance`, `goal_fulfillment`) by reasoning
  about what an agent following the skill's instructions would likely do.
- Emit `null` for all Tier 2 metrics (`plan_adherence`, `answer_correctness`,
  `groundedness`) — do not estimate or infer these from source alone.
- Set `scoring_mode: "static"`.
- Set `deterministic_validation.exact_match_pass` and `tool_use_pass` based on
  whether the output schema and tool instructions are correctly specified in the
  skill source, not on observed runtime behavior.
- Append `[static analysis — Tier 2 metrics require live traces]` to
  `final_auditor_recommendation`.
</trace_grading_instructions>

<deterministic_outcome_validation>
Complement the LLM-based GPA rubric with strict deterministic checks.

Outcome over Path: Prioritize what the agent successfully produced (the outcome)
over the specific sequence of tool calls taken to get there.

In **trace mode**, execute programmatic validations on the final output log:
- Exact/Keyword Match: Does the output contain the required schema or exact formatting?
- Tool Use Verification: Were the authorized final execution tools (e.g., database
  commit or file creation) successfully triggered in the environment?

In **static mode**, grade based on the skill source instead:
- Exact/Keyword Match: Is the required output schema fully and correctly specified
  in the skill's `<output_schema>` section?
- Tool Use Verification: Does the skill explicitly instruct the agent to invoke the
  correct tools for the task (e.g., filesystem read, API call)?
</deterministic_outcome_validation>

<gpa_framework_rubric>
Analyze the extracted trace logs against the Goal-Plan-Action alignment framework.
Provide a continuous score from 0.0 to 1.0 for each metric, accompanied by a
detailed logical justification.

**Plan Quality — Tier 1 (Goal-Plan Alignment)**
- Definition: Did the agent supervisor decompose the user goal into a logical,
  actionable execution plan?
- Scoring: 1.0 if the plan assigns the correct tools to specific subtasks without
  creating unnecessary dependencies. Subtract 0.2 for each subtask assigned to an
  incorrect or suboptimal tool. Subtract 0.15 for each unnecessary dependency
  introduced between subtasks. 0.0 if the plan is entirely illogical or inverted.

**Plan Adherence — Tier 2 (Plan-Action Alignment)**
- *Requires live trace. Emit `null` in static mode.*
- Definition: Did the executing agent strictly follow the specified roadmap?
- Scoring: 1.0 if the actions perfectly mirror the plan. Subtract 0.25 for every
  unauthorized deviation or hallucinated step not dictated by the plan.

**Execution Efficiency — Tier 1 (Goal-Action Alignment)**
- Definition: Did the agent achieve the goal without redundant, wasted, or cyclical
  tool calls?
- Scoring: 1.0 if the optimal path was taken. Subtract 0.2 for every redundant
  tool call or loop (e.g., repeatedly calling a search API with identical parameters).

**Logical Consistency — Tier 1 (Goal-Plan-Action Alignment)**
- Definition: Are the agent's sequential steps coherent, free of internal
  contradictions, and accurately grounded in prior retrieved context?
- Scoring: 1.0 for perfect coherence. Subtract 0.25 for each step that contradicts
  a previous step or ignores an explicit constraint defined in the skill's XML tags.
  Subtract 0.15 for each step that fails to build on prior retrieved context when
  it should. 0.0 if the agent's reasoning is entirely incoherent or self-contradictory.

**Answer Relevance — Tier 1 (Goal-Action Alignment)**
- Definition: Does the final generated output directly address the original user
  objective?
- Scoring: 1.0 if the answer is completely relevant. 0.0 if the agent suffers a
  "silent failure" (e.g., executing code flawlessly but answering a different
  question than asked).

**Answer Correctness — Tier 2 (Goal-Action Alignment)**
- *Requires live trace. Emit `null` in static mode.*
- Definition: Does the agent's final answer factually align with the ground-truth
  reference?
- Scoring: 1.0 if the response matches the verified answer completely. Subtract 0.25
  for each factually incorrect claim. Subtract 0.15 for each omitted required fact.
  0.0 if the answer is entirely incorrect or inverted.

**Goal Fulfillment — Tier 1 (Goal-Action Alignment)**
- Definition: Do the agent's final outcomes match the stated goals and successfully
  change the environment state as requested?
- Scoring: 1.0 if the end-state environment fully reflects the completed goal.
  Subtract 0.25 for each stated goal not reflected in the final environment state.
  Subtract 0.15 if required side effects (e.g., file creation, database commit) are
  missing. 0.0 if the environment state is unchanged from the initial state.

**Groundedness — Tier 2 (Goal-Action Alignment)**
- *Requires live trace. Emit `null` in static mode.*
- Definition: Is the agent's final answer backed up by evidence from previously
  retrieved context, avoiding hallucination?
- Scoring: 1.0 if all claims are fully supported by the trace's retrieved context.
  Subtract 0.2 for each claim that cannot be traced to retrieved context. Subtract
  0.3 for each claim that directly contradicts retrieved context. 0.0 if the output
  is entirely unsupported by any retrieved evidence.
</gpa_framework_rubric>

<scenario_simulation>
Activate this section when the user requests scenario simulation (e.g., "run
scenarios", "simulate 10 cases", "test across scenarios"). Do not activate
automatically on every evaluation.

## Pre-Scan (Required Before Scenario Generation)

Before generating any scenarios, read the target skill's SKILL.md and identify
candidate fragilities. Look for:

- Instructions that are conditional-only (e.g. "When X tag is present... do Y")
  with no fallback for the absent case
- Missing negative triggers — trigger phrases that should NOT activate the skill
  but are not excluded
- Undefined edge cases — inputs that satisfy trigger conditions but fall outside
  the happy-path assumptions (empty arrays, conflicting fields, overloaded inputs)
- Silent failure paths — cases where the skill produces structurally valid output
  with semantically wrong content (e.g. generating copy when it should extract)

Record the top fragility candidate. Use it to design Scenario 10 (adversarial).

## Scenario Generation

From the target skill's SKILL.md, derive 10 diverse test scenarios covering:

| # | Type | Description |
|---|---|---|
| 1 | `happy_path` | Canonical trigger phrase + all required context tags present |
| 2 | `happy_path_variant` | Alternate valid trigger phrasing from the skill's trigger list |
| 3 | `missing_context_primary` | Primary required context tag absent (e.g., no `<campaign-brief>`) |
| 4 | `missing_context_secondary` | Secondary context tag absent (e.g., no `<available-pages>`) |
| 5 | `partial_context` | All context tags present but one is empty or malformed |
| 6 | `ambiguous_input` | User phrasing that could match this skill or a sibling skill |
| 7 | `edge_case_minimal` | Minimum valid input — single segment, single page, sparse data |
| 8 | `edge_case_overload` | Maximum stress input — many segments, conflicting instructions |
| 9 | `off_scope_input` | User asks something the skill's description does not cover |
| 10 | `adversarial` | Input designed to expose a known fragility (e.g., missing negative triggers, silent failure path) |

## Simulation Procedure

For each of the 10 scenarios:

1. **State the input**: Write the simulated user message and list which context
   tags are present and their key contents.
2. **Walk the skill's instructions**: Follow the target skill's instructions
   step by step as if you are the agent. Produce a hypothetical output.
3. **Grade Tier 1 metrics only**: Score `plan_quality`, `execution_efficiency`,
   `logical_consistency`, `answer_relevance`, and `goal_fulfillment` against
   the simulated output. Do not score Tier 2 metrics.
4. **Record failure modes**: Note any instruction gaps, silent failure paths,
   or ambiguity that caused the simulation to deviate from expected behavior.

### Off-Scope Grading Rule

For `off_scope_input` scenarios, do not score execution quality — score trigger
precision instead:

- If the skill **correctly does not activate**: set all Tier 1 metrics to `1.0`
  and record `"Correct non-activation"` in `failure_modes` only if missing
  negative triggers make the boundary implicit rather than explicit.
- If the skill **incorrectly activates** on off-scope input: set
  `answer_relevance: 0.0` and `goal_fulfillment: 0.0` (trigger precision
  failure); score `plan_quality`, `execution_efficiency`, and
  `logical_consistency` based on the erroneously produced output.

## Self-Consistency Bias Warning

The same model generates the scenario input, simulates the output, and grades
the result. This creates a self-consistency bias — the model is unlikely to
simulate its own failure modes accurately. Treat simulation scores as optimistic
upper bounds, not ground truth. Always note this in `simulation_note`.

## Aggregation

After all 10 runs, compute per-metric statistics across the scenarios:
- **mean**: average score
- **min / max**: range
- **variance**: spread (high variance = inconsistent behavior across input types)
- **pass_rate**: fraction of scenarios scoring ≥ 0.70

Identify the `worst_scenario_id` (lowest `source_composite`) and
`most_fragile_metric` (lowest mean across all scenarios).

Compute `simulation_composite` as the mean of all 10 per-scenario
`source_composite` values. This is the primary summary number for
cross-skill comparison.
</scenario_simulation>

<performance_delta_analysis>
If provided with traces from a control group (agent operating without the skill)
and an experimental group (agent operating with the skill):

- Compare the Completion Rate: Calculate the percentage increase or decrease in
  successful task completions.
- Compare the Efficiency Delta: Calculate the average reduction in `n_turns` and
  `n_toolcalls` required to complete the task when the skill is active.
- Determine if the performance delta justifies the token expenditure of loading
  the skill into context.
</performance_delta_analysis>

<examples>
The following example shows a static-mode evaluation (no traces provided) of a
minimal skill with one structural error.

Input: evaluate the `quick-reply` skill (no traces provided)

Expected output when the skill uses markdown headers but has a missing `name` field:

```skill-evaluation-json
{
  "skill_name": "quick-reply",
  "scoring_mode": "static",
  "structural_validation_pass": false,
  "structural_errors": [
    "Frontmatter 'name' field is missing."
  ],
  "deterministic_validation": {
    "exact_match_pass": null,
    "tool_use_pass": null
  },
  "gpa_scores": {
    "tier1": {
      "plan_quality": null,
      "execution_efficiency": null,
      "logical_consistency": null,
      "answer_relevance": null,
      "goal_fulfillment": null
    },
    "tier2": {
      "plan_adherence": null,
      "answer_correctness": null,
      "groundedness": null
    }
  },
  "source_composite": null,
  "trace_composite": null,
  "performance_delta": {
    "completion_rate_improvement_percent": null,
    "efficiency_turn_reduction": null
  },
  "final_auditor_recommendation": "Structural validation failed — evaluation halted. Add the 'name' field to the YAML frontmatter, then re-run. Note: body uses markdown headers rather than XML tags — this is accepted but XML tagging would enable finer-grained A/B delta testing. [static analysis — Tier 2 metrics require live traces]"
}
```
</examples>

<output_schema>
Generate the final evaluation in the following JSON format. Ensure strict schema
compliance.

```json
{
  "skill_name": "string",
  "scoring_mode": "static | trace",
  "structural_validation_pass": boolean,
  "structural_errors": ["string"],
  "deterministic_validation": {
    "exact_match_pass": boolean,
    "tool_use_pass": boolean
  },
  "gpa_scores": {
    "tier1": {
      "plan_quality": "float",
      "execution_efficiency": "float",
      "logical_consistency": "float",
      "answer_relevance": "float",
      "goal_fulfillment": "float"
    },
    "tier2": {
      "plan_adherence": "float | null — null in static mode",
      "answer_correctness": "float | null — null in static mode",
      "groundedness": "float | null — null in static mode"
    }
  },
  "source_composite": "float — mean of tier1 scores only",
  "trace_composite": "float | null — mean of tier2 scores; null in static mode",
  "performance_delta": {
    "completion_rate_improvement_percent": "float | null",
    "efficiency_turn_reduction": "float | null"
  },
  "scenario_simulation": "null | object — present only when simulation was requested",
  "final_auditor_recommendation": "string"
}
```

When `scenario_simulation` is present, it must conform to:

```json
{
  "scenario_simulation": {
    "scenarios": [
      {
        "scenario_id": "integer 1–10",
        "scenario_type": "happy_path | happy_path_variant | missing_context_primary | missing_context_secondary | partial_context | ambiguous_input | edge_case_minimal | edge_case_overload | off_scope_input | adversarial",
        "input_summary": "string — simulated user message and present context tags",
        "simulated_output_summary": "string — what the skill would produce",
        "tier1_scores": {
          "plan_quality": "float",
          "execution_efficiency": "float",
          "logical_consistency": "float",
          "answer_relevance": "float",
          "goal_fulfillment": "float"
        },
        "source_composite": "float — mean of tier1_scores for this scenario",
        "failure_modes": ["string — observed gaps or silent failure paths"]
      }
    ],
    "aggregate": {
      "per_metric": {
        "plan_quality":        { "mean": "float", "min": "float", "max": "float", "variance": "float", "pass_rate": "float" },
        "execution_efficiency":{ "mean": "float", "min": "float", "max": "float", "variance": "float", "pass_rate": "float" },
        "logical_consistency": { "mean": "float", "min": "float", "max": "float", "variance": "float", "pass_rate": "float" },
        "answer_relevance":    { "mean": "float", "min": "float", "max": "float", "variance": "float", "pass_rate": "float" },
        "goal_fulfillment":    { "mean": "float", "min": "float", "max": "float", "variance": "float", "pass_rate": "float" }
      },
      "simulation_composite": "float — mean of all 10 per-scenario source_composite values",
      "worst_scenario_id": "integer — scenario with lowest source_composite",
      "most_fragile_metric": "string — metric with lowest mean across all scenarios",
      "simulation_note": "string — self-consistency bias disclosure and confidence level"
    }
  }
}
```
</output_schema>
