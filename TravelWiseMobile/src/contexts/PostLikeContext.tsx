import React, { createContext, useContext, useState, useCallback } from "react";

type LikeStatus = {
  [postId: string]: {
    status: "like" | "dislike" | null;
    likes: number;
    dislikes: number;
  };
};

type PostLikeContextType = {
  likeStatus: LikeStatus;
  updateLikeStatus: (
    postId: string,
    status: "like" | "dislike" | null,
    likes: number,
    dislikes: number
  ) => void;
};

const PostLikeContext = createContext<PostLikeContextType>({
  likeStatus: {},
  updateLikeStatus: () => {},
});

export const PostLikeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({});

  const updateLikeStatus = useCallback(
    (
      postId: string,
      status: "like" | "dislike" | null,
      likes: number,
      dislikes: number
    ) => {
      setLikeStatus((prev) => ({
        ...prev,
        [postId]: { status, likes, dislikes },
      }));
    },
    []
  );

  return (
    <PostLikeContext.Provider value={{ likeStatus, updateLikeStatus }}>
      {children}
    </PostLikeContext.Provider>
  );
};

export const usePostLike = () => useContext(PostLikeContext);
