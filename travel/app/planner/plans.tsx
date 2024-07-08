import FloatingButton from "@/components/FloatingButton";
import { dateParser } from "@/components/Parsers";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";
const windowHeight = Dimensions.get("window").height;
const colors = Colors.light;

export interface Attraction {
  attraction_id: string;
  attraction_name: string;
  date: string;
}

interface Plan {
  [date: string]: Attraction[];
}

export interface PlanProps {
  user_id: number;
  plan_name: string;
  destination: string;
  init_date: string;
  end_date: string;
  attractions: string[];
  plan: Plan;
  id: string;
}

const PlanCard = (props: PlanProps) => {
  const router = useRouter();

  const navigateToPlan = () => {
    router.navigate({
      pathname: "../planner/planDetails",
      params: { ...props, plan: JSON.stringify(props.plan) },
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
  const [plans, setPlans] = useState<PlanProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    getPlans();
  }, []);

  const navigateToAddPlan = () => {
    router.navigate("../planner/addPlan");
  };

  return (
    <>
      <FloatingButton icon={"add"} onPress={navigateToAddPlan} />
      <ScrollView style={styles.container}>
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
