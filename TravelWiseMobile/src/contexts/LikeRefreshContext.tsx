import React, { createContext, useContext, useState } from "react";

const LikeRefreshContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const LikeRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);
  return (
    <LikeRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </LikeRefreshContext.Provider>
  );
};

export const useLikeRefresh = () => useContext(LikeRefreshContext);
