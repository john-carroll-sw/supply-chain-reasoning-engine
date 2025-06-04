# Supply Chain Reasoning Engine – V1 Scope

## V1 Demo Focus

For a V1 demo, keep the scope focused and achievable:

- **Simple, clear supply chain state:** Factories, DCs, retails, routes, and inventory.
- **Disruption detection:** E.g., stockout, route closed.
- **LLM-powered reasoning:** Given state + disruption, generate step-by-step reasoning and 3–5 actionable recommendations.
- **Basic UI:** Show state, disruptions, and recommendations (table or simple map).
- **Transport Mode:** Use airplanes for V1. Airplane routes are straight lines, easy to visualize and reason about with Azure Maps. This keeps the logic and UI simple for the demo.

## Why This Scope?

- Proves the core value: LLM can reason about disruptions and suggest smart actions.
- Provides a working demo for stakeholders, enabling feedback and rapid iteration.
- Avoids getting bogged down in simulation, optimization, and advanced features before validating the core loop.

## What’s Out of Scope for V1?

- Full digital twin or time-stepped simulation.
- Real-time data feeds.
- Advanced UI/visualization (beyond basic map/table).
- Human-in-the-loop controls.
- Reward scoring, map overlays, etc.
- Trucks, boats, or complex route logic (add in V2+).

## V2+ Roadmap

- More detailed simulation/optimization.
- Real-time data feeds.
- Advanced UI/visualization.
- Human-in-the-loop controls.
- Reward scoring, map overlays, etc.
- Add trucks, boats, and more complex transport logic.

## Summary

Your instinct is right: keep V1 focused and achievable. Use the advanced notes as a roadmap for future versions!

---

## Example V1 Demo Flow

1. **Show a simple supply chain:** Factories, DCs, retails, and direct airplane routes on Azure Maps.
2. **Trigger a disruption:** E.g., a retail stockout or an airport closure.
3. **LLM generates reasoning and recommendations:** Step-by-step logic and 3–5 actions to resolve the disruption.
4. **UI displays:**
    - Current state (nodes, inventory, routes)
    - Disruptions
    - LLM reasoning and recommendations (table or map overlay)
5. **Stakeholder feedback:** Use demo to gather feedback and iterate for V2.
