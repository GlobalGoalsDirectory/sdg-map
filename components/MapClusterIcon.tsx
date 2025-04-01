import { divIcon } from "leaflet";
import { countBy, sortBy, get } from "lodash";
import getSdgColor from "@/helpers/getSdgColor";

import type { MarkerCluster } from "leaflet";
import type { SdgNumber } from "@/types/SdgNumber";
import getGradientString from "@/helpers/getGradientString";

const BACKGROUND_PLACEHOLDER = "%BACKGROUND_PLACEHOLDER%";
const CHILD_COUNT_PLACEHOLDER = "%CHILD_COUNT_PLACEHOLDER%";
const DIAMETER_PLACEHOLDER = "%DIAMETER%";
const RADIUS_PLACEHOLDER = "%RADIUS%";
const INNER_DIAMETER_PLACEHOLDER = "%INNER_DIAMETER%";
const INNER_RADIUS_PLACEHOLDER = "%INNER_RADIUS%";
const CHILD_COUNT_BOX_DIMENSION_PLACEHOLDER =
  "%CHILD_COUNT_BOX_DIMENSION_PLACEHOLDER%";
const SDG_WHEEL_WIDTH_PLACEHOLDER = "%SDG_WHEEL_WIDTH_PLACEHOLDER%";

const ICON_TEMPLATE = `
<div
  style='
    width: ${DIAMETER_PLACEHOLDER}px;
    height: ${DIAMETER_PLACEHOLDER}px;
    border-radius: 50%;
    border: 1px solid #aaa;
    background: white;
    position: relative;
    left: 50%;
    top: 50%;
    margin: -${RADIUS_PLACEHOLDER}px 0 0 -${RADIUS_PLACEHOLDER}px;
  '
/>
<div
  style='
    width: ${INNER_DIAMETER_PLACEHOLDER}px;
    height: ${INNER_DIAMETER_PLACEHOLDER}px;
    background: ${BACKGROUND_PLACEHOLDER};
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    margin: -${INNER_RADIUS_PLACEHOLDER}px 0 0 -${INNER_RADIUS_PLACEHOLDER}px;
  '
>
  <div
    style='
      width: ${CHILD_COUNT_BOX_DIMENSION_PLACEHOLDER}px;
      height: ${CHILD_COUNT_BOX_DIMENSION_PLACEHOLDER}px;
      background: white;
      margin: ${SDG_WHEEL_WIDTH_PLACEHOLDER}px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    '
  >
    ${CHILD_COUNT_PLACEHOLDER}
  </div>
</div>
`
  .replace(/\s+/g, " ")
  .trim();

type HashTable = Record<string, SdgNumber[]>;

const getMapClusterIcon = (
  cluster: MarkerCluster,
  iconSize: number,
  childCount: number,
  idsToSdgsHashTable: HashTable
) => {
  // Determine background
  const NO_SDGS = 99;
  const sdgs = cluster.getAllChildMarkers().flatMap((child) => {
    const id = get(child.options, "data-id");

    // Should never happen
    if (!id || typeof id !== "string") return [];

    const sdgs = idsToSdgsHashTable[id];
    return sdgs.length ? sdgs : NO_SDGS;
  });
  const countsBySdg = sortBy(
    Object.entries(countBy(sdgs)).map(([sdg, count]) => ({
      sdg: parseInt(sdg) as SdgNumber | typeof NO_SDGS,
      count,
    })),
    ["sdg"]
  );
  const gradientSteps = countsBySdg.map(({ sdg, count }) => ({
    color: sdg === NO_SDGS ? "#aaa" : getSdgColor(sdg),
    size: count,
  }));

  return divIcon({
    className: "cluster-icon",
    html: getIconTemplate(iconSize)
      .replace(
        BACKGROUND_PLACEHOLDER,
        getGradientString("conic-gradient", gradientSteps)
      )
      .replace(CHILD_COUNT_PLACEHOLDER, String(childCount)),
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });
};

const cache: Record<number, string> = {};

const getIconTemplate = (size: number) => {
  if (size in cache) return cache[size];

  const outerDiameter = size;
  const outerPadding = 6;
  const innerDiameter = outerDiameter - outerPadding;
  const sdgWheelWidth = size / 5;

  cache[size] = ICON_TEMPLATE.replaceAll(
    DIAMETER_PLACEHOLDER,
    String(outerDiameter)
  )
    .replaceAll(RADIUS_PLACEHOLDER, String(outerDiameter / 2))
    .replaceAll(INNER_DIAMETER_PLACEHOLDER, String(innerDiameter))
    .replaceAll(INNER_RADIUS_PLACEHOLDER, String(innerDiameter / 2))
    .replaceAll(
      CHILD_COUNT_BOX_DIMENSION_PLACEHOLDER,
      String(innerDiameter - sdgWheelWidth * 2)
    )
    .replaceAll(SDG_WHEEL_WIDTH_PLACEHOLDER, String(sdgWheelWidth));

  return cache[size];
};

export { getMapClusterIcon };
