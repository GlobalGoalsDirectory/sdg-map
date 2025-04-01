import {
  Box,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";

import type { BoxProps } from "@mui/material";

const OverlayBox = (params: BoxProps) => (
  <Box
    position="absolute"
    display="flex"
    alignItems="center"
    justifyContent="center"
    top={0}
    left={0}
    right={0}
    bottom={0}
    width={1}
    height={1}
    {...params}
  />
);

type MapStatusOverlayProps = {
  isMapReady: boolean;
  hasNoResults: boolean;
  isLoading: boolean;
  isValidating: boolean;
};

const MapStatusOverlay = ({
  isMapReady,
  hasNoResults,
  isLoading,
  isValidating,
}: MapStatusOverlayProps) => {
  if (!isMapReady) return <NotReadyOverlay />;

  if (hasNoResults) return <NoResultsOverlay isValidating={isValidating} />;

  if (isLoading) return <LoadingOverlay />;

  if (isValidating) return <ValidatingOverlay />;

  return null;
};

const NotReadyOverlay = () => (
  <OverlayBox
    // Position above the Leaflet pane
    zIndex={1001}
    bgcolor="white"
  >
    <Skeleton variant="rectangular" width="100%" height="100%" />
  </OverlayBox>
);

type NoResultsOverlayProps = {
  isValidating: boolean;
};

const NoResultsOverlay = ({ isValidating }: NoResultsOverlayProps) => {
  const { t } = useTranslation("map");

  return "BOO";

  return (
    <OverlayBox
      // Position above the Leaflet pane but below controls
      zIndex={400}
      bgcolor="rgba(0,0,0,.85)"
      color="#fff"
      sx={{ pointerEvents: "none" }}
    >
      {isValidating ? (
        <CircularProgress size={80} color="inherit" />
      ) : (
        <Typography variant="body1" fontWeight={500}>
          {t("NO_RESULTS")}
        </Typography>
      )}
    </OverlayBox>
  );
};

const LoadingOverlay = () => (
  <OverlayBox
    // Position above the Leaflet pane but below controls
    zIndex={400}
    bgcolor="rgba(255,255,255,.5)"
    sx={{ pointerEvents: "none" }}
  >
    <CircularProgress size={80} />
  </OverlayBox>
);

const ValidatingOverlay = () => (
  <OverlayBox
    // Position above the Leaflet pane but below controls
    zIndex={400}
    display="block"
    sx={{ pointerEvents: "none" }}
  >
    <LinearProgress />
  </OverlayBox>
);

export default MapStatusOverlay;
