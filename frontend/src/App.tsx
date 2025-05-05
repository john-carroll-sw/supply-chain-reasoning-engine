import React, { useState } from "react";
import { CssBaseline, Container, Box, Paper, Typography } from "@mui/material";
import MapView from "./components/MapView";
import ControlsPanel from "./components/ControlsPanel";
import ReasoningPanel from "./components/ReasoningPanel";
import type { ReasoningResponse } from "./types/supplyChain";

const App: React.FC = () => {
  const [reasoningResult, setReasoningResult] = useState<ReasoningResponse | undefined>(undefined);

  // Handle reasoning results from ControlsPanel
  const handleReasoningResult = (result: ReasoningResponse) => {
    setReasoningResult(result);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Supply Chain Reasoning Demo
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(66% - 8px)' } }}>
            <Paper elevation={3} sx={{ height: "70vh", p: 1 }}>
              <MapView />
            </Paper>
          </Box>
          <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(33% - 8px)' }, display: 'flex', flexDirection: 'column' }}>
            <Box mb={2}>
              <ControlsPanel onReasoningResult={handleReasoningResult} />
            </Box>
            <Paper elevation={2} sx={{ p: 2, minHeight: "30vh", maxHeight: "50vh", overflow: "auto", flexGrow: 1 }}>
              <ReasoningPanel reasoning={reasoningResult} />
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default App;
