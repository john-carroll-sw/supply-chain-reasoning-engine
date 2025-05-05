import React from "react";
import { Paper, Typography } from "@mui/material";

const ControlsPanel: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6">Controls</Typography>
      {/* TODO: Add disruption/scenario controls here */}
      <Typography variant="body2" color="text.secondary">
        (Controls for disruptions and scenario selection will appear here.)
      </Typography>
    </Paper>
  );
};

export default ControlsPanel;
