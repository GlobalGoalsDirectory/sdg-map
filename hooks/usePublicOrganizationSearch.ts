import useSWRImmutable from "swr/immutable";
import { getPublicOrganizationsSearchEndpoint } from "@/helpers/apiEndpoints";

import type { OrganizationSearchResult } from "@/types/Organization";
import { useMemo } from "react";
import { normalizeStringForSearch } from "@/helpers/normalizeStringForSearch";

const usePublicOrganizationSearch = (query: string) => {
  const { data, error, isLoading } = useSWRImmutable<
    OrganizationSearchResult[]
  >(getPublicOrganizationsSearchEndpoint());

  // We are loading organizations from JSON, so we need to apply our query
  // filter manually
  const filteredOrganizations = useMemo(() => {
    const normalizedQuery = normalizeStringForSearch(query);
    return data?.filter((org) =>
      normalizeStringForSearch(org.name).includes(normalizedQuery)
    );
  }, [data, query]);

  return {
    organizations: filteredOrganizations,
    isInitialLoad: !data && !error,
    isLoading,
    isError: error,
  };
};

export default usePublicOrganizationSearch;
