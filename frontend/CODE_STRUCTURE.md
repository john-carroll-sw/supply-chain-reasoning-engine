# Frontend Code Structure (React + Mapbox + MUI)

src/
  App.tsx                # Main app entry point
  index.tsx              # ReactDOM render
  components/
    MapView.tsx          # Mapbox map with supply chain nodes/routes
    ControlsPanel.tsx     # UI controls for disruptions, scenario selection
    ReasoningPanel.tsx    # Shows LLM reasoning and recommendations
  api/
    supplyChainApi.ts     # API calls to backend (get state, disrupt, reason)
  types/
    supplyChain.ts        # Shared types for supply chain data
  theme/
    muiTheme.ts           # MUI theme customization
  assets/                 # Static assets (icons, etc.)
.env                      # Mapbox API key (not checked in)

## Key Frontend Build Notes

- Uses React (TypeScript) for UI
- Uses Mapbox GL JS for map visualization
- Uses Material-UI (MUI) for UI components
- .env file stores MAPBOX_API_KEY for local dev
- Follows backend API contract for supply chain state, disruptions, and reasoning
- Designed for easy scenario testing and future extensibility
