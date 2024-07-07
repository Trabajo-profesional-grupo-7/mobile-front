import { StyleSheet, Dimensions, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import AccountButton from "@/components/AccountButton";
import React, { useState } from "react";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import Colors from "@/constants/Colors";
import { API_URL } from "../context/AuthContext";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
import { Ionicons } from "@expo/vector-icons";

const colors = Colors.light;

export default function NewPassword() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const email = params.email;
  const code = params.code;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const recoverPassword = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/users/password/recover`, {
        email,
        code,
        new_password: password,
      });
      router.replace("../..");
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insert new password</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="New password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <Ionicons
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={24}
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        />
      </View>
      <View style={styles.separator} />
      <AccountButton title="Confirm" onPress={recoverPassword} />
      {loading && <LoadingIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Math.round(windowHeight),
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  passwordRecoveryText: {
    fontWeight: "bold",
    color: colors.primary,
    fontStyle: "italic",
  },
  separator: {
    marginVertical: 30,
    width: "80%",
    marginTop: 230,
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.6,
    margin: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
  },
});
