import {  StyleSheet, Dimensions  } from 'react-native';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { AttractionCard } from '@/components/AttractionCard';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const attractionsPerPage = 10

export interface AttractionParams {
  attraction_id: string; 
  attraction_name: string; 
  likes_count: string; 
  done_count: string; 
  avg_rating: string;
  city: string,
  country: string,
  photo: string,
}

export default function FeedScreen() {
  const [attractions, setAttractions] = useState([]);
  const [noMoreAttractions, setNoMoreAttractions] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [cantGetAttractions, setCantGetAttractions] = useState(false)
  const {onRefreshToken} = useAuth();
  
  const getAttractions = async () => {
    await onRefreshToken!();
    try {
      const result = await axios.get(`${API_URL}/attractions/recommendations?page=${currentPage}`)
      if (result.data) {
        const parsedPlaces: [] = result.data.map((place: AttractionParams) => ({
            attraction_id: place.attraction_id,
            attraction_name: place.attraction_name,
            city: place.city,
            country: place.country,
            photo: place.photo
        }));
        if (parsedPlaces.length < attractionsPerPage) {
          setNoMoreAttractions(true)
          if (currentPage == 0 && parsedPlaces.length == 0){
            setCantGetAttractions(true)
          }
        }
        setAttractions([
          ...attractions,
          ...parsedPlaces
        ])
      }
    } catch (error:any) {
      if (error.response){
        if (error.response.status === 404) {
          setCantGetAttractions(true)
          setNoMoreAttractions(true)
        } else {
          alert(error.message)
        }
      } else {
        alert(error)
      }
    }
  }

  const renderAttraction = ({item}:{item:{attraction_name:string, attraction_id:string,likes_count:string,done_count:string,avg_rating:string, city:string, country: string, photo:string}}) => {
    return (
        <AttractionCard data={item}></AttractionCard>
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
    setCurrentPage(currentPage+1)
    getAttractions()
  }


  useEffect(() => {
    getAttractions()
  }, []);

  const reloadFeed = async () => {
    setAttractions([])
    setNoMoreAttractions(false)
    setCantGetAttractions(false)
    setCurrentPage(0)
    try {
      await onRefreshToken!();
      await axios.post(`${API_URL}/attractions/run-recommendation-system`)
    } catch (e) {
      alert(e)
    }
    await getAttractions()
  }

  return (
    <View style={styles.container}>

      <View style={{padding:10, flex:1}}>
        <View style={{alignItems:"flex-start"}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10}}>Recommended attractions</Text>
        </View>
        <View style={{paddingBottom:30}}>
          {(attractions.length == 0 && cantGetAttractions) && (
            <>
              <Text style={{fontSize:40, paddingTop:30, paddingHorizontal:25}}>Looks like we can't recommend attractions to you yet</Text>
              <Text style={{fontSize:20, paddingHorizontal:25, fontStyle:"italic", fontWeight:"bold",color:Colors.light.secondary}}>Try searching for and interacting with some attractions first</Text>
              <Text onPress={reloadFeed} style={{fontSize:25, paddingHorizontal:25, fontStyle:"italic",fontWeight:"bold",color:Colors.light.primary}}>Reload</Text>
            </>
          )}
          <FlatList 
            data={attractions} 
            renderItem={renderAttraction}
            style={{width:"100%"}}
            ListFooterComponent={noMoreAttractions || cantGetAttractions ? null : renderLoader}
            onEndReached={noMoreAttractions? null : loadMoreAttractions}
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
