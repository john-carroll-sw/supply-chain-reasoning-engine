import React, { useEffect } from "react";
import { AzureMap, AzureMapsProvider, AzureMapDataSourceProvider, AzureMapLayerProvider, AzureMapFeature } from "react-azure-maps";
import type { IAzureMapOptions } from "react-azure-maps";
import { AuthenticationType } from "azure-maps-control";
import type { SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";

const mapOptions: IAzureMapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
  },
  center: [-122.41, 37.78],
  zoom: 9,
  view: "Auto",
};

// Define a GeoJSON Feature type for use in the features array
interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString" | "Polygon";
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, unknown>;
}

const AzureMapView: React.FC = () => {
  const [supplyChain, setSupplyChain] = React.useState<SupplyChainState | null>(null);

  useEffect(() => {
    getSupplyChainState().then(setSupplyChain);
  }, []);

  // Prepare features for the map as plain GeoJSON
  const features: GeoJsonFeature[] = [];
  if (supplyChain) {
    // Add nodes as points
    supplyChain.nodes.forEach(node => {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [node.location.lng, node.location.lat]
        },
        properties: { name: node.name, type: node.type, inventory: node.inventory }
      });
    });
    // Add routes as lines
    supplyChain.routes.forEach(route => {
      const fromNode = supplyChain.nodes.find(n => n.id === route.from);
      const toNode = supplyChain.nodes.find(n => n.id === route.to);
      if (fromNode && toNode) {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [fromNode.location.lng, fromNode.location.lat],
              [toNode.location.lng, toNode.location.lat]
            ]
          },
          properties: { status: route.status }
        });
      }
    });
    // Add bridge polygon
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-122.38818440230241, 37.78919217338181],
          [-122.38782249093589, 37.78812066499759],
          [-122.38028196637966, 37.795358568549574],
          [-122.37426031630528, 37.80093363424673],
          [-122.36267298851001, 37.81170697825304],
          [-122.36148117407768, 37.81273053449793],
          [-122.35250916524069, 37.81772125489243],
          [-122.34201615001673, 37.819396840167585],
          [-122.32775451285596, 37.82136679684645],
          [-122.3063412476317, 37.82409614861264],
          [-122.30549701090455, 37.826358073073976],
          [-122.32313026567017, 37.82335636023031],
          [-122.33699868510735, 37.82178308846727],
          [-122.35275867583945, 37.81932363069252],
          [-122.36362861011031, 37.813143808265636],
          [-122.38227049143148, 37.79504172676684],
          [-122.38677351950994, 37.790519714366226],
          [-122.38818440230241, 37.78919217338181]
        ]]
      },
      properties: {}
    });
  }

  return (
    <AzureMapsProvider>
      <AzureMap options={mapOptions} styles={{ height: "500px", width: "100%", borderRadius: 8 }}>
        <AzureMapDataSourceProvider id="supply-chain-ds" options={{}}>
          {features.map((feature, i) => {
            const geometry = feature.geometry;
            const properties = feature.properties;
            if (geometry && geometry.type === "Point") {
              return (
                <AzureMapFeature
                  key={i}
                  id={`point-${i}`}
                  type="Point"
                  coordinates={[geometry.coordinates as [number, number]]}
                  properties={properties}
                />
              );
            } else if (geometry && geometry.type === "LineString") {
              return (
                <AzureMapFeature
                  key={i}
                  id={`line-${i}`}
                  type="LineString"
                  coordinates={geometry.coordinates as [number, number][]}
                  properties={properties}
                />
              );
            } else if (geometry && geometry.type === "Polygon") {
              return (
                <AzureMapFeature
                  key={i}
                  id={`polygon-${i}`}
                  type="Polygon"
                  coordinates={geometry.coordinates[0] as [number, number][]}
                  properties={properties}
                />
              );
            }
            return null;
          })}
        </AzureMapDataSourceProvider>
        {/* Node Layer */}
        <AzureMapLayerProvider
          id="nodes-layer"
          type="SymbolLayer"
          options={{
            iconOptions: {
              image: "marker",
              allowOverlap: true,
              ignorePlacement: true,
            },
            textOptions: {
              textField: ["get", "name"],
              offset: [0, 1.2],
              size: 1.2,
              color: "#F4F4F4",
            },
            filter: ["==", ["geometry-type"], "Point"]
          }}
        />
        {/* Route Layer */}
        <AzureMapLayerProvider
          id="routes-layer"
          type="LineLayer"
          options={{
            strokeColor: [
              "case",
              ["==", ["get", "status"], "closed"], "#DC143C",
              "#228B22"
            ],
            strokeWidth: 3,
            lineDashArray: [
              "case",
              ["==", ["get", "status"], "closed"], [2, 2],
              [1]
            ],
            filter: ["==", ["geometry-type"], "LineString"]
          }}
        />
        {/* Bridge Polygon Layer */}
        <AzureMapLayerProvider
          id="bridge-polygon-layer"
          type="PolygonLayer"
          options={{
            fillColor: "#FF00FF",
            fillOpacity: 0.3,
            filter: ["==", ["geometry-type"], "Polygon"]
          }}
        />
        <AzureMapLayerProvider
          id="bridge-polygon-outline"
          type="LineLayer"
          options={{
            strokeColor: "#FF00FF",
            strokeWidth: 3,
            filter: ["==", ["geometry-type"], "Polygon"]
          }}
        />
      </AzureMap>
    </AzureMapsProvider>
  );
};

export default AzureMapView;
