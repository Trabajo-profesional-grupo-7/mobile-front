import { StyleSheet, Image, Text, Dimensions } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

export default function ProfileScreen() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState(0);
  const router = useRouter();
  const [email, setEmail] = useState('Email');
  const [country, setCountry] = useState('Argentina');
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
          <Image 
              style={{width:150, height:150, borderRadius:100}}
              source={{
                uri:"https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}}
            />
          <Text style={{
              fontWeight: '700',
              fontSize: 25,
            }}>
              {username}
            </Text>
        </View>
        <View style={styles.bottomView}>
            
          <View style={styles.profileItem}>
            <Ionicons name='mail-outline' size={25}/>
            <Text style={{fontSize:20, flex:1, marginLeft:5}}>Email</Text>
            <Text style={{fontSize:15, fontWeight:'bold', alignSelf:'flex-end'}}>{email}</Text>
          </View>

          <View style={styles.profileItem}>
            <Ionicons name='calendar-outline' size={25}/>
            <Text style={{fontSize:20, flex:1, marginLeft:5}}>Birthday</Text>
            <Text style={{fontSize:20, fontWeight:'bold', alignSelf:'flex-end'}}>{dateParser(birth_date)}</Text>
          </View>
          {preferences.length > 0 && 
            <View style={styles.travelPreferences}>
              <Text style={{fontSize:20, marginLeft:5, fontWeight:'bold'}}>Travel preferences</Text>
              {preferences.map((item:string, index) => (
                <Text key={index} style={{marginLeft:10, fontSize:20}}>• {item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
              ))}
            </View>
          }
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
    backgroundColor:colors.secondary,
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
