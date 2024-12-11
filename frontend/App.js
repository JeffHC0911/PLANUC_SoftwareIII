import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './presentation/routes/MainNavigator';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Tiempo que se mostrará el logo
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 segundos
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default App;