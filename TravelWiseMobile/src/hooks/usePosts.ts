import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface Post {
  id?: string;
  title: string;
  description: string;
  location: string;
  image_url: string;
  user_id?: string;
  category: string;
  likes_count?: number;
  dislikes_count?: number;
  comments_count?: number;
  created_at?: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user:user_id(*),
          comments_count,
          likes_count,
          dislikes_count
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (post: Post) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Kullanıcı bulunamadı");

    const postWithUserId = {
      ...post,
      user_id: user.id,
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postWithUserId]);
    
    if (!error) fetchPosts();
    return { data, error };
  };
  

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (!error) fetchPosts();
    return { error };
  };

  return {
    posts,
    loading,
    error,
    addPost,
    deletePost,
    refreshPosts: fetchPosts
  };
} 