import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';
import CodeField from 'react-native-confirmation-code-field';
import { OtpInput } from 'react-native-otp-entry';
import { API_URL } from '../context/AuthContext';
import axios from 'axios';


const colors = Colors.light;

export default function NewPassword() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [email, setEmail] = React.useState(params.email);
    const [code, setCode] = React.useState(params.code);
    const [password, setPassword] = React.useState('');

    const recoverPassword = async () => {
      try {
        await axios.put(`${API_URL}/users/password/recover`,{email,code,"new_password":password})
        router.replace("../..")
      } catch (e) {
        alert(e)
      }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Insert new password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="New password"
            />
            <View style={styles.separator} />
            <AccountButton title="Confirm" onPress={recoverPassword}/>
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
    borderWidth: 1,
    padding: 10,
    borderRadius:10,    
  },
});
