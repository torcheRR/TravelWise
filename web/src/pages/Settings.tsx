import { useState } from "react";
import {
  UserCircleIcon,
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showLocation: true,
    showActivity: true,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: any) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ayarlar</h1>

        {/* Profil Ayarları */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <UserCircleIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profil Ayarları
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Profil Fotoğrafı
                </h3>
                <p className="text-sm text-gray-500">
                  Profil fotoğrafınızı değiştirin
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Değiştir
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Kullanıcı Adı
                </h3>
                <p className="text-sm text-gray-500">@kullanici123</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Değiştir
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">E-posta</h3>
                <p className="text-sm text-gray-500">kullanici@email.com</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                Değiştir
              </button>
            </div>
          </div>
        </div>

        {/* Bildirim Ayarları */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <BellIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Bildirim Ayarları
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {key === "likes" && "Beğeni Bildirimleri"}
                    {key === "comments" && "Yorum Bildirimleri"}
                    {key === "follows" && "Takip Bildirimleri"}
                    {key === "messages" && "Mesaj Bildirimleri"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {key === "likes" &&
                      "Gönderilerinize gelen beğeniler hakkında bildirim alın"}
                    {key === "comments" &&
                      "Gönderilerinize gelen yorumlar hakkında bildirim alın"}
                    {key === "follows" &&
                      "Sizi takip edenler hakkında bildirim alın"}
                    {key === "messages" &&
                      "Gelen mesajlar hakkında bildirim alın"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      value ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {value ? "Açık" : "Kapalı"}
                  </span>
                  <button
                    onClick={() =>
                      handleNotificationChange(
                        key as keyof typeof notifications
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gizlilik Ayarları */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <LockClosedIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Gizlilik Ayarları
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Profil Görünürlüğü
                </h3>
                <p className="text-sm text-gray-500">
                  Profilinizi kimler görebilir
                </p>
              </div>
              <select
                value={privacy.profileVisibility}
                onChange={(e) =>
                  handlePrivacyChange("profileVisibility", e.target.value)
                }
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="public">Herkes</option>
                <option value="followers">Sadece Takipçiler</option>
                <option value="private">Sadece Ben</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Konum Gösterimi</h3>
                <p className="text-sm text-gray-500">Gönderilerinizde konum bilgisini göster</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${privacy.showLocation ? "text-green-600" : "text-gray-500"}`}>
                  {privacy.showLocation ? "Açık" : "Kapalı"}
                </span>
                <button
                  onClick={() => handlePrivacyChange("showLocation", !privacy.showLocation)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showLocation ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      privacy.showLocation ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Aktivite Gösterimi</h3>
                <p className="text-sm text-gray-500">Profilinizde aktivite durumunuzu göster</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${privacy.showActivity ? "text-green-600" : "text-gray-500"}`}>
                  {privacy.showActivity ? "Açık" : "Kapalı"}
                </span>
                <button
                  onClick={() => handlePrivacyChange("showActivity", !privacy.showActivity)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showActivity ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      privacy.showActivity ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diğer Ayarlar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <button className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <GlobeAltIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Dil ve Bölge
                  </h3>
                  <p className="text-sm text-gray-500">Türkçe, Türkiye</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <ShieldCheckIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Güvenlik
                  </h3>
                  <p className="text-sm text-gray-500">
                    Şifre ve güvenlik ayarları
                  </p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <QuestionMarkCircleIcon className="w-6 h-6 text-gray-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Yardım ve Destek
                  </h3>
                  <p className="text-sm text-gray-500">SSS ve destek merkezi</p>
                </div>
              </div>
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Çıkış Yap */}
        <button className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Settings;
