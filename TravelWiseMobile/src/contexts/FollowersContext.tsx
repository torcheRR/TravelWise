import React, { createContext, useContext, ReactNode } from "react";
import { useFollowers } from "../hooks/useFollowers";

interface FollowersProviderProps {
  userId: string;
  children: ReactNode;
}

const FollowersContext = createContext({} as ReturnType<typeof useFollowers>);

export const FollowersProvider = ({
  userId,
  children,
}: FollowersProviderProps) => {
  const followersData = useFollowers(userId);
  return (
    <FollowersContext.Provider value={followersData}>
      {children}
    </FollowersContext.Provider>
  );
};

export const useFollowersContext = () => useContext(FollowersContext);
