import { Request, Response } from 'express';
import { supplyChain, SupplyChainState } from '../data/supplyChain';

// Store the initial state immediately when this module is loaded
const initialSupplyChain: SupplyChainState = JSON.parse(JSON.stringify(supplyChain));

// Track closed bridges in memory
let closedBridges: string[] = [];

// GET /api/supplychain
export const getSupplyChain = (req: Request, res: Response): void => {
  res.json({ ...supplyChain, closedBridges });
};

// POST /api/supplychain/disrupt
// Example body: { type: 'stockout', nodeId: 'r1', sku: 'skuA' } or { type: 'route_closed', routeId: 'r-f1-dc1' } or { type: 'bridge_closed', bridgeId: 'oakland_bay_bridge' }
export const postDisrupt = (req: Request, res: Response): void => {
  const { type, nodeId, sku, routeId, bridgeId } = req.body;
  if (type === 'stockout' && nodeId && sku) {
    const node = supplyChain.nodes.find(n => n.id === nodeId);
    if (node) {
      node.inventory[sku] = 0;
      res.json({ status: 'ok', message: `Stockout triggered for ${sku} at ${node.name}` });
      return;
    }
    res.status(404).json({ status: 'error', message: 'Node not found' });
    return;
  }
  if (type === 'route_closed' && routeId) {
    const route = supplyChain.routes.find(r => r.id === routeId);
    if (route) {
      route.status = 'closed';
      res.json({ status: 'ok', message: `Route ${routeId} closed` });
      return;
    }
    res.status(404).json({ status: 'error', message: 'Route not found' });
    return;
  }
  if (type === 'bridge_closed' && bridgeId) {
    if (!closedBridges.includes(bridgeId)) {
      closedBridges.push(bridgeId);
    }
    res.json({ status: 'ok', message: `Bridge ${bridgeId} closed` });
    return;
  }
  res.status(400).json({ status: 'error', message: 'Invalid disruption request' });
};

// POST /api/supplychain/reset
export const resetSupplyChain = (req: Request, res: Response): void => {
  // Reset to the initial state captured when the module was first loaded
  Object.assign(supplyChain, JSON.parse(JSON.stringify(initialSupplyChain)));
  closedBridges = [];
  res.json({ status: "ok", message: "Supply chain state reset to initial demo data." });
};
