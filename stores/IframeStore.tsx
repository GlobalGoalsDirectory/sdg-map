import { createContext, PropsWithChildren, useContext, useState } from "react";
import { makeAutoObservable, observable } from "mobx";

import type { Map } from "leaflet";
import type { OrganizationGeodata } from "@/types/Organization";

class IframeStore {
  selectedOrganization: OrganizationGeodata | null = null;
  map: Map | undefined = undefined;

  constructor() {
    makeAutoObservable(
      this,
      {
        // Do not deep-observe properties. Listen for re-assignment only.
        map: observable.ref,
        selectedOrganization: observable.ref,
      },
      { autoBind: true }
    );
  }

  setMap(map: Map) {
    this.map = map;
  }

  get isMapReady() {
    return this.map != null;
  }

  get selectedOrganizationId() {
    return this.selectedOrganization?.id;
  }

  flyTo(latitude: number, longitude: number) {
    this.map?.flyTo([latitude, longitude], 14, { duration: 1 });
  }

  selectOrganization(organization: OrganizationGeodata) {
    this.selectedOrganization = organization;
  }

  clearSelectedOrganization() {
    this.selectedOrganization = null;
  }
}

const iframeStoreContext = createContext<IframeStore | null>(null);

export const IframeStoreProvider = (props: PropsWithChildren) => {
  const [iframeStore] = useState(() => new IframeStore());

  return <iframeStoreContext.Provider {...props} value={iframeStore} />;
};

export const useIframeStore = () => {
  const iframeStore = useContext(iframeStoreContext);
  if (!iframeStore) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error(
      "useIframeStore must be used within a IframeStoreProvider."
    );
  }
  return iframeStore;
};
