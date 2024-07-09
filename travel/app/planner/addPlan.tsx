import Colors from "@/constants/Colors";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { dateParser } from "@/components/Parsers";
import FloatingButton from "@/components/FloatingButton";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useRouter } from "expo-router";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const colors = Colors.light;
const CITY_PLACEHOLDER = "Choose a city";

const addOneDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

const NewPlan = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [value, setValue] = useState<{ label: string; value: string }>();
  const [data, setData] = useState([]);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateData = async (query: string) => {
    setLoadingLocations(true);
    try {
      const result = await axios.get(`${API_URL}/cities?keyword=${query}`);
      const formattedCities = result.data.cities.map(
        (city: { name: string; country: string }) => ({
          label: `${city.name}, ${city.country}`,
          value: `${city.name}, ${city.country}`,
        })
      );
      setData(formattedCities);
    } catch (e) {
      console.log(e);
    }
    setLoadingLocations(false);
  };
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addOneDay(new Date()));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { onRefreshToken } = useAuth();
  const onChangeStartDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowStartDatePicker(false);
    if (event.type == "set" && selectedDate) {
      setStartDate(selectedDate);
      setEndDate(addOneDay(selectedDate));
    }
  };

  const onChangeEndDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowEndDatePicker(false);
    if (event.type == "set" && selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const validateInputs = () => {
    if (!name.length || !city) return false;
    return true;
  };

  const createPlan = async () => {
    if (validateInputs()) {
      setLoading(true);
      await onRefreshToken!();
      try {
        axios.post(`${API_URL}/plan`, {
          plan_name: name,
          destination: city.split(",")[0],
          init_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        });
        router.back();
      } catch (e) {
        alert(e);
      }
      setLoading(false);
    } else {
      alert("Can't have empty fields");
    }
  };

  return (
    <>
      <FloatingButton icon="airplane" onPress={createPlan} />
      <View style={styles.container}>
        {showStartDatePicker && (
          <RNDateTimePicker
            value={startDate}
            onChange={onChangeStartDate}
            minimumDate={new Date()}
          />
        )}

        {showEndDatePicker && (
          <RNDateTimePicker
            value={endDate}
            onChange={onChangeEndDate}
            minimumDate={addOneDay(startDate)}
          />
        )}

        <Text style={styles.title}>Name the plan</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Name"
        />

        <Dropdown
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Choose a destination"
          placeholderStyle={styles.title}
          searchPlaceholder="Search..."
          value={value}
          renderRightIcon={() => (
            <View>
              {loadingLocations ? (
                <ActivityIndicator size={20} color="black" />
              ) : (
                <Ionicons name="caret-down" />
              )}
            </View>
          )}
          onChangeText={(query) => {
            if (query.length > 3) {
              setLoadingLocations(true);
              if (timer) {
                clearTimeout(timer);
              }
              setTimer(
                setTimeout(() => {
                  updateData(query);
                  setTimer(null);
                }, 1000)
              );
            } else if (query.length == 0) {
              setData([]);
            }
          }}
          onChange={(item) => {
            setCity(item.value);
            setValue(item);
          }}
        />
        <Text style={styles.subtitle}>{city ? city : CITY_PLACEHOLDER}</Text>

        <Text style={styles.title}>Start date</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.subtitle}>
            {dateParser(startDate.toISOString())} {startDate.getFullYear()}
          </Text>
          <Ionicons
            name="calendar-outline"
            onPress={() => setShowStartDatePicker(true)}
            size={35}
            style={{
              backgroundColor: colors.secondary,
              padding: 10,
              borderRadius: 30,
            }}
          />
        </View>

        <Text style={styles.title}>End date</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.subtitle}>
            {dateParser(endDate.toISOString())} {endDate.getFullYear()}
          </Text>
          <Ionicons
            name="calendar-outline"
            onPress={() => setShowEndDatePicker(true)}
            size={35}
            style={{
              backgroundColor: colors.secondary,
              padding: 10,
              borderRadius: 30,
            }}
          />
        </View>
      </View>
      {loading && <LoadingIndicator />}
    </>
  );
};

export default NewPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 8 * 3,
    marginLeft: 8,
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.9,
    marginBottom: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
  },
});
