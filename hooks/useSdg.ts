import { useMemo } from "react";
import useSdgs from "@/hooks/useSdgs";

import { SdgNumber } from "@/types/SdgNumber";

const useSdg = (number: SdgNumber | number) => {
  const sdgs = useSdgs();

  return useMemo(() => {
    const sdg = sdgs.find((sdg) => sdg.number === number);
    if (sdg) return sdg;

    throw new Error(`useSdg: Did not find SDG with number ${number}`);
  }, [sdgs, number]);
};

export default useSdg;
