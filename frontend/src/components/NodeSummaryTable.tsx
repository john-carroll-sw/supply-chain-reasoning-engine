import React, { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, TableSortLabel } from "@mui/material";
import type { SupplyChainNode, SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";
import type { Factory, DistributionCenter, Retail, InventoryRecord } from "../../../backend/src/data/supplyChainV1";

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

  // Helper to get min/max inventory for a node/sku
  const getMinMax = (node: Factory | DistributionCenter | Retail, sku: string) => {
    const inv = (node as Factory | DistributionCenter | Retail).inventory;
    if (Array.isArray(inv)) {
      const rec = inv.find((item: InventoryRecord) => item.skuId === sku);
      if (rec) return { min: rec.minInventory, max: rec.maxInventory };
    }
    return { min: undefined, max: undefined };
  };

  // Helper to get production rates/times for factories
  const getProduction = (node: Factory | DistributionCenter | Retail, sku: string) => {
    if ('productionRates' in node && 'productionTimes' in node) {
      return {
        rate: node.productionRates[sku],
        time: node.productionTimes[sku]
      };
    }
    return { rate: undefined, time: undefined };
  };

  // Helper to get demand for retails
  const getDemand = (node: Factory | DistributionCenter | Retail, sku: string) => {
    if ('demand' in node) {
      return node.demand[sku];
    }
    return undefined;
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ background: '#23262F', color: '#F4F4F4' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Node Summary
          </Typography>
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
              <TableCell sx={{ color: '#00FFD0', fontWeight: 700 }}>Location</TableCell>
              {skus.map((sku) => (
                <TableCell key={sku} sx={{ color: '#00FFD0', fontWeight: 700 }}>
                  <TableSortLabel
                    active={sortBy === `sku:${sku}`}
                    direction={sortBy === `sku:${sku}` ? sortDirection : 'asc'}
                    onClick={() => handleSort(`sku:${sku}`)}
                  >{sku}</TableSortLabel>
                </TableCell>
              ))}
              {/* Extra columns for min/max, production, demand */}
              {skus.map((sku) => (
                <TableCell key={sku + '-min'} sx={{ color: '#00FFD0', fontWeight: 700 }}>Min Inv ({sku})</TableCell>
              ))}
              {skus.map((sku) => (
                <TableCell key={sku + '-max'} sx={{ color: '#00FFD0', fontWeight: 700 }}>Max Inv ({sku})</TableCell>
              ))}
              {skus.map((sku) => (
                <TableCell key={sku + '-prod-rate'} sx={{ color: '#00FFD0', fontWeight: 700 }}>Prod Rate ({sku})</TableCell>
              ))}
              {skus.map((sku) => (
                <TableCell key={sku + '-prod-time'} sx={{ color: '#00FFD0', fontWeight: 700 }}>Prod Time ({sku})</TableCell>
              ))}
              {skus.map((sku) => (
                <TableCell key={sku + '-demand'} sx={{ color: '#00FFD0', fontWeight: 700 }}>Demand ({sku})</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell sx={{ color: '#F4F4F4' }}>{node.name}</TableCell>
                <TableCell sx={{ color: '#F4F4F4' }}>{formatNodeType(node.type)}</TableCell>
                <TableCell sx={{ color: '#F4F4F4' }}>{node.location ? `${node.location.lat.toFixed(2)}, ${node.location.lng.toFixed(2)}` : '-'}</TableCell>
                {skus.map((sku) => (
                  <TableCell key={sku} sx={{ color: '#F4F4F4' }}>{node.inventory[sku] ?? 0}</TableCell>
                ))}
                {/* Min/Max Inventory */}
                {skus.map((sku) => {
                  const { min } = getMinMax(node, sku);
                  return <TableCell key={sku + '-min'} sx={{ color: '#F4F4F4' }}>{min !== undefined ? min : '-'}</TableCell>;
                })}
                {skus.map((sku) => {
                  const { max } = getMinMax(node, sku);
                  return <TableCell key={sku + '-max'} sx={{ color: '#F4F4F4' }}>{max !== undefined ? max : '-'}</TableCell>;
                })}
                {/* Production Rates/Times (factories only) */}
                {skus.map((sku) => {
                  const { rate } = getProduction(node, sku);
                  return <TableCell key={sku + '-prod-rate'} sx={{ color: '#F4F4F4' }}>{rate !== undefined ? rate : '-'}</TableCell>;
                })}
                {skus.map((sku) => {
                  const { time } = getProduction(node, sku);
                  return <TableCell key={sku + '-prod-time'} sx={{ color: '#F4F4F4' }}>{time !== undefined ? time : '-'}</TableCell>;
                })}
                {/* Demand (retails only) */}
                {skus.map((sku) => {
                  const demand = getDemand(node, sku);
                  return <TableCell key={sku + '-demand'} sx={{ color: '#F4F4F4' }}>{demand !== undefined ? demand : '-'}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NodeSummaryTable;
