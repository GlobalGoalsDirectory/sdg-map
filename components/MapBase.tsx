import {
  MapContainer,
  TileLayer,
  ZoomControl,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MapEventsListener from "@/components/MapEventsListener";

// Fix Leaflet in Webpack
// See: https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-611930767
import L from "leaflet";
L.Icon.Default.imagePath = "/static/leaflet/";

import type { PropsWithChildren } from "react";
import type { LatLngBounds, LatLngExpression, LatLngTuple } from "leaflet";
import type { MapEventsListenerProps } from "@/components/MapEventsListener";

type MapBaseProps = PropsWithChildren &
  MapEventsListenerProps & {
    bounds?: LatLngBounds | LatLngTuple[];
    center?: LatLngExpression;
    zoom?: number;
    attributionPrefix?: string | false;
  };

const MapBase = ({
  children,
  bounds,
  zoom,
  center,
  onUnload,
  onReady,
  onClick,
  attributionPrefix = false,
}: MapBaseProps) => (
  <>
    <MapContainer
      center={center}
      bounds={bounds}
      zoom={zoom}
      zoomControl={false}
      attributionControl={false}
      style={{ height: "100%" }}
      // If minZoom=0, then the map.flyTo method causes flickering on the screen
      minZoom={1}
      // Disable zoom snapping after fitBounds/flyToBounds
      zoomSnap={0}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='<span style="display: inline-block;">&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a></span>'
        subdomains="abcd"
        maxZoom={20}
      />
      <MapEventsListener
        onUnload={onUnload}
        onReady={onReady}
        onClick={onClick}
      />
      {children}
      <AttributionControl prefix={attributionPrefix} position="bottomright" />
      <ZoomControl position="bottomright" />
    </MapContainer>
  </>
);

export type { MapBaseProps };
export default MapBase;
