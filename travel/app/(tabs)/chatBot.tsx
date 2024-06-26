import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import Colors from '../../constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import LoadingDots from "react-native-loading-dots";
const colors = Colors.light;

interface Message {
    message: string;
    isSender: boolean;
}

const ChatMessage = ({ message, isSender }:{message:string,isSender:boolean}) => {
    return (
      <View style={[styles.messageContainer, isSender ? styles.senderMessage : styles.receiverMessage]}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  };

export default function ChatBot() {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Message[]>([])
    const {onRefreshToken} = useAuth();
    const scrollViewRef = useRef(null);
    const [loading, setLoading] = useState(false)

    const sendMessage = async (sentText:string) => {
        setLoading(true)
        await onRefreshToken!();
        try {
            setMessages(prevMessages => [
                ...prevMessages,
                { message: sentText, isSender: true }
            ]);
            if (scrollViewRef.current) {
                (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
            }
            const result = await axios.post(`${API_URL}/chatbot/send_message`,{text:sentText} )
            if (result.data) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: result.data.message, isSender: false }
                ]);
            }
            if (scrollViewRef.current) {
                (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
            }
        } catch (e) {
            alert(e)
        }
        setLoading(false)
    }

    useEffect(() => {
        const initCoversation = async () => {
            await onRefreshToken!();
            try {
                await axios.post(`${API_URL}/chatbot/init?latitude=&longitude=`)
            } catch (e) {
                alert(e)
            }
        }
        initCoversation()
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
                <View style={{paddingHorizontal:15, paddingVertical:5}}>
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
                        colors={[colors.primary,"#E09032","#DF9E51","#DDAC72"]}
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
                <Ionicons name='send-outline' onPress={() => {sendMessage(text);setText("")}} size={30} style={{ borderRadius: 50, backgroundColor: colors.background, padding: 10, margin: 10 }} />
            </View>
        </View>
    )
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
        margin: 5
    },
    inputContainer: {
        backgroundColor: colors.primary, 
        alignItems: "center", 
        justifyContent: "center", 
        flexDirection: "row", 
        minHeight: 100, 
        maxHeight: 160, 
        paddingHorizontal: 10, 
        borderTopColor: colors.secondary, 
        borderTopWidth: 3
    },
    messageContainer: {
        maxWidth: '70%',
        marginBottom: 8,
        padding: 12,
        borderRadius: 8,
    },
    senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    },
    receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#9ec3ff', 
    },
    messageText: {
    fontSize: 16,
    color: '#333333',
    },
    dotsWrapper: {
        width: "20%",
        paddingLeft:20,
        paddingBottom:5,
        marginBottom:20,
        backgroundColor:"transparent",
        position:"absolute",
        bottom:100
    },

})