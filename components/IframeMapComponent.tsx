import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { LatLngBounds, Point } from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import { useTranslation } from "next-i18next";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import IframeUi from "@/components/IframeUi";
import MapBase from "@/components/MapBase";
import MapSetInitialBounds from "@/components/MapSetInitialBounds";
import MapStatusOverlay from "@/components/MapStatusOverlay";
import MarkerClusterGroup from "@/components/MarkerClusterGroup";
import MapMarkerTooltip from "@/components/MapMarkerTooltip";
import {
  getMapMarkerIcon,
  ICON_WIDTH,
  ICON_HEIGHT,
} from "@/components/MapMarkerIcon";
import { getMapClusterIcon } from "@/components/MapClusterIcon";
import { useIframeStore } from "@/stores/IframeStore";
import { useFilterStore } from "@/stores/FilterStore";
import usePublicOrganizationsGeodata from "@/hooks/usePublicOrganizationsGeodata";

import type { MarkerCluster } from "leaflet";
import type { SdgNumber } from "@/types/SdgNumber";

const BOUNDS_PADDING = 50;

// X: Padding + half the icon width
// Y: Padding + full icon height
const BOUNDS_PADDING_TOP_LEFT = new Point(
  BOUNDS_PADDING + ICON_WIDTH / 2,
  BOUNDS_PADDING + ICON_HEIGHT
);

// X: Padding + half the icon width
// Y: Padding
const BOUNDS_PADDING_BOTTOM_RIGHT = new Point(
  BOUNDS_PADDING + ICON_WIDTH / 2,
  BOUNDS_PADDING
);

type IframeMapComponentProps = {
  showSearch: boolean;
  showFilters: boolean;
  emailAddressForInquiries: string | null;
  showAiDisclaimer: boolean;
};

const IframeMapComponent = observer(
  ({
    showSearch,
    showFilters,
    emailAddressForInquiries,
    showAiDisclaimer,
  }: IframeMapComponentProps) => {
    const { t } = useTranslation("map");

    const iframeStore = useIframeStore();
    const filterStore = useFilterStore();
    const isMapReady = iframeStore.isMapReady;
    const selectOrganization = iframeStore.selectOrganization;
    const selectedOrganization = iframeStore.selectedOrganization;

    const { organizations, isLoading } = usePublicOrganizationsGeodata(
      filterStore.filterQuery
    );

    console.log(organizations);

    const hasNoResults = organizations != null && organizations.length === 0;

    // When loading organizations is completed, always adjust the area in view
    useEffect(() => {
      if (isLoading) return;
      if (!organizations) return;
      if (!iframeStore.map) return;

      const bounds = new LatLngBounds(
        organizations.map((org) => [org.latitude, org.longitude])
      );

      if (!bounds.isValid()) return;

      iframeStore.map.flyToBounds(bounds, {
        animate: true,
        duration: 1,
        paddingTopLeft: BOUNDS_PADDING_TOP_LEFT,
        paddingBottomRight: BOUNDS_PADDING_BOTTOM_RIGHT,
        maxZoom: 14,
      });
    }, [organizations, iframeStore.map, isLoading]);

    // Get the cluster icon
    const getClusterIcon = useMemo(() => {
      if (!organizations) return undefined;

      const orgIdToSdgsHashTable = organizations.reduce(
        (map: Record<string, SdgNumber[]>, organization) => {
          map[organization.id] = organization.sdgs;
          return map;
        },
        {}
      );

      return (cluster: MarkerCluster) => {
        const childCount = cluster.getChildCount();

        // Determine icon size
        const childStringLength = String(childCount).length;
        const iconSize = 30 + childStringLength * 10;

        // Add tooltip to cluster
        cluster.bindTooltip(
          t("MAP.CLUSTER_TOOLTIP.ACTOR_COUNT", { count: childCount }),
          {
            offset: new Point(iconSize / 2, 0),
          }
        );

        // Return the icon
        return getMapClusterIcon(
          cluster,
          iconSize,
          childCount,
          orgIdToSdgsHashTable
        );
      };
    }, [organizations, t]);

    // Memo-ize the markers and clusters
    const markers = useMemo(() => {
      if (!organizations) return [];

      return (
        <MarkerClusterGroup
          key={Date.now()}
          iconCreateFunction={getClusterIcon}
        >
          {organizations.map((organization) => (
            <Marker
              key={organization.id}
              data-id={organization.id}
              icon={getMapMarkerIcon(organization)}
              position={[organization.latitude, organization.longitude]}
              eventHandlers={{
                click: () => selectOrganization(organization),
              }}
            >
              <Tooltip>
                <MapMarkerTooltip organization={organization} />
              </Tooltip>
            </Marker>
          ))}
        </MarkerClusterGroup>
      );
    }, [organizations, getClusterIcon, selectOrganization]);

    const markerForSelectedOrganization = useMemo(() => {
      if (!selectedOrganization) return null;

      return (
        <Marker
          data-id={selectedOrganization.id}
          icon={getMapMarkerIcon(selectedOrganization, true)}
          position={[
            selectedOrganization.latitude,
            selectedOrganization.longitude,
          ]}
          eventHandlers={{
            click: () => selectOrganization(selectedOrganization),
          }}
          // Display marker on top
          zIndexOffset={100}
        >
          <Tooltip>
            <MapMarkerTooltip organization={selectedOrganization} />
          </Tooltip>
        </Marker>
      );
    }, [selectOrganization, selectedOrganization]);

    return (
      <>
        <IframeUi
          search={showSearch}
          filters={showFilters}
          emailAddressForInquiries={emailAddressForInquiries}
          showAiDisclaimer={showAiDisclaimer}
        />
        <MapBase
          attributionPrefix="Powered by <a href='https://globalgoals.directory/' target='_blank' rel='noopener'>Global Goals Directory</a>"
          onReady={iframeStore.setMap}
        >
          <MapSetInitialBounds
            organizations={organizations}
            paddingTopLeft={BOUNDS_PADDING_TOP_LEFT}
            paddingBottomRight={BOUNDS_PADDING_BOTTOM_RIGHT}
          />
          {markers}
          {markerForSelectedOrganization}
        </MapBase>
        <MapStatusOverlay
          isMapReady={isMapReady}
          hasNoResults={hasNoResults}
          isLoading={isLoading}
          isValidating={false}
        />
      </>
    );
  }
);

export default IframeMapComponent;
export type { IframeMapComponentProps };
