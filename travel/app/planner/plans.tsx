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
  Dimensions,
  RefreshControl,
} from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
import { PlanProps, usePlans } from "../context/PlansContext";

const PlanCard = (props: PlanProps) => {
  const router = useRouter();

  const navigateToPlan = () => {
    router.navigate({
      pathname: "../planner/planDetails",
      params: { id: props.id },
    });
  };

  return (
    <TouchableOpacity style={styles.planCard} onPress={navigateToPlan}>
      <Text style={styles.cardTitle}>{props.plan_name}</Text>
      <Text style={{ fontStyle: "italic" }}>
        {dateParser(props.init_date)} - {dateParser(props.end_date)}
      </Text>
      <Text>
        <Ionicons name="location-outline" size={8 * 1.5} />
        {props.destination}
      </Text>
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
    await getPlans();
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
        {plans.map((value, index) => (
          <PlanCard key={index} {...value} />
        ))}
      </ScrollView>
      {loading && <LoadingIndicator />}
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
    padding: 8 * 2,
    borderRadius: 8,
    margin: 8,
  },
  cardTitle: {
    fontSize: 8 * 3,
    fontWeight: "600",
  },
});
