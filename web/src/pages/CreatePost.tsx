import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhotoIcon,
  MapPinIcon,
  TagIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface ImagePreview {
  id: string;
  url: string;
  file: File;
  description: string;
}

interface TagSuggestion {
  id: string;
  name: string;
  category: string;
  color: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: string;
}

const TAG_CATEGORIES = {
  gezi: {
    name: "Gezi",
    color: "bg-blue-100 text-blue-800",
    tags: [
      "gezi",
      "seyahat",
      "tatil",
      "turizm",
      "keşif",
      "macera",
      "doğa",
      "dağ",
      "deniz",
      "plaj",
    ],
  },
  yemek: {
    name: "Yemek",
    color: "bg-red-100 text-red-800",
    tags: [
      "yemek",
      "restoran",
      "cafe",
      "lezzet",
      "mutfak",
      "yemekkültürü",
      "foodie",
      "gurme",
    ],
  },
  kültür: {
    name: "Kültür",
    color: "bg-purple-100 text-purple-800",
    tags: [
      "kültür",
      "sanat",
      "müze",
      "tarih",
      "mimari",
      "festival",
      "etkinlik",
      "geleneksel",
    ],
  },
  aktivite: {
    name: "Aktivite",
    color: "bg-green-100 text-green-800",
    tags: [
      "spor",
      "yoga",
      "trekking",
      "bisiklet",
      "kamp",
      "fotoğrafçılık",
      "gezi",
      "macera",
    ],
  },
};

// Türkiye'deki il ve ilçeler
const TURKEY_LOCATIONS = {
  istanbul: {
    type: "İl",
    districts: [
      "Adalar",
      "Arnavutköy",
      "Ataşehir",
      "Avcılar",
      "Bağcılar",
      "Bahçelievler",
      "Bakırköy",
      "Başakşehir",
      "Bayrampaşa",
      "Beşiktaş",
      "Beykoz",
      "Beylikdüzü",
      "Beyoğlu",
      "Büyükçekmece",
      "Çatalca",
      "Çekmeköy",
      "Esenler",
      "Esenyurt",
      "Eyüpsultan",
      "Fatih",
      "Gaziosmanpaşa",
      "Güngören",
      "Kadıköy",
      "Kağıthane",
      "Kartal",
      "Küçükçekmece",
      "Maltepe",
      "Pendik",
      "Sancaktepe",
      "Sarıyer",
      "Silivri",
      "Sultanbeyli",
      "Sultangazi",
      "Şile",
      "Şişli",
      "Tuzla",
      "Ümraniye",
      "Üsküdar",
      "Zeytinburnu",
    ],
  },
  ankara: {
    type: "İl",
    districts: [
      "Akyurt",
      "Altındağ",
      "Ayaş",
      "Balâ",
      "Beypazarı",
      "Çamlıdere",
      "Çankaya",
      "Çubuk",
      "Elmadağ",
      "Etimesgut",
      "Evren",
      "Gölbaşı",
      "Güdül",
      "Haymana",
      "Kalecik",
      "Kahramankazan",
      "Keçiören",
      "Kızılcahamam",
      "Mamak",
      "Nallıhan",
      "Polatlı",
      "Pursaklar",
      "Sincan",
      "Şereflikoçhisar",
      "Yenimahalle",
    ],
  },
  izmir: {
    type: "İl",
    districts: [
      "Aliağa",
      "Balçova",
      "Bayındır",
      "Bayraklı",
      "Bergama",
      "Beydağ",
      "Bornova",
      "Buca",
      "Çeşme",
      "Çiğli",
      "Dikili",
      "Foça",
      "Gaziemir",
      "Güzelbahçe",
      "Karabağlar",
      "Karaburun",
      "Karşıyaka",
      "Kemalpaşa",
      "Kınık",
      "Kiraz",
      "Konak",
      "Menderes",
      "Menemen",
      "Narlıdere",
      "Ödemiş",
      "Seferihisar",
      "Selçuk",
      "Tire",
      "Torbalı",
      "Urla",
    ],
  },
  antalya: {
    type: "İl",
    districts: [
      "Akseki",
      "Aksu",
      "Alanya",
      "Demre",
      "Döşemealtı",
      "Elmalı",
      "Finike",
      "Gazipaşa",
      "Gündoğmuş",
      "İbradı",
      "Kaş",
      "Kemer",
      "Kepez",
      "Konyaaltı",
      "Korkuteli",
      "Kumluca",
      "Manavgat",
      "Muratpaşa",
      "Serik",
    ],
  },
};

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImagePreview[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
        description: "",
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handleImageDescriptionChange = (id: string, description: string) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, description } : img))
    );
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);

    if (value.trim()) {
      const suggestions: TagSuggestion[] = [];
      Object.entries(TAG_CATEGORIES).forEach(([category, data]) => {
        data.tags
          .filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
          .forEach((tag) => {
            suggestions.push({
              id: `${category}-${tag}`,
              name: tag,
              category: data.name,
              color: data.color,
            });
          });
      });
      setTagSuggestions(suggestions);
      setShowTagSuggestions(true);
    } else {
      setTagSuggestions([]);
      setShowTagSuggestions(false);
    }
  };

  const handleTagSelect = (suggestion: TagSuggestion) => {
    if (!tags.includes(suggestion.name)) {
      setTags([...tags, suggestion.name]);
    }
    setNewTag("");
    setShowTagSuggestions(false);
    setTagSuggestions([]);
    tagInputRef.current?.focus();
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getTagColor = (tag: string) => {
    for (const [_, data] of Object.entries(TAG_CATEGORIES)) {
      if (data.tags.includes(tag)) {
        return data.color;
      }
    }
    return "bg-gray-100 text-gray-800";
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.toLowerCase();
    setLocation(e.target.value);

    if (value.trim()) {
      const suggestions: LocationSuggestion[] = [];

      // İl ve ilçeleri ara
      Object.entries(TURKEY_LOCATIONS).forEach(([city, data]) => {
        // İl adında arama
        if (city.includes(value)) {
          suggestions.push({
            id: `city-${city}`,
            name: city.charAt(0).toUpperCase() + city.slice(1), // İlk harfi büyük yap
            address: data.type,
            type: "İl",
          });
        }

        // İlçelerde arama
        data.districts.forEach((district) => {
          if (district.toLowerCase().includes(value)) {
            suggestions.push({
              id: `district-${city}-${district}`,
              name: district,
              address: city.charAt(0).toUpperCase() + city.slice(1), // İlk harfi büyük yap
              type: "İlçe",
            });
          }
        });
      });

      // Turistik yerleri de ekle
      const touristPlaces = [
        {
          id: "1",
          name: "Sultanahmet Camii",
          address: "Sultanahmet, İstanbul",
          type: "Tarihi Yer",
        },
        {
          id: "2",
          name: "Galata Kulesi",
          address: "Beyoğlu, İstanbul",
          type: "Tarihi Yer",
        },
        {
          id: "3",
          name: "Kapadokya",
          address: "Nevşehir",
          type: "Doğal Güzellik",
        },
      ].filter(
        (loc) =>
          loc.name.toLowerCase().includes(value) ||
          loc.address.toLowerCase().includes(value)
      );

      setLocationSuggestions([...suggestions, ...touristPlaces]);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    if (suggestion.type === "İlçe") {
      setLocation(`${suggestion.name}, ${suggestion.address}`);
    } else {
      setLocation(suggestion.name);
    }
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    locationInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      id: Date.now(),
      title,
      description,
      location,
      images: images.map((img) => ({
        url: img.url,
        description: img.description,
      })),
      tags,
      createdAt: new Date().toISOString(),
      author: "Kullanıcı Adı", // Bu kısmı gerçek kullanıcı adıyla değiştirin
      likes: [],
      comments: [],
    };

    // Gönderiyi localStorage'a kaydet
    const existingPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
    existingPosts.push(postData);
    localStorage.setItem("userPosts", JSON.stringify(existingPosts));
    localStorage.setItem(`post_${postData.id}`, JSON.stringify(postData));

    // Formu sıfırla
    setTitle("");
    setDescription("");
    setLocation("");
    setImages([]);
    setTags([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          {images[0] && (
            <img
              src={images[0].url}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
          {location && (
            <div className="mt-2 flex items-center text-gray-500">
              <MapPinIcon className="w-5 h-5 mr-1" />
              {location}
            </div>
          )}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getTagColor(
                    tag
                  )} group`}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Yeni Gönderi Oluştur
            </h1>
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-white"
            >
              <EyeIcon className="w-5 h-5" />
              {isPreviewMode ? "Düzenle" : "Önizle"}
            </button>
          </div>

          {isPreviewMode ? (
            renderPreview()
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fotoğraf Yükleme */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Fotoğraflar <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-w-16 aspect-h-9 group"
                    >
                      <img
                        src={image.url}
                        alt={`Fotoğraf ${image.id}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(image)}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            <PencilIcon className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      {image.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                          {image.description}
                        </div>
                      )}
                    </div>
                  ))}
                  {images.length < 9 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-w-16 aspect-h-9 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-gray-50"
                    >
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <p className="mt-2 text-sm text-gray-500">
                  En az bir fotoğraf yüklemeniz gerekmektedir (maksimum 9
                  fotoğraf)
                </p>
              </div>

              {/* Fotoğraf Açıklama Modalı */}
              {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Fotoğraf Açıklaması
                    </h2>
                    <img
                      src={selectedImage.url}
                      alt="Seçili fotoğraf"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <textarea
                      value={selectedImage.description}
                      onChange={(e) =>
                        handleImageDescriptionChange(
                          selectedImage.id,
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bu fotoğraf hakkında bir açıklama ekleyin"
                      rows={3}
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      >
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Başlık */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                  placeholder="Gönderinize dikkat çekici bir başlık ekleyin"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Gönderinizi tanımlayan kısa ve öz bir başlık yazın
                </p>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-black bg-white">
                  Açıklama <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                  placeholder="Gönderiniz hakkında detaylı bilgi verin (en az 50 karakter)"
                  required
                  minLength={50}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Gönderiniz hakkında detaylı bilgi verin. Deneyimlerinizi,
                  önerilerinizi ve düşüncelerinizi paylaşın.
                </p>
              </div>

              {/* Konum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={locationInputRef}
                    type="text"
                    value={location}
                    onChange={handleLocationInputChange}
                    onFocus={() => setShowLocationSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    placeholder="Konum ekleyin veya önerilerden seçin"
                  />
                  {showLocationSuggestions && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {locationSuggestions.length > 0 && (
                        <div className="p-2">
                          <h3 className="text-sm font-medium text-gray-700 mb-1">
                            Önerilen Konumlar
                          </h3>
                          <div className="space-y-1">
                            {locationSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.id}
                                type="button"
                                onClick={() => handleLocationSelect(suggestion)}
                                className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                              >
                                <div className="font-medium truncate">
                                  {suggestion.name}
                                </div>
                                <div className="text-xs text-white truncate">
                                  {suggestion.address}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Gönderinizin nerede çekildiğini belirtmek için konum
                  ekleyebilirsiniz
                </p>
              </div>

              {/* Etiketler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiketler
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getTagColor(
                        tag
                      )} group`}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={newTag}
                    onChange={handleTagInputChange}
                    onFocus={() => setShowTagSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    placeholder="Etiket ekleyin veya önerilerden seçin"
                  />
                  {showTagSuggestions && tagSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      <div className="p-2">
                        {Object.entries(TAG_CATEGORIES).map(
                          ([category, data]) => (
                            <div key={category} className="mb-0.5">
                              <h3 className="text-sm font-medium text-gray-700 mb-0.5">
                                {data.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {data.tags
                                  .filter((tag) =>
                                    tag
                                      .toLowerCase()
                                      .includes(newTag.toLowerCase())
                                  )
                                  .map((tag) => (
                                    <button
                                      key={`${category}-${tag}`}
                                      type="button"
                                      onClick={() =>
                                        handleTagSelect({
                                          id: `${category}-${tag}`,
                                          name: tag,
                                          category: data.name,
                                          color: data.color,
                                        })
                                      }
                                      className={`px-2 py-0.5 rounded-full text-sm ${data.color} hover:opacity-80 whitespace-nowrap truncate max-w-[calc(100%-0.5rem)]`}
                                    >
                                      #{tag}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Gönderinizi kategorize etmek ve daha fazla kişiye ulaştırmak
                  için etiketler ekleyebilirsiniz
                </p>
              </div>

              {/* Gönder Butonu */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
