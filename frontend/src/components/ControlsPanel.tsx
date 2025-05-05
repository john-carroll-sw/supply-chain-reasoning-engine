import React, { useState, useEffect } from "react";
import { 
  Paper, Typography, FormControl, InputLabel, MenuItem,
  Select, Button, Box, FormHelperText, CircularProgress,
  Alert, Snackbar
} from "@mui/material";
import type { SupplyChainState, DisruptionRequest, ReasoningResponse } from "../types/supplyChain";
import { getSupplyChainState, triggerDisruption, getReasoning, resetSupplyChain as resetSupplyChainApi } from "../api/supplyChainApi";

interface ControlsPanelProps {
  onReasoningResult?: (result: ReasoningResponse | undefined) => void;
  onStateChange?: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ onReasoningResult, onStateChange }) => {
  const [supplyChain, setSupplyChain] = useState<SupplyChainState | null>(null);
  const [disruptionType, setDisruptionType] = useState<string>("");
  const [nodeId, setNodeId] = useState<string>("");
  const [routeId, setRouteId] = useState<string>("");
  const [sku, setSku] = useState<string>("skuA");
  const [bridgeId, setBridgeId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reasoningLoading, setReasoningLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success" | "error"}>({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupplyChainState();
        setSupplyChain(data);
      } catch (err) {
        console.error("Error fetching supply chain data:", err);
      }
    };

    fetchData();
  }, []);

  // Reset secondary fields when disruption type changes
  useEffect(() => {
    if (disruptionType === "stockout") {
      setRouteId("");
      setBridgeId("");
    } else if (disruptionType === "route_closed") {
      setNodeId("");
      setSku("");
      setBridgeId("");
    } else if (disruptionType === "bridge_closed") {
      setNodeId("");
      setSku("");
      setRouteId("");
    }
  }, [disruptionType]);

  const handleTriggerDisruption = async () => {
    if (!disruptionType) {
      setSnackbar({
        open: true,
        message: "Please select a disruption type",
        severity: "error"
      });
      return;
    }

    const disruption: DisruptionRequest = {
      type: disruptionType as "stockout" | "route_closed" | "bridge_closed",
      nodeId: disruptionType === "stockout" ? nodeId : undefined,
      sku: disruptionType === "stockout" ? sku : undefined,
      routeId: disruptionType === "route_closed" ? routeId : undefined,
      bridgeId: disruptionType === "bridge_closed" ? bridgeId : undefined,
    };

    try {
      setLoading(true);
      const result = await triggerDisruption(disruption);
      setSnackbar({
        open: true,
        message: result.message || "Disruption triggered successfully",
        severity: "success"
      });
      
      // Refresh supply chain state
      const updatedData = await getSupplyChainState();
      setSupplyChain(updatedData);
      if (onStateChange) onStateChange();
    } catch (error) {
      console.error("Error triggering disruption:", error);
      setSnackbar({
        open: true,
        message: "Failed to trigger disruption",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetReasoning = async () => {
    if (!disruptionType) {
      setSnackbar({
        open: true,
        message: "Please select a disruption type",
        severity: "error"
      });
      return;
    }

    try {
      setReasoningLoading(true);
      const details: Record<string, string | number | undefined> = {};
      
      if (disruptionType === "stockout") {
        details.nodeId = nodeId;
        details.sku = sku;
      } else if (disruptionType === "route_closed") {
        details.routeId = routeId;
      } else if (disruptionType === "bridge_closed") {
        details.bridgeId = bridgeId;
      }

      const result = await getReasoning({
        disruptionType,
        details
      });

      // Pass reasoning result to parent component
      if (onReasoningResult) {
        onReasoningResult(result.data);
      }

      setSnackbar({
        open: true,
        message: "AI reasoning generated successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error getting reasoning:", error);
      setSnackbar({
        open: true,
        message: "Failed to generate AI reasoning",
        severity: "error"
      });
    } finally {
      setReasoningLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await resetSupplyChainApi();
      setSnackbar({
        open: true,
        message: "Demo state reset to initial values.",
        severity: "success"
      });
      if (onStateChange) onStateChange();
      // Optionally, also clear reasoning panel
      if (onReasoningResult) onReasoningResult(undefined);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to reset demo state.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Supply Chain Controls
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Disruption Type</InputLabel>
        <Select
          value={disruptionType}
          onChange={(e) => setDisruptionType(e.target.value)}
          label="Disruption Type"
        >
          <MenuItem value="stockout">Stockout</MenuItem>
          <MenuItem value="route_closed">Route Closed</MenuItem>
          <MenuItem value="bridge_closed">Bridge Closed</MenuItem>
        </Select>
        <FormHelperText>Select the type of disruption to simulate</FormHelperText>
      </FormControl>

      {disruptionType === "stockout" && (
        <>
          <FormControl fullWidth margin="normal">
            <InputLabel>Node</InputLabel>
            <Select
              value={nodeId}
              onChange={(e) => setNodeId(e.target.value)}
              label="Node"
            >
              {supplyChain?.nodes
                .filter(node => node.type === "retail")
                .map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>SKU</InputLabel>
            <Select
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              label="SKU"
            >
              <MenuItem value="skuA">SKU A</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      {disruptionType === "route_closed" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Route</InputLabel>
          <Select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            label="Route"
          >
            {supplyChain?.routes.map((route) => {
              const fromNode = supplyChain.nodes.find(n => n.id === route.from)?.name;
              const toNode = supplyChain.nodes.find(n => n.id === route.to)?.name;
              return (
                <MenuItem key={route.id} value={route.id}>
                  {fromNode} → {toNode}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      {disruptionType === "bridge_closed" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Bridge</InputLabel>
          <Select
            value={bridgeId}
            onChange={(e) => setBridgeId(e.target.value)}
            label="Bridge"
          >
            <MenuItem value="oakland_bay_bridge">Oakland Bay Bridge</MenuItem>
          </Select>
        </FormControl>
      )}

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleTriggerDisruption}
          disabled={loading || !disruptionType || (disruptionType === "stockout" && (!nodeId || !sku)) || (disruptionType === "route_closed" && !routeId) || (disruptionType === "bridge_closed" && !bridgeId)}
        >
          {loading ? <CircularProgress size={24} /> : "Trigger Disruption"}
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleGetReasoning}
          disabled={reasoningLoading || !disruptionType || (disruptionType === "stockout" && (!nodeId || !sku)) || (disruptionType === "route_closed" && !routeId) || (disruptionType === "bridge_closed" && !bridgeId)}
        >
          {reasoningLoading ? <CircularProgress size={24} /> : "Get AI Reasoning"}
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={handleReset}
          disabled={loading || reasoningLoading}
        >
          Reset Demo State
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ControlsPanel;
