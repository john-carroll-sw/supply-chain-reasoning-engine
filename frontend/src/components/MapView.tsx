import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const MAP_CENTER: [number, number] = [-122.41, 37.78]; // San Francisco area

const MapView: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: MAP_CENTER,
      zoom: 9,
    });
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: 8 }} />
  );
};

export default MapView;
