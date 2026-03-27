/**
 * CiviLens AI — Analysis Context
 *
 * React Context that holds the current analysis result so it can be
 * shared between AnalyzeView (producer) and AnalysisResultPage (consumer).
 */

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnalysisResult } from './types';

interface AnalysisContextValue {
  currentResult: AnalysisResult | null;
  inputText: string;
  setAnalysisData: (result: AnalysisResult, text: string) => void;
  clearResult: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [inputText, setInputText] = useState('');

  const setAnalysisData = (result: AnalysisResult, text: string) => {
    setCurrentResult(result);
    setInputText(text);
  };

  const clearResult = () => {
    setCurrentResult(null);
    setInputText('');
  };

  return (
    <AnalysisContext.Provider value={{ currentResult, inputText, setAnalysisData, clearResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return ctx;
}
