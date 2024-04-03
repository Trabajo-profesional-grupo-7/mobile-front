import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';

const colors = Colors.light;

export default function LoginScreen() {
    const router = useRouter();
    const {onRegister} = useAuth();
    
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');
    const [username, setUsername] = React.useState('');

    const register = async () => {
      const result = await onRegister!(email, password, username, "2024-01-01", ["asd", "hola"]);
      if (result && result.error) {
        console.log(result);
        alert("Error registering")
      } else {
        console.log(result);
        router.navigate("./confirmSignup");
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
