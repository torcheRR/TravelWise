import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../constants/theme";
import { getPosts, getComments } from "../config/supabase";
import { OPENROUTER_API_KEY } from "../config/openrouter";

export const AIChatScreen: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Merhaba, ben TravelWise gezi asistanınız! 😊\nNasıl bir gezi planlamak istersiniz? Gitmek istediğiniz yerle ilgili detay paylaşırsanız size yardımcı olmaktan mutluluk duyarım 🗺️✨🥰",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { from: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    const lower = userInput.trim().toLowerCase();
    if (["merhaba", "selam", "hey", "hi", "hello"].includes(lower)) {
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "Merhaba! 😊 Size nasıl yardımcı olabilirim? Gideceğiniz yer, yapmak istediğiniz etkinlik veya ilgi alanlarını belirtirseniz önerilerde bulunabilirim 🌍✨",
        },
      ]);
      setUserInput("");
      return;
    }

    setLoading(true);
    setError("");
    setUserInput("");

    try {
      const posts = await getPosts();

      const formattedPostsArray = await Promise.all(posts
        .map(async (p) => {
          const comments = await getComments(p.id);
          return `- Başlık: ${p.title}\n  Açıklama: ${
            p.description || "Açıklama belirtilmemiş"
          }\n  Konum: ${p.location || "Konum belirtilmemiş"} ${
            comments
              ? `\n  Yorumlar: ${comments.map((c) => c.content).join(", ")}`
              : ""
          }`;
        })
      );


      const prompt = `Uygulama içerisindeki bazı gezilecek yer önerileri şunlardır:\n\n${formattedPostsArray}\n\nKullanıcının sorusu: \"${userInput}\"\n\nSen TravelWise uygulamasının yapay zeka destekli seyahat asistanısın. Kullanıcıdan gelen istekleri analiz eder ve onun ilgi alanlarına en uygun gezilecek yer önerilerini sunarsın. Uygulamada kullanıcılar tarafından paylaşılmış gezilecek yer gönderileri bulunur. Öncelikle bu gönderiler arasında kullanıcının isteğiyle ilgili olanları analiz edersin. Eğer ilgili içerik mevcutsa, bu içerikler arasından en uygun yeri önerirsin. Eğer kullanıcının isteğiyle doğrudan eşleşen bir içerik bulamazsan, bunu kullanıcıya belirtmeden, kendi araştırmanı yapar ve internetten uygun bir öneri sunarsın. Böylece kullanıcı her zaman ilgili ve kaliteli bir öneri almış olur. Asla konuyla alakasız içerikler önerme. Eğer çok yakın veya benzer içerikler sunuyorsan, bunu doğal ve akıcı bir şekilde açıkla. Yanıtlarını sıcak, samimi ve kullanıcıyla sohbet ediyor gibi bir dille yaz. Gerektiğinde uygun şekilde emoji kullanabilirsin ama abartılı kullanmaktan kaçın. Ayrıca Örnek Davranışlar: Yanlış: 'Yukarıdaki gönderilerde isteğinizle eşleşen bir gönderi yok.'(Kullanıcı gönderileri görmediği için bu ifade kullanıcıya yabancı gelir.). Doğru: 'Sana sanatla iç içe, keyifli bir gün yaşatacak harika bir sergi önerim var 🎨 Şehrin merkezinde yer alan bu sanat galerisi, hem modern hem de klasik eserlerle dolu. Mutlaka görmelisin!'. Kullanıcıya isteğiyle alakalı olmayan bir yeri asla önerme. Önerilerin sadece İstanbul konumu içerisinde yer alan yerler olsun.`;

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemma-3-27b-it:free",
            messages: [
              {
                role: "system",
                content:
                  "Sen TravelWise uygulamasının yapay zeka destekli seyahat asistanısın. Kullanıcıdan gelen istekleri analiz eder ve onun ilgi alanlarına en uygun gezilecek yer önerilerini sunarsın. Uygulamada kullanıcılar tarafından paylaşılmış gezilecek yer gönderileri bulunur. Öncelikle bu gönderiler arasında kullanıcının isteğiyle ilgili olanları analiz edersin. Eğer ilgili içerik mevcutsa, bu içerikler arasından en uygun yeri önerirsin. Eğer kullanıcının isteğiyle doğrudan eşleşen bir içerik bulamazsan, bunu kullanıcıya belirtmeden, kendi araştırmanı yapar ve internetten uygun bir öneri sunarsın. Böylece kullanıcı her zaman ilgili ve kaliteli bir öneri almış olur. Asla konuyla alakasız içerikler önerme. Eğer çok yakın veya benzer içerikler sunuyorsan, bunu doğal ve akıcı bir şekilde açıkla. Yanıtlarını sıcak, samimi ve kullanıcıyla sohbet ediyor gibi bir dille yaz. Gerektiğinde uygun şekilde emoji kullanabilirsin ama abartılı kullanmaktan kaçın. Ayrıca Örnek Davranışlar: Yanlış: 'Yukarıdaki gönderilerde isteğinizle eşleşen bir gönderi yok.'(Kullanıcı gönderileri görmediği için bu ifade kullanıcıya yabancı gelir.). Doğru: 'Sana sanatla iç içe, keyifli bir gün yaşatacak harika bir sergi önerim var 🎨 Şehrin merkezinde yer alan bu sanat galerisi, hem modern hem de klasik eserlerle dolu. Mutlaka görmelisin!'. Kullanıcıya isteğiyle alakalı olmayan bir yeri asla önerme.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiMessage = data?.choices?.[0]?.message?.content;
      if (aiMessage) {
        setMessages((prev) => [
          ...prev,
          { from: "ai", text: aiMessage.trim() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "ai",
            text: "Üzgünüm 😢 şu anda yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.",
          },
        ]);

      }

    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }


  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <Text style={styles.title}>AI Seyahat Asistanı</Text>
      <ScrollView
        style={styles.answerBox}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.from === "user" ? styles.userMsg : styles.aiMsg}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {loading && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginTop: 8 }}
          />
        )}
      </ScrollView>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={COLORS.text.secondary}
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          disabled={loading}
        >
          <Ionicons name="send" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  answerBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    minHeight: 120,
  },
  aiMsg: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  userMsg: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  messageText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.md,
    textAlign: "center",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    marginBottom: SPACING.lg,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    paddingVertical: 8,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});

export default AIChatScreen;
