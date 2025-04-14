import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  BookmarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

interface SavedPost {
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

const SavedPosts: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    setSavedPosts(posts);
  }, []);

  const handleRemovePost = (postId: number) => {
    const updatedPosts = savedPosts.filter((post) => post.id !== postId);
    localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
    setSavedPosts(updatedPosts);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Kaydedilen Gönderiler
          </h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Gönderiler</option>
                <option value="photos">Fotoğraflar</option>
                <option value="blogs">Blog Yazıları</option>
                <option value="guides">Gezi Rehberleri</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPosts.map((post) => (
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
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md">
                    <BookmarkIconSolid className="w-5 h-5 text-yellow-500" />
                  </button>
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
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        <span>{post.comments}</span>
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
                title="Kaydedilenlerden Kaldır"
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
