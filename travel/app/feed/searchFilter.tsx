import { Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { Chip } from 'react-native-paper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const preferences = ["Cat1", "Cat2", "Cat3"]


export default function TestScreen() {

  const [name, setName] = useState('Search term');
  const [location, setLocation] = useState('');
  const [birthday, setBirthday] = useState('Birthday');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(["Cat2"]); //get de prefs

  const handleSelect = (val: string) => {
    setSelectedPreferences((prev: string[]) =>
      prev.find((p) => p === val)
        ? prev.filter((cat) => cat !== val)
        : [...prev, val]
    );
  };

  return (
    <>
    <TouchableOpacity style={styles.floatingButton} onPress={() => router.back()}>
        <Ionicons name='search-outline' size={35}/>
    </TouchableOpacity>
    <View style={styles.container}>
      <Text style={styles.title}>Search term</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
      />

      <Text style={styles.title}>Location</Text>
      <TextInput
        style={styles.input}
        onChangeText={setLocation}
        value={location}
        placeholder="Location"
      />


      <Text style={styles.title}>Tags</Text>

      <View style={styles.chipsContainer}>
        {preferences.map((pref) => (
          <Chip
            key={pref}
            mode="outlined"
            style={[styles.chip,[selectedPreferences.find((c) => pref === c)  ?  {backgroundColor:Colors.light.secondary} : {}]]}
            textStyle={{ fontWeight: "400", padding: 1 }}
            selected={
              selectedPreferences.find((c) => pref === c) ? true : false
            }
            onPress={() => handleSelect(pref)}
            rippleColor={Colors.light.primary}
            showSelectedOverlay
            showSelectedCheck={false}
          >
            {pref}
          </Chip>
        ))}

      </View>
    </View>
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
