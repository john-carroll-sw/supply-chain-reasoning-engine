// Demo supply chain data structure
export type NodeType = 'factory' | 'distribution_center' | 'retail';
export interface SupplyChainNode {
  id: string;
  name: string;
  type: NodeType;
  inventory: Record<string, number>; // SKU -> quantity
  location: { lat: number; lng: number };
}

export interface SupplyChainRoute {
  id: string;
  from: string; // node id
  to: string;   // node id
  status: 'open' | 'closed';
}

export interface SupplyChainState {
  nodes: SupplyChainNode[];
  routes: SupplyChainRoute[];
}

// Initial demo data
export let supplyChain: SupplyChainState = {
  nodes: [
    { id: 'f1', name: 'Factory 1', type: 'factory', inventory: { skuA: 1000 }, location: { lat: 37.78, lng: -122.41 } },
    { id: 'dc1', name: 'DC 1', type: 'distribution_center', inventory: { skuA: 500 }, location: { lat: 37.80, lng: -122.27 } },
    { id: 'dc2', name: 'DC 2', type: 'distribution_center', inventory: { skuA: 200 }, location: { lat: 37.85, lng: -122.30 } },
    { id: 'r1', name: 'Retail 1', type: 'retail', inventory: { skuA: 0 }, location: { lat: 37.77, lng: -122.42 } },
    { id: 'r2', name: 'Retail 2', type: 'retail', inventory: { skuA: 50 }, location: { lat: 37.76, lng: -122.45 } },
  ],
  routes: [
    { id: 'r-f1-dc1', from: 'f1', to: 'dc1', status: 'open' },
    { id: 'r-f1-dc2', from: 'f1', to: 'dc2', status: 'open' },
    { id: 'r-dc1-r1', from: 'dc1', to: 'r1', status: 'open' },
    { id: 'r-dc2-r1', from: 'dc2', to: 'r1', status: 'open' },
    { id: 'r-dc1-r2', from: 'dc1', to: 'r2', status: 'open' },
    { id: 'r-dc2-r2', from: 'dc2', to: 'r2', status: 'open' },
  ],
};
