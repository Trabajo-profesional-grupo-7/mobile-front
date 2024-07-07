import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import Colors from "@/constants/Colors";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProfileProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ProfileProvider>
  );
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="user/login" options={{ headerShown: false }} />
        <Stack.Screen name="user/signup" options={{ headerShown: false }} />
        <Stack.Screen
          name="user/selectCategories"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="user/recoverPassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="user/recoverCode"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="user/newPassword"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile/editProfile"
          options={{
            headerTitle: "Edit profile",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="profile/calendar"
          options={{
            headerTitle: "Calendar",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="profile/savedAttractions"
          options={{
            headerTitle: "Attractions saved",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="profile/doneAttractions"
          options={{
            headerTitle: "Attractions done",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="feed/searchFilter"
          options={{
            headerTitle: "Search filters",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="feed/searchResult"
          options={{
            headerTitle: "Search",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="feed/attraction"
          options={{
            headerTitle: "Attraction",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="information/exchangeRates"
          options={{
            headerTitle: "Echange rates",
            headerStyle: {
              backgroundColor: Colors.light.primary,
            },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="information/flightTracker"
          options={{
            headerTitle: "Flight tracker",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="information/flightDetails"
          options={{
            headerTitle: "Flight details",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="information/weather"
          options={{
            headerTitle: "Weather",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="information/weatherDetails"
          options={{
            headerTitle: "Weather",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="planner/plans"
          options={{
            headerTitle: "Planner",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="planner/addPlan"
          options={{
            headerTitle: "New plan",
            headerStyle: { backgroundColor: Colors.light.primary },
            headerTitleAlign: "center",
            headerTintColor: "white",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
