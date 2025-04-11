"use client";
import React, { useContext, createContext, ReactNode } from "react";
import en from "@/assets/locales/en.json";
import vi from "@/assets/locales/vi.json";
interface User {
  langId?: "vi" | "en";
}
interface ContextValue {
  user?: User;
  languages?: Record<string, string> | any;
  locale?: string;
}
interface ProviderProps {
  children: ReactNode;
  value: ContextValue;
}
interface AppContext {
  context: ContextValue;
  setContext: React.Dispatch<React.SetStateAction<ContextValue>>;
}
const defaultContextValue: ContextValue = {
  user: {
    langId: "vi",
  },
  languages: {},
  locale: "vi",
};
export const Context = createContext<AppContext>({
  context: defaultContextValue,
  setContext: () => {},
});
export const Provider: React.FC<ProviderProps> = ({ children, value }) => {
  const [context, setContext] = React.useState<ContextValue>(value);

  React.useEffect(() => {
    const locales: Record<any, any> = {
      vi: vi,
      en: en,
    };
    setContext((s) => ({
      ...s,
      languages: locales[context?.locale ?? value.locale ?? "vi"],
      locale: context?.locale ?? value.locale ?? "vi",
    }));
  }, [context.locale, value.locale]);
  const values = { context, setContext };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};
export function useAppContext() {
  const appContext = useContext(Context);
  if (!appContext) {
    console.error("Error deploying Context!!!");
    throw new Error("useAppContext must be used within a Provider");
  }
  const { context, setContext } = appContext;
  return { context, setContext };
}
export const useTranslation = () => {
  const { context } = useContext(Context);
  if (!context) {
    throw new Error("useTranslation must be used within a Provider");
  }

  const getNestedTranslation = (obj: any, keyString: string) => {
    return keyString.split(".").reduce((acc, key) => {
      return acc && acc[key] ? acc[key] : keyString;
    }, obj);
  };
  function t(
    key: string,
    prefixes?: Record<string | any, string | any>
  ): string {
    key = key?.trim() || key;
    let translated = "";
    if (context.languages) {
      translated = getNestedTranslation(context.languages, key);
      if (translated === key) {
        console.warn(`No string '${key}' for locale '${context.locale}'`);
      }
    }
    // else {
    //     console.warn(`No languages defined for locale '${context.locale}'`);
    // }

    if (prefixes) {
      Object.keys(prefixes).forEach((k) => {
        translated = translated.replace(`{{${k}}}`, prefixes[k]);
      });
    }

    return translated;
  }

  return { t, locale: context?.locale };
};
