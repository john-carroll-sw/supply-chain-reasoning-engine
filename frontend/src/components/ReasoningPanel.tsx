import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, Card, CardContent, Chip, Paper } from "@mui/material";
import type { ReasoningResponse } from "../types/supplyChain";

const DEFAULT_REASONING: ReasoningResponse = {
  reasoning: `1. No active disruptions are reported, but several high-risk (risk >10%) and high-cost routes exist (f1→dc1: cost 5 000, risk 0.10; f1→dc2: 4 800, 0.12; f1→dc3 via air: 3 000, 0.09).
2. All DCs and retails currently exceed minimums, so there’s no emergency restock, but ongoing replenishment costs and risk exposures can be optimized.
3. Factory Chicago (f2) offers lower-cost, lower-risk lanes to all DCs vs. Factory Shanghai (f1):
   – f2→dc1 (air): 2 000, risk 0.08 vs f1→dc1 (ship) 5 000, 0.10
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
                      sx={{ mr: 1, bgcolor: index === 0 ? 'primary.main' : 'grey.400', color: 'grey.900', fontWeight: 600 }} 
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
