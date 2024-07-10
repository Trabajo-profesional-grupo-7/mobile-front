import FloatingButton from "@/components/FloatingButton";
import { dateParser } from "@/components/Parsers";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
import { PlanProps, usePlans } from "../context/PlansContext";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
export const PlanCard = (props: PlanProps) => {
  const router = useRouter();

  const navigateToPlan = () => {
    router.navigate({
      pathname: "../planner/planDetails",
      params: { id: props.id },
    });
  };

  return (
    <TouchableOpacity style={styles.planCard} onPress={navigateToPlan}>
      <Image
        style={{
          height: 8 * 20,
          width: 8 * 20,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
        source={
          props.image
            ? { uri: props.image }
            : { uri: "https://i.imgur.com/v6KaRnG.png" }
        }
      />
      <View style={{ backgroundColor: "transparent", padding: 8 }}>
        <Text style={styles.cardTitle}>{props.plan_name}</Text>
        <Text style={{ fontStyle: "italic" }}>
          {dateParser(props.init_date)} - {dateParser(props.end_date)}
        </Text>
        <Text>
          <Ionicons name="location-outline" size={8 * 1.5} />
          {props.destination}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Plans = () => {
  const router = useRouter();
  const { onRefreshToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const { plans, setPlans } = usePlans();

  const getPlans = async () => {
    setLoading(true);
    await onRefreshToken!();
    try {
      const { data } = await axios.get(`${API_URL}/plan/user`);
      setPlans(data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  useEffect(() => {
    getPlans();
  }, []);

  const navigateToAddPlan = () => {
    router.navigate("../planner/addPlan");
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setLoading(true);
    await getPlans();
    setLoading(false);
    setRefreshing(false);
  }, []);

  return (
    <>
      <FloatingButton icon={"add"} onPress={navigateToAddPlan} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>My plans</Text>
        {loading ? (
          <View
            style={{
              backgroundColor: "transparent",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            <ShimmerPlaceholder style={styles.cardPlaceholder} />
            <ShimmerPlaceholder style={styles.cardPlaceholder} />
            <ShimmerPlaceholder style={styles.cardPlaceholder} />
            <Text
              style={{
                fontSize: 8 * 3,
                fontStyle: "italic",
                color: "gray",
                margin: 8,
              }}
            >
              Loading plans...
            </Text>
          </View>
        ) : plans.length ? (
          plans.map((value, index) => <PlanCard key={index} {...value} />)
        ) : (
          <View>
            <Text
              style={{
                fontSize: 8 * 5,
                color: "gray",
                fontStyle: "italic",
                margin: 8 * 3,
              }}
            >
              Looks like you haven't requested a personalized plan yet...
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Plans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8 * 2,
    width: "100%",
  },
  title: {
    fontSize: 8 * 4,
  },
  planCard: {
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 8,
    margin: 8,
    flexDirection: "row",
  },
  cardTitle: {
    fontSize: 8 * 3,
    fontWeight: "600",
  },
  cardPlaceholder: {
    width: "95%",
    height: 8 * 18,
    margin: 8,
    borderRadius: 4,
  },
});
