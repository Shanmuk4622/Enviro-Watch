'use client';
import {createContext, useContext, ReactNode} from 'react';

const ApiKeyContext = createContext<string | null>(null);

export const ApiKeyProvider = ({
  apiKey,
  children,
}: {
  apiKey: string | null;
  children: ReactNode;
}) => {
  return <ApiKeyContext.Provider value={apiKey}>{children}</ApiKeyContext.Provider>;
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
