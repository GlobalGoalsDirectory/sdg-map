import { Avatar, Typography, Stack } from "@mui/material";
import Image from "@/components/Image";
import getSdgIcon from "@/helpers/getSdgIcon";
import getSdgColor from "@/helpers/getSdgColor";

import type { OrganizationGeodata } from "@/types/Organization";
import type { SdgNumber } from "@/types/SdgNumber";

type MapMarkerTooltipProps = {
  organization: OrganizationGeodata;
};

const MapMarkerTooltip = ({ organization }: MapMarkerTooltipProps) => (
  <>
    <Typography variant="body2" fontWeight={700}>
      {organization.name}
    </Typography>
    {organization.sdgs.length > 0 && (
      <Stack direction="row" spacing={0.5} sx={{ marginTop: 0.5 }}>
        {organization.sdgs.slice(0, 3).map((number: SdgNumber) => (
          <Image
            key={number}
            src={getSdgIcon(number)}
            alt={`SDG ${number} icon`}
            width={30}
            height={30}
            style={{ backgroundColor: getSdgColor(number) }}
          />
        ))}
        {organization.sdgs.length > 3 && (
          <Avatar
            variant="square"
            sx={{
              color: "#666",
              height: 30,
              width: 30,
              fontSize: "1em",
            }}
          >
            +{organization.sdgs.length - 3}
          </Avatar>
        )}
      </Stack>
    )}
  </>
);

export default MapMarkerTooltip;
