# Additional Campaign Brief Examples

These examples were removed from the main SKILL.md to meet the 500-line limit,
but are preserved here as reference material for progressive disclosure if needed.

## Example: Retention Campaign

**User message:**
> I want to improve retention for lapsed customers with a free shipping offer via email and web

**Expected output:**

```campaign-brief-json
{
  "overview": {
    "campaignName": "Customer Winback Web Personalization Campaign",
    "objective": "Re-engage lapsed customers through personalized free shipping offers across email and web channels.",
    "businessGoal": "Improve Customer Retention",
    "timelineStart": "2026-03-01",
    "timelineEnd": "2026-03-21"
  },
  "audience": {
    "primaryAudience": "Lapsed Customers",
    "segments": ["Lapsed Customers"],
    "recommendedAudiences": [
      { "name": "Lapsed Customers", "description": "Previously active customers with no purchases in 90+ days", "status": "new", "estimatedSize": "~60K", "isSelected": true }
    ]
  },
  "experience": {
    "headline": "We Miss You — Free Shipping Inside",
    "bodyMessage": "Come back and enjoy free shipping on your next order. Your favorites are waiting.",
    "ctaText": "Shop Now",
    "segmentMessages": [
      {
        "segmentName": "Lapsed Customers",
        "messages": [
          { "headline": "We Miss You — Here's Free Shipping", "bodyMessage": "It's been a while! Come back and enjoy complimentary shipping on your next order.", "ctaText": "Return & Save" },
          { "headline": "A Lot Has Changed Since You Left", "bodyMessage": "Check out our newest arrivals and rediscover why you loved shopping with us.", "ctaText": "See What's New" }
        ]
      }
    ]
  },
  "measurement": {
    "primaryKpi": "Customer Lifetime Value (CLV)",
    "secondaryKpis": ["Reactivation Rate", "Repeat Purchase Rate"],
    "secondaryMetrics": ["Email Open Rate", "Click-Through Rate", "Time on Site"],
    "successCriteria": ["+10% reactivation rate for lapsed segment", "+5% repeat purchase rate within 30 days"],
    "risks": ["Low email deliverability for dormant accounts", "Audience too small for statistical significance"]
  }
}
```

## Example: Minimal Input

**User message:**
> Build a summer sale campaign

**Expected output:**

```campaign-brief-json
{
  "overview": {
    "campaignName": "Summer Sale Web Personalization Campaign",
    "objective": "Drive personalized summer shopping experiences to boost seasonal sales and engagement.",
    "businessGoal": "Increase Conversion Rate",
    "timelineStart": "2026-06-01",
    "timelineEnd": "2026-08-31"
  },
  "audience": {
    "primaryAudience": "New Visitors",
    "segments": ["New Visitors", "Returning Customers", "Loyal Members"],
    "recommendedAudiences": [
      { "name": "New Visitors", "description": "First-time site visitors with no purchase history", "status": "new", "estimatedSize": "~150K", "isSelected": true },
      { "name": "Returning Customers", "description": "Customers with 2+ purchases in the last 90 days", "status": "new", "estimatedSize": "~90K", "isSelected": true },
      { "name": "Loyal Members", "description": "Loyalty program members with high repeat purchase rate", "status": "new", "estimatedSize": "~40K", "isSelected": true }
    ]
  },
  "experience": {
    "headline": "Summer Deals Made for You",
    "bodyMessage": "Discover personalized offers and hand-picked recommendations for the season.",
    "ctaText": "Shop Now",
    "segmentMessages": [
      {
        "segmentName": "New Visitors",
        "messages": [
          { "headline": "Welcome — Summer Savings Start Here", "bodyMessage": "Explore our top summer picks, handpicked for first-time shoppers.", "ctaText": "Start Exploring" },
          { "headline": "New Here? Enjoy 10% Off", "bodyMessage": "Sign up and save on your first summer order with an exclusive welcome discount.", "ctaText": "Claim Offer" }
        ]
      },
      {
        "segmentName": "Returning Customers",
        "messages": [
          { "headline": "Welcome Back — Summer Arrivals Await", "bodyMessage": "We've added fresh summer picks since your last visit. See what's new.", "ctaText": "See What's New" },
          { "headline": "Your Summer Favorites Are Back", "bodyMessage": "Based on your history, we've curated summer deals you'll love.", "ctaText": "Continue Shopping" }
        ]
      },
      {
        "segmentName": "Loyal Members",
        "messages": [
          { "headline": "Members-Only Summer Preview", "bodyMessage": "Get exclusive early access to our summer collection before everyone else.", "ctaText": "Shop Exclusives" },
          { "headline": "Double Points This Summer", "bodyMessage": "Earn 2x loyalty points on all summer purchases. Your rewards, amplified.", "ctaText": "Shop & Earn" }
        ]
      }
    ]
  },
  "measurement": {
    "primaryKpi": "Conversion Rate (CR)",
    "secondaryKpis": ["Average Order Value", "Revenue per Visitor"],
    "secondaryMetrics": ["Bounce Rate", "Time on Site", "Pages per Session"],
    "successCriteria": ["+15% conversion rate vs control", "+10% average order value"],
    "risks": ["Low traffic during early summer", "Creative fatigue from extended campaign duration", "Audience overlap between segments"]
  }
}
```
