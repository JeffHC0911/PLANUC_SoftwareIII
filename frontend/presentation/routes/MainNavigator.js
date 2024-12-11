import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CheckAvailabilityScreen from '../screens/checkAvailability/CheckAvailabilityScreen';
import RegisterScheduleScreen from '../screens/registerSchedule/RegisterScheduleScreen';
import RegisterStudyGroupScreen from '../screens/createGroupStudy/RegisterStudyGroupScreen';
import StudyGroupsScreen from '../screens/createGroupStudy/StudyGroupScreen';
import  LoginScreen  from '../screens/auth/LoginScreen'
import RegisterRecurringScheduleScreen from '../screens/registerSchedule/RegisterRecurringScheduleScreen';



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
      options={{ title: 'Registrar Evento' }}
    />
    <Drawer.Screen
      name="RegisterRecurringSchedule"
      component={RegisterRecurringScheduleScreen}
      options={{ title: 'Registrar Evento Recurrente' }}
    />
    <Drawer.Screen
      name="RegisterStudyGroup"
      component={RegisterStudyGroupScreen}
      options={{ title: 'Crea Grupo de Estudio' }}
    />
    <Drawer.Screen
      name="StudyGroupsScreen"
      component={StudyGroupsScreen}
      options={{ title: 'Ver grupos de estudio' }}
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
