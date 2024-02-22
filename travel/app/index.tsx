import { Button, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link, useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Travel App</Text>
            <Image 
            style={{width:220, height:220, alignSelf:'center', borderRadius:100, opacity:0.8}}
            source={{
              uri:"https://i.imgur.com/0NBlZQC.png"}}
            />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <AccountButton title="Login" onPress={() => router.replace("/(tabs)")}/>
            <AccountButton title="Register" onPress={() => router.replace("/(tabs)")}/>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    marginTop:280
  },
});
