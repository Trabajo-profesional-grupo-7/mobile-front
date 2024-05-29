import { StyleSheet, Image, Text, Dimensions } from 'react-native';

import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect, useRouter } from 'expo-router';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingIndicator from '@/components/LoadingIndicator';
import { dateParser } from '@/components/Parsers';
const windowHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const colors = Colors.light;

export default function ProfileScreen() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState(0);
  const router = useRouter();
  const [email, setEmail] = useState('Email');
  const country = 'Argentina';
  const [birth_date, setBirthdate] = useState('Birthday');
  const [username, setUsername] = useState("Name")
  const [preferences, setPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {onRefreshToken} = useAuth();

 
  const getProfileData = async () => {
    setLastUpdatedTime(Date.now());
    await onRefreshToken!();
    try {
      const result = await axios.get(`${API_URL}/users`);
      console.log(result.data)
      setEmail(result.data.email);
      setBirthdate(result.data.birth_date);
      setUsername(result.data.username);
      setPreferences(result.data.preferences)
      setIsLoading(false);
    } catch (e) {
      alert("Error getting profile info");
    }
  }

  useFocusEffect(() => {
    if (Date.now() - lastUpdatedTime >= 30000) {
      getProfileData();
    }
  });


  useEffect(() => {
    getProfileData();
  }, []);

  const navigateToEditProfile = () => {
    router.navigate({pathname:"../profile/editProfile",params:{username, country, preferences, birth_date}});
  }

  return (
    <>
      {isLoading ? (
              <LoadingIndicator/>
      ):(
      <>
      <TouchableOpacity style={styles.floatingButton} onPress={navigateToEditProfile}>
        <Ionicons name='pencil' size={35}/>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.topView}>
          <Text style={{fontSize:8*5, fontWeight:"bold", marginVertical:4}}>{username}</Text>
          <Text style={{color:"gray", fontSize:8*3,marginVertical:4}}>{email}</Text>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Ionicons name='location-outline' size={8*2}/>
            <Text style={{fontSize:8*2,marginVertical:4}}>Buenos Aires, Argentina</Text>
          </View>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", width:width-8*3, padding:8*2}}>
            <View style={{flexDirection:"row", backgroundColor:"transparent",alignItems:"center"}}>
              <Ionicons name='bookmark-outline' color={"#a6683f"} size={8*5} style={styles.iconContainer}/>
              <Text style={{paddingLeft:8*2, fontSize:8*2.5, fontWeight:"bold"}}>Attractions saved</Text>
            </View>
            <Ionicons name='chevron-forward-outline' color={"gray"} size={8*4} style={{paddingRight:8*2}}/>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", width:width-8*3, padding:8*2}}>
            <View style={{flexDirection:"row", backgroundColor:"transparent",alignItems:"center"}}>
              <Ionicons name='checkmark-done' color={"#a6683f"} size={8*5} style={styles.iconContainer}/>
              <Text style={{paddingLeft:8*2, fontSize:8*2.5, fontWeight:"bold"}}>Attractions done</Text>
            </View>
            <Ionicons name='chevron-forward-outline' color={"gray"} size={8*4} style={{paddingRight:8*2}}/>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between", width:width-8*3, padding:8*2}}>
            <View style={{flexDirection:"row", backgroundColor:"transparent",alignItems:"center"}}>
              <Ionicons name='calendar-outline' color={"#a6683f"} size={8*5} style={styles.iconContainer}/>
              <Text style={{paddingLeft:8*2, fontSize:8*2.5, fontWeight:"bold"}}>Calendar</Text>
            </View>
            <Ionicons name='chevron-forward-outline' color={"gray"} size={8*4} style={{paddingRight:8*2}}/>
          </TouchableOpacity>
        </View>
      </View>
      </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex:-1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  topView: {
    height: "25%",
    alignItems: "center",
    justifyContent:"center",
    backgroundColor:colors.background,
    marginTop:8*2,
    marginHorizontal:8*2,
    marginBottom:8
  },
  bottomView: {
    width: '100%',
    backgroundColor:"transparent",
    alignItems: "center",
    alignSelf:"center",
    flex:1
  },
  iconContainer: {
    backgroundColor:"#fab78c",
    padding:8,
    borderRadius:50,
    opacity:1
  },
  floatingButton: {
    position: 'absolute',
    zIndex:1,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.secondary,
    borderRadius:50,
    right:30,
    top:windowHeight-200,
    elevation:3
  }
});
