import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  CameraIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  LinkIcon,
  XMarkIcon,
  GlobeAltIcon,
  MapPinIcon,
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface SocialMedia {
  platform: string;
  url: string;
  icon: any;
}

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  likes: number;
  comments: number;
  date: string;
  location: string;
}

interface UserProfile {
  name: string;
  location: string;
  bio: string;
  socialLinks: {
    [key: string]: string;
  };
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Kullanıcı Adı",
    location: "İstanbul, Türkiye",
    bio: "Gezgin | Fotoğrafçı | Seyahat Tutkunu",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      pinterest: "",
    },
  });
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const socialMediaLinks: SocialMedia[] = [
    {
      platform: "Facebook",
      url: profile.socialLinks.facebook || "#",
      icon: FaFacebook,
    },
    {
      platform: "Twitter",
      url: profile.socialLinks.twitter || "#",
      icon: FaTwitter,
    },
    {
      platform: "Instagram",
      url: profile.socialLinks.instagram || "#",
      icon: FaInstagram,
    },
    {
      platform: "LinkedIn",
      url: profile.socialLinks.linkedin || "#",
      icon: FaLinkedin,
    },
    {
      platform: "YouTube",
      url: profile.socialLinks.youtube || "#",
      icon: FaYoutube,
    },
    {
      platform: "Pinterest",
      url: profile.socialLinks.pinterest || "#",
      icon: FaPinterest,
    },
  ];

  useEffect(() => {
    // Kaydedilen gönderileri localStorage'dan al
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    setSavedPosts(savedPosts);

    // Kullanıcının gönderilerini localStorage'dan al
    const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    setUserPosts(userPosts);
  }, []);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "profile"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "cover") {
          setCoverPreview(reader.result as string);
        } else {
          setProfilePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      bio: formData.get("bio") as string,
      socialLinks: {
        facebook: formData.get("facebook") as string,
        twitter: formData.get("twitter") as string,
        instagram: formData.get("instagram") as string,
        linkedin: formData.get("linkedin") as string,
        youtube: formData.get("youtube") as string,
        pinterest: formData.get("pinterest") as string,
      },
    };
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleRemovePost = (postId: number) => {
    const updatedPosts = userPosts.filter((post) => post.id !== postId);
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
    setUserPosts(updatedPosts);
  };

  const handleRemoveSavedPost = (postId: number) => {
    const updatedPosts = savedPosts.filter((post) => post.id !== postId);
    localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
    setSavedPosts(updatedPosts);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      {/* Profil Başlığı */}
      <div className="bg-white shadow">
        <div className="relative h-48 bg-blue-600">
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Kapak fotoğrafı"
              className="w-full h-full object-cover"
            />
          )}
          <label className="absolute top-4 right-4 p-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-50">
            <CameraIcon className="w-6 h-6 text-gray-600" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "cover")}
            />
          </label>

          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profil fotoğrafı"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-50">
                <CameraIcon className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "profile")}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-4 px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-600 mt-1">{profile.location}</p>
              <p className="text-gray-600 mt-2">{profile.bio}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PencilIcon className="w-5 h-5" />
              <span>Profili Düzenle</span>
            </button>
          </div>

          <div className="flex space-x-4 mt-4">
            {socialMediaLinks.map(
              (social) =>
                social.url !== "#" && (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="text-gray-600 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                )
            )}
          </div>
        </div>
      </div>

      {/* Profil İstatistikleri */}
      <div className="grid grid-cols-3 gap-4 mt-6 px-8">
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowFollowers(true)}
        >
          <span className="text-2xl font-bold text-gray-900">24</span>
          <p className="text-gray-600 text-sm">Gönderiler</p>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowFollowers(true)}
        >
          <span className="text-2xl font-bold text-gray-900">142</span>
          <p className="text-gray-600 text-sm">Takipçiler</p>
        </div>
        <div
          className="bg-white p-4 rounded-lg shadow text-center cursor-pointer hover:bg-gray-50"
          onClick={() => setShowFollowing(true)}
        >
          <span className="text-2xl font-bold text-gray-900">98</span>
          <p className="text-gray-600 text-sm">Takip Edilenler</p>
        </div>
      </div>

      {/* Gönderi Filtreleme ve Sıralama */}
      <div className="mt-8 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Gönderiler</option>
              <option value="photos">Fotoğraflar</option>
              <option value="videos">Videolar</option>
              <option value="blogs">Blog Yazıları</option>
            </select>
            <FunnelIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="popular">En Popüler</option>
            </select>
            <ArrowsUpDownIcon className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Gönderiler */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map((post) => {
            // Gönderi detaylarını localStorage'dan al
            const postData = JSON.parse(
              localStorage.getItem(`post_${post.id}`) || "{}"
            );
            const likes = postData.likes?.count || 0;
            const comments = postData.comments?.length || 0;

            return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[1.02] relative group"
              >
                <Link to={`/post/${post.id}`} className="block">
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 hover:text-blue-700">
                        {post.author}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span>{comments}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {post.location}
                      </span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemovePost(post.id)}
                  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
                  title="Gönderiyi Sil"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kaydedilen Gönderiler */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Kaydedilen Gönderiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => {
            // Gönderi detaylarını localStorage'dan al
            const postData = JSON.parse(
              localStorage.getItem(`post_${post.id}`) || "{}"
            );
            const likes = postData.likes?.count || 0;
            const comments = postData.comments?.length || 0;

            return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[1.02] relative group"
              >
                <Link to={`/post/${post.id}`} className="block">
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600 hover:text-blue-700">
                        {post.author}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span>{comments}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {post.location}
                      </span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => handleRemoveSavedPost(post.id)}
                  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
                  title="Kaydedilenlerden Kaldır"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Takipçiler Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Takipçiler</h2>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Örnek takipçiler */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">Takipçi {i + 1}</p>
                    <p className="text-sm text-gray-500">@kullanici{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Takip Edilenler Modal */}
      {showFollowing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Takip Edilenler</h2>
              <button
                onClick={() => setShowFollowing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Örnek takip edilenler */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-medium">Takip Edilen {i + 1}</p>
                    <p className="text-sm text-gray-500">@kullanici{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profil Düzenleme Modalı */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Profili Düzenle
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <div className="relative">
                  <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    name="location"
                    defaultValue={profile.location}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biyografi
                </label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Sosyal Medya Bağlantıları
                </h3>
                {socialMediaLinks.map((social) => (
                  <div
                    key={social.platform}
                    className="flex items-center space-x-4"
                  >
                    <social.icon className="w-6 h-6 text-gray-600" />
                    <input
                      type="url"
                      name={social.platform.toLowerCase()}
                      defaultValue={
                        profile.socialLinks[social.platform.toLowerCase()]
                      }
                      placeholder={`${social.platform} URL`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
