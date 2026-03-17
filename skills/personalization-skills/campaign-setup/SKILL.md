---
name: campaign-setup
description: >
  Creates or updates campaign setup fields (name, objective, goal, KPI, dates) on the
  Campaign Setup wizard page. Triggered by [page-context:campaign-setup]. Returns partial
  JSON updates for merging into the wizard form. Use when the user asks to create a new
  campaign, change setup fields, or set dates/goals/KPIs while on the setup page.
---

# Campaign Setup Skill

## When to Use

Activate this skill when the user is on the Campaign Setup page (Step 1) and
asks to create, refine, or change any campaign setup field. The page context
`[page-context:campaign-setup]` will be present in every message from this page.

## Input Context

You will receive:
- `<current-setup>` — JSON of the current field values (name, objective, businessGoal, goalType, startDate, endDate, primaryKpi, secondaryKpis)
- The user's message describing what they want to create or change

## Behavior Rules

1. **Clarify before changing**: If the user's request is ambiguous or could be interpreted multiple ways, ask a clarifying question INSTEAD of emitting JSON. For example:
   - "Make it better" → Ask: "Which aspect would you like to improve — the objective, business goal, or KPIs?"
   - "Update the dates" → Ask: "What start and end dates would you like?"

2. **Full campaign creation**: When the user describes a new campaign (e.g. "create a 2026 sneaker campaign for Nike"), populate ALL fields with sensible values derived from the request.

3. **Targeted edits**: When the user asks to change specific fields (e.g. "change the goal to retention"), only include those fields in the output. Preserve all other fields by omitting them.

4. **Awareness of current values**: Always check `<current-setup>` before responding.
   - If user didn't mention a field and it already has a good value, omit it from the output
   - If user explicitly requests a change, honor it even if the current value is good

## Output Schema

Return a JSON object with **only the fields that should be updated**. Omit fields
that should remain unchanged.

```jsonc
{
  "name": "string — campaign name (optional)",
  "objective": "string — campaign objective (optional)",
  "businessGoal": "string — business goal (optional)",
  "goalType": "conversion|engagement|retention|revenue|awareness (optional)",
  "startDate": "YYYY-MM-DD (optional)",
  "endDate": "YYYY-MM-DD (optional)",
  "primaryKpi": "string — primary KPI metric (optional)",
  "secondaryKpis": ["string array — secondary KPIs (optional)"]
}
```

## Output Format

Wrap the JSON in a `campaign-setup-json` code fence:

````
```campaign-setup-json
{
  "name": "Nike Air Max 2026 Launch Campaign",
  "objective": "Drive awareness and pre-orders for the Nike Air Max 2026 line among sneaker enthusiasts aged 18-35",
  "businessGoal": "Increase pre-order conversion rate by 25%",
  "goalType": "conversion",
  "startDate": "2026-03-01",
  "endDate": "2026-04-30",
  "primaryKpi": "Pre-order conversion rate",
  "secondaryKpis": ["Page views", "Add-to-cart rate", "Email sign-ups"]
}
```
````

## Quality Rules

1. Only include fields that are being changed
2. Keep objectives specific and measurable
3. Ensure goalType is one of: conversion, engagement, retention, revenue, awareness
4. KPIs should align with the business goal
5. Dates must be in YYYY-MM-DD format
6. When creating a full campaign, derive ALL fields from the user's description — don't leave any empty
7. When unsure what the user wants, ASK — don't guess

## Examples

### Example 1: Full Campaign Creation

**User message:**
> Create a 2026 sneaker campaign for Nike

**Current setup:** (empty)

**Expected output:**

```campaign-setup-json
{
  "name": "Nike Air Max 2026 Launch Campaign",
  "objective": "Drive awareness and pre-orders for the Nike Air Max 2026 line among sneaker enthusiasts aged 18-35",
  "businessGoal": "Increase pre-order conversion rate by 25%",
  "goalType": "conversion",
  "startDate": "2026-03-01",
  "endDate": "2026-04-30",
  "primaryKpi": "Pre-order conversion rate",
  "secondaryKpis": ["Page views", "Add-to-cart rate", "Email sign-ups"]
}
```

### Example 2: Partial Field Update

**User message:**
> Change the business goal to focus on retention

**Current setup:**
```json
{
  "name": "Nike Air Max 2026 Launch Campaign",
  "objective": "Drive awareness and pre-orders",
  "businessGoal": "Increase pre-order conversion rate by 25%",
  "goalType": "conversion",
  "startDate": "2026-03-01",
  "endDate": "2026-04-30",
  "primaryKpi": "Pre-order conversion rate",
  "secondaryKpis": ["Page views"]
}
```

**Expected output:**

```campaign-setup-json
{
  "businessGoal": "Improve customer retention and repeat purchase rate",
  "goalType": "retention",
  "primaryKpi": "Customer Lifetime Value (CLV)",
  "secondaryKpis": ["Repeat purchase rate", "Customer retention rate"]
}
```

### Example 3: Clarification Needed

**User message:**
> Update the dates

**Current setup:**
```json
{
  "name": "Summer Sale Campaign",
  "startDate": "2026-06-01",
  "endDate": "2026-08-31"
}
```

**Expected response:**
> What start and end dates would you like for the campaign?

(No JSON output — ask for clarification instead)
