import React from "react";
import { 
  AzureMap, 
  AzureMapsProvider, 
  AzureMapDataSourceProvider, 
  AzureMapLayerProvider, 
  AzureMapFeature,
  type ControlOptions
} from "react-azure-maps";
import { AuthenticationType } from "azure-maps-control";

const mapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY,
  },
  center: [-122.4194, 37.7749],
  zoom: 12,
  view: "Auto",
};

const AzureMapRoute: React.FC = () => (
  <AzureMapsProvider>
    <AzureMap 
      options={mapOptions} 
      styles={{ height: "100%", width: "100%", borderRadius: 8 }}
      controls={[
        {
          controlName: 'ZoomControl',
          options: { position: 'top-right' } as ControlOptions,
        },
        {
          controlName: 'CompassControl',
          options: { position: 'top-right' } as ControlOptions,
        },
        {
          controlName: 'PitchControl',
          options: { position: 'top-right' } as ControlOptions,
        },
        {
          controlName: 'StyleControl',
          options: { position: 'top-left' } as ControlOptions,
        },
        {
          controlName: 'FullscreenControl',
          options: { position: 'top-left' } as ControlOptions,
        },
      ]}
    >
      <AzureMapDataSourceProvider id="test-ds">
        <AzureMapFeature
          id="test-marker"
          type="Point"
          coordinates={[[-122.4194, 37.7749]]}
          properties={{ title: "Test Marker", iconImage: "marker" }}
        />
      </AzureMapDataSourceProvider>
      <AzureMapLayerProvider
        id="marker-layer"
        type="SymbolLayer"
        options={{
          iconOptions: {
            image: ["get", "iconImage"],
            allowOverlap: true,
            ignorePlacement: true,
          },
          textOptions: {
            textField: ["get", "title"],
            offset: [0, 1.2],
            size: 1.2,
            color: "#F4F4F4",
          },
          filter: ["==", ["geometry-type"], "Point"],
        }}
      />
    </AzureMap>
  </AzureMapsProvider>
);

export default AzureMapRoute;