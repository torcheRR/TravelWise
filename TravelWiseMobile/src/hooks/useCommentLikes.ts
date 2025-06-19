import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useCommentLikes(commentId, userId) {
  const [likeStatus, setLikeStatus] = useState(null); // null, true (like), false (dislike)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLikeStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') setError(error);
    else setLikeStatus(data ? data.is_like : null);
    setLoading(false);
  };

  const like = async () => {
    const { error } = await supabase
      .from('comment_likes')
      .upsert({ comment_id: commentId, user_id: userId, is_like: true });
    if (!error) fetchLikeStatus();
    return { error };
  };

  const dislike = async () => {
    const { error } = await supabase
      .from('comment_likes')
      .upsert({ comment_id: commentId, user_id: userId, is_like: false });
    if (!error) fetchLikeStatus();
    return { error };
  };

  const remove = async () => {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);
    if (!error) fetchLikeStatus();
    return { error };
  };

  useEffect(() => {
    if (commentId && userId) fetchLikeStatus();
  }, [commentId, userId]);

  return { likeStatus, loading, error, like, dislike, remove, refetch: fetchLikeStatus };
} 