import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "de"

const translations = {
    en: {
        select: "Select",
        back: "Back",
        new: "New",
        download: "Download",
        exit: "Exit",
    },
    de: {
        select: "Auswählen",
        back: "Zurück",
        new: "Neu",
        download: "Herunterladen",
        exit: "Verlassen",
    }
}

type Translation = (typeof translations)[Language];

type LanguageState = {
    language: Language,
    t: Translation,
    setLanguage: ((lang: Language) => void) | null,
}

const LanguageContext = createContext<LanguageState | null>(null);

export default function LanguageProvider({ children } : { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem("language");

        if (stored === "en" || stored === "de") {
            return stored;
        } else {
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "de") {
                return "de";
            }

        }

        return "en";
    });

    function setLanguageState(lang: Language) {
        localStorage.setItem("language", lang)
        setLanguage(lang);
    }

    const state = {
        language: language,
        t: translations[language],
        setLanguage: setLanguageState,
    };

    return (
        <LanguageContext.Provider value={state}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const language = useContext(LanguageContext);

    if (!language) {
        const newLang: LanguageState = {
            language: "en",
            t: translations.en,
            setLanguage: null,
        }
        return newLang;
    }

    return language;
}

export function getLangID(lang: Language) {
    switch (lang) {
        case "en":
            return 0;
        case "de":
            return 1;
        default:
            return -1;
    }
}
