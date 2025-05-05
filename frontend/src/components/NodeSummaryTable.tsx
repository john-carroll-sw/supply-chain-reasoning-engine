import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";
import type { SupplyChainNode, SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";

const formatNodeType = (type: string): string => {
  switch (type) {
    case "factory":
      return "Factory";
    case "distribution_center":
      return "Distribution Center";
    case "retail":
      return "Retail";
    default:
      return type;
  }
};

const NodeSummaryTable: React.FC = () => {
  const [nodes, setNodes] = useState<SupplyChainNode[]>([]);
  const [skus, setSkus] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const state: SupplyChainState = await getSupplyChainState();
      setNodes(state.nodes);
      // Collect all unique SKUs
      const skuSet = new Set<string>();
      state.nodes.forEach(node => {
        Object.keys(node.inventory).forEach(sku => skuSet.add(sku));
      });
      setSkus(Array.from(skuSet));
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Node Summary Table
      </Typography>
      <TableContainer component={Paper} sx={{ background: '#23262F', color: '#F4F4F4' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#00FFD0', fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ color: '#00FFD0', fontWeight: 700 }}>Type</TableCell>
              {skus.map((sku) => (
                <TableCell key={sku} sx={{ color: '#00FFD0', fontWeight: 700 }}>{sku}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell sx={{ color: '#F4F4F4' }}>{node.name}</TableCell>
                <TableCell sx={{ color: '#F4F4F4' }}>{formatNodeType(node.type)}</TableCell>
                {skus.map((sku) => (
                  <TableCell key={sku} sx={{ color: '#F4F4F4' }}>{node.inventory[sku] ?? 0}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NodeSummaryTable;
