import { StyleSheet, Image } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import AccountButton from '@/components/AccountButton';

export default function InitialScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Travel App</Text>
            <Image 
            style={{width:200, height:200, alignSelf:'center', opacity:0.8, marginTop:20}}
            source={{
              uri:"https://i.imgur.com/qc0GM7G.png"}}
            />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <AccountButton title="Log In" onPress={() => router.navigate("user/login")}/>
            <AccountButton title="Sign Up" onPress={() => router.navigate("user/signup")}/>
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
