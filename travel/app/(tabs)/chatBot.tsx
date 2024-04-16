import { View, Text, StyleSheet, TextInput } from "react-native";
import Colors from '../../constants/Colors';
import { Ionicons } from "@expo/vector-icons";
const colors = Colors.light;

export default function ChatBot() {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text>Aca va el chat</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type a message..."
                    style={styles.input}
                    multiline
                />
                <Ionicons name='send-outline' size={30} style={{ borderRadius: 50, backgroundColor: colors.background, padding: 10, margin: 10 }} />
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
    }

})