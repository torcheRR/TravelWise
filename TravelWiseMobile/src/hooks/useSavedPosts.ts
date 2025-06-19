import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

console.log('useSavedPosts HOOK ÇALIŞTI');

export function useSavedPosts(userId) {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedPosts = async () => {
    console.log('fetchSavedPosts ÇALIŞTI, userId:', userId);
    setLoading(true);
    const { data, error } = await supabase
      .from('saved_posts')
      .select('*, posts(*, user:user_id(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    console.log('SAVED POSTS DATA:', data, 'ERROR:', error);
    if (error) setError(error);
    else setSavedPosts(data);
    setLoading(false);
  };

  const savePost = async (postId) => {
    const { data, error } = await supabase
      .from('saved_posts')
      .insert([{ user_id: userId, post_id: postId }]);
    if (!error) fetchSavedPosts();
    return { data, error };
  };

  const unsavePost = async (postId) => {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    if (!error) fetchSavedPosts();
    return { error };
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [userId]);

  return { savedPosts, loading, error, refetch: fetchSavedPosts, savePost, unsavePost, savedPostIds: savedPosts.map((item) => item.posts?.id) };
} 