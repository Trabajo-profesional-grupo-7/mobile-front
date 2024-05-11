import { StyleSheet, Text, Dimensions } from 'react-native';

import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FlightDetails() {
    const params = useLocalSearchParams();
    return (
        <>
        <View style={styles.container}>
            <Text style={styles.title}>Departure airport</Text>
            <Text style={styles.subtitle}>{params.departureAirport}</Text>
            <Text style={styles.title}>Departure date</Text>
            <Text style={styles.subtitle}>{params.departureDate}</Text>
            <Text style={styles.title}>Departure time</Text>
            <Text style={styles.subtitle}>{params.departureTime}</Text>

            <Text style={styles.title}>Arrival airport</Text>
            <Text style={styles.subtitle}>{params.arrivalAirport}</Text>
            <Text style={styles.title}>Arrival date</Text>
            <Text style={styles.subtitle}>{params.arrivalDate}</Text>
            <Text style={styles.title}>Arrival time</Text>
            <Text style={styles.subtitle}>{params.arrivalTime}</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft:20
  },
  subtitle: {
    fontSize: 25,
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
