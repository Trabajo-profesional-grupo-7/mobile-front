import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { router } from "expo-router";
import FloatingButton from "@/components/FloatingButton";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Weather() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");

  const validateFields = () => {
    if (city.length == 0) {
      alert("City field cannot be empty");
      return false;
    }
    return true;
  };

  const getWeatherInfo = async () => {
    if (validateFields()) {
      let requestString = `city=${city}`;
      if (country.length) {
        requestString = requestString.concat(`&country=${country}`);
      }
      if (province.length) {
        requestString = requestString.concat(`&province=${province}`);
      }
      console.log(requestString);
      router.navigate({
        pathname: "../information/weatherDetails",
        params: { requestString },
      });
    }
  };

  return (
    <View style={styles.container}>
      <FloatingButton icon={"search-outline"} onPress={getWeatherInfo} />
      <Text style={{ fontSize: 35, paddingBottom: 15 }}>
        Browse the weather forecast of your destination
      </Text>
      <Text style={styles.title}>City</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCity}
        value={city}
        placeholder="City"
      />

      <Text style={styles.title}>Country (optional)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCountry}
        value={country}
        placeholder="Country"
      />

      <Text style={styles.title}>Province (optional)</Text>
      <TextInput
        style={styles.input}
        onChangeText={setProvince}
        value={province}
        placeholder="Province"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.9,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    marginBottom: 15,
  },
});
