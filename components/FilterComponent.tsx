import { useTranslation } from "next-i18next";
import { isString } from "lodash";
import CheckboxFilter from "@/components/CheckboxFilter";
import useSdgs from "@/hooks/useSdgs";
import localizeOrganizationType from "@/helpers/localizeOrganizationType";
import getNumberRanges from "@/helpers/getNumberRanges";

import type { CheckboxFilterValue, Filter } from "@/types/Filter";
import type { renderButtonTextFn } from "@/components/CheckboxFilter";

type FilterComponentProps = {
  filter: Filter;
  variant: "text" | "outlined";
};

const FilterComponent = (props: FilterComponentProps) => {
  const { t } = useTranslation("filters");

  const name = props.filter.name;
  switch (name) {
    case "sdg":
      return <SdgFilter {...props} />;
    case "was_analyzed":
      return <WasAnalyzedFilter {...props} />;
    case "tag":
      return (
        <CheckboxFilter
          {...props}
          buttonLabel={t("FILTER.TAG.LABEL", { ns: "filters" })}
          autocompleteLabel={t("FILTER.TAG.AUTOCOMPLETE_LABEL", {
            ns: "filters",
          })}
        />
      );
    case "type":
      return <TypeFilter {...props} />;
    case "sector":
      return (
        <CheckboxFilter
          {...props}
          buttonLabel={t("FILTER.SECTOR.LABEL", { ns: "filters" })}
          autocompleteLabel={t("FILTER.SECTOR.AUTOCOMPLETE_LABEL", {
            ns: "filters",
          })}
        />
      );
    case "zip_code":
      return (
        <CheckboxFilter
          {...props}
          buttonLabel={t("FILTER.ZIP_CODE.LABEL", { ns: "filters" })}
          autocompleteLabel={t("FILTER.ZIP_CODE.AUTOCOMPLETE_LABEL", {
            ns: "filters",
          })}
        />
      );
    case "locality":
      return (
        <CheckboxFilter
          {...props}
          buttonLabel={t("FILTER.LOCALITY.LABEL", { ns: "filters" })}
          autocompleteLabel={t("FILTER.LOCALITY.AUTOCOMPLETE_LABEL", {
            ns: "filters",
          })}
        />
      );
    case "county":
      return (
        <CheckboxFilter
          {...props}
          buttonLabel={t("FILTER.COUNTY.LABEL", { ns: "filters" })}
          autocompleteLabel={t("FILTER.COUNTY.AUTOCOMPLETE_LABEL", {
            ns: "filters",
          })}
        />
      );
    default: {
      const exhaustiveCheck: never = name;
      throw new Error(`Unhandled filter name case: ${exhaustiveCheck}`);
    }
  }
};

const SdgFilter = (props: FilterComponentProps) => {
  const { t } = useTranslation(["common", "filters"]);
  const sdgs = useSdgs();

  const renderButtonText: renderButtonTextFn = ({ label, selectedOptions }) => {
    const sdgNumbers = selectedOptions
      .filter(isString)
      .map((option) => parseInt(option));

    return `${label}: ${getNumberRanges(sdgNumbers).join(", ")}`;
  };

  const getLongLabel = (option: CheckboxFilterValue) => {
    if (option === null) throw Error(`SDG null option is not supported..`);

    const sdg = sdgs.find((sdg) => sdg.number === parseInt(option));

    if (!sdg) throw Error(`SDG number ${option} not found...`);

    return t("SDG_NUMBER_AND_TITLE", {
      number: sdg.number,
      title: sdg.title,
      ns: "common",
    });
  };

  return (
    <CheckboxFilter
      {...props}
      buttonLabel={t("FILTER.SDGS.LABEL", { ns: "filters" })}
      autocompleteLabel={t("FILTER.SDGS.AUTOCOMPLETE_LABEL", { ns: "filters" })}
      getOptionLabelForAutocomplete={getLongLabel}
      renderButtonText={renderButtonText}
    />
  );
};

const WasAnalyzedFilter = (props: FilterComponentProps) => {
  const { t } = useTranslation("filters");

  const getShortLabel = (option: CheckboxFilterValue) => {
    if (option === null) return t("FILTER.LABELS.NO_VALUE", { ns: "filters" });

    if (option === "true")
      return t("FILTER.WAS_ANALYZED.BUTTON_LABELS.TRUE", {
        ns: "filters",
      });
    if (option === "false")
      return t("FILTER.WAS_ANALYZED.BUTTON_LABELS.FALSE", { ns: "filters" });
    return option;
  };

  const getLongLabel = (option: CheckboxFilterValue) => {
    if (option === null) return t("FILTER.LABELS.NO_VALUE", { ns: "filters" });

    if (option === "true")
      return t("FILTER.WAS_ANALYZED.AUTOCOMPLETE_LABELS.TRUE", {
        ns: "filters",
      });
    if (option === "false")
      return t("FILTER.WAS_ANALYZED.AUTOCOMPLETE_LABELS.FALSE", {
        ns: "filters",
      });
    return option;
  };

  return (
    <CheckboxFilter
      {...props}
      buttonLabel={t("FILTER.WAS_ANALYZED.LABEL", { ns: "filters" })}
      autocompleteLabel={t("FILTER.WAS_ANALYZED.AUTOCOMPLETE_LABEL", {
        ns: "filters",
      })}
      getOptionLabelForButton={getShortLabel}
      getOptionLabelForAutocomplete={getLongLabel}
    />
  );
};

const TypeFilter = (props: FilterComponentProps) => {
  const { t } = useTranslation(["common", "filters"]);

  const getOptionLabel = (option: CheckboxFilterValue) => {
    if (option === null) return t("FILTER.LABELS.NO_VALUE", { ns: "filters" });

    return localizeOrganizationType(t, option);
  };

  return (
    <CheckboxFilter
      {...props}
      buttonLabel={t("FILTER.TYPE.LABEL", { ns: "filters" })}
      autocompleteLabel={t("FILTER.TYPE.AUTOCOMPLETE_LABEL", {
        ns: "filters",
      })}
      getOptionLabelForButton={getOptionLabel}
      getOptionLabelForAutocomplete={getOptionLabel}
    />
  );
};

export default FilterComponent;
