import type { TFunction } from "next-i18next";

// Translate type if it is one of the known types. Otherwise, return type as is.
const localizeOrganizationType = (t: TFunction, type: string): string => {
  if (type === "startup") return t("TYPE.STARTUP", { ns: "common" });
  if (type === "business") return t("TYPE.BUSINESS", { ns: "common" });
  if (type === "nonprofit") return t("TYPE.NONPROFIT", { ns: "common" });
  if (type === "other") return t("TYPE.OTHER", { ns: "common" });

  // Return type as is
  return type;
};

export default localizeOrganizationType;
