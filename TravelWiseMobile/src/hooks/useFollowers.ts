import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useFollowers(userId) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('followers')
      .select('*, users:follower_id(*)')
      .eq('user_id', userId);
    if (error) setError(error);
    else setFollowers(data);
    setLoading(false);
  };

  const fetchFollowing = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('followers')
      .select('*, users:user_id(*)')
      .eq('follower_id', userId);
    if (error) setError(error);
    else setFollowing(data);
    setLoading(false);
  };

  const follow = async (targetUserId) => {
    const { data, error } = await supabase
      .from('followers')
      .insert([{ user_id: targetUserId, follower_id: userId }]);
    if (!error) fetchFollowing();
    return { data, error };
  };

  const unfollow = async (targetUserId) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('user_id', targetUserId)
      .eq('follower_id', userId);
    if (!error) fetchFollowing();
    return { error };
  };

  useEffect(() => {
    fetchFollowers();
    fetchFollowing();
  }, [userId]);

  return { followers, following, loading, error, refetch: () => { fetchFollowers(); fetchFollowing(); }, follow, unfollow };
} 