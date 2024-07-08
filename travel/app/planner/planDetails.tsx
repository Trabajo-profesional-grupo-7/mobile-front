import { dateParser } from "@/components/Parsers";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import { Attraction } from "./plans";

const PlanDetails = () => {
  const params = useLocalSearchParams();
  const plan = JSON.parse(params.plan as string);
  return (
    <ScrollView style={styles.container}>
      <View style={{alignItems:"center"}}>
        <Text style={styles.title}>{params.plan_name}</Text>
        <Text
          style={{
            fontSize: 8 * 3,
            fontStyle: "italic",
            color: Colors.light.primary,
            fontWeight: "600",
          }}
        >
          {params.destination}
        </Text>
        <Text style={{ fontSize: 8 * 2.5, color: "gray" }}>
          {dateParser(params.init_date as string)} -{" "}
          {dateParser(params.end_date as string)}
        </Text>
      </View>
      <View style={{ marginTop: 8 * 2, paddingBottom: 8 * 5 }}>
        {Object.keys(plan).map((date) => (
          <View key={date}>
            <Text style={{ fontSize: 8 * 3 }}>{dateParser(date)}</Text>
            {plan[date].map((attraction: Attraction) => (
              <TouchableOpacity
                key={attraction.attraction_id}
                style={styles.attraction}
              >
                <Text style={{ fontSize: 8 * 2.5 }}>
                  • {attraction.attraction_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
export default PlanDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8 * 2,
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
    overflow: "visible",
  },
});
