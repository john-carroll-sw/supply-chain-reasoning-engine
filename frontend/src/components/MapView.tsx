import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";
import type { SupplyChainState } from "../types/supplyChain";
import { getSupplyChainState } from "../api/supplyChainApi";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const MAP_CENTER: [number, number] = [-122.41, 37.78]; // San Francisco area

const MapLegend: React.FC = () => (
  <div className="map-legend">
    <div className="map-legend-row">
      <span className="node-factory map-legend-icon"></span>
      Factory
    </div>
    <div className="map-legend-row">
      <span className="node-distribution_center map-legend-icon"></span>
      Distribution Center
    </div>
    <div className="map-legend-row">
      <span className="node-retail map-legend-icon"></span>
      Retail
    </div>
  </div>
);

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [supplyChain, setSupplyChain] = useState<SupplyChainState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cache for route polylines
  const routeCache = useRef<{ [key: string]: number[][] }>({});

  // Helper to fetch driving route from Mapbox Directions API
  const fetchDrivingRoute = async (
    from: [number, number],
    to: [number, number],
    routeId: string
  ): Promise<number[][] | null> => {
    if (routeCache.current[routeId]) return routeCache.current[routeId];
    const accessToken = mapboxgl.accessToken;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&access_token=${accessToken}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates) {
        routeCache.current[routeId] = data.routes[0].geometry.coordinates;
        return data.routes[0].geometry.coordinates;
      }
    } catch (error) {
      // fallback to straight line if API fails
      console.error("Error fetching driving route:", error);
      return null;
    }
    return null;
  };

  // Fetch supply chain data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSupplyChainState();
        setSupplyChain(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching supply chain data:", err);
        setError("Failed to load supply chain data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: MAP_CENTER,
      zoom: 9,
    });

    const map = mapRef.current;

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add supply chain data to map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !supplyChain || loading) return;

    const onLoad = async () => {
      // Fit map to bounds of all nodes
      const bounds = new mapboxgl.LngLatBounds();
      supplyChain.nodes.forEach((node) => {
        bounds.extend([node.location.lng, node.location.lat]);
      });
      map.fitBounds(bounds, { padding: 50 });

      // Add routes as driving polylines
      for (const route of supplyChain.routes) {
        const fromNode = supplyChain.nodes.find((n) => n.id === route.from);
        const toNode = supplyChain.nodes.find((n) => n.id === route.to);
        if (fromNode && toNode) {
          const routeId = `route-${route.id}`;
          let coordinates = await fetchDrivingRoute(
            [fromNode.location.lng, fromNode.location.lat],
            [toNode.location.lng, toNode.location.lat],
            routeId
          );
          if (!coordinates) {
            // fallback to straight line
            coordinates = [
              [fromNode.location.lng, fromNode.location.lat],
              [toNode.location.lng, toNode.location.lat],
            ];
          }
          const routeFeature: GeoJSON.Feature = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates,
            },
            properties: {
              id: route.id,
              status: route.status,
            },
          };
          if (!map.getSource(routeId)) {
            map.addSource(routeId, {
              type: "geojson",
              data: routeFeature,
            });
            map.addLayer({
              id: routeId,
              type: "line",
              source: routeId,
              layout: {},
              paint: {
                "line-color": route.status === "open" ? "rgba(34, 139, 34, 0.8)" : "rgba(220, 20, 60, 0.8)",
                "line-width": 3,
                "line-dasharray": route.status === "closed" ? [3, 3] : [1],
              },
            });
          } else {
            // update source if already exists
            (map.getSource(routeId) as mapboxgl.GeoJSONSource).setData(routeFeature);
          }
        }
      }

      // Add nodes as markers
      supplyChain.nodes.forEach((node) => {
        const el = document.createElement("div");
        el.className = `node-${node.type}`;
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div class="node-popup">
            <h3>${node.name}</h3>
            <p>Type: ${formatNodeType(node.type)}</p>
            ${Object.entries(node.inventory)
              .map(([sku, quantity]) => `<p>${sku}: ${quantity} units</p>`)
              .join("")}
          </div>`
        );
        new mapboxgl.Marker(el)
          .setLngLat([node.location.lng, node.location.lat])
          .setPopup(popup)
          .addTo(map);
      });
    };

    if (map.isStyleLoaded()) {
      onLoad();
    } else {
      map.once("load", onLoad);
    }
    return () => {
      if (map) {
        map.off("load", onLoad);
      }
    };
  }, [supplyChain, loading]);

  // Helper to format node type for display
  const formatNodeType = (type: string): string => {
    switch (type) {
      case "factory":
        return "Factory";
      case "distribution_center":
        return "Distribution Center";
      case "retail":
        return "Retail";
      default:
        return type;
    }
  };

  return (
    <div className="map-container map-container-relative" ref={mapContainer}>
      <MapLegend />
      {loading && (
        <div className="loading-indicator">
          Loading...
        </div>
      )}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default MapView;
