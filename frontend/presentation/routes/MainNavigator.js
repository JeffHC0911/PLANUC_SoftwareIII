import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CheckAvailabilityScreen from '../screens/checkAvailability/CheckAvailabilityScreen';
import RegisterScheduleScreen from '../screens/registerSchedule/RegisterScheduleScreen';


const Drawer = createDrawerNavigator();

const MainNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Inicio' }}
    />
    <Drawer.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'Perfil' }}
    />
    <Drawer.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ title: 'Registro' }}
    />
    <Drawer.Screen
      name="CheckAvailability"
      component={CheckAvailabilityScreen}
      options={{ title: 'Disponibilidad Compañeros' }}
    />
    <Drawer.Screen
      name="RegisterSchedule"
      component={RegisterScheduleScreen}
      options={{ title: 'Registrar Materia' }}
    />
  </Drawer.Navigator>
);

export default MainNavigator;
