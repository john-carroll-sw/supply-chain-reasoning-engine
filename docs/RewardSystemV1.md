# Reward System for V1 – Supply Chain Reasoning Engine

Including a basic reward system in V1 enhances the demo and user experience by letting users see how different optimization priorities affect the LLM's recommendations.

## Simplified V1 Approach

For V1, implement a simplified reward system with 3-4 key factors:

1. **Cost Efficiency** (transport costs vs. value of goods)
2. **Time Efficiency** (lead times, urgency)
3. **Service Level** (preventing/resolving stockouts)
4. **Risk Minimization** (route reliability)

## Implementation Strategy

### 1. In the UI

- Add an "Optimization Priority" selector (radio buttons or dropdown)
- Let users choose which factor to prioritize (e.g., "Prioritize Cost", "Prioritize Speed", etc.)

### 2. In the Backend

- Pass the selected optimization priority to your LLM prompt
- The prompt should instruct the LLM to weigh the chosen factor more heavily

### 3. In the LLM Prompt

``` text
...existing system prompt...
The user has prioritized [SELECTED_PRIORITY]. 
When generating recommendations, give significant weight to optimizing for [SELECTED_PRIORITY].
```

## Azure Maps Integration

- For cost optimization: Show cheaper routes even if longer
- For time optimization: Show fastest routes regardless of cost
- For service level: Focus on getting inventory to stockout locations
- For risk minimization: Show most reliable routes

## Why This Works for V1

1. **Maintains simplicity:** No complex math or simulation required
2. **Demonstrates value:** Shows how priorities affect decision-making
3. **Uses LLM strengths:** The LLM can naturally reason about different optimization priorities
4. **Creates engagement:** Gives users a way to interact beyond just viewing

This approach lets you incorporate the reward system concept without implementing the full mathematical model from Rewards.md (which is more appropriate for V2+).

---

*Revisit this file as you iterate and expand the reward system in future versions.*
