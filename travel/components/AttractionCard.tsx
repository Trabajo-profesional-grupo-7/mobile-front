import {
  Button,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export interface AttractionCardProps {
  data: {
    attraction_name: string;
    attraction_id: string;
    liked_count: string;
    done_count: string;
    avg_rating: string;
    city: string;
    country: string;
    photo: string;
  };
}

function sanitizeString(input: string): string {
  const regex = /[(){}[\]<>]/g;
  return input.replace(regex, "");
}

export const AttractionCard: React.FC<AttractionCardProps> = (
  props: AttractionCardProps
) => {
  const [location, setLocation] = useState(
    `${props.data.city}, ${props.data.country}`
  );
  return (
    <View style={styles.attractionCard}>
      <TouchableOpacity
        onPress={() => {
          router.navigate({
            pathname: "../feed/attraction",
            params: props.data,
          });
        }}
      >
        <View style={{ flexDirection: "row", backgroundColor: "transparent" }}>
          <Image
            style={{
              width: 150,
              height: 150,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
            source={
              props.data.photo
                ? { uri: props.data.photo }
                : { uri: "https://i.imgur.com/v6KaRnG.png" }
            }
          />
          <View style={{ padding: 5, backgroundColor: "transparent", flex: 1 }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ fontSize: 20, fontWeight: "bold" }}
            >
              {props.data.attraction_name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 14, fontStyle: "italic" }}
            >
              {<Ionicons name="location-outline" />}
              {props.data.city ? location : props.data.country}
            </Text>
            <View
              style={{
                justifyContent: "flex-end",
                flex: 1,
                backgroundColor: "transparent",
                padding: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  backgroundColor: "transparent",
                }}
              >
                <Text style={{ alignSelf: "flex-end" }}>
                  {<Ionicons name="heart" />}
                  {props.data.liked_count}{"  "}
                </Text>
                {props.data.avg_rating && (
                  <Text style={{ alignSelf: "flex-end" }}>
                    {<Ionicons name="star" />}
                    {props.data.avg_rating}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  attractionCard: {
    width: "95%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
    backgroundColor: "white",
    elevation: 5,
  },
});
