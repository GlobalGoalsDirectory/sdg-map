import { SdgNumber } from "@/types/SdgNumber";
import { data } from "./source.json";
import type { Organization, OrganizationGeodata } from "@/types/Organization";
import { writeFileSync } from "fs";
import fsExtra from "fs-extra";

// Clear records
fsExtra.emptyDirSync("public/data/organizations");

const geodataRecords: OrganizationGeodata[] = [];

for (const item of data) {
  const sdgs = item.sdgs
    .slice(1, -1)
    .split(",")
    .map((sdg) => parseInt(sdg))
    .filter((sdg) => 1 <= sdg && sdg <= 17) as SdgNumber[];

  // Skip any records without SDGs
  if (!sdgs.length) {
    console.warn("Skipping record without SDGs", item.name);
    continue;
  }

  const geodata: OrganizationGeodata = {
    id: item.id,
    name: item.name,
    sdgs,
    latitude: item.latitude,
    longitude: item.longitude,
  };
  geodataRecords.push(geodata);

  // And write the record
  const organization: Organization = {
    id: item.id,
    name: item.name,
    cover_image_id: item?.cover_image_id ?? undefined,
    domain: item?.domain ?? undefined,
    homepage: item?.homepage ?? undefined,
    description: item?.description ?? undefined,
    email_address: item?.email_address ?? undefined,
    phone_number: item?.phone_number ?? undefined,
    facebook_handle: item?.facebook_handle ?? undefined,
    facebook_url: item?.facebook_url ?? undefined,
    twitter_handle: item?.twitter_handle ?? undefined,
    twitter_url: item?.twitter_url ?? undefined,
    linkedin_handle: item?.linkedin_handle ?? undefined,
    linkedin_url: item?.linkedin_url ?? undefined,
    street_address: item?.street_address ?? undefined,
    sdgs,
  };
  writeFileSync(
    `public/data/organizations/${item.id}.json`,
    JSON.stringify(organization, null, 2)
  );
}

writeFileSync(
  "public/data/organizations/geodata.json",
  JSON.stringify(geodataRecords, null, 2)
);
