import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, languages } from '../constants/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const savedLang = localStorage.getItem('prompt-engineer-lang');
      return savedLang || 'en';
    } catch (e) {
      console.warn('LocalStorage blocked, falling back to default language.');
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('prompt-engineer-lang', language);
    } catch (e) {
      // Ignore storage errors in useEffect
    }
  }, [language]);

  const t = (key: string, params: Record<string, any> = {}) => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{${paramKey}}`, params[paramKey]);
    });
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};

export { languages };