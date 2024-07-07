import FloatingButton from "@/components/FloatingButton";
import { dateParser } from "@/components/Parsers";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
const windowHeight = Dimensions.get("window").height;
const colors = Colors.light;

interface PlanProps {
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

const PlanCard = ({ title, location, startDate, endDate }: PlanProps) => {
  return (
    <TouchableOpacity style={styles.planCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={{ fontStyle: "italic" }}>
        {dateParser(startDate.toISOString())} -{" "}
        {dateParser(endDate.toISOString())}
      </Text>
      <Text>
        <Ionicons name="location-outline" size={8 * 1.5} />
        {location}
      </Text>
    </TouchableOpacity>
  );
};

const Plans = () => {
  const plan = {
    title: "Rome plan",
    location: "Rome",
    startDate: new Date("2025-01-02"),
    endDate: new Date("2025-01-08"),
  };

  const router = useRouter();
  const [plans, setPlans] = useState([plan, plan]);

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
