import LoadingIndicator from "@/components/LoadingIndicator";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Colors from "@/constants/Colors";
const colors = Colors.light;
import { API_URL, useAuth } from "../context/AuthContext";
import AccountButton from "@/components/AccountButton";
import axios from "axios";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { MultiSelect } from "react-native-element-dropdown";

export default function SelectCategories() {
  const params = useLocalSearchParams();
  const email = params.email as string;
  const date = params.date as string;
  const username = params.username as string;
  const password = params.password as string;
  const city = params.city as string;

  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { onRegister } = useAuth();

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(`${API_URL}/metadata`);
        const data = result.data.attraction_types.map((category: string) => ({
          label: category
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          value: category,
        }));
        setCategories(data);
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    };
    getCategories();
  }, []);

  const register = async () => {
    setIsLoading(true);
    if (selected.length < 1) {
      alert("You must select at least one category");
    } else {
      try {
        const result = await onRegister!(
          email,
          password,
          username,
          date,
          selected,
          city
        );
        if (result && result.code == 409) {
          alert("Email already in use");
        } else {
          alert("Account succesfully registered");
          router.back();
          router.back();
        }
      } catch (e) {
        alert(e);
      }
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 40, alignSelf: "flex-start" }}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            color: colors.primary,
            alignSelf: "flex-start",
            marginBottom: 30,
          }}
        >
          You can select up to 5 categories
        </Text>
      </View>
      <View style={{ width: "70%", height: "20%" }}>
        <MultiSelect
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Categories"
          searchPlaceholder="Search..."
          maxSelect={5}
          search
          value={selected}
          onChange={(item) => {
            setSelected(item);
          }}
        />
      </View>

      <View style={{ marginBottom: "20%", marginTop: "10%" }}>
        <AccountButton title="Sign up" onPress={register} />
      </View>
      {isLoading && <LoadingIndicator />}
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
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: 60,
    paddingBottom: 20,
    alignSelf: "flex-start",
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
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
