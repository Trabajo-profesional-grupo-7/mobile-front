import { StyleSheet, Image } from "react-native";

import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import AccountButton from "@/components/AccountButton";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

export default function InitialScreen() {
  const router = useRouter();

  async function onMessageReceived(message: any) {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId,
      },
    });
  }

  messaging().onMessage(onMessageReceived);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>gIAn</Text>
        <Image
          style={{
            width: 200,
            height: 200,
            alignSelf: "center",
            opacity: 0.8,
            marginTop: 20,
          }}
          source={{
            uri: "https://i.imgur.com/qc0GM7G.png",
          }}
        />
      </View>
      <View>
        <AccountButton
          title="Log In"
          onPress={() => router.navigate("user/login")}
        />
        <AccountButton
          title="Sign Up"
          onPress={() => router.navigate("user/signup")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    marginTop: 280,
  },
});
