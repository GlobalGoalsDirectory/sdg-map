import useSWRImmutable from "swr/immutable";
import { getPublicOrganizationsGeodataEndpoint } from "@/helpers/apiEndpoints";

import type { OrganizationGeodata } from "@/types/Organization";
import { useMemo } from "react";

const usePublicOrganizationsGeodata = (query: string) => {
  const { data, error, isLoading } = useSWRImmutable<OrganizationGeodata[]>(
    getPublicOrganizationsGeodataEndpoint(),
    { keepPreviousData: true }
  );

  // We are loading organizations from JSON, so we need to apply our query
  // filter manually
  const filteredOrganizations = useMemo(() => {
    const filters: Array<(org: OrganizationGeodata) => boolean> = [];
    const parsedQuery = new URLSearchParams(query);

    // Include organizations where at least one SDG matches the search filter
    if (parsedQuery.has("sdg")) {
      const sdgFilters = parsedQuery.getAll("sdg").map((sdg) => parseInt(sdg));
      filters.push((org: OrganizationGeodata) =>
        org.sdgs.some((sdg) => sdgFilters.includes(sdg))
      );
    }

    return data?.filter((org) => filters.every((f) => f(org)));
  }, [data, query]);

  return {
    organizations: filteredOrganizations,
    isInitialLoad: !data && !error,
    isLoading,
    isError: error,
  };
};

export default usePublicOrganizationsGeodata;
