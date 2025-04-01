import type { SdgNumber } from "@/types/SdgNumber";

type Organization = {
  id: string;
  name: string;

  cover_image_id?: string;

  domain?: string;
  homepage?: string;
  description?: string;

  email_address?: string;
  phone_number?: string;

  facebook_handle?: string;
  facebook_url?: string;
  twitter_handle?: string;
  twitter_url?: string;
  linkedin_handle?: string;
  linkedin_url?: string;

  type?: string;

  street_address?: string;

  sdgs: SdgNumber[];
};

type OrganizationGeodata = {
  id: string;
  name: string;
  sdgs: SdgNumber[];
  latitude: number;
  longitude: number;
};

type OrganizationSearchResult = {
  id: string;
  name: string;
  domain: string;
  sdgs: SdgNumber[];
  latitude: number;
  longitude: number;
};

export type { Organization, OrganizationGeodata, OrganizationSearchResult };
