import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CheckAvailabilityScreen from '../screens/checkAvailability/CheckAvailabilityScreen';
import RegisterScheduleScreen from '../screens/registerSchedule/RegisterScheduleScreen';

import  LoginScreen  from '../screens/auth/LoginScreen'



const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => (
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

const AuthNavigator = ({ setIsAuthenticated }) => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Registro' }}
    />
    <Stack.Screen
      name="Login"
      options={{ headerShown: false }}
    >
      {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const MainNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        <DrawerNavigator />
      ) : (
        <AuthNavigator setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};


export default MainNavigator;
