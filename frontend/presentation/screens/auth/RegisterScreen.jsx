import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RegisterForm from '../../components/auth/RegisterForm';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const handleRegister = async (userData) => {
    try {
      // Aquí iría el código de registro (simulado aquí)
      // await register(userData);
      navigation.navigate('Home'); // Navega al menú principal después de registrarse
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Registro Usuario</Text>
        <View>
          <Image 
            //source={require('../../../assets/default-avatar.png')}
          />
        </View>
        <RegisterForm onSubmit={handleRegister} /> {/* Pasa handleRegister a RegisterForm */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    color: '#fff',
    borderRadius: 10,
  },
});

export default RegisterScreen;
