import { supabase } from '../config/supabase';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export const DEFAULT_PROFILE_IMAGE = 'https://your-bucket-url/default_profile.png';

const getUserProfile = async (userId: string) => {
  console.log('getUserProfile çağrıldı, userId:', userId);
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('getUserProfile hatası:', error);
    throw error;
  }
  
  console.log('getUserProfile başarılı, data:', data);
  return data;
};

const updateUserProfile = async (userId: string, updates: {
  full_name?: string;
  username?: string;
  profile_image_url?: string;
}) => {
  // Eğer username değişiyorsa, önce kontrol edelim
  if (updates.username) {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', updates.username)
      .neq('id', userId)
      .single();

    if (existingUser) {
      throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
    }
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  return null;
};

const uploadProfileImage = async (userId: string, base64: string) => {
  try {
    const arrayBuffer = decode(base64);
    const fileExt = 'jpg';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    // avatar_url alanını güncelle
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export {
  getUserProfile,
  updateUserProfile,
  pickImage,
  uploadProfileImage
}; 