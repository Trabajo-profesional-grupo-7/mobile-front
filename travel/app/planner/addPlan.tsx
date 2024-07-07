import Colors from "@/constants/Colors";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { API_URL } from "../context/AuthContext";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const colors = Colors.light;

const NewPlan = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [value, setValue] = useState<{ label: string; value: string }>();
  const [data, setData] = useState([]);

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [loadingLocations, setLoadingLocations] = useState(false);

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

  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onChangeStartDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
    if (type == "set" && selectedDate) {
      console.log(selectedDate);
      setStartDate(selectedDate);
      setShowStartDatePicker(false);
    }
  };

  const onChangeEndDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
    if (type == "set" && selectedDate) {
      console.log(selectedDate);
      setEndDate(selectedDate);
      setShowEndDatePicker(false);
    }
  };

  return (
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
          minimumDate={startDate}
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
      <Text style={{ fontSize: 8 * 3, marginLeft: 8 }}>{city}</Text>
    </View>
  );
};

export default NewPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
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
