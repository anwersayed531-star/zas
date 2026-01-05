import { createContext, useContext, useState, ReactNode } from 'react';
import type { LanguageCode } from '@/components/LanguageSelector';

interface CodeContextType {
  sourceCode: string;
  translatedCode: Partial<Record<LanguageCode, string>>;
  setSourceCode: (code: string) => void;
  setTranslatedCode: (code: Partial<Record<LanguageCode, string>>) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider = ({ children }: { children: ReactNode }) => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [translatedCode, setTranslatedCode] = useState<Partial<Record<LanguageCode, string>>>({});

  return (
    <CodeContext.Provider value={{ sourceCode, translatedCode, setSourceCode, setTranslatedCode }}>
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error('useCode must be used within CodeProvider');
  }
  return context;
};
