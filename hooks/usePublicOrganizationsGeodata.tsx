import useSWRImmutable from "swr/immutable";
import { getPublicOrganizationsGeodataEndpoint } from "@/helpers/apiEndpoints";

import type { OrganizationGeodata } from "@/types/Organization";

const usePublicOrganizationsGeodata = (query: string) => {
  const { data, error, isLoading } = useSWRImmutable<OrganizationGeodata[]>(
    getPublicOrganizationsGeodataEndpoint(query),
    { keepPreviousData: true }
  );

  return {
    organizations: data,
    isInitialLoad: !data && !error,
    isLoading,
    isError: error,
  };
};

export default usePublicOrganizationsGeodata;
