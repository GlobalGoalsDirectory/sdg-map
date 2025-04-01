import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

import type { LeafletMouseEvent, Map } from "leaflet";

type MapEventsListenerProps = {
  onReady?: (map: Map) => void;
  onClick?: (event: LeafletMouseEvent) => void;
  onUnload?: (map: Map) => void;
};

const MapEventsListener = ({
  onUnload,
  onReady,
  onClick,
}: MapEventsListenerProps) => {
  const map = useMapEvents({
    ...(onUnload && { unload: () => onUnload(map) }),
    ...(onClick && { click: onClick }),
  });

  useEffect(() => {
    map.whenReady(() => onReady && onReady(map));
  }, [map, onReady]);

  return null;
};

export default MapEventsListener;
export type { MapEventsListenerProps };
