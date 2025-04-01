import useSWRImmutable from "swr/immutable";
import { getPublicOrganizationEndpoint } from "@/helpers/apiEndpoints";

import type { Organization } from "@/types/Organization";

const useOrganizationIframe = (id: string | null) => {
  const { data, error, isLoading } = useSWRImmutable<Organization>(
    id != null ? getPublicOrganizationEndpoint(id) : null
  );

  return {
    organization: data,
    isLoading,
    isError: error,
  };
};

export default useOrganizationIframe;
