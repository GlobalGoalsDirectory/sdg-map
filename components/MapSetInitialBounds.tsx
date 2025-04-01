import { useCallback, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { LatLngBounds } from "leaflet";
import { useMap } from "react-leaflet";
import { useFilterStore } from "@/stores/FilterStore";
import { useMapStore } from "@/stores/MapStore";

import type { LatLngBoundsLiteral, Point } from "leaflet";
import type { OrganizationGeodata } from "@/types/Organization";

const WORLD_BOUNDS: LatLngBoundsLiteral = [
  [-90, -180],
  [90, 180],
];

type MapSetInitialBoundsProps = {
  organizations: OrganizationGeodata[] | undefined;
  paddingTopLeft: Point;
  paddingBottomRight: Point;
};

const MapSetInitialBounds = observer(
  ({
    organizations,
    paddingTopLeft,
    paddingBottomRight,
  }: MapSetInitialBoundsProps) => {
    const hasSetInitialBoundsRef = useRef<boolean>(false);
    const map = useMap();
    const filterStore = useFilterStore();
    const mapStore = useMapStore();

    // Set initial bounds, if they have not already been set.
    // Initial bounds are undefined on initial map load and must then be
    // calculated from the organizations.
    // On subsequent page loads, the initial bounds are set from the map store,
    // which tracks the map bounds when the user navigates away from the map
    // page.
    const getInitialBounds = useCallback(() => {
      // Use the bounds from the map store state if the query filter has not
      // changed
      if (mapStore.filterQuery === filterStore.filterQuery)
        return mapStore.bounds;

      // Otherwise, try to initialize bounds from the organizations
      if (!organizations) return undefined;

      return new LatLngBounds(
        organizations.map((org) => [org.latitude, org.longitude])
      );
    }, [
      mapStore.filterQuery,
      mapStore.bounds,
      filterStore.filterQuery,
      organizations,
    ]);

    useEffect(() => {
      if (hasSetInitialBoundsRef.current) return;

      // If bounds are not ready yet, wait
      const bounds = getInitialBounds();
      if (bounds === undefined) return;

      // If bounds are not valid, display world map
      if (!bounds.isValid()) bounds.extend(WORLD_BOUNDS);

      map.fitBounds(bounds, {
        paddingTopLeft,
        paddingBottomRight,
      });

      hasSetInitialBoundsRef.current = true;
    }, [
      hasSetInitialBoundsRef,
      getInitialBounds,
      map,
      paddingTopLeft,
      paddingBottomRight,
    ]);

    // When the map "unloads", store the map bounds to the mapStore, so that the
    // bounds can be re-covered later
    useEffect(() => {
      if (!map) return;
      map.on("unload", () => mapStore.setBounds(map.getBounds()));
    }, [map, mapStore]);

    return null;
  }
);

export default MapSetInitialBounds;
