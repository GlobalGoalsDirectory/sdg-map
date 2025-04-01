"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FilterStoreProvider } from "@/stores/FilterStore";
import { MapStoreProvider } from "@/stores/MapStore";
import { IframeStoreProvider } from "@/stores/IframeStore";
import ThemeProvider from "@/components/ThemeProvider";
import { PropsWithChildren } from "react";
import { SWRConfig } from "swr";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <AppRouterCacheProvider>
      <FilterStoreProvider>
        <MapStoreProvider>
          <IframeStoreProvider>
            <ThemeProvider>
              <SWRConfig
                value={{
                  fetcher: async (url: string) => {
                    const res = await fetch(url);

                    // If the status code is not in the range 200-299, throw an error
                    if (!res.ok) {
                      const error = new Error(
                        "An error occurred while fetching the data."
                      );
                      throw error;
                    }

                    return res.json();
                  },
                }}
              >
                {children}
              </SWRConfig>
            </ThemeProvider>
          </IframeStoreProvider>
        </MapStoreProvider>
      </FilterStoreProvider>
    </AppRouterCacheProvider>
  );
}
