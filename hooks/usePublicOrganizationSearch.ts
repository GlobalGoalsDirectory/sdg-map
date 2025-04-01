import useSWRImmutable from "swr/immutable";
import { getPublicOrganizationsSearchEndpoint } from "@/helpers/apiEndpoints";

import type { OrganizationSearchResult } from "@/types/Organization";

const usePublicOrganizationSearch = (query: string) => {
  const { data, error, isLoading } = useSWRImmutable<
    OrganizationSearchResult[]
  >(getPublicOrganizationsSearchEndpoint(query));

  return {
    organizations: data,
    isInitialLoad: !data && !error,
    isLoading,
    isError: error,
  };
};

export default usePublicOrganizationSearch;
