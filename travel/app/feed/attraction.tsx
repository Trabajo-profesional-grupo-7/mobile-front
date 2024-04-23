import { Dimensions, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { API_URL, useAuth } from '../context/AuthContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import LoadingIndicator from '@/components/LoadingIndicator';
import RNDateTimePicker from '@react-native-community/datetimepicker';


export default function Attraction() { //recibir datos de atracción
  const params = useLocalSearchParams();
  const [name, setName] = useState(params.attraction_name);
  const [location, setLocation] = useState(`${params.city}, ${params.country}`);
  const [description, setDescription] = useState('Description');
  const [id, setId] = useState(params.attraction_id);
  const [photo, setPhoto] = useState<string>(params.photo as string)

  const [isLiked, setIsLiked] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [starModalVisible, setStarModalVisible] = useState(false);
  const { onRefreshToken } = useAuth();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event:any , selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setDate(currentDate);
    schedule();
  }

  const getAttractionDetails = async () =>  {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      //const result = await axios.delete(`${API_URL}/attractions/unlike?attraction_id=${id}`);
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  const like = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/attractions/unlike?attraction_id=${id}`);
        setIsLiked(false);
      } else {
        await axios.post(`${API_URL}/attractions/like?attraction_id=${id}`);
        setIsLiked(true);
      }
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  const done = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isDone) {
        await axios.delete(`${API_URL}/attractions/undone?attraction_id=${id}`);
        setIsDone(false);
      } else {
        await axios.post(`${API_URL}/attractions/done?attraction_id=${id}`);
        setIsDone(true);
      }
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  const schedule = async () => {
    console.log("Make schedule for")
    console.log(date)
    await onRefreshToken!();
    try {

    } catch (e) {

    }
  }

  const rate = async (rating: number) => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      await axios.post(`${API_URL}/attractions/rate?attraction_id=${id}&rating=${rating}`);
      setIsRated(true);
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  const save = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    try {
      if (isSaved) {
        await axios.delete(`${API_URL}/attractions/unsave?attraction_id=${id}`);
        setIsSaved(false);
      } else {
        await axios.post(`${API_URL}/attractions/save?attraction_id=${id}`);
        setIsSaved(true);
      }
    } catch (e) {
      alert(e)
    }
    setIsLoading(false);
  }

  
  const StarModal = () => {
    const [rating, setRating] = useState(1);

    return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={starModalVisible}
          onRequestClose={() => setStarModalVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <View style={{flexDirection:"row", paddingBottom:20, justifyContent:"center"}}>
                <Ionicons style={{ paddingHorizontal: 2 }} name={'star'} size={40} onPress={() => {setRating(1)}} />
                <Ionicons style={{ paddingHorizontal: 2 }} name={(rating >= 2) ? 'star' : 'star-outline'} size={40} onPress={() => {setRating(2)}} />
                <Ionicons style={{ paddingHorizontal: 2 }} name={(rating >= 3) ? 'star' : 'star-outline'} size={40} onPress={() => {setRating(3)}} />
                <Ionicons style={{ paddingHorizontal: 2 }} name={(rating >= 4) ? 'star' : 'star-outline'} size={40} onPress={() => {setRating(4)}} />
                <Ionicons style={{ paddingHorizontal: 2 }} name={(rating == 5) ? 'star' : 'star-outline'} size={40} onPress={() => {setRating(5)}} />
              </View>
              <Button title="Rate" onPress={() => {rate(rating); setStarModalVisible(false)}}/>
            </View>
          </View>
      </Modal>
    )
  }

  useEffect(() => {
    getAttractionDetails()
}, []);

  return (
    <>
      <View style={[{ flexDirection: "row" }, styles.floatingButton]}>
        <Ionicons style={{ paddingHorizontal: 2 }} name={isLiked ? 'heart' : 'heart-outline'} size={40} onPress={like} />
        <Ionicons style={{ paddingHorizontal: 2 }} name={isDone ? 'checkmark-done-outline' : 'checkmark-outline'} size={40} onPress={done} />
        <Ionicons style={{ paddingHorizontal: 2 }} name={isScheduled ? 'time' : 'time-outline'} size={40} onPress={() => { setShowDatePicker(true) }} />
        <Ionicons style={{ paddingHorizontal: 2 }} name={isRated ? 'star' : 'star-outline'} size={40} onPress={() => { setStarModalVisible(true)}} />
        <Ionicons style={{ paddingHorizontal: 2 }} name={isSaved ? 'bookmark' : 'bookmark-outline'} size={40} onPress={save} />
        <Ionicons style={{ paddingHorizontal: 2 }} name='map-outline' size={40} />
      </View>
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          style={styles.gradient}
        />
        <Image
          style={{ width: "100%", height: 250 }}
          source={{
            uri: photo
          }}
        />
        <View style={{ marginHorizontal: 20 }}>
          <Text style={styles.title}>{name}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16 }}>{location}</Text>
          <Text numberOfLines={16} ellipsizeMode="tail" style={{ fontSize: 16 }}>{description}</Text>
        </View>
        
        <StarModal/>

      </View>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      {isLoading && (
              <LoadingIndicator/>
      )}
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
    marginLeft: 15,
    marginTop: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    marginBottom: windowWidth * 0.05,
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.9,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
  },
  floatingButton: {
    position: 'absolute',
    zIndex: 1,
    width: windowWidth * 0.8,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.secondary,
    borderRadius: 50,
    right: (windowWidth / 2) - (windowWidth * 0.8 / 2),
    top: windowHeight - 175,
    paddingHorizontal: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 150,
    height: 100,
    zIndex: 1
  },
});
