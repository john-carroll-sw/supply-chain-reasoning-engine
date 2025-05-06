import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, TableSortLabel, Tooltip, IconButton } from "@mui/material";
import type { SupplyChainNode, SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";
import SortIcon from '@mui/icons-material/Sort';

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

interface NodeSummaryTableProps {
  refreshKey: number;
}

const NodeSummaryTable: React.FC<NodeSummaryTableProps> = ({ refreshKey }) => {
  const [nodes, setNodes] = useState<SupplyChainNode[]>([]);
  const [skus, setSkus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
  }, [refreshKey]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedNodes = [...nodes].sort((a, b) => {
    let aValue: string | number = a[sortBy as keyof SupplyChainNode] as string | number;
    let bValue: string | number = b[sortBy as keyof SupplyChainNode] as string | number;
    if (sortBy.startsWith('sku:')) {
      const sku = sortBy.replace('sku:', '');
      aValue = a.inventory[sku] ?? 0;
      bValue = b.inventory[sku] ?? 0;
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Box>
      <TableContainer component={Paper} sx={{ background: '#23262F', color: '#F4F4F4' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Node Summary
          </Typography>
          <Tooltip title={`Sort: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}>
            <IconButton onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
              <SortIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#00FFD0', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortBy === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >Name</TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: '#00FFD0', fontWeight: 700 }}>
                <TableSortLabel
                  active={sortBy === 'type'}
                  direction={sortBy === 'type' ? sortDirection : 'asc'}
                  onClick={() => handleSort('type')}
                >Type</TableSortLabel>
              </TableCell>
              {skus.map((sku) => (
                <TableCell key={sku} sx={{ color: '#00FFD0', fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === `sku:${sku}`}
                    direction={sortBy === `sku:${sku}` ? sortDirection : 'asc'}
                    onClick={() => handleSort(`sku:${sku}`)}
                  >{sku}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNodes.map((node) => (
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
