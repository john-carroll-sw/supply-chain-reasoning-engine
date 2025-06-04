# Supply Chain Reasoning Engine

![Demo](demo.gif)

> **Tip:**  
> This project is a work in progress and serves as a Proof-of-Concept for AI-powered supply chain reasoning and control. It is not intended for production use, but as a foundation for experimentation and further development.

## Overview

The Supply Chain Reasoning Engine is an AI-powered Supply Chain Digital Twin & Control Tower focused on **resilience and real-time adaptation**. This Proof-of-Concept leverages advanced reasoning models, simulation, and optimization tools to proactively manage and respond to disruptions in supply chain operations.

**Key Features:**

- Real-time disruption detection and response
- Simulation of physical goods flow and "what-if" scenarios
- AI-driven reasoning for creative, context-aware solutions
- Optimization module for actionable, cost-effective plans
- Interactive UI for visualization, alerts, and human-in-the-loop decisions

## Architecture

- **Data Layer:** Defines the system state (nodes, network, assets, inventory, orders, constraints, real-time events).
- **Simulation Engine:** Projects future states and evaluates the impact of planned actions.
- **Disruption Detection:** Monitors internal and external data feeds for impactful events.
- **Reasoning Engine:** Assesses disruptions, generates strategic responses, and sets constraints for optimization.
- **Optimization Module:** Calculates detailed, actionable plans using mathematical techniques.
- **User Interface:** Visualizes the system state, solutions, and allows user interaction.

For a detailed breakdown, see [docs/supplychain.md](docs/supplychain.md).

## Example Workflow

1. **Detect:** System receives an alert (e.g., stockout at a retail outlet).
2. **Reason:** AI proposes strategies (reroute, expedite, source from alternate locations).
3. **Optimize:** Module calculates costs, ETAs, and impacts for each strategy.
4. **Visualize:** UI displays options and highlights disruptions.
5. **Act:** User approves a solution; system updates plans and monitors execution.

## Getting Started

**Quickest Start:**

- Use the VS Code `Launch App` compound runner (from `.vscode/launch.json`) after running `npm install` in both the `frontend` and `backend` directories.

**Manual Start:**

1. In both `frontend` and `backend` directories, run:
   - `npm install`
   - `npm run dev`

2. **Backend:** See [backend/README.md](backend/README.md) for API details.
3. **Frontend:** See [frontend/README.md](frontend/README.md) for UI usage.
4. **Docs:** Explore the `docs/` directory for architecture, design notes, and future plans.

## Azure Services Used

The application leverages the following Azure services:

1. **Azure OpenAI Service** – For LLM-powered responses and reasoning
2. **Azure Maps** – For geospatial visualization and mapping

## License

[MIT License](LICENSE)

## Next Steps

- Define MVP scope and data sources
- Select technology stack for simulation, optimization, and UI
- Build and iterate on the core detection-reasoning-optimization loop

---

This project combines the creative power of reasoning models with the precision of simulation and optimization to deliver a truly adaptive supply chain management system.
