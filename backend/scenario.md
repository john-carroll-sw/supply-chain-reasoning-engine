# Supply Chain Demo Scenarios

## Get Supply Chain State

```bash
curl http://localhost:4000/api/supplychain
```

## Scenario 1: Stockout at Retail 1

- **Description:** Retail 1 has a stockout of skuA. DC 1 and DC 2 have inventory. There are multiple routes to Retail 1.
- **Disruption:**
  - Type: stockout
  - Node: r1
  - SKU: skuA
- **Expected LLM Reasoning:**
  - Detects stockout at Retail 1
  - Suggests resupplying from DC 1 or DC 2
  - Considers alternate routes if one is closed
- **Test with:**

```bash
curl -X POST http://localhost:4000/api/supplychain/disrupt \
  -H "Content-Type: application/json" \
  -d '{"type": "stockout", "nodeId": "r1", "sku": "skuA"}'

curl -X POST http://localhost:4000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"disruptionType": "stockout", "details": {"nodeId": "r1", "sku": "skuA"}}'
```

## Scenario 2: Route Closed from DC 1 to Retail 1

- **Description:** The main route from DC 1 to Retail 1 is closed. DC 2 is available as an alternate source.
- **Disruption:**
  - Type: route_closed
  - Route: r-dc1-r1
- **Expected LLM Reasoning:**
  - Detects route closure
  - Suggests rerouting via DC 2 or alternate logistics
- **Test with:**

```bash
curl -X POST http://localhost:4000/api/supplychain/disrupt \
  -H "Content-Type: application/json" \
  -d '{"type": "route_closed", "routeId": "r-dc1-r1"}'

curl -X POST http://localhost:4000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"disruptionType": "route_closed", "details": {"routeId": "r-dc1-r1"}}'
```

## Scenario 3: Both DCs Low on Inventory

- **Description:** Both DC 1 and DC 2 have low inventory. Factory 1 has plenty. Retail 1 is at risk of stockout.
- **Disruption:**
  - Type: stockout
  - Node: r1
  - SKU: skuA
- **Expected LLM Reasoning:**
  - Suggests urgent resupply from Factory 1 to DCs, then to Retail 1
  - May recommend prioritizing shipments
- **Test with:**
(Manually set DC 1 and DC 2 inventory to a low value in supplyChain.ts, then run:)

```bash
curl -X POST http://localhost:4000/api/supplychain/disrupt \
  -H "Content-Type: application/json" \
  -d '{"type": "stockout", "nodeId": "r1", "sku": "skuA"}'

curl -X POST http://localhost:4000/api/reason \
  -H "Content-Type: application/json" \
  -d '{"disruptionType": "stockout", "details": {"nodeId": "r1", "sku": "skuA"}}'
```

---

Add more scenarios as you expand the demo data and test new disruptions.
