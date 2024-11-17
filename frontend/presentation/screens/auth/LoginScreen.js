import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from 'react-native';
import { BACKEND_URL } from '@env';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validar que el email y la contraseña no estén vacíos
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }
  
    try {
      // Realizar la solicitud POST al backend para autenticar
      const response = await fetch(`${BACKEND_URL}/api/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
      console.log(data);
      
  
      if (response.ok && data.ok) {
        // Login exitoso
        Alert.alert('Inicio de sesión exitoso', 'Bienvenido al sistema');
        
        // Guardar el token en el almacenamiento local o estado global
        // Puedes usar AsyncStorage o algún estado global como Redux o Context API
        // Ejemplo con AsyncStorage:
        //await AsyncStorage.setItem('userToken', data.token);
  
        // Actualizar el estado de autenticación
        setIsAuthenticated(true);
  
        // Navegar al Home
        navigation.navigate('DrawerNavigator', {
          screen: 'Home',
        });
      } else {
        // Error de login
        Alert.alert('Error', data.error || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      // Manejo de errores en la solicitud
      Alert.alert('Error', 'No se pudo conectar con el servidor. Intenta nuevamente.');
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
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
      <Pressable style={styles.btn} onPress={handleLogin}>
      <Text style={styles.txtBtn}>Ingresar</Text>
      </Pressable>
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Register')}
      >
        ¿No tienes una cuenta? Regístrate
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  registerText: {
    marginTop: 15,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  btn: {
    padding: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
  },
  txtBtn: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
