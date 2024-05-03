import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React, { useState } from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingIndicator from '@/components/LoadingIndicator';

const colors = Colors.light;


export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const recoverPassword = async () => {
      setIsLoading(true)
      try {
        await axios.post(`${API_URL}/users/password/recover`,{email});
        router.navigate({pathname:"../user/recoverCode",params:{email}})
      } catch (e) {
        alert(e)
      }
      setIsLoading(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Password Recovery</Text>
            
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="E-mail"
            />
            <View style={styles.separator} />
            <AccountButton title="Recover" onPress={recoverPassword}/>
            {isLoading && (
              <LoadingIndicator/>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Math.round(windowHeight)
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  passwordRecoveryText: {
    fontWeight: 'bold',
    color:colors.primary,
    fontStyle: 'italic',
  },
  separator: {
    marginVertical: 30,
    width: '80%',
    marginTop:230
  },
  input: {
    height: windowHeight*0.05,
    width: windowWidth*0.6,
    margin: 12,
    padding: 10,
    borderRadius:10,
    backgroundColor:"white",
    elevation:3
  },
});
