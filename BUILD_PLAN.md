# Azure OpenAI Supply Chain Reasoning Demo - Build Plan

## 1. Project Stack

- **Frontend:** React (TypeScript), Mapbox GL JS, Material-UI (MUI)
- **Backend:** Node.js (Express) or Python (FastAPI), Azure OpenAI SDK

## 2. Step-by-Step Build Plan

### Step 1: Project Setup

- Create `/frontend` (React app) and `/backend` (API server)
- Obtain Mapbox API key (free tier)
- Use Azure OpenAI credentials for LLM access

### Step 2: Define Demo Data & State

- Hardcode a small supply chain network (factories, DCs, retail, trucks, routes, SKUs)
- Store in backend (JSON or JS object)

### Step 3: Backend API

- Endpoint to get current system state
- Endpoint to trigger a disruption
- Endpoint to call Azure OpenAI with prompt (system state + disruption), return model’s reasoning/solutions

### Step 4: Frontend UI

- Map view: show nodes, routes, trucks, inventory status (Mapbox)
- Controls: trigger disruptions, select scenario, view model output
- Panel: show model’s reasoning, solution options, allow “approve”/“reject”

### Step 5: Azure OpenAI Integration

- Use Azure OpenAI credentials in backend
- Call o3 or o4-mini model with crafted prompt
- Return model’s response to frontend

### Step 6: Polish & Demo

- Visualize before/after routes on map
- Highlight disruptions and solutions
- Show prompt/response for transparency

## 3. What You Need

- Decide backend language: Node.js or Python
- Get Mapbox API key
- Get Azure OpenAI credentials

---

This plan will guide the build of a beautiful, functional demo for supply chain reasoning using Azure OpenAI and Mapbox.
