import { StyleSheet, Image, Text, Dimensions, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import Icon from 'react-native-ico-flags';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { getSupportedCurrencies } from "react-native-format-currency";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

const currencyList = getSupportedCurrencies();

export default function ExchangeRates() {
  const [sourceCurrencyAmt, setSourceCurrencyAmt] = useState("1");
  const [sourceCurrency, setSourceCurrency] = useState("ARS");

  const [destCurrencyAmt, setDestCurrencyAmt] = useState("");
  const [destCurrency, setDestCurrency] = useState("USD");

  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Exchange rates
      </Text>

      <Picker
        enabled={true}
        selectedValue={sourceCurrency}
        onValueChange={value => {setSourceCurrency(value)}}
      >
        
        {currencyList.map((currency, index) => (
          <Picker.Item
            key={index}
            label={currency.name}
            value={currency.code}
            style={{fontSize:25}}
          />
        ))}
      </Picker>
      <View style={{alignItems:"center"}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <TextInput
            style={styles.input}
            onChangeText={setSourceCurrencyAmt}
            value={sourceCurrencyAmt}
            placeholder=""
            keyboardType="numeric"
          />
          <Text style={{fontSize:40}}>
            {sourceCurrency}
          </Text>
        </View>
        <Ionicons name='chevron-expand-outline' size={70}/>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <TextInput
            style={styles.input}
            onChangeText={setDestCurrencyAmt}
            value={destCurrencyAmt}
            placeholder=""
            keyboardType="numeric"
          />
          <Text style={{fontSize:40}}>
            {destCurrency}
          </Text>
        </View>
      </View>
      <Picker
        enabled={true}
        selectedValue={destCurrency}
        onValueChange={value => {setDestCurrency(value)}}
      >
        
        {currencyList.map((currency, index) => (
          <Picker.Item
            key={index}
            label={currency.name}
            value={currency.code}
            style={{fontSize:25}}
          />
        ))}
      </Picker>
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
  },
  input: {
    height: windowHeight*0.08,
    width: windowWidth*0.4,
    margin: 12,
    marginTop:0,
    borderWidth: 0,
    borderBottomWidth:1,
    padding: 10,
    borderRadius:10,
    borderBottomColor:Colors.light.primary,
    fontSize:45,
  },
});
