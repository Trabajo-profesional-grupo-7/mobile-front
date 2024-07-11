import { StyleSheet, Text, Dimensions, ScrollView } from "react-native";

import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import NavigationCard from "@/components/NavigationCard";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Information() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text
        style={{ fontSize: 25, paddingHorizontal: 20, marginVertical: 8 * 3 }}
      >
        Find the conversion rate between different currencies
      </Text>

      <NavigationCard
        onPress={() => router.navigate("../information/exchangeRates")}
        icon={"cash-outline"}
        text={"Exchange rates"}
      />

      <Text
        style={{ fontSize: 25, paddingHorizontal: 20, marginVertical: 8 * 3 }}
      >
        Get weather information for your destination
      </Text>

      <NavigationCard
        onPress={() => router.navigate("../information/weather")}
        icon={"cloud-outline"}
        text={"Weather"}
      />

      <Text
        style={{ fontSize: 25, paddingHorizontal: 20, marginVertical: 8 * 3 }}
      >
        Access details of your upcoming flights
      </Text>

      <NavigationCard
        onPress={() => router.navigate("../information/flightTracker")}
        icon={"airplane-outline"}
        text={"Flight tracker"}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginLeft: 20,
  },
  input: {
    height: windowHeight * 0.08,
    width: windowWidth * 0.9,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
    fontSize: 25,
  },
  serviceCard: {
    height: windowHeight * 0.12,
    width: windowWidth * 0.9,
    backgroundColor: "white",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    padding: 5,
    flexDirection: "row",
  },
});
