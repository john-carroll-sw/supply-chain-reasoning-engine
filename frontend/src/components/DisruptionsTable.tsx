import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip, TableSortLabel, IconButton, Tooltip } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import type { SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";

interface DisruptionsTableProps {
  refreshKey: number;
}

interface Disruption {
  type: "Stockout" | "Route Closed" | "Bridge Closed";
  node: string;
  sku: string;
  details: string;
}

const DisruptionsTable: React.FC<DisruptionsTableProps> = ({ refreshKey }) => {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [sortBy, setSortBy] = useState<keyof Disruption>('type');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
      // Closed bridges
      if (state.closedBridges && state.closedBridges.length > 0) {
        state.closedBridges.forEach(bridgeId => {
          let bridgeName = bridgeId;
          if (bridgeId === "oakland_bay_bridge") bridgeName = "Oakland Bay Bridge";
          disruptionList.push({
            type: "Bridge Closed",
            node: bridgeName,
            sku: "-",
            details: `${bridgeName} is closed, routes will be redirected`
          });
        });
      }
      setDisruptions(disruptionList);
    };
    fetchDisruptions();
  }, [refreshKey]);

  // Sort disruptions
  const sortedDisruptions = [...disruptions].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    if (a[sortBy] < b[sortBy]) return -1 * dir;
    if (a[sortBy] > b[sortBy]) return 1 * dir;
    return 0;
  });

  const handleSort = (column: keyof Disruption) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Active Disruptions
        </Typography>
        <Tooltip title={`Sort: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}> 
          <IconButton onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
            <SortIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper} sx={{ background: '#23262F', color: '#F4F4F4' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'type'}
                  direction={sortBy === 'type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('type')}
                >Type</TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'node'}
                  direction={sortBy === 'node' ? sortDirection : 'asc'}
                  onClick={() => handleSort('node')}
                >Node/Route</TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'sku'}
                  direction={sortBy === 'sku' ? sortDirection : 'asc'}
                  onClick={() => handleSort('sku')}
                >SKU</TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#FF61A6', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'details'}
                  direction={sortBy === 'details' ? sortDirection : 'asc'}
                  onClick={() => handleSort('details')}
                >Details</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDisruptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ color: '#B0B3B8', fontStyle: 'italic' }}>
                  No active disruptions.
                </TableCell>
              </TableRow>
            ) : (
              sortedDisruptions.map((d, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip label={d.type} color={d.type === "Stockout" ? "secondary" : d.type === "Bridge Closed" ? "warning" : "primary"} size="small" />
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
