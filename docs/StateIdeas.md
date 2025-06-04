# Ideas on State

All time can be in "units" so we can adjust scale from seconds,minutes,hours, days,weeks, etc.

```markdown
*   **State:**
    *   id
    *   timestamp
*   **SKU:**
    *   id
    *   price
    *   cost to produce
*   **Factory:**
    *   id
    *   Skus produced/day or /hour
    *   location (x,y)
    *   time to produce sku (This factory may be set up to produce SkuA faster?)
*   **DC:**
    *   id
    *   skus in inventory
    *   sku minInventory
    *   sku maxInventory
    *   location (x,y)
*   **Retail:**
    *   id
    *   skus in inventory
    *   SkuDemand
        *   Amount of each sku in demand right now (outbound, minus inventory)
    *   skus minInventory
    *   skus maxInventory
*   **Trucks:**
    *   id
    *   skus on board
    *   maxLoad
    *   location(x,y)
    *   currentDestination (retail or DC)
        *   When no store demand is below levels restock DC (or prioritize DC in some cases)
*   **Things the reasoning agent can adjust:**
    *   Where each truck is going with current load
    *   Route of the trucks
    *   What the factory should be producing (baked goods so short shelf life?)
*   **Optimization:**
    *   Maximize Profit
    *   or could be reduce out of stock events (customer sat)
    *   or a mix of 90% profit focus and 10% out of stock, etc.
```
