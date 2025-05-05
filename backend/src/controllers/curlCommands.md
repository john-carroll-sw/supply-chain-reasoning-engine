# API Test Commands

## Get Supply Chain State

```bash
curl http://localhost:4000/api/supplychain
```

## Trigger a Stockout Disruption

```bash
curl -X POST http://localhost:4000/api/supplychain/disrupt \
  -H "Content-Type: application/json" \
  -d '{"type": "stockout", "nodeId": "r1", "sku": "skuA"}'
```

## Trigger a Route Closed Disruption

```bash
curl -X POST http://localhost:4000/api/supplychain/disrupt \
  -H "Content-Type: application/json" \
  -d '{"type": "route_closed", "routeId": "r-dc1-r1"}'
```

## Get AI Reasoning for a Stockout

```bash
curl -X POST http://localhost:4000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"disruptionType": "stockout", "details": {"nodeId": "r1", "sku": "skuA"}}'
```

## Get AI Reasoning for a Route Closure

```bash
curl -X POST http://localhost:4000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"disruptionType": "route_closed", "details": {"routeId": "r-dc1-r1"}}'
```
