import { StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';

import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import MapView, { Callout, Details, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { LocationObjectCoords } from 'expo-location';
import * as Location from 'expo-location';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import LoadingDots from 'react-native-loading-dots';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface MapLocation  {
    latitude: number,
    longitude:number,
    latitudeDelta: number,
    longitudeDelta: number
}

export default function Map() {

    const [location, setLocation] = useState<MapLocation>();
    const [markers, setMarkers] = useState<{ latitude: number; longitude: number; attraction_name: string; attraction_id:string, photo:string, city:string, country:string }[]>([]); 
    const [searchHere, setSearchHere] = useState(false)
    const [currentRegion, setCurrentRegion] = useState<Region>();
    const [loading, setLoading] = useState(false)
    const {onRefreshToken} = useAuth();
    const mapStyle = [
        {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        }
    ];

    const getAttractions = async (attractionsLocation: MapLocation ) => {
        setLoading(true)
        if (attractionsLocation) {
            await onRefreshToken!();
            try {
                const result = (await axios.post(`${API_URL}/attractions/nearby/${attractionsLocation.latitude}/${attractionsLocation.longitude}/400`)).data;
                if (result) {
                    const attractionMarkers = result.map((attraction: { location: { latitude: any; longitude: any; }; attraction_name: any; attraction_id: any; photo: any; city: any; country: any; }) => ({
                        latitude:attraction.location.latitude,
                        longitude:attraction.location.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                        attraction_name: attraction.attraction_name,
                        attraction_id: attraction.attraction_id,
                        photo: attraction.photo,
                        city: attraction.city,
                        country: attraction.country,
                    })) 
                    setMarkers(attractionMarkers)
                }
            } catch (e) {
                alert(e)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (location) {
            getAttractions(location)
        }
    }, [location]);

    useEffect(() => {

        const getLocation = async () => {
          
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            alert('Allow location access to search attractions');
            router.back();
            return
          }
          const userLocation = await Location.getCurrentPositionAsync({});

          const currentLocation: MapLocation = {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }
          
          setLocation(currentLocation);
            
        }
    
        getLocation()
    }, []);

    const updateAttractions = (region: Region, details: Details) => {
        if (details.isGesture) {
            setSearchHere(true)
            setCurrentRegion(region)
        }
    }

    const searchOnNewLocation = () => {
        setSearchHere(false)
        if (currentRegion) {
            getAttractions(currentRegion)
        }
    }

    return(
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={location}
                region={location}
                onRegionChangeComplete={updateAttractions}
                showsUserLocation
                showsMyLocationButton
                customMapStyle={mapStyle}
                showsPointsOfInterest={false}
            >
                {markers.map((marker,index) => (
                    <Marker key={index} pinColor={Colors.light.primary} coordinate={marker}>
                        <Callout onPress={() => {router.navigate({pathname:"../feed/attraction", params:marker})}}>
                            <View style={{backgroundColor:"transparent"}}>
                                <Text style={{fontWeight:"bold", fontSize:20}}>{marker.attraction_name}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            {searchHere && (
                <TouchableOpacity onPress={searchOnNewLocation} style={{justifyContent:"center",position:"absolute",borderRadius:50,bottom:30,alignSelf:"center",backgroundColor:"white", elevation:5}}>
                    <Text style={{alignSelf:"center", paddingVertical:8, paddingHorizontal:15, fontSize:18}}>Search here</Text>
                </TouchableOpacity>
            )}
            {loading && (
                <View style={styles.dotsWrapper}>
                    <LoadingDots 
                        size={10}
                        bounceHeight={5}
                        colors={[Colors.light.primary,"#E09032","#DF9E51","#DDAC72"]}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map:{
    width:"100%",
    height:"100%",
    zIndex:-1
  },
  dotsWrapper: {
    width: "20%",
    alignSelf:"center",
    alignContent:"center",
    paddingTop:25,
    marginBottom:20,
    backgroundColor:"transparent",
    position:"absolute",
},
});
