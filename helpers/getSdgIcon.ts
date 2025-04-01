import type { SdgNumber } from "@/types/SdgNumber";

const getSdgIcon = (number: SdgNumber): string =>
  `/static/sdgs/sdg${number}.svg`;

export default getSdgIcon;
