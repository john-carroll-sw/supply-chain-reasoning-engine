import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'azure-maps-control/dist/atlas.min.css' // Required for Azure Maps markers, popups, controls
import App from './App.tsx'
import { SupplyChainProvider } from "./contexts/SupplyChainContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupplyChainProvider>
      <App />
    </SupplyChainProvider>
  </StrictMode>,
)
