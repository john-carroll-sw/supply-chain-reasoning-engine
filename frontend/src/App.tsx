import React, { useState } from "react";
import { CssBaseline, Container, Box, Paper, Typography, ThemeProvider, IconButton, Collapse } from "@mui/material";
import ControlsPanel from "./components/ControlsPanel";
import ReasoningPanel from "./components/ReasoningPanel";
import NodeSummaryTable from "./components/NodeSummaryTable";
import type { ReasoningResponse } from "./types/supplyChain";
import { muiTheme } from "./theme/muiTheme";
import DisruptionsTable from "./components/DisruptionsTable";
import AzureMapRoute from "./components/AzureMapRoute";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const App: React.FC = () => {
  const [reasoningResult, setReasoningResult] = useState<ReasoningResponse | undefined>(undefined);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

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
            <Box sx={{ display: "flex", flexDirection: "row", transition: "all 0.3s ease" }}>
              <Collapse in={!isSidebarCollapsed} orientation="horizontal">
                <Paper elevation={2} sx={{
                  flex: 1.1,
                  minWidth: isSidebarCollapsed ? 0 : 340,
                  width: isSidebarCollapsed ? 0 : 'auto',
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  overflow: "auto",
                  transition: "all 0.3s ease",
                  p: 2,
                  height: '100%',
                  boxSizing: 'border-box',
                  borderRadius: '8px 0 0 8px', // Only left corners rounded
                }}>
                  <ControlsPanel onReasoningResult={handleReasoningResult} onStateChange={handleStateChange} />
                  <NodeSummaryTable />
                  <DisruptionsTable refreshKey={mapRefreshKey} />
                </Paper>
              </Collapse>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(35, 38, 47, 0.8)",
                  borderRadius: "0 8px 8px 0",
                  zIndex: 10,
                }}
              >
                <IconButton
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  sx={{ color: "white" }}
                >
                  {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </Box>
            </Box>
            {/* Main: Map and Recommendations stacked vertically */}
            <Box sx={{ flex: 2, minWidth: 700, display: "flex", flexDirection: "column", gap: 4, overflow: "auto" }}>
              {/* <Paper
                elevation={4}
                sx={{
                  minHeight: "400px",
                  p: 0,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #23262F 60%, #23262F 100%)",
                }}
              >
                <AzureMapView />
              </Paper> */}
              {/* Add the route map below for testing */}
              <Paper
                elevation={4}
                sx={{
                  minHeight: "400px",
                  height: "100%",
                  flex: 1,
                  p: 0,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #23262F 60%, #23262F 100%)",
                }}
              >
                <AzureMapRoute />
              </Paper>
              <Paper elevation={2} sx={{ p: 3, minHeight: "32vh", overflow: "auto", display: "flex", flexDirection: "column" }}>
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
