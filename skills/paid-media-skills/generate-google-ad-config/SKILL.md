---
name: generate-google-ad-config
description: >
  Generates a complete Google Ads configuration (campaign, ad groups, ads)
  from an approved campaign blueprint and brief. Produces a full GoogleLaunchConfig
  ready for review and launch on the Campaign Launch page.
---

# Generate Google Ad Config Skill

## When to Use

**CRITICAL: When the message contains `[google-launch-config-gen]`, you MUST use THIS skill — not `generate-ad-config`.** This is a Google Ads config, not Meta. You MUST emit a `google-launch-config-json` code fence, NOT `launch-config-json`.

Trigger: the message starts with `[google-launch-config-gen]` prefix.

**Do NOT use when:**
- The message contains `[launch-config-gen]` (without "google-") → use `generate-ad-config` for Meta
- The user wants to modify an existing Google config → use `refine-google-ad-config`
- No blueprint exists → tell the user to generate a blueprint first

## Input Context

You will receive:
- `<approved-blueprint>` tag containing the approved Blueprint object (JSON)
- `<campaign-brief>` tag containing the CampaignBriefData object (JSON)

## Output Schema

Return a complete Google Ads launch config:

```jsonc
{
  "campaign": {
    "name": "string — campaign name (max 100 chars)",
    "campaignType": "string — SEARCH | DISPLAY | VIDEO | PERFORMANCE_MAX",
    "dailyBudgetMicros": "number — daily budget in micros (1000000 = $1.00)",
    "biddingStrategy": "string — MAXIMIZE_CLICKS | MAXIMIZE_CONVERSIONS | TARGET_CPA | TARGET_ROAS | MANUAL_CPC",
    "targetCpaMicros": "number — optional, only for TARGET_CPA strategy (micros)",
    "targetRoas": "number — optional, only for TARGET_ROAS strategy (ratio, e.g. 4.0 = 400%)",
    "status": "PAUSED"
  },
  "adGroups": [
    {
      "localId": "string — format: local_ag_1, local_ag_2, etc.",
      "name": "string — ad group name (max 100 chars)",
      "status": "PAUSED",
      "cpcBidMicros": "number — default CPC bid in micros (1000000 = $1.00)",
      "keywords": [
        {
          "text": "string — keyword text",
          "matchType": "string — BROAD | PHRASE | EXACT"
        }
      ]
    }
  ],
  "ads": [
    {
      "localId": "string — format: local_ad_1, local_ad_2, etc.",
      "adGroupLocalId": "string — references an adGroup's localId",
      "name": "string — ad name",
      "type": "RESPONSIVE_SEARCH_AD",
      "responsiveSearchAd": {
        "headlines": ["string — up to 15 headlines, max 30 chars each"],
        "descriptions": ["string — up to 4 descriptions, max 90 chars each"],
        "finalUrls": ["string — landing page URLs"],
        "path1": "string — optional display URL path segment (max 15 chars)",
        "path2": "string — optional display URL path segment (max 15 chars)"
      },
      "status": "PAUSED"
    }
  ]
}
```

## Output Format

Wrap the JSON in a `google-launch-config-json` code fence:

````
```google-launch-config-json
{
  "campaign": { ... },
  "adGroups": [ ... ],
  "ads": [ ... ]
}
```
````

## Quality Rules

1. **Budget conversion**: Blueprint budgets are in dollars. Convert to micros by multiplying by 1,000,000. A $50 daily budget = 50000000 micros.
2. **Campaign type**: Default to SEARCH for most campaigns. Use DISPLAY for awareness-focused campaigns. Use PERFORMANCE_MAX for broad reach.
3. **Keywords**: Generate 10-20 relevant keywords per ad group. Mix match types: use EXACT for high-intent terms, PHRASE for medium, BROAD for discovery.
4. **Headlines**: Generate at least 5 headlines per ad (max 15). Each headline max 30 characters. Include the brand name in at least one headline.
5. **Descriptions**: Generate at least 2 descriptions per ad (max 4). Each description max 90 characters. Include a clear CTA.
6. **Ad groups**: Create 2-4 ad groups organized by theme or audience segment from the blueprint.
7. **Bidding**: Default to MAXIMIZE_CLICKS for traffic campaigns, MAXIMIZE_CONVERSIONS for conversion campaigns, TARGET_CPA if the brief specifies a CPA target.
8. **CPC bids**: Set reasonable default bids based on the industry. Typical range: $0.50-$5.00 (500000-5000000 micros).
9. **Status**: Always set everything to PAUSED — the user activates manually.
10. **Final URLs**: Use the landing page URL from the brief if available, otherwise use an empty string.

## Example Output

```google-launch-config-json
{
  "campaign": {
    "name": "Hilton Summer Escape — Google Search",
    "campaignType": "SEARCH",
    "dailyBudgetMicros": 50000000,
    "biddingStrategy": "MAXIMIZE_CLICKS",
    "status": "PAUSED"
  },
  "adGroups": [
    {
      "localId": "local_ag_1",
      "name": "Brand Terms",
      "status": "PAUSED",
      "cpcBidMicros": 2000000,
      "keywords": [
        { "text": "hilton hotels", "matchType": "EXACT" },
        { "text": "hilton summer deals", "matchType": "PHRASE" },
        { "text": "luxury hotel summer vacation", "matchType": "BROAD" }
      ]
    },
    {
      "localId": "local_ag_2",
      "name": "Competitor Terms",
      "status": "PAUSED",
      "cpcBidMicros": 3000000,
      "keywords": [
        { "text": "marriott alternative", "matchType": "BROAD" },
        { "text": "best luxury hotel deals", "matchType": "PHRASE" }
      ]
    }
  ],
  "ads": [
    {
      "localId": "local_ad_1",
      "adGroupLocalId": "local_ag_1",
      "name": "Brand RSA",
      "type": "RESPONSIVE_SEARCH_AD",
      "responsiveSearchAd": {
        "headlines": [
          "Hilton Summer Escape",
          "Book Your Summer Getaway",
          "Luxury Stays from $199/Night",
          "Hilton Hotels & Resorts",
          "Summer Deals — Save 25%"
        ],
        "descriptions": [
          "Escape to paradise this summer. Book a Hilton hotel and enjoy exclusive savings on luxury stays.",
          "Award-winning hospitality meets unbeatable summer rates. Reserve your room today."
        ],
        "finalUrls": ["https://www.hilton.com/summer-escape"],
        "path1": "summer",
        "path2": "deals"
      },
      "status": "PAUSED"
    }
  ]
}
```
