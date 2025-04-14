import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  CalendarIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";

interface Reply {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  showReplies: boolean;
  showReplyForm: boolean;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    if (postData.likes) {
      setIsLiked(postData.likes.isLiked || false);
      setLikeCount(postData.likes.count || 128);
    }
    if (postData.comments) {
      setComments(postData.comments);
    }

    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    setIsSaved(savedPosts.some((post: any) => post.id === Number(id)));
  }, [id]);

  const savePostData = (data: any) => {
    localStorage.setItem(`post_${id}`, JSON.stringify(data));
  };

  const handlePostLike = () => {
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    postData.likes = {
      isLiked: newIsLiked,
      count: newLikeCount,
    };
    savePostData(postData);
  };

  const handleCommentLike = (commentId: number) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        };
      }
      return comment;
    });

    setComments(updatedComments);

    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    postData.comments = updatedComments;
    savePostData(postData);
  };

  const handleReplyLike = (commentId: number, replyId: number) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                isLiked: !reply.isLiked,
              };
            }
            return reply;
          }),
        };
      }
      return comment;
    });

    setComments(updatedComments);

    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    postData.comments = updatedComments;
    savePostData(postData);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      user: {
        name: "Kullanıcı Adı",
        avatar: "",
      },
      text: comment,
      timestamp: "Şimdi",
      likes: 0,
      isLiked: false,
      replies: [],
      showReplies: false,
      showReplyForm: false,
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setComment("");

    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    postData.comments = updatedComments;
    savePostData(postData);
  };

  const handleReplySubmit = (commentId: number) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: Date.now(),
      user: {
        name: "Kullanıcı Adı",
        avatar: "",
      },
      text: replyText,
      timestamp: "Şimdi",
      likes: 0,
      isLiked: false,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
          showReplyForm: false,
          showReplies: true,
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyText("");

    const postData = JSON.parse(localStorage.getItem(`post_${id}`) || "{}");
    postData.comments = updatedComments;
    savePostData(postData);
  };

  const toggleReplies = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            showReplies: !comment.showReplies,
          };
        }
        return comment;
      })
    );
  };

  const toggleReplyForm = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            showReplyForm: !comment.showReplyForm,
          };
        }
        return comment;
      })
    );
  };

  const handleSavePost = () => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts") || "[]");
    const currentPost = {
      id: Number(id),
      title: "Kapadokya'da Büyülü Bir Gün",
      description: "Balon turu ve yeraltı şehri gezisi...",
      image: "https://source.unsplash.com/random/800x600?cappadocia",
      author: "@gezgin123",
      likes: likeCount,
      comments: comments.length,
      date: "23 Mart 2024",
      location: "Nevşehir, Türkiye",
    };

    if (isSaved) {
      const updatedPosts = savedPosts.filter(
        (post: any) => post.id !== Number(id)
      );
      localStorage.setItem("savedPosts", JSON.stringify(updatedPosts));
    } else {
      localStorage.setItem(
        "savedPosts",
        JSON.stringify([...savedPosts, currentPost])
      );
    }

    setIsSaved(!isSaved);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Gönderi Başlığı */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Kapadokya'da Büyülü Bir Gün
                  </h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>Nevşehir, Türkiye</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>23 Mart 2024</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to="/profile"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                @gezgin123
              </Link>
            </div>
          </div>

          {/* Gönderi İçeriği */}
          <div className="relative">
            <img
              src="https://source.unsplash.com/random/1200x800/?cappadocia"
              alt="Kapadokya"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handlePostLike}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
                >
                  {isLiked ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                  <span>{likeCount}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                  <ChatBubbleLeftIcon className="w-6 h-6" />
                  <span>{comments.length}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500">
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>
              <button
                onClick={handleSavePost}
                className="text-gray-600 hover:text-yellow-500"
              >
                {isSaved ? (
                  <BookmarkIconSolid className="w-6 h-6 text-yellow-500" />
                ) : (
                  <BookmarkIcon className="w-6 h-6" />
                )}
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              Kapadokya'da unutulmaz bir gün geçirdim. Sabah erken kalkıp balon
              turuna katıldım. Gökyüzünden vadileri izlemek inanılmaz bir
              deneyimdi. Ardından yeraltı şehrini gezdim ve yerel lezzetleri
              tattım. Bu bölgenin doğal güzellikleri ve tarihi dokusu gerçekten
              etkileyici.
            </p>

            {/* Yorumlar */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Yorumlar</h3>

              {/* Yorum Formu */}
              <form onSubmit={handleCommentSubmit} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Bir yorum yazın..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Gönder
                </button>
              </form>

              {/* Yorum Listesi */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {comment.user.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-1">{comment.text}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                          >
                            {comment.isLiked ? (
                              <HeartIconSolid className="w-4 h-4 text-red-500" />
                            ) : (
                              <HeartIcon className="w-4 h-4" />
                            )}
                            <span className="text-sm">{comment.likes}</span>
                          </button>
                          <button
                            onClick={() => toggleReplyForm(comment.id)}
                            className="text-sm text-gray-500 hover:text-blue-500"
                          >
                            Yanıtla
                          </button>
                          {comment.replies.length > 0 && (
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
                            >
                              <span>
                                {comment.showReplies
                                  ? "Yanıtları Gizle"
                                  : `${comment.replies.length} Yanıtı Göster`}
                              </span>
                              {comment.showReplies ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Yanıt Formu */}
                    {comment.showReplyForm && (
                      <div className="ml-14 flex space-x-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Yanıtla
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Yanıt Listesi */}
                    {comment.showReplies && comment.replies.length > 0 && (
                      <div className="ml-14 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {reply.user.name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {reply.timestamp}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1">{reply.text}</p>
                              <button
                                onClick={() =>
                                  handleReplyLike(comment.id, reply.id)
                                }
                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 mt-2"
                              >
                                {reply.isLiked ? (
                                  <HeartIconSolid className="w-4 h-4 text-red-500" />
                                ) : (
                                  <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="text-sm">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
