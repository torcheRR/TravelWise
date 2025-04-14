import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Seyahat Deneyimlerinizi Paylaşın
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          TravelWise ile gezdiğiniz yerleri paylaşın, yapay zeka destekli
          öneriler alın ve yeni destinasyonlar keşfedin.
        </p>
      </section>

      {/* Featured Posts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Öne Çıkan Gönderiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Örnek Gönderi Kartları */}
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Gönderi resmi buraya gelecek */}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Örnek Gönderi Başlığı {i}
                </h3>
                <p className="text-gray-600 mb-4">
                  Bu bir örnek gönderi açıklamasıdır. Kullanıcılar kendi
                  deneyimlerini burada paylaşacaklar.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                    <span className="text-sm text-gray-600">Kullanıcı Adı</span>
                  </div>
                  <span className="text-sm text-gray-500">2 gün önce</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Popüler Kategoriler
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Plajlar", "Dağlar", "Şehirler", "Kültür"].map((category) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
