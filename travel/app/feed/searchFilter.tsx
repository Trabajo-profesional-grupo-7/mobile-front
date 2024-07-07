import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import LoadingIndicator from "@/components/LoadingIndicator";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as Location from "expo-location";
import { LocationObjectCoords } from "expo-location";
import { useProfile } from "../context/ProfileContext";

export default function SearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selected, setSelected] = useState<string>("None");
  const { onRefreshToken } = useAuth();
  const { profile, setProfile } = useProfile();

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
    };

    const getCategories = async () => {
      setIsLoading(true);
      await onRefreshToken!();
      try {
        const result = await axios.get(`${API_URL}/metadata`);
        const data = result.data.attraction_types.map((category: string) => ({
          label: category
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          value: category,
        }));
        setCategories([{ label: "No category", value: "None" }, ...data]);
      } catch (e) {
        alert(e);
      }
      setIsLoading(false);
    };
    if (profile.coordinates === undefined) {
      getLocation();
    }
    getCategories();
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          if (searchTerm != "") {
            router.navigate({
              pathname: "../feed/searchResult",
              params: {
                searchTerm,
                selected,
                latitude: profile.coordinates?.latitude,
                longitude: profile.coordinates?.longitude,
              },
            });
          } else {
            alert("Please enter a search term")
          }
        }}
      >
        <Ionicons name="search-outline" size={35} />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Search term</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSearchTerm}
          value={searchTerm}
          placeholder="Search term"
        />

        <Text style={styles.title}>Category</Text>

        <View style={{ width: "70%", height: "40%", marginLeft: 20 }}>
          <Picker
            enabled={true}
            selectedValue={selected}
            onValueChange={(value) => {
              setSelected(value);
            }}
          >
            {categories.map((cat: { label: string; value: string }, index) => (
              <Picker.Item
                key={index}
                label={cat.label}
                value={cat.value}
                style={{ fontSize: 25 }}
              />
            ))}
          </Picker>
        </View>
      </View>

      {isLoading && <LoadingIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  chip: {
    marginLeft: 15,
    marginTop: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: windowWidth * 0.05,
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.9,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
  },
  floatingButton: {
    position: "absolute",
    zIndex: 1,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.secondary,
    borderRadius: 50,
    right: 30,
    top: windowHeight - 200,
  },
});
