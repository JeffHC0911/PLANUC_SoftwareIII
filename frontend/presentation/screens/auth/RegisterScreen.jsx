import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterScreen = () => {
  const handleRegister = async (userData) => {
    try {
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <RegisterForm onSubmit={handleRegister} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default RegisterScreen;
