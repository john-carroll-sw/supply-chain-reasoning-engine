# Okay, here are the `curl` commands for your requests

**1. GET Request:**

```bash
curl http://localhost:4000/api/supplychain
```

* Alternatively, you can explicitly specify the GET method using `-X GET`:

    ```bash
    curl -X GET http://localhost:4000/api/supplychain
    ```

**2. POST Request with JSON body:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{ "type": "stockout", "nodeId": "r1", "sku": "skuA" }' \
  http://localhost:4000/api/supplychain/disrupt
```

**Explanation:**

* `curl`: The command-line tool.
* `-X POST`: Specifies the HTTP method as POST.
* `-H "Content-Type: application/json"`: Sets the `Content-Type` header to indicate that the request body contains JSON data. This is crucial for the server to correctly interpret the body.
* `-d '{ "type": "stockout", "nodeId": "r1", "sku": "skuA" }'`: Provides the data to be sent in the request body. The single quotes (`'`) around the JSON string are often used to prevent shell interpretation issues with the double quotes (`"`) inside the JSON.
* `http://localhost:4000/api/supplychain/disrupt`: The target URL for the POST request.
* The backslashes (`\`) are used just for line continuation in the example to make it more readable; you can write the command on a single line without them.
