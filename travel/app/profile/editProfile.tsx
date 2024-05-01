import { Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { MultiSelect } from 'react-native-element-dropdown';
import LoadingIndicator from '@/components/LoadingIndicator';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const preferences = ["Cat1", "Cat2", "Cat3"]

export default function EditProfile() {
  const params = useLocalSearchParams();
  const [name, setName] = React.useState(`${params.username}`);
  const [location, setLocation] = useState(`${params.country}`);
  const [birthday, setBirthday] = useState(`${params.birth_date}`);
  const [selected, setSelected] = useState<string[]>((params.preferences as string).split(","))
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(["Cat2"]); //get de prefs
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const handleSelect = (val: string) => {
    setSelectedPreferences((prev: string[]) =>
      prev.find((p) => p === val)
        ? prev.filter((cat) => cat !== val)
        : [...prev, val]
    );
  };

  useEffect(() => {

    const getCategories = async () => {
        setIsLoading(true)
        try {
            const result = await axios.get(`${API_URL}/metadata`)
            const data = result.data.attraction_types.map((category: string) => ({
              label: category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              value: category
            }));
            setCategories(data)
        } catch (e) {
            alert(e)
        }
        setIsLoading(false)
    }
    getCategories()
  }, []);

  const editProfile = async () => {
    setIsLoading(true)
    try {
      const result = await axios.patch(`${API_URL}/users`, {
        "username": name,
        "preferences": selected
      })
      router.back();
    } catch (e) {
      alert(e)
    }
    setIsLoading(false)
  }

  return (
    <>
    <TouchableOpacity style={styles.floatingButton} onPress={editProfile}>
        <Ionicons name='save-outline' size={35}/>
    </TouchableOpacity>
    <View style={styles.container}>
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />

      <Text style={styles.title}>Travel preferences</Text>

      <View style={{width:"70%", height:"40%", marginLeft:20}}>
              <MultiSelect
                data={categories}
                labelField="label"
                valueField="value"
                placeholder="Categories"
                searchPlaceholder="Search..."
                maxSelect={5}
                search
                value={selected}
                onChange={item => {
                  setSelected(item);
                }}
              />
            </View>
    </View>
    {isLoading && (
      <LoadingIndicator/>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft:20
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
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:Colors.light.secondary,
    borderRadius:50,
    right:30,
    top:windowHeight-200
  }
});
