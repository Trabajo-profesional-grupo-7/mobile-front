import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { router } from "expo-router";
import LoadingIndicator from "@/components/LoadingIndicator";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import FloatingButton from "@/components/FloatingButton";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const colors = Colors.light;

export default function FlightTracker() {
  const [carrierCode, setCarrierCode] = React.useState(``);
  const [flightNumber, setFlightNumber] = useState(``);

  const [isLoading, setIsLoading] = useState(false);
  const { onRefreshToken } = useAuth();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    setShowDatePicker(false);
    if (selectedDate != undefined) {
      setDate(selectedDate);
    }
  };

  const getFlightDetails = async () => {
    if (carrierCode.length && flightNumber.length) {
      setIsLoading(true);
      await onRefreshToken!();
      try {
        const result = await axios.get(
          `${API_URL}/flights/status?carrier_code=${carrierCode}&flight_number=${flightNumber}&departure_date=${
            date.toISOString().split("T")[0]
          }`
        );
        if (result.data) {
          router.navigate({
            pathname: "../information/flightDetails",
            params: {
              departureAirport: result.data.departure_airport,
              departureTime: result.data.flight_departure_time,
              departureDate: result.data.flight_departure_date,
              arrivalAirport: result.data.arrival_airport,
              arrivalTime: result.data.flight_arrival_time,
              arrivalDate: result.data.flight_arrival_date,
            },
          });
        }
      } catch (e) {
        alert("We were unable to find that flight.");
      }
      setIsLoading(false);
    } else {
      alert("Can't have empty fields");
    }
  };

  return (
    <>
      <FloatingButton icon={"search-outline"} onPress={getFlightDetails} />
      <View style={styles.container}>
        <Text style={styles.title}>Carrier code</Text>
        <TextInput
          style={styles.input}
          onChangeText={setCarrierCode}
          value={carrierCode}
          placeholder="Carrier code"
        />

        <Text style={styles.title}>Flight number</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFlightNumber}
          value={flightNumber}
          placeholder="Flight number"
        />

        <Text style={styles.title}>Departure date</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {date.toISOString().split("T")[0]}
          </Text>
          <Ionicons
            name="calendar-outline"
            onPress={() => setShowDatePicker(true)}
            size={35}
            style={{
              backgroundColor: colors.secondary,
              padding: 10,
              borderRadius: 30,
            }}
          />
        </View>
      </View>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          onChange={onChangeDate}
          timeZoneOffsetInMinutes={60 * 3}
        />
      )}
      {isLoading && <LoadingIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
  },
  chip: {
    marginLeft: 15,
    marginTop: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: windowWidth * 0.05,
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.9,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
  },
});
