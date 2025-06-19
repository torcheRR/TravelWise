import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function usePostLikes(postId, userId) {
  const [likeStatus, setLikeStatus] = useState(null); // null, true (like), false (dislike)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLikeStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    if (error && error.code !== 'PGRST116') setError(error); // PGRST116: no rows found
    else setLikeStatus(data ? data.is_like : null);
    setLoading(false);
  };

  const like = async () => {
    const { error } = await supabase
      .from('post_likes')
      .upsert({ post_id: postId, user_id: userId, is_like: true });
    if (!error) fetchLikeStatus();
    return { error };
  };

  const dislike = async () => {
    const { error } = await supabase
      .from('post_likes')
      .upsert({ post_id: postId, user_id: userId, is_like: false });
    if (!error) fetchLikeStatus();
    return { error };
  };

  const remove = async () => {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (!error) fetchLikeStatus();
    return { error };
  };

  useEffect(() => {
    if (postId && userId) fetchLikeStatus();
  }, [postId, userId]);

  return { likeStatus, loading, error, like, dislike, remove, refetch: fetchLikeStatus };
} 