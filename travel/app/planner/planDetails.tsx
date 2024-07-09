import { dateParser } from "@/components/Parsers";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { PlanProps, usePlans } from "../context/PlansContext";
import { API_URL, useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
const windowWidth = Dimensions.get("window").width;

export interface Attraction {
  attraction_id: string;
  attraction_name: string;
  date: string;
}

const PlanDetails = () => {
  const { id } = useLocalSearchParams();
  const { plans, replacePlan } = usePlans();
  let plan = plans.find((plan) => plan.id === id) as PlanProps;
  const { onRefreshToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const replaceAttraction = async (
    attractionDate: string,
    attractionId: string
  ) => {
    setLoading(true);
    await onRefreshToken!();
    try {
      await axios.patch(`${API_URL}/plan/attraction`, {
        plan_id: id,
        date: attractionDate,
        attraction_id: attractionId,
      });
      const res = (await axios.get(`${API_URL}/plan/${id}`)).data;
      replacePlan(res);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const removeAttraction = async (
    attractionDate: string,
    attractionId: string
  ) => {
    setLoading(true);
    await onRefreshToken!();
    try {
      await axios.delete(`${API_URL}/plan/attraction`, {
        data: {
          plan_id: id,
          date: attractionDate,
          attraction_id: attractionId,
        },
      });
      const res = (await axios.get(`${API_URL}/plan/${id}`)).data;
      replacePlan(res);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: plan.image }}
          style={{ width: windowWidth, height: 8 * 32 }}
        />
        <View style={{ padding: 8 * 2, backgroundColor: "transparent" }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>{plan.plan_name}</Text>
            <Text
              style={{
                fontSize: 8 * 3,
                fontStyle: "italic",
                color: Colors.light.primary,
                fontWeight: "600",
              }}
            >
              {plan.destination}
            </Text>
            <Text style={{ fontSize: 8 * 2.5, color: "gray" }}>
              {dateParser(plan.init_date as string)} -{" "}
              {dateParser(plan.end_date as string)}
            </Text>
          </View>
          <View style={{ marginTop: 8 * 2, paddingBottom: 8 * 5 }}>
            {Object.keys(plan.plan).map((date) => (
              <View key={date}>
                <Text style={{ fontSize: 8 * 3 }}>{dateParser(date)}</Text>
                {plan.plan[date].map((attraction: Attraction) => (
                  <TouchableOpacity
                    key={attraction.attraction_id}
                    style={styles.attraction}
                    onPress={() => router.navigate({
                      pathname: "../feed/attraction",
                      params: {attraction_id: attraction.attraction_id, attraction_name: attraction.attraction_name},
                    })}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8 * 2.5,
                          flexWrap: "wrap",
                          width: "60%",
                        }}
                      >
                        {attraction.attraction_name}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 16 }}>
                        <TouchableOpacity
                          onPress={() =>
                            replaceAttraction(date, attraction.attraction_id)
                          }
                        >
                          <Ionicons name="reload" size={8 * 3.5} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            if (plan.plan[date].length > 1) {
                              removeAttraction(date, attraction.attraction_id);
                            } else {
                              alert("Can't delete all attractions from a given day")
                            }
                          }}
                        >
                          <Ionicons name="trash-outline" size={8 * 3.5} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {loading && <LoadingIndicator />}
    </>
  );
};
export default PlanDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    overflow: "visible",
  },
  title: {
    fontSize: 8 * 5,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  attraction: {
    backgroundColor: "white",
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 16,
    elevation: 3,
    borderRadius: 8,
  },
});
