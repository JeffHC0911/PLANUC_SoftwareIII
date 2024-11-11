import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './presentation/screens/auth/RegisterScreen';
// Importa otras pantallas como HomeScreen si tienes una

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Registro' }}
        />
        {/* Agrega otras pantallas aquí, por ejemplo: */}
        {/* 
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }}
        /> 
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
