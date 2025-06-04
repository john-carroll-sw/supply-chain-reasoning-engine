# Reward System for Supply Chain Reasoning

This reward system is designed to guide the reasoning model (e.g., o4-mini, o3) to generate and rank recommendations for supply chain disruptions and optimizations. The model should consider a multitude of factors, each with tunable weights, to produce the top 5 actionable recommendations, ranked by total reward score. If a recommendation can be visualized on the map, it should be.

## Reward Variables (Factors)

- **SKU Value:** Profit or revenue per unit of each SKU
- **Transport Cost:** Cost per mile/km for each mode (truck, boat, etc.)
- **Cargo Capacity:** Maximum load per truck/boat/plane
- **Opportunity Cost:** Estimated loss from stockouts, delays, or missed sales
- **Inventory Holding Cost:** Cost to store inventory at each node (factory, DC, retail)
- **Lead Time:** Time to deliver from source to destination
- **Service Level Penalty:** Penalty for not meeting customer demand or SLAs
- **Route Risk:** Risk factor for each route (e.g., weather, congestion, disruption)
- **Asset Utilization:** Efficiency of truck/boat/plane usage (minimize empty runs)
- **Sustainability Score:** Emissions, fuel usage, or other ESG factors
- **Flexibility/Resilience:** Ability to reroute or recover from disruptions
- **Canal/Bridge/Route Status:** Penalty for using closed or high-risk routes (e.g., Suez Canal, Panama Canal, Oakland Bay Bridge)

## Reward Calculation (Weighted Sum)

For each candidate action or plan, calculate a total reward score as a weighted sum:

``` text
Reward =
  (w1 * SKU_Value)
+ (w2 * -Transport_Cost)
+ (w3 * -Opportunity_Cost)
+ (w4 * -Inventory_Holding_Cost)
+ (w5 * -Lead_Time)
+ (w6 * -Service_Level_Penalty)
+ (w7 * -Route_Risk)
+ (w8 * Asset_Utilization)
+ (w9 * -Sustainability_Score)
+ (w10 * Flexibility/Resilience)
+ (w11 * -Closed_Route_Penalty)
```

- **w1-w11:** Tunable weights to prioritize business goals (e.g., profit, speed, resilience, sustainability).

## Recommendation Output

- The model should generate and **rank the top 5 recommendations** based on the reward score.
- Each recommendation should include:
  - **Action:** (e.g., reroute via alternate DC, expedite by air, split shipment)
  - **Expected Reward Score**
  - **Key Factors:** (what made this option optimal)
  - **Map Visualization:** (if possible, show on map)

## Example Use Cases

- Maximize profit and service level, minimize cost and risk.
- Respond to disruptions (e.g., closed canal, bridge, or stockout) by evaluating alternatives and scoring them.
- Present the top 5 ranked options to the user, with reasoning and map overlays.

---

*This reward system enables the LLM to reason about trade-offs and generate ranked, weighted recommendations for real-time supply chain decision-making.*
