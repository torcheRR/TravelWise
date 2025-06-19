import React, { createContext, useContext, ReactNode, useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "./AuthContext";

interface Notification {
  id: string;
  user_id: string;
  from_user_id: string;
  comment_id: string;
  type: string;
  is_read: boolean;
  created_at: string;
  from_user?: {
    username: string;
    avatar_url: string;
    full_name: string;
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  loading: boolean;
  error: any;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "created_at">
  ) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext({} as NotificationsContextType);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          "*, from_user:users!fk_from_user(id, username, avatar_url, full_name)"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Bildirimler yüklenirken hata:", error);
        setError(error);
      } else {
        setNotifications(
          (data || []).map((n: any) => ({
            ...n,
            from_user: Array.isArray(n.from_user)
              ? n.from_user[0]
              : n.from_user,
          }))
        );
      }
    } catch (e) {
      console.error("Bildirimler yüklenirken hata:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
      await fetchNotifications();
    } catch (e) {
      console.error("Bildirim okundu olarak işaretlenirken hata:", e);
    }
  };

  const addNotification = async (
    notification: Omit<Notification, "id" | "created_at">
  ) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .insert([{ ...notification, user_id: user?.id }]);

      if (error) throw error;
      await fetchNotifications();
    } catch (e) {
      console.error("Bildirim eklenirken hata:", e);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        error,
        markAsRead,
        addNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
