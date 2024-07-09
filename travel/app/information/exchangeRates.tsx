import {
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { getSupportedCurrencies } from "react-native-format-currency";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import LoadingIndicator from "@/components/LoadingIndicator";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const colors = Colors.light;

const currencyList = getSupportedCurrencies();

export default function ExchangeRates() {
  const [sourceCurrencyAmt, setSourceCurrencyAmt] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("ARS");
  const [destCurrencyAmt, setDestCurrencyAmt] = useState("");
  const [destCurrency, setDestCurrency] = useState("USD");

  const [isLoading, setIsLoading] = useState(false);

  const { onRefreshToken } = useAuth();

  const getCurrencyExchange = async () => {
    setIsLoading(true);
    await onRefreshToken!();
    if (!isNaN(parseFloat(sourceCurrencyAmt))) {
      try {
        const result = await axios.get(`${API_URL}/currency`, {
          params: {
            currency: sourceCurrency,
            interest_currency: destCurrency,
            amount: sourceCurrencyAmt,
          },
        });
        setDestCurrencyAmt(result.data.conversion as string);
      } catch (e) {
        alert("Error geting exchange rates");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSourceCurrencyAmt("");
    setDestCurrencyAmt("");
  }, [sourceCurrency, destCurrency]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exchange rates</Text>

      <Picker
        enabled={true}
        selectedValue={sourceCurrency}
        onValueChange={(value) => {
          setSourceCurrency(value);
        }}
      >
        {currencyList.map((currency, index) => (
          <Picker.Item
            key={index}
            label={currency.name}
            value={currency.code}
            style={{ fontSize: 25 }}
          />
        ))}
      </Picker>
      <View style={{ alignItems: "center", overflow:"visible" }}>
        <View style={{ flexDirection: "row", alignItems: "center", overflow:"visible" }}>
          <TextInput
            style={styles.input}
            onChangeText={setSourceCurrencyAmt}
            value={sourceCurrencyAmt}
            placeholder=""
            keyboardType="numeric"
            maxLength={12}
          />
          <Text style={{ fontSize: 40 }}>{sourceCurrency}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={getCurrencyExchange}>
          <Ionicons
            name="chevron-expand-outline"
            size={70}
            color={"white"}
          />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 40,
              marginHorizontal: 30,
              marginVertical: 20,
              width: windowWidth * 0.5,
            }}
          >
            {destCurrencyAmt}
          </Text>
          <Text style={{ fontSize: 40 }}>{destCurrency}</Text>
        </View>
      </View>
      <Picker
        enabled={true}
        selectedValue={destCurrency}
        onValueChange={(value) => {
          setDestCurrency(value);
        }}
      >
        {currencyList.map((currency, index) => (
          <Picker.Item
            key={index}
            label={currency.name}
            value={currency.code}
            style={{ fontSize: 25 }}
          />
        ))}
      </Picker>
      {isLoading && <LoadingIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 60,
  },
  input: {
    height: 8*7,
    width: windowWidth * 0.5,
    margin: 12,
    marginTop: 0,
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderBottomColor: Colors.light.primary,
    fontSize: 8*4,
    overflow:"visible"
  },
  button: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    borderRadius: 50,
  },
});
