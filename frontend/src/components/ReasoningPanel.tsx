import React from "react";
import { Typography, Box, Divider, Card, CardContent, Chip, Paper } from "@mui/material";
import type { ReasoningResponse } from "../types/supplyChain";

interface ReasoningPanelProps {
  reasoning: ReasoningResponse | undefined;
}

const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ reasoning }) => {
  if (!reasoning) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Trigger a disruption and use "Get AI Reasoning" to see analysis here.
        </Typography>
      </Box>
    );
  }

  if (!reasoning.reasoning && reasoning.recommendations.length === 0) {
    return (
      <div>
        <Typography variant="h6">AI Reasoning & Recommendations</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Trigger a disruption and request AI reasoning to see recommendations here.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        AI Reasoning & Recommendations
      </Typography>
      
      {reasoning.reasoning && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">Analysis:</Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", mt: 1, mb: 2, maxHeight: 200, overflow: 'auto' }}>
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {reasoning.reasoning}
            </Typography>
          </Paper>
        </Box>
      )}

      {reasoning.recommendations.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Recommendations:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reasoning.recommendations.map((rec, index) => (
              <Card key={index} variant="outlined">
                <CardContent sx={{ pb: 1 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip 
                      label={`Option ${index + 1}`} 
                      size="small" 
                      sx={{ mr: 1, bgcolor: index === 0 ? 'primary.main' : 'grey.400', color: 'white' }} 
                    />
                    <Typography variant="subtitle2">
                      {rec.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {rec.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </div>
  );
};

export default ReasoningPanel;
