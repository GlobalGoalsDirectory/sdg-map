export const getPublicOrganizationsGeodataEndpoint = (query?: string) =>
  `/data/organizations/geodata.json`;

export const getPublicOrganizationsSearchEndpoint = (query: string) => {
  const queryString = new URLSearchParams({ query }).toString();

  return `/data/organizations/search?${queryString}`;
};

export const getPublicOrganizationEndpoint = (id: string) =>
  `/data/organizations/${id}.json`;
