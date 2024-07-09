import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import LoadingDots from "react-native-loading-dots";
import { router } from "expo-router";
import * as Location from "expo-location";
import { useProfile } from "../context/ProfileContext";
const colors = Colors.light;
import Markdown from "react-native-markdown-display";

interface Message {
  message: string;
  isSender: boolean;
}

const ChatMessage = ({
  message,
  isSender,
}: {
  message: string;
  isSender: boolean;
}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isSender ? styles.senderMessage : styles.receiverMessage,
      ]}
    >
      <Markdown style={markdownStyles}>{message}</Markdown>
    </View>
  );
};

export default function ChatBot() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { onRefreshToken } = useAuth();
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useProfile();

  const sendMessage = async (sentText: string) => {
    setLoading(true);
    await onRefreshToken!();
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: sentText, isSender: true },
      ]);
      if (scrollViewRef.current) {
        (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
      }
      const result = await axios.post(`${API_URL}/chatbot/send_message`, {
        text: sentText,
      });
      if (result.data) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: result.data.message, isSender: false },
        ]);
      }
      if (scrollViewRef.current) {
        (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
      }
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Allow location access to search attractions");
        router.back();
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setProfile({
        ...profile,
        coordinates: {
          longitude: userLocation.coords.longitude,
          latitude: userLocation.coords.latitude,
        },
      });
      await onRefreshToken!();
      try {
        console.log(
          `${API_URL}/chatbot/init?latitude=${userLocation.coords.latitude}&longitude=${userLocation.coords.longitude}`
        );
        await axios.post(
          `${API_URL}/chatbot/init?latitude=${userLocation.coords.latitude}&longitude=${userLocation.coords.longitude}`
        );
      } catch (e) {
        alert(e);
      }
    };

    const initConversation = async () => {
      await onRefreshToken!();
      try {
        await axios.post(
          `${API_URL}/chatbot/init?latitude=${profile.coordinates?.latitude}&longitude=${profile.coordinates?.longitude}`
        );
      } catch (e) {
        alert(e);
      }
    };

    if (profile.coordinates === undefined) {
      getLocation();
    } else {
      initConversation();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
          {messages.map(({ message, isSender }, index) => (
            <ChatMessage key={index} message={message} isSender={isSender} />
          ))}
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.dotsWrapper}>
          <LoadingDots
            size={10}
            bounceHeight={5}
            colors={[colors.primary, "#E09032", "#DF9E51", "#DDAC72"]}
          />
        </View>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
          multiline
        />
        <Ionicons
          name="send-outline"
          onPress={() => {
            if (text.length) {
              sendMessage(text);
              setText("");
            }
          }}
          size={30}
          color={text.length ? colors.background : colors.text}
          style={{
            borderRadius: 50,
            backgroundColor: text.length ? colors.secondary : colors.background,
            padding: 10,
            margin: 10,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    fontSize: 18,
    width: "80%",
    height: "65%",
    padding: 10,
    margin: 5,
  },
  inputContainer: {
    backgroundColor: colors.dimmed,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 100,
    maxHeight: 160,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    marginBottom: 8,
    padding: 12,
    paddingBottom: 18,
    borderRadius: 8,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.secondary,
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#9ec3ff",
  },
  messageText: {
    fontSize: 8 * 2.5,
    color: colors.text,
    fontWeight: "500",
  },
  dotsWrapper: {
    width: "20%",
    paddingLeft: 20,
    paddingBottom: 5,
    marginBottom: 20,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 100,
  },
});

const markdownStyles = {
  body: {
    fontSize: 8 * 2.5,
  },
};
