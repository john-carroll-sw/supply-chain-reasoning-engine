import React, { useState } from "react";
import { CssBaseline, Container, Box, Paper, Typography, ThemeProvider } from "@mui/material";
import MapView from "./components/MapView";
import ControlsPanel from "./components/ControlsPanel";
import ReasoningPanel from "./components/ReasoningPanel";
import NodeSummaryTable from "./components/NodeSummaryTable";
import type { ReasoningResponse } from "./types/supplyChain";
import { muiTheme } from "./theme/muiTheme";
import DisruptionsTable from "./components/DisruptionsTable";

const App: React.FC = () => {
  const [reasoningResult, setReasoningResult] = useState<ReasoningResponse | undefined>(undefined);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);

  const handleReasoningResult = (result: ReasoningResponse | undefined) => {
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
            <Box sx={{ flex: 2, minWidth: 700 }}>
              <Paper
                elevation={4}
                sx={{
                  height: "60vh",
                  p: 0,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #23262F 60%, #23262F 100%)",
                }}
              >
                <MapView key={mapRefreshKey} />
              </Paper>
              <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
                <NodeSummaryTable />
              </Paper>
              <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
                <DisruptionsTable refreshKey={mapRefreshKey} />
              </Paper>
            </Box>
            <Box sx={{ flex: 1.5, minWidth: 420, display: "flex", flexDirection: "column", gap: 3, height: '80vh' }}>
              <ControlsPanel onReasoningResult={handleReasoningResult} onStateChange={handleStateChange} />
              <Paper elevation={2} sx={{ p: 3, flex: 1, minHeight: '40vh', maxHeight: '100%', overflow: "auto", display: 'flex', flexDirection: 'column' }}>
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
