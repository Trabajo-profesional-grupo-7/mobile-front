import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { AttractionCard } from "@/components/AttractionCard";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { AttractionParams, sanitizeString } from "../(tabs)";

export default function SearchResult() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [attractions, setAttractions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const { onRefreshToken } = useAuth();

  const getAttractions = async () => {
    await onRefreshToken!();
    try {
      let result;
      if (params.selected != "None") {
        result = await axios.post(
          `${API_URL}/attractions/search?type=${params.selected}&latitude=${params.latitude}&longitude=${params.longitude}`,
          { attraction_name: params.searchTerm }
        );
      } else {
        result = await axios.post(
          `${API_URL}/attractions/search?latitude=${params.latitude}&longitude=${params.longitude}`,
          { attraction_name: params.searchTerm }
        );
      }
      if (result.data) {
        const parsedPlaces = result.data.map((place: AttractionParams) => ({
          attraction_id: place.attraction_id,
          attraction_name: sanitizeString(place.attraction_name),
          city: place.city,
          country: place.country,
          photo: place.photo,
        }));
        setAttractions(parsedPlaces);
        if (parsedPlaces.length == 0) {
          setNoResults(true);
        }
      }
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  };

  const renderAttraction = ({ item }: { item: AttractionParams }) => {
    return <AttractionCard data={item}></AttractionCard>;
  };

  const renderLoader = () => {
    return (
      <View style={{ margin: 15 }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  };

  const loadMoreAttractions = () => {
    //getAttractions()
  };

  useEffect(() => {
    getAttractions();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {noResults ? (
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: 10,
              marginLeft: 10,
            }}
          >
            No results for your search
          </Text>
        ) : (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginBottom: 10,
                marginLeft: 10,
              }}
            >
              Search results
            </Text>
            <FlatList
              data={attractions}
              renderItem={renderAttraction}
              style={{ width: "100%" }}
              ListFooterComponent={loading ? renderLoader : null}
              onEndReached={loadMoreAttractions}
              onEndReachedThreshold={0}
            ></FlatList>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
