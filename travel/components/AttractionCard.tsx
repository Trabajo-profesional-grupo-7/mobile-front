import { Button, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { router, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export interface AttractionCardProps {
    data: {
        attraction_name: string,
        attraction_id:string,
        likes_count:number,
        done_count:number,
        avg_rating:number,
        city: string,
        country: string,
        photos: [],
    }
} // TODO: add other props
  
export const AttractionCard: React.FC<AttractionCardProps> = (props: AttractionCardProps) => {
    
    const [name, setName] = useState(props.data.attraction_name);
    const [location, setLocation] = useState(`${props.data.city}, ${props.data.country}`);
    const [image, setImage] = useState("image"); // TODO: Use

    return (
        <View style={styles.attractionCard}>
            <TouchableOpacity onPress={() => {router.navigate({pathname:"../feed/attraction", params:props.data})}}>
            <View style={{flexDirection:"row", backgroundColor:"transparent"}}>
                <Image 
                style={{width:150, height:150, borderTopLeftRadius:15, borderBottomLeftRadius:15, marginLeft:-1,marginTop:-1}}
                source={{
                    uri:"https://cdn.mos.cms.futurecdn.net/BiNbcY5fXy9Lra47jqHKGK.jpg"}}
                /> 
                <View style={{padding:5, backgroundColor:"transparent", flex:1}}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:20, fontWeight:"bold"}}>{name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14}}>{location}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    attractionCard: {
      width:"95%",
      height:150,
      borderColor:Colors.light.primary,
      borderWidth:1,
      borderRadius:15,
      marginBottom:10,
      alignSelf:"center"
    }
  });