"use client";

import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { getOptions, languages } from "./settings";
import { PropsWithChildren, useEffect, useRef } from "react";

const runsOnServerSide = typeof window === "undefined";

type I18nProviderProps = PropsWithChildren<{
  language: string;
}>;

export const I18nProvider = ({ children, language }: I18nProviderProps) => {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    i18n
      .use(initReactI18next)
      .use(
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`./locales/${language}/${namespace}.json`)
        )
      )
      .init({
        ...getOptions(),
        lng: language,
        react: {
          // Fixes issue with map pane being rendered twice
          useSuspense: false,
        },
        preload: runsOnServerSide ? languages : [],
      });
    isInitialized.current = true;
  }

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
