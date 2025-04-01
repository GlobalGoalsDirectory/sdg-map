import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import type { SdgNumber } from "@/types/SdgNumber";

const SDG_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
] as const;

type SustainableDevelopmentGoal = {
  number: SdgNumber;
  title: string;
  description: string;
};

const useSdgs = (): SustainableDevelopmentGoal[] => {
  const { t } = useTranslation("sdgs");

  const sdgs = useMemo((): SustainableDevelopmentGoal[] => {
    return SDG_NUMBERS.map((number) => ({
      number,
      // t('SDG_TITLE_1')
      // t('SDG_TITLE_2')
      // t('SDG_TITLE_3')
      // t('SDG_TITLE_4')
      // t('SDG_TITLE_5')
      // t('SDG_TITLE_6')
      // t('SDG_TITLE_7')
      // t('SDG_TITLE_8')
      // t('SDG_TITLE_9')
      // t('SDG_TITLE_10')
      // t('SDG_TITLE_11')
      // t('SDG_TITLE_12')
      // t('SDG_TITLE_13')
      // t('SDG_TITLE_14')
      // t('SDG_TITLE_15')
      // t('SDG_TITLE_16')
      // t('SDG_TITLE_17')
      title: t("SDG_TITLE_" + number),
      // t('SDG_DESCRIPTION_1')
      // t('SDG_DESCRIPTION_2')
      // t('SDG_DESCRIPTION_3')
      // t('SDG_DESCRIPTION_4')
      // t('SDG_DESCRIPTION_5')
      // t('SDG_DESCRIPTION_6')
      // t('SDG_DESCRIPTION_7')
      // t('SDG_DESCRIPTION_8')
      // t('SDG_DESCRIPTION_9')
      // t('SDG_DESCRIPTION_10')
      // t('SDG_DESCRIPTION_11')
      // t('SDG_DESCRIPTION_12')
      // t('SDG_DESCRIPTION_13')
      // t('SDG_DESCRIPTION_14')
      // t('SDG_DESCRIPTION_15')
      // t('SDG_DESCRIPTION_16')
      // t('SDG_DESCRIPTION_17')
      description: t("SDG_DESCRIPTION_" + number),
    }));
  }, [t]);

  return sdgs;
};

export default useSdgs;
export type { SustainableDevelopmentGoal };
