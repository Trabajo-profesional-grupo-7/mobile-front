import {
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import AccountButton from "@/components/AccountButton";
import React, { useState } from "react";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import Colors from "@/constants/Colors";
import { API_URL } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

const colors = Colors.light;

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    if (currentDate != undefined) {
      setDate(currentDate);
    }
  };

  const validateFields = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !(
        password.length &&
        city.length &&
        username.length &&
        email.length &&
        date.toISOString().split("T")[0].length
      )
    ) {
      alert("Cant have empty fields");
      return false;
    }

    if (!regex.test(email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (password.length < 8) {
      alert("Passwords must be at least 8 characters long");
      return false;
    }

    if (password != repeatPassword) {
      alert("Passwords don't match");
      return false;
    }

    return true;
  };

  const register = async () => {
    if (validateFields()) {
      router.navigate({
        pathname: "../user/selectCategories",
        params: {
          email: email.toLocaleLowerCase().trim(),
          password,
          username,
          date: date.toISOString().split("T")[0],
          city,
        },
      });
    }
  };

  const [value, setValue] = useState<{ label: string; value: string }>();
  const [data, setData] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const updateData = async (query: string) => {
    setLoadingLocations(true);
    try {
      const result = await axios.get(`${API_URL}/cities?keyword=${query}`);
      const formattedCities = result.data.cities.map(
        (city: { name: string; country: string }) => ({
          label: `${city.name}, ${city.country}`,
          value: `${city.name}, ${city.country}`,
        })
      );
      setData(formattedCities);
    } catch (e) {
      console.log(e);
    }
    setLoadingLocations(false);
  };

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [city, setCity] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: "30%" }}>
        <Text style={styles.title}>Sign up</Text>
        <Dropdown
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Location"
          searchPlaceholder="Search..."
          value={value}
          renderRightIcon={() => (
            <View>
              {loadingLocations ? (
                <ActivityIndicator size={20} color="black" />
              ) : (
                <Ionicons name="caret-down" />
              )}
            </View>
          )}
          onChangeText={(query) => {
            if (query.length > 3) {
              setLoadingLocations(true);
              if (timer) {
                clearTimeout(timer);
              }
              setTimer(
                setTimeout(() => {
                  updateData(query);
                  setTimer(null);
                }, 1000)
              );
            } else if (query.length == 0) {
              setData([]);
            }
          }}
          onChange={(item) => {
            setCity(item.value);
            setValue(item);
          }}
        />
        <Text style={[styles.subtitle, { marginLeft: 20, fontSize: 25 }]}>
          {city}
        </Text>

        <Text style={styles.subtitle}>Username</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
        />
        <Text style={styles.subtitle}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
        />
        <Text style={styles.subtitle}>Password</Text>
        <View style={styles.input}>
          <TextInput
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            style={{ flex: 1 }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <Ionicons
            style={{ alignSelf: "center", marginBottom: -4 }}
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          />
        </View>
        <Text style={styles.subtitle}>Repeat password</Text>
        <View style={styles.input}>
          <TextInput
            onChangeText={setRepeatPassword}
            value={repeatPassword}
            style={{ flex: 1 }}
            placeholder="Repeat password"
            secureTextEntry={!showRepeatPassword}
            autoCapitalize="none"
          />
          <Ionicons
            style={{ alignSelf: "center", marginBottom: -4 }}
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            onPress={() => {
              setShowRepeatPassword(!showRepeatPassword);
            }}
          />
        </View>
        <View style={{ width: windowWidth * 0.6 }}>
          <Text style={styles.subtitle}>Birthday</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.subtitle}>
              {date.toISOString().split("T")[0]}
            </Text>
            <Ionicons
              name="calendar-outline"
              onPress={() => setShowDatePicker(true)}
              size={35}
              style={{
                backgroundColor: colors.secondary,
                padding: 10,
                borderRadius: 30,
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ marginBottom: "15%" }}>
        <AccountButton title="Continue" onPress={register} />
      </View>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          minimumDate={new Date("1900-01-01")}
          display={"spinner"}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: Math.round(windowHeight),
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
