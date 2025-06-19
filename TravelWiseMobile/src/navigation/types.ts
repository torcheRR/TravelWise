export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  PostDetail: {
    postId: string;
    commentId?: string;
  };
  CreatePost: undefined;
  Settings: undefined;
  Notifications: undefined;
}; 