import { createContext, PropsWithChildren, useContext, useState } from "react";
import { makeAutoObservable } from "mobx";

import type { LatLngBounds } from "leaflet";

class MapStore {
  bounds: LatLngBounds | undefined = undefined;
  filterQuery: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setBounds(bounds: LatLngBounds) {
    this.bounds = bounds;
  }

  setFilterQuery(filterQuery: string) {
    this.filterQuery = filterQuery;
  }
}

const mapStoreContext = createContext<MapStore | null>(null);

export const MapStoreProvider = (props: PropsWithChildren) => {
  const [mapStore] = useState(() => new MapStore());

  return <mapStoreContext.Provider {...props} value={mapStore} />;
};

export const useMapStore = () => {
  const mapStore = useContext(mapStoreContext);
  if (!mapStore) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("useMapStore must be used within a MapStoreProvider.");
  }
  return mapStore;
};
