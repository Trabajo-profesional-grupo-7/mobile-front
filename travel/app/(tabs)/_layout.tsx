import "react-native-gesture-handler";

import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, Text, TouchableOpacity, Modal } from "react-native";
import Colors from "../../constants/Colors";
import { router, useRouter } from "expo-router";
import { API_URL, useAuth } from "../context/AuthContext";
import { confirmActionAlert } from "@/components/ConfirmActionAlert";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";
import { usePlans } from "../context/PlansContext";

const colors = Colors.light;

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { onRefreshToken, onLogout } = useAuth();
  const { profile, setProfile } = useProfile();
  const { setPlans } = usePlans();

  useEffect(() => {
    const getProfileData = async () => {
      await onRefreshToken!();
      try {
        const result = (await axios.get(`${API_URL}/users`)).data;
        console.log(result);
        setProfile({
          email: result.email,
          username: result.username,
          preferences: result.preferences,
          location: result.city,
          birthdate: result.birth_date,
          image: result.avatar_link,
          coordinates: undefined,
        });
      } catch (e) {
        alert(e);
      }
    };
    getProfileData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} scrollEnabled={false} style={{}}>
        <View style={{ marginBottom: 10 }}>
          <Image
            style={{
              width: 120,
              height: 120,
              alignSelf: "center",
              borderRadius: 100,
              marginTop: 20,
            }}
            source={{
              uri: profile.image
                ? profile.image
                : "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
            }}
          />
          <Text
            style={{
              alignSelf: "center",
              fontWeight: "700",
              fontSize: 18,
              marginVertical: 10,
            }}
          >
            {profile.username}
          </Text>
        </View>
        <DrawerItemList {...props}></DrawerItemList>
        <DrawerItem
          icon={({ size, color }) => (
            <Ionicons name="exit-outline" size={size} color={color} />
          )}
          label={"Logout"}
          onPress={async () => {
            if (await confirmActionAlert()) {
              onLogout!();
              setProfile({
                username: "",
                email: "",
                preferences: [],
                location: "",
                birthdate: undefined,
                image: undefined,
                coordinates: undefined,
              });
              setPlans([]);
              router.replace("../..");
            }
          }}
        />
      </DrawerContentScrollView>
    </View>
  );
}

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerActiveBackgroundColor: colors.primary,
          drawerActiveTintColor: colors.background,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Feed",
            headerTitle: "Feed",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerRight: () => (
              <Ionicons
                name="search-outline"
                style={{ paddingRight: 25 }}
                color={"white"}
                size={30}
                onPress={() => router.navigate("../feed/searchFilter")}
              />
            ),
            drawerIcon: ({ size, color }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            headerTitle: "Profile",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            drawerIcon: ({ size, color }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="chatBot"
          options={{
            drawerLabel: "ChatBot",
            headerTitle: "gIAn",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            drawerIcon: ({ size, color }) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="planner"
          options={{
            drawerLabel: "Planner",
            headerTitle: "Planner",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            drawerIcon: ({ size, color }) => (
              <Ionicons name="airplane-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="map"
          options={{
            drawerLabel: "Map",
            headerTitle: "Map",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            drawerIcon: ({ size, color }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="information"
          options={{
            drawerLabel: "Information",
            headerTitle: "Information",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: Colors.light.primary },
            drawerIcon: ({ size, color }) => (
              <Ionicons
                name="information-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
