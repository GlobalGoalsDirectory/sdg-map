export const fallbackLng = "en";
export const languages = [fallbackLng, "de"];
export const defaultNS = "translation";

export function getOptions(lng: string = fallbackLng, ns: string = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // Do not allow empty strings as valid translations
    returnEmptyString: false,
    // Do not allow null as valid translations
    returnNull: false,
    // Do not allow ns separators
    nsSeparator: false as const,
    // Do not escape interpolation, otherwise forward slash is rendered
    // strangely
    // See: https://github.com/i18next/i18next/discussions/2199
    interpolation: {
      escapeValue: false,
    },
    // Allow key separators
    keySeparator: ".",
    // Log warning when a translation is missing
    missingKeyHandler: (lngs: readonly string[], ns: string, key: string) => {
      const message = `Translation for ${ns}:${key} not found in ${lngs}`;
      console.warn(message);
    },
  };
}
