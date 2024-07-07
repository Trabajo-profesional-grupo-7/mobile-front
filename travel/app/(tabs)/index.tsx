import { StyleSheet, Dimensions, RefreshControl } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { AttractionCard } from "@/components/AttractionCard";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { useProfile } from "../context/ProfileContext";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const attractionsPerPage = 10;

export interface AttractionParams {
  attraction_id: string;
  attraction_name: string;
  likes_count: string;
  done_count: string;
  avg_rating: string;
  city: string;
  country: string;
  photo: string;
}

export function sanitizeString(input: string): string {
  const regex = /[(){}[\]<>]/g;
  return input.replace(regex, "");
}

export default function FeedScreen() {
  const [attractionsList, setAttractionsList] = useState({
    attractions: [],
    noMoreAttractions: false,
    cantGetAttractions: false,
    currentPage: 0,
  });
  const { onRefreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();

  const getAttractions = async () => {
    await onRefreshToken!();
    try {
      const result = await axios.get(
        `${API_URL}/attractions/recommendations?page=${attractionsList.currentPage}`
      );
      if (result.data) {
        const parsedPlaces: [] = result.data.map((place: AttractionParams) => ({
          attraction_id: place.attraction_id,
          attraction_name: sanitizeString(place.attraction_name),
          city: place.city,
          country: place.country,
          photo: place.photo,
        }));
        if (parsedPlaces.length < attractionsPerPage) {
          setAttractionsList((prevState) => {
            return {
              ...prevState,
              noMoreAttractions: true,
            };
          });
          if (attractionsList.currentPage == 0 && parsedPlaces.length == 0) {
            setAttractionsList((prevState) => {
              return {
                ...prevState,
                cantGetAttractions: true,
              };
            });
          }
        }
        setAttractionsList((prevState) => {
          return {
            ...prevState,
            attractions: [...prevState.attractions, ...parsedPlaces],
          };
        });
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404) {
          setAttractionsList((prevState) => {
            return {
              ...prevState,
              cantGetAttractions: true,
              noMoreAttractions: true,
            };
          });
        } else {
          alert(error.message);
        }
      } else {
        alert(error);
      }
    }
  };

  const renderAttraction = ({
    item,
  }: {
    item: {
      attraction_name: string;
      attraction_id: string;
      likes_count: string;
      done_count: string;
      avg_rating: string;
      city: string;
      country: string;
      photo: string;
    };
  }) => {
    return (
      <>
        <AttractionCard data={item} />
        <View></View>
      </>
    );
  };

  const renderLoader = () => {
    return (
      <View style={{ margin: 15 }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  };

  const loadMoreAttractions = () => {
    setAttractionsList((prevState) => {
      return {
        ...prevState,
        currentPage: prevState.currentPage + 1,
      };
    });
  };

  useEffect(() => {
    getAttractions();
  }, [attractionsList.currentPage]);

  const reloadFeed = async () => {
    setAttractionsList((prevState) => {
      return {
        ...prevState,
        currentPage: 0,
        attractions: [],
        noMoreAttractions: false,
        cantGetAttractions: false,
      };
    });
  
  };

  useEffect(() => {
    if (profile.preferences.length != 0) {
      reloadFeed();
    }
  }, [profile.preferences]);

  const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <View style={{ padding: 10, flexGrow: 1, paddingBottom: 30 }}>
      <FlatList
        data={attractionsList.attractions}
        renderItem={renderAttraction}
        style={{ width: "100%" }}
        ListHeaderComponent={
          <View style={{ alignItems: "flex-start" }}>
            <Text
              style={{ fontSize: 25, fontWeight: "bold", marginBottom: 10 }}
            >
              Recommended attractions
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          attractionsList.noMoreAttractions || attractionsList.cantGetAttractions ? null : renderLoader
        }
        onEndReached={attractionsList.noMoreAttractions ? null : loadMoreAttractions}
        onEndReachedThreshold={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  attractionCard: {
    width: "95%",
    height: 150,
    borderColor: Colors.light.primary,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.75,
    margin: 12,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "white",
  },
});
