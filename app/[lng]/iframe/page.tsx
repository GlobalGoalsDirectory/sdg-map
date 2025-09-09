"use client";

import dynamic from "next/dynamic";

import type { IframeMapComponentProps } from "@/components/IframeMapComponent";
import { Skeleton } from "@mui/material";

const IframeMapComponent = dynamic<IframeMapComponentProps>(
  () => import("@/components/IframeMapComponent"),
  {
    ssr: false,
    loading: () => (
      <Skeleton variant="rectangular" width="100%" height="100%" />
    ),
  }
);

export default function IframePage() {
  return (
    <IframeMapComponent
      showAiDisclaimer={false}
      showSearch={true}
      showFilters={true}
      emailAddressForInquiries={null}
    />
  );
}
