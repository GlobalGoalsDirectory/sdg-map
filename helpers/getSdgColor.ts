const COLORS = {
  1: "#E5243B",
  2: "#DDa63a",
  3: "#4c9f38",
  4: "#c5192D",
  5: "#ff3a21",
  6: "#26BDE2",
  7: "#fcc30B",
  8: "#a21942",
  9: "#fD6925",
  10: "#DD1367",
  11: "#fD9D24",
  12: "#Bf8B2E",
  13: "#3f7E44",
  14: "#0a97D9",
  15: "#56c02B",
  16: "#00689D",
  17: "#19486a",
} as const;

import type { SdgNumber } from "@/types/SdgNumber";

const getSdgColor = (sdg: SdgNumber) => COLORS[sdg];

export default getSdgColor;
