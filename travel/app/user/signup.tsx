import { StyleSheet, Image, Dimensions, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';
import React from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Colors from '@/constants/Colors';

const colors = Colors.light;

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [repeatPassword, setRepeatPassword] = React.useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign up</Text>
            
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
            <View style={styles.separator} />
            <AccountButton title="Sign Up" onPress={() => {router.navigate("./confirmSignup")}}/>
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
