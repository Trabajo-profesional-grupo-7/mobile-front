import { StyleSheet, Image, Text, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import EditScreenInfo from '@/components/EditScreenInfo';
import { View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import Icon from 'react-native-ico-flags';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getSupportedCurrencies } from "react-native-format-currency";
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingIndicator from '@/components/LoadingIndicator';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = Colors.light;

const currencyList = getSupportedCurrencies();

export default function ExchangeRates() {
  const [sourceCurrencyAmt, setSourceCurrencyAmt] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("ARS");
  const [destCurrencyAmt, setDestCurrencyAmt] = useState("");
  const [destCurrency, setDestCurrency] = useState("USD");

  const [isLoading, setIsLoading] = useState(false);

  const {onRefreshToken} = useAuth();
  
  const getCurrencyExchange = async () => {
    await onRefreshToken!();
    if (!isNaN(parseFloat(sourceCurrencyAmt))) {
      try {
        setIsLoading(true);
        const result = await axios.get(`${API_URL}/currency`,{params:{
          "currency": sourceCurrency,
          "interest_currency": destCurrency,
          "amount":sourceCurrencyAmt
        }});
        setDestCurrencyAmt(result.data.conversion as string)
        setIsLoading(false);
      } catch (e) {
        alert("Error geting exchange rates")
      }
    } 
  }

  useEffect(() => {
    setSourceCurrencyAmt("");
    setDestCurrencyAmt("");
  },[sourceCurrency, destCurrency])

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

        <TouchableOpacity style={styles.button} onPress={getCurrencyExchange}>
          <Ionicons name='chevron-expand-outline' size={70}/>
        </TouchableOpacity>


        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Text numberOfLines={1} style={{fontSize:40, marginHorizontal:30, marginVertical:20, width:140}}>
            {destCurrencyAmt}
          </Text>
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
      {isLoading && (
              <LoadingIndicator/>
      )}
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
  button: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.primary,
    borderRadius:50,
  },
});
