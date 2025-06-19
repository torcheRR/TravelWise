import { useState } from 'react';
import { supabase } from '../services/supabase';

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    if (error) setError(error);
    else setComments(data);
    setLoading(false);
  };

  const addComment = async (comment) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment]);
    if (!error) fetchComments();
    return { data, error };
  };

  const deleteComment = async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (!error) fetchComments();
    return { error };
  };

  return { comments, loading, error, fetchComments, addComment, deleteComment };
} 