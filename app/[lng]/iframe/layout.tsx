import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function IframeLayout({ children }: PropsWithChildren) {
  return (
    <Box
      position="relative"
      width={1}
      height={1}
      minHeight={300}
      overflow="hidden"
    >
      <Box position="absolute" width={1} height={1}>
        {children}
      </Box>
    </Box>
  );
}
