import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import CustomInput from '../common/CustomInput';
import { useForm } from '../../../business/hooks';
import { useNavigation } from '@react-navigation/native';

const RegisterForm = ({ onSubmit }) => {
  const apiUrl = 'http://192.168.0.109:4000';
  const navigation = useNavigation();
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      career: '',
    },
    onSubmit
  );

  const handleRegister = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.', [
          { text: 'Aceptar', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Hubo un problema al registrar tu cuenta.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor. Intenta nuevamente.');
    }
  };

  return (
    <View style={styles.form}>
      <CustomInput
        label="Nombre:"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
        placeholder="Ejemplo: Juan Pérez"
      />
      <CustomInput
        label="Email:"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        placeholder="Ejemplo: usuario@ucaldas.edu.co"
      />
      <CustomInput
        label="Contraseña:"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
        placeholder="Tu contraseña"
      />
      <CustomInput
        label="Repetir Contraseña:"
        value={values.repeatPassword}
        onChangeText={(text) => handleChange('repeatPassword', text)}
        error={errors.repeatPassword}
        secureTextEntry
        placeholder="Vuelve a escribir tu contraseña"
      />
      <CustomInput
        label="Carrera:"
        value={values.career}
        onChangeText={(text) => handleChange('career', text)}
        placeholder="Ejemplo: Ingeniería de Sistemas"
      />
      <TouchableOpacity style={styles.btn} onPress={() => handleRegister(values)}>
        <Text style={styles.btnText}>Crear Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterForm;
