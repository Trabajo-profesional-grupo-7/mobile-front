import { Dimensions, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { Chip } from 'react-native-paper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



export default function Attraction() {

  const [name, setName] = useState('Name');
  const [location, setLocation] = useState("Location");
  const [category, setCategory] = useState('Category');
  const [description, setDescription] = useState('Description');


  return (
    <>
    <View style={[{flexDirection:"row"},styles.floatingButton]}>
      <Ionicons style={{paddingHorizontal:2}} name='heart-outline' size={40}/>
      <Ionicons style={{paddingHorizontal:2}} name='checkmark-outline' size={40}/>
      <Ionicons style={{paddingHorizontal:2}} name='time-outline' size={40}/>
      <Ionicons style={{paddingHorizontal:2}} name='star-outline' size={40}/>
      <Ionicons style={{paddingHorizontal:2}} name='bookmark-outline' size={40}/>
      <Ionicons style={{paddingHorizontal:2}} name='map-outline' size={40}/>
    </View>
    <View style={styles.container}>
        <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        style={styles.gradient}
        />
        <Image 
            style={{width:"100%", height:250}}
            source={{
                uri:"https://cdn.mos.cms.futurecdn.net/BiNbcY5fXy9Lra47jqHKGK.jpg"}}
        />
        <View style={{marginHorizontal:20}}>
            <Text style={styles.title}>{name}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16}}>{category}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16}}>{location}</Text>
            <Text numberOfLines={16} ellipsizeMode="tail" style={{fontSize:16}}>{description}</Text>
        </View>
      
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
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
    width: windowWidth*0.7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.light.secondary,
    borderRadius:50,
    right:(windowWidth/2)-(windowWidth*0.7/2),
    top:windowHeight-175
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top:150,
    height: 100,
    zIndex:1
  },
});
