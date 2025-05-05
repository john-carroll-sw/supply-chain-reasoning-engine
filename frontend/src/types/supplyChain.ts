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
  closedBridges?: string[];
}

export interface DisruptionRequest {
  type: 'stockout' | 'route_closed' | 'bridge_closed';
  nodeId?: string;
  sku?: string;
  routeId?: string;
  bridgeId?: string;
}

export interface ReasoningRequest {
  disruptionType: string;
  details: Record<string, string | number | undefined>;
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface ReasoningResponse {
  reasoning: string;
  recommendations: Recommendation[];
}