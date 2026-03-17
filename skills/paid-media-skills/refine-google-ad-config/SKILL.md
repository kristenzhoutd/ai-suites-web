---
name: refine-google-ad-config
description: >
  Refines an existing Google Ads launch configuration based on user feedback.
  Emits partial updates that modify, add, or remove specific items in the
  campaign hierarchy without regenerating the entire config.
---

# Refine Google Ad Config Skill

## When to Use

Activate this skill when the user has an existing Google Ads launch configuration
and wants to modify it through chat. Trigger phrases include:

- "Change the daily budget to $100"
- "Add another ad group for competitor terms"
- "Add more headlines"
- "Remove the broad match keywords"
- "Change bidding to Target CPA at $15"
- "Add a keyword for summer deals"
- Any request to modify the current Google launch config

**Do NOT use when:**
- No Google launch config exists → use `generate-google-ad-config` first
- The user wants Meta ads → use `refine-ad-config`
- The user wants to regenerate from scratch → use `generate-google-ad-config`

## Input Context

You will receive:
- `<current-google-launch-config>` tag containing the current GoogleLaunchConfig (JSON)
- User's modification request in natural language

## Output Schema

Return a partial update object. Only include fields that are changing.
For arrays (adGroups, ads), each item must include an `operation` field:

```jsonc
{
  "campaign": {
    // Only fields that are changing
    "dailyBudgetMicros": 100000000,
    "biddingStrategy": "TARGET_CPA",
    "targetCpaMicros": 15000000
  },
  "adGroups": [
    {
      "operation": "update",
      "localId": "local_ag_1",
      "cpcBidMicros": 3000000
    },
    {
      "operation": "add",
      "name": "New Ad Group",
      "status": "PAUSED",
      "cpcBidMicros": 2500000,
      "keywords": [
        { "text": "new keyword", "matchType": "PHRASE" }
      ]
    },
    {
      "operation": "remove",
      "localId": "local_ag_2"
    }
  ],
  "ads": [
    {
      "operation": "update",
      "localId": "local_ad_1",
      "responsiveSearchAd": {
        "headlines": ["Updated Headline 1", "New Headline 2"]
      }
    }
  ]
}
```

## Output Format

Wrap the JSON in a `google-launch-config-update-json` code fence:

````
```google-launch-config-update-json
{
  "campaign": { ... },
  "adGroups": [ ... ],
  "ads": [ ... ]
}
```
````

## Quality Rules

1. Only include fields that are changing — omit unchanged fields
2. For `add` operations, include all required fields for the new item
3. For `update` operations, include `localId` and only the changed fields
4. For `remove` operations, only include `localId`
5. When removing an ad group, also remove any ads that reference it
6. Budget values are always in micros (multiply dollars by 1,000,000)
7. Keep headlines under 30 chars and descriptions under 90 chars
8. Assign `localId` for new items using format: `local_ag_N` or `local_ad_N` with a timestamp
