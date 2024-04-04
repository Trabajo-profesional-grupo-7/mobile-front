import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React, { useState } from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';
import LoadingIndicator from '@/components/LoadingIndicator';

const colors = Colors.light;

export default function LoginScreen() {
    const router = useRouter();
    const {onRegister} = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);

    const validateFields = () => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!(password.length && username.length && email.length)) {
        alert("Cant have empty fields");
        return false;
      }

      if (!regex.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }

      if (password.length < 8) {
        alert("Passwords must be at least 8 characters long");
        return false;
      }

      if (password != repeatPassword) {
        alert("Passwords don't match");
        return false;
      }

      return true;
    }

    const register = async () => {
      if (validateFields()) {
        setIsLoading(true);
        const result = await onRegister!(email, password, username, "2024-01-01", ["asd", "hola"]);
        if (result && result.error) {
          console.log(result);
          alert("Error registering")
        } else {
          console.log(result);
          alert("Account succesfully registered")
          router.back();
        }
        setIsLoading(false);
      }
    };

    return (
        <View style={styles.container}>
            <View style={{marginTop:"40%"}}>
              <Text style={styles.title}>Sign up</Text>
              
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
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
              <TextInput
                style={styles.input}
                onChangeText={setRepeatPassword}
                value={repeatPassword}
                placeholder="Repeat password"
                secureTextEntry
              />
            </View>
            <View style={{marginBottom:"20%"}}>
              <AccountButton title="Sign Up" onPress={() => {register()}}/>
            </View>
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
    justifyContent: 'space-between',
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
