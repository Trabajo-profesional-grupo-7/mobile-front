import LoadingIndicator from "@/components/LoadingIndicator";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { AttractionParams, sanitizeString } from "../(tabs)";
import Colors from "@/constants/Colors";
import { dateParser } from "@/components/Parsers";
import { AttractionCard } from "@/components/AttractionCard";
import { PlanProps, usePlans } from "../context/PlansContext";
import { PlanCard } from "../planner/plans";
const windowWidth = Dimensions.get("window").width;

type AttractionHash = {
  [key: string]: AttractionParams[];
};

type CaldendarDate = {
  [key: string]: {
    selected: boolean;
    selectedColor: string;
    textColor: string;
    start: boolean;
    end: boolean;
  };
};

export default function UserCalendar() {
  const [selected, setSelected] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [planDates, setPlanDates] = useState<string[]>([]);
  const { onRefreshToken } = useAuth();
  const [markedDates, setMarkedDates] = useState<CaldendarDate>();
  const [attractions, setAttractions] = useState<AttractionParams[]>();
  const [scheduledAttractions, setScheduledAttractions] =
    useState<AttractionHash>({});

  const calendarMarkTemplate = {
    end: true,
    selected: true,
    selectedColor: "#fa7620",
    start: true,
    textColor: "white",
  };
  const { plans, setPlans } = usePlans();

  const getScheduledAttractions = async () => {
    setLoading(true);
    await onRefreshToken!();
    try {
      const result = await axios.get(`${API_URL}/plan/user`);
      setPlans(result.data);
      const fetchedPlans: PlanProps[] = result.data;
      const allDates = fetchedPlans.reduce<string[]>((acc, plan) => {
        const planDates = Object.keys(plan.plan);
        return acc.concat(planDates);
      }, []);
      setPlanDates(allDates);
      const auxPlanDates = Array.from(new Set(allDates));
      let planDates: CaldendarDate = {};
      for (let i = 0; i < auxPlanDates.length; i++) {
        planDates[auxPlanDates[i]] = calendarMarkTemplate;
      }
      const attractions = await axios.get(
        `${API_URL}/attractions/scheduled-list?size=50`
      );
      if (attractions.data) {
        const dates: CaldendarDate = {};
        let hash: AttractionHash = {};
        for (const attraction of attractions.data) {
          const parsed_attraction: AttractionParams = {
            attraction_id: attraction.attraction_id,
            attraction_name: sanitizeString(attraction.attraction_name),
            liked_count: attraction.liked_count,
            done_count: attraction.done_count,
            avg_rating: attraction.avg_rating,
            city: attraction.city,
            country: attraction.country,
            photo: attraction.photo,
          };
          const date = attraction.scheduled_day.split("T")[0];
          if (date >= selected) {
            dates[date] = {
              start: true,
              end: true,
              selected: true,
              selectedColor: Colors.light.primary,
              textColor: "white",
            };
            if (hash[date]) {
              const attractionExists = hash[date].some(
                (attraction) =>
                  attraction.attraction_id === parsed_attraction.attraction_id
              );
              if (!attractionExists) {
                hash[date].push(parsed_attraction);
              }
            } else {
              hash[date] = [parsed_attraction];
            }
          }
        }
        setScheduledAttractions(hash);
        setMarkedDates({ ...dates, ...planDates });
      }
    } catch (e) {
      alert(e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (scheduledAttractions[selected]) {
      setAttractions(scheduledAttractions[selected]);
    }
  }, [scheduledAttractions]);

  useEffect(() => {
    const getData = async () => {
      getScheduledAttractions();
    };

    getData();
  }, []);

  const handleDayPress = (day: string) => {
    setAttractions([]);
    setSelected(day);
    if (scheduledAttractions[day]) {
      setAttractions(scheduledAttractions[day]);
    } else {
      setAttractions([]);
    }
  };

  return (
    <View
      style={{ alignItems: "center", justifyContent: "flex-start", flex: 1 }}
    >
      <Calendar
        style={{ width: windowWidth }}
        markingType={"multi-period"}
        initialDate={new Date().toDateString()}
        minDate={new Date().toDateString()}
        maxDate={"2032-05-30"}
        markedDates={markedDates}
        onDayPress={(day: { dateString: string }) => {
          handleDayPress(day.dateString);
        }}
        monthFormat={"yyyy/MM"}
        firstDay={1}
        onPressArrowLeft={(subtractMonth: () => any) => subtractMonth()}
        onPressArrowRight={(addMonth: () => any) => addMonth()}
        enableSwipeMonths={true}
      />
      <View
        style={{
          flex: 1,
          width: windowWidth,
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        {selected && (
          <Text style={{ fontSize: 25, alignSelf: "center" }}>
            {dateParser(selected)}
          </Text>
        )}
        {attractions?.length || planDates.includes(selected) ? (
          <ScrollView>
            <View style={{ marginTop: 5 }}></View>
            {planDates.includes(selected) && (
              <>
                <Text style={{ marginLeft: 8, fontSize: 8 * 4 }}>Plans</Text>
                {plans.map((value) => (
                  <View key={value.id}>
                    {selected in value.plan && <PlanCard {...value} />}
                  </View>
                ))}
              </>
            )}

            {Object.entries(scheduledAttractions).map(
              ([date, value]) => (
                <View key={date}>
                  {selected == date && (
                    <>
                      <Text style={{ marginLeft: 8, fontSize: 8 * 4 }}>
                        Attractions scheduled
                      </Text>
                      {value.map((att) => (
                        <AttractionCard
                          key={att.attraction_id}
                          data={att}
                        ></AttractionCard>
                      ))}
                    </>
                  )}
                </View>
              )
            )}
          </ScrollView>
        ) : (
          <Text
            style={{
              marginLeft: 8,
              fontSize: 8 * 4,
              alignSelf: "center",
              paddingVertical: 8 * 3,
              fontStyle: "italic",
              color: "gray",
            }}
          >
            No activities on this date
          </Text>
        )}
      </View>

      {loading && <LoadingIndicator />}
    </View>
  );
}
