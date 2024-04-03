import 'react-native-gesture-handler'

import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const colors = Colors.light;

function CustomDrawerContent(props:any){
  const router = useRouter();
  const {onLogout} = useAuth();
  return (
    <View style={{flex:1, marginTop:-0}}>
      <DrawerContentScrollView {...props} scrollEnabled={false} style={{marginTop:-30}}>
        <View style={{backgroundColor:Colors.light.secondary, marginBottom:10}}>
          <Image 
            style={{width:120, height:120, alignSelf:'center', borderRadius:100, marginTop:40}}
            source={{
              uri:"https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"}}
          />
          <Text style={{
            alignSelf: 'center',
            fontWeight: '700',
            fontSize: 18,
            marginVertical: 10,
          }}>
            Name
          </Text>
        </View>
        <DrawerItemList {...props}></DrawerItemList>
        <DrawerItem 
          icon={({size, color}) => (
            <Ionicons name='exit-outline' size={size} color={color}/>
          )}
          label={"Logout"} 
          onPress={() => {
            onLogout!()
            router.replace("../..")
          }}/>
      </DrawerContentScrollView>
    </View>
  );
}

const DrawerLayout = () => { 
  return <GestureHandlerRootView style={{flex:1}}>
    <Drawer 
      drawerContent={CustomDrawerContent}
      screenOptions={{
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor:colors.background
      }}
      >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel:'Feed',
          headerTitle:'Feed',
          headerTintColor:"white",
          headerTitleAlign:"center",
          headerStyle:{backgroundColor:Colors.light.primary},
          drawerIcon: ({size, color}) => (
            <Ionicons name='newspaper-outline' size={size} color={color}/>
          )
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel:'Profile',
          headerTitle:'Profile',
          headerTintColor:"white",
          headerTitleAlign:"center",
          headerStyle:{backgroundColor:Colors.light.primary},
          drawerIcon: ({size, color}) => (
            <Ionicons name='person-outline' size={size} color={color}/>
          )
        }}
      />
      <Drawer.Screen
        name="information"
        options={{
          drawerLabel:'Info',
          headerTitle:'Info',
          headerTintColor:"white",
          headerTitleAlign:"center",
          headerStyle:{backgroundColor:Colors.light.primary},
          drawerIcon: ({size, color}) => (
            <Ionicons name='information-circle-outline' size={size} color={color}/>
          )
        }}
      />
    </Drawer>
  </GestureHandlerRootView>
};

export default DrawerLayout;