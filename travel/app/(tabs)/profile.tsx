import {
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import mime from "mime";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect, useRouter } from "expo-router";
import { API_URL, useAuth } from "../context/AuthContext";
import axios, { AxiosError } from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
import * as ImagePicker from "expo-image-picker";
import { useProfile } from "../context/ProfileContext";
import FloatingButton from "@/components/FloatingButton";
const windowHeight = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const colors = Colors.light;

export default function ProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { onRefreshToken } = useAuth();
  const { profile, setProfile } = useProfile();

  const getProfileData = async () => {
    await onRefreshToken!();
    try {
      const result = (await axios.get(`${API_URL}/users`)).data;
      setProfile({
        ...profile,
        image: result.avatar_link,
      });
    } catch (e) {
      alert(e);
    }
  };

  function getRandomString(min: number, max: number): string {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    setIsLoading(true);
    await onRefreshToken!();

    let formData = new FormData();
    formData.append("avatar", {
      uri: image.uri,
      name: image.fileName?.toString() ?? `${getRandomString(0,9999999)}.jpg`,
      type: image.mimeType?.toString() ?? "image/jpg",
    } as any);

    try {
      await axios.post(`${API_URL}/users/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Imagen subida exitosamente:");
      getProfileData();
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0]);
    }
  };

  const navigateToEditProfile = () => {
    router.navigate({ pathname: "../profile/editProfile" });
  };

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <FloatingButton icon={"pencil"} onPress={navigateToEditProfile} />
          <ScrollView style={styles.container}>
            <View style={styles.topView}>
              <Pressable onPress={selectImage}>
                <Image
                  style={{
                    width: 140,
                    height: 140,
                    alignSelf: "center",
                    borderRadius: 100,
                    marginTop: 40,
                  }}
                  source={{
                    uri: profile.image
                      ? profile.image
                      : "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
                  }}
                />
              </Pressable>
              <Text
                style={{ fontSize: 8 * 4, fontWeight: "bold", marginTop: 4 }}
              >
                {profile.username}
              </Text>
              <Text
                style={{ color: "gray", fontSize: 8 * 3, marginVertical: 4 }}
              >
                {profile.email}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location-outline" size={8 * 2} />
                <Text style={{ fontSize: 8 * 2, marginVertical: 4 }}>
                  {profile.location}
                </Text>
              </View>
            </View>
            <View style={styles.bottomView}>
              <TouchableOpacity
                onPress={() => router.navigate("../profile/savedAttractions")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: width - 8 * 3,
                  padding: 8 * 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="bookmark-outline"
                    color={"#a6683f"}
                    size={8 * 5}
                    style={styles.iconContainer}
                  />
                  <Text
                    style={{
                      paddingLeft: 8 * 2,
                      fontSize: 8 * 2.5,
                      fontWeight: "bold",
                    }}
                  >
                    Attractions saved
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  color={"gray"}
                  size={8 * 4}
                  style={{ paddingRight: 8 * 2 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.navigate("../profile/doneAttractions")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: width - 8 * 3,
                  padding: 8 * 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="checkmark-done"
                    color={"#a6683f"}
                    size={8 * 5}
                    style={styles.iconContainer}
                  />
                  <Text
                    style={{
                      paddingLeft: 8 * 2,
                      fontSize: 8 * 2.5,
                      fontWeight: "bold",
                    }}
                  >
                    Attractions done
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  color={"gray"}
                  size={8 * 4}
                  style={{ paddingRight: 8 * 2 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.navigate("../profile/calendar")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: width - 8 * 3,
                  padding: 8 * 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    color={"#a6683f"}
                    size={8 * 5}
                    style={styles.iconContainer}
                  />
                  <Text
                    style={{
                      paddingLeft: 8 * 2,
                      fontSize: 8 * 2.5,
                      fontWeight: "bold",
                    }}
                  >
                    Calendar
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  color={"gray"}
                  size={8 * 4}
                  style={{ paddingRight: 8 * 2 }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  topView: {
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.background,
    marginHorizontal: 8 * 2,
    marginBottom: 8,
  },
  bottomView: {
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#fab78c",
    padding: 8,
    borderRadius: 50,
    opacity: 1,
  },
});
