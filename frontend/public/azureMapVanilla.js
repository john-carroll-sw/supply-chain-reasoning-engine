// azureMapVanilla.js
// Global map variable to enable resize operations
var map;

// This function will be called by the React container after the SDK is loaded
window.initAzureMap = async function(container) {
  if (!window.atlas) {
    console.error('Azure Maps SDK not loaded');
    return;
  }

  // Get API key from window context (injected by React)
  const apiKey = window.AZURE_MAPS_KEY || '';
  
  // Fetch supply chain nodes from backend
  let nodes = [];
  try {
    // Use the correct API endpoint based on your backend setup
    const res = await fetch('http://localhost:4000/api/supplychain');
    const data = await res.json();
    nodes = data.nodes || [];
    console.log('Supply chain data loaded:', nodes.length, 'nodes');
  } catch (err) {
    console.error('Failed to fetch supply chain state:', err);
    // Continue with empty nodes - the map will still render
  }

  // Initialize the map with Azure Maps best practices for authentication
  map = new atlas.Map(container, {
    center: [0, 20],
    zoom: 1.5,
    view: 'Auto',
    style: 'grayscale_light',
    authOptions: {
      authType: atlas.AuthenticationType.subscriptionKey,
      subscriptionKey: apiKey
    },
    renderOptions: {
      preserveDrawingBuffer: true,
      forcedColorSchemeAware: true
    }
  });

  map.events.add('ready', function() {
    console.log('Azure Map is ready');
    
    // Add map controls to the bottom-right
    map.controls.add([
      new atlas.control.ZoomControl({ position: 'bottom-right' }),
      new atlas.control.CompassControl({ position: 'bottom-right' }),
      new atlas.control.PitchControl({ position: 'bottom-right' }),
      new atlas.control.StyleControl({ position: 'bottom-right' }),
      new atlas.control.FullscreenControl({ position: 'bottom-right' })
    ]);
    
    // Create a data source for supply chain nodes
    var datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    // Add node features
    if (nodes.length > 0) {
      var features = nodes.map(function(node) {
        return new atlas.data.Feature(
          new atlas.data.Point([node.location.lng, node.location.lat]), 
          {
            id: node.id,
            name: node.name,
            type: node.type,
            inventory: node.inventory
          }
        );
      });
      
      datasource.add(features);
      
      // Add a symbol layer for nodes with appropriate icon based on node type
      var symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
        iconOptions: { 
          allowOverlap: true,
          image: [
            'case',
            ['==', ['get', 'type'], 'factory'], 'marker-blue',
            ['==', ['get', 'type'], 'distribution_center'], 'marker-red',
            'marker-darkblue'  // default for retail
          ]
        },
        textOptions: {
          textField: ['get', 'name'],
          offset: [0, 1.2],
          color: '#222',
          haloColor: '#fff',
          haloWidth: 1
        }
      });
      map.layers.add(symbolLayer);

      // Create popup
      var popup = new atlas.Popup({
        pixelOffset: [0, -18],
        closeButton: true
      });

      // Close popup when clicking elsewhere on the map
      map.events.add('mousemove', function() {
        popup.close();
      });

      // Show popup on hover over symbol
      map.events.add('mousemove', symbolLayer, function(e) {
        if (e.shapes && e.shapes.length > 0) {
          var shape = e.shapes[0];
          
          // Only proceed if the shape is an atlas.Shape
          if (shape instanceof atlas.Shape) {
            var props = shape.getProperties();
            var position = shape.getCoordinates();
            
            // Format inventory for display
            var inventoryHtml = '';
            if (props.inventory) {
              inventoryHtml = Object.entries(props.inventory)
                .map(function(entry) { 
                  return '<li>' + entry[0] + ': ' + entry[1] + '</li>'; 
                })
                .join('');
            }
            
            // Format node type for display
            var nodeType = props.type === 'factory' ? 'Factory' :
                          props.type === 'distribution_center' ? 'Distribution Center' :
                          props.type === 'retail' ? 'Retail' : props.type;
            
            popup.setOptions({
              content: '<div class="map-popup">' +
                        '<div class="map-popup-title">' + props.name + '</div>' +
                        '<div class="map-popup-detail">Type: ' + nodeType + '</div>' +
                        '<div class="map-popup-detail"><b>Inventory:</b></div>' +
                        '<ul class="map-popup-detail" style="margin:0;padding-left:18px">' + inventoryHtml + '</ul>' +
                      '</div>',
              position: position
            });
            
            popup.open(map);
          }
        }
      });

      // Also show popup on touch for mobile
      map.events.add('touchstart', symbolLayer, function(e) {
        if (e.shapes && e.shapes.length > 0) {
          // Same implementation as mousemove
          var shape = e.shapes[0];
          if (shape instanceof atlas.Shape) {
            // ... same popup logic as mousemove ...
            var props = shape.getProperties();
            var position = shape.getCoordinates();
            
            // Format inventory for popup
            var inventoryHtml = Object.entries(props.inventory || {})
              .map(function(entry) { return '<li>' + entry[0] + ': ' + entry[1] + '</li>'; })
              .join('');
            
            var nodeType = props.type === 'factory' ? 'Factory' :
                props.type === 'distribution_center' ? 'Distribution Center' :
                props.type === 'retail' ? 'Retail' : props.type;
            
            popup.setOptions({
              content: '<div class="map-popup">' +
                      '<div class="map-popup-title">' + props.name + '</div>' +
                      '<div class="map-popup-detail">Type: ' + nodeType + '</div>' +
                      '<div class="map-popup-detail"><b>Inventory:</b></div>' +
                      '<ul class="map-popup-detail" style="margin:0;padding-left:18px">' + inventoryHtml + '</ul>' +
                    '</div>',
              position: position
            });
            
            popup.open(map);
          }
        }
      });
    } else {
      // Display a message if no nodes were loaded
      console.warn('No supply chain nodes available to display');
    }
  });

  // Error handling
  map.events.add('error', function(e) {
    console.error('Azure Maps error:', e);
  });
};

// Add a resize handler that the React component can call when the container size changes
window.resizeMap = function() {
  if (map) {
    // Using setTimeout to ensure resize happens after DOM updates are complete
    setTimeout(function() {
      map.resize();
    }, 0);
  }
};

// Add a cleanup function to dispose of the map instance
window.destroyAzureMap = function() {
  if (map) {
    map.dispose();
    map = null;
  }
};
