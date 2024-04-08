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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface AttractionCardProps {
  title: String
} // TODO: add other props

export const AttractionCard: React.FC<AttractionCardProps> = (props: AttractionCardProps) => {

  const [name, setName] = useState("Name");
  const [category, setCategory] = useState("Category");
  const [location, setLocation] = useState("Location");
  const [description, setDescription] = useState("Description");
  const [image, setImage] = useState("image"); // TODO: Use

  return (
    <View style={styles.attractionCard}>
        <TouchableOpacity onPress={() => {router.navigate("../feed/attraction")}}>
          <View style={{flexDirection:"row", backgroundColor:"transparent"}}>
            <Image 
              style={{width:150, height:150, borderTopLeftRadius:15, borderBottomLeftRadius:15, marginLeft:-1,marginTop:-1}}
              source={{
                uri:"https://cdn.mos.cms.futurecdn.net/BiNbcY5fXy9Lra47jqHKGK.jpg"}}
            /> 
            <View style={{padding:5, backgroundColor:"transparent", flex:1}}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20, fontWeight:"bold"}}>{name}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14}}>{category}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14}}>{location}</Text>
              <Text numberOfLines={4} ellipsizeMode="tail" style={{fontSize:14}}>{description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [attractions, setAttractions] = useState(["","","","","","",""]);

  const getAttractions = async () => {
    try {
      const result = ["","","","","","",""]
      setAttractions([...attractions, ...result])
    } catch (e) {
      alert(e);
    }
  }

  const renderAttraction = () => {
    return (
      <AttractionCard title="hola"></AttractionCard>
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

      <View style={{alignItems:"center", backgroundColor:Colors.light.primary}}>
        <View style={{flexDirection:"row", backgroundColor:"transparent", alignItems:"center"}}>
          <TextInput
                style={styles.input}
                onChangeText={setSearch}
                value={search}
                placeholder="Search..."
          />
          <Ionicons name='filter-outline' color="white" size={30} onPress={() => router.navigate("../feed/searchFilter")}/>
        </View>
      </View>

      <View style={{padding:10, flex:1}}>
        <View style={{alignItems:"flex-start"}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10}}>Recommended attracions</Text>
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
