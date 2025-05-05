import React from "react";
import { CssBaseline, Container, Box, Paper, Typography } from "@mui/material";
import MapView from "./components/MapView";
import ControlsPanel from "./components/ControlsPanel";
import ReasoningPanel from "./components/ReasoningPanel";

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Supply Chain Reasoning Demo
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(66.666% - 8px)' } }}>
            <Paper elevation={3} sx={{ height: "70vh", p: 1 }}>
              <MapView />
            </Paper>
          </Box>
          <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(33.333% - 8px)' } }}>
            <Box mb={2}>
              <ControlsPanel />
            </Box>
            <Paper elevation={2} sx={{ p: 2, minHeight: "30vh" }}>
              <ReasoningPanel />
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default App;
