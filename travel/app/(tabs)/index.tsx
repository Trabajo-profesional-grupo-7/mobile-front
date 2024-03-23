import { Button, StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
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
        <TouchableOpacity>
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

      <View style={{paddingHorizontal:10}}>
        <View style={{alignItems:"flex-start"}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom:10}}>Recommended attracions</Text>
        </View>
        <View style={{alignItems:"center"}}>
          <AttractionCard title="hola"></AttractionCard>
          <AttractionCard title="hola"></AttractionCard>
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
