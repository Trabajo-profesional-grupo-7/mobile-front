import { StyleSheet, Image, Text, Dimensions, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { router, useRouter } from 'expo-router';
import LoadingIndicator from '@/components/LoadingIndicator';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

export default function FlightTracker() {

  const [carrierCode, setCarrierCode] = React.useState(``);
  const [flightNumber, setFlightNumber] = useState(``);
  const [departureDate, setDepartureDate] = useState(``);

  const [isLoading, setIsLoading] = useState(false);
  const {onRefreshToken} = useAuth();

  const getFlightDetails = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      const result = await axios.get(`${API_URL}/flights/status?carrier_code=${carrierCode}&flight_number=${flightNumber}&departure_date=${departureDate}`);
      console.log(result.data)
      if (result.data) {
        router.navigate({
          pathname:"../information/flightDetails",
          params:{
            "departureAirport":result.data.departure_airport,
            "departureTime":result.data.flight_departure_time,
            "departureDate":result.data.flight_departure_date,
            "arrivalAirport":result.data.arrival_airport,
            "arrivalTime":result.data.flight_arrival_time,
            "arrivalDate":result.data.flight_arrival_date,
          }})
      }
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  return (
    <>
    <TouchableOpacity style={styles.floatingButton} onPress={getFlightDetails}>
        <Ionicons name='search-outline' size={35}/>
    </TouchableOpacity>
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
      <TextInput
        style={styles.input}
        onChangeText={setDepartureDate}
        value={departureDate}
        placeholder=""
      />

    </View>
    {isLoading && (
          <LoadingIndicator/>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft:20
  },
  chip: {
    marginLeft:15,
    marginTop:10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: windowWidth * 0.05,
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.9,
    margin: 12,
    marginTop:0,
    borderWidth: 0,
    borderBottomWidth:1,
    padding: 10,
    borderRadius:10,
    borderBottomColor:Colors.light.primary,
  },
  floatingButton: {
    position: 'absolute',
    zIndex:1,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.light.secondary,
    borderRadius:50,
    right:30,
    top:windowHeight-200
  }
});
