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
import { Ionicons } from '@expo/vector-icons';
const colors = Colors.light;


export default function LoginScreen() {
  const router = useRouter();
  const { onLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const login = async () => {
    console.log("Logging in")
    setIsLoading(true)
    const result = await onLogin!(email, password);
    if (result && result.error) {
      alert("Incorrect email or password");
    } else {
      router.replace("/(tabs)")
    }
    setIsLoading(false)
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Image
        style={{ width: 200, height: 200, alignSelf: 'center', opacity: 0.8, marginTop: 20, marginBottom: 30 }}
        source={{
          uri: "https://i.imgur.com/qc0GM7G.png"
        }}
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="E-mail"
      />
      <View style={styles.input}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          style={{maxWidth:200}}
          placeholder="Password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <Ionicons style={{alignSelf:"flex-end"}} name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} onPress={() => { setShowPassword(!showPassword) }} />
      </View>
      <Text style={styles.passwordRecoveryText} onPress={() => router.navigate("./recoverPassword")}>Forgot your password?</Text>


      <AccountButton title="Log In" onPress={() => { login() }} />

      {isLoading && (
        <LoadingIndicator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  passwordRecoveryText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 8 * 7
  },
  separator: {
    marginVertical: 30,
    width: '80%',
    marginTop: 230
  },
  input: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.6,
    margin: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between"
  },
});
