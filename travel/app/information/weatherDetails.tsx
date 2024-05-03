import { StyleSheet, Image, Text, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL, useAuth } from '../context/AuthContext';
import LoadingIndicator from '@/components/LoadingIndicator';
import axios from 'axios';
import { dateParser } from '@/components/Parsers';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

const DateWeatherCard = ({date, weather}:{date:string, weather:{temperature:string, humidity:string, precipitation_probability:string,uv_index:string,visibility:string}}) => {
    let temperature = weather.temperature.toString().split(".")[0]
    return (
        <View style={styles.weatherCard}>
          <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <View>
              <Text style={{fontWeight:"bold", fontSize:20}}>{dateParser(date)}</Text>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <Ionicons name='water-outline' size={18}/>
                <Text>Humidity: {weather.humidity}</Text>
              </View>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <Ionicons name='rainy-outline' size={18}/>
                <Text>Precipitation chance: {weather.precipitation_probability}%</Text>
              </View>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <Ionicons name='sunny-outline' size={18}/>
                <Text>UV Index: {weather.uv_index}</Text>
              </View>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <Ionicons name='eye-outline' size={18}/>
                <Text>Visibility: {weather.visibility}</Text>
              </View>
            </View>
            <Text style={{fontSize:45, fontWeight:"bold"}}>{temperature}°C</Text>
          </View>
        </View>
    )
}

export default function WeatherDetails() {
    const params = useLocalSearchParams();
    const [location, setLocation] = useState("");
    const [country, setCountry] = useState("");
    const [province, setProvince] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {onRefreshToken} = useAuth();
    const [weatherData, setWeatherData] = useState([]);
    

    const getWeatherDetails = async () => {
        setIsLoading(true);
        await onRefreshToken!();
        try {
            const result = await axios.get(`${API_URL}/weather?${params.requestString}`);
            setWeatherData(result.data.five_day_weather)
            setLocation(result.data.location)
        } catch (e) {
          alert(e);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getWeatherDetails();
    }, []);

    return (
        <View style={styles.container}>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Weather results for:</Text>
            <Text style={{fontStyle:"italic", fontSize:30, alignSelf:"center", marginBottom:20}}>{location}</Text>
            {weatherData.map((item:any, index) => (
              <View key={index} style={{alignItems:"center"}}>
                <DateWeatherCard date={item.date} weather={item.weather}/>
            </View>
            ))}
          </ScrollView>
          {isLoading && (
            <LoadingIndicator/>
          )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:20,
    paddingVertical:10,
    alignContent:"center"
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.9,
    marginTop:0,
    borderWidth: 0,
    borderBottomWidth:1,
    borderBottomColor:Colors.light.primary,
    marginBottom:15
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
  },
  weatherCard: {
    backgroundColor:"white", 
    width:"90%",
    elevation:5,
    padding: 20,
    margin:5,
    borderRadius:5  
  }
});
