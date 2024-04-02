import { StyleSheet, Image, Text, Dimensions, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router, useRouter } from 'expo-router';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

export default function Information() {
    const [location, setLocation] = useState("");

    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                Hola
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setLocation}
                value={location}
                placeholder="Location"
            />
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.navigate("../information/exchangeRates")}>
                <Ionicons name='cash-outline' size={80}/>
                <Text style={styles.title}>
                Exchange rates
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => router.navigate("../information/weather")}>
                <Ionicons name='cloud-outline' size={80}/>
                <Text style={styles.title}>
                Weather
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceCard} onPress={() => router.navigate("../information/flightTracker")}>
                <Ionicons name='airplane-outline' size={80}/>
                <Text style={styles.title}>
                Flight tracker
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginLeft:20
  },
  input: {
    height: windowHeight*0.08,
    width: windowWidth*0.9,
    margin: 12,
    marginTop:0,
    borderWidth: 0,
    borderBottomWidth:1,
    padding: 10,
    borderRadius:10,
    borderBottomColor:Colors.light.primary,
    fontSize:25
  },
  serviceCard: {
    height: windowHeight*0.12,
    width:windowWidth*0.9,
    backgroundColor:"white",
    alignSelf:"center",
    marginVertical:10,
    borderRadius:10,
    elevation:5,
    alignItems:"center",
    padding:5,
    flexDirection:"row",
  }
});
