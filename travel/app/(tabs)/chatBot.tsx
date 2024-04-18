import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import Colors from '../../constants/Colors';
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
const colors = Colors.light;


const ChatMessage = ({ message, isSender }:{message:string,isSender:boolean}) => {
    return (
      <View style={[styles.messageContainer, isSender ? styles.senderMessage : styles.receiverMessage]}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  };

export default function ChatBot() {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([
        { message: 'Hi there!', isSender: false },
        { message: 'Hello!', isSender: true },
        { message: 'How are you?', isSender: false },
        { message: 'I am good, thanks!', isSender: true },
    ])


    const sendMessage = () => {
        setMessages(messages.concat({message:text,isSender:true}))
        setText("")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{paddingHorizontal:15, paddingVertical:5}}>
                    {messages.map(({ message, isSender }, index) => (
                        <ChatMessage key={index} message={message} isSender={isSender} />
                    ))}
                </View>
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Type a message..."
                    style={styles.input}
                    multiline
                />
                <Ionicons name='send-outline' onPress={sendMessage} size={30} style={{ borderRadius: 50, backgroundColor: colors.background, padding: 10, margin: 10 }} />
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

})