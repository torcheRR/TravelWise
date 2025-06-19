import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import PostCard from '@/components/PostCard';

export function usePostLikeStatus(postId: string, userId?: string) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLikeStatus, setUserLikeStatus] = useState<'like' | 'dislike' | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLikeStatus = useCallback(async () => {
    if (!postId || !userId) return;
    // Kullanıcının bu post için like/dislike durumu
    const { data: userLike } = await supabase
      .from('post_likes')
      .select('type')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();
    setUserLikeStatus(userLike?.type || null);
    // Toplam like/dislike sayısı
    const { count: likeCount } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('type', 'like');
    setLikes(likeCount || 0);
    const { count: dislikeCount } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('type', 'dislike');
    setDislikes(dislikeCount || 0);
  }, [postId, userId]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  const like = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (userLikeStatus === 'like') {
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
      } else if (userLikeStatus === 'dislike') {
        await supabase
          .from('post_likes')
          .update({ type: 'like' })
          .eq('user_id', userId)
          .eq('post_id', postId);
      } else {
        await supabase
          .from('post_likes')
          .insert({ user_id: userId, post_id: postId, type: 'like' });
      }
      await fetchLikeStatus();
    } finally {
      setLoading(false);
    }
  };

  const dislike = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (userLikeStatus === 'dislike') {
        await supabase
          .from('post_likes')
          .delete()
          .eq('user_id', userId)
          .eq('post_id', postId);
      } else if (userLikeStatus === 'like') {
        await supabase
          .from('post_likes')
          .update({ type: 'dislike' })
          .eq('user_id', userId)
          .eq('post_id', postId);
      } else {
        await supabase
          .from('post_likes')
          .insert({ user_id: userId, post_id: postId, type: 'dislike' });
      }
      await fetchLikeStatus();
    } finally {
      setLoading(false);
    }
  };

  return {
    likes,
    dislikes,
    userLikeStatus,
    like,
    dislike,
    loading,
    refetch: fetchLikeStatus,
  };
} 