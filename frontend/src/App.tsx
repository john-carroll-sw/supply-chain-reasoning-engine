import React from "react";
import { CssBaseline, Container, Box, Grid, Paper, Typography } from "@mui/material";
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ height: "70vh", p: 1 }}>
              <MapView />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mb={2}>
              <ControlsPanel />
            </Box>
            <Paper elevation={2} sx={{ p: 2, minHeight: "30vh" }}>
              <ReasoningPanel />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
