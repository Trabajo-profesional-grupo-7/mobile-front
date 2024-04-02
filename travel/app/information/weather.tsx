import { StyleSheet, Image, Text, Dimensions } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

export default function Weather() {
  const [location, setLocation] = useState("Rome, Italy");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Weather for {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  }
});
