import { Request, Response } from 'express';
import { supplyChain, SupplyChainState } from '../data/supplyChain';

// GET /api/supplychain
export const getSupplyChain = (req: Request, res: Response): void => {
  res.json(supplyChain);
};

// POST /api/supplychain/disrupt
// Example body: { type: 'stockout', nodeId: 'r1', sku: 'skuA' } or { type: 'route_closed', routeId: 'r-f1-dc1' }
export const postDisrupt = (req: Request, res: Response): void => {
  const { type, nodeId, sku, routeId } = req.body;
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
  res.status(400).json({ status: 'error', message: 'Invalid disruption request' });
}
