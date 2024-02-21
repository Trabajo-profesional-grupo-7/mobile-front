import 'react-native-gesture-handler'

import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const DrawerLayout = () => { 
  return <GestureHandlerRootView style={{flex:1}}>
    <Drawer>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel:'Home',
          headerTitle:'Home',
          drawerIcon: ({size, color}) => (
            <Ionicons name='home-outline' size={size} color={color}/>
          )
        }}
      />
    </Drawer>
  </GestureHandlerRootView>
};

export default DrawerLayout;