import React, { useState } from "react";
import { CssBaseline, Container, Box, Paper, Typography, ThemeProvider } from "@mui/material";
import MapView from "./components/MapView";
import ControlsPanel from "./components/ControlsPanel";
import ReasoningPanel from "./components/ReasoningPanel";
import type { ReasoningResponse } from "./types/supplyChain";
import { muiTheme } from "./theme/muiTheme";

const App: React.FC = () => {
  const [reasoningResult, setReasoningResult] = useState<ReasoningResponse | undefined>(undefined);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  const handleReasoningResult = (result: ReasoningResponse) => {
    setReasoningResult(result);
  };

  const handleStateChange = () => {
    setMapRefreshKey((k) => k + 1);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(120deg, #181A20 0%, #23262F 100%)",
          fontFamily: muiTheme.typography.fontFamily,
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "primary.main", mb: 4 }}>
            Supply Chain Reasoning Demo
          </Typography>
          <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
            <Paper
              elevation={4}
              sx={{
                flex: 2,
                height: "80vh",
                p: 0,
                overflow: "hidden",
                minWidth: 700,
                background: "linear-gradient(135deg, #23262F 60%, #23262F 100%)",
              }}
            >
              <MapView key={mapRefreshKey} />
            </Paper>
            <Box sx={{ flex: 1, minWidth: 380, display: "flex", flexDirection: "column", gap: 3 }}>
              <ControlsPanel onReasoningResult={handleReasoningResult} onStateChange={handleStateChange} />
              <Paper elevation={2} sx={{ p: 3, minHeight: "32vh", maxHeight: "40vh", overflow: "auto" }}>
                <ReasoningPanel reasoning={reasoningResult} />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
