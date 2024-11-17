import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import CustomInput from '../common/CustomInput';
import { useForm } from '../../../business/hooks';
import { useNavigation } from '@react-navigation/native';
import { BACKEND_URL } from '@env';

const RegisterForm = ({ onSubmit }) => {
  const navigation = useNavigation(); // Instancia de navegación
  // Usamos el hook de formulario y pasamos onSubmit
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      career: '',
      semester: '',
    },
    onSubmit // Esto se ejecutará cuando se llame a handleSubmit
  );

  const handleRegister = async (formData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Enviar los datos al backend
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.', [
          {
            text: 'Aceptar',
            onPress: () => navigation.navigate('Login'), // Redirigir al Login
          },
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
        label="NOMBRE:"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
        placeholder="Ejemplo: Juan Pérez"
      />
      <CustomInput
        label="EMAIL"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        placeholder="Ejemplo: pepitoperez@gmail.com"
      />
      <CustomInput
        label="CONTRASEÑA"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
      />
      <CustomInput
        label="REPETIR CONTRASEÑA"
        value={values.repeatPassword}
        onChangeText={(text) => handleChange('repeatPassword', text)}
        error={errors.repeatPassword}
        secureTextEntry
      />
      <CustomInput
        label="CARRERA:"
        value={values.career}
        onChangeText={(text) => handleChange('career', text)}
        placeholder="Ejemplo: Geología"
      />

      {/* Botón de envío */}
      <View style={styles.btn}>
      <Button title="Crear Cuenta" onPress={() => handleRegister(values)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: '#fff',
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#007bff',
  },
});

export default RegisterForm;
