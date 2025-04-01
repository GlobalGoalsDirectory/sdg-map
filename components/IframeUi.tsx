import { observer } from "mobx-react-lite";
import { Box, Grid2 } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import useResizeObserver from "use-resize-observer";
import IframeMapDrawer from "@/components/IframeMapDrawer";
import IframeSearch from "@/components/IframeSearch";
import { useIframeStore } from "@/stores/IframeStore";
import { useFilterStore } from "@/stores/FilterStore";
import FilterComponent from "./FilterComponent";

type IframeUiProps = {
  search: boolean;
  filters: boolean;
  emailAddressForInquiries: string | null;
  showAiDisclaimer: boolean;
};

const IframeUi = observer(
  ({
    search,
    filters,
    emailAddressForInquiries,
    showAiDisclaimer,
  }: IframeUiProps) => {
    const iframeStore = useIframeStore();
    const filterStore = useFilterStore();
    const theme = useTheme();

    const organizationId = iframeStore.selectedOrganizationId;
    const onClose = iframeStore.clearSelectedOrganization;

    // Show SDG filter
    const visibleFilters = filterStore.filters.filter((f) => f.name === "sdg");

    const { ref: containerRef, width: containerWidth } = useResizeObserver();

    // Determine the drawer width, based on the size of the iframe container
    let drawerWidth: string | number = "100%";

    if (containerWidth && containerWidth >= theme.breakpoints.values.sm)
      drawerWidth = "320px";

    if (containerWidth && containerWidth >= theme.breakpoints.values.md)
      drawerWidth = "400px";

    // Determine the search box width, based on the size of the iframe container
    let searchBoxWidth = 300;

    // On mobile, use the full available width minus 2 units of padding on each
    // side
    if (containerWidth && containerWidth < theme.breakpoints.values.sm)
      searchBoxWidth = containerWidth - 4 * 8;

    return (
      <Box
        ref={containerRef}
        position="absolute"
        display="flex"
        top={0}
        bottom={0}
        left={0}
        right={0}
        zIndex={1300}
        sx={{ pointerEvents: "none" }}
      >
        <MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>
          <AnimatePresence>
            {organizationId && (
              <Box
                key="drawer"
                id="drawer"
                component={motion.div}
                initial={{ width: drawerWidth, translateX: `-${drawerWidth}` }}
                animate={{ width: drawerWidth, translateX: 0 }}
                exit={{ width: drawerWidth, translateX: `-${drawerWidth}` }}
                position="absolute"
                height={1}
                sx={{ pointerEvents: "initial" }}
              >
                <IframeMapDrawer
                  organizationId={organizationId}
                  onClose={onClose}
                  emailAddressForInquiries={emailAddressForInquiries}
                  showAiDisclaimer={showAiDisclaimer}
                />
              </Box>
            )}
          </AnimatePresence>
          <Box
            component={motion.div}
            animate={{ left: organizationId ? drawerWidth : 0 }}
            position="absolute"
            paddingTop={2}
            paddingX={2}
          >
            <Grid2 container spacing={2}>
              {search && (
                <Grid2 size={{ xs: "auto" }}>
                  <Box display="block" sx={{ pointerEvents: "initial" }}>
                    <IframeSearch
                      expandedWidth={searchBoxWidth}
                      emailAddressForInquiries={emailAddressForInquiries}
                    />
                  </Box>
                </Grid2>
              )}
              {filters &&
                visibleFilters.map((filter) => (
                  <Grid2 key={filter.name} size={{ xs: "auto" }}>
                    <Box display="block">
                      <Box
                        bgcolor="white"
                        boxShadow="0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)"
                        overflow="hidden"
                        borderRadius={1}
                        sx={{ pointerEvents: "initial" }}
                      >
                        <FilterComponent filter={filter} variant="text" />
                      </Box>
                    </Box>
                  </Grid2>
                ))}
            </Grid2>
          </Box>
        </MotionConfig>
      </Box>
    );
  }
);

export default IframeUi;
