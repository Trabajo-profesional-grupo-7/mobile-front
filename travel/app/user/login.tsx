import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';
import axios, { AxiosError } from 'axios';
const colors = Colors.light;


export default function LoginScreen() {
    const router = useRouter();
    const {onLogin} = useAuth();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const login = async () => {
      console.log("asd")
      const result = await onLogin!(email, password);
      if (result && result.error){
        alert("Incorrect email or password");
      }
      
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            <Image 
            style={{width:200, height:200, alignSelf:'center', opacity:0.8, marginTop:20, marginBottom:30}}
            source={{
              uri:"https://i.imgur.com/qc0GM7G.png"}}
            />
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="E-mail"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry
            />
            <Text style={styles.passwordRecoveryText} onPress={()=> router.navigate("./recoverPassword")}>Forgot your password?</Text>
            <View style={styles.separator} />
            <AccountButton title="Log In" onPress={() => {login()}}/>
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
    fontSize: 40,
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
