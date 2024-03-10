import { StyleSheet, Image, Text, Dimensions } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('Email');
  const [country, setCountry] = React.useState('Country');
  const [preferences, setPreferences] = React.useState(["Item 1", "Item 2"]);

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.navigate("profile/editProfile")}>
        <Ionicons name='pencil' size={35}/>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image 
              style={{width:150, height:150, borderRadius:100}}
              source={{
                uri:"https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}}
            />
          <Text style={{
              fontWeight: '700',
              fontSize: 25,
            }}>
              Name
            </Text>
        </View>
        <View style={styles.bottomView}>
            

          <View style={styles.profileItem}>
            <Ionicons name='location-outline' size={25}/>
            <Text style={{fontSize:20, flex:1, marginLeft:5}}>Location</Text>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'flex-end'}}>{country}</Text>
          </View>

          <View style={styles.profileItem}>
            <Ionicons name='mail-outline' size={25}/>
            <Text style={{fontSize:20, flex:1, marginLeft:5}}>Email</Text>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'flex-end'}}>{email}</Text>
          </View>

          <View style={styles.travelPreferences}>
            <Text style={{fontSize:20, marginLeft:5, fontWeight:'bold'}}>Travel preferences</Text>
            {preferences.map((item, index) => (
              <Text key={index} style={{marginLeft:10, fontSize:20}}>• {item}</Text>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex:-1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topView: {
    height: "30%",
    width: '100%',
    backgroundColor:colors.dimmed,
    borderBottomWidth:2,
    borderBottomColor:colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomView: {
    width: '80%',
    backgroundColor:colors.secondary,
    alignItems: "center",
    marginTop: "5%",
    borderRadius:30,
    alignSelf:"center",
  },
  floatingButton: {
    position: 'absolute',
    zIndex:1,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.primary,
    borderRadius:50,
    right:30,
    top:windowHeight-200
  },
  profileItem: {
    width:"100%",
    flexDirection:"row", 
    justifyContent:"space-between",
    backgroundColor:"transparent",
    alignItems:"center",
    paddingVertical:10,
    paddingHorizontal:15,
    borderBottomColor:colors.background,
    borderBottomWidth:1
  },
  travelPreferences: {
    width:"100%",
    flexDirection:"column", 
    backgroundColor:"transparent",
    paddingVertical:10,
    paddingHorizontal:15,
    borderBottomColor:colors.background,
    borderBottomWidth:1
  }
});
