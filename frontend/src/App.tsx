import React, { useState } from "react";
import { CssBaseline, Container, Box, Paper, Typography, ThemeProvider } from "@mui/material";
import AzureMapView from "./components/AzureMapView";
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
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            pt: 6,
            height: "calc(100vh - 40px)",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            m: 0,
            p: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "primary.main", mb: 4 }}>
            Supply Chain Reasoning Demo
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 1, gap: 4, overflow: "hidden" }}>
            {/* Sidebar: Controls and Tables */}
            <Box sx={{ flex: 1.1, minWidth: 340, display: "flex", flexDirection: "column", gap: 3, overflow: "auto" }}>
              <ControlsPanel onReasoningResult={handleReasoningResult} onStateChange={handleStateChange} />
              <Paper elevation={2} sx={{ p: 2 }}>
                <NodeSummaryTable />
              </Paper>
              <Paper elevation={2} sx={{ p: 2 }}>
                <DisruptionsTable refreshKey={mapRefreshKey} />
              </Paper>
            </Box>
            {/* Main: Map and Recommendations stacked vertically */}
            <Box sx={{ flex: 2, minWidth: 700, display: "flex", flexDirection: "column", gap: 4, overflow: "auto" }}>
              <Paper
                elevation={4}
                sx={{
                  minHeight: "400px",
                  p: 0,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #23262F 60%, #23262F 100%)",
                }}
              >
                <AzureMapView />
              </Paper>
              <Paper elevation={2} sx={{ p: 3, minHeight: '32vh', overflow: "auto", display: 'flex', flexDirection: 'column' }}>
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
