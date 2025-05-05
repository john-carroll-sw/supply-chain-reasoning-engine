import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip } from "@mui/material";
import type { SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";

interface DisruptionsTableProps {
  refreshKey: number;
}

interface Disruption {
  type: "Stockout" | "Route Closed";
  node: string;
  sku: string;
  details: string;
}

const DisruptionsTable: React.FC<DisruptionsTableProps> = ({ refreshKey }) => {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);

  useEffect(() => {
    const fetchDisruptions = async () => {
      const state: SupplyChainState = await getSupplyChainState();
      const disruptionList: Disruption[] = [];
      // Stockouts
      state.nodes.forEach(node => {
        Object.entries(node.inventory).forEach(([sku, qty]) => {
          if (qty === 0) {
            disruptionList.push({
              type: "Stockout",
              node: node.name,
              sku,
              details: `No inventory for ${sku} at ${node.name}`
            });
          }
        });
      });
      // Closed routes
      state.routes.forEach(route => {
        if (route.status === "closed") {
          const fromNode = state.nodes.find(n => n.id === route.from)?.name || route.from;
          const toNode = state.nodes.find(n => n.id === route.to)?.name || route.to;
          disruptionList.push({
            type: "Route Closed",
            node: `${fromNode} → ${toNode}`,
            sku: "-",
            details: `Route from ${fromNode} to ${toNode} is closed`
          });
        }
      });
      setDisruptions(disruptionList);
    };
    fetchDisruptions();
  }, [refreshKey]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Disruptions
      </Typography>
      <TableContainer component={Paper} sx={{ background: '#23262F', color: '#F4F4F4' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>Node/Route</TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>SKU</TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disruptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ color: '#B0B3B8', fontStyle: 'italic' }}>
                  No active disruptions.
                </TableCell>
              </TableRow>
            ) : (
              disruptions.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip label={d.type} color={d.type === "Stockout" ? "secondary" : "primary"} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: '#F4F4F4' }}>{d.node}</TableCell>
                  <TableCell sx={{ color: '#F4F4F4' }}>{d.sku}</TableCell>
                  <TableCell sx={{ color: '#F4F4F4' }}>{d.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DisruptionsTable;
