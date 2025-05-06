// Next-generation supply chain data model for enterprise-scale simulation
// Inspired by StateIdeas.md, Rewards.md, and Rewards system requirements

export type NodeType = 'factory' | 'distribution_center' | 'retail';

export interface SKU {
  id: string;
  name: string;
  price: number;
  costToProduce: number;
}

export interface InventoryRecord {
  skuId: string;
  quantity: number;
  minInventory?: number;
  maxInventory?: number;
}

export interface Factory {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  productionRates: Record<string, number>; // skuId -> units per time unit
  productionTimes: Record<string, number>; // skuId -> time to produce one unit
  inventory: InventoryRecord[];
}

export interface DistributionCenter {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  inventory: InventoryRecord[];
}

export interface Retail {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  inventory: InventoryRecord[];
  demand: Record<string, number>; // skuId -> demand per time unit
}

export interface Truck {
  id: string;
  location: { lat: number; lng: number };
  maxLoad: number;
  cargo: InventoryRecord[];
  currentDestination?: string; // node id
  status: 'idle' | 'enroute' | 'loading' | 'unloading';
}

export interface Ship {
  id: string;
  location: { lat: number; lng: number };
  maxLoad: number;
  cargo: InventoryRecord[];
  currentDestination?: string; // node id or port
  status: 'idle' | 'enroute' | 'loading' | 'unloading';
}

export interface Airplane {
  id: string;
  location: { lat: number; lng: number };
  maxLoad: number;
  cargo: InventoryRecord[];
  currentDestination?: string; // node id or airport
  status: 'idle' | 'enroute' | 'loading' | 'unloading';
}

export interface Route {
  id: string;
  from: string; // node id
  to: string;   // node id
  distance: number; // in km
  expectedTravelTime: number; // in time units
  cost: number; // per trip
  status: 'open' | 'closed' | 'delayed';
  risk?: number; // 0-1 risk factor
}

export interface Order {
  id: string;
  from: string; // node id
  to: string;   // node id
  skuId: string;
  quantity: number;
  dueTime: number; // timestamp or time unit
}

export interface SupplyChainEvent {
  id: string;
  type: 'stockout' | 'route_closed' | 'bridge_closed' | 'order' | 'production' | 'shipment' | 'custom';
  timestamp: number;
  details: Record<string, any>;
}

export interface SupplyChainState {
  id: string;
  timestamp: number;
  skus: SKU[];
  factories: Factory[];
  distributionCenters: DistributionCenter[];
  retails: Retail[];
  trucks: Truck[];
  ships: Ship[];
  airplanes: Airplane[];
  routes: Route[];
  orders: Order[];
  events: SupplyChainEvent[];
  // Add more as needed for assets, ships, planes, etc.
}

// Example: Initial empty state (populate as needed)
export const supplyChainNext: SupplyChainState = {
  id: 'scn-001',
  timestamp: Date.now(),
  skus: [],
  factories: [],
  distributionCenters: [],
  retails: [],
  trucks: [],
  ships: [],
  airplanes: [],
  routes: [],
  orders: [],
  events: [],
};
