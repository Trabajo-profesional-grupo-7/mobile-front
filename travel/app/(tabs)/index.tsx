import { Button, StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { router, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import { AttractionCard } from '@/components/AttractionCard';
import { API_URL } from '../context/AuthContext';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function FeedScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [attractions, setAttractions] = useState([]);
  const current_page = 0

  const getAttractions = async () => {
    try {
      const result = await axios.get(`${API_URL}/attractions/recommendations?page=${current_page}`)
      console.log("A")
      console.log(result.data)
    } catch (e) {
      alert(e);
    }
  }

  const renderAttraction = () => {
    return (
      <Text ></Text>
    )
  }

  const renderLoader = () => {
    return (
      <View style={{margin:15}}>
        <ActivityIndicator size="large" color={Colors.light.primary}/>
      </View>
    )
  }

  const loadMoreAttractions = () => {
    getAttractions()
  }

  useEffect(() => {
    getAttractions()
  }, []);

  return (
    <View style={styles.container}>

      <View style={{padding:10, flex:1}}>
        <View style={{alignItems:"flex-start"}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10}}>Recommended attractions</Text>
        </View>
        <View style={{paddingBottom:30}}>
          <FlatList 
            data={attractions} 
            renderItem={renderAttraction}
            style={{width:"100%"}}
            ListFooterComponent={renderLoader}
            onEndReached={loadMoreAttractions}
            onEndReachedThreshold={0}
          >
          </FlatList>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  attractionCard: {
    width:"95%",
    height:150,
    borderColor:Colors.light.primary,
    borderWidth:1,
    borderRadius:15,
    marginBottom:10,
    alignSelf:"center"
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.75,
    margin: 12,
    padding: 10,
    borderRadius:25, 
    backgroundColor:"white"   
  },
});
