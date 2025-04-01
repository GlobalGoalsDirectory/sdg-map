import { divIcon } from "leaflet";
import getSdgColor from "@/helpers/getSdgColor";
import getGradientString from "@/helpers/getGradientString";

import type { OrganizationGeodata } from "@/types/Organization";

const ICON_WIDTH = 30;
const ICON_HEIGHT = 42;
const ID_PLACEHOLDER = "%ID_PLACEHOLDER%";
const BACKGROUND_PLACEHOLDER = "%BACKGROUND_PLACEHOLDER%";
const OUTER_DIAMETER_PLACEHOLDER = "%OUTER_DIAMETER%";
const HALF_OUTER_DIAMETER_PLACEHOLDER = "%HALF_OUTER_DIAMETER%";
const SDGS_DIAMETER_PLACEHOLDER = "%SDGS_DIAMETER%";
const HALF_SDGS_DIAMETER_PLACEHOLDER = "%HALF_SDGS_DIAMETER%";
const WHITE_CIRCLE_DIAMETER_PLACEHOLDER = "%WHITE_CIRCLE_DIAMETER%";
const HALF_WHITE_CIRCLE_DIAMETER_PLACEHOLDER = "%HALF_WHITE_CIRCLE_DIAMETER%";
const BORDER_WIDTH_PLACEHOLDER = "%BORDER_WIDTH%";
const BORDER_COLOR_PLACEHOLDER = "%BORDER_COLOR%";

// Source: https://www.geoapify.com/create-custom-map-marker-icon
const MARKER_ICON_TEMPLATE = `
  <div data-id="${ID_PLACEHOLDER}">
    <div style='
        width: ${OUTER_DIAMETER_PLACEHOLDER}px;
        height: ${OUTER_DIAMETER_PLACEHOLDER}px;
        border-radius: 50% 50% 50% 0;
        border: ${BORDER_WIDTH_PLACEHOLDER}px solid ${BORDER_COLOR_PLACEHOLDER};
        background: white;
        position: absolute;
        transform: rotate(-45deg);
        left: 50%;
        top: 50%;
        margin: -${HALF_OUTER_DIAMETER_PLACEHOLDER}px 0 0 -${HALF_OUTER_DIAMETER_PLACEHOLDER}px;
      '
    ></div>
    <div
      style='
        width: ${SDGS_DIAMETER_PLACEHOLDER}px;
        height: ${SDGS_DIAMETER_PLACEHOLDER}px;
        background: ${BACKGROUND_PLACEHOLDER};
        position: absolute;
        margin: -${HALF_SDGS_DIAMETER_PLACEHOLDER}px 0 0 -${HALF_SDGS_DIAMETER_PLACEHOLDER}px;
        border-radius: 100%;
        left: 50%;
        top: 50%;
      '
    ></div>
    <div
      style='
        width: ${WHITE_CIRCLE_DIAMETER_PLACEHOLDER}px;
        height: ${WHITE_CIRCLE_DIAMETER_PLACEHOLDER}px;
        background: white;
        position: absolute;
        margin: -${HALF_WHITE_CIRCLE_DIAMETER_PLACEHOLDER}px 0 0 -${HALF_WHITE_CIRCLE_DIAMETER_PLACEHOLDER}px;
        border-radius: 100%;
        left: 50%;
        top: 50%;
      '
    ></div>
  </div>
`
  .replace(/\s+/g, " ")
  .trim();

type getIconHtmlProps = {
  id: string;
  background: string;
  width: number;
  padding: number;
  borderWidth: number;
  borderColor: string;
};

const getIconHtml = ({
  id,
  background,
  width,
  padding,
  borderWidth,
  borderColor,
}: getIconHtmlProps) => {
  const sdgsCircleWidth = width - padding * 2 - 2 * borderWidth;
  const whiteCircleWidth = 4;

  return MARKER_ICON_TEMPLATE.replace(
    BORDER_WIDTH_PLACEHOLDER,
    String(borderWidth)
  )
    .replace(BORDER_COLOR_PLACEHOLDER, borderColor)
    .replaceAll(OUTER_DIAMETER_PLACEHOLDER, String(width))
    .replaceAll(HALF_OUTER_DIAMETER_PLACEHOLDER, String(width / 2))
    .replaceAll(SDGS_DIAMETER_PLACEHOLDER, String(sdgsCircleWidth))
    .replaceAll(HALF_SDGS_DIAMETER_PLACEHOLDER, String(sdgsCircleWidth / 2))
    .replaceAll(WHITE_CIRCLE_DIAMETER_PLACEHOLDER, String(whiteCircleWidth))
    .replaceAll(
      HALF_WHITE_CIRCLE_DIAMETER_PLACEHOLDER,
      String(whiteCircleWidth / 2)
    )
    .replace(BACKGROUND_PLACEHOLDER, background)
    .replace(ID_PLACEHOLDER, id);
};

const getMapMarkerIcon = (
  organization: OrganizationGeodata,
  highlight = false
) => {
  let background = "#aaa";

  // If the organization has SDGs, create a conic background with the SDGs
  if (organization.sdgs.length)
    background = getGradientString(
      "conic-gradient",
      organization.sdgs.map((number) => ({
        color: getSdgColor(number),
        size: 1,
      }))
    );

  // The icon height is equal to the diagonale of the square (since we are
  // applying a rotation)
  const iconWidth = highlight ? 40 : 30;
  const iconHeight = Math.round(Math.sqrt(2) * iconWidth * 100) / 100;

  return divIcon({
    className: "map-icon",
    html: getIconHtml({
      id: organization.id,
      background,
      width: iconWidth,
      padding: highlight ? 3 : 2,
      borderWidth: highlight ? 5 : 1,
      borderColor: highlight ? "#0F143D" : "#aaa",
    }),
    iconSize: [iconWidth, iconHeight],
    iconAnchor: [iconWidth / 2, iconHeight],
    tooltipAnchor: [iconWidth / 2, -iconHeight / 2],
  });
};

export { getMapMarkerIcon, ICON_WIDTH, ICON_HEIGHT };
