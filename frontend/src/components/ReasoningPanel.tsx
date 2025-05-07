import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, Card, CardContent, Chip, Paper } from "@mui/material";
import type { ReasoningResponse } from "../types/supplyChain";

const DEFAULT_REASONING: ReasoningResponse = {
  reasoning: `1. No active disruptions are reported, but several high-risk (risk >10%) and high-cost routes exist (f1→dc1: cost 5 000, risk 0.10; f1→dc2: 4 800, 0.12; f1→dc3 via air: 3 000, 0.09).
2. All DCs and retails currently exceed minimums, so there’s no emergency restock, but ongoing replenishment costs and risk exposures can be optimized.
3. Factory Chicago (f2) offers lower-cost, lower-risk lanes to all DCs vs. Factory Shanghai (f1):
   – f2→dc1 (air): 2 000, risk 0.08 vs f1→dc1 (ship) 5 000, 0.10
   – f2→dc2 (ship) 2 500, 0.11 vs f1→dc2 (ship) 4 800, 0.12
   – f2→dc3 (truck) 1 000, 0.07 vs f1→dc3 (air) 3 000, 0.09
4. Shifting DC replenishment to f2 reduces unit transport cost by 40–67% and lowers risk.
5. Several routes still carry >10% risk (r-dc1-dc2 0.13, r-dc2-dc3 0.15). Without buffers, a single delay could trigger expensive expedited shipments.
6. Idle assets (ship s1, multiple planes) can be redeployed to absorb peak or urgent volumes and avoid rush-mode premium rates.
7. Current reorder logic (trigger at minInventory) risks stock falling low before resupply arrives; moving to a mid-point reorder elevates service and avoids costly air-freight rushes.
`,
  recommendations: [
    {
      title: "Reallocate DC replenishment to Factory Chicago (f2)",
      description: "For all regular SKU flows to DC1, DC2, and DC3, switch sourcing from Shanghai (f1) to Chicago (f2). This reduces transport cost by 40–67% per shipment (e.g. f2→dc3 truck 1 000 vs f1→dc3 air 3 000) and lowers route risk. Update your ERP routing rules accordingly."
    },
    {
      title: "Establish safety-stock buffers at high-risk DC pairs",
      description: "For routes with risk >10% (dc1→dc2, dc2→dc3), increase safety stock by 20–30% above minInventory. This buffer covers 1–2 weeks of demand and prevents rush air-freight costs if a shipment is delayed."
    },
    {
      title: "Shift reorder points to mid-inventory levels",
      description: "Rather than triggering replenishment at the minInventory threshold, set reorder points at 50–60% of maxInventory. This ensures shipments are placed earlier, leveraging cheaper sea/truck modes and avoiding expedited transport surcharges."
    },
    {
      title: "Consolidate multi-SKU shipments and cross-dock at DC1",
      description: "Combine smaller SKUA/SKUB/C shipments destined for Berlin and Paris into weekly full-truckloads from DC1. Cross-dock at Rotterdam to minimize per-unit last-mile costs (truck cost 200–220 per leg) and reduce handling fees."
    },
    {
      title: "Redeploy idle transport assets for peak or urgent flow",
      description: "Assign ship s1 to execute monthly full-sea voyages from Shanghai to Rotterdam when f1 surplus warrants, and designate one idle airplane (e.g. a3 in Europe) as a hot-spare for last-mile urgencies. This avoids premium ad-hoc charter rates."
    }
  ]
};

interface ReasoningPanelProps {
  reasoning?: ReasoningResponse;
  isInitialState?: boolean;
  error?: string | null;
}

const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ reasoning, isInitialState = false, error = null }) => {
  const [displayReasoning, setDisplayReasoning] = useState<ReasoningResponse | undefined>(undefined);

  useEffect(() => {
    if (error) {
      setDisplayReasoning(undefined);
      return;
    }
    if (isInitialState) {
      setDisplayReasoning(DEFAULT_REASONING);
    } else if (reasoning && (reasoning.reasoning || reasoning.recommendations.length > 0)) {
      setDisplayReasoning(reasoning);
    } else {
      setDisplayReasoning(undefined);
    }
  }, [reasoning, isInitialState, error]);

  if (error) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="error" sx={{ fontStyle: 'italic' }}>
          Error getting AI reasoning: {error}
        </Typography>
      </Box>
    );
  }

  if (!displayReasoning) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Trigger a disruption and use "Get AI Reasoning" to see analysis here.
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        AI Reasoning & Recommendations
      </Typography>
      {displayReasoning.reasoning && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">Analysis:</Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50", mt: 1, mb: 2, maxHeight: 200, overflow: 'auto' }}>
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {displayReasoning.reasoning}
            </Typography>
          </Paper>
        </Box>
      )}
      {displayReasoning.recommendations.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Recommendations:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {displayReasoning.recommendations.map((rec, index) => (
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
