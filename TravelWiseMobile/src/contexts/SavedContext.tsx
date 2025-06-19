import React, { createContext, useContext, ReactNode } from 'react';
import { useSavedPosts } from '../hooks/useSavedPosts';

interface SavedProviderProps {
  userId: string;
  children: ReactNode;
}

const SavedContext = createContext({} as ReturnType<typeof useSavedPosts>);

export const SavedProvider = ({ userId, children }: SavedProviderProps) => {
  const savedData = useSavedPosts(userId);
  return (
    <SavedContext.Provider value={savedData}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSavedContext = () => useContext(SavedContext);
