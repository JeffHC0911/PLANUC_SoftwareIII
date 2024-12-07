import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const apiUrl = 'http://192.168.0.109:4000';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        Alert.alert('Inicio de sesión exitoso', 'Bienvenido al sistema');
        await AsyncStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigation.navigate('DrawerNavigator', { screen: 'Home' });
      } else {
        Alert.alert('Error', data.error || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor. Intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a PLANUC</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={({ pressed }) => [
          styles.btn,
          { backgroundColor: pressed ? '#0056b3' : '#007bff' },
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.txtBtn}>Ingresar</Text>
      </Pressable>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          ¿No tienes una cuenta?{' '}
          <Text style={styles.registerLink}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#eef2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  btn: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginTop: 10,
  },
  txtBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  registerText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
