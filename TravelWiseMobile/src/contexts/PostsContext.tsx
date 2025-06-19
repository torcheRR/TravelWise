import React, { createContext, useContext, ReactNode } from "react";
import { usePosts } from "../hooks/usePosts";

interface PostsProviderProps {
  children: ReactNode;
}

const PostsContext = createContext({} as ReturnType<typeof usePosts>);

export const PostsProvider = ({ children }: PostsProviderProps) => {
  const postsData = usePosts();
  return (
    <PostsContext.Provider value={postsData}>{children}</PostsContext.Provider>
  );
};

export const usePostsContext = () => useContext(PostsContext);
