import React from "react";
import { Typography } from "@mui/material";

const ReasoningPanel: React.FC = () => {
  return (
    <div>
      <Typography variant="h6">AI Reasoning & Recommendations</Typography>
      {/* TODO: Display LLM output here */}
      <Typography variant="body2" color="text.secondary">
        (LLM reasoning and recommendations will appear here.)
      </Typography>
    </div>
  );
};

export default ReasoningPanel;
